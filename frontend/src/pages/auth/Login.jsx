import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Mail, Lock, LogIn, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import toast from 'react-hot-toast';

const Login = () => {
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      await login(data.email, data.password);
      toast.success('Welcome back!');
      navigate('/');
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Invalid email or password.');
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
        <div className="bg-white rounded-[2.5rem] shadow-xl p-10 md:p-12 relative overflow-hidden border border-gray-100">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center p-3 bg-mint rounded-2xl mb-6">
              <LogIn className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome Back
            </h1>
            <p className="text-gray-500 font-medium">
              Join the movement for sustainable living
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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

            <div className="space-y-2">
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
              <div className="flex justify-end">
                <Link
                  to="/forgot-password"
                  className="text-xs font-semibold text-primary hover:text-green-600 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full py-4 text-lg font-bold"
              loading={loading}
            >
              <span className="mr-2">Sign In</span>
              <ArrowRight className="h-5 w-5" />
            </Button>
          </form>

          {/* Redirect */}
          <div className="mt-10 pt-8 border-t border-gray-50 text-center">
            <p className="text-gray-500 font-medium mb-4">
              Don't have an account?
            </p>
            <Link to="/register">
              <Button variant="outline" className="w-full">
                Create Account
              </Button>
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
