import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Coins, CalendarCheck, MapPin, Clock } from 'lucide-react';

export default function DashboardPage() {
  return (
    <div className="flex-1 space-y-6 p-4 md:p-8">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight font-headline">Dashboard</h2>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">DamuTokens Balance</CardTitle>
            <Coins className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-primary">130 DT</div>
            <p className="text-xs text-muted-foreground">
              +100 DT from your last donation
            </p>
          </CardContent>
        </Card>
        
        <Card className="shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Appointment</CardTitle>
            <CalendarCheck className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">Nairobi Central Hospital</div>
            <div className="flex items-center text-sm text-muted-foreground mt-1">
              <Clock className="h-4 w-4 mr-2" />
              <span>Tomorrow, 10:30 AM</span>
            </div>
            <div className="flex items-center text-sm text-muted-foreground mt-1">
              <MapPin className="h-4 w-4 mr-2" />
              <span>123 Hospital Rd, Nairobi</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
