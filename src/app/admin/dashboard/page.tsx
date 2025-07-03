import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { WeeklyDonationsChart } from "@/components/weekly-donations-chart";
import { RedemptionVolumeChart } from "@/components/redemption-volume-chart";
import { Users, HeartHandshake, Coins, Gift } from 'lucide-react';

export default function AdminDashboardPage() {
  return (
    <div className="flex-1 space-y-8 p-4 md:p-8">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight font-headline">Analytics & Impact</h2>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">1,254</div>
            <p className="text-xs text-muted-foreground">+50 this week</p>
          </CardContent>
        </Card>
        <Card className="shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Donations Completed</CardTitle>
            <HeartHandshake className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">832</div>
            <p className="text-xs text-muted-foreground">+120 this month</p>
          </CardContent>
        </Card>
        <Card className="shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tokens Issued</CardTitle>
            <Coins className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">95,400</div>
            <p className="text-xs text-muted-foreground">Total issued lifetime</p>
          </CardContent>
        </Card>
        <Card className="shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tokens Redeemed</CardTitle>
            <Gift className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">62,150</div>
            <p className="text-xs text-muted-foreground">75% redemption rate</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Weekly Donations</CardTitle>
            <CardDescription>Number of completed donations per week.</CardDescription>
          </CardHeader>
          <CardContent>
            <WeeklyDonationsChart />
          </CardContent>
        </Card>
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Redemption Volume</CardTitle>
            <CardDescription>Volume of tokens redeemed over time.</CardDescription>
          </CardHeader>
          <CardContent>
            <RedemptionVolumeChart />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
