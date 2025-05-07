
import React, { useState } from 'react';
import { LoginForm } from './LoginForm';
import { SignupForm } from './SignupForm';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface AuthTabsProps {
  setVerificationEmailSent: (sent: boolean) => void;
}

export const AuthTabs = ({ setVerificationEmailSent }: AuthTabsProps) => {
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");
  
  const handleTabChange = (value: string) => {
    setActiveTab(value as "login" | "signup");
  };

  const handleToggleForm = () => {
    setActiveTab(activeTab === "login" ? "signup" : "login");
  };

  return (
    <div className="glass rounded-xl p-6 md:p-8 shadow-lg backdrop-blur-lg bg-white/80 border border-white/20">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-sora font-bold gradient-text">InterviewXpert</h2>
      </div>
      
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="login" className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${activeTab === 'login' ? 'bg-gradient-primary text-white shadow-sm' : 'text-gray-600 hover:text-gray-800'}`}>
            Login
          </TabsTrigger>
          <TabsTrigger value="signup" className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${activeTab === 'signup' ? 'bg-gradient-primary text-white shadow-sm' : 'text-gray-600 hover:text-gray-800'}`}>
            Sign up
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="login">
          <LoginForm onToggleForm={handleToggleForm} />
        </TabsContent>
        
        <TabsContent value="signup">
          <SignupForm 
            onToggleForm={handleToggleForm} 
            setVerificationEmailSent={setVerificationEmailSent}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};
