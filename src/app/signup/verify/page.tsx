'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

function VerifyPageContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const email = searchParams.get('email');
    const { toast } = useToast();

    const [code, setCode] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isResending, setIsResending] = useState(false);

    const MOCK_CODE = '123456';

    const handleVerify = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Simulate API call
        setTimeout(() => {
            if (code === MOCK_CODE) {
                toast({
                    title: 'Account Verified!',
                    description: 'Welcome to HeroDrop+! You are now being redirected.',
                });
                router.push('/dashboard');
            } else {
                toast({
                    variant: 'destructive',
                    title: 'Invalid Code',
                    description: 'The code you entered is incorrect. Please try again.',
                });
                setIsLoading(false);
            }
        }, 1000);
    };

    const handleResendCode = () => {
        setIsResending(true);
        // Simulate API call
        setTimeout(() => {
            toast({
                title: 'New Code Sent',
                description: `A new verification code has been sent to ${email}.`,
            });
            setIsResending(false);
        }, 1000);
    };


    return (
        <div className="flex min-h-screen items-center justify-center p-6 bg-muted/40">
           <Card className="w-full max-w-md shadow-xl">
             <CardHeader className="text-center">
               <CardTitle className="text-2xl font-headline">Check your email</CardTitle>
               <CardDescription>
                 We've sent a 6-digit verification code to <br />
                 <span className="font-semibold text-foreground">{email || 'your email address'}</span>.
               </CardDescription>
             </CardHeader>
             <CardContent>
               <form onSubmit={handleVerify} className="grid gap-4">
                 <div className="grid gap-2">
                   <Label htmlFor="verification-code">Verification Code</Label>
                   <Input 
                        id="verification-code" 
                        placeholder="______"
                        required 
                        value={code}
                        onChange={(e) => setCode(e.target.value.replace(/[^0-9]/g, ''))}
                        className="text-center text-2xl tracking-[0.5em] font-mono"
                        maxLength={6}
                    />
                 </div>
                 <Button type="submit" disabled={isLoading || code.length < 6} className="w-full" size="lg">
                    {isLoading ? <Loader2 className="animate-spin" /> : 'Verify Account'}
                 </Button>
               </form>

               <div className="mt-4 text-center text-sm">
                 Didn't receive the code?{' '}
                 <Button 
                    variant="link" 
                    className="p-0 h-auto font-semibold text-primary disabled:text-muted-foreground"
                    onClick={handleResendCode}
                    disabled={isResending}
                    type="button"
                 >
                    {isResending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin"/> Resending...</> : 'Resend Code'}
                 </Button>
               </div>
               <div className="mt-2 text-center text-sm">
                    <Link href="/signup" className="underline text-muted-foreground">
                        Back to Sign Up
                    </Link>
                </div>
             </CardContent>
           </Card>
        </div>
      );
}

export default function VerifyPage() {
    return (
      <Suspense fallback={<div>Loading...</div>}>
        <VerifyPageContent />
      </Suspense>
    );
}
