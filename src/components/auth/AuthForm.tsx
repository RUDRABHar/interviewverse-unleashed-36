
import React, { useState, useEffect } from 'react';
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

export const AuthForm = ({
  setVerificationEmailSent
}: AuthFormProps) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showSignupConfirmPassword, setShowSignupConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Create separate login form
  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: ''
    },
    mode: 'onSubmit' 
  });

  // Create separate signup form
  const signupForm = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: ''
    },
    mode: 'onSubmit'
  });

  // Reset forms when toggling between login and signup
  useEffect(() => {
    if (isLogin) {
      signupForm.reset({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: ''
      });
    } else {
      loginForm.reset({
        email: '',
        password: ''
      });
    }
  }, [isLogin, loginForm, signupForm]);

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

  return (
    <div className="glass rounded-xl p-6 md:p-8 shadow-lg backdrop-blur-lg bg-white/80 border border-white/20">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-sora font-bold gradient-text">InterviewXpert</h2>
        <div className="flex justify-center space-x-2 mt-6 mb-8">
          <button 
            type="button"
            onClick={() => setIsLogin(true)} 
            className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${isLogin ? 'bg-gradient-primary text-white shadow-sm' : 'text-gray-600 hover:text-gray-800'}`}
          >
            Login
          </button>
          <button 
            type="button"
            onClick={() => setIsLogin(false)} 
            className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${!isLogin ? 'bg-gradient-primary text-white shadow-sm' : 'text-gray-600 hover:text-gray-800'}`}
          >
            Sign up
          </button>
        </div>
      </div>

      {isLogin ? (
        <>
          <h3 className="text-xl font-semibold mb-1">Welcome Back</h3>
          <p className="text-gray-600 mb-6 text-sm">Log in to your AI interview dashboard</p>

          <Form {...loginForm}>
            <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
              <FormField
                control={loginForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <FormControl>
                        <Input 
                          placeholder="Email address" 
                          type="email"
                          className="pl-10 bg-white/50 border border-gray-200 focus:border-interview-primary transition-all" 
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
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <FormControl>
                        <Input 
                          type={showLoginPassword ? "text" : "password"} 
                          placeholder="Password" 
                          className="pl-10 pr-10 bg-white/50 border border-gray-200 focus:border-interview-primary transition-all" 
                          {...field} 
                        />
                      </FormControl>
                      <button 
                        type="button" 
                        onClick={() => setShowLoginPassword(!showLoginPassword)} 
                        className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                      >
                        {showLoginPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end">
                <button 
                  type="button" 
                  className="text-sm text-interview-primary hover:text-interview-violet transition-colors"
                >
                  Forgot password?
                </button>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-gradient-primary hover:shadow-button transition-all duration-300 hover:scale-[1.02]" 
                disabled={loading}
              >
                {loading ? "Logging in..." : "Log In"}
              </Button>
            </form>
          </Form>
        </>
      ) : (
        <>
          <h3 className="text-xl font-semibold mb-1">Create Your Account</h3>
          <p className="text-gray-600 mb-6 text-sm">Start your AI-powered mock interview journey</p>

          <Form {...signupForm}>
            <form onSubmit={signupForm.handleSubmit(handleSignup)} className="space-y-4">
              <FormField
                control={signupForm.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <FormControl>
                        <Input 
                          placeholder="Full name" 
                          type="text"
                          className="pl-10 bg-white/50 border border-gray-200 focus:border-interview-primary transition-all"
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
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <FormControl>
                        <Input 
                          placeholder="Email address" 
                          type="email"
                          className="pl-10 bg-white/50 border border-gray-200 focus:border-interview-primary transition-all" 
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
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <FormControl>
                        <Input 
                          type={showSignupPassword ? "text" : "password"} 
                          placeholder="Password" 
                          className="pl-10 pr-10 bg-white/50 border border-gray-200 focus:border-interview-primary transition-all" 
                          {...field} 
                        />
                      </FormControl>
                      <button 
                        type="button" 
                        onClick={() => setShowSignupPassword(!showSignupPassword)} 
                        className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                      >
                        {showSignupPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
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
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <FormControl>
                        <Input 
                          type={showSignupConfirmPassword ? "text" : "password"} 
                          placeholder="Confirm password" 
                          className="pl-10 pr-10 bg-white/50 border border-gray-200 focus:border-interview-primary transition-all" 
                          {...field} 
                        />
                      </FormControl>
                      <button 
                        type="button" 
                        onClick={() => setShowSignupConfirmPassword(!showSignupConfirmPassword)} 
                        className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                      >
                        {showSignupConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button 
                type="submit" 
                className="w-full bg-gradient-primary hover:shadow-button transition-all duration-300 hover:scale-[1.02]" 
                disabled={loading}
              >
                {loading ? "Creating account..." : "Sign Up"}
              </Button>
            </form>
          </Form>
        </>
      )}

      <div className="my-6 flex items-center">
        <div className="flex-grow h-px bg-gray-300"></div>
        <span className="px-4 text-sm text-gray-500">or</span>
        <div className="flex-grow h-px bg-gray-300"></div>
      </div>

      <OAuthButton provider="google" onClick={handleGoogleSignIn} disabled={loading} />

      <div className="mt-6 text-center">
        {isLogin ? (
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <button 
              type="button"
              onClick={() => setIsLogin(false)} 
              className="text-interview-primary hover:text-interview-violet font-medium transition-colors"
            >
              Sign up
            </button>
          </p>
        ) : (
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <button 
              type="button"
              onClick={() => setIsLogin(true)} 
              className="text-interview-primary hover:text-interview-violet font-medium transition-colors"
            >
              Log in
            </button>
          </p>
        )}
      </div>
    </div>
  );
};
