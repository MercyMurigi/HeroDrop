"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Send } from 'lucide-react';
import { sendBroadcastSms } from '@/ai/flows/send-broadcast-sms';

const templates: Record<string, string> = {
    "custom": "",
    "new-service": "Hi {{userName}}, great news! We've just added a new service you can redeem with your DamuTokens. Check it out now!",
    "reward-offer": "Hi {{userName}}, for a limited time, earn double DamuTokens for every blood donation. Book your appointment today!",
    "urgent-blood-need": "URGENT: Hi {{userName}}, there is a critical need for your blood type. Please consider donating soon and be a hero. Thank you!",
}

export function BroadcastMessageForm() {
    const [isLoading, setIsLoading] = useState(false);
    const [phone, setPhone] = useState('');
    const [message, setMessage] = useState('');
    const { toast } = useToast();
    
    const handleTemplateChange = (templateKey: string) => {
        setMessage(templates[templateKey] || '');
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const result = await sendBroadcastSms({ phone, message });
            if (result.success) {
                toast({
                    title: "Broadcast Sent!",
                    description: `Your message has been sent to ${phone}.`,
                });
                setMessage('');
                setPhone('');
            } else {
                 toast({
                    variant: "destructive",
                    title: "Broadcast Failed",
                    description: result.message,
                });
            }

        } catch (error) {
            toast({
                variant: "destructive",
                title: "An Error Occurred",
                description: "Failed to send the broadcast message.",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="grid md:grid-cols-2 gap-8">
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="phone">Recipient Phone Number</Label>
                    <Input 
                        id="phone"
                        type="tel"
                        placeholder="e.g., +254712345678"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                    />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="template">Message Template</Label>
                    <Select defaultValue="custom" onValueChange={handleTemplateChange}>
                        <SelectTrigger id="template">
                            <SelectValue placeholder="Select a template" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="custom">Custom Message</SelectItem>
                            <SelectItem value="new-service">New Service Campaign</SelectItem>
                            <SelectItem value="reward-offer">New Reward Offer</SelectItem>
                            <SelectItem value="urgent-blood-need">Urgent Blood Need</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea 
                        id="message"
                        placeholder="Type your message here. You can use variables like {{userName}}."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="min-h-[150px]"
                        required
                    />
                </div>
                <Button type="submit" disabled={isLoading || !phone || !message} className="w-full md:w-auto">
                    {isLoading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending...
                        </>
                    ) : (
                        <>
                            <Send className="mr-2 h-4 w-4" /> Send Test Broadcast
                        </>
                    )}
                </Button>
            </form>
            <div className="space-y-4">
                <Label>SMS Preview</Label>
                <Card className="bg-muted/30 border-2 border-dashed flex items-center justify-center min-h-[200px]">
                    <CardContent className="p-6 text-center">
                        {message ? (
                            <p className="text-lg font-medium text-foreground bg-white p-4 rounded-lg shadow-inner max-w-sm mx-auto">
                                {message.replace(/{{userName}}/g, "Donor")}
                            </p>
                        ) : (
                             <div className="flex flex-col items-center gap-2 text-muted-foreground">
                                <p>Message preview will appear here.</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
                 <p className="text-xs text-muted-foreground">
                    This is a generic preview. The `{'{{userName}}'}` variable will be replaced with the recipient's actual name if available in a full implementation.
                </p>
            </div>
        </div>
    );
}
