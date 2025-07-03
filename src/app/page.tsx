
"use client";

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Droplet } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function AuthPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('donor');

  const handleLogin = () => {
    if (role === 'admin') {
      router.push('/admin/dashboard');
    } else {
      router.push('/dashboard');
    }
  };

  return (
    <div className="relative min-h-screen w-full font-body">
      {/* Background Image */}
      <Image 
          src="https://images.unsplash.com/photo-1593113598332-cd288d649433?w=1920"
          alt="A healthcare professional attending to a blood donor"
          fill
          className="object-cover"
          priority
      />
      <div className="absolute inset-0 bg-black/60" />
      
      {/* Content Grid */}
      <div className="relative grid min-h-screen content-center md:grid-cols-2">
        
        {/* Left Panel: Tagline & Logo */}
        <div className="hidden md:flex flex-col justify-center items-start p-12 lg:p-24 text-white">
            <div className="flex items-center gap-4 mb-6 animate-fade-in-up" style={{ animationDelay: '200ms', animationFillMode: 'forwards' }}>
                <Droplet className="h-16 w-16 text-primary" fill="currentColor" />
                <h1 className="text-6xl font-bold text-white font-headline">HeroDrop+</h1>
            </div>
            <p className="text-2xl font-light max-w-lg leading-relaxed animate-fade-in-up" style={{ animationDelay: '400ms', animationFillMode: 'forwards' }}>
              Donate blood, earn rewards, save lives. Join a community of heroes today.
            </p>
        </div>

        {/* Right Panel: Login Form */}
        <div className="flex items-center justify-center p-4">
            <div className="w-full max-w-md space-y-6 rounded-2xl bg-card/80 p-8 shadow-2xl backdrop-blur-lg animate-fade-in-up" style={{ animationDelay: '600ms', animationFillMode: 'forwards' }}>
                <div className="text-center">
                    <h2 className="text-3xl font-bold font-headline tracking-tight text-card-foreground">Welcome Back</h2>
                    <p className="text-muted-foreground">Sign in to continue your journey.</p>
                </div>
                
                <Tabs defaultValue="donor" onValueChange={(value) => setRole(value)} className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="donor">Donor Login</TabsTrigger>
                    <TabsTrigger value="admin">Admin Login</TabsTrigger>
                  </TabsList>
                </Tabs>

                <div className="grid gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input 
                            id="email" 
                            type="email" 
                            placeholder={role === 'donor' ? "donor@example.com" : "admin@example.com"}
                            required 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="password">Password</Label>
                        <Input id="password" type="password" required placeholder="Enter password" />
                    </div>
                    <Button onClick={handleLogin} className="w-full mt-4" size="lg">
                        Login as {role === 'donor' ? 'Donor' : 'Admin'}
                    </Button>
                    
                    <div className="mt-4 text-center text-sm">
                        Don&apos;t have an account?{" "}
                        <Link href="/signup" className="underline font-semibold text-primary">
                        Sign up
                        </Link>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
