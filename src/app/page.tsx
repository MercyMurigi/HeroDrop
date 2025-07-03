"use client";

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Droplet } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Logo } from '@/components/logo';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

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

  const handleSignup = () => {
    // For now, just go to the dashboard. In a real app, this would handle account creation.
    router.push('/dashboard');
  }

  return (
    <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2">
      <div className="flex items-center justify-center p-6 sm:p-12 bg-background">
        <div className="mx-auto grid w-full max-w-[400px] gap-6">
          <div className="grid gap-2 text-center">
            <div className="flex justify-center mb-2">
              <Logo />
            </div>
            <h1 className="text-3xl font-bold font-headline">A Healthier Future Starts With You</h1>
            <p className="text-balance text-muted-foreground">
              Join HeroDrop+ to donate blood, earn rewards, and save lives. Your single act of kindness can make a world of difference.
            </p>
          </div>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            <TabsContent value="login">
              <Card className="border-none shadow-none bg-transparent">
                <CardHeader className="text-left px-1">
                  <CardTitle className="text-2xl">Welcome Back</CardTitle>
                  <CardDescription>
                    Enter your credentials to access your portal.
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4 px-1">
                  <div className="grid gap-2">
                    <Label>Role</Label>
                    <RadioGroup defaultValue="donor" onValueChange={setRole} className="flex gap-4 pt-1">
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="donor" id="role-donor" />
                            <Label htmlFor="role-donor" className="font-normal">Donor</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="admin" id="role-admin" />
                            <Label htmlFor="role-admin" className="font-normal">Admin</Label>
                        </div>
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
                  <Button onClick={handleLogin} className="w-full">
                    Login
                  </Button>
                  <Button variant="outline" className="w-full">
                    Login with Google
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="signup">
               <Card className="border-none shadow-none bg-transparent">
                <CardHeader className="text-left px-1">
                  <CardTitle className="text-2xl">Create an Account</CardTitle>
                  <CardDescription>
                    Fill in your details to join our community of lifesavers.
                  </CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4 px-1">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="full-name">Full Name</Label>
                            <Input id="full-name" placeholder="John Doe" required />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="id-number">National ID</Label>
                            <Input id="id-number" placeholder="12345678" required />
                        </div>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="phone-number">Phone Number</Label>
                        <Input id="phone-number" type="tel" placeholder="+254 712 345 678" required />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="new-password">Password</Label>
                        <Input id="new-password" type="password" required />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="blood-type">Blood Type (if known)</Label>
                        <Select>
                            <SelectTrigger id="blood-type">
                                <SelectValue placeholder="Select your blood type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="A+">A+</SelectItem>
                                <SelectItem value="A-">A-</SelectItem>
                                <SelectItem value="B+">B+</SelectItem>
                                <SelectItem value="B-">B-</SelectItem>
                                <SelectItem value="AB+">AB+</SelectItem>
                                <SelectItem value="AB-">AB-</SelectItem>
                                <SelectItem value="O+">O+</SelectItem>
                                <SelectItem value="O-">O-</SelectItem>
                                <SelectItem value="unknown">I don't know</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="items-top flex space-x-2 pt-2">
                        <Checkbox id="eligibility" />
                        <div className="grid gap-1.5 leading-none">
                            <Label htmlFor="eligibility" className="font-normal text-muted-foreground">
                                I confirm I meet basic eligibility criteria (age 16-65, over 50kg).
                            </Label>
                        </div>
                    </div>
                    <Button onClick={handleSignup} className="w-full">
                      Create Account
                    </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <div className="hidden lg:flex items-center justify-center p-12 bg-primary relative">
        <svg
          className="absolute top-0 left-0 h-full"
          style={{ width: '150px' }}
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M0,0 C40,33 40,66 0,100" fill="hsl(var(--background))" />
        </svg>

        <div className="relative z-10 text-center text-primary-foreground">
            <Droplet className="h-40 w-40 opacity-50 mx-auto" fill="currentColor" />
            <h2 className="mt-6 text-4xl font-bold font-headline">Every Drop Counts</h2>
            <p className="mt-4 max-w-sm text-primary-foreground/80">
                Your donation is a lifeline for someone in need. Join our community of heroes and make a difference today.
            </p>
        </div>
      </div>
    </div>
  );
}
