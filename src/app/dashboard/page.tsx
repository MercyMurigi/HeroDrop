'use client';

import { useState, useEffect } from 'react';
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Coins, CalendarCheck, MapPin, Clock, Award, Droplets, HeartPulse, PlusCircle, MinusCircle, CalendarPlus, Shield, Star, Heart } from 'lucide-react';

const stats = [
  { title: "DamuTokens Balance", value: "130 DT", icon: Coins, color: "text-primary", note: "+100 from last donation" },
  { title: "Total Donations", value: "4 Pints", icon: Droplets, color: "text-chart-2", note: "Next goal: 5 donations!" },
  { title: "Lives Saved", value: "12 Lives", icon: HeartPulse, color: "text-chart-1", note: "Every pint saves up to 3 lives" },
];

const badges = [
    { name: "First Timer", icon: Award, color: "text-chart-4" },
    { name: "Heart of Gold", icon: Heart, color: "text-chart-1" },
    { name: "Community Shield", icon: Shield, color: "text-chart-3" },
    { name: "Superstar Donor", icon: Star, color: "text-chart-5" },
];

const transactions = [
    { date: '2024-07-22', description: 'Completed blood donation', amount: 100, type: 'credit' },
    { date: '2024-07-20', description: 'Redeemed: General checkup', amount: -60, type: 'debit' },
    { date: '2024-07-15', description: 'Refer a friend: Alex', amount: 30, type: 'credit' },
];

type UpcomingAppointment = {
  facility: {
    name: string;
    address: string;
  };
  date: string; // ISO string
};

export default function DashboardPage() {
  const [appointment, setAppointment] = useState<UpcomingAppointment | null>(null);

  useEffect(() => {
    const storedAppointment = localStorage.getItem('upcomingAppointment');
    if (storedAppointment) {
      setAppointment(JSON.parse(storedAppointment));
    }
  }, []);

  return (
    <div className="flex-1 space-y-8 p-4 md:p-8">
      <div className="flex items-center justify-between space-y-2 opacity-0 animate-fade-in-up" style={{ animationDelay: '0ms', animationFillMode: 'forwards' }}>
        <div>
            <h2 className="text-3xl font-bold tracking-tight font-headline">Welcome back, Jane!</h2>
            <p className="text-muted-foreground">Here's a summary of your life-saving journey.</p>
        </div>
        <Button asChild className="hidden sm:flex">
          <Link href="/booking">
            <CalendarPlus className="mr-2 h-4 w-4" />
            Book Donation
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat, index) => (
          <Card 
            key={stat.title} 
            className="shadow-lg opacity-0 animate-fade-in-up" 
            style={{ animationDelay: `${(index + 1) * 100}ms`, animationFillMode: 'forwards' }}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className={`text-4xl font-bold ${stat.color}`}>{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.note}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="grid gap-8 lg:grid-cols-5">
        <div className="lg:col-span-3 space-y-8">
            <Card 
                className="shadow-lg opacity-0 animate-fade-in-up" 
                style={{ animationDelay: '400ms', animationFillMode: 'forwards' }}
            >
              <CardHeader>
                  <CardTitle className="font-headline">Upcoming Appointment</CardTitle>
                  <CardDescription>
                    {appointment ? "Your next donation is scheduled. We can't wait to see you!" : "You have no upcoming appointments."}
                  </CardDescription>
              </CardHeader>
              <CardContent>
                  {appointment ? (
                    <div className="p-4 rounded-lg bg-primary/5 border border-primary/10">
                        <div className="text-xl font-bold text-primary">{appointment.facility.name}</div>
                        <div className="flex items-center text-sm text-muted-foreground mt-2">
                            <Clock className="h-4 w-4 mr-2 flex-shrink-0" />
                            <span>{new Date(appointment.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground mt-1">
                            <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                            <span>{appointment.facility.address}</span>
                        </div>
                       <Button variant="outline" size="sm" className="mt-4">Reschedule / Cancel</Button>
                    </div>
                  ) : (
                     <div className="text-center text-muted-foreground p-4 flex flex-col items-center justify-center">
                        <p className="mb-4">Book a new appointment to save lives!</p>
                        <Button asChild>
                            <Link href="/booking">
                                <CalendarPlus className="mr-2 h-4 w-4" />
                                Book Donation
                            </Link>
                        </Button>
                    </div>
                  )}
              </CardContent>
            </Card>

            <Card 
                className="shadow-lg opacity-0 animate-fade-in-up" 
                style={{ animationDelay: '500ms', animationFillMode: 'forwards' }}
            >
              <CardHeader>
                  <CardTitle className="font-headline">Recent Activity</CardTitle>
                  <CardDescription>Your latest token transactions. <Link href="/wallet" className="text-primary underline">View all.</Link></CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                  <Table>
                      <TableBody>
                          {transactions.map((tx, index) => (
                              <TableRow key={index} className="border-b last:border-b-0">
                                  <TableCell className="font-medium p-3">{tx.description}</TableCell>
                                  <TableCell className="text-right p-3">
                                      <Badge variant={tx.type === 'credit' ? 'default' : 'destructive'} className={tx.type === 'credit' ? 'bg-accent text-accent-foreground hover:bg-accent/80' : ''}>
                                          {tx.type === 'credit' ? <PlusCircle className="h-4 w-4 mr-1" /> : <MinusCircle className="h-4 w-4 mr-1" />}
                                          {Math.abs(tx.amount)} DT
                                      </Badge>
                                  </TableCell>
                              </TableRow>
                          ))}
                      </TableBody>
                  </Table>
              </CardContent>
            </Card>
        </div>
        <div className="lg:col-span-2">
            <Card 
                className="shadow-lg opacity-0 animate-fade-in-up" 
                style={{ animationDelay: '600ms', animationFillMode: 'forwards' }}
            >
              <CardHeader>
                  <CardTitle className="font-headline">My Badges</CardTitle>
                  <CardDescription>Collect badges for your heroic contributions.</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4">
                  {badges.map((badge) => (
                      <div key={badge.name} className="flex flex-col items-center text-center p-4 border rounded-lg bg-background hover:bg-accent hover:border-primary/20 transition-all cursor-pointer">
                          <badge.icon className={`h-10 w-10 mb-2 ${badge.color}`} />
                          <p className="font-semibold text-sm">{badge.name}</p>
                      </div>
                  ))}
              </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
