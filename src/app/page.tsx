
"use client";

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Droplet, Hospital, User, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-muted/40 p-4">
      <div className="w-full max-w-4xl rounded-xl border bg-card text-card-foreground shadow-xl overflow-hidden grid md:grid-cols-2">

        <div className="relative hidden md:block">
            <Image 
                src="https://placehold.co/800x1000.png"
                alt="A smiling blood donor giving a thumbs up"
                width={800}
                height={1000}
                className="h-full w-full object-cover"
                data-ai-hint="smiling blood donor"
            />
            <div className="absolute inset-0 bg-primary/20"></div>
            <div className="absolute inset-0 flex flex-col justify-end p-12 text-white bg-gradient-to-t from-black/50 to-transparent">
                <h2 className="text-4xl font-bold font-headline leading-tight">Join a community of lifesavers.</h2>
                <p className="mt-4 text-lg max-w-prose">Every drop counts. Your donation can save up to three lives. Become a hero today.</p>
            </div>
        </div>

        <div className="flex flex-col justify-center p-8 lg:p-12">
            <div className="flex items-center justify-center gap-4 mb-6">
                <Droplet className="h-10 w-10 text-primary" fill="currentColor" />
                <h1 className="text-3xl font-bold text-primary font-headline">HeroDrop+</h1>
            </div>
            <div className="text-center mb-6">
                <h2 className="text-2xl font-bold font-headline tracking-tight">Welcome Back</h2>
                <p className="text-muted-foreground">Select your role and sign in to continue.</p>
            </div>

            <div className="grid gap-4">
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
  );
}
