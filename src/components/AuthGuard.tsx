import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

interface AuthGuardProps {
  children: React.ReactNode;
  onAuthRequired?: () => void;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      toast.error('Please sign in to access this feature');
      navigate('/?auth=signin&autoOpen=true');
    }
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  return <>{children}</>;
} 