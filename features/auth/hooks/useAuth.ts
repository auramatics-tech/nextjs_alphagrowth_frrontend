import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '../../../hooks';
import { loginUser, signupUser, logout, clearError, fetchProfile } from '../../../store/slices/authSlice';
import { LoginCredentials, SignupData } from '../../../types/auth.types';
import { ROUTES } from '../../../utils';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  
  const { user, token, isAuthenticated, isLoading, error, status } = useAppSelector(
    (state) => state.auth
  );

  // Check for existing token on mount
  useEffect(() => {
    if (token && !user && status === 'idle') {
      dispatch(fetchProfile());
    }
  }, [token, user, status, dispatch]);

  const login = async (credentials: LoginCredentials) => {
    const result = await dispatch(loginUser(credentials));

    console.log("result-----",result);
    
    console.log("loginUser.fulfilled.match(result)-",loginUser.fulfilled.match(result));
    
    if (loginUser.fulfilled.match(result)) {
      const userStatus = result.payload.user?.status;
      
      // Route based on user status (from frontend_old logic)
      if (userStatus === 1) {
        router.push('/dashboard');
      } else if (userStatus === 2) {
        router.push('/onboarding/marketing');
      } else if (userStatus === 3) {
        router.push('/onboarding/customerprofile');
      } else if (userStatus === 4) {
        router.push('/dashboard');
      } else {
        router.push('/dashboard');
      }
    }
  };

  const signup = async (data: SignupData) => {
    const result = await dispatch(signupUser(data));
console.log("result----",result);

    if (signupUser.fulfilled.match(result)) {
      const userStatus = result.payload.user?.status;

      // Route based on user status (matching frontend_old logic)
      if (userStatus === 1) {
        router.push('/dashboard');
      } else if (userStatus === 2) {
        router.push(ROUTES.ONBOARDING.REGISTRATION_SUCCESS);
      } else if (userStatus === 3) {
        router.push('/onboarding/business-profile');
      } else if (userStatus === 4) {
        router.push('/dashboard');
      } else {
        // Default navigation for new users
        router.push(ROUTES.ONBOARDING.BUSINESS_OVERVIEW);
      }
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    router.push('/login');
  };

  const clearAuthError = () => {
    dispatch(clearError());
  };

  return {
    user,
    token,
    isAuthenticated,
    isLoading,
    error,
    status,
    login,
    signup,
    logout: handleLogout,
    clearError: clearAuthError,
  };
};
