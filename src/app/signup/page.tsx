'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Logo } from '@/components/logo';

export default function SignupRedirectPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-6 bg-muted">
       <Card className="w-full max-w-md">
         <CardHeader className="text-center">
            <div className="flex justify-center mb-2">
              <Logo />
            </div>
           <CardTitle className="text-2xl font-headline">Sign Up On Our Homepage</CardTitle>
           <CardDescription>
             To create an account, please use the "Sign Up" tab on our main page.
           </CardDescription>
         </CardHeader>
         <CardContent className="flex justify-center">
           <Button asChild>
             <Link href="/">Go to Home Page</Link>
           </Button>
         </CardContent>
       </Card>
    </div>
  );
}
