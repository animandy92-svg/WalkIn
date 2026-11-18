import { ConnectorConfig, DataConnect, QueryRef, QueryPromise, ExecuteQueryOptions, MutationRef, MutationPromise, DataConnectSettings } from 'firebase/data-connect';

export const connectorConfig: ConnectorConfig;
export const dataConnectSettings: DataConnectSettings;

export type TimestampString = string;
export type UUIDString = string;
export type Int64String = string;
export type DateString = string;




export interface Appointment_Key {
  id: UUIDString;
  __typename?: 'Appointment_Key';
}

export interface Business_Key {
  id: UUIDString;
  __typename?: 'Business_Key';
}

export interface CreateAppointmentData {
  appointment_insert: Appointment_Key;
}

export interface CreateAppointmentVariables {
  serviceId: UUIDString;
  startTime: TimestampString;
  endTime: TimestampString;
}

export interface CreateBusinessData {
  business_insert: Business_Key;
}

export interface CreateReviewData {
  review_insert: Review_Key;
}

export interface CreateReviewVariables {
  businessId: UUIDString;
  rating: number;
}

export interface CreateServiceData {
  service_insert: Service_Key;
}

export interface CreateServiceVariables {
  businessId: UUIDString;
}

export interface CreateUserData {
  user_insert: User_Key;
}

export interface DeleteAppointmentData {
  appointment_delete?: Appointment_Key | null;
}

export interface DeleteAppointmentVariables {
  id: UUIDString;
}

export interface DeleteBusinessData {
  business_delete?: Business_Key | null;
}

export interface DeleteBusinessVariables {
  id: UUIDString;
}

export interface DeleteReviewData {
  review_delete?: Review_Key | null;
}

export interface DeleteReviewVariables {
  id: UUIDString;
}

export interface DeleteServiceData {
  service_delete?: Service_Key | null;
}

export interface DeleteServiceVariables {
  id: UUIDString;
}

export interface DeleteUserData {
  user_delete?: User_Key | null;
}

export interface GetBusinessData {
  business?: {
    name: string;
    address: string;
    owner: {
      fullName: string;
    };
  };
}

export interface GetBusinessVariables {
  id: UUIDString;
}

export interface GetCurrentUserData {
  user?: {
    email: string;
    fullName: string;
  };
}

export interface GetMyAppointmentData {
  appointment?: {
    startTime: TimestampString;
    status: string;
    service: {
      title: string;
    };
  };
}

export interface GetMyAppointmentVariables {
  id: UUIDString;
}

export interface GetReviewData {
  review?: {
    rating: number;
    comment?: string | null;
    author: {
      fullName: string;
    };
  };
}

export interface GetReviewVariables {
  id: UUIDString;
}

export interface GetServiceData {
  service?: {
    title: string;
    price: number;
  };
}

export interface GetServiceVariables {
  id: UUIDString;
}

export interface ListBusinessesData {
  businesses: ({
    name: string;
    category: string;
  })[];
}

export interface ListMyAppointmentsData {
  appointments: ({
    startTime: TimestampString;
    status: string;
  })[];
}

export interface ListReviewsData {
  reviews: ({
    rating: number;
    comment?: string | null;
  })[];
}

export interface ListReviewsVariables {
  businessId: UUIDString;
}

export interface ListServicesData {
  services: ({
    title: string;
    business: {
      name: string;
    };
  })[];
}

export interface ListUsersData {
  users: ({
    fullName: string;
    role: string;
  })[];
}

export interface Review_Key {
  id: UUIDString;
  __typename?: 'Review_Key';
}

export interface Service_Key {
  id: UUIDString;
  __typename?: 'Service_Key';
}

export interface UpdateAppointmentData {
  appointment_update?: Appointment_Key | null;
}

export interface UpdateAppointmentVariables {
  id: UUIDString;
  status: string;
}

export interface UpdateBusinessData {
  business_update?: Business_Key | null;
}

export interface UpdateBusinessVariables {
  id: UUIDString;
}

export interface UpdateReviewData {
  review_update?: Review_Key | null;
}

export interface UpdateReviewVariables {
  id: UUIDString;
  comment: string;
}

export interface UpdateServiceData {
  service_update?: Service_Key | null;
}

export interface UpdateServiceVariables {
  id: UUIDString;
}

export interface UpdateUserData {
  user_update?: User_Key | null;
}

export interface User_Key {
  id: UUIDString;
  __typename?: 'User_Key';
}

interface CreateUserRef {
  /* Allow users to create refs without passing in DataConnect */
  (): MutationRef<CreateUserData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): MutationRef<CreateUserData, undefined>;
  operationName: string;
}
export const createUserRef: CreateUserRef;

export function createUser(): MutationPromise<CreateUserData, undefined>;
export function createUser(dc: DataConnect): MutationPromise<CreateUserData, undefined>;

interface UpdateUserRef {
  /* Allow users to create refs without passing in DataConnect */
  (): MutationRef<UpdateUserData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): MutationRef<UpdateUserData, undefined>;
  operationName: string;
}
export const updateUserRef: UpdateUserRef;

export function updateUser(): MutationPromise<UpdateUserData, undefined>;
export function updateUser(dc: DataConnect): MutationPromise<UpdateUserData, undefined>;

interface DeleteUserRef {
  /* Allow users to create refs without passing in DataConnect */
  (): MutationRef<DeleteUserData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): MutationRef<DeleteUserData, undefined>;
  operationName: string;
}
export const deleteUserRef: DeleteUserRef;

export function deleteUser(): MutationPromise<DeleteUserData, undefined>;
export function deleteUser(dc: DataConnect): MutationPromise<DeleteUserData, undefined>;

interface GetCurrentUserRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetCurrentUserData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<GetCurrentUserData, undefined>;
  operationName: string;
}
export const getCurrentUserRef: GetCurrentUserRef;

export function getCurrentUser(options?: ExecuteQueryOptions): QueryPromise<GetCurrentUserData, undefined>;
export function getCurrentUser(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<GetCurrentUserData, undefined>;

interface ListUsersRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListUsersData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListUsersData, undefined>;
  operationName: string;
}
export const listUsersRef: ListUsersRef;

export function listUsers(options?: ExecuteQueryOptions): QueryPromise<ListUsersData, undefined>;
export function listUsers(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListUsersData, undefined>;

interface CreateBusinessRef {
  /* Allow users to create refs without passing in DataConnect */
  (): MutationRef<CreateBusinessData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): MutationRef<CreateBusinessData, undefined>;
  operationName: string;
}
export const createBusinessRef: CreateBusinessRef;

export function createBusiness(): MutationPromise<CreateBusinessData, undefined>;
export function createBusiness(dc: DataConnect): MutationPromise<CreateBusinessData, undefined>;

interface UpdateBusinessRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateBusinessVariables): MutationRef<UpdateBusinessData, UpdateBusinessVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateBusinessVariables): MutationRef<UpdateBusinessData, UpdateBusinessVariables>;
  operationName: string;
}
export const updateBusinessRef: UpdateBusinessRef;

export function updateBusiness(vars: UpdateBusinessVariables): MutationPromise<UpdateBusinessData, UpdateBusinessVariables>;
export function updateBusiness(dc: DataConnect, vars: UpdateBusinessVariables): MutationPromise<UpdateBusinessData, UpdateBusinessVariables>;

interface DeleteBusinessRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteBusinessVariables): MutationRef<DeleteBusinessData, DeleteBusinessVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteBusinessVariables): MutationRef<DeleteBusinessData, DeleteBusinessVariables>;
  operationName: string;
}
export const deleteBusinessRef: DeleteBusinessRef;

export function deleteBusiness(vars: DeleteBusinessVariables): MutationPromise<DeleteBusinessData, DeleteBusinessVariables>;
export function deleteBusiness(dc: DataConnect, vars: DeleteBusinessVariables): MutationPromise<DeleteBusinessData, DeleteBusinessVariables>;

interface GetBusinessRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetBusinessVariables): QueryRef<GetBusinessData, GetBusinessVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetBusinessVariables): QueryRef<GetBusinessData, GetBusinessVariables>;
  operationName: string;
}
export const getBusinessRef: GetBusinessRef;

export function getBusiness(vars: GetBusinessVariables, options?: ExecuteQueryOptions): QueryPromise<GetBusinessData, GetBusinessVariables>;
export function getBusiness(dc: DataConnect, vars: GetBusinessVariables, options?: ExecuteQueryOptions): QueryPromise<GetBusinessData, GetBusinessVariables>;

interface ListBusinessesRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListBusinessesData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListBusinessesData, undefined>;
  operationName: string;
}
export const listBusinessesRef: ListBusinessesRef;

export function listBusinesses(options?: ExecuteQueryOptions): QueryPromise<ListBusinessesData, undefined>;
export function listBusinesses(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListBusinessesData, undefined>;

interface CreateServiceRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateServiceVariables): MutationRef<CreateServiceData, CreateServiceVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateServiceVariables): MutationRef<CreateServiceData, CreateServiceVariables>;
  operationName: string;
}
export const createServiceRef: CreateServiceRef;

export function createService(vars: CreateServiceVariables): MutationPromise<CreateServiceData, CreateServiceVariables>;
export function createService(dc: DataConnect, vars: CreateServiceVariables): MutationPromise<CreateServiceData, CreateServiceVariables>;

interface UpdateServiceRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateServiceVariables): MutationRef<UpdateServiceData, UpdateServiceVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateServiceVariables): MutationRef<UpdateServiceData, UpdateServiceVariables>;
  operationName: string;
}
export const updateServiceRef: UpdateServiceRef;

export function updateService(vars: UpdateServiceVariables): MutationPromise<UpdateServiceData, UpdateServiceVariables>;
export function updateService(dc: DataConnect, vars: UpdateServiceVariables): MutationPromise<UpdateServiceData, UpdateServiceVariables>;

interface DeleteServiceRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteServiceVariables): MutationRef<DeleteServiceData, DeleteServiceVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteServiceVariables): MutationRef<DeleteServiceData, DeleteServiceVariables>;
  operationName: string;
}
export const deleteServiceRef: DeleteServiceRef;

export function deleteService(vars: DeleteServiceVariables): MutationPromise<DeleteServiceData, DeleteServiceVariables>;
export function deleteService(dc: DataConnect, vars: DeleteServiceVariables): MutationPromise<DeleteServiceData, DeleteServiceVariables>;

interface GetServiceRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetServiceVariables): QueryRef<GetServiceData, GetServiceVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetServiceVariables): QueryRef<GetServiceData, GetServiceVariables>;
  operationName: string;
}
export const getServiceRef: GetServiceRef;

export function getService(vars: GetServiceVariables, options?: ExecuteQueryOptions): QueryPromise<GetServiceData, GetServiceVariables>;
export function getService(dc: DataConnect, vars: GetServiceVariables, options?: ExecuteQueryOptions): QueryPromise<GetServiceData, GetServiceVariables>;

interface ListServicesRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListServicesData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListServicesData, undefined>;
  operationName: string;
}
export const listServicesRef: ListServicesRef;

export function listServices(options?: ExecuteQueryOptions): QueryPromise<ListServicesData, undefined>;
export function listServices(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListServicesData, undefined>;

interface CreateAppointmentRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateAppointmentVariables): MutationRef<CreateAppointmentData, CreateAppointmentVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateAppointmentVariables): MutationRef<CreateAppointmentData, CreateAppointmentVariables>;
  operationName: string;
}
export const createAppointmentRef: CreateAppointmentRef;

export function createAppointment(vars: CreateAppointmentVariables): MutationPromise<CreateAppointmentData, CreateAppointmentVariables>;
export function createAppointment(dc: DataConnect, vars: CreateAppointmentVariables): MutationPromise<CreateAppointmentData, CreateAppointmentVariables>;

interface UpdateAppointmentRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateAppointmentVariables): MutationRef<UpdateAppointmentData, UpdateAppointmentVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateAppointmentVariables): MutationRef<UpdateAppointmentData, UpdateAppointmentVariables>;
  operationName: string;
}
export const updateAppointmentRef: UpdateAppointmentRef;

export function updateAppointment(vars: UpdateAppointmentVariables): MutationPromise<UpdateAppointmentData, UpdateAppointmentVariables>;
export function updateAppointment(dc: DataConnect, vars: UpdateAppointmentVariables): MutationPromise<UpdateAppointmentData, UpdateAppointmentVariables>;

interface DeleteAppointmentRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteAppointmentVariables): MutationRef<DeleteAppointmentData, DeleteAppointmentVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteAppointmentVariables): MutationRef<DeleteAppointmentData, DeleteAppointmentVariables>;
  operationName: string;
}
export const deleteAppointmentRef: DeleteAppointmentRef;

export function deleteAppointment(vars: DeleteAppointmentVariables): MutationPromise<DeleteAppointmentData, DeleteAppointmentVariables>;
export function deleteAppointment(dc: DataConnect, vars: DeleteAppointmentVariables): MutationPromise<DeleteAppointmentData, DeleteAppointmentVariables>;

interface GetMyAppointmentRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetMyAppointmentVariables): QueryRef<GetMyAppointmentData, GetMyAppointmentVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetMyAppointmentVariables): QueryRef<GetMyAppointmentData, GetMyAppointmentVariables>;
  operationName: string;
}
export const getMyAppointmentRef: GetMyAppointmentRef;

export function getMyAppointment(vars: GetMyAppointmentVariables, options?: ExecuteQueryOptions): QueryPromise<GetMyAppointmentData, GetMyAppointmentVariables>;
export function getMyAppointment(dc: DataConnect, vars: GetMyAppointmentVariables, options?: ExecuteQueryOptions): QueryPromise<GetMyAppointmentData, GetMyAppointmentVariables>;

interface ListMyAppointmentsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListMyAppointmentsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListMyAppointmentsData, undefined>;
  operationName: string;
}
export const listMyAppointmentsRef: ListMyAppointmentsRef;

export function listMyAppointments(options?: ExecuteQueryOptions): QueryPromise<ListMyAppointmentsData, undefined>;
export function listMyAppointments(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListMyAppointmentsData, undefined>;

interface CreateReviewRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateReviewVariables): MutationRef<CreateReviewData, CreateReviewVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateReviewVariables): MutationRef<CreateReviewData, CreateReviewVariables>;
  operationName: string;
}
export const createReviewRef: CreateReviewRef;

export function createReview(vars: CreateReviewVariables): MutationPromise<CreateReviewData, CreateReviewVariables>;
export function createReview(dc: DataConnect, vars: CreateReviewVariables): MutationPromise<CreateReviewData, CreateReviewVariables>;

interface UpdateReviewRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateReviewVariables): MutationRef<UpdateReviewData, UpdateReviewVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateReviewVariables): MutationRef<UpdateReviewData, UpdateReviewVariables>;
  operationName: string;
}
export const updateReviewRef: UpdateReviewRef;

export function updateReview(vars: UpdateReviewVariables): MutationPromise<UpdateReviewData, UpdateReviewVariables>;
export function updateReview(dc: DataConnect, vars: UpdateReviewVariables): MutationPromise<UpdateReviewData, UpdateReviewVariables>;

interface DeleteReviewRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteReviewVariables): MutationRef<DeleteReviewData, DeleteReviewVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteReviewVariables): MutationRef<DeleteReviewData, DeleteReviewVariables>;
  operationName: string;
}
export const deleteReviewRef: DeleteReviewRef;

export function deleteReview(vars: DeleteReviewVariables): MutationPromise<DeleteReviewData, DeleteReviewVariables>;
export function deleteReview(dc: DataConnect, vars: DeleteReviewVariables): MutationPromise<DeleteReviewData, DeleteReviewVariables>;

interface GetReviewRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetReviewVariables): QueryRef<GetReviewData, GetReviewVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetReviewVariables): QueryRef<GetReviewData, GetReviewVariables>;
  operationName: string;
}
export const getReviewRef: GetReviewRef;

export function getReview(vars: GetReviewVariables, options?: ExecuteQueryOptions): QueryPromise<GetReviewData, GetReviewVariables>;
export function getReview(dc: DataConnect, vars: GetReviewVariables, options?: ExecuteQueryOptions): QueryPromise<GetReviewData, GetReviewVariables>;

interface ListReviewsRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListReviewsVariables): QueryRef<ListReviewsData, ListReviewsVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: ListReviewsVariables): QueryRef<ListReviewsData, ListReviewsVariables>;
  operationName: string;
}
export const listReviewsRef: ListReviewsRef;

export function listReviews(vars: ListReviewsVariables, options?: ExecuteQueryOptions): QueryPromise<ListReviewsData, ListReviewsVariables>;
export function listReviews(dc: DataConnect, vars: ListReviewsVariables, options?: ExecuteQueryOptions): QueryPromise<ListReviewsData, ListReviewsVariables>;

