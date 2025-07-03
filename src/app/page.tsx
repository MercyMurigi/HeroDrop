"use client";

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';
import { Droplet, Heart, Activity, Plus, Hospital, User, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function AuthPage() {
  const router = useRouter();
  const [role, setRole] = useState('donor');

  const handleLogin = () => {
    if (role === 'admin') {
      router.push('/admin/dashboard');
    } else {
      router.push('/dashboard');
    }
  };
  
  const AnimatedIcon = ({ icon: Icon, className, animation }: any) => (
    <Icon className={cn("absolute text-primary/10", className, animation)} />
  );

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden p-6 bg-background">
      <AnimatedIcon icon={Droplet} className="h-24 w-24 top-1/4 left-1/4" animation="animate-float-1" />
      <AnimatedIcon icon={Heart} className="h-20 w-20 top-1/2 right-1/4" animation="animate-float-2" />
      <AnimatedIcon icon={Activity} className="h-16 w-16 bottom-1/4 left-1/3" animation="animate-float-3" />
      <AnimatedIcon icon={Plus} className="h-12 w-12 bottom-1/3 right-1/3" animation="animate-float-1" />
      <AnimatedIcon icon={Droplet} className="h-28 w-28 top-3/4 left-1/2" animation="animate-float-2" />
      <AnimatedIcon icon={Heart} className="h-10 w-10 top-1/3 right-1/2" animation="animate-float-3" />

      <Card className="w-full max-w-sm z-10 shadow-xl">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-4 mb-2">
            <Droplet className="h-12 w-12 text-primary" fill="currentColor" />
            <h1 className="text-4xl font-bold text-primary font-headline">
              HeroDrop+
            </h1>
          </div>
          <CardTitle className="text-2xl font-headline">Welcome Back</CardTitle>
          <CardDescription>
            Enter your credentials to access your portal.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label>Select your role</Label>
            <RadioGroup defaultValue="donor" onValueChange={setRole} className="grid grid-cols-2 gap-4 pt-1">
              <Label htmlFor="role-donor" className={cn("relative flex flex-col items-center justify-center rounded-lg border-2 p-4 cursor-pointer hover:bg-accent hover:text-accent-foreground", role === 'donor' && 'border-primary')}>
                <RadioGroupItem value="donor" id="role-donor" className="sr-only" />
                <User className="h-12 w-12 mb-2" />
                <span className="font-semibold">Donor</span>
                {role === 'donor' && <div className="absolute top-2 right-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground"><Check className="h-4 w-4" /></div>}
              </Label>
              <Label htmlFor="role-admin" className={cn("relative flex flex-col items-center justify-center rounded-lg border-2 p-4 cursor-pointer hover:bg-accent hover:text-accent-foreground", role === 'admin' && 'border-primary')}>
                <RadioGroupItem value="admin" id="role-admin" className="sr-only" />
                <Hospital className="h-12 w-12 mb-2" />
                <span className="font-semibold">Admin</span>
                {role === 'admin' && <div className="absolute top-2 right-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-primary-foreground"><Check className="h-4 w-4" /></div>}
              </Label>
            </RadioGroup>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="m@example.com" required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" required />
          </div>
          <Button onClick={handleLogin} className="w-full" size="lg">
            Login
          </Button>
          <Button variant="outline" className="w-full" size="lg">
            Login with Google
          </Button>
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="underline font-semibold text-primary">
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
