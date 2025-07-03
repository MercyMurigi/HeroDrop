'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { FacilityFinder } from '@/components/facility-finder';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import type { FindFacilitiesOutput } from '@/ai/flows/find-facilities';

type Facility = FindFacilitiesOutput['facilities'][0];

export default function BookingPage() {
  const [step, setStep] = useState(1);
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  const handleFacilitySelect = (facility: Facility) => {
    setSelectedFacility(facility);
  };
  
  const goToNextStep = () => {
    if (step === 1 && selectedFacility) {
      setStep(2);
    }
  }

  const goToPrevStep = () => {
    if (step === 2) {
      setStep(1);
    }
  }

  return (
    <div className="flex-1 space-y-8 p-4 md:p-8">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight font-headline">Book an Appointment</h2>
          <p className="text-muted-foreground">
            {step === 1 ? 'Find a facility and select a date for your donation.' : 'Confirm your appointment details.'}
          </p>
        </div>
        {step === 2 && (
             <Button variant="outline" onClick={goToPrevStep}>
                <ArrowLeft className="mr-2" />
                Back to Search
            </Button>
        )}
      </div>

      {step === 1 && (
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="font-headline">1. Find a Donation Facility</CardTitle>
            <CardDescription>Use our AI-powered search to find the most convenient donation center near you.</CardDescription>
          </CardHeader>
          <CardContent>
            <FacilityFinder onFacilitySelect={handleFacilitySelect} />
          </CardContent>
        </Card>
      )}

      {step === 2 && selectedFacility && (
        <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
                <Card className="shadow-lg">
                    <CardHeader>
                        <CardTitle className="font-headline">2. Select a Date</CardTitle>
                        <CardDescription>You are booking at: <span className="font-semibold text-primary">{selectedFacility.name}</span></CardDescription>
                    </CardHeader>
                    <CardContent className="flex justify-center">
                    <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        className="rounded-md border"
                    />
                    </CardContent>
                </Card>
            </div>
            <div className="lg:col-span-1">
                <Card className="shadow-lg">
                    <CardHeader>
                        <CardTitle className="font-headline">3. Confirm Details</CardTitle>
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
                        <Button size="lg" className="w-full text-lg">Confirm Booking</Button>
                    </CardContent>
                </Card>
            </div>
        </div>
      )}

      {step === 1 && (
        <div className="flex justify-end">
            <Button size="lg" onClick={goToNextStep} disabled={!selectedFacility}>
                Select Date <ArrowRight className="ml-2" />
            </Button>
        </div>
      )}
    </div>
  );
}
