import { z } from 'zod';
import * as schemas from './schemas.js';

export * from './schemas.js';

export type ConfirmationMode = z.infer<typeof schemas.confirmationModeSchema>;
export type BusinessVertical = z.infer<typeof schemas.businessVerticalSchema>;
export type ServiceType = z.infer<typeof schemas.serviceTypeSchema>;
export type BookingStatus = z.infer<typeof schemas.bookingStatusSchema>;
export type ProviderStatus = z.infer<typeof schemas.providerStatusSchema>;
export type StaffRole = z.infer<typeof schemas.staffRoleSchema>;
export type BookingSource = z.infer<typeof schemas.bookingSourceSchema>;
export type CapacityScope = z.infer<typeof schemas.capacityScopeSchema>;
export type Platform = z.infer<typeof schemas.platformSchema>;
export type FunctionErrorCode = z.infer<typeof schemas.errorCodeSchema>;

export type Money = z.infer<typeof schemas.moneySchema>;
export type PriceSnapshot = z.infer<typeof schemas.priceSnapshotSchema>;
export type Address = z.infer<typeof schemas.addressSchema>;
export type BookingPolicy = z.infer<typeof schemas.bookingPolicySchema>;

export type PrintColorMode = z.infer<typeof schemas.printColorModeSchema>;
export type PrintPaperSize = z.infer<typeof schemas.printPaperSizeSchema>;
export type PrintFinish = z.infer<typeof schemas.printFinishSchema>;
export type PrintJobSpecs = z.infer<typeof schemas.printJobSpecsSchema>;
export type LaundryServiceCategory = z.infer<typeof schemas.laundryServiceCategorySchema>;
export type LaundryJobSpecs = z.infer<typeof schemas.laundryJobSpecsSchema>;
export type BookingVerticalData = z.infer<typeof schemas.bookingVerticalDataSchema>;

export type ProviderSummaryView = z.infer<typeof schemas.providerSummaryViewSchema>;
export type ProviderConfigView = z.infer<typeof schemas.providerConfigViewSchema>;
export type ServiceView = z.infer<typeof schemas.serviceViewSchema>;
export type ServiceConfigView = z.infer<typeof schemas.serviceConfigViewSchema>;
export type StaffView = z.infer<typeof schemas.staffViewSchema>;
export type StaffConfigView = z.infer<typeof schemas.staffConfigViewSchema>;
export type AvailabilityRuleView = z.infer<typeof schemas.availabilityRuleViewSchema>;
export type SlotView = z.infer<typeof schemas.slotViewSchema>;
export type BookingView = z.infer<typeof schemas.bookingViewSchema>;

export type GetAvailabilityRequest = z.infer<typeof schemas.getAvailabilityRequestSchema>;
export type GetAvailabilityResponse = z.infer<typeof schemas.getAvailabilityResponseSchema>;
export type CreateBookingRequest = z.infer<typeof schemas.createBookingRequestSchema>;
export type CreateBookingResponse = z.infer<typeof schemas.createBookingResponseSchema>;
export type CancelBookingRequest = z.infer<typeof schemas.cancelBookingRequestSchema>;
export type CancelBookingResponse = z.infer<typeof schemas.cancelBookingResponseSchema>;
export type RescheduleBookingRequest = z.infer<typeof schemas.rescheduleBookingRequestSchema>;
export type RescheduleBookingResponse = z.infer<typeof schemas.rescheduleBookingResponseSchema>;
export type RespondToBookingRequest = z.infer<typeof schemas.respondToBookingRequestSchema>;
export type RespondToBookingResponse = z.infer<typeof schemas.respondToBookingResponseSchema>;
export type SaveProviderRequest = z.infer<typeof schemas.saveProviderRequestSchema>;
export type SaveServiceRequest = z.infer<typeof schemas.saveServiceRequestSchema>;
export type SaveStaffRequest = z.infer<typeof schemas.saveStaffRequestSchema>;
export type SaveAvailabilityRequest = z.infer<typeof schemas.saveAvailabilityRequestSchema>;
export type SavedEntityResponse = z.infer<typeof schemas.savedEntityResponseSchema>;
export type ListPublishedProvidersResponse = z.infer<typeof schemas.listPublishedProvidersResponseSchema>;
export type GetProviderDetailsRequest = z.infer<typeof schemas.getProviderDetailsRequestSchema>;
export type GetProviderDetailsResponse = z.infer<typeof schemas.getProviderDetailsResponseSchema>;
export type GetProviderDashboardRequest = z.infer<typeof schemas.getProviderDashboardRequestSchema>;
export type GetProviderDashboardResponse = z.infer<typeof schemas.getProviderDashboardResponseSchema>;
export type ListProviderBookingsRequest = z.infer<typeof schemas.listProviderBookingsRequestSchema>;
export type ListProviderBookingsResponse = z.infer<typeof schemas.listProviderBookingsResponseSchema>;
export type DeleteAvailabilityRuleRequest = z.infer<typeof schemas.deleteAvailabilityRuleRequestSchema>;
export type GetMyBookingsResponse = z.infer<typeof schemas.getMyBookingsResponseSchema>;
export type RegisterFcmTokenRequest = z.infer<typeof schemas.registerFcmTokenRequestSchema>;
export type RemoveFcmTokenRequest = z.infer<typeof schemas.removeFcmTokenRequestSchema>;
