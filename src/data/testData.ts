export const Users = {
  standard: {
    username: process.env.STANDARD_USER || 'standard_user',
    password: process.env.VALID_PASSWORD || 'secret_sauce',
  },
  locked: {
    username: process.env.LOCKED_USER || 'locked_out_user',
    password: process.env.VALID_PASSWORD || 'secret_sauce',
  },
  problem: {
    username: process.env.PROBLEM_USER || 'problem_user',
    password: process.env.VALID_PASSWORD || 'secret_sauce',
  },
  performance: {
    username: process.env.PERFORMANCE_USER || 'performance_glitch_user',
    password: process.env.VALID_PASSWORD || 'secret_sauce',
  },
  invalid: {
    username: 'invalid_user',
    password: 'wrong_password',
  },
  emptyUsername: {
    username: '',
    password: 'secret_sauce',
  },
  emptyPassword: {
    username: 'standard_user',
    password: '',
  },
  emptyBoth: {
    username: '',
    password: '',
  },
};

export const ErrorMessages = {
  lockedOut: 'Epic sadface: Sorry, this user has been locked out.',
  invalidCredentials: 'Epic sadface: Username and password do not match any user in this service',
  usernameRequired: 'Epic sadface: Username is required',
  passwordRequired: 'Epic sadface: Password is required',
};

export const CheckoutData = {
  firstName: 'Thirunavukkarasu',
  lastName: 'Muthusamy',
  postalCode: '600001',
};

export const Products = {
  backpack: 'Sauce Labs Backpack',
  bikeLight: 'Sauce Labs Bike Light',
  boltTShirt: 'Sauce Labs Bolt T-Shirt',
};

export const ApiData = {
  baseUrl: process.env.API_BASE_URL || 'https://simple-books-api.glitch.me',
  clientName: 'Thirunavukkarasu Muthusamy',
  clientEmail: `testuser_${Date.now()}@example.com`,
};
