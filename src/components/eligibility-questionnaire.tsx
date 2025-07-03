'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { checkEligibility } from '@/ai/flows/check-eligibility';
import { CheckEligibilityInputSchema, type CheckEligibilityOutput } from '@/ai/schemas/eligibility';
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
                    <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
                        <div className="space-y-4">
                            <Question name="hiv" label="Have you tested positive for HIV/AIDS?" control={form.control} />
                            <Question name="pregnant" label="Are you currently pregnant? (for female donors)" control={form.control} />
                            <Question name="breastfeeding" label="Are you breastfeeding? (for female donors)" control={form.control} />
                            <Question name="medication" label="Are you currently taking any medication?" control={form.control} />
                            {watchMedication === 'yes' && (
                                <FormField
                                    control={form.control}
                                    name="medicationList"
                                    render={({ field }) => (
                                        <FormItem className="pl-6 pr-2">
                                            <FormLabel>If yes, please list the medications:</FormLabel>
                                            <FormControl>
                                                <Input placeholder="e.g., Aspirin, Amoxicillin" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            )}
                        </div>
                        
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
