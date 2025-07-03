import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Hospital } from 'lucide-react';

const facilities = [
  { name: 'Nairobi Central Hospital', address: '123 Hospital Rd, Nairobi', phone: '+254 712 345 678' },
  { name: 'Mombasa General Clinic', address: '456 Beach Ave, Mombasa', phone: '+254 723 456 789' },
  { name: 'Kisumu Lakeside Medical', address: '789 Lake View, Kisumu', phone: '+254 734 567 890' },
];

export default function BookingPage() {
  return (
    <div className="flex-1 space-y-8 p-4 md:p-8">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight font-headline">Book an Appointment</h2>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="font-headline">1. Select a Facility</CardTitle>
              <CardDescription>Choose a partner facility near you.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2">
              {facilities.map((facility) => (
                <Card key={facility.name} className="p-4 hover:shadow-xl hover:border-primary transition-all cursor-pointer">
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 p-3 rounded-lg">
                       <Hospital className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{facility.name}</h3>
                      <div className="flex items-center text-sm text-muted-foreground mt-1">
                        <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                        <span>{facility.address}</span>
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground mt-1">
                        <Phone className="h-4 w-4 mr-2 flex-shrink-0" />
                        <span>{facility.phone}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1 space-y-6">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="font-headline">2. Select a Date</CardTitle>
              <CardDescription>Pick a convenient date for your donation.</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              <Calendar
                mode="single"
                className="rounded-md border"
              />
            </CardContent>
          </Card>

          <Button size="lg" className="w-full text-lg">Confirm Booking</Button>
        </div>
      </div>
    </div>
  );
}
