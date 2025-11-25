import React, { useState, useEffect } from 'react';

function Login({ onLogin, apiHealthy }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Sign In State
  const [signInUsername, setSignInUsername] = useState('');
  const [signInPassword, setSignInPassword] = useState('');
  
  // Sign Up State
  const [signUpUsername, setSignUpUsername] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [signUpConfirmPassword, setSignUpConfirmPassword] = useState('');
  
  // Load registered users from localStorage on mount
  useEffect(() => {
    const savedUsers = localStorage.getItem('registeredUsers');
    if (!savedUsers) {
      // Initialize with demo user
      localStorage.setItem('registeredUsers', JSON.stringify({
        'demo': {
          username: 'demo',
          email: 'demo@example.com',
          password: 'demo123',
          createdAt: new Date().toISOString()
        }
      }));
    }
  }, []);

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const getRegisteredUsers = () => {
    const saved = localStorage.getItem('registeredUsers');
    return saved ? JSON.parse(saved) : {};
  };

  const saveRegisteredUsers = (users) => {
    localStorage.setItem('registeredUsers', JSON.stringify(users));
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation
    if (!signUpUsername.trim() || !signUpEmail.trim() || !signUpPassword.trim() || !signUpConfirmPassword.trim()) {
      setError('All fields are required');
      return;
    }

    if (signUpUsername.length < 3) {
      setError('Username must be at least 3 characters');
      return;
    }

    if (!validateEmail(signUpEmail)) {
      setError('Please enter a valid email address');
      return;
    }

    if (signUpPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (signUpPassword !== signUpConfirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Check if user already exists
    const users = getRegisteredUsers();
    if (users[signUpUsername]) {
      setError('Username already exists');
      return;
    }

    // Register new user
    setLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));

      users[signUpUsername] = {
        username: signUpUsername,
        email: signUpEmail,
        password: signUpPassword,
        createdAt: new Date().toISOString()
      };

      saveRegisteredUsers(users);
      setSuccess('Account created successfully! You can now sign in.');
      
      // Reset form
      setSignUpUsername('');
      setSignUpEmail('');
      setSignUpPassword('');
      setSignUpConfirmPassword('');
      
      // Switch to sign in after 2 seconds
      setTimeout(() => {
        setIsSignUp(false);
        setSuccess('');
      }, 2000);
    } catch (err) {
      setError('Failed to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!signInUsername.trim() || !signInPassword.trim()) {
      setError('Username and password are required');
      return;
    }

    setLoading(true);
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));

      const users = getRegisteredUsers();
      const user = users[signInUsername];

      if (!user || user.password !== signInPassword) {
        setError('Invalid username or password');
        setLoading(false);
        return;
      }

      // Successful login
      setSuccess('Login successful!');
      setSignInUsername('');
      setSignInPassword('');
      
      // Call onLogin after brief delay to show success message
      setTimeout(() => {
        onLogin(signInUsername);
      }, 500);
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const toggleAuthMode = () => {
    setIsSignUp(!isSignUp);
    setError('');
    setSuccess('');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mb-4">
            <div className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
              🏢
            </div>
          </div>
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            Campus Building Classifier
          </h1>
          <p className="text-slate-600">
            {isSignUp ? 'Create your account' : 'Sign in to continue'}
          </p>
        </div>

        {/* API Status */}
        <div className={`mb-6 p-4 rounded-lg text-sm font-medium ${apiHealthy ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-yellow-50 text-yellow-800 border border-yellow-200'}`}>
          <span>Backend Status:</span> {apiHealthy ? '✓ Connected' : '⚠ Using Demo Mode'}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-800 rounded-lg text-sm">
            <div className="flex items-start gap-2">
              <span className="text-lg">⚠️</span>
              <div>{error}</div>
            </div>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-800 rounded-lg text-sm">
            <div className="flex items-start gap-2">
              <span className="text-lg">✓</span>
              <div>{success}</div>
            </div>
          </div>
        )}

        {/* Form Container */}
        <div className="bg-white rounded-lg shadow-md p-8">
          {isSignUp ? (
            // Sign Up Form
            <form onSubmit={handleSignUp} className="space-y-5">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Create Account</h2>

              {/* Username Field */}
              <div>
                <label htmlFor="signup-username" className="block text-sm font-medium text-slate-700 mb-2">
                  Username
                </label>
                <input
                  type="text"
                  id="signup-username"
                  value={signUpUsername}
                  onChange={(e) => setSignUpUsername(e.target.value)}
                  placeholder="Choose a username (min 3 characters)"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  disabled={loading}
                />
              </div>

              {/* Email Field */}
              <div>
                <label htmlFor="signup-email" className="block text-sm font-medium text-slate-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="signup-email"
                  value={signUpEmail}
                  onChange={(e) => setSignUpEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  disabled={loading}
                />
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="signup-password" className="block text-sm font-medium text-slate-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  id="signup-password"
                  value={signUpPassword}
                  onChange={(e) => setSignUpPassword(e.target.value)}
                  placeholder="Create a password (min 6 characters)"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  disabled={loading}
                />
              </div>

              {/* Confirm Password Field */}
              <div>
                <label htmlFor="signup-confirm" className="block text-sm font-medium text-slate-700 mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="signup-confirm"
                  value={signUpConfirmPassword}
                  onChange={(e) => setSignUpConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  disabled={loading}
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white font-medium py-2 rounded-lg transition duration-200"
              >
                {loading ? 'Creating Account...' : 'Sign Up'}
              </button>

              {/* Toggle to Sign In */}
              <div className="text-center pt-4 border-t border-slate-200">
                <p className="text-slate-600 text-sm">
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={toggleAuthMode}
                    className="text-blue-600 hover:text-blue-700 font-semibold"
                  >
                    Sign In
                  </button>
                </p>
              </div>
            </form>
          ) : (
            // Sign In Form
            <form onSubmit={handleSignIn} className="space-y-5">
              <h2 className="text-2xl font-bold text-slate-900 mb-6">Sign In</h2>

              {/* Username Field */}
              <div>
                <label htmlFor="signin-username" className="block text-sm font-medium text-slate-700 mb-2">
                  Username
                </label>
                <input
                  type="text"
                  id="signin-username"
                  value={signInUsername}
                  onChange={(e) => setSignInUsername(e.target.value)}
                  placeholder="Enter your username"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  disabled={loading}
                />
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="signin-password" className="block text-sm font-medium text-slate-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  id="signin-password"
                  value={signInPassword}
                  onChange={(e) => setSignInPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  disabled={loading}
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white font-medium py-2 rounded-lg transition duration-200"
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </button>

              {/* Toggle to Sign Up */}
              <div className="text-center pt-4 border-t border-slate-200">
                <p className="text-slate-600 text-sm">
                  Don't have an account?{' '}
                  <button
                    type="button"
                    onClick={toggleAuthMode}
                    className="text-blue-600 hover:text-blue-700 font-semibold"
                  >
                    Sign Up
                  </button>
                </p>
              </div>
            </form>
          )}
        </div>

        {/* Demo Info */}
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-900 font-medium mb-2">📝 Demo Credentials:</p>
          <p className="text-xs text-blue-800">
            Username: <span className="font-mono bg-white px-2 py-1 rounded">demo</span>
          </p>
          <p className="text-xs text-blue-800">
            Password: <span className="font-mono bg-white px-2 py-1 rounded">demo123</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
