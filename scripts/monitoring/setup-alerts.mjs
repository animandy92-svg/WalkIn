import { execFileSync } from 'node:child_process';

const projectId = process.env.FIREBASE_PROJECT_ID ?? 'walkin-123';
const alertEmail = process.env.ALERT_EMAIL;
const channelName = process.env.MONITORING_NOTIFICATION_CHANNEL;

function gcloud(args, { allowFailure = false, capture = false } = {}) {
  try {
    return execFileSync('gcloud', [...args, `--project=${projectId}`], {
      encoding: capture ? 'utf8' : undefined,
      stdio: capture ? ['ignore', 'pipe', 'pipe'] : 'inherit',
    });
  } catch (error) {
    if (allowFailure) return undefined;
    throw error;
  }
}

function describe(args) {
  return gcloud(args, { allowFailure: true, capture: true });
}

function ensureLogMetric(metric, description, logFilter) {
  if (describe(['logging', 'metrics', 'describe', metric, '--format=value(name)'])) {
    console.log(`Log metric ${metric} already exists; skipping.`);
    return;
  }

  gcloud([
    'logging',
    'metrics',
    'create',
    metric,
    `--description=${description}`,
    `--log-filter=${logFilter}`,
    '--quiet',
  ]);
}

function ensureEmailChannel() {
  if (channelName) return channelName;
  if (!alertEmail) {
    console.log('Set ALERT_EMAIL or MONITORING_NOTIFICATION_CHANNEL to create alert policies.');
    return undefined;
  }

  const displayName = 'WalkIn Ops Email';
  const existing = describe([
    'alpha',
    'monitoring',
    'channels',
    'list',
    `--filter=displayName="${displayName}"`,
    '--format=value(name)',
  ])?.trim();

  if (existing) {
    console.log(`Notification channel ${existing} already exists; skipping.`);
    return existing;
  }

  return gcloud([
    'alpha',
    'monitoring',
    'channels',
    'create',
    `--display-name=${displayName}`,
    '--description=WalkIn operational alerts',
    '--type=email',
    `--channel-labels=email_address=${alertEmail}`,
    '--format=value(name)',
    '--quiet',
  ], { capture: true }).trim();
}

function ensureAlertPolicy(displayName, metric, channel) {
  const existing = describe([
    'monitoring',
    'policies',
    'list',
    `--filter=displayName="${displayName}"`,
    '--format=value(name)',
  ])?.trim();

  if (existing) {
    console.log(`Alert policy ${displayName} already exists; skipping.`);
    return;
  }

  gcloud([
    'monitoring',
    'policies',
    'create',
    `--notification-channels=${channel}`,
    `--policy=${JSON.stringify({
      displayName,
      conditions: [
        {
          displayName: `${displayName} condition`,
          conditionThreshold: {
            filter: `metric.type="logging.googleapis.com/user/${metric}"`,
            comparison: 'COMPARISON_GT',
            thresholdValue: 0,
            duration: '0s',
            aggregations: [
              {
                alignmentPeriod: '300s',
                perSeriesAligner: 'ALIGN_RATE',
              },
            ],
          },
        },
      ],
      combiner: 'OR',
      enabled: true,
    })}`,
    '--quiet',
  ]);
}

function main() {
  ensureLogMetric(
    'walkin_fcm_send_failure',
    'WalkIn push notification delivery failures',
    'textPayload:"Unable to send push notification" OR jsonPayload.message:"Unable to send push notification"',
  );
  ensureLogMetric(
    'walkin_callable_error',
    'WalkIn unhandled callable errors',
    'textPayload:"Unhandled callable error" OR jsonPayload.message:"Unhandled callable error"',
  );
  ensureLogMetric(
    'walkin_scheduled_job_error',
    'WalkIn scheduled job errors',
    [
      'textPayload:"Failed to expire booking"',
      'textPayload:"Failed to send"',
      'textPayload:"Failed to claim reminders"',
      'jsonPayload.message:"Failed to expire booking"',
      'jsonPayload.message:"Failed to send"',
      'jsonPayload.message:"Failed to claim reminders"',
    ].join(' OR '),
  );

  const channel = ensureEmailChannel();
  if (!channel) return;

  const policies = [
    ['WalkIn FCM send failures', 'walkin_fcm_send_failure'],
    ['WalkIn callable errors', 'walkin_callable_error'],
    ['WalkIn scheduled job errors', 'walkin_scheduled_job_error'],
  ];

  for (const [displayName, metric] of policies) {
    ensureAlertPolicy(displayName, metric, channel);
  }

  console.log(`Monitoring configured for ${projectId}.`);
  console.log(`Alerts notify ${channel}.`);
}

main();
