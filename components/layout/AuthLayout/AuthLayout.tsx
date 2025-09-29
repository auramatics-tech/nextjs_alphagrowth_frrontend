import React from 'react';
import AlphaGrowthLogo from '../../common/AlphaGrowthLogo';

interface AuthLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  showLogo?: boolean;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  title,
  subtitle,
  showLogo = true,
}) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F3F4F6] font-sans p-4">
      {/* Optional: Add a subtle geometric background */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2240%22%20height%3D%2240%22%20viewBox%3D%220%200%2040%2040%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M0%200h20v20H0z%22%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.4%22%2F%3E%3Cpath%20d%3D%22M20%2020h20v20H20z%22%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.4%22%2F%3E%3C%2Fsvg%3E')] opacity-50"></div>
      
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg border border-gray-200 z-10">
        {showLogo && (
          <div className="text-center mb-8">
            <div className="inline-block p-3 bg-gray-100 rounded-full mb-4">
              <AlphaGrowthLogo size="md" />
            </div>
            {title && (
              <h1 className="text-2xl font-semibold text-[#111113]">{title}</h1>
            )}
            {subtitle && (
              <p className="text-sm text-[#6B7280]">{subtitle}</p>
            )}
          </div>
        )}
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;










