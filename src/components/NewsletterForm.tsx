import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';
import { Loader2 } from 'lucide-react';

export function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase
        .from('newsletters')
        .insert([{ email }]);

      if (error) {
        if (error.code === '23505') {
          toast.error('This email is already subscribed!');
        } else {
          throw error;
        }
      } else {
        toast.success('Successfully subscribed to newsletter!');
        setEmail('');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to subscribe. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
        required
        className="flex-1 rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500"
      />
      <button
        type="submit"
        disabled={isLoading}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-blue-400"
      >
        {isLoading ? <Loader2 className="animate-spin" /> : 'Subscribe'}
      </button>
    </form>
  );
}