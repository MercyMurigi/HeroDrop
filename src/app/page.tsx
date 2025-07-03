
"use client";

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';
import { Droplet } from 'lucide-react';
import Image from 'next/image';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function AuthPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('donor');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (role === 'admin') {
      router.push('/admin/dashboard');
    } else {
      router.push('/dashboard');
    }
  };

  return (
    <div className="relative min-h-screen w-full">
      <Image
        src="https://images.unsplash.com/photo-1627843444992-0543e0618035"
        alt="A close-up of a person donating blood, with a medical professional in blue gloves attending."
        fill
        className="object-cover"
        data-ai-hint="blood donation"
      />
      <div className="absolute inset-0 bg-black/40 z-0" />

      <div className="relative z-10 flex min-h-screen items-center justify-end p-6 lg:p-12">
        <Card className="w-full max-w-md shadow-xl bg-card/80 backdrop-blur-sm">
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

            <form onSubmit={handleLogin} className="grid gap-4 mt-4">
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
                <Button type="submit" className="w-full mt-4" size="lg">
                    Login as {role === 'donor' ? 'Donor' : 'Admin'}
                </Button>
                <div className="mt-4 text-center text-sm">
                    Don&apos;t have an account?{" "}
                    <Link href="/signup" className="underline font-semibold text-primary">
                    Sign up
                    </Link>
                </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
