// Use localStorage to persist users
const STORAGE_KEY = 'news_explorer_users';
const TOKEN_KEY = 'token';

// Helper to get users from localStorage
const getUsers = () => {
  try {
    const users = localStorage.getItem(STORAGE_KEY);
    return users ? JSON.parse(users) : [];
  } catch {
    return [];
  }
};

// Helper to save users to localStorage
const saveUsers = (users) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
};

// Helper to get user by token
const getUserByToken = (token) => {
  try {
    const userData = localStorage.getItem('user_data_' + token);
    return userData ? JSON.parse(userData) : null;
  } catch {
    return null;
  }
};

// Helper to save user with token
const saveUserWithToken = (token, user) => {
  localStorage.setItem('user_data_' + token, JSON.stringify(user));
};

// Simulate API delay
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Register a new user
export const register = (email, password, name) => {
  return new Promise((resolve, reject) => {
    delay(500).then(() => {
      const users = getUsers();

      // Check if user already exists
      const existingUser = users.find((user) => user.email === email);
      if (existingUser) {
        reject(new Error('User with this email already exists'));
        return;
      }

      // Create new user
      const newUser = {
        _id: 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6),
        name: name || email.split('@')[0],
        email: email,
        password: password,
        createdAt: new Date().toISOString(),
      };

      // Save to localStorage
      users.push(newUser);
      saveUsers(users);

      // Generate token
      const token = 'mock-jwt-token-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);

      // Store token in localStorage
      localStorage.setItem(TOKEN_KEY, token);

      // Store user with token for retrieval
      const userData = {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
      };
      saveUserWithToken(token, userData);

      // Return user data (without password)
      resolve({
        token: token,
        data: userData,
      });
    });
  });
};

// ✅ Login user
export const authorize = (email, password) => {
  return new Promise((resolve, reject) => {
    delay(500).then(() => {
      const users = getUsers();

      // Find user
      const user = users.find((user) => user.email === email && user.password === password);

      if (!user) {
        reject(new Error('Invalid email or password'));
        return;
      }

      // Generate token
      const token = 'mock-jwt-token-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);

      // Store token in localStorage
      localStorage.setItem(TOKEN_KEY, token);

      // Store user with token
      const userData = {
        _id: user._id,
        name: user.name,
        email: user.email,
      };
      saveUserWithToken(token, userData);

      // Return user data (without password)
      resolve({
        token: token,
        data: userData,
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

      // Get the user associated with this token
      const userData = getUserByToken(token);

      if (!userData) {
        reject(new Error('User not found for this token'));
        return;
      }

      resolve({
        data: userData,
      });
    });
  });
};

// Logout user
export const logout = () => {
  return new Promise((resolve) => {
    delay(200).then(() => {
      const token = localStorage.getItem(TOKEN_KEY);
      if (token) {
        // Remove user data associated with this token
        localStorage.removeItem('user_data_' + token);
      }
      localStorage.removeItem(TOKEN_KEY);
      resolve({ message: 'Logged out successfully' });
    });
  });
};

// Get current user
export const getCurrentUser = () => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (!token) return null;
  return getUserByToken(token);
};
