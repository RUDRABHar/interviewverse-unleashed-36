import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, Mail, User, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
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
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  });
  const signupForm = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: ''
    }
  });
  const handleLogin = async (values: z.infer<typeof loginSchema>) => {
    try {
      setLoading(true);
      const {
        error
      } = await supabase.auth.signInWithPassword({
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
      const {
        error
      } = await supabase.auth.signUp({
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
      const {
        error
      } = await supabase.auth.signInWithOAuth({
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
  return <div className="glass rounded-xl p-6 md:p-8 shadow-lg backdrop-blur-lg bg-white/80 border border-white/20">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-sora font-bold gradient-text">InterviewXpert</h2>
        <div className="flex justify-center space-x-2 mt-6 mb-8">
          <button onClick={() => setIsLogin(true)} className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${isLogin ? 'bg-gradient-primary text-white shadow-sm' : 'text-gray-600 hover:text-gray-800'}`}>
            Login
          </button>
          <button onClick={() => setIsLogin(false)} className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${!isLogin ? 'bg-gradient-primary text-white shadow-sm' : 'text-gray-600 hover:text-gray-800'}`}>
            Sign up
          </button>
        </div>
      </div>

      {isLogin ? <>
          <h3 className="text-xl font-semibold mb-1">Welcome Back</h3>
          <p className="text-gray-600 mb-6 text-sm">Log in to your AI interview dashboard</p>

          <Form {...loginForm}>
            <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
              <FormField control={loginForm.control} name="email" render={({
            field
          }) => <FormItem>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <FormControl>
                        <Input placeholder="Email address" className="pl-10 bg-white/50 border border-gray-200 focus:border-interview-primary transition-all" {...field} />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>} />

              <FormField control={loginForm.control} name="password" render={({
            field
          }) => <FormItem>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <FormControl>
                        <Input type={showPassword ? "text" : "password"} placeholder="Password" className="pl-10 pr-10 bg-white/50 border border-gray-200 focus:border-interview-primary transition-all" {...field} />
                      </FormControl>
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 text-gray-400 hover:text-gray-600">
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                    <FormMessage />
                  </FormItem>} />

              <div className="flex justify-end">
                <button type="button" className="text-sm text-interview-primary hover:text-interview-violet transition-colors">
                  Forgot password?
                </button>
              </div>

              <Button type="submit" className="w-full bg-gradient-primary hover:shadow-button transition-all duration-300 hover:scale-[1.02]" disabled={loading}>
                {loading ? "Logging in..." : "Log In"}
              </Button>
            </form>
          </Form>
        </> : <>
          <h3 className="text-xl font-semibold mb-1">Create Your Account</h3>
          <p className="text-gray-600 mb-6 text-sm">Start your AI-powered mock interview journey</p>

          <Form {...signupForm}>
            <form onSubmit={signupForm.handleSubmit(handleSignup)} className="space-y-4">
              <FormField control={signupForm.control} name="fullName" render={({
            field
          }) => <FormItem>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <FormControl>
                        <Input placeholder="Full name" className="pl-10 bg-white/50 border border-gray-200 focus:border-interview-primary transition-all" {...field} />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>} />

              <FormField control={signupForm.control} name="email" render={({
            field
          }) => <FormItem>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <FormControl>
                        <Input placeholder="Email address" className="pl-10 bg-white/50 border border-gray-200 focus:border-interview-primary transition-all" {...field} />
                      </FormControl>
                    </div>
                    <FormMessage />
                  </FormItem>} />

              <FormField control={signupForm.control} name="password" render={({
            field
          }) => <FormItem>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <FormControl>
                        <Input type={showPassword ? "text" : "password"} placeholder="Password" className="pl-10 pr-10 bg-white/50 border border-gray-200 focus:border-interview-primary transition-all" {...field} />
                      </FormControl>
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 text-gray-400 hover:text-gray-600">
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                    <FormMessage />
                  </FormItem>} />

              <FormField control={signupForm.control} name="confirmPassword" render={({
            field
          }) => <FormItem>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <FormControl>
                        <Input type={showConfirmPassword ? "text" : "password"} placeholder="Confirm password" className="pl-10 pr-10 bg-white/50 border border-gray-200 focus:border-interview-primary transition-all" {...field} />
                      </FormControl>
                      <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-3 text-gray-400 hover:text-gray-600">
                        {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                    <FormMessage />
                  </FormItem>} />

              <Button type="submit" className="w-full bg-gradient-primary hover:shadow-button transition-all duration-300 hover:scale-[1.02]" disabled={loading}>
                {loading ? "Creating account..." : "Sign Up"}
              </Button>
            </form>
          </Form>
        </>}

      <div className="my-6 flex items-center">
        <div className="flex-grow h-px bg-gray-300"></div>
        <span className="px-4 text-sm text-gray-500">or</span>
        <div className="flex-grow h-px bg-gray-300"></div>
      </div>

      <Button type="button" variant="outline" onClick={handleGoogleSignIn} className="w-full flex items-center justify-center gap-3 py-6 bg-white hover:bg-gray-50 border border-gray-200 transition-all" disabled={loading}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15.4001 8.116C15.4001 7.48225 15.3478 7.06675 15.2346 6.63672H8.2001V9.39119H12.3804C12.2935 10.0845 11.8149 11.143 10.7551 11.8434L10.7399 11.9458L12.9547 13.6572L13.1158 13.6731C14.4989 12.3949 15.4001 10.4379 15.4001 8.116Z" fill="#4285F4" />
          <path d="M8.2001 15.275C10.18 15.275 11.8289 14.6256 13.1158 13.6731L10.7551 11.8434C10.1396 12.2658 9.30544 12.5616 8.2001 12.5616C6.26866 12.5616 4.64272 11.3738 4.01379 9.70667L3.91555 9.71451L1.60886 11.4862L1.57617 11.5771C2.8532 13.8586 5.33418 15.275 8.2001 15.275Z" fill="#34A853" />
          <path d="M4.01382 9.70667C3.87082 9.27664 3.78644 8.81841 3.78644 8.34573C3.78644 7.87296 3.87082 7.41481 4.00477 6.98478L4.00055 6.8763L1.65578 5.07031L1.57621 5.11435C1.14559 6.11918 0.89978 7.2079 0.89978 8.34573C0.89978 9.48348 1.14559 10.5723 1.57621 11.5771L4.01382 9.70667Z" fill="#FBBC05" />
          <path d="M8.2001 4.12983C9.40236 4.12983 10.2074 4.73962 10.6622 5.15954L12.7793 3.16523C11.8236 2.31455 10.18 1.75 8.2001 1.75C5.33418 1.75 2.8532 3.16633 1.57617 5.1144L4.00473 6.98483C4.64272 5.31767 6.26866 4.12983 8.2001 4.12983Z" fill="#EB4335" />
        </svg>
        Continue with Google
      </Button>

      <div className="mt-6 text-center">
        {isLogin ? <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <button onClick={() => setIsLogin(false)} className="text-interview-primary hover:text-interview-violet font-medium transition-colors">
              Sign up
            </button>
          </p> : <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <button onClick={() => setIsLogin(true)} className="text-interview-primary hover:text-interview-violet font-medium transition-colors">
              Log in
            </button>
          </p>}
      </div>
    </div>;
};