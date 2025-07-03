'use client';

import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Coins, HeartPulse, ShieldCheck, Users, Stethoscope, ClipboardCheck, Loader2 } from 'lucide-react';
import Image from 'next/image';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { FacilityFinder } from '@/components/facility-finder';
import { useToast } from '@/hooks/use-toast';
import { generateSmsNotification } from '@/ai/flows/generate-sms-notification';
import type { FindFacilitiesOutput } from '@/ai/schemas/facilities';

const services = [
  { title: 'General Checkup', cost: 60, icon: Stethoscope, description: "A comprehensive health checkup with a general practitioner.", image: "https://placehold.co/600x400.png", hint: "doctor checkup" },
  { title: 'Free Lab Test', cost: 100, icon: HeartPulse, description: "Includes tests for malaria, hemoglobin levels, and more.", image: "https://placehold.co/600x400.png", hint: "lab test" },
  { title: 'Counseling Session', cost: 80, icon: Users, description: "A private session with a certified mental health counselor.", image: "https://placehold.co/600x400.png", hint: "counseling session" },
  { title: 'Queue Priority (Fast-Pass)', cost: 30, icon: ShieldCheck, description: "Skip the line and get priority access at partner facilities.", image: "https://placehold.co/600x400.png", hint: "hospital queue" },
  { title: "Women's Health Screening", cost: 150, icon: ClipboardCheck, description: "Includes essential screenings like pap smear and breast exam.", image: "https://placehold.co/600x400.png", hint: "health screening" },
];

type Transaction = {
  date: string;
  description: string;
  amount: number;
  type: 'credit' | 'debit';
};
type Service = typeof services[0];
type Facility = FindFacilitiesOutput['facilities'][0];

export default function RedeemPage() {
  const { toast } = useToast();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);

  useEffect(() => {
    const storedTransactions = localStorage.getItem('transactions');
    if (storedTransactions) {
      setTransactions(JSON.parse(storedTransactions));
    }
  }, []);

  const totalBalance = useMemo(() => {
    return transactions.reduce((acc, tx) => acc + tx.amount, 0);
  }, [transactions]);

  const handleRedeemClick = (service: Service) => {
    if (totalBalance < service.cost) {
      toast({
        variant: 'destructive',
        title: 'Insufficient Balance',
        description: `You need ${service.cost} DamuTokens to redeem this service.`,
      });
      return;
    }
    setSelectedService(service);
    setSelectedFacility(null); // Reset facility on new dialog open
    setIsDialogOpen(true);
  };

  const handleConfirmRedemption = async () => {
    if (!selectedService || !selectedFacility) return;

    setIsConfirming(true);

    const redemptionCode = `${selectedService.title.substring(0, 4).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;

    try {
      // In a real app, we'd get user details from a session
      const userName = 'Jane Donor';
      
      await generateSmsNotification({
        notificationType: 'redemption',
        userName: userName,
        tokenBalance: totalBalance - selectedService.cost,
        serviceRedeemed: selectedService.title,
        redemptionCode: redemptionCode,
      });

      const newTransaction: Transaction = {
        date: new Date().toLocaleDateString('en-CA'),
        description: `Redeemed: ${selectedService.title}`,
        amount: -selectedService.cost,
        type: 'debit',
      };

      const updatedTransactions = [newTransaction, ...transactions];
      setTransactions(updatedTransactions);
      localStorage.setItem('transactions', JSON.stringify(updatedTransactions));

      toast({
        title: 'Redemption Successful!',
        description: `Your code is ${redemptionCode}. It has also been sent via SMS.`,
        duration: 9000,
      });

      setIsDialogOpen(false);
    } catch (error) {
      console.error('Redemption failed:', error);
      toast({
        variant: 'destructive',
        title: 'Redemption Failed',
        description: 'Could not process your redemption. Please try again.',
      });
    } finally {
      setIsConfirming(false);
    }
  };

  return (
    <>
      <div className="flex-1 space-y-8 p-4 md:p-8">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-3xl font-bold tracking-tight font-headline">Redemption Store</h2>
            <p className="text-muted-foreground">Use your DamuTokens to redeem valuable health services.</p>
          </div>
          <div className="flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-primary font-semibold">
              <Coins className="h-6 w-6" />
              <span>{totalBalance} DT</span>
          </div>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <Card key={service.title} className="shadow-lg flex flex-col overflow-hidden group">
              <div className="relative h-48 w-full">
                <Image src={service.image} alt={service.title} layout="fill" objectFit="cover" className="transition-transform duration-300 group-hover:scale-105" data-ai-hint={service.hint} />
              </div>
              <CardHeader className="flex-grow">
                  <div className="flex justify-between items-start">
                    <CardTitle className="font-headline text-xl">{service.title}</CardTitle>
                    <div className="bg-primary/10 p-3 rounded-lg -mt-2">
                      <service.icon className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                  <CardDescription>{service.description}</CardDescription>
              </CardHeader>
              <CardContent className="mt-auto pt-4 border-t">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Coins className="h-6 w-6 text-primary" />
                    <span className="text-2xl font-bold">{service.cost} DT</span>
                  </div>
                  <Button onClick={() => handleRedeemClick(service)} disabled={totalBalance < service.cost}>
                    Redeem Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-2xl">
          {selectedService && (
            <>
              <DialogHeader>
                <DialogTitle className="font-headline text-2xl">Redeem: {selectedService.title}</DialogTitle>
                <DialogDescription>
                  Select a facility to redeem this service at. A code will be generated for you to present at the hospital.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                 <FacilityFinder onFacilitySelect={setSelectedFacility} />
              </div>
              <DialogFooter>
                 <DialogClose asChild>
                    <Button type="button" variant="secondary">
                        Cancel
                    </Button>
                </DialogClose>
                <Button onClick={handleConfirmRedemption} disabled={!selectedFacility || isConfirming}>
                  {isConfirming ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Confirming...
                    </>
                  ) : (
                    `Confirm for ${selectedService.cost} DT`
                  )}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
