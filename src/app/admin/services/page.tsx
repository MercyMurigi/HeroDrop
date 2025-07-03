import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MoreHorizontal, PlusCircle } from "lucide-react";

const services = [
    { name: "Free BP Check", cost: "60 DT", hospital: "Mama Lucy, Kenyatta", status: "Active", slots: "Unlimited" },
    { name: "Annual Health Screening Camp", cost: "Free", hospital: "All Partners", status: "Upcoming", slots: "500" },
    { name: "Women's Wellness Check", cost: "150 DT", hospital: "Aga Khan Hospital", status: "Active", slots: "150/200" },
    { name: "Men's Health Talk", cost: "Free", hospital: "Online", status: "Paused", slots: "N/A" },
    { name: "Lab Test Discount Week", cost: "80 DT", hospital: "All Partners", status: "Active", slots: "Unlimited" },
];

export default function ServicesPage() {

    const getStatusVariant = (status: string) => {
        switch (status) {
            case "Active": return "default";
            case "Upcoming": return "secondary";
            case "Paused": return "destructive";
            default: return "outline";
        }
    }

  return (
    <div className="flex-1 space-y-8 p-4 md:p-8">
      <div className="flex items-center justify-between space-y-2">
        <div>
            <h2 className="text-3xl font-bold tracking-tight font-headline">Service Catalog Management</h2>
            <p className="text-muted-foreground">Define services, campaigns, and offers redeemable with DamuTokens.</p>
        </div>
        <Button>
            <PlusCircle className="mr-2" />
            Add New Service
        </Button>
      </div>

       <Card className="shadow-lg">
        <CardHeader>
            <CardTitle>All Services & Campaigns</CardTitle>
            <CardDescription>A list of all services donors can redeem.</CardDescription>
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Service/Campaign</TableHead>
                        <TableHead>Token Cost</TableHead>
                        <TableHead>Hospital(s)</TableHead>
                        <TableHead>Available Slots</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>
                        <span className="sr-only">Actions</span>
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {services.map((service) => (
                        <TableRow key={service.name}>
                            <TableCell className="font-medium">{service.name}</TableCell>
                            <TableCell>{service.cost}</TableCell>
                            <TableCell>{service.hospital}</TableCell>
                            <TableCell>{service.slots}</TableCell>
                            <TableCell>
                                <Badge variant={getStatusVariant(service.status)}>{service.status}</Badge>
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
                                    <DropdownMenuItem>Edit</DropdownMenuItem>
                                    <DropdownMenuItem>Pause</DropdownMenuItem>
                                    <DropdownMenuItem>Delete</DropdownMenuItem>
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
