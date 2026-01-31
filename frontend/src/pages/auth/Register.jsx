import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Mail, Lock, User as UserIcon, Shield, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import toast from 'react-hot-toast';

const Register = () => {
  const [loading, setLoading] = useState(false);
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const password = watch('password');

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      await registerUser(data.name, data.email, data.password);
      toast.success('Account created successfully!');
      navigate('/');
    } catch (error) {
      console.error('Registration error:', error);
      toast.error(error.response?.data?.message || 'Failed to create account.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-mesh flex items-center justify-center py-20 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full"
      >
        <div className="bg-white rounded-[2.5rem] shadow-xl p-10 md:p-12 border border-gray-100 relative overflow-hidden">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center p-3 bg-mint rounded-2xl mb-6">
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Join Be-Eco
            </h1>
            <p className="text-gray-500 font-medium text-sm">
              Start your journey towards a circular economy
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <Input
              label="Full Name"
              type="text"
              placeholder="John Doe"
              icon={UserIcon}
              {...register('name', { required: 'Name is required' })}
              error={errors.name?.message}
            />

            <Input
              label="Email Address"
              type="email"
              placeholder="you@example.com"
              icon={Mail}
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: 'Invalid email format',
                },
              })}
              error={errors.email?.message}
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              icon={Lock}
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters',
                },
              })}
              error={errors.password?.message}
            />

            <Input
              label="Confirm Password"
              type="password"
              placeholder="••••••••"
              icon={Lock}
              {...register('confirmPassword', {
                required: 'Please confirm your password',
                validate: (value) =>
                  value === password || 'Passwords do not match',
              })}
              error={errors.confirmPassword?.message}
            />

            <div className="pt-2">
              <Button
                type="submit"
                className="w-full py-4 text-lg font-bold"
                loading={loading}
              >
                Create Account
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </div>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-50 text-center">
            <p className="text-gray-500 text-sm font-medium mb-4">
              Already a member?
            </p>
            <Link to="/login">
              <button className="text-primary font-bold hover:text-green-600 transition-colors">
                Sign In Instead
              </button>
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
