'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { FacilityFinder } from '@/components/facility-finder';
import { EligibilityQuestionnaire } from '@/components/eligibility-questionnaire';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import type { FindFacilitiesOutput } from '@/ai/flows/find-facilities';
import { useToast } from '@/hooks/use-toast';

type Facility = FindFacilitiesOutput['facilities'][0];
type EligibilityData = any;

export default function BookingPage() {
  const [step, setStep] = useState(1);
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null);
  const [eligibilityData, setEligibilityData] = useState<EligibilityData | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const router = useRouter();
  const { toast } = useToast();

  const handleFacilitySelect = (facility: Facility) => {
    setSelectedFacility(facility);
  };
  
  const handleEligibilityComplete = (data: EligibilityData) => {
    setEligibilityData(data);
    setStep(3);
  }

  const handleConfirmBooking = () => {
    // In a real app, this would save to a database.
    toast({
        title: "Appointment Confirmed!",
        description: `Your booking at ${selectedFacility?.name} for ${selectedDate?.toLocaleDateString()} is confirmed.`,
        variant: 'default',
        className: 'bg-green-100 border-green-300'
    });
    router.push('/dashboard');
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
                        <Button size="lg" className="w-full text-lg" onClick={handleConfirmBooking} disabled={!selectedDate}>Confirm Booking</Button>
                    </CardContent>
                </Card>
            </div>
        </div>
      )}
    </div>
  );
}
