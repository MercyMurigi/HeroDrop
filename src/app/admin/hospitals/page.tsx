import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MoreHorizontal, PlusCircle } from "lucide-react";

const hospitals = [
  { name: "Kenyatta National Hospital", county: "Nairobi", bloodTypeNeeded: "O-", urgency: "High" },
  { name: "Moi Teaching & Referral", county: "Uasin Gishu", bloodTypeNeeded: "All Types", urgency: "Medium" },
  { name: "Aga Khan University Hospital", county: "Nairobi", bloodTypeNeeded: "A+, B+", urgency: "Low" },
  { name: "Coast General Hospital", county: "Mombasa", bloodTypeNeeded: "O+", urgency: "High" },
  { name: "Jaramogi Oginga Odinga T&R", county: "Kisumu", bloodTypeNeeded: "B-", urgency: "Medium" },
];

export default function HospitalsPage() {
    const getUrgencyVariant = (urgency: string) => {
        switch (urgency) {
            case "High": return "destructive";
            case "Medium": return "secondary";
            case "Low": return "outline";
            default: return "default";
        }
    }

  return (
    <div className="flex-1 space-y-8 p-4 md:p-8">
      <div className="flex items-center justify-between space-y-2">
        <div>
            <h2 className="text-3xl font-bold tracking-tight font-headline">Hospital & Partner Management</h2>
            <p className="text-muted-foreground">Manage partner facilities and view their current blood supply needs.</p>
        </div>
        <Button>
            <PlusCircle className="mr-2" />
            Add New Hospital
        </Button>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
            <CardTitle>Partner Facilities</CardTitle>
            <CardDescription>A list of all hospitals and clinics on the HeroDrop+ platform.</CardDescription>
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Facility Name</TableHead>
                        <TableHead>County</TableHead>
                        <TableHead>Blood Type Needed</TableHead>
                        <TableHead>Urgency</TableHead>
                        <TableHead>
                        <span className="sr-only">Actions</span>
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {hospitals.map((hospital) => (
                        <TableRow key={hospital.name}>
                            <TableCell className="font-medium">{hospital.name}</TableCell>
                            <TableCell>{hospital.county}</TableCell>
                            <TableCell>{hospital.bloodTypeNeeded}</TableCell>
                            <TableCell>
                                <Badge variant={getUrgencyVariant(hospital.urgency)}>{hospital.urgency}</Badge>
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
                                    <DropdownMenuItem>Edit Details</DropdownMenuItem>
                                    <DropdownMenuItem>View Staff</DropdownMenuItem>
                                    <DropdownMenuItem>Pause Partnership</DropdownMenuItem>
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
