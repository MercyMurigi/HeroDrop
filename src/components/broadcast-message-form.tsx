"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Send } from 'lucide-react';

export function BroadcastMessageForm() {
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');
    const { toast } = useToast();
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        console.log("Broadcasting message:", message);
        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            toast({
                title: "Broadcast Sent!",
                description: "Your message has been queued for delivery.",
            });
            setMessage('');
        }, 1500);
    };

    return (
        <div className="grid md:grid-cols-2 gap-8">
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="audience">Target Audience</Label>
                    <Select defaultValue="all-donors">
                        <SelectTrigger id="audience">
                            <SelectValue placeholder="Select an audience" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all-donors">All Donors</SelectItem>
                            <SelectItem value="pledged-this-week">Pledged this Week</SelectItem>
                            <SelectItem value="nairobi-donors">Donors in Nairobi</SelectItem>
                            <SelectItem value="top-10-donors">Top 10 Donors</SelectItem>
                            <SelectItem value="o-positive-donors">O+ Blood Type</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="template">Message Content Source</Label>
                    <Select defaultValue="custom">
                        <SelectTrigger id="template">
                            <SelectValue placeholder="Select a source" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="custom">Custom Message</SelectItem>
                            <SelectItem value="new-service">New Service Campaign</SelectItem>
                            <SelectItem value="reward-offer">New Reward Offer</SelectItem>
                            <SelectItem value="pledge-reminder">Pledge Reminder</SelectItem>
                            <SelectItem value="urgent-blood-need">Urgent Blood Need</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea 
                        id="message"
                        placeholder="Type your message here. You can use variables like {{userName}} or {{tokenBalance}}."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="min-h-[150px]"
                        required
                    />
                </div>
                <Button type="submit" disabled={isLoading} className="w-full md:w-auto">
                    {isLoading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending...
                        </>
                    ) : (
                        <>
                            <Send className="mr-2 h-4 w-4" /> Send Broadcast
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
                                {message.replace(/{{userName}}/g, "John Doe").replace(/{{tokenBalance}}/g, "150")}
                            </p>
                        ) : (
                             <div className="flex flex-col items-center gap-2 text-muted-foreground">
                                <p>Message preview will appear here.</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
                 <p className="text-xs text-muted-foreground">
                    This is a generic preview. Variables like `{'{{userName}}'}` will be replaced for each user.
                </p>
            </div>
        </div>
    );
}
