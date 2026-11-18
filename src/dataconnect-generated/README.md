# Generated TypeScript README
This README will guide you through the process of using the generated JavaScript SDK package for the connector `example`. It will also provide examples on how to use your generated SDK to call your Data Connect queries and mutations.

***NOTE:** This README is generated alongside the generated SDK. If you make changes to this file, they will be overwritten when the SDK is regenerated.*

# Table of Contents
- [**Overview**](#generated-javascript-readme)
- [**Accessing the connector**](#accessing-the-connector)
  - [*Connecting to the local Emulator*](#connecting-to-the-local-emulator)
- [**Queries**](#queries)
  - [*GetCurrentUser*](#getcurrentuser)
  - [*ListUsers*](#listusers)
  - [*GetBusiness*](#getbusiness)
  - [*ListBusinesses*](#listbusinesses)
  - [*GetService*](#getservice)
  - [*ListServices*](#listservices)
  - [*GetMyAppointment*](#getmyappointment)
  - [*ListMyAppointments*](#listmyappointments)
  - [*GetReview*](#getreview)
  - [*ListReviews*](#listreviews)
- [**Mutations**](#mutations)
  - [*CreateUser*](#createuser)
  - [*UpdateUser*](#updateuser)
  - [*DeleteUser*](#deleteuser)
  - [*CreateBusiness*](#createbusiness)
  - [*UpdateBusiness*](#updatebusiness)
  - [*DeleteBusiness*](#deletebusiness)
  - [*CreateService*](#createservice)
  - [*UpdateService*](#updateservice)
  - [*DeleteService*](#deleteservice)
  - [*CreateAppointment*](#createappointment)
  - [*UpdateAppointment*](#updateappointment)
  - [*DeleteAppointment*](#deleteappointment)
  - [*CreateReview*](#createreview)
  - [*UpdateReview*](#updatereview)
  - [*DeleteReview*](#deletereview)

# Accessing the connector
A connector is a collection of Queries and Mutations. One SDK is generated for each connector - this SDK is generated for the connector `example`. You can find more information about connectors in the [Data Connect documentation](https://firebase.google.com/docs/data-connect#how-does).

You can use this generated SDK by importing from the package `@dataconnect/generated` as shown below. Both CommonJS and ESM imports are supported.

You can also follow the instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#set-client).

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
```

## Connecting to the local Emulator
By default, the connector will connect to the production service.

To connect to the emulator, you can use the following code.
You can also follow the emulator instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#instrument-clients).

```typescript
import { connectDataConnectEmulator, getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
connectDataConnectEmulator(dataConnect, 'localhost', 9399);
```

After it's initialized, you can call your Data Connect [queries](#queries) and [mutations](#mutations) from your generated SDK.

# Queries

There are two ways to execute a Data Connect Query using the generated Web SDK:
- Using a Query Reference function, which returns a `QueryRef`
  - The `QueryRef` can be used as an argument to `executeQuery()`, which will execute the Query and return a `QueryPromise`
- Using an action shortcut function, which returns a `QueryPromise`
  - Calling the action shortcut function will execute the Query and return a `QueryPromise`

The following is true for both the action shortcut function and the `QueryRef` function:
- The `QueryPromise` returned will resolve to the result of the Query once it has finished executing
- If the Query accepts arguments, both the action shortcut function and the `QueryRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Query
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `example` connector's generated functions to execute each query. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-queries).

## GetCurrentUser
You can execute the `GetCurrentUser` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getCurrentUser(options?: ExecuteQueryOptions): QueryPromise<GetCurrentUserData, undefined>;

interface GetCurrentUserRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetCurrentUserData, undefined>;
}
export const getCurrentUserRef: GetCurrentUserRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getCurrentUser(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<GetCurrentUserData, undefined>;

interface GetCurrentUserRef {
  ...
  (dc: DataConnect): QueryRef<GetCurrentUserData, undefined>;
}
export const getCurrentUserRef: GetCurrentUserRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getCurrentUserRef:
```typescript
const name = getCurrentUserRef.operationName;
console.log(name);
```

### Variables
The `GetCurrentUser` query has no variables.
### Return Type
Recall that executing the `GetCurrentUser` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetCurrentUserData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetCurrentUserData {
  user?: {
    email: string;
    fullName: string;
  };
}
```
### Using `GetCurrentUser`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getCurrentUser } from '@dataconnect/generated';


// Call the `getCurrentUser()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getCurrentUser();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getCurrentUser(dataConnect);

console.log(data.user);

// Or, you can use the `Promise` API.
getCurrentUser().then((response) => {
  const data = response.data;
  console.log(data.user);
});
```

### Using `GetCurrentUser`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getCurrentUserRef } from '@dataconnect/generated';


// Call the `getCurrentUserRef()` function to get a reference to the query.
const ref = getCurrentUserRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getCurrentUserRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.user);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.user);
});
```

## ListUsers
You can execute the `ListUsers` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listUsers(options?: ExecuteQueryOptions): QueryPromise<ListUsersData, undefined>;

interface ListUsersRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListUsersData, undefined>;
}
export const listUsersRef: ListUsersRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listUsers(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListUsersData, undefined>;

interface ListUsersRef {
  ...
  (dc: DataConnect): QueryRef<ListUsersData, undefined>;
}
export const listUsersRef: ListUsersRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listUsersRef:
```typescript
const name = listUsersRef.operationName;
console.log(name);
```

### Variables
The `ListUsers` query has no variables.
### Return Type
Recall that executing the `ListUsers` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListUsersData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListUsersData {
  users: ({
    fullName: string;
    role: string;
  })[];
}
```
### Using `ListUsers`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listUsers } from '@dataconnect/generated';


// Call the `listUsers()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listUsers();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listUsers(dataConnect);

console.log(data.users);

// Or, you can use the `Promise` API.
listUsers().then((response) => {
  const data = response.data;
  console.log(data.users);
});
```

### Using `ListUsers`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listUsersRef } from '@dataconnect/generated';


// Call the `listUsersRef()` function to get a reference to the query.
const ref = listUsersRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listUsersRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.users);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.users);
});
```

## GetBusiness
You can execute the `GetBusiness` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getBusiness(vars: GetBusinessVariables, options?: ExecuteQueryOptions): QueryPromise<GetBusinessData, GetBusinessVariables>;

interface GetBusinessRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetBusinessVariables): QueryRef<GetBusinessData, GetBusinessVariables>;
}
export const getBusinessRef: GetBusinessRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getBusiness(dc: DataConnect, vars: GetBusinessVariables, options?: ExecuteQueryOptions): QueryPromise<GetBusinessData, GetBusinessVariables>;

interface GetBusinessRef {
  ...
  (dc: DataConnect, vars: GetBusinessVariables): QueryRef<GetBusinessData, GetBusinessVariables>;
}
export const getBusinessRef: GetBusinessRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getBusinessRef:
```typescript
const name = getBusinessRef.operationName;
console.log(name);
```

### Variables
The `GetBusiness` query requires an argument of type `GetBusinessVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetBusinessVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `GetBusiness` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetBusinessData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetBusinessData {
  business?: {
    name: string;
    address: string;
    owner: {
      fullName: string;
    };
  };
}
```
### Using `GetBusiness`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getBusiness, GetBusinessVariables } from '@dataconnect/generated';

// The `GetBusiness` query requires an argument of type `GetBusinessVariables`:
const getBusinessVars: GetBusinessVariables = {
  id: ..., 
};

// Call the `getBusiness()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getBusiness(getBusinessVars);
// Variables can be defined inline as well.
const { data } = await getBusiness({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getBusiness(dataConnect, getBusinessVars);

console.log(data.business);

// Or, you can use the `Promise` API.
getBusiness(getBusinessVars).then((response) => {
  const data = response.data;
  console.log(data.business);
});
```

### Using `GetBusiness`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getBusinessRef, GetBusinessVariables } from '@dataconnect/generated';

// The `GetBusiness` query requires an argument of type `GetBusinessVariables`:
const getBusinessVars: GetBusinessVariables = {
  id: ..., 
};

// Call the `getBusinessRef()` function to get a reference to the query.
const ref = getBusinessRef(getBusinessVars);
// Variables can be defined inline as well.
const ref = getBusinessRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getBusinessRef(dataConnect, getBusinessVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.business);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.business);
});
```

## ListBusinesses
You can execute the `ListBusinesses` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listBusinesses(options?: ExecuteQueryOptions): QueryPromise<ListBusinessesData, undefined>;

interface ListBusinessesRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListBusinessesData, undefined>;
}
export const listBusinessesRef: ListBusinessesRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listBusinesses(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListBusinessesData, undefined>;

interface ListBusinessesRef {
  ...
  (dc: DataConnect): QueryRef<ListBusinessesData, undefined>;
}
export const listBusinessesRef: ListBusinessesRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listBusinessesRef:
```typescript
const name = listBusinessesRef.operationName;
console.log(name);
```

### Variables
The `ListBusinesses` query has no variables.
### Return Type
Recall that executing the `ListBusinesses` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListBusinessesData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListBusinessesData {
  businesses: ({
    name: string;
    category: string;
  })[];
}
```
### Using `ListBusinesses`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listBusinesses } from '@dataconnect/generated';


// Call the `listBusinesses()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listBusinesses();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listBusinesses(dataConnect);

console.log(data.businesses);

// Or, you can use the `Promise` API.
listBusinesses().then((response) => {
  const data = response.data;
  console.log(data.businesses);
});
```

### Using `ListBusinesses`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listBusinessesRef } from '@dataconnect/generated';


// Call the `listBusinessesRef()` function to get a reference to the query.
const ref = listBusinessesRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listBusinessesRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.businesses);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.businesses);
});
```

## GetService
You can execute the `GetService` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getService(vars: GetServiceVariables, options?: ExecuteQueryOptions): QueryPromise<GetServiceData, GetServiceVariables>;

interface GetServiceRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetServiceVariables): QueryRef<GetServiceData, GetServiceVariables>;
}
export const getServiceRef: GetServiceRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getService(dc: DataConnect, vars: GetServiceVariables, options?: ExecuteQueryOptions): QueryPromise<GetServiceData, GetServiceVariables>;

interface GetServiceRef {
  ...
  (dc: DataConnect, vars: GetServiceVariables): QueryRef<GetServiceData, GetServiceVariables>;
}
export const getServiceRef: GetServiceRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getServiceRef:
```typescript
const name = getServiceRef.operationName;
console.log(name);
```

### Variables
The `GetService` query requires an argument of type `GetServiceVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetServiceVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `GetService` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetServiceData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetServiceData {
  service?: {
    title: string;
    price: number;
  };
}
```
### Using `GetService`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getService, GetServiceVariables } from '@dataconnect/generated';

// The `GetService` query requires an argument of type `GetServiceVariables`:
const getServiceVars: GetServiceVariables = {
  id: ..., 
};

// Call the `getService()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getService(getServiceVars);
// Variables can be defined inline as well.
const { data } = await getService({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getService(dataConnect, getServiceVars);

console.log(data.service);

// Or, you can use the `Promise` API.
getService(getServiceVars).then((response) => {
  const data = response.data;
  console.log(data.service);
});
```

### Using `GetService`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getServiceRef, GetServiceVariables } from '@dataconnect/generated';

// The `GetService` query requires an argument of type `GetServiceVariables`:
const getServiceVars: GetServiceVariables = {
  id: ..., 
};

// Call the `getServiceRef()` function to get a reference to the query.
const ref = getServiceRef(getServiceVars);
// Variables can be defined inline as well.
const ref = getServiceRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getServiceRef(dataConnect, getServiceVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.service);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.service);
});
```

## ListServices
You can execute the `ListServices` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listServices(options?: ExecuteQueryOptions): QueryPromise<ListServicesData, undefined>;

interface ListServicesRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListServicesData, undefined>;
}
export const listServicesRef: ListServicesRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listServices(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListServicesData, undefined>;

interface ListServicesRef {
  ...
  (dc: DataConnect): QueryRef<ListServicesData, undefined>;
}
export const listServicesRef: ListServicesRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listServicesRef:
```typescript
const name = listServicesRef.operationName;
console.log(name);
```

### Variables
The `ListServices` query has no variables.
### Return Type
Recall that executing the `ListServices` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListServicesData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListServicesData {
  services: ({
    title: string;
    business: {
      name: string;
    };
  })[];
}
```
### Using `ListServices`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listServices } from '@dataconnect/generated';


// Call the `listServices()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listServices();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listServices(dataConnect);

console.log(data.services);

// Or, you can use the `Promise` API.
listServices().then((response) => {
  const data = response.data;
  console.log(data.services);
});
```

### Using `ListServices`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listServicesRef } from '@dataconnect/generated';


// Call the `listServicesRef()` function to get a reference to the query.
const ref = listServicesRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listServicesRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.services);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.services);
});
```

## GetMyAppointment
You can execute the `GetMyAppointment` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getMyAppointment(vars: GetMyAppointmentVariables, options?: ExecuteQueryOptions): QueryPromise<GetMyAppointmentData, GetMyAppointmentVariables>;

interface GetMyAppointmentRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetMyAppointmentVariables): QueryRef<GetMyAppointmentData, GetMyAppointmentVariables>;
}
export const getMyAppointmentRef: GetMyAppointmentRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getMyAppointment(dc: DataConnect, vars: GetMyAppointmentVariables, options?: ExecuteQueryOptions): QueryPromise<GetMyAppointmentData, GetMyAppointmentVariables>;

interface GetMyAppointmentRef {
  ...
  (dc: DataConnect, vars: GetMyAppointmentVariables): QueryRef<GetMyAppointmentData, GetMyAppointmentVariables>;
}
export const getMyAppointmentRef: GetMyAppointmentRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getMyAppointmentRef:
```typescript
const name = getMyAppointmentRef.operationName;
console.log(name);
```

### Variables
The `GetMyAppointment` query requires an argument of type `GetMyAppointmentVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetMyAppointmentVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `GetMyAppointment` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetMyAppointmentData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetMyAppointmentData {
  appointment?: {
    startTime: TimestampString;
    status: string;
    service: {
      title: string;
    };
  };
}
```
### Using `GetMyAppointment`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getMyAppointment, GetMyAppointmentVariables } from '@dataconnect/generated';

// The `GetMyAppointment` query requires an argument of type `GetMyAppointmentVariables`:
const getMyAppointmentVars: GetMyAppointmentVariables = {
  id: ..., 
};

// Call the `getMyAppointment()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getMyAppointment(getMyAppointmentVars);
// Variables can be defined inline as well.
const { data } = await getMyAppointment({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getMyAppointment(dataConnect, getMyAppointmentVars);

console.log(data.appointment);

// Or, you can use the `Promise` API.
getMyAppointment(getMyAppointmentVars).then((response) => {
  const data = response.data;
  console.log(data.appointment);
});
```

### Using `GetMyAppointment`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getMyAppointmentRef, GetMyAppointmentVariables } from '@dataconnect/generated';

// The `GetMyAppointment` query requires an argument of type `GetMyAppointmentVariables`:
const getMyAppointmentVars: GetMyAppointmentVariables = {
  id: ..., 
};

// Call the `getMyAppointmentRef()` function to get a reference to the query.
const ref = getMyAppointmentRef(getMyAppointmentVars);
// Variables can be defined inline as well.
const ref = getMyAppointmentRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getMyAppointmentRef(dataConnect, getMyAppointmentVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.appointment);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.appointment);
});
```

## ListMyAppointments
You can execute the `ListMyAppointments` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listMyAppointments(options?: ExecuteQueryOptions): QueryPromise<ListMyAppointmentsData, undefined>;

interface ListMyAppointmentsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListMyAppointmentsData, undefined>;
}
export const listMyAppointmentsRef: ListMyAppointmentsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listMyAppointments(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<ListMyAppointmentsData, undefined>;

interface ListMyAppointmentsRef {
  ...
  (dc: DataConnect): QueryRef<ListMyAppointmentsData, undefined>;
}
export const listMyAppointmentsRef: ListMyAppointmentsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listMyAppointmentsRef:
```typescript
const name = listMyAppointmentsRef.operationName;
console.log(name);
```

### Variables
The `ListMyAppointments` query has no variables.
### Return Type
Recall that executing the `ListMyAppointments` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListMyAppointmentsData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListMyAppointmentsData {
  appointments: ({
    startTime: TimestampString;
    status: string;
  })[];
}
```
### Using `ListMyAppointments`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listMyAppointments } from '@dataconnect/generated';


// Call the `listMyAppointments()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listMyAppointments();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listMyAppointments(dataConnect);

console.log(data.appointments);

// Or, you can use the `Promise` API.
listMyAppointments().then((response) => {
  const data = response.data;
  console.log(data.appointments);
});
```

### Using `ListMyAppointments`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listMyAppointmentsRef } from '@dataconnect/generated';


// Call the `listMyAppointmentsRef()` function to get a reference to the query.
const ref = listMyAppointmentsRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listMyAppointmentsRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.appointments);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.appointments);
});
```

## GetReview
You can execute the `GetReview` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getReview(vars: GetReviewVariables, options?: ExecuteQueryOptions): QueryPromise<GetReviewData, GetReviewVariables>;

interface GetReviewRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetReviewVariables): QueryRef<GetReviewData, GetReviewVariables>;
}
export const getReviewRef: GetReviewRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getReview(dc: DataConnect, vars: GetReviewVariables, options?: ExecuteQueryOptions): QueryPromise<GetReviewData, GetReviewVariables>;

interface GetReviewRef {
  ...
  (dc: DataConnect, vars: GetReviewVariables): QueryRef<GetReviewData, GetReviewVariables>;
}
export const getReviewRef: GetReviewRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getReviewRef:
```typescript
const name = getReviewRef.operationName;
console.log(name);
```

### Variables
The `GetReview` query requires an argument of type `GetReviewVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetReviewVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `GetReview` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetReviewData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetReviewData {
  review?: {
    rating: number;
    comment?: string | null;
    author: {
      fullName: string;
    };
  };
}
```
### Using `GetReview`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getReview, GetReviewVariables } from '@dataconnect/generated';

// The `GetReview` query requires an argument of type `GetReviewVariables`:
const getReviewVars: GetReviewVariables = {
  id: ..., 
};

// Call the `getReview()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getReview(getReviewVars);
// Variables can be defined inline as well.
const { data } = await getReview({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getReview(dataConnect, getReviewVars);

console.log(data.review);

// Or, you can use the `Promise` API.
getReview(getReviewVars).then((response) => {
  const data = response.data;
  console.log(data.review);
});
```

### Using `GetReview`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getReviewRef, GetReviewVariables } from '@dataconnect/generated';

// The `GetReview` query requires an argument of type `GetReviewVariables`:
const getReviewVars: GetReviewVariables = {
  id: ..., 
};

// Call the `getReviewRef()` function to get a reference to the query.
const ref = getReviewRef(getReviewVars);
// Variables can be defined inline as well.
const ref = getReviewRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getReviewRef(dataConnect, getReviewVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.review);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.review);
});
```

## ListReviews
You can execute the `ListReviews` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listReviews(vars: ListReviewsVariables, options?: ExecuteQueryOptions): QueryPromise<ListReviewsData, ListReviewsVariables>;

interface ListReviewsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListReviewsVariables): QueryRef<ListReviewsData, ListReviewsVariables>;
}
export const listReviewsRef: ListReviewsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listReviews(dc: DataConnect, vars: ListReviewsVariables, options?: ExecuteQueryOptions): QueryPromise<ListReviewsData, ListReviewsVariables>;

interface ListReviewsRef {
  ...
  (dc: DataConnect, vars: ListReviewsVariables): QueryRef<ListReviewsData, ListReviewsVariables>;
}
export const listReviewsRef: ListReviewsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listReviewsRef:
```typescript
const name = listReviewsRef.operationName;
console.log(name);
```

### Variables
The `ListReviews` query requires an argument of type `ListReviewsVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface ListReviewsVariables {
  businessId: UUIDString;
}
```
### Return Type
Recall that executing the `ListReviews` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListReviewsData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListReviewsData {
  reviews: ({
    rating: number;
    comment?: string | null;
  })[];
}
```
### Using `ListReviews`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listReviews, ListReviewsVariables } from '@dataconnect/generated';

// The `ListReviews` query requires an argument of type `ListReviewsVariables`:
const listReviewsVars: ListReviewsVariables = {
  businessId: ..., 
};

// Call the `listReviews()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listReviews(listReviewsVars);
// Variables can be defined inline as well.
const { data } = await listReviews({ businessId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listReviews(dataConnect, listReviewsVars);

console.log(data.reviews);

// Or, you can use the `Promise` API.
listReviews(listReviewsVars).then((response) => {
  const data = response.data;
  console.log(data.reviews);
});
```

### Using `ListReviews`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listReviewsRef, ListReviewsVariables } from '@dataconnect/generated';

// The `ListReviews` query requires an argument of type `ListReviewsVariables`:
const listReviewsVars: ListReviewsVariables = {
  businessId: ..., 
};

// Call the `listReviewsRef()` function to get a reference to the query.
const ref = listReviewsRef(listReviewsVars);
// Variables can be defined inline as well.
const ref = listReviewsRef({ businessId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listReviewsRef(dataConnect, listReviewsVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.reviews);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.reviews);
});
```

# Mutations

There are two ways to execute a Data Connect Mutation using the generated Web SDK:
- Using a Mutation Reference function, which returns a `MutationRef`
  - The `MutationRef` can be used as an argument to `executeMutation()`, which will execute the Mutation and return a `MutationPromise`
- Using an action shortcut function, which returns a `MutationPromise`
  - Calling the action shortcut function will execute the Mutation and return a `MutationPromise`

The following is true for both the action shortcut function and the `MutationRef` function:
- The `MutationPromise` returned will resolve to the result of the Mutation once it has finished executing
- If the Mutation accepts arguments, both the action shortcut function and the `MutationRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Mutation
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `example` connector's generated functions to execute each mutation. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-mutations).

## CreateUser
You can execute the `CreateUser` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createUser(): MutationPromise<CreateUserData, undefined>;

interface CreateUserRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): MutationRef<CreateUserData, undefined>;
}
export const createUserRef: CreateUserRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createUser(dc: DataConnect): MutationPromise<CreateUserData, undefined>;

interface CreateUserRef {
  ...
  (dc: DataConnect): MutationRef<CreateUserData, undefined>;
}
export const createUserRef: CreateUserRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createUserRef:
```typescript
const name = createUserRef.operationName;
console.log(name);
```

### Variables
The `CreateUser` mutation has no variables.
### Return Type
Recall that executing the `CreateUser` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateUserData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateUserData {
  user_insert: User_Key;
}
```
### Using `CreateUser`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createUser } from '@dataconnect/generated';


// Call the `createUser()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createUser();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createUser(dataConnect);

console.log(data.user_insert);

// Or, you can use the `Promise` API.
createUser().then((response) => {
  const data = response.data;
  console.log(data.user_insert);
});
```

### Using `CreateUser`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createUserRef } from '@dataconnect/generated';


// Call the `createUserRef()` function to get a reference to the mutation.
const ref = createUserRef();

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createUserRef(dataConnect);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.user_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.user_insert);
});
```

## UpdateUser
You can execute the `UpdateUser` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
updateUser(): MutationPromise<UpdateUserData, undefined>;

interface UpdateUserRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): MutationRef<UpdateUserData, undefined>;
}
export const updateUserRef: UpdateUserRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateUser(dc: DataConnect): MutationPromise<UpdateUserData, undefined>;

interface UpdateUserRef {
  ...
  (dc: DataConnect): MutationRef<UpdateUserData, undefined>;
}
export const updateUserRef: UpdateUserRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateUserRef:
```typescript
const name = updateUserRef.operationName;
console.log(name);
```

### Variables
The `UpdateUser` mutation has no variables.
### Return Type
Recall that executing the `UpdateUser` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateUserData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateUserData {
  user_update?: User_Key | null;
}
```
### Using `UpdateUser`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateUser } from '@dataconnect/generated';


// Call the `updateUser()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateUser();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateUser(dataConnect);

console.log(data.user_update);

// Or, you can use the `Promise` API.
updateUser().then((response) => {
  const data = response.data;
  console.log(data.user_update);
});
```

### Using `UpdateUser`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateUserRef } from '@dataconnect/generated';


// Call the `updateUserRef()` function to get a reference to the mutation.
const ref = updateUserRef();

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateUserRef(dataConnect);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.user_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.user_update);
});
```

## DeleteUser
You can execute the `DeleteUser` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
deleteUser(): MutationPromise<DeleteUserData, undefined>;

interface DeleteUserRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): MutationRef<DeleteUserData, undefined>;
}
export const deleteUserRef: DeleteUserRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteUser(dc: DataConnect): MutationPromise<DeleteUserData, undefined>;

interface DeleteUserRef {
  ...
  (dc: DataConnect): MutationRef<DeleteUserData, undefined>;
}
export const deleteUserRef: DeleteUserRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteUserRef:
```typescript
const name = deleteUserRef.operationName;
console.log(name);
```

### Variables
The `DeleteUser` mutation has no variables.
### Return Type
Recall that executing the `DeleteUser` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteUserData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteUserData {
  user_delete?: User_Key | null;
}
```
### Using `DeleteUser`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteUser } from '@dataconnect/generated';


// Call the `deleteUser()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteUser();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteUser(dataConnect);

console.log(data.user_delete);

// Or, you can use the `Promise` API.
deleteUser().then((response) => {
  const data = response.data;
  console.log(data.user_delete);
});
```

### Using `DeleteUser`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteUserRef } from '@dataconnect/generated';


// Call the `deleteUserRef()` function to get a reference to the mutation.
const ref = deleteUserRef();

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteUserRef(dataConnect);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.user_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.user_delete);
});
```

## CreateBusiness
You can execute the `CreateBusiness` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createBusiness(): MutationPromise<CreateBusinessData, undefined>;

interface CreateBusinessRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): MutationRef<CreateBusinessData, undefined>;
}
export const createBusinessRef: CreateBusinessRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createBusiness(dc: DataConnect): MutationPromise<CreateBusinessData, undefined>;

interface CreateBusinessRef {
  ...
  (dc: DataConnect): MutationRef<CreateBusinessData, undefined>;
}
export const createBusinessRef: CreateBusinessRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createBusinessRef:
```typescript
const name = createBusinessRef.operationName;
console.log(name);
```

### Variables
The `CreateBusiness` mutation has no variables.
### Return Type
Recall that executing the `CreateBusiness` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateBusinessData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateBusinessData {
  business_insert: Business_Key;
}
```
### Using `CreateBusiness`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createBusiness } from '@dataconnect/generated';


// Call the `createBusiness()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createBusiness();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createBusiness(dataConnect);

console.log(data.business_insert);

// Or, you can use the `Promise` API.
createBusiness().then((response) => {
  const data = response.data;
  console.log(data.business_insert);
});
```

### Using `CreateBusiness`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createBusinessRef } from '@dataconnect/generated';


// Call the `createBusinessRef()` function to get a reference to the mutation.
const ref = createBusinessRef();

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createBusinessRef(dataConnect);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.business_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.business_insert);
});
```

## UpdateBusiness
You can execute the `UpdateBusiness` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
updateBusiness(vars: UpdateBusinessVariables): MutationPromise<UpdateBusinessData, UpdateBusinessVariables>;

interface UpdateBusinessRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateBusinessVariables): MutationRef<UpdateBusinessData, UpdateBusinessVariables>;
}
export const updateBusinessRef: UpdateBusinessRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateBusiness(dc: DataConnect, vars: UpdateBusinessVariables): MutationPromise<UpdateBusinessData, UpdateBusinessVariables>;

interface UpdateBusinessRef {
  ...
  (dc: DataConnect, vars: UpdateBusinessVariables): MutationRef<UpdateBusinessData, UpdateBusinessVariables>;
}
export const updateBusinessRef: UpdateBusinessRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateBusinessRef:
```typescript
const name = updateBusinessRef.operationName;
console.log(name);
```

### Variables
The `UpdateBusiness` mutation requires an argument of type `UpdateBusinessVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateBusinessVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `UpdateBusiness` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateBusinessData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateBusinessData {
  business_update?: Business_Key | null;
}
```
### Using `UpdateBusiness`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateBusiness, UpdateBusinessVariables } from '@dataconnect/generated';

// The `UpdateBusiness` mutation requires an argument of type `UpdateBusinessVariables`:
const updateBusinessVars: UpdateBusinessVariables = {
  id: ..., 
};

// Call the `updateBusiness()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateBusiness(updateBusinessVars);
// Variables can be defined inline as well.
const { data } = await updateBusiness({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateBusiness(dataConnect, updateBusinessVars);

console.log(data.business_update);

// Or, you can use the `Promise` API.
updateBusiness(updateBusinessVars).then((response) => {
  const data = response.data;
  console.log(data.business_update);
});
```

### Using `UpdateBusiness`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateBusinessRef, UpdateBusinessVariables } from '@dataconnect/generated';

// The `UpdateBusiness` mutation requires an argument of type `UpdateBusinessVariables`:
const updateBusinessVars: UpdateBusinessVariables = {
  id: ..., 
};

// Call the `updateBusinessRef()` function to get a reference to the mutation.
const ref = updateBusinessRef(updateBusinessVars);
// Variables can be defined inline as well.
const ref = updateBusinessRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateBusinessRef(dataConnect, updateBusinessVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.business_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.business_update);
});
```

## DeleteBusiness
You can execute the `DeleteBusiness` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
deleteBusiness(vars: DeleteBusinessVariables): MutationPromise<DeleteBusinessData, DeleteBusinessVariables>;

interface DeleteBusinessRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteBusinessVariables): MutationRef<DeleteBusinessData, DeleteBusinessVariables>;
}
export const deleteBusinessRef: DeleteBusinessRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteBusiness(dc: DataConnect, vars: DeleteBusinessVariables): MutationPromise<DeleteBusinessData, DeleteBusinessVariables>;

interface DeleteBusinessRef {
  ...
  (dc: DataConnect, vars: DeleteBusinessVariables): MutationRef<DeleteBusinessData, DeleteBusinessVariables>;
}
export const deleteBusinessRef: DeleteBusinessRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteBusinessRef:
```typescript
const name = deleteBusinessRef.operationName;
console.log(name);
```

### Variables
The `DeleteBusiness` mutation requires an argument of type `DeleteBusinessVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteBusinessVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `DeleteBusiness` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteBusinessData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteBusinessData {
  business_delete?: Business_Key | null;
}
```
### Using `DeleteBusiness`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteBusiness, DeleteBusinessVariables } from '@dataconnect/generated';

// The `DeleteBusiness` mutation requires an argument of type `DeleteBusinessVariables`:
const deleteBusinessVars: DeleteBusinessVariables = {
  id: ..., 
};

// Call the `deleteBusiness()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteBusiness(deleteBusinessVars);
// Variables can be defined inline as well.
const { data } = await deleteBusiness({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteBusiness(dataConnect, deleteBusinessVars);

console.log(data.business_delete);

// Or, you can use the `Promise` API.
deleteBusiness(deleteBusinessVars).then((response) => {
  const data = response.data;
  console.log(data.business_delete);
});
```

### Using `DeleteBusiness`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteBusinessRef, DeleteBusinessVariables } from '@dataconnect/generated';

// The `DeleteBusiness` mutation requires an argument of type `DeleteBusinessVariables`:
const deleteBusinessVars: DeleteBusinessVariables = {
  id: ..., 
};

// Call the `deleteBusinessRef()` function to get a reference to the mutation.
const ref = deleteBusinessRef(deleteBusinessVars);
// Variables can be defined inline as well.
const ref = deleteBusinessRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteBusinessRef(dataConnect, deleteBusinessVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.business_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.business_delete);
});
```

## CreateService
You can execute the `CreateService` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createService(vars: CreateServiceVariables): MutationPromise<CreateServiceData, CreateServiceVariables>;

interface CreateServiceRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateServiceVariables): MutationRef<CreateServiceData, CreateServiceVariables>;
}
export const createServiceRef: CreateServiceRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createService(dc: DataConnect, vars: CreateServiceVariables): MutationPromise<CreateServiceData, CreateServiceVariables>;

interface CreateServiceRef {
  ...
  (dc: DataConnect, vars: CreateServiceVariables): MutationRef<CreateServiceData, CreateServiceVariables>;
}
export const createServiceRef: CreateServiceRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createServiceRef:
```typescript
const name = createServiceRef.operationName;
console.log(name);
```

### Variables
The `CreateService` mutation requires an argument of type `CreateServiceVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateServiceVariables {
  businessId: UUIDString;
}
```
### Return Type
Recall that executing the `CreateService` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateServiceData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateServiceData {
  service_insert: Service_Key;
}
```
### Using `CreateService`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createService, CreateServiceVariables } from '@dataconnect/generated';

// The `CreateService` mutation requires an argument of type `CreateServiceVariables`:
const createServiceVars: CreateServiceVariables = {
  businessId: ..., 
};

// Call the `createService()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createService(createServiceVars);
// Variables can be defined inline as well.
const { data } = await createService({ businessId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createService(dataConnect, createServiceVars);

console.log(data.service_insert);

// Or, you can use the `Promise` API.
createService(createServiceVars).then((response) => {
  const data = response.data;
  console.log(data.service_insert);
});
```

### Using `CreateService`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createServiceRef, CreateServiceVariables } from '@dataconnect/generated';

// The `CreateService` mutation requires an argument of type `CreateServiceVariables`:
const createServiceVars: CreateServiceVariables = {
  businessId: ..., 
};

// Call the `createServiceRef()` function to get a reference to the mutation.
const ref = createServiceRef(createServiceVars);
// Variables can be defined inline as well.
const ref = createServiceRef({ businessId: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createServiceRef(dataConnect, createServiceVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.service_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.service_insert);
});
```

## UpdateService
You can execute the `UpdateService` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
updateService(vars: UpdateServiceVariables): MutationPromise<UpdateServiceData, UpdateServiceVariables>;

interface UpdateServiceRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateServiceVariables): MutationRef<UpdateServiceData, UpdateServiceVariables>;
}
export const updateServiceRef: UpdateServiceRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateService(dc: DataConnect, vars: UpdateServiceVariables): MutationPromise<UpdateServiceData, UpdateServiceVariables>;

interface UpdateServiceRef {
  ...
  (dc: DataConnect, vars: UpdateServiceVariables): MutationRef<UpdateServiceData, UpdateServiceVariables>;
}
export const updateServiceRef: UpdateServiceRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateServiceRef:
```typescript
const name = updateServiceRef.operationName;
console.log(name);
```

### Variables
The `UpdateService` mutation requires an argument of type `UpdateServiceVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateServiceVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `UpdateService` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateServiceData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateServiceData {
  service_update?: Service_Key | null;
}
```
### Using `UpdateService`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateService, UpdateServiceVariables } from '@dataconnect/generated';

// The `UpdateService` mutation requires an argument of type `UpdateServiceVariables`:
const updateServiceVars: UpdateServiceVariables = {
  id: ..., 
};

// Call the `updateService()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateService(updateServiceVars);
// Variables can be defined inline as well.
const { data } = await updateService({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateService(dataConnect, updateServiceVars);

console.log(data.service_update);

// Or, you can use the `Promise` API.
updateService(updateServiceVars).then((response) => {
  const data = response.data;
  console.log(data.service_update);
});
```

### Using `UpdateService`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateServiceRef, UpdateServiceVariables } from '@dataconnect/generated';

// The `UpdateService` mutation requires an argument of type `UpdateServiceVariables`:
const updateServiceVars: UpdateServiceVariables = {
  id: ..., 
};

// Call the `updateServiceRef()` function to get a reference to the mutation.
const ref = updateServiceRef(updateServiceVars);
// Variables can be defined inline as well.
const ref = updateServiceRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateServiceRef(dataConnect, updateServiceVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.service_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.service_update);
});
```

## DeleteService
You can execute the `DeleteService` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
deleteService(vars: DeleteServiceVariables): MutationPromise<DeleteServiceData, DeleteServiceVariables>;

interface DeleteServiceRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteServiceVariables): MutationRef<DeleteServiceData, DeleteServiceVariables>;
}
export const deleteServiceRef: DeleteServiceRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteService(dc: DataConnect, vars: DeleteServiceVariables): MutationPromise<DeleteServiceData, DeleteServiceVariables>;

interface DeleteServiceRef {
  ...
  (dc: DataConnect, vars: DeleteServiceVariables): MutationRef<DeleteServiceData, DeleteServiceVariables>;
}
export const deleteServiceRef: DeleteServiceRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteServiceRef:
```typescript
const name = deleteServiceRef.operationName;
console.log(name);
```

### Variables
The `DeleteService` mutation requires an argument of type `DeleteServiceVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteServiceVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `DeleteService` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteServiceData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteServiceData {
  service_delete?: Service_Key | null;
}
```
### Using `DeleteService`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteService, DeleteServiceVariables } from '@dataconnect/generated';

// The `DeleteService` mutation requires an argument of type `DeleteServiceVariables`:
const deleteServiceVars: DeleteServiceVariables = {
  id: ..., 
};

// Call the `deleteService()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteService(deleteServiceVars);
// Variables can be defined inline as well.
const { data } = await deleteService({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteService(dataConnect, deleteServiceVars);

console.log(data.service_delete);

// Or, you can use the `Promise` API.
deleteService(deleteServiceVars).then((response) => {
  const data = response.data;
  console.log(data.service_delete);
});
```

### Using `DeleteService`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteServiceRef, DeleteServiceVariables } from '@dataconnect/generated';

// The `DeleteService` mutation requires an argument of type `DeleteServiceVariables`:
const deleteServiceVars: DeleteServiceVariables = {
  id: ..., 
};

// Call the `deleteServiceRef()` function to get a reference to the mutation.
const ref = deleteServiceRef(deleteServiceVars);
// Variables can be defined inline as well.
const ref = deleteServiceRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteServiceRef(dataConnect, deleteServiceVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.service_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.service_delete);
});
```

## CreateAppointment
You can execute the `CreateAppointment` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createAppointment(vars: CreateAppointmentVariables): MutationPromise<CreateAppointmentData, CreateAppointmentVariables>;

interface CreateAppointmentRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateAppointmentVariables): MutationRef<CreateAppointmentData, CreateAppointmentVariables>;
}
export const createAppointmentRef: CreateAppointmentRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createAppointment(dc: DataConnect, vars: CreateAppointmentVariables): MutationPromise<CreateAppointmentData, CreateAppointmentVariables>;

interface CreateAppointmentRef {
  ...
  (dc: DataConnect, vars: CreateAppointmentVariables): MutationRef<CreateAppointmentData, CreateAppointmentVariables>;
}
export const createAppointmentRef: CreateAppointmentRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createAppointmentRef:
```typescript
const name = createAppointmentRef.operationName;
console.log(name);
```

### Variables
The `CreateAppointment` mutation requires an argument of type `CreateAppointmentVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateAppointmentVariables {
  serviceId: UUIDString;
  startTime: TimestampString;
  endTime: TimestampString;
}
```
### Return Type
Recall that executing the `CreateAppointment` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateAppointmentData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateAppointmentData {
  appointment_insert: Appointment_Key;
}
```
### Using `CreateAppointment`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createAppointment, CreateAppointmentVariables } from '@dataconnect/generated';

// The `CreateAppointment` mutation requires an argument of type `CreateAppointmentVariables`:
const createAppointmentVars: CreateAppointmentVariables = {
  serviceId: ..., 
  startTime: ..., 
  endTime: ..., 
};

// Call the `createAppointment()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createAppointment(createAppointmentVars);
// Variables can be defined inline as well.
const { data } = await createAppointment({ serviceId: ..., startTime: ..., endTime: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createAppointment(dataConnect, createAppointmentVars);

console.log(data.appointment_insert);

// Or, you can use the `Promise` API.
createAppointment(createAppointmentVars).then((response) => {
  const data = response.data;
  console.log(data.appointment_insert);
});
```

### Using `CreateAppointment`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createAppointmentRef, CreateAppointmentVariables } from '@dataconnect/generated';

// The `CreateAppointment` mutation requires an argument of type `CreateAppointmentVariables`:
const createAppointmentVars: CreateAppointmentVariables = {
  serviceId: ..., 
  startTime: ..., 
  endTime: ..., 
};

// Call the `createAppointmentRef()` function to get a reference to the mutation.
const ref = createAppointmentRef(createAppointmentVars);
// Variables can be defined inline as well.
const ref = createAppointmentRef({ serviceId: ..., startTime: ..., endTime: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createAppointmentRef(dataConnect, createAppointmentVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.appointment_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.appointment_insert);
});
```

## UpdateAppointment
You can execute the `UpdateAppointment` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
updateAppointment(vars: UpdateAppointmentVariables): MutationPromise<UpdateAppointmentData, UpdateAppointmentVariables>;

interface UpdateAppointmentRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateAppointmentVariables): MutationRef<UpdateAppointmentData, UpdateAppointmentVariables>;
}
export const updateAppointmentRef: UpdateAppointmentRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateAppointment(dc: DataConnect, vars: UpdateAppointmentVariables): MutationPromise<UpdateAppointmentData, UpdateAppointmentVariables>;

interface UpdateAppointmentRef {
  ...
  (dc: DataConnect, vars: UpdateAppointmentVariables): MutationRef<UpdateAppointmentData, UpdateAppointmentVariables>;
}
export const updateAppointmentRef: UpdateAppointmentRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateAppointmentRef:
```typescript
const name = updateAppointmentRef.operationName;
console.log(name);
```

### Variables
The `UpdateAppointment` mutation requires an argument of type `UpdateAppointmentVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateAppointmentVariables {
  id: UUIDString;
  status: string;
}
```
### Return Type
Recall that executing the `UpdateAppointment` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateAppointmentData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateAppointmentData {
  appointment_update?: Appointment_Key | null;
}
```
### Using `UpdateAppointment`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateAppointment, UpdateAppointmentVariables } from '@dataconnect/generated';

// The `UpdateAppointment` mutation requires an argument of type `UpdateAppointmentVariables`:
const updateAppointmentVars: UpdateAppointmentVariables = {
  id: ..., 
  status: ..., 
};

// Call the `updateAppointment()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateAppointment(updateAppointmentVars);
// Variables can be defined inline as well.
const { data } = await updateAppointment({ id: ..., status: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateAppointment(dataConnect, updateAppointmentVars);

console.log(data.appointment_update);

// Or, you can use the `Promise` API.
updateAppointment(updateAppointmentVars).then((response) => {
  const data = response.data;
  console.log(data.appointment_update);
});
```

### Using `UpdateAppointment`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateAppointmentRef, UpdateAppointmentVariables } from '@dataconnect/generated';

// The `UpdateAppointment` mutation requires an argument of type `UpdateAppointmentVariables`:
const updateAppointmentVars: UpdateAppointmentVariables = {
  id: ..., 
  status: ..., 
};

// Call the `updateAppointmentRef()` function to get a reference to the mutation.
const ref = updateAppointmentRef(updateAppointmentVars);
// Variables can be defined inline as well.
const ref = updateAppointmentRef({ id: ..., status: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateAppointmentRef(dataConnect, updateAppointmentVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.appointment_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.appointment_update);
});
```

## DeleteAppointment
You can execute the `DeleteAppointment` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
deleteAppointment(vars: DeleteAppointmentVariables): MutationPromise<DeleteAppointmentData, DeleteAppointmentVariables>;

interface DeleteAppointmentRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteAppointmentVariables): MutationRef<DeleteAppointmentData, DeleteAppointmentVariables>;
}
export const deleteAppointmentRef: DeleteAppointmentRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteAppointment(dc: DataConnect, vars: DeleteAppointmentVariables): MutationPromise<DeleteAppointmentData, DeleteAppointmentVariables>;

interface DeleteAppointmentRef {
  ...
  (dc: DataConnect, vars: DeleteAppointmentVariables): MutationRef<DeleteAppointmentData, DeleteAppointmentVariables>;
}
export const deleteAppointmentRef: DeleteAppointmentRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteAppointmentRef:
```typescript
const name = deleteAppointmentRef.operationName;
console.log(name);
```

### Variables
The `DeleteAppointment` mutation requires an argument of type `DeleteAppointmentVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteAppointmentVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `DeleteAppointment` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteAppointmentData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteAppointmentData {
  appointment_delete?: Appointment_Key | null;
}
```
### Using `DeleteAppointment`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteAppointment, DeleteAppointmentVariables } from '@dataconnect/generated';

// The `DeleteAppointment` mutation requires an argument of type `DeleteAppointmentVariables`:
const deleteAppointmentVars: DeleteAppointmentVariables = {
  id: ..., 
};

// Call the `deleteAppointment()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteAppointment(deleteAppointmentVars);
// Variables can be defined inline as well.
const { data } = await deleteAppointment({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteAppointment(dataConnect, deleteAppointmentVars);

console.log(data.appointment_delete);

// Or, you can use the `Promise` API.
deleteAppointment(deleteAppointmentVars).then((response) => {
  const data = response.data;
  console.log(data.appointment_delete);
});
```

### Using `DeleteAppointment`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteAppointmentRef, DeleteAppointmentVariables } from '@dataconnect/generated';

// The `DeleteAppointment` mutation requires an argument of type `DeleteAppointmentVariables`:
const deleteAppointmentVars: DeleteAppointmentVariables = {
  id: ..., 
};

// Call the `deleteAppointmentRef()` function to get a reference to the mutation.
const ref = deleteAppointmentRef(deleteAppointmentVars);
// Variables can be defined inline as well.
const ref = deleteAppointmentRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteAppointmentRef(dataConnect, deleteAppointmentVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.appointment_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.appointment_delete);
});
```

## CreateReview
You can execute the `CreateReview` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createReview(vars: CreateReviewVariables): MutationPromise<CreateReviewData, CreateReviewVariables>;

interface CreateReviewRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateReviewVariables): MutationRef<CreateReviewData, CreateReviewVariables>;
}
export const createReviewRef: CreateReviewRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createReview(dc: DataConnect, vars: CreateReviewVariables): MutationPromise<CreateReviewData, CreateReviewVariables>;

interface CreateReviewRef {
  ...
  (dc: DataConnect, vars: CreateReviewVariables): MutationRef<CreateReviewData, CreateReviewVariables>;
}
export const createReviewRef: CreateReviewRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createReviewRef:
```typescript
const name = createReviewRef.operationName;
console.log(name);
```

### Variables
The `CreateReview` mutation requires an argument of type `CreateReviewVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateReviewVariables {
  businessId: UUIDString;
  rating: number;
}
```
### Return Type
Recall that executing the `CreateReview` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateReviewData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateReviewData {
  review_insert: Review_Key;
}
```
### Using `CreateReview`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createReview, CreateReviewVariables } from '@dataconnect/generated';

// The `CreateReview` mutation requires an argument of type `CreateReviewVariables`:
const createReviewVars: CreateReviewVariables = {
  businessId: ..., 
  rating: ..., 
};

// Call the `createReview()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createReview(createReviewVars);
// Variables can be defined inline as well.
const { data } = await createReview({ businessId: ..., rating: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createReview(dataConnect, createReviewVars);

console.log(data.review_insert);

// Or, you can use the `Promise` API.
createReview(createReviewVars).then((response) => {
  const data = response.data;
  console.log(data.review_insert);
});
```

### Using `CreateReview`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createReviewRef, CreateReviewVariables } from '@dataconnect/generated';

// The `CreateReview` mutation requires an argument of type `CreateReviewVariables`:
const createReviewVars: CreateReviewVariables = {
  businessId: ..., 
  rating: ..., 
};

// Call the `createReviewRef()` function to get a reference to the mutation.
const ref = createReviewRef(createReviewVars);
// Variables can be defined inline as well.
const ref = createReviewRef({ businessId: ..., rating: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createReviewRef(dataConnect, createReviewVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.review_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.review_insert);
});
```

## UpdateReview
You can execute the `UpdateReview` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
updateReview(vars: UpdateReviewVariables): MutationPromise<UpdateReviewData, UpdateReviewVariables>;

interface UpdateReviewRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateReviewVariables): MutationRef<UpdateReviewData, UpdateReviewVariables>;
}
export const updateReviewRef: UpdateReviewRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateReview(dc: DataConnect, vars: UpdateReviewVariables): MutationPromise<UpdateReviewData, UpdateReviewVariables>;

interface UpdateReviewRef {
  ...
  (dc: DataConnect, vars: UpdateReviewVariables): MutationRef<UpdateReviewData, UpdateReviewVariables>;
}
export const updateReviewRef: UpdateReviewRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateReviewRef:
```typescript
const name = updateReviewRef.operationName;
console.log(name);
```

### Variables
The `UpdateReview` mutation requires an argument of type `UpdateReviewVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateReviewVariables {
  id: UUIDString;
  comment: string;
}
```
### Return Type
Recall that executing the `UpdateReview` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateReviewData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateReviewData {
  review_update?: Review_Key | null;
}
```
### Using `UpdateReview`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateReview, UpdateReviewVariables } from '@dataconnect/generated';

// The `UpdateReview` mutation requires an argument of type `UpdateReviewVariables`:
const updateReviewVars: UpdateReviewVariables = {
  id: ..., 
  comment: ..., 
};

// Call the `updateReview()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateReview(updateReviewVars);
// Variables can be defined inline as well.
const { data } = await updateReview({ id: ..., comment: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateReview(dataConnect, updateReviewVars);

console.log(data.review_update);

// Or, you can use the `Promise` API.
updateReview(updateReviewVars).then((response) => {
  const data = response.data;
  console.log(data.review_update);
});
```

### Using `UpdateReview`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateReviewRef, UpdateReviewVariables } from '@dataconnect/generated';

// The `UpdateReview` mutation requires an argument of type `UpdateReviewVariables`:
const updateReviewVars: UpdateReviewVariables = {
  id: ..., 
  comment: ..., 
};

// Call the `updateReviewRef()` function to get a reference to the mutation.
const ref = updateReviewRef(updateReviewVars);
// Variables can be defined inline as well.
const ref = updateReviewRef({ id: ..., comment: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateReviewRef(dataConnect, updateReviewVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.review_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.review_update);
});
```

## DeleteReview
You can execute the `DeleteReview` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
deleteReview(vars: DeleteReviewVariables): MutationPromise<DeleteReviewData, DeleteReviewVariables>;

interface DeleteReviewRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteReviewVariables): MutationRef<DeleteReviewData, DeleteReviewVariables>;
}
export const deleteReviewRef: DeleteReviewRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteReview(dc: DataConnect, vars: DeleteReviewVariables): MutationPromise<DeleteReviewData, DeleteReviewVariables>;

interface DeleteReviewRef {
  ...
  (dc: DataConnect, vars: DeleteReviewVariables): MutationRef<DeleteReviewData, DeleteReviewVariables>;
}
export const deleteReviewRef: DeleteReviewRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteReviewRef:
```typescript
const name = deleteReviewRef.operationName;
console.log(name);
```

### Variables
The `DeleteReview` mutation requires an argument of type `DeleteReviewVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteReviewVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `DeleteReview` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteReviewData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteReviewData {
  review_delete?: Review_Key | null;
}
```
### Using `DeleteReview`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteReview, DeleteReviewVariables } from '@dataconnect/generated';

// The `DeleteReview` mutation requires an argument of type `DeleteReviewVariables`:
const deleteReviewVars: DeleteReviewVariables = {
  id: ..., 
};

// Call the `deleteReview()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteReview(deleteReviewVars);
// Variables can be defined inline as well.
const { data } = await deleteReview({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteReview(dataConnect, deleteReviewVars);

console.log(data.review_delete);

// Or, you can use the `Promise` API.
deleteReview(deleteReviewVars).then((response) => {
  const data = response.data;
  console.log(data.review_delete);
});
```

### Using `DeleteReview`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteReviewRef, DeleteReviewVariables } from '@dataconnect/generated';

// The `DeleteReview` mutation requires an argument of type `DeleteReviewVariables`:
const deleteReviewVars: DeleteReviewVariables = {
  id: ..., 
};

// Call the `deleteReviewRef()` function to get a reference to the mutation.
const ref = deleteReviewRef(deleteReviewVars);
// Variables can be defined inline as well.
const ref = deleteReviewRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteReviewRef(dataConnect, deleteReviewVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.review_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.review_delete);
});
```

