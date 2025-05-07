
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, Mail, User, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { OAuthButton } from './OAuthButton';
import { motion, AnimatePresence } from 'framer-motion';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters')
});

const signupSchema = z.object({
  fullName: z.string().min(2, 'Please enter your full name'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Please confirm your password')
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});

interface AuthFormProps {
  setVerificationEmailSent: (sent: boolean) => void;
}

export const AuthForm = ({ setVerificationEmailSent }: AuthFormProps) => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  
  // Password visibility toggles
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Login form
  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' }
  });

  // Signup form
  const signupForm = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: { fullName: '', email: '', password: '', confirmPassword: '' }
  });

  const handleLogin = async (values: z.infer<typeof loginSchema>) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password
      });
      
      if (error) {
        toast({
          variant: "destructive",
          title: "Login failed",
          description: error.message
        });
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Login error",
        description: error.message || "An unexpected error occurred"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (values: z.infer<typeof signupSchema>) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: {
            full_name: values.fullName
          }
        }
      });
      
      if (error) {
        toast({
          variant: "destructive",
          title: "Signup failed",
          description: error.message
        });
      } else {
        setVerificationEmailSent(true);
        toast({
          title: "Account created",
          description: "Please check your email to verify your account"
        });
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Signup error",
        description: error.message || "An unexpected error occurred"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google'
      });
      
      if (error) {
        toast({
          variant: "destructive",
          title: "Google login failed",
          description: error.message
        });
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Login error",
        description: error.message || "An unexpected error occurred"
      });
    } finally {
      setLoading(false);
    }
  };

  const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.4,
        ease: "easeOut" 
      }
    },
    exit: { 
      opacity: 0,
      y: -20,
      transition: { 
        duration: 0.3,
        ease: "easeIn"
      }
    }
  };

  return (
    <div className="glass-effect rounded-xl p-6 md:p-8 shadow-lg">
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="text-center mb-6"
      >
        <h2 className="text-3xl font-sora font-bold gradient-text">InterviewXpert</h2>
        <div className="inline-flex bg-gray-100/50 backdrop-blur-sm p-1 rounded-full mt-6 mb-4">
          <motion.button 
            type="button"
            onClick={() => setIsLogin(true)} 
            className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 relative ${isLogin ? 'text-white' : 'text-gray-600 hover:text-gray-800'}`}
          >
            {isLogin && (
              <motion.div 
                layoutId="activeTab"
                className="absolute inset-0 bg-gradient-primary rounded-full"
                initial={false}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative z-10">Login</span>
          </motion.button>
          <motion.button 
            type="button"
            onClick={() => setIsLogin(false)} 
            className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 relative ${!isLogin ? 'text-white' : 'text-gray-600 hover:text-gray-800'}`}
          >
            {!isLogin && (
              <motion.div 
                layoutId="activeTab"
                className="absolute inset-0 bg-gradient-primary rounded-full"
                initial={false}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative z-10">Sign up</span>
          </motion.button>
        </div>
      </motion.div>

      <AnimatePresence mode="wait">
        {isLogin ? (
          <motion.div
            key="login"
            variants={formVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <h3 className="text-xl font-semibold mb-1">Welcome Back</h3>
            <p className="text-gray-600 mb-6 text-sm">Log in to your AI interview dashboard</p>

            <Form {...loginForm}>
              <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
                <FormField
                  control={loginForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <div className="relative form-focus-effect">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <FormControl>
                          <Input 
                            placeholder="Email address" 
                            type="email"
                            className="pl-10 bg-white/50 backdrop-blur-sm border border-gray-200 focus:border-interview-primary transition-all" 
                            {...field} 
                          />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={loginForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <div className="relative form-focus-effect">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <FormControl>
                          <Input 
                            type={showPassword ? "text" : "password"} 
                            placeholder="Password" 
                            className="pl-10 pr-10 bg-white/50 backdrop-blur-sm border border-gray-200 focus:border-interview-primary transition-all" 
                            {...field} 
                          />
                        </FormControl>
                        <motion.button 
                          type="button" 
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setShowPassword(!showPassword)} 
                          className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </motion.button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end">
                  <motion.button 
                    type="button" 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="text-sm text-interview-primary hover:text-interview-blue transition-colors"
                  >
                    Forgot password?
                  </motion.button>
                </div>

                <motion.div
                  whileHover={{ y: -2, boxShadow: "0 4px 12px rgba(155, 135, 245, 0.3)" }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-primary hover:shadow-button transition-all duration-300" 
                    disabled={loading}
                  >
                    {loading ? "Logging in..." : "Log In"}
                  </Button>
                </motion.div>
              </form>
            </Form>
          </motion.div>
        ) : (
          <motion.div
            key="signup"
            variants={formVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <h3 className="text-xl font-semibold mb-1">Create Your Account</h3>
            <p className="text-gray-600 mb-6 text-sm">Start your AI-powered mock interview journey</p>

            <Form {...signupForm}>
              <form onSubmit={signupForm.handleSubmit(handleSignup)} className="space-y-4">
                <FormField
                  control={signupForm.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <div className="relative form-focus-effect">
                        <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <FormControl>
                          <Input 
                            placeholder="Full name" 
                            type="text"
                            className="pl-10 bg-white/50 backdrop-blur-sm border border-gray-200 focus:border-interview-primary transition-all"
                            {...field}
                          />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={signupForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <div className="relative form-focus-effect">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <FormControl>
                          <Input 
                            placeholder="Email address" 
                            type="email"
                            className="pl-10 bg-white/50 backdrop-blur-sm border border-gray-200 focus:border-interview-primary transition-all" 
                            {...field} 
                          />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={signupForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <div className="relative form-focus-effect">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <FormControl>
                          <Input 
                            type={showPassword ? "text" : "password"} 
                            placeholder="Password" 
                            className="pl-10 pr-10 bg-white/50 backdrop-blur-sm border border-gray-200 focus:border-interview-primary transition-all" 
                            {...field} 
                          />
                        </FormControl>
                        <motion.button 
                          type="button" 
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setShowPassword(!showPassword)} 
                          className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </motion.button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={signupForm.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <div className="relative form-focus-effect">
                        <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <FormControl>
                          <Input 
                            type={showConfirmPassword ? "text" : "password"} 
                            placeholder="Confirm password" 
                            className="pl-10 pr-10 bg-white/50 backdrop-blur-sm border border-gray-200 focus:border-interview-primary transition-all" 
                            {...field} 
                          />
                        </FormControl>
                        <motion.button 
                          type="button" 
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)} 
                          className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                        >
                          {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </motion.button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <motion.div
                  whileHover={{ y: -2, boxShadow: "0 4px 12px rgba(155, 135, 245, 0.3)" }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-primary hover:shadow-button transition-all duration-300" 
                    disabled={loading}
                  >
                    {loading ? "Creating account..." : "Sign Up"}
                  </Button>
                </motion.div>
              </form>
            </Form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="my-6 flex items-center">
        <div className="flex-grow h-px bg-gray-300/50"></div>
        <span className="px-4 text-sm text-gray-500">or</span>
        <div className="flex-grow h-px bg-gray-300/50"></div>
      </div>

      <motion.div
        whileHover={{ y: -2, boxShadow: "0 4px 8px rgba(0,0,0,0.1)" }}
        whileTap={{ scale: 0.98 }}
      >
        <OAuthButton provider="google" onClick={handleGoogleSignIn} disabled={loading} />
      </motion.div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-6 text-center"
      >
        <p className="text-sm text-gray-600">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <motion.button 
            type="button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsLogin(!isLogin)} 
            className="text-interview-primary hover:text-interview-blue font-medium transition-all"
          >
            {isLogin ? "Sign up" : "Log in"}
          </motion.button>
        </p>
      </motion.div>
    </div>
  );
};
