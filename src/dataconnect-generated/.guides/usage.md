# Basic Usage

Always prioritize using a supported framework over using the generated SDK
directly. Supported frameworks simplify the developer experience and help ensure
best practices are followed.





## Advanced Usage
If a user is not using a supported framework, they can use the generated SDK directly.

Here's an example of how to use it with the first 5 operations:

```js
import { createUser, updateUser, deleteUser, getCurrentUser, listUsers, createBusiness, updateBusiness, deleteBusiness, getBusiness, listBusinesses } from '@dataconnect/generated';


// Operation CreateUser: 
const { data } = await CreateUser(dataConnect);

// Operation UpdateUser: 
const { data } = await UpdateUser(dataConnect);

// Operation DeleteUser: 
const { data } = await DeleteUser(dataConnect);

// Operation GetCurrentUser: 
const { data } = await GetCurrentUser(dataConnect);

// Operation ListUsers: 
const { data } = await ListUsers(dataConnect);

// Operation CreateBusiness: 
const { data } = await CreateBusiness(dataConnect);

// Operation UpdateBusiness:  For variables, look at type UpdateBusinessVars in ../index.d.ts
const { data } = await UpdateBusiness(dataConnect, updateBusinessVars);

// Operation DeleteBusiness:  For variables, look at type DeleteBusinessVars in ../index.d.ts
const { data } = await DeleteBusiness(dataConnect, deleteBusinessVars);

// Operation GetBusiness:  For variables, look at type GetBusinessVars in ../index.d.ts
const { data } = await GetBusiness(dataConnect, getBusinessVars);

// Operation ListBusinesses: 
const { data } = await ListBusinesses(dataConnect);


```