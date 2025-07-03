
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

const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.85 3.18-1.73 4.1-1.02 1.08-2.58 1.98-4.56 1.98-3.59 0-6.52-2.91-6.52-6.49s2.93-6.49 6.52-6.49c2.03 0 3.36.85 4.17 1.62l2.55-2.54C16.82 4.01 14.86 3 12.48 3c-5.21 0-9.48 4.22-9.48 9.42s4.27 9.42 9.48 9.42c2.81 0 5.23-1.02 6.9-2.73 1.82-1.82 2.37-4.41 2.37-6.59 0-.6-.05-1.14-.15-1.62h-9.12z" fill="currentColor"/>
    </svg>
);


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
          src="https://placehold.co/1920x1080.png"
          alt="A smiling blood donor giving a thumbs up"
          fill
          className="object-cover"
          data-ai-hint="blood donation person"
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
                    <Button onClick={handleLogin} className="w-full" size="lg">
                        Login as {role === 'donor' ? 'Donor' : 'Admin'}
                    </Button>
                    
                    <div className="relative my-2">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-card px-2 text-muted-foreground">
                                Or continue with
                            </span>
                        </div>
                    </div>

                    <Button variant="outline" className="w-full" size="lg" onClick={handleLogin}>
                        <GoogleIcon className="mr-2 h-5 w-5" />
                        Sign in with Google
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
