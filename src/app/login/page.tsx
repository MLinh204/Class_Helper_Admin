// app/login/page.tsx
import React from 'react';
import AnimatedCard from '@/components/AnimatedCard';
import AuthForm from '@/components/AuthForm';

const LoginPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-200 to-purple-200 flex items-center justify-center p-4">
      <AnimatedCard>
        <h2 className="text-3xl font-bold text-center mb-6 text-black">Login</h2>
        <AuthForm/>
      </AnimatedCard>
    </div>
  );
};

export default LoginPage;
