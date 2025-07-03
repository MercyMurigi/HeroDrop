
'use client';

import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Coins, HeartPulse, ShieldCheck, Stethoscope, ClipboardCheck, Loader2, ArrowRight, Ticket, Clock, Info, Package, Gift, Pill, Smile, ShoppingBag, MapPin, Tag } from 'lucide-react';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FacilityFinder } from '@/components/facility-finder';
import { useToast } from '@/hooks/use-toast';
import { generateSmsNotification } from '@/ai/flows/generate-sms-notification';
import { suggestRedemptionTime } from '@/ai/flows/suggest-redemption-time';
import type { FindFacilitiesOutput } from '@/ai/schemas/facilities';
import { Skeleton } from '@/components/ui/skeleton';
import { PartnerVendorFinder, type Vendor } from '@/components/partner-vendor-finder';

type RedeemableItem = {
  title: string;
  cost: number;
  icon: React.ElementType;
  description: string;
  image: string;
  hint: string;
  category: 'service' | 'product';
  redemptionValue: string;
};

const healthServices: RedeemableItem[] = [
  { title: 'General Checkup', cost: 60, icon: Stethoscope, description: "A comprehensive health checkup with a general practitioner.", image: "https://placehold.co/600x400.png", hint: "doctor checkup", category: 'service', redemptionValue: "1 Session" },
  { title: 'Free Lab Test', cost: 100, icon: HeartPulse, description: "Includes tests for malaria, hemoglobin levels, and more.", image: "https://placehold.co/600x400.png", hint: "lab test", category: 'service', redemptionValue: "1 Test Panel" },
  { title: 'Mental Health Session', cost: 80, icon: Smile, description: "A private session with a certified mental health professional.", image: "https://placehold.co/600x400.png", hint: "counseling session", category: 'service', redemptionValue: "1 Session" },
  { title: 'Queue Priority (Fast-Pass)', cost: 30, icon: ShieldCheck, description: "Skip the line and get priority access at partner facilities.", image: "https://placehold.co/600x400.png", hint: "hospital queue", category: 'service', redemptionValue: "1 Use Pass" },
  { title: "Women's Health Screening", cost: 150, icon: ClipboardCheck, description: "Includes essential screenings like pap smear and breast exam.", image: "https://placehold.co/600x400.png", hint: "health screening", category: 'service', redemptionValue: "1 Screening" },
];

const marketplaceItems: RedeemableItem[] = [
  { title: 'Sanitary Pads', cost: 50, icon: Package, description: "A pack of high-quality sanitary pads from our partner brands.", image: "https://placehold.co/600x400.png", hint: "sanitary pads", category: 'product', redemptionValue: "1 Standard Pack" },
  { title: 'Wellness Kit', cost: 120, icon: Gift, description: "A curated wellness kit with essential vitamins and health products.", image: "https://placehold.co/600x400.png", hint: "wellness kit", category: 'product', redemptionValue: "1 Kit" },
  { title: 'Over-the-Counter Meds', cost: 40, icon: Pill, description: "Redeem for common OTC medications like painkillers or allergy relief.", image: "https://placehold.co/600x400.png", hint: "medication pills", category: 'product', redemptionValue: "Voucher worth KSh 500" },
];

type Transaction = {
  date: string;
  description: string;
  amount: number;
  type: 'credit' | 'debit';
};

type Facility = FindFacilitiesOutput['facilities'][0];

type RedemptionDetails = {
  code: string;
  suggestedTime: string;
  reasoning: string;
};

type RedemptionState = {
    step: 'selectLocation' | 'confirmRedemption';
    details: RedemptionDetails | null;
};


export default function RedeemPage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedItem, setSelectedItem] = useState<RedeemableItem | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<Facility | Vendor | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const [redemption, setRedemption] = useState<RedemptionState>({ step: 'selectLocation', details: null });

  useEffect(() => {
    const storedTransactions = localStorage.getItem('transactions');
    if (storedTransactions) {
      setTransactions(JSON.parse(storedTransactions));
    }
    setIsLoading(false);
  }, []);

  const totalBalance = useMemo(() => {
    return transactions.reduce((acc, tx) => acc + tx.amount, 0);
  }, [transactions]);

  const handleRedeemClick = (item: RedeemableItem) => {
    if (totalBalance < item.cost) {
      toast({
        variant: 'destructive',
        title: 'Insufficient Balance',
        description: `You need ${item.cost} DamuTokens to redeem this item.`,
      });
      return;
    }
    setSelectedItem(item);
    setSelectedLocation(null);
    setRedemption({ step: 'selectLocation', details: null });
    setIsDialogOpen(true);
  };

  const proceedToConfirmation = async () => {
    if (!selectedItem || !selectedLocation) {
        toast({
            variant: 'destructive',
            title: 'Location Not Selected',
            description: 'Please select a facility or store to continue.',
        });
        return;
    }

    setIsGenerating(true);

    try {
        const code = `${selectedItem.title
            .substring(0, 4)
            .toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;

        let suggestedTime = 'Anytime during opening hours';
        let reasoning = 'Please check with the location for their specific operating hours.';

        if (selectedItem.category === 'service' && selectedLocation && 'availability' in selectedLocation) {
            try {
                const result = await suggestRedemptionTime({
                    facilityName: selectedLocation.name,
                    serviceName: selectedItem.title,
                });
                suggestedTime = result.suggestedTime;
                reasoning = result.reasoning;
            } catch (aiError) {
                console.error('AI suggestion failed, using default.', aiError);
            }
        }
        
        setRedemption({
            step: 'confirmRedemption',
            details: { code, suggestedTime, reasoning },
        });

    } catch (error) {
        console.error("Failed to proceed to confirmation:", error);
        toast({
            variant: 'destructive',
            title: 'An Error Occurred',
            description: 'Could not prepare your redemption details. Please try again.',
        });
    } finally {
        setIsGenerating(false);
    }
  };


  const handleConfirmRedemption = async () => {
    if (!selectedItem || !selectedLocation || !redemption.details) return;
    setIsConfirming(true);
    try {
      const userName = 'Jane Donor';
      
      await generateSmsNotification({
        notificationType: 'redemption',
        userName: userName,
        tokenBalance: totalBalance - selectedItem.cost,
        serviceRedeemed: selectedItem.title,
        redemptionCode: redemption.details.code,
        suggestedTime: redemption.details.suggestedTime || "N/A",
      });

      const newTransaction: Transaction = {
        date: new Date().toLocaleDateString('en-CA'),
        description: `Redeemed: ${selectedItem.title}`,
        amount: -selectedItem.cost,
        type: 'debit',
      };
      const updatedTransactions = [newTransaction, ...transactions];
      setTransactions(updatedTransactions);
      localStorage.setItem('transactions', JSON.stringify(updatedTransactions));

      toast({
        title: 'Redemption Successful!',
        description: `Your code is ${redemption.details.code}. Details sent via SMS.`,
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
  
  const renderDialogContent = () => {
    if (!selectedItem) return null;

    if (redemption.step === 'selectLocation') {
      return (
        <>
          <DialogHeader>
            <DialogTitle className="font-headline text-2xl">Redeem: {selectedItem.title}</DialogTitle>
            <DialogDescription>
              Step 1: Select a location to redeem this {selectedItem.category}.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {selectedItem.category === 'service' ? (
                <FacilityFinder onFacilitySelect={(facility) => setSelectedLocation(facility)} selectedFacility={selectedLocation as Facility | null} />
            ) : (
                <PartnerVendorFinder onVendorSelect={(vendor) => setSelectedLocation(vendor)} selectedVendor={selectedLocation as Vendor | null} />
            )}
          </div>
          <DialogFooter>
             <DialogClose asChild>
                <Button type="button" variant="secondary">Cancel</Button>
            </DialogClose>
            <Button onClick={proceedToConfirmation} disabled={!selectedLocation || isGenerating}>
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...
                </>
              ) : (
                <>Next <ArrowRight className="ml-2 h-4 w-4" /></>
              )}
            </Button>
          </DialogFooter>
        </>
      );
    }

    if (redemption.step === 'confirmRedemption' && redemption.details && selectedLocation) {
        const { details } = redemption;
        return (
             <>
              <DialogHeader>
                <DialogTitle className="font-headline text-2xl">Confirm Redemption</DialogTitle>
                <DialogDescription>
                  Step 2: Here is your code. Show this at the facility/store to redeem.
                </DialogDescription>
              </DialogHeader>
               <div className="py-4 space-y-4">
                <div className="bg-primary/5 border-2 border-dashed border-primary/20 rounded-lg p-6 text-center">
                  <p className="text-sm font-medium text-muted-foreground">
                    Your Redemption Code
                  </p>
                  <div className="flex items-center justify-center gap-3 mt-2">
                    <Ticket className="h-8 w-8 text-primary" />
                    <p className="text-4xl font-bold tracking-widest text-primary">
                      {details.code}
                    </p>
                  </div>
                </div>

                <div className="rounded-lg border p-4 flex items-center gap-4">
                  <div className="bg-primary/10 p-3 rounded-lg">
                    <Tag className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-muted-foreground">You Will Receive</p>
                    <p className="text-lg font-bold">{selectedItem.redemptionValue}</p>
                    <p className="text-sm text-muted-foreground">{selectedItem.title}</p>
                  </div>
                </div>

                <div className="rounded-lg border p-4 space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    Redemption Location
                  </p>
                  <p className="font-semibold">{selectedLocation.name}</p>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 mr-1.5 flex-shrink-0" />
                    <span>{selectedLocation.address}</span>
                  </div>
                </div>

                <div className="rounded-lg border p-4">
                  <div className="flex items-center gap-3">
                    <Clock className="h-6 w-6 text-primary" />
                    <div>
                      <p className="font-semibold text-primary">Suggested Visit Time</p>
                      <div className="text-lg font-bold">{details.suggestedTime}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 mt-2 text-sm text-muted-foreground">
                    <Info className="h-4 w-4 mt-1 flex-shrink-0" />
                    <div>{details.reasoning}</div>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="secondary" onClick={() => setRedemption({ step: 'selectLocation', details: null })}>Back</Button>
                <Button onClick={handleConfirmRedemption} disabled={isConfirming}>
                  {isConfirming ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Confirming...
                    </>
                  ) : (
                    `Confirm & Redeem for ${selectedItem.cost} DT`
                  )}
                </Button>
              </DialogFooter>
            </>
        )
    }

    return null;
  }
  
  const renderItemCard = (item: RedeemableItem, isItemLoading: boolean) => (
      <Card key={item.title} className="shadow-lg flex flex-col overflow-hidden group">
          <div className="relative h-48 w-full">
            {isItemLoading ? <Skeleton className="h-full w-full" /> : <Image src={item.image} alt={item.title} layout="fill" objectFit="cover" className="transition-transform duration-300 group-hover:scale-105" data-ai-hint={item.hint} />}
          </div>
          <CardHeader className="flex-grow">
            {isItemLoading ? (
                <div className="space-y-2">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-1/2" />
                </div>
            ) : (
                <>
                <div className="flex justify-between items-start">
                    <CardTitle className="font-headline text-xl">{item.title}</CardTitle>
                    <div className="bg-primary/10 p-3 rounded-lg -mt-2">
                    <item.icon className="h-6 w-6 text-primary" />
                    </div>
                </div>
                <CardDescription>{item.description}</CardDescription>
                </>
            )}
          </CardHeader>
          <CardContent className="mt-auto pt-4 border-t">
            <div className="flex justify-between items-center">
                {isItemLoading ? (
                    <>
                        <Skeleton className="h-8 w-24" />
                        <Skeleton className="h-10 w-28" />
                    </>
                ) : (
                    <>
                    <div className="flex items-center gap-2">
                        <Coins className="h-6 w-6 text-primary" />
                        <span className="text-2xl font-bold">{item.cost} DT</span>
                    </div>
                    <Button onClick={() => handleRedeemClick(item)} disabled={totalBalance < item.cost}>
                        Redeem Now
                    </Button>
                    </>
                )}
            </div>
          </CardContent>
        </Card>
  )

  if (isLoading) {
    return (
      <div className="flex-1 space-y-8 p-4 md:p-8">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <Skeleton className="h-8 w-64 rounded-md" />
            <Skeleton className="h-4 w-96 mt-2 rounded-md" />
          </div>
          <Skeleton className="h-10 w-32 rounded-full" />
        </div>
        <Tabs defaultValue="health-services" className="space-y-4">
            <Skeleton className="h-16 w-full rounded-md" />
            <TabsContent value="health-services">
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {[...healthServices, ...marketplaceItems].map((item, i) => renderItemCard(item, true))}
                </div>
            </TabsContent>
        </Tabs>
      </div>
    );
  }

  return (
    <>
      <div className="flex-1 space-y-8 p-4 md:p-8">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-3xl font-bold tracking-tight font-headline">Redemption Store</h2>
            <p className="text-muted-foreground">Use your DamuTokens to redeem valuable health services and products from our partners.</p>
          </div>
          <div className="flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-primary font-semibold">
              <Coins className="h-6 w-6" />
              <span>{totalBalance} DT</span>
          </div>
        </div>
        
        <Tabs defaultValue="health-services" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2 h-auto">
                <TabsTrigger value="health-services" className="py-3 text-base data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                    <Stethoscope className="mr-2" />
                    Health Services
                </TabsTrigger>
                <TabsTrigger value="marketplace" className="py-3 text-base data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                    <ShoppingBag className="mr-2" />
                    Partner Marketplace
                </TabsTrigger>
            </TabsList>
            <TabsContent value="health-services">
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {healthServices.map(item => renderItemCard(item, isLoading))}
                </div>
            </TabsContent>
            <TabsContent value="marketplace">
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {marketplaceItems.map(item => renderItemCard(item, isLoading))}
                </div>
            </TabsContent>
        </Tabs>

      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-2xl">
          {renderDialogContent()}
        </DialogContent>
      </Dialog>
    </>
  );
}
