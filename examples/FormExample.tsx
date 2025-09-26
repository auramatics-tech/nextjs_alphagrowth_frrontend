// Example of using the useForm hook for better state management
import React from 'react';
import { useForm } from '../hooks';
import { Input, Button } from '../components/common';

interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
  status: 'idle' | 'loading' | 'error';
  error: string | null;
}

const FormExample: React.FC = () => {
  const {
    formData,
    handleInputChange,
    handleCheckboxChange,
    updateField,
    resetForm
  } = useForm<FormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
    status: 'idle',
    error: null
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Update status to loading
    updateField('status', 'loading');
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Success - reset form
      resetForm();
      console.log('Form submitted successfully!');
    } catch (error) {
      // Error handling
      updateField('status', 'error');
      updateField('error', 'Something went wrong!');
    }
  };

  const isFormValid = formData.name && formData.email && formData.password && formData.agreeToTerms;
  const isLoading = formData.status === 'loading';

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 space-y-4">
      <h2 className="text-2xl font-bold mb-4">Form Example with useForm Hook</h2>
      
      <Input
        label="Name"
        value={formData.name}
        onChange={handleInputChange('name')}
        placeholder="Enter your name"
        required
      />
      
      <Input
        label="Email"
        type="email"
        value={formData.email}
        onChange={handleInputChange('email')}
        placeholder="Enter your email"
        required
      />
      
      <Input
        label="Password"
        type="password"
        value={formData.password}
        onChange={handleInputChange('password')}
        placeholder="Enter your password"
        required
      />
      
      <div className="flex items-center">
        <input
          type="checkbox"
          id="terms"
          checked={formData.agreeToTerms}
          onChange={handleCheckboxChange('agreeToTerms')}
          className="mr-2"
        />
        <label htmlFor="terms" className="text-sm">
          I agree to the terms and conditions
        </label>
      </div>
      
      {formData.error && (
        <div className="text-red-600 text-sm">{formData.error}</div>
      )}
      
      <Button
        type="submit"
        disabled={!isFormValid || isLoading}
        isLoading={isLoading}
        className="w-full"
      >
        {isLoading ? 'Submitting...' : 'Submit'}
      </Button>
    </form>
  );
};

export default FormExample;







