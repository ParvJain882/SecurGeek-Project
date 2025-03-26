import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { Loader2, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export function AuthForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  });
  const [emailSent, setEmailSent] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { signIn, signUp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isSignUp) {
        const result = await signUp(formData.email, formData.password, formData.name);
        if (result?.needsEmailConfirmation) {
          setEmailSent(true);
          toast.success('Please check your email to confirm your account!');
        }
      } else {
        await signIn(formData.email, formData.password);
        toast.success('Successfully signed in!');
      }
    } catch (error: any) {
      console.error('Error:', error);
      if (error.message === 'Email already registered') {
        toast.error('This email is already registered. Please sign in instead.');
      } else {
        toast.error(error.message || 'Authentication failed');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  if (emailSent) {
    return (
      <div className="text-center p-6">
        <h2 className="text-2xl font-bold mb-4">Check Your Email</h2>
        <p className="text-gray-600 mb-4">
          We've sent a confirmation link to {formData.email}
        </p>
        <p className="text-sm text-gray-500">
          Please check your email and click the confirmation link to complete your registration.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-md w-full mx-auto bg-white p-8 rounded-xl shadow-sm">
      <div className="flex flex-col items-center mb-8">
        <h2 className="text-4xl font-bold text-gray-800 mb-2">
          {isSignUp ? 'Create an account' : 'Sign In'}
        </h2>
        {isSignUp ? (
          <p className="text-gray-600 text-lg">
            Get started
          </p>
        ) : (
          <p className="text-gray-600 text-lg">
            Welcome Back!
          </p>
        )}
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        {isSignUp && (
          <div className="relative">
            <input
              type="text"
              id="name"
              name="name"
              required={isSignUp}
              value={formData.name}
              onChange={handleChange}
              placeholder=" "
              className="peer w-full px-4 py-3 border-b-2 border-gray-200 focus:border-blue-500 outline-none transition-colors duration-200 bg-transparent caret-blue-500 placeholder-transparent"
            />
            <label 
              htmlFor="name" 
              className="absolute left-4 -top-2.5 text-sm text-gray-500 transition-all duration-200 
                peer-placeholder-shown:text-base peer-placeholder-shown:top-3.5 
                peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-blue-500"
            >
              Name
            </label>
          </div>
        )}

        <div className="relative">
          <input
            type="email"
            id="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            placeholder=" "
            className="peer w-full px-4 py-3 border-b-2 border-gray-200 focus:border-blue-500 outline-none transition-colors duration-200 bg-transparent caret-blue-500 placeholder-transparent"
          />
          <label 
            htmlFor="email" 
            className="absolute left-4 -top-2.5 text-sm text-gray-500 transition-all duration-200 
              peer-placeholder-shown:text-base peer-placeholder-shown:top-3.5 
              peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-blue-500"
          >
            Email
          </label>
        </div>

        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            name="password"
            required
            value={formData.password}
            onChange={handleChange}
            placeholder=" "
            className="peer w-full px-4 py-3 border-b-2 border-gray-200 focus:border-blue-500 outline-none transition-colors duration-200 bg-transparent caret-blue-500 placeholder-transparent pr-12"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            {showPassword ? 
              <EyeOff size={20} className="transition-colors duration-200" /> : 
              <Eye size={20} className="transition-colors duration-200" />
            }
          </button>
          <label 
            htmlFor="password" 
            className="absolute left-4 -top-2.5 text-sm text-gray-500 transition-all duration-200 
              peer-placeholder-shown:text-base peer-placeholder-shown:top-3.5 
              peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-blue-500"
          >
            Password
          </label>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg font-medium 
            transition-all duration-200 hover:bg-blue-700 hover:shadow-lg hover:scale-[1.02] 
            disabled:bg-blue-400 disabled:cursor-not-allowed disabled:hover:scale-100 
            disabled:hover:shadow-none focus:outline-none focus:ring-2 focus:ring-blue-500 
            focus:ring-offset-2 mt-8"
        >
          {isLoading ? (
            <Loader2 className="animate-spin mx-auto" />
          ) : (
            isSignUp ? 'Create Account' : 'Sign In'
          )}
        </button>

        <div className="text-center mt-6">
          <button
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-sm text-gray-600 hover:text-blue-600 transition-colors duration-200 
              focus:outline-none focus:underline"
          >
            {isSignUp ? 'Already have an account?' : 'Need an account?'}
            <span className="ml-1 text-blue-600 font-medium">
              {isSignUp ? 'Sign In' : 'Sign Up'}
            </span>
          </button>
        </div>
      </form>
    </div>
  );
} 