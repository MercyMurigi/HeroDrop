import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SmsNotificationForm } from '@/components/sms-notification-form';
import { BroadcastMessageForm } from '@/components/broadcast-message-form';
import { MessageSquareText, Send } from 'lucide-react';

export default function SmsToolsPage() {
  return (
    <div className="flex-1 space-y-8 p-4 md:p-8">
      <div className="flex items-center justify-between space-y-2">
        <div>
            <h2 className="text-3xl font-bold tracking-tight font-headline">Communication Tools</h2>
            <p className="text-muted-foreground">Send individual notifications or broadcast messages to targeted groups.</p>
        </div>
      </div>

      <Tabs defaultValue="broadcast" className="space-y-4">
        <TabsList>
          <TabsTrigger value="broadcast">
            <Send className="mr-2" />
            Broadcast Message
          </TabsTrigger>
          <TabsTrigger value="generator">
            <MessageSquareText className="mr-2" />
            Single SMS Generator
          </TabsTrigger>
        </TabsList>
        <TabsContent value="broadcast">
            <Card className="hover:shadow-xl">
                <CardHeader>
                <CardTitle className="font-headline">Broadcast SMS to Donors</CardTitle>
                <CardDescription>
                    Send targeted messages to groups of users based on different criteria.
                </CardDescription>
                </CardHeader>
                <CardContent>
                    <BroadcastMessageForm />
                </CardContent>
            </Card>
        </TabsContent>
        <TabsContent value="generator">
            <Card className="hover:shadow-xl">
                <CardHeader>
                <CardTitle className="font-headline">SMS Notification Generator</CardTitle>
                <CardDescription>
                    Test the GenAI-powered SMS notifications. Select a notification type and see the generated message.
                </CardDescription>
                </CardHeader>
                <CardContent>
                    <SmsNotificationForm />
                </CardContent>
            </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
