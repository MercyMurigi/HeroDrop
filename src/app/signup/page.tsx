'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Droplet } from 'lucide-react';

export default function SignupPage() {
  const router = useRouter();

  const handleSignup = () => {
    // For now, just go to the dashboard. In a real app, this would handle account creation.
    router.push('/dashboard');
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-6 bg-muted/40">
       <Card className="w-full max-w-md shadow-xl">
         <CardHeader>
            <div className="flex items-center justify-center gap-4 mb-2">
                <Droplet className="h-10 w-10 text-primary" fill="currentColor" />
                <h1 className="text-3xl font-bold text-primary font-headline">
                    HeroDrop+
                </h1>
            </div>
           <CardTitle className="text-2xl font-headline text-center">Create an Account</CardTitle>
           <CardDescription className="text-center">
             Fill in your details to join our community of lifesavers.
           </CardDescription>
         </CardHeader>
         <CardContent className="grid gap-4">
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
            <Button onClick={handleSignup} className="w-full" size="lg">
              Create Account
            </Button>
            <div className="mt-4 text-center text-sm">
              Already have an account?{" "}
              <Link href="/" className="underline font-semibold text-primary">
                Login
              </Link>
            </div>
         </CardContent>
       </Card>
    </div>
  );
}
