const mockUsers = [
  {
    _id: '65f7368dfb74bd6a92114c80',
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123',
  },
  {
    _id: '65f7368dfb74bd6a92114c81',
    name: 'Jane Smith',
    email: 'jane@example.com',
    password: 'password123',
  },
];

// Simulate API delay
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Register a new user
export const register = (email, password, name) => {
  return new Promise((resolve, reject) => {
    // Simulate network delay
    delay(500).then(() => {
      // Check if user already exists
      const existingUser = mockUsers.find((user) => user.email === email);
      if (existingUser) {
        reject(new Error('User with this email already exists'));
        return;
      }

      // Create new user
      const newUser = {
        _id: '65f7368dfb74bd6a92114c8' + Math.floor(Math.random() * 10),
        name: name || email.split('@')[0],
        email: email,
        password: password,
      };
      mockUsers.push(newUser);

      // Return user data (without password) and token
      resolve({
        token: 'mock-jwt-token-' + Math.random().toString(36).substr(2, 9),
        data: {
          _id: newUser._id,
          name: newUser.name,
          email: newUser.email,
        },
      });
    });
  });
};

// Login user
export const authorize = (email, password) => {
  return new Promise((resolve, reject) => {
    // Simulate network delay
    delay(500).then(() => {
      // Find user
      const user = mockUsers.find((user) => user.email === email && user.password === password);

      if (!user) {
        reject(new Error('Invalid email or password'));
        return;
      }

      // Return user data (without password) and token
      resolve({
        token: 'mock-jwt-token-' + Math.random().toString(36).substr(2, 9),
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
        },
      });
    });
  });
};

// Check token validity
export const checkToken = (token) => {
  return new Promise((resolve, reject) => {
    delay(300).then(() => {
      if (!token || !token.startsWith('mock-jwt-token-')) {
        reject(new Error('Invalid token'));
        return;
      }

      // For mock purposes, return a fake user
      resolve({
        data: {
          _id: '65f7368dfb74bd6a92114c80',
          name: 'John Doe',
          email: 'john@example.com',
        },
      });
    });
  });
};

// Logout user
export const logout = () => {
  return new Promise((resolve) => {
    delay(200).then(() => {
      resolve({ message: 'Logged out successfully' });
    });
  });
};
