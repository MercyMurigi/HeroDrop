'use client';

import { useState } from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MoreHorizontal, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import { generateSmsNotification } from '@/ai/flows/generate-sms-notification';
import { generateNextOfKinSms } from '@/ai/flows/generate-next-of-kin-sms';

const initialPledges = [
  { donorName: "Mercy Wairimu", nextOfKinName: "Samuel Wairimu", phone: "+254712345678", nextOfKinPhone: "+254711111111", bloodType: "O+", pledgeDate: "2025-07-06", facility: "Mama Lucy Hospital", status: "Scheduled", currentTokens: 10 },
  { donorName: "John Omondi", nextOfKinName: "Mary Omondi", phone: "+254723456789", nextOfKinPhone: "+254722222222", bloodType: "A-", pledgeDate: "2025-07-05", facility: "Kenyatta National Hospital", status: "Completed", currentTokens: 110 },
  { donorName: "Fatuma Ali", nextOfKinName: "Hassan Ali", phone: "+254734567890", nextOfKinPhone: "+254733333333", bloodType: "B+", pledgeDate: "2025-07-04", facility: "Aga Khan Hospital", status: "Scheduled", currentTokens: 10 },
  { donorName: "David Kimani", nextOfKinName: "Susan Kimani", phone: "+254745678901", nextOfKinPhone: "+254744444444", bloodType: "AB+", pledgeDate: "2025-07-03", facility: "Nairobi Hospital", status: "Cancelled", currentTokens: 0 },
  { donorName: "Grace Nabwire", nextOfKinName: "Peter Nabwire", phone: "+254756789012", nextOfKinPhone: "+254755555555", bloodType: "O-", pledgeDate: "2025-07-02", facility: "M.P. Shah Hospital", status: "Completed", currentTokens: 140 },
];

type PledgeStatus = "Scheduled" | "Completed" | "Cancelled";
type Pledge = (typeof initialPledges)[0];


export default function PledgesPage() {
  const [pledges, setPledges] = useState(initialPledges);
  const [isUpdating, setIsUpdating] = useState<string | null>(null);
  const { toast } = useToast();

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "Completed":
        return "default";
      case "Scheduled":
        return "secondary";
      case "Cancelled":
        return "destructive";
      default:
        return "outline";
    }
  };

  const handleUpdateStatus = async (phone: string, status: PledgeStatus) => {
    setIsUpdating(phone);

    const originalPledges = pledges;
    const pledge = pledges.find(p => p.phone === phone);
    if (!pledge) {
        setIsUpdating(null);
        return;
    }

    // Optimistically update the UI
    setPledges(pledges.map(p => p.phone === phone ? { ...p, status } : p));
    
    if (status === 'Completed') {
      try {
        const donorSmsPromise = generateSmsNotification({
            notificationType: 'rewards',
            userName: pledge.donorName,
            phone: pledge.phone,
            tokenBalance: pledge.currentTokens + 100, // Simulate earning 100 tokens
        });

        const nextOfKinSmsPromise = generateNextOfKinSms({
            donorName: pledge.donorName,
            nextOfKinName: pledge.nextOfKinName,
            nextOfKinPhone: pledge.nextOfKinPhone,
            hospitalName: pledge.facility,
        });

        await Promise.all([donorSmsPromise, nextOfKinSmsPromise]);
        
        toast({
            title: "Donation Confirmed!",
            description: "Pledge status updated, 100 DamuTokens awarded, and SMS notifications sent.",
        });

      } catch (error) {
         console.error("Failed to send notification:", error);
         // Revert optimistic update on failure
         setPledges(originalPledges);
         toast({
            variant: "destructive",
            title: "Action Failed",
            description: "Could not send SMS notifications. Pledge status was not updated.",
        });
      }

    } else if (status === 'Cancelled') {
      toast({
        title: "Pledge Cancelled",
        description: "The pledge has been cancelled. 10 DamuTokens will be deducted from the donor.",
        variant: 'destructive'
      });
    }
    
    setIsUpdating(null);
  };

  return (
    <div className="flex-1 space-y-8 p-4 md:p-8">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight font-headline">Donation Pledges</h2>
          <p className="text-muted-foreground">View, confirm, and manage blood donation pledges.</p>
        </div>
        <Button>Bulk Update</Button>
      </div>

      <Card className="hover:shadow-xl">
        <CardHeader>
          <CardTitle>All Pledges</CardTitle>
          <CardDescription>A list of all recent donation pledges from users.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Donor Name</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Blood Type</TableHead>
                <TableHead>Facility</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pledges.map((pledge: Pledge) => (
                <TableRow key={pledge.phone}>
                  <TableCell className="font-medium">{pledge.donorName}</TableCell>
                  <TableCell>{pledge.phone}</TableCell>
                  <TableCell>{pledge.bloodType}</TableCell>
                  <TableCell>{pledge.facility}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(pledge.status)}>{pledge.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button aria-haspopup="true" size="icon" variant="ghost" disabled={!!isUpdating}>
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Toggle menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handleUpdateStatus(pledge.phone, 'Completed')} disabled={pledge.status === 'Completed' || !!isUpdating}>
                           {isUpdating === pledge.phone ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle className="mr-2 h-4 w-4" />}
                          Mark as Completed
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleUpdateStatus(pledge.phone, 'Cancelled')} 
                          disabled={pledge.status !== 'Scheduled' || !!isUpdating} 
                          className="text-destructive focus:text-destructive"
                        >
                          {isUpdating === pledge.phone ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <XCircle className="mr-2 h-4 w-4" />}
                          Cancel Pledge
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
