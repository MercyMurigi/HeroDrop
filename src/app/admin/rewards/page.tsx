import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MoreHorizontal, PlusCircle, Search } from "lucide-react";

const redemptions = [
    { user: 'Kevin Otieno', tokenBalance: '160 DT', redemption: 'Lab Test', redemptionCode: 'LABX-374', status: 'Pending' },
    { user: 'Aisha Juma', tokenBalance: '30 DT', redemption: 'General Checkup', redemptionCode: 'CHK-912', status: 'Fulfilled' },
    { user: 'Samuel Karanja', tokenBalance: '250 DT', redemption: 'Counseling Session', redemptionCode: 'CNSL-558', status: 'Pending' },
    { user: 'Brenda Mwangi', tokenBalance: '85 DT', redemption: 'Queue Priority', redemptionCode: 'FAST-201', status: 'Rejected' },
    { user: 'David Wekesa', tokenBalance: '110 DT', redemption: 'Lab Test', redemptionCode: 'LABX-419', status: 'Fulfilled' },
];

export default function RewardsPage() {

    const getStatusVariant = (status: string) => {
        switch (status) {
            case "Fulfilled": return "default";
            case "Pending": return "secondary";
            case "Rejected": return "destructive";
            default: return "outline";
        }
    }

  return (
    <div className="flex-1 space-y-8 p-4 md:p-8">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight font-headline">Token & Rewards Management</h2>
          <p className="text-muted-foreground">Track tokens, manage redemptions, and adjust balances.</p>
        </div>
        <Button>
            <PlusCircle className="mr-2"/>
            Add New Reward
        </Button>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
            <CardTitle>Recent Redemptions</CardTitle>
            <CardDescription>A list of recent reward redemptions by users.</CardDescription>
            <div className="flex items-center gap-4 pt-4">
                <div className="relative w-full max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search by user or code..." className="pl-10" />
                </div>
                <Select>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="fulfilled">Fulfilled</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Token Balance</TableHead>
                <TableHead>Redemption</TableHead>
                <TableHead>Redemption Code</TableHead>
                <TableHead>Status</TableHead>
                <TableHead><span className="sr-only">Actions</span></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
                {redemptions.map(item => (
                    <TableRow key={item.redemptionCode}>
                        <TableCell className="font-medium">{item.user}</TableCell>
                        <TableCell>{item.tokenBalance}</TableCell>
                        <TableCell>{item.redemption}</TableCell>
                        <TableCell>{item.redemptionCode}</TableCell>
                        <TableCell>
                            <Badge variant={getStatusVariant(item.status)}>{item.status}</Badge>
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
                                    <DropdownMenuItem>Verify</DropdownMenuItem>
                                    <DropdownMenuItem>Fulfill</DropdownMenuItem>
                                    <DropdownMenuItem>Reject</DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem>View User</DropdownMenuItem>
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
