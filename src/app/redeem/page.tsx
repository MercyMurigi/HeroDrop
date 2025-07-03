import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Coins, HeartPulse, ShieldCheck, Users, Stethoscope, ClipboardCheck } from 'lucide-react';
import Image from 'next/image';

const services = [
  { title: 'General Checkup', cost: 60, icon: Stethoscope, description: "A comprehensive health checkup with a general practitioner.", image: "https://placehold.co/600x400.png", hint: "doctor checkup" },
  { title: 'Free Lab Test', cost: 100, icon: HeartPulse, description: "Includes tests for malaria, hemoglobin levels, and more.", image: "https://placehold.co/600x400.png", hint: "lab test" },
  { title: 'Counseling Session', cost: 80, icon: Users, description: "A private session with a certified mental health counselor.", image: "https://placehold.co/600x400.png", hint: "counseling session" },
  { title: 'Queue Priority (Fast-Pass)', cost: 30, icon: ShieldCheck, description: "Skip the line and get priority access at partner facilities.", image: "https://placehold.co/600x400.png", hint: "hospital queue" },
  { title: "Women's Health Screening", cost: 150, icon: ClipboardCheck, description: "Includes essential screenings like pap smear and breast exam.", image: "https://placehold.co/600x400.png", hint: "health screening" },
];

export default function RedeemPage() {
  return (
    <div className="flex-1 space-y-8 p-4 md:p-8">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight font-headline">Redemption Store</h2>
      </div>
      <p className="text-muted-foreground">Use your DamuTokens to redeem valuable health services.</p>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => (
          <Card key={service.title} className="shadow-lg flex flex-col overflow-hidden group">
            <div className="relative h-48 w-full">
              <Image src={service.image} alt={service.title} layout="fill" objectFit="cover" className="transition-transform duration-300 group-hover:scale-105" data-ai-hint={service.hint} />
            </div>
            <CardHeader className="flex-grow">
                <div className="flex justify-between items-start">
                  <CardTitle className="font-headline text-xl">{service.title}</CardTitle>
                  <div className="bg-primary/10 p-3 rounded-lg -mt-2">
                    <service.icon className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <CardDescription>{service.description}</CardDescription>
            </CardHeader>
            <CardContent className="mt-auto pt-4 border-t">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Coins className="h-6 w-6 text-primary" />
                  <span className="text-2xl font-bold">{service.cost} DT</span>
                </div>
                <Button>Redeem Now</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
