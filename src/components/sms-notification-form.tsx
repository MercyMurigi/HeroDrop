"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { generateSmsNotification } from '@/ai/flows/generate-sms-notification';
import type { GenerateSmsNotificationInput } from '@/ai/schemas/sms';

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, MessageSquareText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';


const formSchema = z.object({
  notificationType: z.enum(['reminder', 'confirmation', 'rewards', 'redemption']),
  userName: z.string().min(2, "Username must be at least 2 characters."),
  phone: z.string().min(10, "Please enter a valid phone number."),
  tokenBalance: z.coerce.number().positive("Token balance must be a positive number."),
  serviceRedeemed: z.string().optional(),
  redemptionCode: z.string().optional(),
  appointmentTime: z.string().optional(),
  hospitalName: z.string().optional(),
});

export function SmsNotificationForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [generatedSms, setGeneratedSms] = useState('');
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      notificationType: 'rewards',
      userName: 'Jane Donor',
      phone: '+254712345678',
      tokenBalance: 130,
      serviceRedeemed: 'General checkup',
      redemptionCode: 'XYZ123',
      appointmentTime: 'July 25, 2024 at 2:00 PM',
      hospitalName: 'Nairobi West Hospital',
    },
  });

  const notificationType = form.watch('notificationType');

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setGeneratedSms('');
    try {
      const result = await generateSmsNotification(values as GenerateSmsNotificationInput);
      setGeneratedSms(result.smsMessage);
       toast({
        title: "SMS Generated & Sent!",
        description: `The notification has been sent to ${values.phone}.`,
      });
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Error Generating SMS",
        description: "There was a problem generating or sending the SMS. Please try again.",
      })
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="notificationType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Notification Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a notification type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="reminder">Reminder</SelectItem>
                    <SelectItem value="confirmation">Confirmation</SelectItem>
                    <SelectItem value="rewards">Rewards</SelectItem>
                    <SelectItem value="redemption">Redemption</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-2 gap-4">
             <FormField
                control={form.control}
                name="userName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>User Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Jane Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input type="tel" placeholder="+2547..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
          </div>
          
          <FormField
            control={form.control}
            name="tokenBalance"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Token Balance</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="e.g., 130" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {(notificationType === 'reminder' || notificationType === 'confirmation') && (
            <>
              <FormField
                control={form.control}
                name="appointmentTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Appointment Time</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Tomorrow at 10 AM" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="hospitalName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hospital Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Nairobi Central Hospital" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}

          {notificationType === 'redemption' && (
            <>
              <FormField
                control={form.control}
                name="serviceRedeemed"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Service Redeemed</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., General checkup" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="redemptionCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Redemption Code</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., ABC-123" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}

          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Generate & Send SMS
          </Button>
        </form>
      </Form>

      <Card className="bg-muted/30 border-2 border-dashed flex items-center justify-center min-h-[200px]">
        <CardContent className="p-6 text-center">
          {isLoading ? (
             <div className="flex flex-col items-center gap-2 text-muted-foreground">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p>Generating & Sending...</p>
             </div>
          ) : generatedSms ? (
            <div className="flex flex-col items-center gap-4">
              <MessageSquareText className="h-12 w-12 text-primary" />
              <p className="text-lg font-medium text-foreground bg-white p-4 rounded-lg shadow-inner">
                {generatedSms}
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 text-muted-foreground">
              <MessageSquareText className="h-8 w-8" />
              <p>Your generated SMS will appear here.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
