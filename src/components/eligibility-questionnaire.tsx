'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { checkEligibility, CheckEligibilityInputSchema, CheckEligibilityOutput } from '@/ai/flows/check-eligibility';
import { useToast } from '@/hooks/use-toast';

const formSchema = CheckEligibilityInputSchema.refine(data => {
    if (data.medication === 'yes') {
        return !!data.medicationList && data.medicationList.length > 0;
    }
    return true;
}, {
    message: 'Please list your medications.',
    path: ['medicationList'],
});

type EligibilityFormValues = z.infer<typeof formSchema>;

interface EligibilityQuestionnaireProps {
    onComplete: (data: EligibilityFormValues) => void;
}

const Question = ({ name, label, control }: { name: keyof EligibilityFormValues, label: string, control: any }) => (
    <FormField
        control={control}
        name={name}
        render={({ field }) => (
            <FormItem className="flex items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                    <FormLabel className="text-base">{label}</FormLabel>
                </div>
                <div className="flex items-center gap-8">
                    <FormControl>
                        <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex space-x-4"
                        >
                            <FormItem className="flex items-center space-x-2">
                                <FormControl>
                                    <RadioGroupItem value="yes" id={`${String(name)}-yes`} />
                                </FormControl>
                                <FormLabel htmlFor={`${String(name)}-yes`} className="font-normal">Yes</FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-2">
                                <FormControl>
                                    <RadioGroupItem value="no" id={`${String(name)}-no`} />
                                </FormControl>
                                <FormLabel htmlFor={`${String(name)}-no`} className="font-normal">No</FormLabel>
                            </FormItem>
                        </RadioGroup>
                    </FormControl>
                    <FormMessage />
                </div>
            </FormItem>
        )}
    />
);

export function EligibilityQuestionnaire({ onComplete }: EligibilityQuestionnaireProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [aiResponse, setAiResponse] = useState<CheckEligibilityOutput | null>(null);
    const { toast } = useToast();

    const form = useForm<EligibilityFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            medicationList: ""
        }
    });

    const watchMedication = form.watch('medication');

    const handleFormSubmit = async (data: EligibilityFormValues) => {
        setIsLoading(true);
        setAiResponse(null);
        try {
            const result = await checkEligibility(data);
            setAiResponse(result);
            if (result.isEligible) {
                // Wait a moment before proceeding so the user can see the success message
                setTimeout(() => {
                    onComplete(data);
                }, 1000);
            }
        } catch (error) {
            console.error(error);
            toast({
                variant: "destructive",
                title: "Error Checking Eligibility",
                description: "There was a problem with our AI check. Please try again.",
            });
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Card className="shadow-lg">
            <CardHeader>
                <CardTitle className="font-headline">2. Medical Eligibility</CardTitle>
                <CardDescription>Please answer these questions honestly. Our AI will review your answers to ensure the safety of both you and the recipient.</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-8">
                        <Accordion type="multiple" className="w-full" defaultValue={['item-1']}>
                             <AccordionItem value="item-1">
                                <AccordionTrigger className="text-lg font-semibold">A. General Health</AccordionTrigger>
                                <AccordionContent className="space-y-4 pt-4">
                                    <Question name="feelingWell" label="Are you feeling well today?" control={form.control} />
                                    <Question name="fever" label="Have you had a fever in the past 7 days?" control={form.control} />
                                    <Question name="weightLoss" label="Have you recently experienced unexplained weight loss or fatigue?" control={form.control} />
                                </AccordionContent>
                            </AccordionItem>
                             <AccordionItem value="item-2">
                                <AccordionTrigger className="text-lg font-semibold">B. Recent Illness or Medical Events</AccordionTrigger>
                                <AccordionContent className="space-y-4 pt-4">
                                    <Question name="malaria" label="Have you had malaria in the last 3 months?" control={form.control} />
                                    <Question name="typhoid" label="Have you had typhoid, TB, or hepatitis recently?" control={form.control} />
                                    <Question name="surgery" label="Have you had surgery in the past 6 months?" control={form.control} />
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="item-3">
                                <AccordionTrigger className="text-lg font-semibold">C. Infectious Diseases</AccordionTrigger>
                                <AccordionContent className="space-y-4 pt-4">
                                    <Question name="hiv" label="Have you tested positive for HIV/AIDS?" control={form.control} />
                                    <Question name="sti" label="Do you have any known sexually transmitted infections?" control={form.control} />
                                    <Question name="covid" label="Have you been exposed to COVID-19 recently?" control={form.control} />
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="item-4">
                                <AccordionTrigger className="text-lg font-semibold">D. Medication & Vaccination</AccordionTrigger>
                                <AccordionContent className="space-y-4 pt-4">
                                    <Question name="medication" label="Are you currently taking any medication?" control={form.control} />
                                    {watchMedication === 'yes' && (
                                        <FormField
                                            control={form.control}
                                            name="medicationList"
                                            render={({ field }) => (
                                                <FormItem className="pl-4">
                                                    <FormLabel>If yes, please list the medications:</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="e.g., Aspirin, Amoxicillin" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    )}
                                    <Question name="vaccine" label="Have you received any vaccines in the last 4 weeks?" control={form.control} />
                                </AccordionContent>
                            </AccordionItem>
                             <AccordionItem value="item-5">
                                <AccordionTrigger className="text-lg font-semibold">E. Pregnancy & Breastfeeding (for female donors)</AccordionTrigger>
                                <AccordionContent className="space-y-4 pt-4">
                                    <Question name="pregnant" label="Are you currently pregnant?" control={form.control} />
                                    <Question name="gaveBirth" label="Have you given birth in the past 6 months?" control={form.control} />
                                    <Question name="breastfeeding" label="Are you breastfeeding?" control={form.control} />
                                </AccordionContent>
                            </AccordionItem>
                             <AccordionItem value="item-6">
                                <AccordionTrigger className="text-lg font-semibold">F. High-Risk Behavior / Lifestyle</AccordionTrigger>
                                <AccordionContent className="space-y-4 pt-4">
                                    <Question name="newPartner" label="Have you had a new sexual partner in the last 6 months?" control={form.control} />
                                    <Question name="injectedDrugs" label="Have you ever injected drugs not prescribed by a doctor?" control={form.control} />
                                    <Question name="paidForBlood" label="Have you ever been paid to donate or receive blood?" control={form.control} />
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>

                        {aiResponse && (
                            <Alert variant={aiResponse.isEligible ? "default" : "destructive"} className={aiResponse.isEligible ? "bg-green-50 border-green-200" : ""}>
                                {aiResponse.isEligible ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                                <AlertTitle>{aiResponse.isEligible ? "Eligibility Confirmed!" : "Eligibility Check Failed"}</AlertTitle>
                                <AlertDescription>
                                    {aiResponse.feedback}
                                </AlertDescription>
                            </Alert>
                        )}

                        <div className="flex justify-end">
                            <Button type="submit" size="lg" disabled={isLoading}>
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Checking Eligibility...
                                    </>
                                ) : (
                                    'Check Eligibility & Continue'
                                )}
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}
