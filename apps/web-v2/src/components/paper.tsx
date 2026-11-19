import type { BookingStatus, BusinessVertical } from '@walkin/shared';
import { Brush, Printer, Ruler, Scissors, WashingMachine, type LucideIcon } from 'lucide-react';
import { useId, type CSSProperties, type ReactNode } from 'react';
import { STATUS, VERTICALS, type Highlight } from '@/lib/vocab';

/** A pushpin holding a sheet to the board. */
export function Pin({ x = '50%', color = 'var(--pin)' }: { x?: string; color?: string }) {
  const shade = `pin-shade-${useId().replace(/:/g, '')}`;
  return (
    <svg className="pin" viewBox="0 0 20 20" style={{ '--pin-x': x } as CSSProperties} aria-hidden="true">
      <circle cx="10" cy="10" r="8" fill={color} />
      <circle cx="10" cy="10" r="8" fill={`url(#${shade})`} />
      <ellipse cx="7.4" cy="6.8" rx="2.6" ry="1.8" fill="#fff" opacity="0.55" />
      <defs>
        <radialGradient id={shade} cx="0.35" cy="0.3" r="0.8">
          <stop offset="0.5" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.35" />
        </radialGradient>
      </defs>
    </svg>
  );
}

export function Highlight({
  children,
  color = 'yellow',
  swipe = false,
  as: Tag = 'span',
  className = '',
}: {
  children: ReactNode;
  color?: Highlight;
  swipe?: boolean;
  as?: 'span' | 'strong' | 'em';
  className?: string;
}) {
  return (
    <Tag className={`hl c-${color} ${swipe ? 'hl--swipe' : ''} ${className}`}>
      <span className="hl__stroke" aria-hidden="true" />
      {children}
    </Tag>
  );
}

/** The stroke alone, for placing inside a positioned control. */
export function Stroke({ color = 'yellow', swipe = true }: { color?: Highlight; swipe?: boolean }) {
  return <span className={`hl__stroke c-${color} ${swipe ? 'hl--swipe-self' : ''}`} aria-hidden="true" />;
}

export function Stamp({
  status,
  size,
  thud = false,
  tilt,
  note,
}: {
  status: BookingStatus;
  size?: 'sm' | 'lg';
  thud?: boolean;
  tilt?: number;
  note?: string;
}) {
  const meta = STATUS[status];
  return (
    <span
      className={`stamp stamp--${meta.ink} ${size ? `stamp--${size}` : ''} ${thud ? 'stamp--thud' : ''}`}
      style={tilt === undefined ? undefined : ({ '--stamp-tilt': `${tilt}deg` } as CSSProperties)}
      role="img"
      aria-label={`Status: ${meta.plain}`}
    >
      {meta.stamp}
      {note ? <small>{note}</small> : null}
    </span>
  );
}

export const VERTICAL_ICONS: Record<BusinessVertical, LucideIcon> = {
  barbershop: Scissors,
  salon: Brush,
  laundry: WashingMachine,
  printing: Printer,
  general: Ruler,
};

export function VerticalTag({ vertical }: { vertical: BusinessVertical }) {
  const meta = VERTICALS[vertical];
  const Icon = VERTICAL_ICONS[vertical];
  return (
    <span className={`tag c-${meta.highlight}`}>
      <Icon aria-hidden="true" />
      {meta.label}
    </span>
  );
}
