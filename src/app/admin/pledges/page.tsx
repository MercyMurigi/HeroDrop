'use client';

import { useState } from 'react';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MoreHorizontal, CheckCircle, XCircle } from "lucide-react";
import { useToast } from '@/hooks/use-toast';

const initialPledges = [
  { donorName: "Mercy Wairimu", phone: "+254712345678", bloodType: "O+", pledgeDate: "2025-07-06", facility: "Mama Lucy Hospital", status: "Scheduled" },
  { donorName: "John Omondi", phone: "+254723456789", bloodType: "A-", pledgeDate: "2025-07-05", facility: "Kenyatta National Hospital", status: "Completed" },
  { donorName: "Fatuma Ali", phone: "+254734567890", bloodType: "B+", pledgeDate: "2025-07-04", facility: "Aga Khan Hospital", status: "Scheduled" },
  { donorName: "David Kimani", phone: "+254745678901", bloodType: "AB+", pledgeDate: "2025-07-03", facility: "Nairobi Hospital", status: "Cancelled" },
  { donorName: "Grace Nabwire", phone: "+254756789012", bloodType: "O-", pledgeDate: "2025-07-02", facility: "M.P. Shah Hospital", status: "Completed" },
];

type PledgeStatus = "Scheduled" | "Completed" | "Cancelled";

export default function PledgesPage() {
  const [pledges, setPledges] = useState(initialPledges);
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

  const handleUpdateStatus = (phone: string, status: PledgeStatus) => {
    setPledges(pledges.map(p => p.phone === phone ? { ...p, status } : p));
    if (status === 'Completed') {
      toast({
        title: "Donation Confirmed!",
        description: "The pledge status is updated and 100 DamuTokens have been awarded to the donor.",
      });
    } else if (status === 'Cancelled') {
      toast({
        title: "Pledge Cancelled",
        description: "The pledge has been cancelled. 10 DamuTokens will be deducted from the donor.",
        variant: 'destructive'
      });
    }
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

      <Card className="shadow-lg">
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
              {pledges.map((pledge) => (
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
                        <Button aria-haspopup="true" size="icon" variant="ghost">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Toggle menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handleUpdateStatus(pledge.phone, 'Completed')} disabled={pledge.status === 'Completed'}>
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Mark as Completed
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleUpdateStatus(pledge.phone, 'Cancelled')} 
                          disabled={pledge.status !== 'Scheduled'} 
                          className="text-destructive focus:text-destructive"
                        >
                          <XCircle className="mr-2 h-4 w-4" />
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
