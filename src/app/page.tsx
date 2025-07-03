
"use client";

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';
import { Droplet } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

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
    <div className="flex min-h-screen items-center justify-center p-6 bg-muted/40 font-body">
       <Card className="w-full max-w-md shadow-xl">
         <CardHeader>
            <div className="flex items-center justify-center gap-4 mb-2">
                <Droplet className="h-10 w-10 text-primary" fill="currentColor" />
                <h1 className="text-3xl font-bold text-primary font-headline">
                    HeroDrop+
                </h1>
            </div>
           <CardTitle className="text-2xl font-headline text-center">Welcome Back</CardTitle>
           <CardDescription className="text-center">
             Sign in to continue your life-saving journey.
           </CardDescription>
         </CardHeader>
         <CardContent>
            <Tabs defaultValue="donor" onValueChange={(value) => setRole(value)} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="donor">Donor Login</TabsTrigger>
                <TabsTrigger value="admin">Admin Login</TabsTrigger>
                </TabsList>
            </Tabs>

            <div className="grid gap-4 mt-4">
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
         </CardContent>
       </Card>
    </div>
  );
}
    
