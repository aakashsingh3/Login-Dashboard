import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from './LoadingSpinner';

const AuthSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { checkAuth } = useAuth();
  
  useEffect(() => {
    const handleAuthSuccess = async () => {
      const token = searchParams.get('token');
      const error = searchParams.get('error');
      
      if (error) {
        navigate('/login?error=' + error);
        return;
      }
      
      if (token) {
        localStorage.setItem('accessToken', token);
        await checkAuth();
        navigate('/dashboard');
      } else {
        navigate('/login');
      }
    };
    
    handleAuthSuccess();
  }, [searchParams, navigate, checkAuth]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-gray-600">Completing Google login...</p>
      </div>
    </div>
  );
};

export default AuthSuccess;
