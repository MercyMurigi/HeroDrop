"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy, Gift, Share2 } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

export default function ReferralsPage() {
  const { toast } = useToast();
  const referralLink = "https://damuhero.co.ke/join?ref=U8X3K2";

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink);
    toast({
      title: "Copied to clipboard!",
      description: "You can now share your referral link.",
    });
  };

  return (
    <div className="flex-1 space-y-8 p-4 md:p-8">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight font-headline">Refer a Friend, Earn Rewards</h2>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <Card className="shadow-lg">
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="bg-primary/10 p-3 rounded-lg">
                <Gift className="h-8 w-8 text-primary" />
              </div>
              <div>
                <CardTitle className="font-headline">Share and Earn 30 DT</CardTitle>
                <CardDescription>
                  For every friend who signs up and donates, you get 30 DamuTokens!
                  Your successful referrals will appear in your wallet's transaction history.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="font-semibold">Your unique referral link:</p>
            <div className="flex gap-2">
              <Input value={referralLink} readOnly className="bg-background" />
              <Button variant="outline" size="icon" onClick={copyToClipboard}>
                <Copy className="h-4 w-4" />
                <span className="sr-only">Copy link</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="bg-primary/10 p-3 rounded-lg">
                <Share2 className="h-8 w-8 text-primary" />
              </div>
              <div>
                <CardTitle className="font-headline">Share on Social Media</CardTitle>
                <CardDescription>
                  Spread the word and save more lives.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-4">
            <Button className="flex-1 min-w-[120px]" variant="outline">Share on X</Button>
            <Button className="flex-1 min-w-[120px]" variant="outline">Share on Facebook</Button>
            <Button className="flex-1 min-w-[120px]" variant="outline">Share on WhatsApp</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
