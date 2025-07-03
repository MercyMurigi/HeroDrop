"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy, Gift, Share2, MessageCircle } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

const WhatsappIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    role="img"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    {...props}
  >
    <title>WhatsApp</title>
    <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.38 1.25 4.85L2.02 22l5.3-1.38c1.41.74 3 1.12 4.72 1.12h.01c5.46 0 9.91-4.45 9.91-9.91s-4.45-9.91-9.91-9.91zm6.06 14.14c-.23-.12-1.36-.67-1.57-.75-.21-.08-.36-.12-.51.12-.15.23-.59.75-.73.9-.13.15-.27.17-.5.05-.23-.12-1-.36-1.9-1.18-.71-.64-1.18-1.43-1.32-1.67-.13-.24-.01-.37.11-.48.11-.11.23-.27.35-.41.12-.13.16-.23.24-.38.08-.15.04-.28-.02-.4-.06-.12-1.57-2.78-1.74-3.18-.16-.38-.33-.33-.46-.33h-.4c-.13 0-.35.04-.51.23-.17.19-.65.64-.65 1.57 0 .92.67 1.82.76 1.95.1.12 1.34 2.06 3.25 2.87.43.18.77.29 1.04.37.45.14.85.12 1.15-.06.34-.2.65-.82.74-1.04.1-.22.1-.41.06-.53z"/>
  </svg>
);

export default function ReferralsPage() {
  const { toast } = useToast();
  const referralLink = "https://damuhero.co.ke/join?ref=U8X3K2";
  const shareText = `Join me on HeroDrop+ and earn rewards for donating blood! Use my link: ${referralLink}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink);
    toast({
      title: "Copied to clipboard!",
      description: "You can now share your referral link.",
    });
  };

  const shareOnWhatsApp = () => {
    const encodedText = encodeURIComponent(shareText);
    window.open(`https://wa.me/?text=${encodedText}`, '_blank');
  };

  const shareOnSMS = () => {
    const encodedText = encodeURIComponent(shareText);
    // This will open the user's default SMS app
    window.location.href = `sms:?body=${encodedText}`;
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
                <CardTitle className="font-headline">Share Your Link</CardTitle>
                <CardDescription>
                  Spread the word and save more lives.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-4">
            <Button className="flex-1 min-w-[120px]" variant="outline" onClick={shareOnWhatsApp}>
              <WhatsappIcon className="mr-2 h-4 w-4" />
              Share on WhatsApp
            </Button>
            <Button className="flex-1 min-w-[120px]" variant="outline" onClick={shareOnSMS}>
              <MessageCircle className="mr-2 h-4 w-4" />
              Share via SMS
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
