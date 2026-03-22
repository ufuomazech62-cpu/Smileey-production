// Mock auth service - no Firebase
// All auth is simulated with localStorage

export interface MockUser {
  uid: string;
  email: string | null;
  displayName: string | null;
}

let currentUser: MockUser | null = null;

// Initialize from localStorage
if (typeof window !== 'undefined') {
  const savedUser = localStorage.getItem('divinity_mock_user');
  if (savedUser) {
    try {
      currentUser = JSON.parse(savedUser);
    } catch (e) {}
  }
}

export const loginWithGoogle = async (): Promise<MockUser> => {
  // Simulate Google login
  const mockUser: MockUser = {
    uid: 'mock-user-' + Date.now(),
    email: 'user@example.com',
    displayName: 'User'
  };
  
  currentUser = mockUser;
  localStorage.setItem('divinity_mock_user', JSON.stringify(mockUser));
  
  // Create a default profile
  const existingProfile = localStorage.getItem('divinity_user_profile');
  if (!existingProfile) {
    const newProfile = {
      name: 'Friend',
      onboardingComplete: false
    };
    localStorage.setItem('divinity_user_profile', JSON.stringify(newProfile));
  }
  
  return mockUser;
};

export const sendMagicLink = async (email: string): Promise<void> => {
  // Simulate sending magic link
  console.log('Magic link sent to:', email);
  localStorage.setItem('divinity_pending_email', email);
};

export const completeEmailSignIn = async (): Promise<MockUser | null> => {
  // Check if we have a pending email sign-in
  const pendingEmail = localStorage.getItem('divinity_pending_email');
  
  if (pendingEmail) {
    const mockUser: MockUser = {
      uid: 'mock-user-' + Date.now(),
      email: pendingEmail,
      displayName: null
    };
    
    currentUser = mockUser;
    localStorage.setItem('divinity_mock_user', JSON.stringify(mockUser));
    localStorage.removeItem('divinity_pending_email');
    
    // Create a default profile
    const existingProfile = localStorage.getItem('divinity_user_profile');
    if (!existingProfile) {
      const newProfile = {
        name: 'Friend',
        onboardingComplete: false
      };
      localStorage.setItem('divinity_user_profile', JSON.stringify(newProfile));
    }
    
    return mockUser;
  }
  
  return null;
};

export const logout = async (): Promise<void> => {
  currentUser = null;
  localStorage.removeItem('divinity_mock_user');
  localStorage.removeItem('divinity_user_profile');
};

export const subscribeToAuthChanges = (callback: (user: MockUser | null) => void) => {
  // Immediately call with current user
  callback(currentUser);
  
  // Return unsubscribe function
  return () => {};
};

export const getCurrentUser = (): MockUser | null => {
  // Always check localStorage first if on client side
  if (typeof window !== 'undefined') {
    const savedUser = localStorage.getItem('divinity_mock_user');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        currentUser = user; // Update module variable
        return user;
      } catch (e) {}
    }
  }
  return currentUser;
};
