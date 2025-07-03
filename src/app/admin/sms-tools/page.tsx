import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { SmsNotificationForm } from '@/components/sms-notification-form';

export default function SmsToolsPage() {
  return (
    <div className="flex-1 space-y-8 p-4 md:p-8">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight font-headline">SMS Tools</h2>
      </div>

      <Card className="shadow-lg">
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
    </div>
  );
}
