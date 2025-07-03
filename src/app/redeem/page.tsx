'use client';

import { useState, useReducer, useEffect, useMemo, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Coins, HeartPulse, ShieldCheck, Stethoscope, ClipboardCheck, Loader2, ArrowRight, Ticket, Clock, Info, Package, Gift, Pill, Smile, ShoppingBag, MapPin, Tag, Send } from 'lucide-react';
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
  { title: 'General Checkup', cost: 60, icon: Stethoscope, description: "A comprehensive health checkup with a general practitioner.", image: "https://images.unsplash.com/photo-1684607633251-8a4a8d94ddd2?q=80&w=1031&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", hint: "doctor checkup", category: 'service', redemptionValue: "1 Session" },
  { title: 'Free Lab Test', cost: 100, icon: HeartPulse, description: "Includes tests for malaria, hemoglobin levels, and more.", image: "https://images.unsplash.com/photo-1742436707388-2b6727520d5f?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", hint: "lab test", category: 'service', redemptionValue: "1 Test Panel" },
  { title: 'Mental Health Session', cost: 80, icon: Smile, description: "A private session with a certified mental health professional.", image: "https://plus.unsplash.com/premium_photo-1664378617213-55fc3392600d?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", hint: "counseling session", category: 'service', redemptionValue: "1 Session" },
  { title: 'Queue Priority (Fast-Pass)', cost: 30, icon: ShieldCheck, description: "Skip the line and get priority access at partner facilities.", image: "https://images.unsplash.com/photo-1655702002492-e0e0e5622789?q=80&w=871&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", hint: "hospital queue", category: 'service', redemptionValue: "1 Use Pass" },
  { title: "Women's Health Screening", cost: 150, icon: ClipboardCheck, description: "Includes essential screenings like pap smear and breast exam.", image: "https://images.unsplash.com/photo-1536064479547-7ee40b74b807?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", hint: "woman health", category: 'service', redemptionValue: "1 Screening" },
];

const marketplaceItems: RedeemableItem[] = [
  { title: 'Sanitary Pads', cost: 50, icon: Package, description: "A pack of high-quality sanitary pads from our partner brands.", image: "https://plus.unsplash.com/premium_photo-1664375262056-a8503d4d073c?q=80&w=388&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", hint: "sanitary product", category: 'product', redemptionValue: "1 Standard Pack" },
  { title: 'Wellness Kit', cost: 120, icon: Gift, description: "A curated wellness kit with essential vitamins and health products.", image: "https://images.unsplash.com/photo-1625154253125-5d89afab6c7c?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", hint: "wellness kit", category: 'product', redemptionValue: "1 Kit" },
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

// A single state object to manage the entire dialog flow atomically
type DialogState = {
  isDialogOpen: boolean;
  step: 'selectLocation' | 'confirmRedemption';
  status: 'idle' | 'processing' | 'success' | 'error';
  selectedItem: RedeemableItem | null;
  selectedLocation: Facility | Vendor | null;
  redemptionDetails: RedemptionDetails | null;
};

type DialogAction =
  | { type: 'OPEN_DIALOG'; payload: RedeemableItem }
  | { type: 'CLOSE_DIALOG' }
  | { type: 'SELECT_LOCATION'; payload: Facility | Vendor | null }
  | { type: 'START_CONFIRMATION_PROCESS' }
  | { type: 'CONFIRMATION_SUCCESS'; payload: { details: RedemptionDetails; location: Facility | Vendor } }
  | { type: 'CONFIRMATION_FAIL' }
  | { type: 'FINISH_REDEMPTION' };


const initialState: DialogState = {
  isDialogOpen: false,
  step: 'selectLocation',
  status: 'idle',
  selectedItem: null,
  selectedLocation: null,
  redemptionDetails: null,
};

function dialogReducer(state: DialogState, action: DialogAction): DialogState {
  switch (action.type) {
    case 'OPEN_DIALOG':
      return {
        ...initialState,
        isDialogOpen: true,
        step: 'selectLocation',
        selectedItem: action.payload,
      };
    case 'CLOSE_DIALOG':
      return initialState;
    case 'SELECT_LOCATION':
      return { ...state, selectedLocation: action.payload };
    case 'START_CONFIRMATION_PROCESS':
      return { ...state, status: 'processing' };
    case 'CONFIRMATION_SUCCESS':
      return {
        ...state,
        status: 'success',
        step: 'confirmRedemption',
        redemptionDetails: action.payload.details,
        selectedLocation: action.payload.location,
      };
    case 'CONFIRMATION_FAIL':
      return { ...state, status: 'idle' }; // Reset status to allow retry
    case 'FINISH_REDEMPTION':
      return { ...state, status: 'processing' };
    default:
      return state;
  }
}

export default function RedeemPage() {
  const { toast } = useToast();
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [state, dispatch] = useReducer(dialogReducer, initialState);

  useEffect(() => {
    const storedTransactions = localStorage.getItem('transactions');
    if (storedTransactions) {
      setTransactions(JSON.parse(storedTransactions));
    }
    setIsPageLoading(false);
  }, []);

  const totalBalance = useMemo(() => {
    return transactions.reduce((acc, tx) => acc + tx.amount, 0);
  }, [transactions]);
  
  const handleDialogClose = (open: boolean) => {
    if (!open) {
      dispatch({ type: 'CLOSE_DIALOG' });
    }
  };

  const handleRedeemClick = (item: RedeemableItem) => {
    if (totalBalance < item.cost) {
      toast({
        variant: 'destructive',
        title: 'Insufficient Balance',
        description: `You need ${item.cost} DamuTokens to redeem this item.`,
      });
      return;
    }
    dispatch({ type: 'OPEN_DIALOG', payload: item });
  };
  
  const handleLocationSelect = (location: Facility | Vendor | null) => {
    dispatch({ type: 'SELECT_LOCATION', payload: location });
  }

  const handleProceedToConfirmation = async () => {
    if (!state.selectedItem || !state.selectedLocation) return;
    dispatch({ type: 'START_CONFIRMATION_PROCESS' });
  
    try {
      const code = `${state.selectedItem.title.substring(0, 4).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
      let suggestedTime = 'Check opening hours';
      let reasoning = 'Please confirm operating hours with the location directly.';
  
      if (state.selectedItem.category === 'service') {
        try {
          const result = await suggestRedemptionTime({
            facilityName: state.selectedLocation.name,
            serviceName: state.selectedItem.title,
          });
          suggestedTime = result.suggestedTime;
          reasoning = result.reasoning;
        } catch (aiError) {
          console.error('AI suggestion failed, using default.', aiError);
        }
      }
  
      dispatch({
        type: 'CONFIRMATION_SUCCESS',
        payload: {
          details: { code, suggestedTime, reasoning },
          location: state.selectedLocation,
        },
      });
    } catch (error) {
      console.error("Failed to generate redemption details:", error);
      toast({ variant: 'destructive', title: 'An Error Occurred', description: 'Could not prepare your redemption details. Please try again.' });
      dispatch({ type: 'CONFIRMATION_FAIL' });
    }
  };
  
  const handleConfirmRedemption = async () => {
    if (!state.selectedItem || !state.selectedLocation || !state.redemptionDetails) return;
    dispatch({ type: 'FINISH_REDEMPTION' });
    try {
      const userName = 'Jane Donor';
      
      await generateSmsNotification({
        notificationType: 'redemption',
        userName: userName,
        tokenBalance: totalBalance - state.selectedItem.cost,
        serviceRedeemed: state.selectedItem.title,
        redemptionCode: state.redemptionDetails.code,
        suggestedTime: state.redemptionDetails.suggestedTime || "N/A",
      });

      const newTransaction: Transaction = {
        date: new Date().toLocaleDateString('en-CA'),
        description: `Redeemed: ${state.selectedItem.title}`,
        amount: -state.selectedItem.cost,
        type: 'debit',
      };
      const updatedTransactions = [newTransaction, ...transactions];
      setTransactions(updatedTransactions);
      localStorage.setItem('transactions', JSON.stringify(updatedTransactions));

      toast({
        title: 'Redemption Successful!',
        description: `Your code is ${state.redemptionDetails.code}. Details sent via SMS.`,
        duration: 9000,
      });
      dispatch({ type: 'CLOSE_DIALOG' });
    } catch (error) {
      console.error('Redemption failed:', error);
      toast({ variant: 'destructive', title: 'Redemption Failed', description: 'Could not process your redemption. Please try again.' });
      dispatch({ type: 'CONFIRMATION_FAIL' });
    }
  };
  
  const renderDialogContent = () => {
    if (!state.selectedItem) return null;
    const selectedItem = state.selectedItem;
    const selectedLocation = state.selectedLocation;

    if (state.step === 'selectLocation') {
      return (
        <>
          <DialogHeader className="flex-shrink-0">
            <DialogTitle className="font-headline text-2xl">Redeem: {selectedItem.title}</DialogTitle>
            <DialogDescription>
              Step 1: Select a location to redeem this {selectedItem.category}.
            </DialogDescription>
          </DialogHeader>
          <div className="flex-grow py-4 overflow-y-auto -mr-6 pr-6">
            {selectedItem.category === 'service' ? (
                <FacilityFinder onFacilitySelect={handleLocationSelect} selectedFacility={selectedLocation as Facility | null} />
            ) : (
                <PartnerVendorFinder onVendorSelect={handleLocationSelect} selectedVendor={selectedLocation as Vendor | null} />
            )}
          </div>
          <DialogFooter className="flex-shrink-0 border-t pt-4">
             <DialogClose asChild><Button type="button" variant="secondary">Cancel</Button></DialogClose>
            <Button onClick={handleProceedToConfirmation} disabled={!selectedLocation || state.status === 'processing'}>
              {state.status === 'processing' ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...</>) : (<>Next <ArrowRight className="ml-2 h-4 w-4" /></>)}
            </Button>
          </DialogFooter>
        </>
      );
    }

    if (state.step === 'confirmRedemption' && state.redemptionDetails && selectedLocation) {
        return (
             <>
              <DialogHeader>
                <DialogTitle className="font-headline text-2xl">Confirm Redemption</DialogTitle>
                <DialogDescription>
                  Step 2: Here is your code. Show this at the facility/store to redeem.
                </DialogDescription>
              </DialogHeader>
               <div className="flex-grow py-4 space-y-4 overflow-y-auto -mr-6 pr-6">
                <div className="bg-primary/5 border-2 border-dashed border-primary/20 rounded-lg p-6 text-center">
                  <p className="text-sm font-medium text-muted-foreground">Your Redemption Code</p>
                  <div className="flex items-center justify-center gap-3 mt-2">
                    <Ticket className="h-8 w-8 text-primary" />
                    <p className="text-4xl font-bold tracking-widest text-primary">{state.redemptionDetails.code}</p>
                  </div>
                </div>

                <div className="rounded-lg border p-4 flex items-center gap-4">
                  <div className="bg-primary/10 p-3 rounded-lg"><Tag className="h-6 w-6 text-primary" /></div>
                  <div>
                    <p className="font-semibold text-muted-foreground">You Will Receive</p>
                    <p className="text-lg font-bold">{selectedItem.redemptionValue}</p>
                    <p className="text-sm text-muted-foreground">{selectedItem.title}</p>
                  </div>
                </div>

                <div className="rounded-lg border p-4 space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">Redemption Location</p>
                  <p className="font-semibold">{selectedLocation.name}</p>
                  <div className="flex items-center text-sm text-muted-foreground"><MapPin className="h-4 w-4 mr-1.5 flex-shrink-0" /><span>{selectedLocation.address}</span></div>
                </div>

                <div className="rounded-lg border p-4">
                  <div className="flex items-center gap-3">
                    <Clock className="h-6 w-6 text-primary" />
                    <div>
                      <p className="font-semibold text-primary">Suggested Visit Time</p>
                       <div className="text-lg font-bold">{state.redemptionDetails.suggestedTime}</div>
                    </div>
                  </div>
                  {(state.redemptionDetails.reasoning) && (
                    <div className="flex items-start gap-3 mt-2 text-sm text-muted-foreground">
                        <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
                        <div>{state.redemptionDetails.reasoning}</div>
                    </div>
                  )}
                </div>
              </div>
              <DialogFooter className="flex-shrink-0 border-t pt-4">
                <Button type="button" variant="secondary" onClick={() => dispatch({ type: 'OPEN_DIALOG', payload: selectedItem })}>Back</Button>
                <Button onClick={handleConfirmRedemption} disabled={state.status === 'processing'}>
                  {state.status === 'processing' ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending...</>) : (<><Send className="mr-2 h-4 w-4" /> Send Voucher & Complete</>)}
                </Button>
              </DialogFooter>
            </>
        )
    }

    return null;
  }
  
  const renderItemCard = (item: RedeemableItem, isItemLoading: boolean) => (
      <Card key={item.title} className="flex flex-col overflow-hidden group hover:shadow-xl">
          <div className="relative h-48 w-full">
            {isItemLoading ? <Skeleton className="h-full w-full" /> : <Image src={item.image} alt={item.title} fill objectFit="cover" className="transition-transform duration-300 group-hover:scale-105" data-ai-hint={item.hint} />}
          </div>
          <CardHeader className="flex-grow">
            {isItemLoading ? (
                <div className="space-y-2"><Skeleton className="h-6 w-3/4" /><Skeleton className="h-4 w-full" /><Skeleton className="h-4 w-1/2" /></div>
            ) : (
                <>
                <div className="flex justify-between items-start">
                    <CardTitle className="font-headline text-xl">{item.title}</CardTitle>
                    <div className="bg-primary/10 p-3 rounded-lg -mt-2"><item.icon className="h-6 w-6 text-primary" /></div>
                </div>
                <CardDescription>{item.description}</CardDescription>
                </>
            )}
          </CardHeader>
          <CardContent className="mt-auto pt-4 border-t">
            <div className="flex justify-between items-center">
                {isItemLoading ? (
                    <><Skeleton className="h-8 w-24" /><Skeleton className="h-10 w-28" /></>
                ) : (
                    <>
                    <div className="flex items-center gap-2"><Coins className="h-6 w-6 text-primary" /><span className="text-2xl font-bold">{item.cost} DT</span></div>
                    <Button onClick={() => handleRedeemClick(item)} disabled={totalBalance < item.cost}>Redeem Now</Button>
                    </>
                )}
            </div>
          </CardContent>
        </Card>
  )

  if (isPageLoading) {
    return (
      <div className="flex-1 space-y-8 p-4 md:p-8">
        <div className="flex items-center justify-between space-y-2">
          <div><Skeleton className="h-8 w-64 rounded-md" /><Skeleton className="h-4 w-96 mt-2 rounded-md" /></div>
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
                <TabsTrigger value="health-services" className="py-3 text-base data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"><Stethoscope className="mr-2" />Health Services</TabsTrigger>
                <TabsTrigger value="marketplace" className="py-3 text-base data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"><ShoppingBag className="mr-2" />Partner Marketplace</TabsTrigger>
            </TabsList>
            <TabsContent value="health-services">
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {healthServices.map(item => renderItemCard(item, isPageLoading))}
                </div>
            </TabsContent>
            <TabsContent value="marketplace">
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {marketplaceItems.map(item => renderItemCard(item, isPageLoading))}
                </div>
            </TabsContent>
        </Tabs>

      </div>

      <Dialog open={state.isDialogOpen} onOpenChange={handleDialogClose}>
        <DialogContent className="sm:max-w-2xl h-[90vh] sm:h-auto sm:max-h-[90vh] flex flex-col">
          {renderDialogContent()}
        </DialogContent>
      </Dialog>
    </>
  );
}
