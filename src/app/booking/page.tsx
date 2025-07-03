'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { FacilityFinder } from '@/components/facility-finder';
import { EligibilityQuestionnaire } from '@/components/eligibility-questionnaire';
import { ArrowRight, ArrowLeft, Loader2 } from 'lucide-react';
import type { FindFacilitiesOutput } from '@/ai/flows/find-facilities';
import { useToast } from '@/hooks/use-toast';
import { generateSmsNotification } from '@/ai/flows/generate-sms-notification';
import { generateNextOfKinSms } from '@/ai/flows/generate-next-of-kin-sms';


type Facility = FindFacilitiesOutput['facilities'][0];
type EligibilityData = any;

export default function BookingPage() {
  const [step, setStep] = useState(1);
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null);
  const [eligibilityData, setEligibilityData] = useState<EligibilityData | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [isBooking, setIsBooking] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleFacilitySelect = (facility: Facility) => {
    setSelectedFacility(facility);
  };
  
  const handleEligibilityComplete = (data: EligibilityData) => {
    setEligibilityData(data);
    setStep(3);
  }

  const handleConfirmBooking = async () => {
    if (!selectedFacility || !selectedDate) return;
    setIsBooking(true);

    try {
        // In a real app, we'd get donor and next of kin details from user session/state
        const donorDetails = {
            name: 'Jane Donor', // Placeholder
            tokenBalance: 130, // Placeholder
        };
        const nextOfKinDetails = {
            name: 'John Donor', // Placeholder
        };

        // Generate and "send" SMS to donor
        const donorSmsPromise = generateSmsNotification({
            notificationType: 'confirmation',
            userName: donorDetails.name,
            tokenBalance: donorDetails.tokenBalance,
            appointmentTime: `${selectedDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}`,
            hospitalName: selectedFacility.name,
        });

        // Generate and "send" SMS to next of kin
        const nextOfKinSmsPromise = generateNextOfKinSms({
            donorName: donorDetails.name,
            nextOfKinName: nextOfKinDetails.name,
            hospitalName: selectedFacility.name,
        });

        // Await both promises
        const [donorSmsResult, nextOfKinSmsResult] = await Promise.all([donorSmsPromise, nextOfKinSmsPromise]);

        console.log("Donor SMS:", donorSmsResult.smsMessage);
        console.log("Next of Kin SMS:", nextOfKinSmsResult.smsMessage);
        
        const appointmentDetails = {
            facility: {
                name: selectedFacility.name,
                address: selectedFacility.address,
            },
            date: selectedDate.toISOString(),
        };
        localStorage.setItem('upcomingAppointment', JSON.stringify(appointmentDetails));
        
        // Add pledge transaction to local storage
        const pledgeTransaction = {
          date: new Date().toLocaleDateString('en-CA'),
          description: 'Pledged to donate',
          amount: 10,
          type: 'credit' as 'credit',
        };
        const storedTransactions = localStorage.getItem('transactions');
        const currentTransactions = storedTransactions ? JSON.parse(storedTransactions) : [];
        const newTransactions = [pledgeTransaction, ...currentTransactions];
        localStorage.setItem('transactions', JSON.stringify(newTransactions));

        toast({
            title: "Appointment Confirmed!",
            description: `You've earned 10 DamuTokens! Your booking at ${selectedFacility.name} is confirmed.`,
        });
        router.push('/dashboard');

    } catch (error) {
        console.error("Booking failed:", error);
        toast({
            variant: "destructive",
            title: "Booking Failed",
            description: "We couldn't confirm your appointment or send notifications. Please try again.",
        });
    } finally {
        setIsBooking(false);
    }
  }

  const goToNextStep = () => setStep(step + 1);
  const goToPrevStep = () => {
    // If going back from step 3, reset eligibility data
    if(step === 3) {
        setEligibilityData(null);
    }
    setStep(step - 1);
  }

  const getStepDescription = () => {
      switch(step) {
          case 1: return 'Find a facility for your donation.';
          case 2: return 'Please answer the medical eligibility questions.';
          case 3: return 'Select a date and confirm your appointment details.';
          default: return 'Book your donation appointment.';
      }
  }

  return (
    <div className="flex-1 space-y-8 p-4 md:p-8">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight font-headline">Book an Appointment</h2>
          <p className="text-muted-foreground">
            {getStepDescription()}
          </p>
        </div>
        {step > 1 && (
             <Button variant="outline" onClick={goToPrevStep}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
            </Button>
        )}
      </div>

      {step === 1 && (
        <>
            <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle className="font-headline">1. Find a Donation Facility</CardTitle>
                    <CardDescription>Use our AI-powered search to find the most convenient donation center near you.</CardDescription>
                </CardHeader>
                <CardContent>
                    <FacilityFinder onFacilitySelect={handleFacilitySelect} />
                </CardContent>
            </Card>
            <div className="flex justify-end">
                <Button size="lg" onClick={goToNextStep} disabled={!selectedFacility}>
                    Answer Eligibility Questions <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
            </div>
        </>
      )}

      {step === 2 && (
        <EligibilityQuestionnaire onComplete={handleEligibilityComplete} />
      )}

      {step === 3 && selectedFacility && (
        <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
                <Card className="shadow-lg">
                    <CardHeader>
                        <CardTitle className="font-headline">3. Select a Date</CardTitle>
                        <CardDescription>You are booking at: <span className="font-semibold text-primary">{selectedFacility.name}</span></CardDescription>
                    </CardHeader>
                    <CardContent className="flex justify-center">
                    <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        className="rounded-md border"
                        disabled={(date) => date < new Date(new Date().setDate(new Date().getDate() - 1))}
                    />
                    </CardContent>
                </Card>
            </div>
            <div className="lg:col-span-1">
                <Card className="shadow-lg">
                    <CardHeader>
                        <CardTitle className="font-headline">Confirm Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <p className="font-semibold">Facility</p>
                            <p className="text-muted-foreground">{selectedFacility.name}</p>
                            <p className="text-sm text-muted-foreground">{selectedFacility.address}</p>
                        </div>
                         <div>
                            <p className="font-semibold">Date</p>
                            <p className="text-muted-foreground">{selectedDate ? selectedDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : 'Please select a date'}</p>
                        </div>
                        <Button size="lg" className="w-full text-lg" onClick={handleConfirmBooking} disabled={!selectedDate || isBooking}>
                          {isBooking ? (
                              <>
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Confirming...
                              </>
                          ) : (
                              'Confirm Booking'
                          )}
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
      )}
    </div>
  );
}
