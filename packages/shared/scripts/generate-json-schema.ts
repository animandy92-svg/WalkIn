import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { zodToJsonSchema } from 'zod-to-json-schema';
import * as schemas from '../src/schemas.js';

const currentDir = dirname(fileURLToPath(import.meta.url));
const outputPath = resolve(currentDir, '../schema/walkin.schema.json');

const registry: Record<string, unknown> = {
  BookingView: schemas.bookingViewSchema,
  PrintJobSpecs: schemas.printJobSpecsSchema,
  LaundryJobSpecs: schemas.laundryJobSpecsSchema,
  BookingVerticalData: schemas.bookingVerticalDataSchema,
  ProviderConfigView: schemas.providerConfigViewSchema,
  ServiceConfigView: schemas.serviceConfigViewSchema,
  StaffConfigView: schemas.staffConfigViewSchema,
  AvailabilityRuleView: schemas.availabilityRuleViewSchema,
  SlotView: schemas.slotViewSchema,
  GetAvailabilityRequest: schemas.getAvailabilityRequestSchema,
  GetAvailabilityResponse: schemas.getAvailabilityResponseSchema,
  CreateBookingRequest: schemas.createBookingRequestSchema,
  CreateBookingResponse: schemas.createBookingResponseSchema,
  CancelBookingRequest: schemas.cancelBookingRequestSchema,
  CancelBookingResponse: schemas.cancelBookingResponseSchema,
  RescheduleBookingRequest: schemas.rescheduleBookingRequestSchema,
  RescheduleBookingResponse: schemas.rescheduleBookingResponseSchema,
  RespondToBookingRequest: schemas.respondToBookingRequestSchema,
  RespondToBookingResponse: schemas.respondToBookingResponseSchema,
  SaveProviderRequest: schemas.saveProviderRequestSchema,
  SaveServiceRequest: schemas.saveServiceRequestSchema,
  SaveStaffRequest: schemas.saveStaffRequestSchema,
  SaveAvailabilityRequest: schemas.saveAvailabilityRequestSchema,
  SavedEntityResponse: schemas.savedEntityResponseSchema,
  ListPublishedProvidersResponse: schemas.listPublishedProvidersResponseSchema,
  GetProviderDetailsRequest: schemas.getProviderDetailsRequestSchema,
  GetProviderDetailsResponse: schemas.getProviderDetailsResponseSchema,
  GetProviderDashboardRequest: schemas.getProviderDashboardRequestSchema,
  GetProviderDashboardResponse: schemas.getProviderDashboardResponseSchema,
  ListProviderBookingsRequest: schemas.listProviderBookingsRequestSchema,
  ListProviderBookingsResponse: schemas.listProviderBookingsResponseSchema,
  DeleteAvailabilityRuleRequest: schemas.deleteAvailabilityRuleRequestSchema,
  GetMyBookingsResponse: schemas.getMyBookingsResponseSchema,
  RegisterFcmTokenRequest: schemas.registerFcmTokenRequestSchema,
  RemoveFcmTokenRequest: schemas.removeFcmTokenRequestSchema,
};

const definitions: Record<string, unknown> = {};
for (const [name, schema] of Object.entries(registry)) {
  const generated = zodToJsonSchema(schema as never, {
    name,
    target: 'jsonSchema7',
  }) as { definitions?: Record<string, unknown> };
  const definition = generated.definitions?.[name];
  if (!definition) {
    throw new Error(`Failed to generate JSON Schema for ${name}`);
  }
  definitions[name] = definition;
}

const document = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  title: 'WalkIn callable API',
  description: 'Contract shared by the Next.js website, Flutter app, and Cloud Functions. Source: packages/shared/src/schemas.ts',
  definitions,
};

mkdirSync(dirname(outputPath), { recursive: true });
writeFileSync(outputPath, `${JSON.stringify(document, null, 2)}\n`, 'utf8');
console.log(`Wrote ${outputPath}`);
