'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Logo } from '@/components/logo';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

export default function SignupPage() {
  return (
    <div className="w-full lg:grid lg:min-h-screen lg:grid-cols-2">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[450px] gap-6">
          <div className="grid gap-2 text-center">
            <div className="flex justify-center">
              <Logo />
            </div>
            <h1 className="text-3xl font-bold">Create an Account</h1>
            <p className="text-balance text-muted-foreground">
              Join HeroDrop+ and start saving lives today.
            </p>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Sign Up</CardTitle>
              <CardDescription>
                Enter your details to create your donor account.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                      <Label htmlFor="full-name">Full Name</Label>
                      <Input id="full-name" placeholder="John Doe" required />
                  </div>
                  <div className="grid gap-2">
                      <Label htmlFor="id-number">National ID Number</Label>
                      <Input id="id-number" placeholder="12345678" required />
                  </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone-number">Phone Number</Label>
                <Input id="phone-number" type="tel" placeholder="+254 712 345 678" required />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" required />
              </div>

              <div className="border-t pt-4 mt-2">
                  <h3 className="text-md font-semibold mb-2">Basic Medical Information</h3>
                  <div className="grid gap-4">
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
                      <div className="items-top flex space-x-2">
                          <Checkbox id="eligibility" />
                          <div className="grid gap-1.5 leading-none">
                              <Label htmlFor="eligibility" className="font-normal text-muted-foreground">
                                  I confirm that I meet the basic eligibility criteria for donating blood (e.g., age 16-65, weight over 50kg).
                              </Label>
                          </div>
                      </div>
                  </div>
              </div>
              
              <div className="border-t pt-4 mt-2">
                  <h3 className="text-md font-semibold mb-2">Next of Kin Details</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                        <Label htmlFor="kin-name">Full Name</Label>
                        <Input id="kin-name" placeholder="Jane Doe" required />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="kin-phone">Phone Number</Label>
                        <Input id="kin-phone" type="tel" placeholder="+254 712 345 678" required />
                    </div>
                    <div className="grid gap-2 col-span-2">
                        <Label htmlFor="kin-id-number">National ID Number</Label>
                        <Input id="kin-id-number" placeholder="87654321" required />
                    </div>
                  </div>
              </div>

              <Button type="submit" className="w-full">
                Create Account
              </Button>
            </CardContent>
          </Card>
          <div className="mt-4 text-center text-sm">
            Already have an account?{' '}
            <Link href="/" className="underline">
              Login
            </Link>
          </div>
        </div>
      </div>
       <div className="hidden bg-muted lg:block">
        <Image
          src="https://placehold.co/1920x1080.png"
          alt="A person at a community blood drive"
          width="1920"
          height="1080"
          className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
          data-ai-hint="community blood drive"
        />
      </div>
    </div>
  );
}
