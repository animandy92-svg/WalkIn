// GENERATED FILE — do not edit by hand.
// Run `npm run schema:generate` from the repository root.
// ignore_for_file: unnecessary_cast, prefer_const_constructors, constant_identifier_names

enum BookingViewStatus {
  pending('pending'),
  confirmed('confirmed'),
  in_progress('in_progress'),
  ready_for_pickup('ready_for_pickup'),
  rejected('rejected'),
  expired('expired'),
  cancelled('cancelled'),
  completed('completed');

  final String value;
  const BookingViewStatus(this.value);

  static BookingViewStatus fromJson(String value) =>
      BookingViewStatus.values.firstWhere((item) => item.value == value);
}

enum BookingViewConfirmationMode {
  instant('instant'),
  approval('approval');

  final String value;
  const BookingViewConfirmationMode(this.value);

  static BookingViewConfirmationMode fromJson(String value) =>
      BookingViewConfirmationMode.values.firstWhere((item) => item.value == value);
}

enum BookingViewSource {
  web('web'),
  mobile('mobile');

  final String value;
  const BookingViewSource(this.value);

  static BookingViewSource fromJson(String value) =>
      BookingViewSource.values.firstWhere((item) => item.value == value);
}

enum PrintJobSpecsColorMode {
  black_and_white('black_and_white'),
  color('color');

  final String value;
  const PrintJobSpecsColorMode(this.value);

  static PrintJobSpecsColorMode fromJson(String value) =>
      PrintJobSpecsColorMode.values.firstWhere((item) => item.value == value);
}

enum PrintJobSpecsPaperSize {
  A4('A4'),
  A3('A3'),
  Letter('Letter'),
  Legal('Legal');

  final String value;
  const PrintJobSpecsPaperSize(this.value);

  static PrintJobSpecsPaperSize fromJson(String value) =>
      PrintJobSpecsPaperSize.values.firstWhere((item) => item.value == value);
}

enum PrintJobSpecsFinish {
  none('none'),
  stapled('stapled'),
  spiral_bound('spiral_bound'),
  laminated('laminated');

  final String value;
  const PrintJobSpecsFinish(this.value);

  static PrintJobSpecsFinish fromJson(String value) =>
      PrintJobSpecsFinish.values.firstWhere((item) => item.value == value);
}

enum LaundryJobSpecsServiceCategory {
  wash_and_fold('wash_and_fold'),
  dry_cleaning('dry_cleaning'),
  ironing_only('ironing_only');

  final String value;
  const LaundryJobSpecsServiceCategory(this.value);

  static LaundryJobSpecsServiceCategory fromJson(String value) =>
      LaundryJobSpecsServiceCategory.values.firstWhere((item) => item.value == value);
}

enum ProviderConfigViewStatus {
  draft('draft'),
  published('published');

  final String value;
  const ProviderConfigViewStatus(this.value);

  static ProviderConfigViewStatus fromJson(String value) =>
      ProviderConfigViewStatus.values.firstWhere((item) => item.value == value);
}

enum ProviderConfigViewVertical {
  barbershop('barbershop'),
  salon('salon'),
  laundry('laundry'),
  printing('printing'),
  general('general');

  final String value;
  const ProviderConfigViewVertical(this.value);

  static ProviderConfigViewVertical fromJson(String value) =>
      ProviderConfigViewVertical.values.firstWhere((item) => item.value == value);
}

enum ServiceConfigViewConfirmationMode {
  instant('instant'),
  approval('approval');

  final String value;
  const ServiceConfigViewConfirmationMode(this.value);

  static ServiceConfigViewConfirmationMode fromJson(String value) =>
      ServiceConfigViewConfirmationMode.values.firstWhere((item) => item.value == value);
}

enum ServiceConfigViewCapacityScope {
  staff('staff'),
  provider('provider');

  final String value;
  const ServiceConfigViewCapacityScope(this.value);

  static ServiceConfigViewCapacityScope fromJson(String value) =>
      ServiceConfigViewCapacityScope.values.firstWhere((item) => item.value == value);
}

enum ServiceConfigViewServiceType {
  appointment('appointment'),
  drop_off('drop_off'),
  print_job('print_job'),
  queue_ticket('queue_ticket');

  final String value;
  const ServiceConfigViewServiceType(this.value);

  static ServiceConfigViewServiceType fromJson(String value) =>
      ServiceConfigViewServiceType.values.firstWhere((item) => item.value == value);
}

enum AvailabilityRuleViewKind {
  weekly('weekly'),
  exception('exception');

  final String value;
  const AvailabilityRuleViewKind(this.value);

  static AvailabilityRuleViewKind fromJson(String value) =>
      AvailabilityRuleViewKind.values.firstWhere((item) => item.value == value);
}

enum CreateBookingRequestSource {
  web('web'),
  mobile('mobile');

  final String value;
  const CreateBookingRequestSource(this.value);

  static CreateBookingRequestSource fromJson(String value) =>
      CreateBookingRequestSource.values.firstWhere((item) => item.value == value);
}

enum RespondToBookingRequestAction {
  confirm('confirm'),
  reject('reject');

  final String value;
  const RespondToBookingRequestAction(this.value);

  static RespondToBookingRequestAction fromJson(String value) =>
      RespondToBookingRequestAction.values.firstWhere((item) => item.value == value);
}

enum SaveProviderRequestStatus {
  draft('draft'),
  published('published');

  final String value;
  const SaveProviderRequestStatus(this.value);

  static SaveProviderRequestStatus fromJson(String value) =>
      SaveProviderRequestStatus.values.firstWhere((item) => item.value == value);
}

enum SaveProviderRequestVertical {
  barbershop('barbershop'),
  salon('salon'),
  laundry('laundry'),
  printing('printing'),
  general('general');

  final String value;
  const SaveProviderRequestVertical(this.value);

  static SaveProviderRequestVertical fromJson(String value) =>
      SaveProviderRequestVertical.values.firstWhere((item) => item.value == value);
}

enum SaveServiceRequestConfirmationMode {
  instant('instant'),
  approval('approval');

  final String value;
  const SaveServiceRequestConfirmationMode(this.value);

  static SaveServiceRequestConfirmationMode fromJson(String value) =>
      SaveServiceRequestConfirmationMode.values.firstWhere((item) => item.value == value);
}

enum SaveServiceRequestCapacityScope {
  staff('staff'),
  provider('provider');

  final String value;
  const SaveServiceRequestCapacityScope(this.value);

  static SaveServiceRequestCapacityScope fromJson(String value) =>
      SaveServiceRequestCapacityScope.values.firstWhere((item) => item.value == value);
}

enum SaveServiceRequestServiceType {
  appointment('appointment'),
  drop_off('drop_off'),
  print_job('print_job'),
  queue_ticket('queue_ticket');

  final String value;
  const SaveServiceRequestServiceType(this.value);

  static SaveServiceRequestServiceType fromJson(String value) =>
      SaveServiceRequestServiceType.values.firstWhere((item) => item.value == value);
}

enum SaveAvailabilityRequestKind {
  weekly('weekly'),
  exception('exception');

  final String value;
  const SaveAvailabilityRequestKind(this.value);

  static SaveAvailabilityRequestKind fromJson(String value) =>
      SaveAvailabilityRequestKind.values.firstWhere((item) => item.value == value);
}

enum RegisterFcmTokenRequestPlatform {
  web('web'),
  ios('ios'),
  android('android');

  final String value;
  const RegisterFcmTokenRequestPlatform(this.value);

  static RegisterFcmTokenRequestPlatform fromJson(String value) =>
      RegisterFcmTokenRequestPlatform.values.firstWhere((item) => item.value == value);
}

enum BookingVerticalDataPrintJobColorMode {
  black_and_white('black_and_white'),
  color('color');

  final String value;
  const BookingVerticalDataPrintJobColorMode(this.value);

  static BookingVerticalDataPrintJobColorMode fromJson(String value) =>
      BookingVerticalDataPrintJobColorMode.values.firstWhere((item) => item.value == value);
}

enum BookingVerticalDataPrintJobPaperSize {
  A4('A4'),
  A3('A3'),
  Letter('Letter'),
  Legal('Legal');

  final String value;
  const BookingVerticalDataPrintJobPaperSize(this.value);

  static BookingVerticalDataPrintJobPaperSize fromJson(String value) =>
      BookingVerticalDataPrintJobPaperSize.values.firstWhere((item) => item.value == value);
}

enum BookingVerticalDataPrintJobFinish {
  none('none'),
  stapled('stapled'),
  spiral_bound('spiral_bound'),
  laminated('laminated');

  final String value;
  const BookingVerticalDataPrintJobFinish(this.value);

  static BookingVerticalDataPrintJobFinish fromJson(String value) =>
      BookingVerticalDataPrintJobFinish.values.firstWhere((item) => item.value == value);
}

enum BookingVerticalDataLaundryJobServiceCategory {
  wash_and_fold('wash_and_fold'),
  dry_cleaning('dry_cleaning'),
  ironing_only('ironing_only');

  final String value;
  const BookingVerticalDataLaundryJobServiceCategory(this.value);

  static BookingVerticalDataLaundryJobServiceCategory fromJson(String value) =>
      BookingVerticalDataLaundryJobServiceCategory.values.firstWhere((item) => item.value == value);
}

enum CreateBookingResponseBookingStatus {
  pending('pending'),
  confirmed('confirmed'),
  in_progress('in_progress'),
  ready_for_pickup('ready_for_pickup'),
  rejected('rejected'),
  expired('expired'),
  cancelled('cancelled'),
  completed('completed');

  final String value;
  const CreateBookingResponseBookingStatus(this.value);

  static CreateBookingResponseBookingStatus fromJson(String value) =>
      CreateBookingResponseBookingStatus.values.firstWhere((item) => item.value == value);
}

enum CreateBookingResponseBookingConfirmationMode {
  instant('instant'),
  approval('approval');

  final String value;
  const CreateBookingResponseBookingConfirmationMode(this.value);

  static CreateBookingResponseBookingConfirmationMode fromJson(String value) =>
      CreateBookingResponseBookingConfirmationMode.values.firstWhere((item) => item.value == value);
}

enum CreateBookingResponseBookingSource {
  web('web'),
  mobile('mobile');

  final String value;
  const CreateBookingResponseBookingSource(this.value);

  static CreateBookingResponseBookingSource fromJson(String value) =>
      CreateBookingResponseBookingSource.values.firstWhere((item) => item.value == value);
}

enum CancelBookingResponseBookingStatus {
  pending('pending'),
  confirmed('confirmed'),
  in_progress('in_progress'),
  ready_for_pickup('ready_for_pickup'),
  rejected('rejected'),
  expired('expired'),
  cancelled('cancelled'),
  completed('completed');

  final String value;
  const CancelBookingResponseBookingStatus(this.value);

  static CancelBookingResponseBookingStatus fromJson(String value) =>
      CancelBookingResponseBookingStatus.values.firstWhere((item) => item.value == value);
}

enum CancelBookingResponseBookingConfirmationMode {
  instant('instant'),
  approval('approval');

  final String value;
  const CancelBookingResponseBookingConfirmationMode(this.value);

  static CancelBookingResponseBookingConfirmationMode fromJson(String value) =>
      CancelBookingResponseBookingConfirmationMode.values.firstWhere((item) => item.value == value);
}

enum CancelBookingResponseBookingSource {
  web('web'),
  mobile('mobile');

  final String value;
  const CancelBookingResponseBookingSource(this.value);

  static CancelBookingResponseBookingSource fromJson(String value) =>
      CancelBookingResponseBookingSource.values.firstWhere((item) => item.value == value);
}

enum RescheduleBookingResponseBookingStatus {
  pending('pending'),
  confirmed('confirmed'),
  in_progress('in_progress'),
  ready_for_pickup('ready_for_pickup'),
  rejected('rejected'),
  expired('expired'),
  cancelled('cancelled'),
  completed('completed');

  final String value;
  const RescheduleBookingResponseBookingStatus(this.value);

  static RescheduleBookingResponseBookingStatus fromJson(String value) =>
      RescheduleBookingResponseBookingStatus.values.firstWhere((item) => item.value == value);
}

enum RescheduleBookingResponseBookingConfirmationMode {
  instant('instant'),
  approval('approval');

  final String value;
  const RescheduleBookingResponseBookingConfirmationMode(this.value);

  static RescheduleBookingResponseBookingConfirmationMode fromJson(String value) =>
      RescheduleBookingResponseBookingConfirmationMode.values.firstWhere((item) => item.value == value);
}

enum RescheduleBookingResponseBookingSource {
  web('web'),
  mobile('mobile');

  final String value;
  const RescheduleBookingResponseBookingSource(this.value);

  static RescheduleBookingResponseBookingSource fromJson(String value) =>
      RescheduleBookingResponseBookingSource.values.firstWhere((item) => item.value == value);
}

enum RespondToBookingResponseBookingStatus {
  pending('pending'),
  confirmed('confirmed'),
  in_progress('in_progress'),
  ready_for_pickup('ready_for_pickup'),
  rejected('rejected'),
  expired('expired'),
  cancelled('cancelled'),
  completed('completed');

  final String value;
  const RespondToBookingResponseBookingStatus(this.value);

  static RespondToBookingResponseBookingStatus fromJson(String value) =>
      RespondToBookingResponseBookingStatus.values.firstWhere((item) => item.value == value);
}

enum RespondToBookingResponseBookingConfirmationMode {
  instant('instant'),
  approval('approval');

  final String value;
  const RespondToBookingResponseBookingConfirmationMode(this.value);

  static RespondToBookingResponseBookingConfirmationMode fromJson(String value) =>
      RespondToBookingResponseBookingConfirmationMode.values.firstWhere((item) => item.value == value);
}

enum RespondToBookingResponseBookingSource {
  web('web'),
  mobile('mobile');

  final String value;
  const RespondToBookingResponseBookingSource(this.value);

  static RespondToBookingResponseBookingSource fromJson(String value) =>
      RespondToBookingResponseBookingSource.values.firstWhere((item) => item.value == value);
}

enum ListPublishedProvidersResponseProvidersItemVertical {
  barbershop('barbershop'),
  salon('salon'),
  laundry('laundry'),
  printing('printing'),
  general('general');

  final String value;
  const ListPublishedProvidersResponseProvidersItemVertical(this.value);

  static ListPublishedProvidersResponseProvidersItemVertical fromJson(String value) =>
      ListPublishedProvidersResponseProvidersItemVertical.values.firstWhere((item) => item.value == value);
}

enum GetProviderDetailsResponseProviderVertical {
  barbershop('barbershop'),
  salon('salon'),
  laundry('laundry'),
  printing('printing'),
  general('general');

  final String value;
  const GetProviderDetailsResponseProviderVertical(this.value);

  static GetProviderDetailsResponseProviderVertical fromJson(String value) =>
      GetProviderDetailsResponseProviderVertical.values.firstWhere((item) => item.value == value);
}

enum GetProviderDetailsResponseServicesItemConfirmationMode {
  instant('instant'),
  approval('approval');

  final String value;
  const GetProviderDetailsResponseServicesItemConfirmationMode(this.value);

  static GetProviderDetailsResponseServicesItemConfirmationMode fromJson(String value) =>
      GetProviderDetailsResponseServicesItemConfirmationMode.values.firstWhere((item) => item.value == value);
}

enum GetProviderDetailsResponseServicesItemCapacityScope {
  staff('staff'),
  provider('provider');

  final String value;
  const GetProviderDetailsResponseServicesItemCapacityScope(this.value);

  static GetProviderDetailsResponseServicesItemCapacityScope fromJson(String value) =>
      GetProviderDetailsResponseServicesItemCapacityScope.values.firstWhere((item) => item.value == value);
}

enum GetProviderDetailsResponseServicesItemServiceType {
  appointment('appointment'),
  drop_off('drop_off'),
  print_job('print_job'),
  queue_ticket('queue_ticket');

  final String value;
  const GetProviderDetailsResponseServicesItemServiceType(this.value);

  static GetProviderDetailsResponseServicesItemServiceType fromJson(String value) =>
      GetProviderDetailsResponseServicesItemServiceType.values.firstWhere((item) => item.value == value);
}

enum GetProviderDashboardResponseProviderStatus {
  draft('draft'),
  published('published');

  final String value;
  const GetProviderDashboardResponseProviderStatus(this.value);

  static GetProviderDashboardResponseProviderStatus fromJson(String value) =>
      GetProviderDashboardResponseProviderStatus.values.firstWhere((item) => item.value == value);
}

enum GetProviderDashboardResponseProviderVertical {
  barbershop('barbershop'),
  salon('salon'),
  laundry('laundry'),
  printing('printing'),
  general('general');

  final String value;
  const GetProviderDashboardResponseProviderVertical(this.value);

  static GetProviderDashboardResponseProviderVertical fromJson(String value) =>
      GetProviderDashboardResponseProviderVertical.values.firstWhere((item) => item.value == value);
}

enum GetProviderDashboardResponseServicesItemConfirmationMode {
  instant('instant'),
  approval('approval');

  final String value;
  const GetProviderDashboardResponseServicesItemConfirmationMode(this.value);

  static GetProviderDashboardResponseServicesItemConfirmationMode fromJson(String value) =>
      GetProviderDashboardResponseServicesItemConfirmationMode.values.firstWhere((item) => item.value == value);
}

enum GetProviderDashboardResponseServicesItemCapacityScope {
  staff('staff'),
  provider('provider');

  final String value;
  const GetProviderDashboardResponseServicesItemCapacityScope(this.value);

  static GetProviderDashboardResponseServicesItemCapacityScope fromJson(String value) =>
      GetProviderDashboardResponseServicesItemCapacityScope.values.firstWhere((item) => item.value == value);
}

enum GetProviderDashboardResponseServicesItemServiceType {
  appointment('appointment'),
  drop_off('drop_off'),
  print_job('print_job'),
  queue_ticket('queue_ticket');

  final String value;
  const GetProviderDashboardResponseServicesItemServiceType(this.value);

  static GetProviderDashboardResponseServicesItemServiceType fromJson(String value) =>
      GetProviderDashboardResponseServicesItemServiceType.values.firstWhere((item) => item.value == value);
}

enum GetProviderDashboardResponseAvailabilityItemKind {
  weekly('weekly'),
  exception('exception');

  final String value;
  const GetProviderDashboardResponseAvailabilityItemKind(this.value);

  static GetProviderDashboardResponseAvailabilityItemKind fromJson(String value) =>
      GetProviderDashboardResponseAvailabilityItemKind.values.firstWhere((item) => item.value == value);
}

enum GetProviderDashboardResponseBookingsItemStatus {
  pending('pending'),
  confirmed('confirmed'),
  in_progress('in_progress'),
  ready_for_pickup('ready_for_pickup'),
  rejected('rejected'),
  expired('expired'),
  cancelled('cancelled'),
  completed('completed');

  final String value;
  const GetProviderDashboardResponseBookingsItemStatus(this.value);

  static GetProviderDashboardResponseBookingsItemStatus fromJson(String value) =>
      GetProviderDashboardResponseBookingsItemStatus.values.firstWhere((item) => item.value == value);
}

enum GetProviderDashboardResponseBookingsItemConfirmationMode {
  instant('instant'),
  approval('approval');

  final String value;
  const GetProviderDashboardResponseBookingsItemConfirmationMode(this.value);

  static GetProviderDashboardResponseBookingsItemConfirmationMode fromJson(String value) =>
      GetProviderDashboardResponseBookingsItemConfirmationMode.values.firstWhere((item) => item.value == value);
}

enum GetProviderDashboardResponseBookingsItemSource {
  web('web'),
  mobile('mobile');

  final String value;
  const GetProviderDashboardResponseBookingsItemSource(this.value);

  static GetProviderDashboardResponseBookingsItemSource fromJson(String value) =>
      GetProviderDashboardResponseBookingsItemSource.values.firstWhere((item) => item.value == value);
}

enum ListProviderBookingsResponseBookingsItemStatus {
  pending('pending'),
  confirmed('confirmed'),
  in_progress('in_progress'),
  ready_for_pickup('ready_for_pickup'),
  rejected('rejected'),
  expired('expired'),
  cancelled('cancelled'),
  completed('completed');

  final String value;
  const ListProviderBookingsResponseBookingsItemStatus(this.value);

  static ListProviderBookingsResponseBookingsItemStatus fromJson(String value) =>
      ListProviderBookingsResponseBookingsItemStatus.values.firstWhere((item) => item.value == value);
}

enum ListProviderBookingsResponseBookingsItemConfirmationMode {
  instant('instant'),
  approval('approval');

  final String value;
  const ListProviderBookingsResponseBookingsItemConfirmationMode(this.value);

  static ListProviderBookingsResponseBookingsItemConfirmationMode fromJson(String value) =>
      ListProviderBookingsResponseBookingsItemConfirmationMode.values.firstWhere((item) => item.value == value);
}

enum ListProviderBookingsResponseBookingsItemSource {
  web('web'),
  mobile('mobile');

  final String value;
  const ListProviderBookingsResponseBookingsItemSource(this.value);

  static ListProviderBookingsResponseBookingsItemSource fromJson(String value) =>
      ListProviderBookingsResponseBookingsItemSource.values.firstWhere((item) => item.value == value);
}

enum GetMyBookingsResponseBookingsItemStatus {
  pending('pending'),
  confirmed('confirmed'),
  in_progress('in_progress'),
  ready_for_pickup('ready_for_pickup'),
  rejected('rejected'),
  expired('expired'),
  cancelled('cancelled'),
  completed('completed');

  final String value;
  const GetMyBookingsResponseBookingsItemStatus(this.value);

  static GetMyBookingsResponseBookingsItemStatus fromJson(String value) =>
      GetMyBookingsResponseBookingsItemStatus.values.firstWhere((item) => item.value == value);
}

enum GetMyBookingsResponseBookingsItemConfirmationMode {
  instant('instant'),
  approval('approval');

  final String value;
  const GetMyBookingsResponseBookingsItemConfirmationMode(this.value);

  static GetMyBookingsResponseBookingsItemConfirmationMode fromJson(String value) =>
      GetMyBookingsResponseBookingsItemConfirmationMode.values.firstWhere((item) => item.value == value);
}

enum GetMyBookingsResponseBookingsItemSource {
  web('web'),
  mobile('mobile');

  final String value;
  const GetMyBookingsResponseBookingsItemSource(this.value);

  static GetMyBookingsResponseBookingsItemSource fromJson(String value) =>
      GetMyBookingsResponseBookingsItemSource.values.firstWhere((item) => item.value == value);
}

enum BookingViewVerticalDataPrintJobColorMode {
  black_and_white('black_and_white'),
  color('color');

  final String value;
  const BookingViewVerticalDataPrintJobColorMode(this.value);

  static BookingViewVerticalDataPrintJobColorMode fromJson(String value) =>
      BookingViewVerticalDataPrintJobColorMode.values.firstWhere((item) => item.value == value);
}

enum BookingViewVerticalDataPrintJobPaperSize {
  A4('A4'),
  A3('A3'),
  Letter('Letter'),
  Legal('Legal');

  final String value;
  const BookingViewVerticalDataPrintJobPaperSize(this.value);

  static BookingViewVerticalDataPrintJobPaperSize fromJson(String value) =>
      BookingViewVerticalDataPrintJobPaperSize.values.firstWhere((item) => item.value == value);
}

enum BookingViewVerticalDataPrintJobFinish {
  none('none'),
  stapled('stapled'),
  spiral_bound('spiral_bound'),
  laminated('laminated');

  final String value;
  const BookingViewVerticalDataPrintJobFinish(this.value);

  static BookingViewVerticalDataPrintJobFinish fromJson(String value) =>
      BookingViewVerticalDataPrintJobFinish.values.firstWhere((item) => item.value == value);
}

enum BookingViewVerticalDataLaundryJobServiceCategory {
  wash_and_fold('wash_and_fold'),
  dry_cleaning('dry_cleaning'),
  ironing_only('ironing_only');

  final String value;
  const BookingViewVerticalDataLaundryJobServiceCategory(this.value);

  static BookingViewVerticalDataLaundryJobServiceCategory fromJson(String value) =>
      BookingViewVerticalDataLaundryJobServiceCategory.values.firstWhere((item) => item.value == value);
}

enum CreateBookingRequestVerticalDataPrintJobColorMode {
  black_and_white('black_and_white'),
  color('color');

  final String value;
  const CreateBookingRequestVerticalDataPrintJobColorMode(this.value);

  static CreateBookingRequestVerticalDataPrintJobColorMode fromJson(String value) =>
      CreateBookingRequestVerticalDataPrintJobColorMode.values.firstWhere((item) => item.value == value);
}

enum CreateBookingRequestVerticalDataPrintJobPaperSize {
  A4('A4'),
  A3('A3'),
  Letter('Letter'),
  Legal('Legal');

  final String value;
  const CreateBookingRequestVerticalDataPrintJobPaperSize(this.value);

  static CreateBookingRequestVerticalDataPrintJobPaperSize fromJson(String value) =>
      CreateBookingRequestVerticalDataPrintJobPaperSize.values.firstWhere((item) => item.value == value);
}

enum CreateBookingRequestVerticalDataPrintJobFinish {
  none('none'),
  stapled('stapled'),
  spiral_bound('spiral_bound'),
  laminated('laminated');

  final String value;
  const CreateBookingRequestVerticalDataPrintJobFinish(this.value);

  static CreateBookingRequestVerticalDataPrintJobFinish fromJson(String value) =>
      CreateBookingRequestVerticalDataPrintJobFinish.values.firstWhere((item) => item.value == value);
}

enum CreateBookingRequestVerticalDataLaundryJobServiceCategory {
  wash_and_fold('wash_and_fold'),
  dry_cleaning('dry_cleaning'),
  ironing_only('ironing_only');

  final String value;
  const CreateBookingRequestVerticalDataLaundryJobServiceCategory(this.value);

  static CreateBookingRequestVerticalDataLaundryJobServiceCategory fromJson(String value) =>
      CreateBookingRequestVerticalDataLaundryJobServiceCategory.values.firstWhere((item) => item.value == value);
}

enum CreateBookingResponseBookingVerticalDataPrintJobColorMode {
  black_and_white('black_and_white'),
  color('color');

  final String value;
  const CreateBookingResponseBookingVerticalDataPrintJobColorMode(this.value);

  static CreateBookingResponseBookingVerticalDataPrintJobColorMode fromJson(String value) =>
      CreateBookingResponseBookingVerticalDataPrintJobColorMode.values.firstWhere((item) => item.value == value);
}

enum CreateBookingResponseBookingVerticalDataPrintJobPaperSize {
  A4('A4'),
  A3('A3'),
  Letter('Letter'),
  Legal('Legal');

  final String value;
  const CreateBookingResponseBookingVerticalDataPrintJobPaperSize(this.value);

  static CreateBookingResponseBookingVerticalDataPrintJobPaperSize fromJson(String value) =>
      CreateBookingResponseBookingVerticalDataPrintJobPaperSize.values.firstWhere((item) => item.value == value);
}

enum CreateBookingResponseBookingVerticalDataPrintJobFinish {
  none('none'),
  stapled('stapled'),
  spiral_bound('spiral_bound'),
  laminated('laminated');

  final String value;
  const CreateBookingResponseBookingVerticalDataPrintJobFinish(this.value);

  static CreateBookingResponseBookingVerticalDataPrintJobFinish fromJson(String value) =>
      CreateBookingResponseBookingVerticalDataPrintJobFinish.values.firstWhere((item) => item.value == value);
}

enum CreateBookingResponseBookingVerticalDataLaundryJobServiceCategory {
  wash_and_fold('wash_and_fold'),
  dry_cleaning('dry_cleaning'),
  ironing_only('ironing_only');

  final String value;
  const CreateBookingResponseBookingVerticalDataLaundryJobServiceCategory(this.value);

  static CreateBookingResponseBookingVerticalDataLaundryJobServiceCategory fromJson(String value) =>
      CreateBookingResponseBookingVerticalDataLaundryJobServiceCategory.values.firstWhere((item) => item.value == value);
}

enum CancelBookingResponseBookingVerticalDataPrintJobColorMode {
  black_and_white('black_and_white'),
  color('color');

  final String value;
  const CancelBookingResponseBookingVerticalDataPrintJobColorMode(this.value);

  static CancelBookingResponseBookingVerticalDataPrintJobColorMode fromJson(String value) =>
      CancelBookingResponseBookingVerticalDataPrintJobColorMode.values.firstWhere((item) => item.value == value);
}

enum CancelBookingResponseBookingVerticalDataPrintJobPaperSize {
  A4('A4'),
  A3('A3'),
  Letter('Letter'),
  Legal('Legal');

  final String value;
  const CancelBookingResponseBookingVerticalDataPrintJobPaperSize(this.value);

  static CancelBookingResponseBookingVerticalDataPrintJobPaperSize fromJson(String value) =>
      CancelBookingResponseBookingVerticalDataPrintJobPaperSize.values.firstWhere((item) => item.value == value);
}

enum CancelBookingResponseBookingVerticalDataPrintJobFinish {
  none('none'),
  stapled('stapled'),
  spiral_bound('spiral_bound'),
  laminated('laminated');

  final String value;
  const CancelBookingResponseBookingVerticalDataPrintJobFinish(this.value);

  static CancelBookingResponseBookingVerticalDataPrintJobFinish fromJson(String value) =>
      CancelBookingResponseBookingVerticalDataPrintJobFinish.values.firstWhere((item) => item.value == value);
}

enum CancelBookingResponseBookingVerticalDataLaundryJobServiceCategory {
  wash_and_fold('wash_and_fold'),
  dry_cleaning('dry_cleaning'),
  ironing_only('ironing_only');

  final String value;
  const CancelBookingResponseBookingVerticalDataLaundryJobServiceCategory(this.value);

  static CancelBookingResponseBookingVerticalDataLaundryJobServiceCategory fromJson(String value) =>
      CancelBookingResponseBookingVerticalDataLaundryJobServiceCategory.values.firstWhere((item) => item.value == value);
}

enum RescheduleBookingResponseBookingVerticalDataPrintJobColorMode {
  black_and_white('black_and_white'),
  color('color');

  final String value;
  const RescheduleBookingResponseBookingVerticalDataPrintJobColorMode(this.value);

  static RescheduleBookingResponseBookingVerticalDataPrintJobColorMode fromJson(String value) =>
      RescheduleBookingResponseBookingVerticalDataPrintJobColorMode.values.firstWhere((item) => item.value == value);
}

enum RescheduleBookingResponseBookingVerticalDataPrintJobPaperSize {
  A4('A4'),
  A3('A3'),
  Letter('Letter'),
  Legal('Legal');

  final String value;
  const RescheduleBookingResponseBookingVerticalDataPrintJobPaperSize(this.value);

  static RescheduleBookingResponseBookingVerticalDataPrintJobPaperSize fromJson(String value) =>
      RescheduleBookingResponseBookingVerticalDataPrintJobPaperSize.values.firstWhere((item) => item.value == value);
}

enum RescheduleBookingResponseBookingVerticalDataPrintJobFinish {
  none('none'),
  stapled('stapled'),
  spiral_bound('spiral_bound'),
  laminated('laminated');

  final String value;
  const RescheduleBookingResponseBookingVerticalDataPrintJobFinish(this.value);

  static RescheduleBookingResponseBookingVerticalDataPrintJobFinish fromJson(String value) =>
      RescheduleBookingResponseBookingVerticalDataPrintJobFinish.values.firstWhere((item) => item.value == value);
}

enum RescheduleBookingResponseBookingVerticalDataLaundryJobServiceCategory {
  wash_and_fold('wash_and_fold'),
  dry_cleaning('dry_cleaning'),
  ironing_only('ironing_only');

  final String value;
  const RescheduleBookingResponseBookingVerticalDataLaundryJobServiceCategory(this.value);

  static RescheduleBookingResponseBookingVerticalDataLaundryJobServiceCategory fromJson(String value) =>
      RescheduleBookingResponseBookingVerticalDataLaundryJobServiceCategory.values.firstWhere((item) => item.value == value);
}

enum RespondToBookingResponseBookingVerticalDataPrintJobColorMode {
  black_and_white('black_and_white'),
  color('color');

  final String value;
  const RespondToBookingResponseBookingVerticalDataPrintJobColorMode(this.value);

  static RespondToBookingResponseBookingVerticalDataPrintJobColorMode fromJson(String value) =>
      RespondToBookingResponseBookingVerticalDataPrintJobColorMode.values.firstWhere((item) => item.value == value);
}

enum RespondToBookingResponseBookingVerticalDataPrintJobPaperSize {
  A4('A4'),
  A3('A3'),
  Letter('Letter'),
  Legal('Legal');

  final String value;
  const RespondToBookingResponseBookingVerticalDataPrintJobPaperSize(this.value);

  static RespondToBookingResponseBookingVerticalDataPrintJobPaperSize fromJson(String value) =>
      RespondToBookingResponseBookingVerticalDataPrintJobPaperSize.values.firstWhere((item) => item.value == value);
}

enum RespondToBookingResponseBookingVerticalDataPrintJobFinish {
  none('none'),
  stapled('stapled'),
  spiral_bound('spiral_bound'),
  laminated('laminated');

  final String value;
  const RespondToBookingResponseBookingVerticalDataPrintJobFinish(this.value);

  static RespondToBookingResponseBookingVerticalDataPrintJobFinish fromJson(String value) =>
      RespondToBookingResponseBookingVerticalDataPrintJobFinish.values.firstWhere((item) => item.value == value);
}

enum RespondToBookingResponseBookingVerticalDataLaundryJobServiceCategory {
  wash_and_fold('wash_and_fold'),
  dry_cleaning('dry_cleaning'),
  ironing_only('ironing_only');

  final String value;
  const RespondToBookingResponseBookingVerticalDataLaundryJobServiceCategory(this.value);

  static RespondToBookingResponseBookingVerticalDataLaundryJobServiceCategory fromJson(String value) =>
      RespondToBookingResponseBookingVerticalDataLaundryJobServiceCategory.values.firstWhere((item) => item.value == value);
}

enum GetProviderDashboardResponseBookingsItemVerticalDataPrintJobColorMode {
  black_and_white('black_and_white'),
  color('color');

  final String value;
  const GetProviderDashboardResponseBookingsItemVerticalDataPrintJobColorMode(this.value);

  static GetProviderDashboardResponseBookingsItemVerticalDataPrintJobColorMode fromJson(String value) =>
      GetProviderDashboardResponseBookingsItemVerticalDataPrintJobColorMode.values.firstWhere((item) => item.value == value);
}

enum GetProviderDashboardResponseBookingsItemVerticalDataPrintJobPaperSize {
  A4('A4'),
  A3('A3'),
  Letter('Letter'),
  Legal('Legal');

  final String value;
  const GetProviderDashboardResponseBookingsItemVerticalDataPrintJobPaperSize(this.value);

  static GetProviderDashboardResponseBookingsItemVerticalDataPrintJobPaperSize fromJson(String value) =>
      GetProviderDashboardResponseBookingsItemVerticalDataPrintJobPaperSize.values.firstWhere((item) => item.value == value);
}

enum GetProviderDashboardResponseBookingsItemVerticalDataPrintJobFinish {
  none('none'),
  stapled('stapled'),
  spiral_bound('spiral_bound'),
  laminated('laminated');

  final String value;
  const GetProviderDashboardResponseBookingsItemVerticalDataPrintJobFinish(this.value);

  static GetProviderDashboardResponseBookingsItemVerticalDataPrintJobFinish fromJson(String value) =>
      GetProviderDashboardResponseBookingsItemVerticalDataPrintJobFinish.values.firstWhere((item) => item.value == value);
}

enum GetProviderDashboardResponseBookingsItemVerticalDataLaundryJobServiceCategory {
  wash_and_fold('wash_and_fold'),
  dry_cleaning('dry_cleaning'),
  ironing_only('ironing_only');

  final String value;
  const GetProviderDashboardResponseBookingsItemVerticalDataLaundryJobServiceCategory(this.value);

  static GetProviderDashboardResponseBookingsItemVerticalDataLaundryJobServiceCategory fromJson(String value) =>
      GetProviderDashboardResponseBookingsItemVerticalDataLaundryJobServiceCategory.values.firstWhere((item) => item.value == value);
}

enum ListProviderBookingsResponseBookingsItemVerticalDataPrintJobColorMode {
  black_and_white('black_and_white'),
  color('color');

  final String value;
  const ListProviderBookingsResponseBookingsItemVerticalDataPrintJobColorMode(this.value);

  static ListProviderBookingsResponseBookingsItemVerticalDataPrintJobColorMode fromJson(String value) =>
      ListProviderBookingsResponseBookingsItemVerticalDataPrintJobColorMode.values.firstWhere((item) => item.value == value);
}

enum ListProviderBookingsResponseBookingsItemVerticalDataPrintJobPaperSize {
  A4('A4'),
  A3('A3'),
  Letter('Letter'),
  Legal('Legal');

  final String value;
  const ListProviderBookingsResponseBookingsItemVerticalDataPrintJobPaperSize(this.value);

  static ListProviderBookingsResponseBookingsItemVerticalDataPrintJobPaperSize fromJson(String value) =>
      ListProviderBookingsResponseBookingsItemVerticalDataPrintJobPaperSize.values.firstWhere((item) => item.value == value);
}

enum ListProviderBookingsResponseBookingsItemVerticalDataPrintJobFinish {
  none('none'),
  stapled('stapled'),
  spiral_bound('spiral_bound'),
  laminated('laminated');

  final String value;
  const ListProviderBookingsResponseBookingsItemVerticalDataPrintJobFinish(this.value);

  static ListProviderBookingsResponseBookingsItemVerticalDataPrintJobFinish fromJson(String value) =>
      ListProviderBookingsResponseBookingsItemVerticalDataPrintJobFinish.values.firstWhere((item) => item.value == value);
}

enum ListProviderBookingsResponseBookingsItemVerticalDataLaundryJobServiceCategory {
  wash_and_fold('wash_and_fold'),
  dry_cleaning('dry_cleaning'),
  ironing_only('ironing_only');

  final String value;
  const ListProviderBookingsResponseBookingsItemVerticalDataLaundryJobServiceCategory(this.value);

  static ListProviderBookingsResponseBookingsItemVerticalDataLaundryJobServiceCategory fromJson(String value) =>
      ListProviderBookingsResponseBookingsItemVerticalDataLaundryJobServiceCategory.values.firstWhere((item) => item.value == value);
}

enum GetMyBookingsResponseBookingsItemVerticalDataPrintJobColorMode {
  black_and_white('black_and_white'),
  color('color');

  final String value;
  const GetMyBookingsResponseBookingsItemVerticalDataPrintJobColorMode(this.value);

  static GetMyBookingsResponseBookingsItemVerticalDataPrintJobColorMode fromJson(String value) =>
      GetMyBookingsResponseBookingsItemVerticalDataPrintJobColorMode.values.firstWhere((item) => item.value == value);
}

enum GetMyBookingsResponseBookingsItemVerticalDataPrintJobPaperSize {
  A4('A4'),
  A3('A3'),
  Letter('Letter'),
  Legal('Legal');

  final String value;
  const GetMyBookingsResponseBookingsItemVerticalDataPrintJobPaperSize(this.value);

  static GetMyBookingsResponseBookingsItemVerticalDataPrintJobPaperSize fromJson(String value) =>
      GetMyBookingsResponseBookingsItemVerticalDataPrintJobPaperSize.values.firstWhere((item) => item.value == value);
}

enum GetMyBookingsResponseBookingsItemVerticalDataPrintJobFinish {
  none('none'),
  stapled('stapled'),
  spiral_bound('spiral_bound'),
  laminated('laminated');

  final String value;
  const GetMyBookingsResponseBookingsItemVerticalDataPrintJobFinish(this.value);

  static GetMyBookingsResponseBookingsItemVerticalDataPrintJobFinish fromJson(String value) =>
      GetMyBookingsResponseBookingsItemVerticalDataPrintJobFinish.values.firstWhere((item) => item.value == value);
}

enum GetMyBookingsResponseBookingsItemVerticalDataLaundryJobServiceCategory {
  wash_and_fold('wash_and_fold'),
  dry_cleaning('dry_cleaning'),
  ironing_only('ironing_only');

  final String value;
  const GetMyBookingsResponseBookingsItemVerticalDataLaundryJobServiceCategory(this.value);

  static GetMyBookingsResponseBookingsItemVerticalDataLaundryJobServiceCategory fromJson(String value) =>
      GetMyBookingsResponseBookingsItemVerticalDataLaundryJobServiceCategory.values.firstWhere((item) => item.value == value);
}

class BookingView {
  final String id;
  final String providerId;
  final String serviceId;
  final String? staffId;
  final String customerId;
  final String startUtc;
  final String endUtc;
  final String providerTimeZone;
  final BookingViewStatus status;
  final BookingViewConfirmationMode confirmationMode;
  final BookingViewPriceSnapshot priceSnapshot;
  final String? holdExpiresAt;
  final String? customerNote;
  final BookingViewSource source;
  final BookingViewVerticalData? verticalData;
  final String createdAt;
  final String updatedAt;

  BookingView({
    required this.id,
    required this.providerId,
    required this.serviceId,
    this.staffId,
    required this.customerId,
    required this.startUtc,
    required this.endUtc,
    required this.providerTimeZone,
    required this.status,
    required this.confirmationMode,
    required this.priceSnapshot,
    this.holdExpiresAt,
    this.customerNote,
    required this.source,
    this.verticalData,
    required this.createdAt,
    required this.updatedAt,
  });

  factory BookingView.fromJson(Map<String, dynamic> json) {
    return BookingView(
      id: json['id'] as String,
      providerId: json['providerId'] as String,
      serviceId: json['serviceId'] as String,
      staffId: json['staffId'] as String?,
      customerId: json['customerId'] as String,
      startUtc: json['startUtc'] as String,
      endUtc: json['endUtc'] as String,
      providerTimeZone: json['providerTimeZone'] as String,
      status: BookingViewStatus.fromJson(json['status'] as String),
      confirmationMode: BookingViewConfirmationMode.fromJson(json['confirmationMode'] as String),
      priceSnapshot: BookingViewPriceSnapshot.fromJson(json['priceSnapshot'] as Map<String, dynamic>),
      holdExpiresAt: json['holdExpiresAt'] as String?,
      customerNote: json['customerNote'] as String?,
      source: BookingViewSource.fromJson(json['source'] as String),
      verticalData: json['verticalData'] == null ? null : BookingViewVerticalData.fromJson(json['verticalData'] as Map<String, dynamic>),
      createdAt: json['createdAt'] as String,
      updatedAt: json['updatedAt'] as String,
    );
  }

  Map<String, dynamic> toJson() => {
    'id': id,
    'providerId': providerId,
    'serviceId': serviceId,
    'staffId': staffId,
    'customerId': customerId,
    'startUtc': startUtc,
    'endUtc': endUtc,
    'providerTimeZone': providerTimeZone,
    'status': status.value,
    'confirmationMode': confirmationMode.value,
    'priceSnapshot': priceSnapshot.toJson(),
    'holdExpiresAt': holdExpiresAt,
    'customerNote': customerNote,
    'source': source.value,
    'verticalData': verticalData?.toJson(),
    'createdAt': createdAt,
    'updatedAt': updatedAt,
  };
}

class PrintJobSpecs {
  final List<String> fileUrls;
  final int? copies;
  final PrintJobSpecsColorMode? colorMode;
  final PrintJobSpecsPaperSize? paperSize;
  final PrintJobSpecsFinish? finish;
  final String? notes;

  PrintJobSpecs({
    required this.fileUrls,
    this.copies,
    this.colorMode,
    this.paperSize,
    this.finish,
    this.notes,
  });

  factory PrintJobSpecs.fromJson(Map<String, dynamic> json) {
    return PrintJobSpecs(
      fileUrls: (json['fileUrls'] as List<dynamic>).map((e) => e as String).toList(),
      copies: json['copies'] as int?,
      colorMode: json['colorMode'] == null ? null : PrintJobSpecsColorMode.fromJson(json['colorMode'] as String),
      paperSize: json['paperSize'] == null ? null : PrintJobSpecsPaperSize.fromJson(json['paperSize'] as String),
      finish: json['finish'] == null ? null : PrintJobSpecsFinish.fromJson(json['finish'] as String),
      notes: json['notes'] as String?,
    );
  }

  Map<String, dynamic> toJson() => {
    'fileUrls': fileUrls.map((e) => e).toList(),
    'copies': copies,
    'colorMode': colorMode?.value,
    'paperSize': paperSize?.value,
    'finish': finish?.value,
    'notes': notes,
  };
}

class LaundryJobSpecs {
  final LaundryJobSpecsServiceCategory? serviceCategory;
  final num? estimatedWeightKg;
  final int? bagCount;
  final String? specialInstructions;

  LaundryJobSpecs({
    this.serviceCategory,
    this.estimatedWeightKg,
    this.bagCount,
    this.specialInstructions,
  });

  factory LaundryJobSpecs.fromJson(Map<String, dynamic> json) {
    return LaundryJobSpecs(
      serviceCategory: json['serviceCategory'] == null ? null : LaundryJobSpecsServiceCategory.fromJson(json['serviceCategory'] as String),
      estimatedWeightKg: json['estimatedWeightKg'] as num?,
      bagCount: json['bagCount'] as int?,
      specialInstructions: json['specialInstructions'] as String?,
    );
  }

  Map<String, dynamic> toJson() => {
    'serviceCategory': serviceCategory?.value,
    'estimatedWeightKg': estimatedWeightKg,
    'bagCount': bagCount,
    'specialInstructions': specialInstructions,
  };
}

class BookingVerticalData {
  final BookingVerticalDataPrintJob? printJob;
  final BookingVerticalDataLaundryJob? laundryJob;

  BookingVerticalData({
    this.printJob,
    this.laundryJob,
  });

  factory BookingVerticalData.fromJson(Map<String, dynamic> json) {
    return BookingVerticalData(
      printJob: json['printJob'] == null ? null : BookingVerticalDataPrintJob.fromJson(json['printJob'] as Map<String, dynamic>),
      laundryJob: json['laundryJob'] == null ? null : BookingVerticalDataLaundryJob.fromJson(json['laundryJob'] as Map<String, dynamic>),
    );
  }

  Map<String, dynamic> toJson() => {
    'printJob': printJob?.toJson(),
    'laundryJob': laundryJob?.toJson(),
  };
}

class ProviderConfigView {
  final String id;
  final String ownerId;
  final String name;
  final String slug;
  final String description;
  final String? logoUrl;
  final ProviderConfigViewAddress? address;
  final String timeZone;
  final ProviderConfigViewStatus status;
  final ProviderConfigViewBookingPolicy bookingPolicy;
  final ProviderConfigViewVertical? vertical;

  ProviderConfigView({
    required this.id,
    required this.ownerId,
    required this.name,
    required this.slug,
    required this.description,
    this.logoUrl,
    this.address,
    required this.timeZone,
    required this.status,
    required this.bookingPolicy,
    this.vertical,
  });

  factory ProviderConfigView.fromJson(Map<String, dynamic> json) {
    return ProviderConfigView(
      id: json['id'] as String,
      ownerId: json['ownerId'] as String,
      name: json['name'] as String,
      slug: json['slug'] as String,
      description: json['description'] as String,
      logoUrl: json['logoUrl'] as String?,
      address: json['address'] == null ? null : ProviderConfigViewAddress.fromJson(json['address'] as Map<String, dynamic>),
      timeZone: json['timeZone'] as String,
      status: ProviderConfigViewStatus.fromJson(json['status'] as String),
      bookingPolicy: ProviderConfigViewBookingPolicy.fromJson(json['bookingPolicy'] as Map<String, dynamic>),
      vertical: json['vertical'] == null ? null : ProviderConfigViewVertical.fromJson(json['vertical'] as String),
    );
  }

  Map<String, dynamic> toJson() => {
    'id': id,
    'ownerId': ownerId,
    'name': name,
    'slug': slug,
    'description': description,
    'logoUrl': logoUrl,
    'address': address?.toJson(),
    'timeZone': timeZone,
    'status': status.value,
    'bookingPolicy': bookingPolicy.toJson(),
    'vertical': vertical?.value,
  };
}

class ServiceConfigView {
  final String id;
  final String providerId;
  final String name;
  final String description;
  final int durationMinutes;
  final ServiceConfigViewPrice price;
  final ServiceConfigViewConfirmationMode confirmationMode;
  final ServiceConfigViewCapacityScope capacityScope;
  final List<String> staffIds;
  final bool active;
  final String? imageUrl;
  final ServiceConfigViewServiceType? serviceType;
  final int bufferBeforeMinutes;
  final int bufferAfterMinutes;

  ServiceConfigView({
    required this.id,
    required this.providerId,
    required this.name,
    required this.description,
    required this.durationMinutes,
    required this.price,
    required this.confirmationMode,
    required this.capacityScope,
    required this.staffIds,
    required this.active,
    this.imageUrl,
    this.serviceType,
    required this.bufferBeforeMinutes,
    required this.bufferAfterMinutes,
  });

  factory ServiceConfigView.fromJson(Map<String, dynamic> json) {
    return ServiceConfigView(
      id: json['id'] as String,
      providerId: json['providerId'] as String,
      name: json['name'] as String,
      description: json['description'] as String,
      durationMinutes: json['durationMinutes'] as int,
      price: ServiceConfigViewPrice.fromJson(json['price'] as Map<String, dynamic>),
      confirmationMode: ServiceConfigViewConfirmationMode.fromJson(json['confirmationMode'] as String),
      capacityScope: ServiceConfigViewCapacityScope.fromJson(json['capacityScope'] as String),
      staffIds: (json['staffIds'] as List<dynamic>).map((e) => e as String).toList(),
      active: json['active'] as bool,
      imageUrl: json['imageUrl'] as String?,
      serviceType: json['serviceType'] == null ? null : ServiceConfigViewServiceType.fromJson(json['serviceType'] as String),
      bufferBeforeMinutes: json['bufferBeforeMinutes'] as int,
      bufferAfterMinutes: json['bufferAfterMinutes'] as int,
    );
  }

  Map<String, dynamic> toJson() => {
    'id': id,
    'providerId': providerId,
    'name': name,
    'description': description,
    'durationMinutes': durationMinutes,
    'price': price.toJson(),
    'confirmationMode': confirmationMode.value,
    'capacityScope': capacityScope.value,
    'staffIds': staffIds.map((e) => e).toList(),
    'active': active,
    'imageUrl': imageUrl,
    'serviceType': serviceType?.value,
    'bufferBeforeMinutes': bufferBeforeMinutes,
    'bufferAfterMinutes': bufferAfterMinutes,
  };
}

class StaffConfigView {
  final String id;
  final String providerId;
  final String name;
  final String? photoUrl;
  final bool active;
  final List<String> serviceIds;
  final String? userId;
  final int concurrentSlots;

  StaffConfigView({
    required this.id,
    required this.providerId,
    required this.name,
    this.photoUrl,
    required this.active,
    required this.serviceIds,
    this.userId,
    required this.concurrentSlots,
  });

  factory StaffConfigView.fromJson(Map<String, dynamic> json) {
    return StaffConfigView(
      id: json['id'] as String,
      providerId: json['providerId'] as String,
      name: json['name'] as String,
      photoUrl: json['photoUrl'] as String?,
      active: json['active'] as bool,
      serviceIds: (json['serviceIds'] as List<dynamic>).map((e) => e as String).toList(),
      userId: json['userId'] as String?,
      concurrentSlots: json['concurrentSlots'] as int,
    );
  }

  Map<String, dynamic> toJson() => {
    'id': id,
    'providerId': providerId,
    'name': name,
    'photoUrl': photoUrl,
    'active': active,
    'serviceIds': serviceIds.map((e) => e).toList(),
    'userId': userId,
    'concurrentSlots': concurrentSlots,
  };
}

class AvailabilityRuleView {
  final String id;
  final String providerId;
  final AvailabilityRuleViewKind kind;
  final String? staffId;
  final int? dayOfWeek;
  final String? startLocal;
  final String? endLocal;
  final String? date;
  final List<AvailabilityRuleViewIntervalsItem>? intervals;
  final String? reason;

  AvailabilityRuleView({
    required this.id,
    required this.providerId,
    required this.kind,
    this.staffId,
    this.dayOfWeek,
    this.startLocal,
    this.endLocal,
    this.date,
    this.intervals,
    this.reason,
  });

  factory AvailabilityRuleView.fromJson(Map<String, dynamic> json) {
    return AvailabilityRuleView(
      id: json['id'] as String,
      providerId: json['providerId'] as String,
      kind: AvailabilityRuleViewKind.fromJson(json['kind'] as String),
      staffId: json['staffId'] as String?,
      dayOfWeek: json['dayOfWeek'] as int?,
      startLocal: json['startLocal'] as String?,
      endLocal: json['endLocal'] as String?,
      date: json['date'] as String?,
      intervals: (json['intervals'] as List<dynamic>?)?.map((e) => AvailabilityRuleViewIntervalsItem.fromJson(e as Map<String, dynamic>)).toList(),
      reason: json['reason'] as String?,
    );
  }

  Map<String, dynamic> toJson() => {
    'id': id,
    'providerId': providerId,
    'kind': kind.value,
    'staffId': staffId,
    'dayOfWeek': dayOfWeek,
    'startLocal': startLocal,
    'endLocal': endLocal,
    'date': date,
    'intervals': intervals?.map((e) => e.toJson()).toList(),
    'reason': reason,
  };
}

class SlotView {
  final String startUtc;
  final String endUtc;
  final String localLabel;
  final String? staffId;
  final int remaining;
  final int capacity;

  SlotView({
    required this.startUtc,
    required this.endUtc,
    required this.localLabel,
    this.staffId,
    required this.remaining,
    required this.capacity,
  });

  factory SlotView.fromJson(Map<String, dynamic> json) {
    return SlotView(
      startUtc: json['startUtc'] as String,
      endUtc: json['endUtc'] as String,
      localLabel: json['localLabel'] as String,
      staffId: json['staffId'] as String?,
      remaining: json['remaining'] as int,
      capacity: json['capacity'] as int,
    );
  }

  Map<String, dynamic> toJson() => {
    'startUtc': startUtc,
    'endUtc': endUtc,
    'localLabel': localLabel,
    'staffId': staffId,
    'remaining': remaining,
    'capacity': capacity,
  };
}

class GetAvailabilityRequest {
  final String providerId;
  final String serviceId;
  final String? staffId;
  final String? date;
  final String? from;
  final String? to;

  GetAvailabilityRequest({
    required this.providerId,
    required this.serviceId,
    this.staffId,
    this.date,
    this.from,
    this.to,
  });

  factory GetAvailabilityRequest.fromJson(Map<String, dynamic> json) {
    return GetAvailabilityRequest(
      providerId: json['providerId'] as String,
      serviceId: json['serviceId'] as String,
      staffId: json['staffId'] as String?,
      date: json['date'] as String?,
      from: json['from'] as String?,
      to: json['to'] as String?,
    );
  }

  Map<String, dynamic> toJson() => {
    'providerId': providerId,
    'serviceId': serviceId,
    'staffId': staffId,
    'date': date,
    'from': from,
    'to': to,
  };
}

class GetAvailabilityResponse {
  final List<GetAvailabilityResponseSlotsItem> slots;

  GetAvailabilityResponse({
    required this.slots,
  });

  factory GetAvailabilityResponse.fromJson(Map<String, dynamic> json) {
    return GetAvailabilityResponse(
      slots: (json['slots'] as List<dynamic>).map((e) => GetAvailabilityResponseSlotsItem.fromJson(e as Map<String, dynamic>)).toList(),
    );
  }

  Map<String, dynamic> toJson() => {
    'slots': slots.map((e) => e.toJson()).toList(),
  };
}

class CreateBookingRequest {
  final String providerId;
  final String serviceId;
  final String? staffId;
  final String startUtc;
  final String idempotencyKey;
  final String? note;
  final CreateBookingRequestSource source;
  final CreateBookingRequestVerticalData? verticalData;

  CreateBookingRequest({
    required this.providerId,
    required this.serviceId,
    this.staffId,
    required this.startUtc,
    required this.idempotencyKey,
    this.note,
    required this.source,
    this.verticalData,
  });

  factory CreateBookingRequest.fromJson(Map<String, dynamic> json) {
    return CreateBookingRequest(
      providerId: json['providerId'] as String,
      serviceId: json['serviceId'] as String,
      staffId: json['staffId'] as String?,
      startUtc: json['startUtc'] as String,
      idempotencyKey: json['idempotencyKey'] as String,
      note: json['note'] as String?,
      source: CreateBookingRequestSource.fromJson(json['source'] as String),
      verticalData: json['verticalData'] == null ? null : CreateBookingRequestVerticalData.fromJson(json['verticalData'] as Map<String, dynamic>),
    );
  }

  Map<String, dynamic> toJson() => {
    'providerId': providerId,
    'serviceId': serviceId,
    'staffId': staffId,
    'startUtc': startUtc,
    'idempotencyKey': idempotencyKey,
    'note': note,
    'source': source.value,
    'verticalData': verticalData?.toJson(),
  };
}

class CreateBookingResponse {
  final CreateBookingResponseBooking booking;

  CreateBookingResponse({
    required this.booking,
  });

  factory CreateBookingResponse.fromJson(Map<String, dynamic> json) {
    return CreateBookingResponse(
      booking: CreateBookingResponseBooking.fromJson(json['booking'] as Map<String, dynamic>),
    );
  }

  Map<String, dynamic> toJson() => {
    'booking': booking.toJson(),
  };
}

class CancelBookingRequest {
  final String bookingId;
  final String? reason;

  CancelBookingRequest({
    required this.bookingId,
    this.reason,
  });

  factory CancelBookingRequest.fromJson(Map<String, dynamic> json) {
    return CancelBookingRequest(
      bookingId: json['bookingId'] as String,
      reason: json['reason'] as String?,
    );
  }

  Map<String, dynamic> toJson() => {
    'bookingId': bookingId,
    'reason': reason,
  };
}

class CancelBookingResponse {
  final CancelBookingResponseBooking booking;

  CancelBookingResponse({
    required this.booking,
  });

  factory CancelBookingResponse.fromJson(Map<String, dynamic> json) {
    return CancelBookingResponse(
      booking: CancelBookingResponseBooking.fromJson(json['booking'] as Map<String, dynamic>),
    );
  }

  Map<String, dynamic> toJson() => {
    'booking': booking.toJson(),
  };
}

class RescheduleBookingRequest {
  final String bookingId;
  final String startUtc;
  final String idempotencyKey;

  RescheduleBookingRequest({
    required this.bookingId,
    required this.startUtc,
    required this.idempotencyKey,
  });

  factory RescheduleBookingRequest.fromJson(Map<String, dynamic> json) {
    return RescheduleBookingRequest(
      bookingId: json['bookingId'] as String,
      startUtc: json['startUtc'] as String,
      idempotencyKey: json['idempotencyKey'] as String,
    );
  }

  Map<String, dynamic> toJson() => {
    'bookingId': bookingId,
    'startUtc': startUtc,
    'idempotencyKey': idempotencyKey,
  };
}

class RescheduleBookingResponse {
  final RescheduleBookingResponseBooking booking;

  RescheduleBookingResponse({
    required this.booking,
  });

  factory RescheduleBookingResponse.fromJson(Map<String, dynamic> json) {
    return RescheduleBookingResponse(
      booking: RescheduleBookingResponseBooking.fromJson(json['booking'] as Map<String, dynamic>),
    );
  }

  Map<String, dynamic> toJson() => {
    'booking': booking.toJson(),
  };
}

class RespondToBookingRequest {
  final String bookingId;
  final RespondToBookingRequestAction action;

  RespondToBookingRequest({
    required this.bookingId,
    required this.action,
  });

  factory RespondToBookingRequest.fromJson(Map<String, dynamic> json) {
    return RespondToBookingRequest(
      bookingId: json['bookingId'] as String,
      action: RespondToBookingRequestAction.fromJson(json['action'] as String),
    );
  }

  Map<String, dynamic> toJson() => {
    'bookingId': bookingId,
    'action': action.value,
  };
}

class RespondToBookingResponse {
  final RespondToBookingResponseBooking booking;

  RespondToBookingResponse({
    required this.booking,
  });

  factory RespondToBookingResponse.fromJson(Map<String, dynamic> json) {
    return RespondToBookingResponse(
      booking: RespondToBookingResponseBooking.fromJson(json['booking'] as Map<String, dynamic>),
    );
  }

  Map<String, dynamic> toJson() => {
    'booking': booking.toJson(),
  };
}

class SaveProviderRequest {
  final String? providerId;
  final String name;
  final String slug;
  final String description;
  final String timeZone;
  final String? logoUrl;
  final SaveProviderRequestAddress? address;
  final SaveProviderRequestStatus status;
  final SaveProviderRequestBookingPolicy bookingPolicy;
  final SaveProviderRequestVertical? vertical;

  SaveProviderRequest({
    this.providerId,
    required this.name,
    required this.slug,
    required this.description,
    required this.timeZone,
    this.logoUrl,
    this.address,
    required this.status,
    required this.bookingPolicy,
    this.vertical,
  });

  factory SaveProviderRequest.fromJson(Map<String, dynamic> json) {
    return SaveProviderRequest(
      providerId: json['providerId'] as String?,
      name: json['name'] as String,
      slug: json['slug'] as String,
      description: json['description'] as String,
      timeZone: json['timeZone'] as String,
      logoUrl: json['logoUrl'] as String?,
      address: json['address'] == null ? null : SaveProviderRequestAddress.fromJson(json['address'] as Map<String, dynamic>),
      status: SaveProviderRequestStatus.fromJson(json['status'] as String),
      bookingPolicy: SaveProviderRequestBookingPolicy.fromJson(json['bookingPolicy'] as Map<String, dynamic>),
      vertical: json['vertical'] == null ? null : SaveProviderRequestVertical.fromJson(json['vertical'] as String),
    );
  }

  Map<String, dynamic> toJson() => {
    'providerId': providerId,
    'name': name,
    'slug': slug,
    'description': description,
    'timeZone': timeZone,
    'logoUrl': logoUrl,
    'address': address?.toJson(),
    'status': status.value,
    'bookingPolicy': bookingPolicy.toJson(),
    'vertical': vertical?.value,
  };
}

class SaveServiceRequest {
  final String providerId;
  final String? serviceId;
  final String name;
  final String description;
  final int durationMinutes;
  final SaveServiceRequestPrice price;
  final SaveServiceRequestConfirmationMode confirmationMode;
  final SaveServiceRequestCapacityScope capacityScope;
  final List<String> staffIds;
  final int? bufferBeforeMinutes;
  final int? bufferAfterMinutes;
  final bool? active;
  final String? imageUrl;
  final SaveServiceRequestServiceType? serviceType;

  SaveServiceRequest({
    required this.providerId,
    this.serviceId,
    required this.name,
    required this.description,
    required this.durationMinutes,
    required this.price,
    required this.confirmationMode,
    required this.capacityScope,
    required this.staffIds,
    this.bufferBeforeMinutes,
    this.bufferAfterMinutes,
    this.active,
    this.imageUrl,
    this.serviceType,
  });

  factory SaveServiceRequest.fromJson(Map<String, dynamic> json) {
    return SaveServiceRequest(
      providerId: json['providerId'] as String,
      serviceId: json['serviceId'] as String?,
      name: json['name'] as String,
      description: json['description'] as String,
      durationMinutes: json['durationMinutes'] as int,
      price: SaveServiceRequestPrice.fromJson(json['price'] as Map<String, dynamic>),
      confirmationMode: SaveServiceRequestConfirmationMode.fromJson(json['confirmationMode'] as String),
      capacityScope: SaveServiceRequestCapacityScope.fromJson(json['capacityScope'] as String),
      staffIds: (json['staffIds'] as List<dynamic>).map((e) => e as String).toList(),
      bufferBeforeMinutes: json['bufferBeforeMinutes'] as int?,
      bufferAfterMinutes: json['bufferAfterMinutes'] as int?,
      active: json['active'] as bool?,
      imageUrl: json['imageUrl'] as String?,
      serviceType: json['serviceType'] == null ? null : SaveServiceRequestServiceType.fromJson(json['serviceType'] as String),
    );
  }

  Map<String, dynamic> toJson() => {
    'providerId': providerId,
    'serviceId': serviceId,
    'name': name,
    'description': description,
    'durationMinutes': durationMinutes,
    'price': price.toJson(),
    'confirmationMode': confirmationMode.value,
    'capacityScope': capacityScope.value,
    'staffIds': staffIds.map((e) => e).toList(),
    'bufferBeforeMinutes': bufferBeforeMinutes,
    'bufferAfterMinutes': bufferAfterMinutes,
    'active': active,
    'imageUrl': imageUrl,
    'serviceType': serviceType?.value,
  };
}

class SaveStaffRequest {
  final String providerId;
  final String? staffId;
  final String name;
  final String? userId;
  final String? photoUrl;
  final bool? active;
  final List<String>? serviceIds;
  final int? concurrentSlots;

  SaveStaffRequest({
    required this.providerId,
    this.staffId,
    required this.name,
    this.userId,
    this.photoUrl,
    this.active,
    this.serviceIds,
    this.concurrentSlots,
  });

  factory SaveStaffRequest.fromJson(Map<String, dynamic> json) {
    return SaveStaffRequest(
      providerId: json['providerId'] as String,
      staffId: json['staffId'] as String?,
      name: json['name'] as String,
      userId: json['userId'] as String?,
      photoUrl: json['photoUrl'] as String?,
      active: json['active'] as bool?,
      serviceIds: (json['serviceIds'] as List<dynamic>?)?.map((e) => e as String).toList(),
      concurrentSlots: json['concurrentSlots'] as int?,
    );
  }

  Map<String, dynamic> toJson() => {
    'providerId': providerId,
    'staffId': staffId,
    'name': name,
    'userId': userId,
    'photoUrl': photoUrl,
    'active': active,
    'serviceIds': serviceIds?.map((e) => e).toList(),
    'concurrentSlots': concurrentSlots,
  };
}

class SaveAvailabilityRequest {
  final String providerId;
  final String? ruleId;
  final SaveAvailabilityRequestKind kind;
  final String? staffId;
  final int? dayOfWeek;
  final String? startLocal;
  final String? endLocal;
  final String? date;
  final List<SaveAvailabilityRequestIntervalsItem>? intervals;
  final String? reason;

  SaveAvailabilityRequest({
    required this.providerId,
    this.ruleId,
    required this.kind,
    this.staffId,
    this.dayOfWeek,
    this.startLocal,
    this.endLocal,
    this.date,
    this.intervals,
    this.reason,
  });

  factory SaveAvailabilityRequest.fromJson(Map<String, dynamic> json) {
    return SaveAvailabilityRequest(
      providerId: json['providerId'] as String,
      ruleId: json['ruleId'] as String?,
      kind: SaveAvailabilityRequestKind.fromJson(json['kind'] as String),
      staffId: json['staffId'] as String?,
      dayOfWeek: json['dayOfWeek'] as int?,
      startLocal: json['startLocal'] as String?,
      endLocal: json['endLocal'] as String?,
      date: json['date'] as String?,
      intervals: (json['intervals'] as List<dynamic>?)?.map((e) => SaveAvailabilityRequestIntervalsItem.fromJson(e as Map<String, dynamic>)).toList(),
      reason: json['reason'] as String?,
    );
  }

  Map<String, dynamic> toJson() => {
    'providerId': providerId,
    'ruleId': ruleId,
    'kind': kind.value,
    'staffId': staffId,
    'dayOfWeek': dayOfWeek,
    'startLocal': startLocal,
    'endLocal': endLocal,
    'date': date,
    'intervals': intervals?.map((e) => e.toJson()).toList(),
    'reason': reason,
  };
}

class SavedEntityResponse {
  final String id;

  SavedEntityResponse({
    required this.id,
  });

  factory SavedEntityResponse.fromJson(Map<String, dynamic> json) {
    return SavedEntityResponse(
      id: json['id'] as String,
    );
  }

  Map<String, dynamic> toJson() => {
    'id': id,
  };
}

class ListPublishedProvidersResponse {
  final List<ListPublishedProvidersResponseProvidersItem> providers;

  ListPublishedProvidersResponse({
    required this.providers,
  });

  factory ListPublishedProvidersResponse.fromJson(Map<String, dynamic> json) {
    return ListPublishedProvidersResponse(
      providers: (json['providers'] as List<dynamic>).map((e) => ListPublishedProvidersResponseProvidersItem.fromJson(e as Map<String, dynamic>)).toList(),
    );
  }

  Map<String, dynamic> toJson() => {
    'providers': providers.map((e) => e.toJson()).toList(),
  };
}

class GetProviderDetailsRequest {
  final String? slug;
  final String? providerId;

  GetProviderDetailsRequest({
    this.slug,
    this.providerId,
  });

  factory GetProviderDetailsRequest.fromJson(Map<String, dynamic> json) {
    return GetProviderDetailsRequest(
      slug: json['slug'] as String?,
      providerId: json['providerId'] as String?,
    );
  }

  Map<String, dynamic> toJson() => {
    'slug': slug,
    'providerId': providerId,
  };
}

class GetProviderDetailsResponse {
  final GetProviderDetailsResponseProvider provider;
  final List<GetProviderDetailsResponseServicesItem> services;
  final List<GetProviderDetailsResponseStaffItem> staff;

  GetProviderDetailsResponse({
    required this.provider,
    required this.services,
    required this.staff,
  });

  factory GetProviderDetailsResponse.fromJson(Map<String, dynamic> json) {
    return GetProviderDetailsResponse(
      provider: GetProviderDetailsResponseProvider.fromJson(json['provider'] as Map<String, dynamic>),
      services: (json['services'] as List<dynamic>).map((e) => GetProviderDetailsResponseServicesItem.fromJson(e as Map<String, dynamic>)).toList(),
      staff: (json['staff'] as List<dynamic>).map((e) => GetProviderDetailsResponseStaffItem.fromJson(e as Map<String, dynamic>)).toList(),
    );
  }

  Map<String, dynamic> toJson() => {
    'provider': provider.toJson(),
    'services': services.map((e) => e.toJson()).toList(),
    'staff': staff.map((e) => e.toJson()).toList(),
  };
}

class GetProviderDashboardRequest {
  final String providerId;

  GetProviderDashboardRequest({
    required this.providerId,
  });

  factory GetProviderDashboardRequest.fromJson(Map<String, dynamic> json) {
    return GetProviderDashboardRequest(
      providerId: json['providerId'] as String,
    );
  }

  Map<String, dynamic> toJson() => {
    'providerId': providerId,
  };
}

class GetProviderDashboardResponse {
  final GetProviderDashboardResponseProvider provider;
  final List<GetProviderDashboardResponseServicesItem> services;
  final List<GetProviderDashboardResponseStaffItem> staff;
  final List<GetProviderDashboardResponseAvailabilityItem> availability;
  final List<GetProviderDashboardResponseBookingsItem> bookings;

  GetProviderDashboardResponse({
    required this.provider,
    required this.services,
    required this.staff,
    required this.availability,
    required this.bookings,
  });

  factory GetProviderDashboardResponse.fromJson(Map<String, dynamic> json) {
    return GetProviderDashboardResponse(
      provider: GetProviderDashboardResponseProvider.fromJson(json['provider'] as Map<String, dynamic>),
      services: (json['services'] as List<dynamic>).map((e) => GetProviderDashboardResponseServicesItem.fromJson(e as Map<String, dynamic>)).toList(),
      staff: (json['staff'] as List<dynamic>).map((e) => GetProviderDashboardResponseStaffItem.fromJson(e as Map<String, dynamic>)).toList(),
      availability: (json['availability'] as List<dynamic>).map((e) => GetProviderDashboardResponseAvailabilityItem.fromJson(e as Map<String, dynamic>)).toList(),
      bookings: (json['bookings'] as List<dynamic>).map((e) => GetProviderDashboardResponseBookingsItem.fromJson(e as Map<String, dynamic>)).toList(),
    );
  }

  Map<String, dynamic> toJson() => {
    'provider': provider.toJson(),
    'services': services.map((e) => e.toJson()).toList(),
    'staff': staff.map((e) => e.toJson()).toList(),
    'availability': availability.map((e) => e.toJson()).toList(),
    'bookings': bookings.map((e) => e.toJson()).toList(),
  };
}

class ListProviderBookingsRequest {
  final String providerId;
  final String? from;
  final String? to;

  ListProviderBookingsRequest({
    required this.providerId,
    this.from,
    this.to,
  });

  factory ListProviderBookingsRequest.fromJson(Map<String, dynamic> json) {
    return ListProviderBookingsRequest(
      providerId: json['providerId'] as String,
      from: json['from'] as String?,
      to: json['to'] as String?,
    );
  }

  Map<String, dynamic> toJson() => {
    'providerId': providerId,
    'from': from,
    'to': to,
  };
}

class ListProviderBookingsResponse {
  final List<ListProviderBookingsResponseBookingsItem> bookings;

  ListProviderBookingsResponse({
    required this.bookings,
  });

  factory ListProviderBookingsResponse.fromJson(Map<String, dynamic> json) {
    return ListProviderBookingsResponse(
      bookings: (json['bookings'] as List<dynamic>).map((e) => ListProviderBookingsResponseBookingsItem.fromJson(e as Map<String, dynamic>)).toList(),
    );
  }

  Map<String, dynamic> toJson() => {
    'bookings': bookings.map((e) => e.toJson()).toList(),
  };
}

class DeleteAvailabilityRuleRequest {
  final String providerId;
  final String ruleId;

  DeleteAvailabilityRuleRequest({
    required this.providerId,
    required this.ruleId,
  });

  factory DeleteAvailabilityRuleRequest.fromJson(Map<String, dynamic> json) {
    return DeleteAvailabilityRuleRequest(
      providerId: json['providerId'] as String,
      ruleId: json['ruleId'] as String,
    );
  }

  Map<String, dynamic> toJson() => {
    'providerId': providerId,
    'ruleId': ruleId,
  };
}

class GetMyBookingsResponse {
  final List<GetMyBookingsResponseBookingsItem> bookings;

  GetMyBookingsResponse({
    required this.bookings,
  });

  factory GetMyBookingsResponse.fromJson(Map<String, dynamic> json) {
    return GetMyBookingsResponse(
      bookings: (json['bookings'] as List<dynamic>).map((e) => GetMyBookingsResponseBookingsItem.fromJson(e as Map<String, dynamic>)).toList(),
    );
  }

  Map<String, dynamic> toJson() => {
    'bookings': bookings.map((e) => e.toJson()).toList(),
  };
}

class RegisterFcmTokenRequest {
  final String token;
  final RegisterFcmTokenRequestPlatform platform;

  RegisterFcmTokenRequest({
    required this.token,
    required this.platform,
  });

  factory RegisterFcmTokenRequest.fromJson(Map<String, dynamic> json) {
    return RegisterFcmTokenRequest(
      token: json['token'] as String,
      platform: RegisterFcmTokenRequestPlatform.fromJson(json['platform'] as String),
    );
  }

  Map<String, dynamic> toJson() => {
    'token': token,
    'platform': platform.value,
  };
}

class RemoveFcmTokenRequest {
  final String token;

  RemoveFcmTokenRequest({
    required this.token,
  });

  factory RemoveFcmTokenRequest.fromJson(Map<String, dynamic> json) {
    return RemoveFcmTokenRequest(
      token: json['token'] as String,
    );
  }

  Map<String, dynamic> toJson() => {
    'token': token,
  };
}

class BookingViewPriceSnapshot {
  final int amountCents;
  final String currency;
  final String serviceName;
  final int durationMinutes;

  BookingViewPriceSnapshot({
    required this.amountCents,
    required this.currency,
    required this.serviceName,
    required this.durationMinutes,
  });

  factory BookingViewPriceSnapshot.fromJson(Map<String, dynamic> json) {
    return BookingViewPriceSnapshot(
      amountCents: json['amountCents'] as int,
      currency: json['currency'] as String,
      serviceName: json['serviceName'] as String,
      durationMinutes: json['durationMinutes'] as int,
    );
  }

  Map<String, dynamic> toJson() => {
    'amountCents': amountCents,
    'currency': currency,
    'serviceName': serviceName,
    'durationMinutes': durationMinutes,
  };
}

class BookingViewVerticalData {
  final BookingViewVerticalDataPrintJob? printJob;
  final BookingViewVerticalDataLaundryJob? laundryJob;

  BookingViewVerticalData({
    this.printJob,
    this.laundryJob,
  });

  factory BookingViewVerticalData.fromJson(Map<String, dynamic> json) {
    return BookingViewVerticalData(
      printJob: json['printJob'] == null ? null : BookingViewVerticalDataPrintJob.fromJson(json['printJob'] as Map<String, dynamic>),
      laundryJob: json['laundryJob'] == null ? null : BookingViewVerticalDataLaundryJob.fromJson(json['laundryJob'] as Map<String, dynamic>),
    );
  }

  Map<String, dynamic> toJson() => {
    'printJob': printJob?.toJson(),
    'laundryJob': laundryJob?.toJson(),
  };
}

class BookingVerticalDataPrintJob {
  final List<String> fileUrls;
  final int? copies;
  final BookingVerticalDataPrintJobColorMode? colorMode;
  final BookingVerticalDataPrintJobPaperSize? paperSize;
  final BookingVerticalDataPrintJobFinish? finish;
  final String? notes;

  BookingVerticalDataPrintJob({
    required this.fileUrls,
    this.copies,
    this.colorMode,
    this.paperSize,
    this.finish,
    this.notes,
  });

  factory BookingVerticalDataPrintJob.fromJson(Map<String, dynamic> json) {
    return BookingVerticalDataPrintJob(
      fileUrls: (json['fileUrls'] as List<dynamic>).map((e) => e as String).toList(),
      copies: json['copies'] as int?,
      colorMode: json['colorMode'] == null ? null : BookingVerticalDataPrintJobColorMode.fromJson(json['colorMode'] as String),
      paperSize: json['paperSize'] == null ? null : BookingVerticalDataPrintJobPaperSize.fromJson(json['paperSize'] as String),
      finish: json['finish'] == null ? null : BookingVerticalDataPrintJobFinish.fromJson(json['finish'] as String),
      notes: json['notes'] as String?,
    );
  }

  Map<String, dynamic> toJson() => {
    'fileUrls': fileUrls.map((e) => e).toList(),
    'copies': copies,
    'colorMode': colorMode?.value,
    'paperSize': paperSize?.value,
    'finish': finish?.value,
    'notes': notes,
  };
}

class BookingVerticalDataLaundryJob {
  final BookingVerticalDataLaundryJobServiceCategory? serviceCategory;
  final num? estimatedWeightKg;
  final int? bagCount;
  final String? specialInstructions;

  BookingVerticalDataLaundryJob({
    this.serviceCategory,
    this.estimatedWeightKg,
    this.bagCount,
    this.specialInstructions,
  });

  factory BookingVerticalDataLaundryJob.fromJson(Map<String, dynamic> json) {
    return BookingVerticalDataLaundryJob(
      serviceCategory: json['serviceCategory'] == null ? null : BookingVerticalDataLaundryJobServiceCategory.fromJson(json['serviceCategory'] as String),
      estimatedWeightKg: json['estimatedWeightKg'] as num?,
      bagCount: json['bagCount'] as int?,
      specialInstructions: json['specialInstructions'] as String?,
    );
  }

  Map<String, dynamic> toJson() => {
    'serviceCategory': serviceCategory?.value,
    'estimatedWeightKg': estimatedWeightKg,
    'bagCount': bagCount,
    'specialInstructions': specialInstructions,
  };
}

class ProviderConfigViewAddress {
  final String line1;
  final String? line2;
  final String city;
  final String? region;
  final String? postalCode;
  final String country;

  ProviderConfigViewAddress({
    required this.line1,
    this.line2,
    required this.city,
    this.region,
    this.postalCode,
    required this.country,
  });

  factory ProviderConfigViewAddress.fromJson(Map<String, dynamic> json) {
    return ProviderConfigViewAddress(
      line1: json['line1'] as String,
      line2: json['line2'] as String?,
      city: json['city'] as String,
      region: json['region'] as String?,
      postalCode: json['postalCode'] as String?,
      country: json['country'] as String,
    );
  }

  Map<String, dynamic> toJson() => {
    'line1': line1,
    'line2': line2,
    'city': city,
    'region': region,
    'postalCode': postalCode,
    'country': country,
  };
}

class ProviderConfigViewBookingPolicy {
  final int leadTimeMinutes;
  final int cancelCutoffHours;
  final int rescheduleCutoffHours;
  final int pendingHoldMinutes;
  final int defaultConcurrentSlots;

  ProviderConfigViewBookingPolicy({
    required this.leadTimeMinutes,
    required this.cancelCutoffHours,
    required this.rescheduleCutoffHours,
    required this.pendingHoldMinutes,
    required this.defaultConcurrentSlots,
  });

  factory ProviderConfigViewBookingPolicy.fromJson(Map<String, dynamic> json) {
    return ProviderConfigViewBookingPolicy(
      leadTimeMinutes: json['leadTimeMinutes'] as int,
      cancelCutoffHours: json['cancelCutoffHours'] as int,
      rescheduleCutoffHours: json['rescheduleCutoffHours'] as int,
      pendingHoldMinutes: json['pendingHoldMinutes'] as int,
      defaultConcurrentSlots: json['defaultConcurrentSlots'] as int,
    );
  }

  Map<String, dynamic> toJson() => {
    'leadTimeMinutes': leadTimeMinutes,
    'cancelCutoffHours': cancelCutoffHours,
    'rescheduleCutoffHours': rescheduleCutoffHours,
    'pendingHoldMinutes': pendingHoldMinutes,
    'defaultConcurrentSlots': defaultConcurrentSlots,
  };
}

class ServiceConfigViewPrice {
  final int amountCents;
  final String currency;

  ServiceConfigViewPrice({
    required this.amountCents,
    required this.currency,
  });

  factory ServiceConfigViewPrice.fromJson(Map<String, dynamic> json) {
    return ServiceConfigViewPrice(
      amountCents: json['amountCents'] as int,
      currency: json['currency'] as String,
    );
  }

  Map<String, dynamic> toJson() => {
    'amountCents': amountCents,
    'currency': currency,
  };
}

class AvailabilityRuleViewIntervalsItem {
  final String startLocal;
  final String endLocal;

  AvailabilityRuleViewIntervalsItem({
    required this.startLocal,
    required this.endLocal,
  });

  factory AvailabilityRuleViewIntervalsItem.fromJson(Map<String, dynamic> json) {
    return AvailabilityRuleViewIntervalsItem(
      startLocal: json['startLocal'] as String,
      endLocal: json['endLocal'] as String,
    );
  }

  Map<String, dynamic> toJson() => {
    'startLocal': startLocal,
    'endLocal': endLocal,
  };
}

class GetAvailabilityResponseSlotsItem {
  final String startUtc;
  final String endUtc;
  final String localLabel;
  final String? staffId;
  final int remaining;
  final int capacity;

  GetAvailabilityResponseSlotsItem({
    required this.startUtc,
    required this.endUtc,
    required this.localLabel,
    this.staffId,
    required this.remaining,
    required this.capacity,
  });

  factory GetAvailabilityResponseSlotsItem.fromJson(Map<String, dynamic> json) {
    return GetAvailabilityResponseSlotsItem(
      startUtc: json['startUtc'] as String,
      endUtc: json['endUtc'] as String,
      localLabel: json['localLabel'] as String,
      staffId: json['staffId'] as String?,
      remaining: json['remaining'] as int,
      capacity: json['capacity'] as int,
    );
  }

  Map<String, dynamic> toJson() => {
    'startUtc': startUtc,
    'endUtc': endUtc,
    'localLabel': localLabel,
    'staffId': staffId,
    'remaining': remaining,
    'capacity': capacity,
  };
}

class CreateBookingRequestVerticalData {
  final CreateBookingRequestVerticalDataPrintJob? printJob;
  final CreateBookingRequestVerticalDataLaundryJob? laundryJob;

  CreateBookingRequestVerticalData({
    this.printJob,
    this.laundryJob,
  });

  factory CreateBookingRequestVerticalData.fromJson(Map<String, dynamic> json) {
    return CreateBookingRequestVerticalData(
      printJob: json['printJob'] == null ? null : CreateBookingRequestVerticalDataPrintJob.fromJson(json['printJob'] as Map<String, dynamic>),
      laundryJob: json['laundryJob'] == null ? null : CreateBookingRequestVerticalDataLaundryJob.fromJson(json['laundryJob'] as Map<String, dynamic>),
    );
  }

  Map<String, dynamic> toJson() => {
    'printJob': printJob?.toJson(),
    'laundryJob': laundryJob?.toJson(),
  };
}

class CreateBookingResponseBooking {
  final String id;
  final String providerId;
  final String serviceId;
  final String? staffId;
  final String customerId;
  final String startUtc;
  final String endUtc;
  final String providerTimeZone;
  final CreateBookingResponseBookingStatus status;
  final CreateBookingResponseBookingConfirmationMode confirmationMode;
  final CreateBookingResponseBookingPriceSnapshot priceSnapshot;
  final String? holdExpiresAt;
  final String? customerNote;
  final CreateBookingResponseBookingSource source;
  final CreateBookingResponseBookingVerticalData? verticalData;
  final String createdAt;
  final String updatedAt;

  CreateBookingResponseBooking({
    required this.id,
    required this.providerId,
    required this.serviceId,
    this.staffId,
    required this.customerId,
    required this.startUtc,
    required this.endUtc,
    required this.providerTimeZone,
    required this.status,
    required this.confirmationMode,
    required this.priceSnapshot,
    this.holdExpiresAt,
    this.customerNote,
    required this.source,
    this.verticalData,
    required this.createdAt,
    required this.updatedAt,
  });

  factory CreateBookingResponseBooking.fromJson(Map<String, dynamic> json) {
    return CreateBookingResponseBooking(
      id: json['id'] as String,
      providerId: json['providerId'] as String,
      serviceId: json['serviceId'] as String,
      staffId: json['staffId'] as String?,
      customerId: json['customerId'] as String,
      startUtc: json['startUtc'] as String,
      endUtc: json['endUtc'] as String,
      providerTimeZone: json['providerTimeZone'] as String,
      status: CreateBookingResponseBookingStatus.fromJson(json['status'] as String),
      confirmationMode: CreateBookingResponseBookingConfirmationMode.fromJson(json['confirmationMode'] as String),
      priceSnapshot: CreateBookingResponseBookingPriceSnapshot.fromJson(json['priceSnapshot'] as Map<String, dynamic>),
      holdExpiresAt: json['holdExpiresAt'] as String?,
      customerNote: json['customerNote'] as String?,
      source: CreateBookingResponseBookingSource.fromJson(json['source'] as String),
      verticalData: json['verticalData'] == null ? null : CreateBookingResponseBookingVerticalData.fromJson(json['verticalData'] as Map<String, dynamic>),
      createdAt: json['createdAt'] as String,
      updatedAt: json['updatedAt'] as String,
    );
  }

  Map<String, dynamic> toJson() => {
    'id': id,
    'providerId': providerId,
    'serviceId': serviceId,
    'staffId': staffId,
    'customerId': customerId,
    'startUtc': startUtc,
    'endUtc': endUtc,
    'providerTimeZone': providerTimeZone,
    'status': status.value,
    'confirmationMode': confirmationMode.value,
    'priceSnapshot': priceSnapshot.toJson(),
    'holdExpiresAt': holdExpiresAt,
    'customerNote': customerNote,
    'source': source.value,
    'verticalData': verticalData?.toJson(),
    'createdAt': createdAt,
    'updatedAt': updatedAt,
  };
}

class CancelBookingResponseBooking {
  final String id;
  final String providerId;
  final String serviceId;
  final String? staffId;
  final String customerId;
  final String startUtc;
  final String endUtc;
  final String providerTimeZone;
  final CancelBookingResponseBookingStatus status;
  final CancelBookingResponseBookingConfirmationMode confirmationMode;
  final CancelBookingResponseBookingPriceSnapshot priceSnapshot;
  final String? holdExpiresAt;
  final String? customerNote;
  final CancelBookingResponseBookingSource source;
  final CancelBookingResponseBookingVerticalData? verticalData;
  final String createdAt;
  final String updatedAt;

  CancelBookingResponseBooking({
    required this.id,
    required this.providerId,
    required this.serviceId,
    this.staffId,
    required this.customerId,
    required this.startUtc,
    required this.endUtc,
    required this.providerTimeZone,
    required this.status,
    required this.confirmationMode,
    required this.priceSnapshot,
    this.holdExpiresAt,
    this.customerNote,
    required this.source,
    this.verticalData,
    required this.createdAt,
    required this.updatedAt,
  });

  factory CancelBookingResponseBooking.fromJson(Map<String, dynamic> json) {
    return CancelBookingResponseBooking(
      id: json['id'] as String,
      providerId: json['providerId'] as String,
      serviceId: json['serviceId'] as String,
      staffId: json['staffId'] as String?,
      customerId: json['customerId'] as String,
      startUtc: json['startUtc'] as String,
      endUtc: json['endUtc'] as String,
      providerTimeZone: json['providerTimeZone'] as String,
      status: CancelBookingResponseBookingStatus.fromJson(json['status'] as String),
      confirmationMode: CancelBookingResponseBookingConfirmationMode.fromJson(json['confirmationMode'] as String),
      priceSnapshot: CancelBookingResponseBookingPriceSnapshot.fromJson(json['priceSnapshot'] as Map<String, dynamic>),
      holdExpiresAt: json['holdExpiresAt'] as String?,
      customerNote: json['customerNote'] as String?,
      source: CancelBookingResponseBookingSource.fromJson(json['source'] as String),
      verticalData: json['verticalData'] == null ? null : CancelBookingResponseBookingVerticalData.fromJson(json['verticalData'] as Map<String, dynamic>),
      createdAt: json['createdAt'] as String,
      updatedAt: json['updatedAt'] as String,
    );
  }

  Map<String, dynamic> toJson() => {
    'id': id,
    'providerId': providerId,
    'serviceId': serviceId,
    'staffId': staffId,
    'customerId': customerId,
    'startUtc': startUtc,
    'endUtc': endUtc,
    'providerTimeZone': providerTimeZone,
    'status': status.value,
    'confirmationMode': confirmationMode.value,
    'priceSnapshot': priceSnapshot.toJson(),
    'holdExpiresAt': holdExpiresAt,
    'customerNote': customerNote,
    'source': source.value,
    'verticalData': verticalData?.toJson(),
    'createdAt': createdAt,
    'updatedAt': updatedAt,
  };
}

class RescheduleBookingResponseBooking {
  final String id;
  final String providerId;
  final String serviceId;
  final String? staffId;
  final String customerId;
  final String startUtc;
  final String endUtc;
  final String providerTimeZone;
  final RescheduleBookingResponseBookingStatus status;
  final RescheduleBookingResponseBookingConfirmationMode confirmationMode;
  final RescheduleBookingResponseBookingPriceSnapshot priceSnapshot;
  final String? holdExpiresAt;
  final String? customerNote;
  final RescheduleBookingResponseBookingSource source;
  final RescheduleBookingResponseBookingVerticalData? verticalData;
  final String createdAt;
  final String updatedAt;

  RescheduleBookingResponseBooking({
    required this.id,
    required this.providerId,
    required this.serviceId,
    this.staffId,
    required this.customerId,
    required this.startUtc,
    required this.endUtc,
    required this.providerTimeZone,
    required this.status,
    required this.confirmationMode,
    required this.priceSnapshot,
    this.holdExpiresAt,
    this.customerNote,
    required this.source,
    this.verticalData,
    required this.createdAt,
    required this.updatedAt,
  });

  factory RescheduleBookingResponseBooking.fromJson(Map<String, dynamic> json) {
    return RescheduleBookingResponseBooking(
      id: json['id'] as String,
      providerId: json['providerId'] as String,
      serviceId: json['serviceId'] as String,
      staffId: json['staffId'] as String?,
      customerId: json['customerId'] as String,
      startUtc: json['startUtc'] as String,
      endUtc: json['endUtc'] as String,
      providerTimeZone: json['providerTimeZone'] as String,
      status: RescheduleBookingResponseBookingStatus.fromJson(json['status'] as String),
      confirmationMode: RescheduleBookingResponseBookingConfirmationMode.fromJson(json['confirmationMode'] as String),
      priceSnapshot: RescheduleBookingResponseBookingPriceSnapshot.fromJson(json['priceSnapshot'] as Map<String, dynamic>),
      holdExpiresAt: json['holdExpiresAt'] as String?,
      customerNote: json['customerNote'] as String?,
      source: RescheduleBookingResponseBookingSource.fromJson(json['source'] as String),
      verticalData: json['verticalData'] == null ? null : RescheduleBookingResponseBookingVerticalData.fromJson(json['verticalData'] as Map<String, dynamic>),
      createdAt: json['createdAt'] as String,
      updatedAt: json['updatedAt'] as String,
    );
  }

  Map<String, dynamic> toJson() => {
    'id': id,
    'providerId': providerId,
    'serviceId': serviceId,
    'staffId': staffId,
    'customerId': customerId,
    'startUtc': startUtc,
    'endUtc': endUtc,
    'providerTimeZone': providerTimeZone,
    'status': status.value,
    'confirmationMode': confirmationMode.value,
    'priceSnapshot': priceSnapshot.toJson(),
    'holdExpiresAt': holdExpiresAt,
    'customerNote': customerNote,
    'source': source.value,
    'verticalData': verticalData?.toJson(),
    'createdAt': createdAt,
    'updatedAt': updatedAt,
  };
}

class RespondToBookingResponseBooking {
  final String id;
  final String providerId;
  final String serviceId;
  final String? staffId;
  final String customerId;
  final String startUtc;
  final String endUtc;
  final String providerTimeZone;
  final RespondToBookingResponseBookingStatus status;
  final RespondToBookingResponseBookingConfirmationMode confirmationMode;
  final RespondToBookingResponseBookingPriceSnapshot priceSnapshot;
  final String? holdExpiresAt;
  final String? customerNote;
  final RespondToBookingResponseBookingSource source;
  final RespondToBookingResponseBookingVerticalData? verticalData;
  final String createdAt;
  final String updatedAt;

  RespondToBookingResponseBooking({
    required this.id,
    required this.providerId,
    required this.serviceId,
    this.staffId,
    required this.customerId,
    required this.startUtc,
    required this.endUtc,
    required this.providerTimeZone,
    required this.status,
    required this.confirmationMode,
    required this.priceSnapshot,
    this.holdExpiresAt,
    this.customerNote,
    required this.source,
    this.verticalData,
    required this.createdAt,
    required this.updatedAt,
  });

  factory RespondToBookingResponseBooking.fromJson(Map<String, dynamic> json) {
    return RespondToBookingResponseBooking(
      id: json['id'] as String,
      providerId: json['providerId'] as String,
      serviceId: json['serviceId'] as String,
      staffId: json['staffId'] as String?,
      customerId: json['customerId'] as String,
      startUtc: json['startUtc'] as String,
      endUtc: json['endUtc'] as String,
      providerTimeZone: json['providerTimeZone'] as String,
      status: RespondToBookingResponseBookingStatus.fromJson(json['status'] as String),
      confirmationMode: RespondToBookingResponseBookingConfirmationMode.fromJson(json['confirmationMode'] as String),
      priceSnapshot: RespondToBookingResponseBookingPriceSnapshot.fromJson(json['priceSnapshot'] as Map<String, dynamic>),
      holdExpiresAt: json['holdExpiresAt'] as String?,
      customerNote: json['customerNote'] as String?,
      source: RespondToBookingResponseBookingSource.fromJson(json['source'] as String),
      verticalData: json['verticalData'] == null ? null : RespondToBookingResponseBookingVerticalData.fromJson(json['verticalData'] as Map<String, dynamic>),
      createdAt: json['createdAt'] as String,
      updatedAt: json['updatedAt'] as String,
    );
  }

  Map<String, dynamic> toJson() => {
    'id': id,
    'providerId': providerId,
    'serviceId': serviceId,
    'staffId': staffId,
    'customerId': customerId,
    'startUtc': startUtc,
    'endUtc': endUtc,
    'providerTimeZone': providerTimeZone,
    'status': status.value,
    'confirmationMode': confirmationMode.value,
    'priceSnapshot': priceSnapshot.toJson(),
    'holdExpiresAt': holdExpiresAt,
    'customerNote': customerNote,
    'source': source.value,
    'verticalData': verticalData?.toJson(),
    'createdAt': createdAt,
    'updatedAt': updatedAt,
  };
}

class SaveProviderRequestAddress {
  final String line1;
  final String? line2;
  final String city;
  final String? region;
  final String? postalCode;
  final String country;

  SaveProviderRequestAddress({
    required this.line1,
    this.line2,
    required this.city,
    this.region,
    this.postalCode,
    required this.country,
  });

  factory SaveProviderRequestAddress.fromJson(Map<String, dynamic> json) {
    return SaveProviderRequestAddress(
      line1: json['line1'] as String,
      line2: json['line2'] as String?,
      city: json['city'] as String,
      region: json['region'] as String?,
      postalCode: json['postalCode'] as String?,
      country: json['country'] as String,
    );
  }

  Map<String, dynamic> toJson() => {
    'line1': line1,
    'line2': line2,
    'city': city,
    'region': region,
    'postalCode': postalCode,
    'country': country,
  };
}

class SaveProviderRequestBookingPolicy {
  final int leadTimeMinutes;
  final int cancelCutoffHours;
  final int rescheduleCutoffHours;
  final int pendingHoldMinutes;
  final int defaultConcurrentSlots;

  SaveProviderRequestBookingPolicy({
    required this.leadTimeMinutes,
    required this.cancelCutoffHours,
    required this.rescheduleCutoffHours,
    required this.pendingHoldMinutes,
    required this.defaultConcurrentSlots,
  });

  factory SaveProviderRequestBookingPolicy.fromJson(Map<String, dynamic> json) {
    return SaveProviderRequestBookingPolicy(
      leadTimeMinutes: json['leadTimeMinutes'] as int,
      cancelCutoffHours: json['cancelCutoffHours'] as int,
      rescheduleCutoffHours: json['rescheduleCutoffHours'] as int,
      pendingHoldMinutes: json['pendingHoldMinutes'] as int,
      defaultConcurrentSlots: json['defaultConcurrentSlots'] as int,
    );
  }

  Map<String, dynamic> toJson() => {
    'leadTimeMinutes': leadTimeMinutes,
    'cancelCutoffHours': cancelCutoffHours,
    'rescheduleCutoffHours': rescheduleCutoffHours,
    'pendingHoldMinutes': pendingHoldMinutes,
    'defaultConcurrentSlots': defaultConcurrentSlots,
  };
}

class SaveServiceRequestPrice {
  final int amountCents;
  final String currency;

  SaveServiceRequestPrice({
    required this.amountCents,
    required this.currency,
  });

  factory SaveServiceRequestPrice.fromJson(Map<String, dynamic> json) {
    return SaveServiceRequestPrice(
      amountCents: json['amountCents'] as int,
      currency: json['currency'] as String,
    );
  }

  Map<String, dynamic> toJson() => {
    'amountCents': amountCents,
    'currency': currency,
  };
}

class SaveAvailabilityRequestIntervalsItem {
  final String startLocal;
  final String endLocal;

  SaveAvailabilityRequestIntervalsItem({
    required this.startLocal,
    required this.endLocal,
  });

  factory SaveAvailabilityRequestIntervalsItem.fromJson(Map<String, dynamic> json) {
    return SaveAvailabilityRequestIntervalsItem(
      startLocal: json['startLocal'] as String,
      endLocal: json['endLocal'] as String,
    );
  }

  Map<String, dynamic> toJson() => {
    'startLocal': startLocal,
    'endLocal': endLocal,
  };
}

class ListPublishedProvidersResponseProvidersItem {
  final String id;
  final String name;
  final String slug;
  final String description;
  final String? logoUrl;
  final String timeZone;
  final String? city;
  final ListPublishedProvidersResponseProvidersItemVertical? vertical;

  ListPublishedProvidersResponseProvidersItem({
    required this.id,
    required this.name,
    required this.slug,
    required this.description,
    this.logoUrl,
    required this.timeZone,
    this.city,
    this.vertical,
  });

  factory ListPublishedProvidersResponseProvidersItem.fromJson(Map<String, dynamic> json) {
    return ListPublishedProvidersResponseProvidersItem(
      id: json['id'] as String,
      name: json['name'] as String,
      slug: json['slug'] as String,
      description: json['description'] as String,
      logoUrl: json['logoUrl'] as String?,
      timeZone: json['timeZone'] as String,
      city: json['city'] as String?,
      vertical: json['vertical'] == null ? null : ListPublishedProvidersResponseProvidersItemVertical.fromJson(json['vertical'] as String),
    );
  }

  Map<String, dynamic> toJson() => {
    'id': id,
    'name': name,
    'slug': slug,
    'description': description,
    'logoUrl': logoUrl,
    'timeZone': timeZone,
    'city': city,
    'vertical': vertical?.value,
  };
}

class GetProviderDetailsResponseProvider {
  final String id;
  final String name;
  final String slug;
  final String description;
  final String? logoUrl;
  final String timeZone;
  final String? city;
  final GetProviderDetailsResponseProviderVertical? vertical;

  GetProviderDetailsResponseProvider({
    required this.id,
    required this.name,
    required this.slug,
    required this.description,
    this.logoUrl,
    required this.timeZone,
    this.city,
    this.vertical,
  });

  factory GetProviderDetailsResponseProvider.fromJson(Map<String, dynamic> json) {
    return GetProviderDetailsResponseProvider(
      id: json['id'] as String,
      name: json['name'] as String,
      slug: json['slug'] as String,
      description: json['description'] as String,
      logoUrl: json['logoUrl'] as String?,
      timeZone: json['timeZone'] as String,
      city: json['city'] as String?,
      vertical: json['vertical'] == null ? null : GetProviderDetailsResponseProviderVertical.fromJson(json['vertical'] as String),
    );
  }

  Map<String, dynamic> toJson() => {
    'id': id,
    'name': name,
    'slug': slug,
    'description': description,
    'logoUrl': logoUrl,
    'timeZone': timeZone,
    'city': city,
    'vertical': vertical?.value,
  };
}

class GetProviderDetailsResponseServicesItem {
  final String id;
  final String providerId;
  final String name;
  final String description;
  final int durationMinutes;
  final GetProviderDetailsResponseServicesItemPrice price;
  final GetProviderDetailsResponseServicesItemConfirmationMode confirmationMode;
  final GetProviderDetailsResponseServicesItemCapacityScope capacityScope;
  final List<String> staffIds;
  final bool active;
  final String? imageUrl;
  final GetProviderDetailsResponseServicesItemServiceType? serviceType;

  GetProviderDetailsResponseServicesItem({
    required this.id,
    required this.providerId,
    required this.name,
    required this.description,
    required this.durationMinutes,
    required this.price,
    required this.confirmationMode,
    required this.capacityScope,
    required this.staffIds,
    required this.active,
    this.imageUrl,
    this.serviceType,
  });

  factory GetProviderDetailsResponseServicesItem.fromJson(Map<String, dynamic> json) {
    return GetProviderDetailsResponseServicesItem(
      id: json['id'] as String,
      providerId: json['providerId'] as String,
      name: json['name'] as String,
      description: json['description'] as String,
      durationMinutes: json['durationMinutes'] as int,
      price: GetProviderDetailsResponseServicesItemPrice.fromJson(json['price'] as Map<String, dynamic>),
      confirmationMode: GetProviderDetailsResponseServicesItemConfirmationMode.fromJson(json['confirmationMode'] as String),
      capacityScope: GetProviderDetailsResponseServicesItemCapacityScope.fromJson(json['capacityScope'] as String),
      staffIds: (json['staffIds'] as List<dynamic>).map((e) => e as String).toList(),
      active: json['active'] as bool,
      imageUrl: json['imageUrl'] as String?,
      serviceType: json['serviceType'] == null ? null : GetProviderDetailsResponseServicesItemServiceType.fromJson(json['serviceType'] as String),
    );
  }

  Map<String, dynamic> toJson() => {
    'id': id,
    'providerId': providerId,
    'name': name,
    'description': description,
    'durationMinutes': durationMinutes,
    'price': price.toJson(),
    'confirmationMode': confirmationMode.value,
    'capacityScope': capacityScope.value,
    'staffIds': staffIds.map((e) => e).toList(),
    'active': active,
    'imageUrl': imageUrl,
    'serviceType': serviceType?.value,
  };
}

class GetProviderDetailsResponseStaffItem {
  final String id;
  final String providerId;
  final String name;
  final String? photoUrl;
  final bool active;
  final List<String> serviceIds;

  GetProviderDetailsResponseStaffItem({
    required this.id,
    required this.providerId,
    required this.name,
    this.photoUrl,
    required this.active,
    required this.serviceIds,
  });

  factory GetProviderDetailsResponseStaffItem.fromJson(Map<String, dynamic> json) {
    return GetProviderDetailsResponseStaffItem(
      id: json['id'] as String,
      providerId: json['providerId'] as String,
      name: json['name'] as String,
      photoUrl: json['photoUrl'] as String?,
      active: json['active'] as bool,
      serviceIds: (json['serviceIds'] as List<dynamic>).map((e) => e as String).toList(),
    );
  }

  Map<String, dynamic> toJson() => {
    'id': id,
    'providerId': providerId,
    'name': name,
    'photoUrl': photoUrl,
    'active': active,
    'serviceIds': serviceIds.map((e) => e).toList(),
  };
}

class GetProviderDashboardResponseProvider {
  final String id;
  final String ownerId;
  final String name;
  final String slug;
  final String description;
  final String? logoUrl;
  final GetProviderDashboardResponseProviderAddress? address;
  final String timeZone;
  final GetProviderDashboardResponseProviderStatus status;
  final GetProviderDashboardResponseProviderBookingPolicy bookingPolicy;
  final GetProviderDashboardResponseProviderVertical? vertical;

  GetProviderDashboardResponseProvider({
    required this.id,
    required this.ownerId,
    required this.name,
    required this.slug,
    required this.description,
    this.logoUrl,
    this.address,
    required this.timeZone,
    required this.status,
    required this.bookingPolicy,
    this.vertical,
  });

  factory GetProviderDashboardResponseProvider.fromJson(Map<String, dynamic> json) {
    return GetProviderDashboardResponseProvider(
      id: json['id'] as String,
      ownerId: json['ownerId'] as String,
      name: json['name'] as String,
      slug: json['slug'] as String,
      description: json['description'] as String,
      logoUrl: json['logoUrl'] as String?,
      address: json['address'] == null ? null : GetProviderDashboardResponseProviderAddress.fromJson(json['address'] as Map<String, dynamic>),
      timeZone: json['timeZone'] as String,
      status: GetProviderDashboardResponseProviderStatus.fromJson(json['status'] as String),
      bookingPolicy: GetProviderDashboardResponseProviderBookingPolicy.fromJson(json['bookingPolicy'] as Map<String, dynamic>),
      vertical: json['vertical'] == null ? null : GetProviderDashboardResponseProviderVertical.fromJson(json['vertical'] as String),
    );
  }

  Map<String, dynamic> toJson() => {
    'id': id,
    'ownerId': ownerId,
    'name': name,
    'slug': slug,
    'description': description,
    'logoUrl': logoUrl,
    'address': address?.toJson(),
    'timeZone': timeZone,
    'status': status.value,
    'bookingPolicy': bookingPolicy.toJson(),
    'vertical': vertical?.value,
  };
}

class GetProviderDashboardResponseServicesItem {
  final String id;
  final String providerId;
  final String name;
  final String description;
  final int durationMinutes;
  final GetProviderDashboardResponseServicesItemPrice price;
  final GetProviderDashboardResponseServicesItemConfirmationMode confirmationMode;
  final GetProviderDashboardResponseServicesItemCapacityScope capacityScope;
  final List<String> staffIds;
  final bool active;
  final String? imageUrl;
  final GetProviderDashboardResponseServicesItemServiceType? serviceType;
  final int bufferBeforeMinutes;
  final int bufferAfterMinutes;

  GetProviderDashboardResponseServicesItem({
    required this.id,
    required this.providerId,
    required this.name,
    required this.description,
    required this.durationMinutes,
    required this.price,
    required this.confirmationMode,
    required this.capacityScope,
    required this.staffIds,
    required this.active,
    this.imageUrl,
    this.serviceType,
    required this.bufferBeforeMinutes,
    required this.bufferAfterMinutes,
  });

  factory GetProviderDashboardResponseServicesItem.fromJson(Map<String, dynamic> json) {
    return GetProviderDashboardResponseServicesItem(
      id: json['id'] as String,
      providerId: json['providerId'] as String,
      name: json['name'] as String,
      description: json['description'] as String,
      durationMinutes: json['durationMinutes'] as int,
      price: GetProviderDashboardResponseServicesItemPrice.fromJson(json['price'] as Map<String, dynamic>),
      confirmationMode: GetProviderDashboardResponseServicesItemConfirmationMode.fromJson(json['confirmationMode'] as String),
      capacityScope: GetProviderDashboardResponseServicesItemCapacityScope.fromJson(json['capacityScope'] as String),
      staffIds: (json['staffIds'] as List<dynamic>).map((e) => e as String).toList(),
      active: json['active'] as bool,
      imageUrl: json['imageUrl'] as String?,
      serviceType: json['serviceType'] == null ? null : GetProviderDashboardResponseServicesItemServiceType.fromJson(json['serviceType'] as String),
      bufferBeforeMinutes: json['bufferBeforeMinutes'] as int,
      bufferAfterMinutes: json['bufferAfterMinutes'] as int,
    );
  }

  Map<String, dynamic> toJson() => {
    'id': id,
    'providerId': providerId,
    'name': name,
    'description': description,
    'durationMinutes': durationMinutes,
    'price': price.toJson(),
    'confirmationMode': confirmationMode.value,
    'capacityScope': capacityScope.value,
    'staffIds': staffIds.map((e) => e).toList(),
    'active': active,
    'imageUrl': imageUrl,
    'serviceType': serviceType?.value,
    'bufferBeforeMinutes': bufferBeforeMinutes,
    'bufferAfterMinutes': bufferAfterMinutes,
  };
}

class GetProviderDashboardResponseStaffItem {
  final String id;
  final String providerId;
  final String name;
  final String? photoUrl;
  final bool active;
  final List<String> serviceIds;
  final String? userId;
  final int concurrentSlots;

  GetProviderDashboardResponseStaffItem({
    required this.id,
    required this.providerId,
    required this.name,
    this.photoUrl,
    required this.active,
    required this.serviceIds,
    this.userId,
    required this.concurrentSlots,
  });

  factory GetProviderDashboardResponseStaffItem.fromJson(Map<String, dynamic> json) {
    return GetProviderDashboardResponseStaffItem(
      id: json['id'] as String,
      providerId: json['providerId'] as String,
      name: json['name'] as String,
      photoUrl: json['photoUrl'] as String?,
      active: json['active'] as bool,
      serviceIds: (json['serviceIds'] as List<dynamic>).map((e) => e as String).toList(),
      userId: json['userId'] as String?,
      concurrentSlots: json['concurrentSlots'] as int,
    );
  }

  Map<String, dynamic> toJson() => {
    'id': id,
    'providerId': providerId,
    'name': name,
    'photoUrl': photoUrl,
    'active': active,
    'serviceIds': serviceIds.map((e) => e).toList(),
    'userId': userId,
    'concurrentSlots': concurrentSlots,
  };
}

class GetProviderDashboardResponseAvailabilityItem {
  final String id;
  final String providerId;
  final GetProviderDashboardResponseAvailabilityItemKind kind;
  final String? staffId;
  final int? dayOfWeek;
  final String? startLocal;
  final String? endLocal;
  final String? date;
  final List<GetProviderDashboardResponseAvailabilityItemIntervalsItem>? intervals;
  final String? reason;

  GetProviderDashboardResponseAvailabilityItem({
    required this.id,
    required this.providerId,
    required this.kind,
    this.staffId,
    this.dayOfWeek,
    this.startLocal,
    this.endLocal,
    this.date,
    this.intervals,
    this.reason,
  });

  factory GetProviderDashboardResponseAvailabilityItem.fromJson(Map<String, dynamic> json) {
    return GetProviderDashboardResponseAvailabilityItem(
      id: json['id'] as String,
      providerId: json['providerId'] as String,
      kind: GetProviderDashboardResponseAvailabilityItemKind.fromJson(json['kind'] as String),
      staffId: json['staffId'] as String?,
      dayOfWeek: json['dayOfWeek'] as int?,
      startLocal: json['startLocal'] as String?,
      endLocal: json['endLocal'] as String?,
      date: json['date'] as String?,
      intervals: (json['intervals'] as List<dynamic>?)?.map((e) => GetProviderDashboardResponseAvailabilityItemIntervalsItem.fromJson(e as Map<String, dynamic>)).toList(),
      reason: json['reason'] as String?,
    );
  }

  Map<String, dynamic> toJson() => {
    'id': id,
    'providerId': providerId,
    'kind': kind.value,
    'staffId': staffId,
    'dayOfWeek': dayOfWeek,
    'startLocal': startLocal,
    'endLocal': endLocal,
    'date': date,
    'intervals': intervals?.map((e) => e.toJson()).toList(),
    'reason': reason,
  };
}

class GetProviderDashboardResponseBookingsItem {
  final String id;
  final String providerId;
  final String serviceId;
  final String? staffId;
  final String customerId;
  final String startUtc;
  final String endUtc;
  final String providerTimeZone;
  final GetProviderDashboardResponseBookingsItemStatus status;
  final GetProviderDashboardResponseBookingsItemConfirmationMode confirmationMode;
  final GetProviderDashboardResponseBookingsItemPriceSnapshot priceSnapshot;
  final String? holdExpiresAt;
  final String? customerNote;
  final GetProviderDashboardResponseBookingsItemSource source;
  final GetProviderDashboardResponseBookingsItemVerticalData? verticalData;
  final String createdAt;
  final String updatedAt;

  GetProviderDashboardResponseBookingsItem({
    required this.id,
    required this.providerId,
    required this.serviceId,
    this.staffId,
    required this.customerId,
    required this.startUtc,
    required this.endUtc,
    required this.providerTimeZone,
    required this.status,
    required this.confirmationMode,
    required this.priceSnapshot,
    this.holdExpiresAt,
    this.customerNote,
    required this.source,
    this.verticalData,
    required this.createdAt,
    required this.updatedAt,
  });

  factory GetProviderDashboardResponseBookingsItem.fromJson(Map<String, dynamic> json) {
    return GetProviderDashboardResponseBookingsItem(
      id: json['id'] as String,
      providerId: json['providerId'] as String,
      serviceId: json['serviceId'] as String,
      staffId: json['staffId'] as String?,
      customerId: json['customerId'] as String,
      startUtc: json['startUtc'] as String,
      endUtc: json['endUtc'] as String,
      providerTimeZone: json['providerTimeZone'] as String,
      status: GetProviderDashboardResponseBookingsItemStatus.fromJson(json['status'] as String),
      confirmationMode: GetProviderDashboardResponseBookingsItemConfirmationMode.fromJson(json['confirmationMode'] as String),
      priceSnapshot: GetProviderDashboardResponseBookingsItemPriceSnapshot.fromJson(json['priceSnapshot'] as Map<String, dynamic>),
      holdExpiresAt: json['holdExpiresAt'] as String?,
      customerNote: json['customerNote'] as String?,
      source: GetProviderDashboardResponseBookingsItemSource.fromJson(json['source'] as String),
      verticalData: json['verticalData'] == null ? null : GetProviderDashboardResponseBookingsItemVerticalData.fromJson(json['verticalData'] as Map<String, dynamic>),
      createdAt: json['createdAt'] as String,
      updatedAt: json['updatedAt'] as String,
    );
  }

  Map<String, dynamic> toJson() => {
    'id': id,
    'providerId': providerId,
    'serviceId': serviceId,
    'staffId': staffId,
    'customerId': customerId,
    'startUtc': startUtc,
    'endUtc': endUtc,
    'providerTimeZone': providerTimeZone,
    'status': status.value,
    'confirmationMode': confirmationMode.value,
    'priceSnapshot': priceSnapshot.toJson(),
    'holdExpiresAt': holdExpiresAt,
    'customerNote': customerNote,
    'source': source.value,
    'verticalData': verticalData?.toJson(),
    'createdAt': createdAt,
    'updatedAt': updatedAt,
  };
}

class ListProviderBookingsResponseBookingsItem {
  final String id;
  final String providerId;
  final String serviceId;
  final String? staffId;
  final String customerId;
  final String startUtc;
  final String endUtc;
  final String providerTimeZone;
  final ListProviderBookingsResponseBookingsItemStatus status;
  final ListProviderBookingsResponseBookingsItemConfirmationMode confirmationMode;
  final ListProviderBookingsResponseBookingsItemPriceSnapshot priceSnapshot;
  final String? holdExpiresAt;
  final String? customerNote;
  final ListProviderBookingsResponseBookingsItemSource source;
  final ListProviderBookingsResponseBookingsItemVerticalData? verticalData;
  final String createdAt;
  final String updatedAt;

  ListProviderBookingsResponseBookingsItem({
    required this.id,
    required this.providerId,
    required this.serviceId,
    this.staffId,
    required this.customerId,
    required this.startUtc,
    required this.endUtc,
    required this.providerTimeZone,
    required this.status,
    required this.confirmationMode,
    required this.priceSnapshot,
    this.holdExpiresAt,
    this.customerNote,
    required this.source,
    this.verticalData,
    required this.createdAt,
    required this.updatedAt,
  });

  factory ListProviderBookingsResponseBookingsItem.fromJson(Map<String, dynamic> json) {
    return ListProviderBookingsResponseBookingsItem(
      id: json['id'] as String,
      providerId: json['providerId'] as String,
      serviceId: json['serviceId'] as String,
      staffId: json['staffId'] as String?,
      customerId: json['customerId'] as String,
      startUtc: json['startUtc'] as String,
      endUtc: json['endUtc'] as String,
      providerTimeZone: json['providerTimeZone'] as String,
      status: ListProviderBookingsResponseBookingsItemStatus.fromJson(json['status'] as String),
      confirmationMode: ListProviderBookingsResponseBookingsItemConfirmationMode.fromJson(json['confirmationMode'] as String),
      priceSnapshot: ListProviderBookingsResponseBookingsItemPriceSnapshot.fromJson(json['priceSnapshot'] as Map<String, dynamic>),
      holdExpiresAt: json['holdExpiresAt'] as String?,
      customerNote: json['customerNote'] as String?,
      source: ListProviderBookingsResponseBookingsItemSource.fromJson(json['source'] as String),
      verticalData: json['verticalData'] == null ? null : ListProviderBookingsResponseBookingsItemVerticalData.fromJson(json['verticalData'] as Map<String, dynamic>),
      createdAt: json['createdAt'] as String,
      updatedAt: json['updatedAt'] as String,
    );
  }

  Map<String, dynamic> toJson() => {
    'id': id,
    'providerId': providerId,
    'serviceId': serviceId,
    'staffId': staffId,
    'customerId': customerId,
    'startUtc': startUtc,
    'endUtc': endUtc,
    'providerTimeZone': providerTimeZone,
    'status': status.value,
    'confirmationMode': confirmationMode.value,
    'priceSnapshot': priceSnapshot.toJson(),
    'holdExpiresAt': holdExpiresAt,
    'customerNote': customerNote,
    'source': source.value,
    'verticalData': verticalData?.toJson(),
    'createdAt': createdAt,
    'updatedAt': updatedAt,
  };
}

class GetMyBookingsResponseBookingsItem {
  final String id;
  final String providerId;
  final String serviceId;
  final String? staffId;
  final String customerId;
  final String startUtc;
  final String endUtc;
  final String providerTimeZone;
  final GetMyBookingsResponseBookingsItemStatus status;
  final GetMyBookingsResponseBookingsItemConfirmationMode confirmationMode;
  final GetMyBookingsResponseBookingsItemPriceSnapshot priceSnapshot;
  final String? holdExpiresAt;
  final String? customerNote;
  final GetMyBookingsResponseBookingsItemSource source;
  final GetMyBookingsResponseBookingsItemVerticalData? verticalData;
  final String createdAt;
  final String updatedAt;

  GetMyBookingsResponseBookingsItem({
    required this.id,
    required this.providerId,
    required this.serviceId,
    this.staffId,
    required this.customerId,
    required this.startUtc,
    required this.endUtc,
    required this.providerTimeZone,
    required this.status,
    required this.confirmationMode,
    required this.priceSnapshot,
    this.holdExpiresAt,
    this.customerNote,
    required this.source,
    this.verticalData,
    required this.createdAt,
    required this.updatedAt,
  });

  factory GetMyBookingsResponseBookingsItem.fromJson(Map<String, dynamic> json) {
    return GetMyBookingsResponseBookingsItem(
      id: json['id'] as String,
      providerId: json['providerId'] as String,
      serviceId: json['serviceId'] as String,
      staffId: json['staffId'] as String?,
      customerId: json['customerId'] as String,
      startUtc: json['startUtc'] as String,
      endUtc: json['endUtc'] as String,
      providerTimeZone: json['providerTimeZone'] as String,
      status: GetMyBookingsResponseBookingsItemStatus.fromJson(json['status'] as String),
      confirmationMode: GetMyBookingsResponseBookingsItemConfirmationMode.fromJson(json['confirmationMode'] as String),
      priceSnapshot: GetMyBookingsResponseBookingsItemPriceSnapshot.fromJson(json['priceSnapshot'] as Map<String, dynamic>),
      holdExpiresAt: json['holdExpiresAt'] as String?,
      customerNote: json['customerNote'] as String?,
      source: GetMyBookingsResponseBookingsItemSource.fromJson(json['source'] as String),
      verticalData: json['verticalData'] == null ? null : GetMyBookingsResponseBookingsItemVerticalData.fromJson(json['verticalData'] as Map<String, dynamic>),
      createdAt: json['createdAt'] as String,
      updatedAt: json['updatedAt'] as String,
    );
  }

  Map<String, dynamic> toJson() => {
    'id': id,
    'providerId': providerId,
    'serviceId': serviceId,
    'staffId': staffId,
    'customerId': customerId,
    'startUtc': startUtc,
    'endUtc': endUtc,
    'providerTimeZone': providerTimeZone,
    'status': status.value,
    'confirmationMode': confirmationMode.value,
    'priceSnapshot': priceSnapshot.toJson(),
    'holdExpiresAt': holdExpiresAt,
    'customerNote': customerNote,
    'source': source.value,
    'verticalData': verticalData?.toJson(),
    'createdAt': createdAt,
    'updatedAt': updatedAt,
  };
}

class BookingViewVerticalDataPrintJob {
  final List<String> fileUrls;
  final int? copies;
  final BookingViewVerticalDataPrintJobColorMode? colorMode;
  final BookingViewVerticalDataPrintJobPaperSize? paperSize;
  final BookingViewVerticalDataPrintJobFinish? finish;
  final String? notes;

  BookingViewVerticalDataPrintJob({
    required this.fileUrls,
    this.copies,
    this.colorMode,
    this.paperSize,
    this.finish,
    this.notes,
  });

  factory BookingViewVerticalDataPrintJob.fromJson(Map<String, dynamic> json) {
    return BookingViewVerticalDataPrintJob(
      fileUrls: (json['fileUrls'] as List<dynamic>).map((e) => e as String).toList(),
      copies: json['copies'] as int?,
      colorMode: json['colorMode'] == null ? null : BookingViewVerticalDataPrintJobColorMode.fromJson(json['colorMode'] as String),
      paperSize: json['paperSize'] == null ? null : BookingViewVerticalDataPrintJobPaperSize.fromJson(json['paperSize'] as String),
      finish: json['finish'] == null ? null : BookingViewVerticalDataPrintJobFinish.fromJson(json['finish'] as String),
      notes: json['notes'] as String?,
    );
  }

  Map<String, dynamic> toJson() => {
    'fileUrls': fileUrls.map((e) => e).toList(),
    'copies': copies,
    'colorMode': colorMode?.value,
    'paperSize': paperSize?.value,
    'finish': finish?.value,
    'notes': notes,
  };
}

class BookingViewVerticalDataLaundryJob {
  final BookingViewVerticalDataLaundryJobServiceCategory? serviceCategory;
  final num? estimatedWeightKg;
  final int? bagCount;
  final String? specialInstructions;

  BookingViewVerticalDataLaundryJob({
    this.serviceCategory,
    this.estimatedWeightKg,
    this.bagCount,
    this.specialInstructions,
  });

  factory BookingViewVerticalDataLaundryJob.fromJson(Map<String, dynamic> json) {
    return BookingViewVerticalDataLaundryJob(
      serviceCategory: json['serviceCategory'] == null ? null : BookingViewVerticalDataLaundryJobServiceCategory.fromJson(json['serviceCategory'] as String),
      estimatedWeightKg: json['estimatedWeightKg'] as num?,
      bagCount: json['bagCount'] as int?,
      specialInstructions: json['specialInstructions'] as String?,
    );
  }

  Map<String, dynamic> toJson() => {
    'serviceCategory': serviceCategory?.value,
    'estimatedWeightKg': estimatedWeightKg,
    'bagCount': bagCount,
    'specialInstructions': specialInstructions,
  };
}

class CreateBookingRequestVerticalDataPrintJob {
  final List<String> fileUrls;
  final int? copies;
  final CreateBookingRequestVerticalDataPrintJobColorMode? colorMode;
  final CreateBookingRequestVerticalDataPrintJobPaperSize? paperSize;
  final CreateBookingRequestVerticalDataPrintJobFinish? finish;
  final String? notes;

  CreateBookingRequestVerticalDataPrintJob({
    required this.fileUrls,
    this.copies,
    this.colorMode,
    this.paperSize,
    this.finish,
    this.notes,
  });

  factory CreateBookingRequestVerticalDataPrintJob.fromJson(Map<String, dynamic> json) {
    return CreateBookingRequestVerticalDataPrintJob(
      fileUrls: (json['fileUrls'] as List<dynamic>).map((e) => e as String).toList(),
      copies: json['copies'] as int?,
      colorMode: json['colorMode'] == null ? null : CreateBookingRequestVerticalDataPrintJobColorMode.fromJson(json['colorMode'] as String),
      paperSize: json['paperSize'] == null ? null : CreateBookingRequestVerticalDataPrintJobPaperSize.fromJson(json['paperSize'] as String),
      finish: json['finish'] == null ? null : CreateBookingRequestVerticalDataPrintJobFinish.fromJson(json['finish'] as String),
      notes: json['notes'] as String?,
    );
  }

  Map<String, dynamic> toJson() => {
    'fileUrls': fileUrls.map((e) => e).toList(),
    'copies': copies,
    'colorMode': colorMode?.value,
    'paperSize': paperSize?.value,
    'finish': finish?.value,
    'notes': notes,
  };
}

class CreateBookingRequestVerticalDataLaundryJob {
  final CreateBookingRequestVerticalDataLaundryJobServiceCategory? serviceCategory;
  final num? estimatedWeightKg;
  final int? bagCount;
  final String? specialInstructions;

  CreateBookingRequestVerticalDataLaundryJob({
    this.serviceCategory,
    this.estimatedWeightKg,
    this.bagCount,
    this.specialInstructions,
  });

  factory CreateBookingRequestVerticalDataLaundryJob.fromJson(Map<String, dynamic> json) {
    return CreateBookingRequestVerticalDataLaundryJob(
      serviceCategory: json['serviceCategory'] == null ? null : CreateBookingRequestVerticalDataLaundryJobServiceCategory.fromJson(json['serviceCategory'] as String),
      estimatedWeightKg: json['estimatedWeightKg'] as num?,
      bagCount: json['bagCount'] as int?,
      specialInstructions: json['specialInstructions'] as String?,
    );
  }

  Map<String, dynamic> toJson() => {
    'serviceCategory': serviceCategory?.value,
    'estimatedWeightKg': estimatedWeightKg,
    'bagCount': bagCount,
    'specialInstructions': specialInstructions,
  };
}

class CreateBookingResponseBookingPriceSnapshot {
  final int amountCents;
  final String currency;
  final String serviceName;
  final int durationMinutes;

  CreateBookingResponseBookingPriceSnapshot({
    required this.amountCents,
    required this.currency,
    required this.serviceName,
    required this.durationMinutes,
  });

  factory CreateBookingResponseBookingPriceSnapshot.fromJson(Map<String, dynamic> json) {
    return CreateBookingResponseBookingPriceSnapshot(
      amountCents: json['amountCents'] as int,
      currency: json['currency'] as String,
      serviceName: json['serviceName'] as String,
      durationMinutes: json['durationMinutes'] as int,
    );
  }

  Map<String, dynamic> toJson() => {
    'amountCents': amountCents,
    'currency': currency,
    'serviceName': serviceName,
    'durationMinutes': durationMinutes,
  };
}

class CreateBookingResponseBookingVerticalData {
  final CreateBookingResponseBookingVerticalDataPrintJob? printJob;
  final CreateBookingResponseBookingVerticalDataLaundryJob? laundryJob;

  CreateBookingResponseBookingVerticalData({
    this.printJob,
    this.laundryJob,
  });

  factory CreateBookingResponseBookingVerticalData.fromJson(Map<String, dynamic> json) {
    return CreateBookingResponseBookingVerticalData(
      printJob: json['printJob'] == null ? null : CreateBookingResponseBookingVerticalDataPrintJob.fromJson(json['printJob'] as Map<String, dynamic>),
      laundryJob: json['laundryJob'] == null ? null : CreateBookingResponseBookingVerticalDataLaundryJob.fromJson(json['laundryJob'] as Map<String, dynamic>),
    );
  }

  Map<String, dynamic> toJson() => {
    'printJob': printJob?.toJson(),
    'laundryJob': laundryJob?.toJson(),
  };
}

class CancelBookingResponseBookingPriceSnapshot {
  final int amountCents;
  final String currency;
  final String serviceName;
  final int durationMinutes;

  CancelBookingResponseBookingPriceSnapshot({
    required this.amountCents,
    required this.currency,
    required this.serviceName,
    required this.durationMinutes,
  });

  factory CancelBookingResponseBookingPriceSnapshot.fromJson(Map<String, dynamic> json) {
    return CancelBookingResponseBookingPriceSnapshot(
      amountCents: json['amountCents'] as int,
      currency: json['currency'] as String,
      serviceName: json['serviceName'] as String,
      durationMinutes: json['durationMinutes'] as int,
    );
  }

  Map<String, dynamic> toJson() => {
    'amountCents': amountCents,
    'currency': currency,
    'serviceName': serviceName,
    'durationMinutes': durationMinutes,
  };
}

class CancelBookingResponseBookingVerticalData {
  final CancelBookingResponseBookingVerticalDataPrintJob? printJob;
  final CancelBookingResponseBookingVerticalDataLaundryJob? laundryJob;

  CancelBookingResponseBookingVerticalData({
    this.printJob,
    this.laundryJob,
  });

  factory CancelBookingResponseBookingVerticalData.fromJson(Map<String, dynamic> json) {
    return CancelBookingResponseBookingVerticalData(
      printJob: json['printJob'] == null ? null : CancelBookingResponseBookingVerticalDataPrintJob.fromJson(json['printJob'] as Map<String, dynamic>),
      laundryJob: json['laundryJob'] == null ? null : CancelBookingResponseBookingVerticalDataLaundryJob.fromJson(json['laundryJob'] as Map<String, dynamic>),
    );
  }

  Map<String, dynamic> toJson() => {
    'printJob': printJob?.toJson(),
    'laundryJob': laundryJob?.toJson(),
  };
}

class RescheduleBookingResponseBookingPriceSnapshot {
  final int amountCents;
  final String currency;
  final String serviceName;
  final int durationMinutes;

  RescheduleBookingResponseBookingPriceSnapshot({
    required this.amountCents,
    required this.currency,
    required this.serviceName,
    required this.durationMinutes,
  });

  factory RescheduleBookingResponseBookingPriceSnapshot.fromJson(Map<String, dynamic> json) {
    return RescheduleBookingResponseBookingPriceSnapshot(
      amountCents: json['amountCents'] as int,
      currency: json['currency'] as String,
      serviceName: json['serviceName'] as String,
      durationMinutes: json['durationMinutes'] as int,
    );
  }

  Map<String, dynamic> toJson() => {
    'amountCents': amountCents,
    'currency': currency,
    'serviceName': serviceName,
    'durationMinutes': durationMinutes,
  };
}

class RescheduleBookingResponseBookingVerticalData {
  final RescheduleBookingResponseBookingVerticalDataPrintJob? printJob;
  final RescheduleBookingResponseBookingVerticalDataLaundryJob? laundryJob;

  RescheduleBookingResponseBookingVerticalData({
    this.printJob,
    this.laundryJob,
  });

  factory RescheduleBookingResponseBookingVerticalData.fromJson(Map<String, dynamic> json) {
    return RescheduleBookingResponseBookingVerticalData(
      printJob: json['printJob'] == null ? null : RescheduleBookingResponseBookingVerticalDataPrintJob.fromJson(json['printJob'] as Map<String, dynamic>),
      laundryJob: json['laundryJob'] == null ? null : RescheduleBookingResponseBookingVerticalDataLaundryJob.fromJson(json['laundryJob'] as Map<String, dynamic>),
    );
  }

  Map<String, dynamic> toJson() => {
    'printJob': printJob?.toJson(),
    'laundryJob': laundryJob?.toJson(),
  };
}

class RespondToBookingResponseBookingPriceSnapshot {
  final int amountCents;
  final String currency;
  final String serviceName;
  final int durationMinutes;

  RespondToBookingResponseBookingPriceSnapshot({
    required this.amountCents,
    required this.currency,
    required this.serviceName,
    required this.durationMinutes,
  });

  factory RespondToBookingResponseBookingPriceSnapshot.fromJson(Map<String, dynamic> json) {
    return RespondToBookingResponseBookingPriceSnapshot(
      amountCents: json['amountCents'] as int,
      currency: json['currency'] as String,
      serviceName: json['serviceName'] as String,
      durationMinutes: json['durationMinutes'] as int,
    );
  }

  Map<String, dynamic> toJson() => {
    'amountCents': amountCents,
    'currency': currency,
    'serviceName': serviceName,
    'durationMinutes': durationMinutes,
  };
}

class RespondToBookingResponseBookingVerticalData {
  final RespondToBookingResponseBookingVerticalDataPrintJob? printJob;
  final RespondToBookingResponseBookingVerticalDataLaundryJob? laundryJob;

  RespondToBookingResponseBookingVerticalData({
    this.printJob,
    this.laundryJob,
  });

  factory RespondToBookingResponseBookingVerticalData.fromJson(Map<String, dynamic> json) {
    return RespondToBookingResponseBookingVerticalData(
      printJob: json['printJob'] == null ? null : RespondToBookingResponseBookingVerticalDataPrintJob.fromJson(json['printJob'] as Map<String, dynamic>),
      laundryJob: json['laundryJob'] == null ? null : RespondToBookingResponseBookingVerticalDataLaundryJob.fromJson(json['laundryJob'] as Map<String, dynamic>),
    );
  }

  Map<String, dynamic> toJson() => {
    'printJob': printJob?.toJson(),
    'laundryJob': laundryJob?.toJson(),
  };
}

class GetProviderDetailsResponseServicesItemPrice {
  final int amountCents;
  final String currency;

  GetProviderDetailsResponseServicesItemPrice({
    required this.amountCents,
    required this.currency,
  });

  factory GetProviderDetailsResponseServicesItemPrice.fromJson(Map<String, dynamic> json) {
    return GetProviderDetailsResponseServicesItemPrice(
      amountCents: json['amountCents'] as int,
      currency: json['currency'] as String,
    );
  }

  Map<String, dynamic> toJson() => {
    'amountCents': amountCents,
    'currency': currency,
  };
}

class GetProviderDashboardResponseProviderAddress {
  final String line1;
  final String? line2;
  final String city;
  final String? region;
  final String? postalCode;
  final String country;

  GetProviderDashboardResponseProviderAddress({
    required this.line1,
    this.line2,
    required this.city,
    this.region,
    this.postalCode,
    required this.country,
  });

  factory GetProviderDashboardResponseProviderAddress.fromJson(Map<String, dynamic> json) {
    return GetProviderDashboardResponseProviderAddress(
      line1: json['line1'] as String,
      line2: json['line2'] as String?,
      city: json['city'] as String,
      region: json['region'] as String?,
      postalCode: json['postalCode'] as String?,
      country: json['country'] as String,
    );
  }

  Map<String, dynamic> toJson() => {
    'line1': line1,
    'line2': line2,
    'city': city,
    'region': region,
    'postalCode': postalCode,
    'country': country,
  };
}

class GetProviderDashboardResponseProviderBookingPolicy {
  final int leadTimeMinutes;
  final int cancelCutoffHours;
  final int rescheduleCutoffHours;
  final int pendingHoldMinutes;
  final int defaultConcurrentSlots;

  GetProviderDashboardResponseProviderBookingPolicy({
    required this.leadTimeMinutes,
    required this.cancelCutoffHours,
    required this.rescheduleCutoffHours,
    required this.pendingHoldMinutes,
    required this.defaultConcurrentSlots,
  });

  factory GetProviderDashboardResponseProviderBookingPolicy.fromJson(Map<String, dynamic> json) {
    return GetProviderDashboardResponseProviderBookingPolicy(
      leadTimeMinutes: json['leadTimeMinutes'] as int,
      cancelCutoffHours: json['cancelCutoffHours'] as int,
      rescheduleCutoffHours: json['rescheduleCutoffHours'] as int,
      pendingHoldMinutes: json['pendingHoldMinutes'] as int,
      defaultConcurrentSlots: json['defaultConcurrentSlots'] as int,
    );
  }

  Map<String, dynamic> toJson() => {
    'leadTimeMinutes': leadTimeMinutes,
    'cancelCutoffHours': cancelCutoffHours,
    'rescheduleCutoffHours': rescheduleCutoffHours,
    'pendingHoldMinutes': pendingHoldMinutes,
    'defaultConcurrentSlots': defaultConcurrentSlots,
  };
}

class GetProviderDashboardResponseServicesItemPrice {
  final int amountCents;
  final String currency;

  GetProviderDashboardResponseServicesItemPrice({
    required this.amountCents,
    required this.currency,
  });

  factory GetProviderDashboardResponseServicesItemPrice.fromJson(Map<String, dynamic> json) {
    return GetProviderDashboardResponseServicesItemPrice(
      amountCents: json['amountCents'] as int,
      currency: json['currency'] as String,
    );
  }

  Map<String, dynamic> toJson() => {
    'amountCents': amountCents,
    'currency': currency,
  };
}

class GetProviderDashboardResponseAvailabilityItemIntervalsItem {
  final String startLocal;
  final String endLocal;

  GetProviderDashboardResponseAvailabilityItemIntervalsItem({
    required this.startLocal,
    required this.endLocal,
  });

  factory GetProviderDashboardResponseAvailabilityItemIntervalsItem.fromJson(Map<String, dynamic> json) {
    return GetProviderDashboardResponseAvailabilityItemIntervalsItem(
      startLocal: json['startLocal'] as String,
      endLocal: json['endLocal'] as String,
    );
  }

  Map<String, dynamic> toJson() => {
    'startLocal': startLocal,
    'endLocal': endLocal,
  };
}

class GetProviderDashboardResponseBookingsItemPriceSnapshot {
  final int amountCents;
  final String currency;
  final String serviceName;
  final int durationMinutes;

  GetProviderDashboardResponseBookingsItemPriceSnapshot({
    required this.amountCents,
    required this.currency,
    required this.serviceName,
    required this.durationMinutes,
  });

  factory GetProviderDashboardResponseBookingsItemPriceSnapshot.fromJson(Map<String, dynamic> json) {
    return GetProviderDashboardResponseBookingsItemPriceSnapshot(
      amountCents: json['amountCents'] as int,
      currency: json['currency'] as String,
      serviceName: json['serviceName'] as String,
      durationMinutes: json['durationMinutes'] as int,
    );
  }

  Map<String, dynamic> toJson() => {
    'amountCents': amountCents,
    'currency': currency,
    'serviceName': serviceName,
    'durationMinutes': durationMinutes,
  };
}

class GetProviderDashboardResponseBookingsItemVerticalData {
  final GetProviderDashboardResponseBookingsItemVerticalDataPrintJob? printJob;
  final GetProviderDashboardResponseBookingsItemVerticalDataLaundryJob? laundryJob;

  GetProviderDashboardResponseBookingsItemVerticalData({
    this.printJob,
    this.laundryJob,
  });

  factory GetProviderDashboardResponseBookingsItemVerticalData.fromJson(Map<String, dynamic> json) {
    return GetProviderDashboardResponseBookingsItemVerticalData(
      printJob: json['printJob'] == null ? null : GetProviderDashboardResponseBookingsItemVerticalDataPrintJob.fromJson(json['printJob'] as Map<String, dynamic>),
      laundryJob: json['laundryJob'] == null ? null : GetProviderDashboardResponseBookingsItemVerticalDataLaundryJob.fromJson(json['laundryJob'] as Map<String, dynamic>),
    );
  }

  Map<String, dynamic> toJson() => {
    'printJob': printJob?.toJson(),
    'laundryJob': laundryJob?.toJson(),
  };
}

class ListProviderBookingsResponseBookingsItemPriceSnapshot {
  final int amountCents;
  final String currency;
  final String serviceName;
  final int durationMinutes;

  ListProviderBookingsResponseBookingsItemPriceSnapshot({
    required this.amountCents,
    required this.currency,
    required this.serviceName,
    required this.durationMinutes,
  });

  factory ListProviderBookingsResponseBookingsItemPriceSnapshot.fromJson(Map<String, dynamic> json) {
    return ListProviderBookingsResponseBookingsItemPriceSnapshot(
      amountCents: json['amountCents'] as int,
      currency: json['currency'] as String,
      serviceName: json['serviceName'] as String,
      durationMinutes: json['durationMinutes'] as int,
    );
  }

  Map<String, dynamic> toJson() => {
    'amountCents': amountCents,
    'currency': currency,
    'serviceName': serviceName,
    'durationMinutes': durationMinutes,
  };
}

class ListProviderBookingsResponseBookingsItemVerticalData {
  final ListProviderBookingsResponseBookingsItemVerticalDataPrintJob? printJob;
  final ListProviderBookingsResponseBookingsItemVerticalDataLaundryJob? laundryJob;

  ListProviderBookingsResponseBookingsItemVerticalData({
    this.printJob,
    this.laundryJob,
  });

  factory ListProviderBookingsResponseBookingsItemVerticalData.fromJson(Map<String, dynamic> json) {
    return ListProviderBookingsResponseBookingsItemVerticalData(
      printJob: json['printJob'] == null ? null : ListProviderBookingsResponseBookingsItemVerticalDataPrintJob.fromJson(json['printJob'] as Map<String, dynamic>),
      laundryJob: json['laundryJob'] == null ? null : ListProviderBookingsResponseBookingsItemVerticalDataLaundryJob.fromJson(json['laundryJob'] as Map<String, dynamic>),
    );
  }

  Map<String, dynamic> toJson() => {
    'printJob': printJob?.toJson(),
    'laundryJob': laundryJob?.toJson(),
  };
}

class GetMyBookingsResponseBookingsItemPriceSnapshot {
  final int amountCents;
  final String currency;
  final String serviceName;
  final int durationMinutes;

  GetMyBookingsResponseBookingsItemPriceSnapshot({
    required this.amountCents,
    required this.currency,
    required this.serviceName,
    required this.durationMinutes,
  });

  factory GetMyBookingsResponseBookingsItemPriceSnapshot.fromJson(Map<String, dynamic> json) {
    return GetMyBookingsResponseBookingsItemPriceSnapshot(
      amountCents: json['amountCents'] as int,
      currency: json['currency'] as String,
      serviceName: json['serviceName'] as String,
      durationMinutes: json['durationMinutes'] as int,
    );
  }

  Map<String, dynamic> toJson() => {
    'amountCents': amountCents,
    'currency': currency,
    'serviceName': serviceName,
    'durationMinutes': durationMinutes,
  };
}

class GetMyBookingsResponseBookingsItemVerticalData {
  final GetMyBookingsResponseBookingsItemVerticalDataPrintJob? printJob;
  final GetMyBookingsResponseBookingsItemVerticalDataLaundryJob? laundryJob;

  GetMyBookingsResponseBookingsItemVerticalData({
    this.printJob,
    this.laundryJob,
  });

  factory GetMyBookingsResponseBookingsItemVerticalData.fromJson(Map<String, dynamic> json) {
    return GetMyBookingsResponseBookingsItemVerticalData(
      printJob: json['printJob'] == null ? null : GetMyBookingsResponseBookingsItemVerticalDataPrintJob.fromJson(json['printJob'] as Map<String, dynamic>),
      laundryJob: json['laundryJob'] == null ? null : GetMyBookingsResponseBookingsItemVerticalDataLaundryJob.fromJson(json['laundryJob'] as Map<String, dynamic>),
    );
  }

  Map<String, dynamic> toJson() => {
    'printJob': printJob?.toJson(),
    'laundryJob': laundryJob?.toJson(),
  };
}

class CreateBookingResponseBookingVerticalDataPrintJob {
  final List<String> fileUrls;
  final int? copies;
  final CreateBookingResponseBookingVerticalDataPrintJobColorMode? colorMode;
  final CreateBookingResponseBookingVerticalDataPrintJobPaperSize? paperSize;
  final CreateBookingResponseBookingVerticalDataPrintJobFinish? finish;
  final String? notes;

  CreateBookingResponseBookingVerticalDataPrintJob({
    required this.fileUrls,
    this.copies,
    this.colorMode,
    this.paperSize,
    this.finish,
    this.notes,
  });

  factory CreateBookingResponseBookingVerticalDataPrintJob.fromJson(Map<String, dynamic> json) {
    return CreateBookingResponseBookingVerticalDataPrintJob(
      fileUrls: (json['fileUrls'] as List<dynamic>).map((e) => e as String).toList(),
      copies: json['copies'] as int?,
      colorMode: json['colorMode'] == null ? null : CreateBookingResponseBookingVerticalDataPrintJobColorMode.fromJson(json['colorMode'] as String),
      paperSize: json['paperSize'] == null ? null : CreateBookingResponseBookingVerticalDataPrintJobPaperSize.fromJson(json['paperSize'] as String),
      finish: json['finish'] == null ? null : CreateBookingResponseBookingVerticalDataPrintJobFinish.fromJson(json['finish'] as String),
      notes: json['notes'] as String?,
    );
  }

  Map<String, dynamic> toJson() => {
    'fileUrls': fileUrls.map((e) => e).toList(),
    'copies': copies,
    'colorMode': colorMode?.value,
    'paperSize': paperSize?.value,
    'finish': finish?.value,
    'notes': notes,
  };
}

class CreateBookingResponseBookingVerticalDataLaundryJob {
  final CreateBookingResponseBookingVerticalDataLaundryJobServiceCategory? serviceCategory;
  final num? estimatedWeightKg;
  final int? bagCount;
  final String? specialInstructions;

  CreateBookingResponseBookingVerticalDataLaundryJob({
    this.serviceCategory,
    this.estimatedWeightKg,
    this.bagCount,
    this.specialInstructions,
  });

  factory CreateBookingResponseBookingVerticalDataLaundryJob.fromJson(Map<String, dynamic> json) {
    return CreateBookingResponseBookingVerticalDataLaundryJob(
      serviceCategory: json['serviceCategory'] == null ? null : CreateBookingResponseBookingVerticalDataLaundryJobServiceCategory.fromJson(json['serviceCategory'] as String),
      estimatedWeightKg: json['estimatedWeightKg'] as num?,
      bagCount: json['bagCount'] as int?,
      specialInstructions: json['specialInstructions'] as String?,
    );
  }

  Map<String, dynamic> toJson() => {
    'serviceCategory': serviceCategory?.value,
    'estimatedWeightKg': estimatedWeightKg,
    'bagCount': bagCount,
    'specialInstructions': specialInstructions,
  };
}

class CancelBookingResponseBookingVerticalDataPrintJob {
  final List<String> fileUrls;
  final int? copies;
  final CancelBookingResponseBookingVerticalDataPrintJobColorMode? colorMode;
  final CancelBookingResponseBookingVerticalDataPrintJobPaperSize? paperSize;
  final CancelBookingResponseBookingVerticalDataPrintJobFinish? finish;
  final String? notes;

  CancelBookingResponseBookingVerticalDataPrintJob({
    required this.fileUrls,
    this.copies,
    this.colorMode,
    this.paperSize,
    this.finish,
    this.notes,
  });

  factory CancelBookingResponseBookingVerticalDataPrintJob.fromJson(Map<String, dynamic> json) {
    return CancelBookingResponseBookingVerticalDataPrintJob(
      fileUrls: (json['fileUrls'] as List<dynamic>).map((e) => e as String).toList(),
      copies: json['copies'] as int?,
      colorMode: json['colorMode'] == null ? null : CancelBookingResponseBookingVerticalDataPrintJobColorMode.fromJson(json['colorMode'] as String),
      paperSize: json['paperSize'] == null ? null : CancelBookingResponseBookingVerticalDataPrintJobPaperSize.fromJson(json['paperSize'] as String),
      finish: json['finish'] == null ? null : CancelBookingResponseBookingVerticalDataPrintJobFinish.fromJson(json['finish'] as String),
      notes: json['notes'] as String?,
    );
  }

  Map<String, dynamic> toJson() => {
    'fileUrls': fileUrls.map((e) => e).toList(),
    'copies': copies,
    'colorMode': colorMode?.value,
    'paperSize': paperSize?.value,
    'finish': finish?.value,
    'notes': notes,
  };
}

class CancelBookingResponseBookingVerticalDataLaundryJob {
  final CancelBookingResponseBookingVerticalDataLaundryJobServiceCategory? serviceCategory;
  final num? estimatedWeightKg;
  final int? bagCount;
  final String? specialInstructions;

  CancelBookingResponseBookingVerticalDataLaundryJob({
    this.serviceCategory,
    this.estimatedWeightKg,
    this.bagCount,
    this.specialInstructions,
  });

  factory CancelBookingResponseBookingVerticalDataLaundryJob.fromJson(Map<String, dynamic> json) {
    return CancelBookingResponseBookingVerticalDataLaundryJob(
      serviceCategory: json['serviceCategory'] == null ? null : CancelBookingResponseBookingVerticalDataLaundryJobServiceCategory.fromJson(json['serviceCategory'] as String),
      estimatedWeightKg: json['estimatedWeightKg'] as num?,
      bagCount: json['bagCount'] as int?,
      specialInstructions: json['specialInstructions'] as String?,
    );
  }

  Map<String, dynamic> toJson() => {
    'serviceCategory': serviceCategory?.value,
    'estimatedWeightKg': estimatedWeightKg,
    'bagCount': bagCount,
    'specialInstructions': specialInstructions,
  };
}

class RescheduleBookingResponseBookingVerticalDataPrintJob {
  final List<String> fileUrls;
  final int? copies;
  final RescheduleBookingResponseBookingVerticalDataPrintJobColorMode? colorMode;
  final RescheduleBookingResponseBookingVerticalDataPrintJobPaperSize? paperSize;
  final RescheduleBookingResponseBookingVerticalDataPrintJobFinish? finish;
  final String? notes;

  RescheduleBookingResponseBookingVerticalDataPrintJob({
    required this.fileUrls,
    this.copies,
    this.colorMode,
    this.paperSize,
    this.finish,
    this.notes,
  });

  factory RescheduleBookingResponseBookingVerticalDataPrintJob.fromJson(Map<String, dynamic> json) {
    return RescheduleBookingResponseBookingVerticalDataPrintJob(
      fileUrls: (json['fileUrls'] as List<dynamic>).map((e) => e as String).toList(),
      copies: json['copies'] as int?,
      colorMode: json['colorMode'] == null ? null : RescheduleBookingResponseBookingVerticalDataPrintJobColorMode.fromJson(json['colorMode'] as String),
      paperSize: json['paperSize'] == null ? null : RescheduleBookingResponseBookingVerticalDataPrintJobPaperSize.fromJson(json['paperSize'] as String),
      finish: json['finish'] == null ? null : RescheduleBookingResponseBookingVerticalDataPrintJobFinish.fromJson(json['finish'] as String),
      notes: json['notes'] as String?,
    );
  }

  Map<String, dynamic> toJson() => {
    'fileUrls': fileUrls.map((e) => e).toList(),
    'copies': copies,
    'colorMode': colorMode?.value,
    'paperSize': paperSize?.value,
    'finish': finish?.value,
    'notes': notes,
  };
}

class RescheduleBookingResponseBookingVerticalDataLaundryJob {
  final RescheduleBookingResponseBookingVerticalDataLaundryJobServiceCategory? serviceCategory;
  final num? estimatedWeightKg;
  final int? bagCount;
  final String? specialInstructions;

  RescheduleBookingResponseBookingVerticalDataLaundryJob({
    this.serviceCategory,
    this.estimatedWeightKg,
    this.bagCount,
    this.specialInstructions,
  });

  factory RescheduleBookingResponseBookingVerticalDataLaundryJob.fromJson(Map<String, dynamic> json) {
    return RescheduleBookingResponseBookingVerticalDataLaundryJob(
      serviceCategory: json['serviceCategory'] == null ? null : RescheduleBookingResponseBookingVerticalDataLaundryJobServiceCategory.fromJson(json['serviceCategory'] as String),
      estimatedWeightKg: json['estimatedWeightKg'] as num?,
      bagCount: json['bagCount'] as int?,
      specialInstructions: json['specialInstructions'] as String?,
    );
  }

  Map<String, dynamic> toJson() => {
    'serviceCategory': serviceCategory?.value,
    'estimatedWeightKg': estimatedWeightKg,
    'bagCount': bagCount,
    'specialInstructions': specialInstructions,
  };
}

class RespondToBookingResponseBookingVerticalDataPrintJob {
  final List<String> fileUrls;
  final int? copies;
  final RespondToBookingResponseBookingVerticalDataPrintJobColorMode? colorMode;
  final RespondToBookingResponseBookingVerticalDataPrintJobPaperSize? paperSize;
  final RespondToBookingResponseBookingVerticalDataPrintJobFinish? finish;
  final String? notes;

  RespondToBookingResponseBookingVerticalDataPrintJob({
    required this.fileUrls,
    this.copies,
    this.colorMode,
    this.paperSize,
    this.finish,
    this.notes,
  });

  factory RespondToBookingResponseBookingVerticalDataPrintJob.fromJson(Map<String, dynamic> json) {
    return RespondToBookingResponseBookingVerticalDataPrintJob(
      fileUrls: (json['fileUrls'] as List<dynamic>).map((e) => e as String).toList(),
      copies: json['copies'] as int?,
      colorMode: json['colorMode'] == null ? null : RespondToBookingResponseBookingVerticalDataPrintJobColorMode.fromJson(json['colorMode'] as String),
      paperSize: json['paperSize'] == null ? null : RespondToBookingResponseBookingVerticalDataPrintJobPaperSize.fromJson(json['paperSize'] as String),
      finish: json['finish'] == null ? null : RespondToBookingResponseBookingVerticalDataPrintJobFinish.fromJson(json['finish'] as String),
      notes: json['notes'] as String?,
    );
  }

  Map<String, dynamic> toJson() => {
    'fileUrls': fileUrls.map((e) => e).toList(),
    'copies': copies,
    'colorMode': colorMode?.value,
    'paperSize': paperSize?.value,
    'finish': finish?.value,
    'notes': notes,
  };
}

class RespondToBookingResponseBookingVerticalDataLaundryJob {
  final RespondToBookingResponseBookingVerticalDataLaundryJobServiceCategory? serviceCategory;
  final num? estimatedWeightKg;
  final int? bagCount;
  final String? specialInstructions;

  RespondToBookingResponseBookingVerticalDataLaundryJob({
    this.serviceCategory,
    this.estimatedWeightKg,
    this.bagCount,
    this.specialInstructions,
  });

  factory RespondToBookingResponseBookingVerticalDataLaundryJob.fromJson(Map<String, dynamic> json) {
    return RespondToBookingResponseBookingVerticalDataLaundryJob(
      serviceCategory: json['serviceCategory'] == null ? null : RespondToBookingResponseBookingVerticalDataLaundryJobServiceCategory.fromJson(json['serviceCategory'] as String),
      estimatedWeightKg: json['estimatedWeightKg'] as num?,
      bagCount: json['bagCount'] as int?,
      specialInstructions: json['specialInstructions'] as String?,
    );
  }

  Map<String, dynamic> toJson() => {
    'serviceCategory': serviceCategory?.value,
    'estimatedWeightKg': estimatedWeightKg,
    'bagCount': bagCount,
    'specialInstructions': specialInstructions,
  };
}

class GetProviderDashboardResponseBookingsItemVerticalDataPrintJob {
  final List<String> fileUrls;
  final int? copies;
  final GetProviderDashboardResponseBookingsItemVerticalDataPrintJobColorMode? colorMode;
  final GetProviderDashboardResponseBookingsItemVerticalDataPrintJobPaperSize? paperSize;
  final GetProviderDashboardResponseBookingsItemVerticalDataPrintJobFinish? finish;
  final String? notes;

  GetProviderDashboardResponseBookingsItemVerticalDataPrintJob({
    required this.fileUrls,
    this.copies,
    this.colorMode,
    this.paperSize,
    this.finish,
    this.notes,
  });

  factory GetProviderDashboardResponseBookingsItemVerticalDataPrintJob.fromJson(Map<String, dynamic> json) {
    return GetProviderDashboardResponseBookingsItemVerticalDataPrintJob(
      fileUrls: (json['fileUrls'] as List<dynamic>).map((e) => e as String).toList(),
      copies: json['copies'] as int?,
      colorMode: json['colorMode'] == null ? null : GetProviderDashboardResponseBookingsItemVerticalDataPrintJobColorMode.fromJson(json['colorMode'] as String),
      paperSize: json['paperSize'] == null ? null : GetProviderDashboardResponseBookingsItemVerticalDataPrintJobPaperSize.fromJson(json['paperSize'] as String),
      finish: json['finish'] == null ? null : GetProviderDashboardResponseBookingsItemVerticalDataPrintJobFinish.fromJson(json['finish'] as String),
      notes: json['notes'] as String?,
    );
  }

  Map<String, dynamic> toJson() => {
    'fileUrls': fileUrls.map((e) => e).toList(),
    'copies': copies,
    'colorMode': colorMode?.value,
    'paperSize': paperSize?.value,
    'finish': finish?.value,
    'notes': notes,
  };
}

class GetProviderDashboardResponseBookingsItemVerticalDataLaundryJob {
  final GetProviderDashboardResponseBookingsItemVerticalDataLaundryJobServiceCategory? serviceCategory;
  final num? estimatedWeightKg;
  final int? bagCount;
  final String? specialInstructions;

  GetProviderDashboardResponseBookingsItemVerticalDataLaundryJob({
    this.serviceCategory,
    this.estimatedWeightKg,
    this.bagCount,
    this.specialInstructions,
  });

  factory GetProviderDashboardResponseBookingsItemVerticalDataLaundryJob.fromJson(Map<String, dynamic> json) {
    return GetProviderDashboardResponseBookingsItemVerticalDataLaundryJob(
      serviceCategory: json['serviceCategory'] == null ? null : GetProviderDashboardResponseBookingsItemVerticalDataLaundryJobServiceCategory.fromJson(json['serviceCategory'] as String),
      estimatedWeightKg: json['estimatedWeightKg'] as num?,
      bagCount: json['bagCount'] as int?,
      specialInstructions: json['specialInstructions'] as String?,
    );
  }

  Map<String, dynamic> toJson() => {
    'serviceCategory': serviceCategory?.value,
    'estimatedWeightKg': estimatedWeightKg,
    'bagCount': bagCount,
    'specialInstructions': specialInstructions,
  };
}

class ListProviderBookingsResponseBookingsItemVerticalDataPrintJob {
  final List<String> fileUrls;
  final int? copies;
  final ListProviderBookingsResponseBookingsItemVerticalDataPrintJobColorMode? colorMode;
  final ListProviderBookingsResponseBookingsItemVerticalDataPrintJobPaperSize? paperSize;
  final ListProviderBookingsResponseBookingsItemVerticalDataPrintJobFinish? finish;
  final String? notes;

  ListProviderBookingsResponseBookingsItemVerticalDataPrintJob({
    required this.fileUrls,
    this.copies,
    this.colorMode,
    this.paperSize,
    this.finish,
    this.notes,
  });

  factory ListProviderBookingsResponseBookingsItemVerticalDataPrintJob.fromJson(Map<String, dynamic> json) {
    return ListProviderBookingsResponseBookingsItemVerticalDataPrintJob(
      fileUrls: (json['fileUrls'] as List<dynamic>).map((e) => e as String).toList(),
      copies: json['copies'] as int?,
      colorMode: json['colorMode'] == null ? null : ListProviderBookingsResponseBookingsItemVerticalDataPrintJobColorMode.fromJson(json['colorMode'] as String),
      paperSize: json['paperSize'] == null ? null : ListProviderBookingsResponseBookingsItemVerticalDataPrintJobPaperSize.fromJson(json['paperSize'] as String),
      finish: json['finish'] == null ? null : ListProviderBookingsResponseBookingsItemVerticalDataPrintJobFinish.fromJson(json['finish'] as String),
      notes: json['notes'] as String?,
    );
  }

  Map<String, dynamic> toJson() => {
    'fileUrls': fileUrls.map((e) => e).toList(),
    'copies': copies,
    'colorMode': colorMode?.value,
    'paperSize': paperSize?.value,
    'finish': finish?.value,
    'notes': notes,
  };
}

class ListProviderBookingsResponseBookingsItemVerticalDataLaundryJob {
  final ListProviderBookingsResponseBookingsItemVerticalDataLaundryJobServiceCategory? serviceCategory;
  final num? estimatedWeightKg;
  final int? bagCount;
  final String? specialInstructions;

  ListProviderBookingsResponseBookingsItemVerticalDataLaundryJob({
    this.serviceCategory,
    this.estimatedWeightKg,
    this.bagCount,
    this.specialInstructions,
  });

  factory ListProviderBookingsResponseBookingsItemVerticalDataLaundryJob.fromJson(Map<String, dynamic> json) {
    return ListProviderBookingsResponseBookingsItemVerticalDataLaundryJob(
      serviceCategory: json['serviceCategory'] == null ? null : ListProviderBookingsResponseBookingsItemVerticalDataLaundryJobServiceCategory.fromJson(json['serviceCategory'] as String),
      estimatedWeightKg: json['estimatedWeightKg'] as num?,
      bagCount: json['bagCount'] as int?,
      specialInstructions: json['specialInstructions'] as String?,
    );
  }

  Map<String, dynamic> toJson() => {
    'serviceCategory': serviceCategory?.value,
    'estimatedWeightKg': estimatedWeightKg,
    'bagCount': bagCount,
    'specialInstructions': specialInstructions,
  };
}

class GetMyBookingsResponseBookingsItemVerticalDataPrintJob {
  final List<String> fileUrls;
  final int? copies;
  final GetMyBookingsResponseBookingsItemVerticalDataPrintJobColorMode? colorMode;
  final GetMyBookingsResponseBookingsItemVerticalDataPrintJobPaperSize? paperSize;
  final GetMyBookingsResponseBookingsItemVerticalDataPrintJobFinish? finish;
  final String? notes;

  GetMyBookingsResponseBookingsItemVerticalDataPrintJob({
    required this.fileUrls,
    this.copies,
    this.colorMode,
    this.paperSize,
    this.finish,
    this.notes,
  });

  factory GetMyBookingsResponseBookingsItemVerticalDataPrintJob.fromJson(Map<String, dynamic> json) {
    return GetMyBookingsResponseBookingsItemVerticalDataPrintJob(
      fileUrls: (json['fileUrls'] as List<dynamic>).map((e) => e as String).toList(),
      copies: json['copies'] as int?,
      colorMode: json['colorMode'] == null ? null : GetMyBookingsResponseBookingsItemVerticalDataPrintJobColorMode.fromJson(json['colorMode'] as String),
      paperSize: json['paperSize'] == null ? null : GetMyBookingsResponseBookingsItemVerticalDataPrintJobPaperSize.fromJson(json['paperSize'] as String),
      finish: json['finish'] == null ? null : GetMyBookingsResponseBookingsItemVerticalDataPrintJobFinish.fromJson(json['finish'] as String),
      notes: json['notes'] as String?,
    );
  }

  Map<String, dynamic> toJson() => {
    'fileUrls': fileUrls.map((e) => e).toList(),
    'copies': copies,
    'colorMode': colorMode?.value,
    'paperSize': paperSize?.value,
    'finish': finish?.value,
    'notes': notes,
  };
}

class GetMyBookingsResponseBookingsItemVerticalDataLaundryJob {
  final GetMyBookingsResponseBookingsItemVerticalDataLaundryJobServiceCategory? serviceCategory;
  final num? estimatedWeightKg;
  final int? bagCount;
  final String? specialInstructions;

  GetMyBookingsResponseBookingsItemVerticalDataLaundryJob({
    this.serviceCategory,
    this.estimatedWeightKg,
    this.bagCount,
    this.specialInstructions,
  });

  factory GetMyBookingsResponseBookingsItemVerticalDataLaundryJob.fromJson(Map<String, dynamic> json) {
    return GetMyBookingsResponseBookingsItemVerticalDataLaundryJob(
      serviceCategory: json['serviceCategory'] == null ? null : GetMyBookingsResponseBookingsItemVerticalDataLaundryJobServiceCategory.fromJson(json['serviceCategory'] as String),
      estimatedWeightKg: json['estimatedWeightKg'] as num?,
      bagCount: json['bagCount'] as int?,
      specialInstructions: json['specialInstructions'] as String?,
    );
  }

  Map<String, dynamic> toJson() => {
    'serviceCategory': serviceCategory?.value,
    'estimatedWeightKg': estimatedWeightKg,
    'bagCount': bagCount,
    'specialInstructions': specialInstructions,
  };
}
