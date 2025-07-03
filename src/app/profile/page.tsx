import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Camera } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function ProfilePage() {
    return (
        <div className="flex-1 space-y-8 p-4 md:p-8">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight font-headline">My Profile</h2>
                    <p className="text-muted-foreground">
                        View and manage your personal information.
                    </p>
                </div>
            </div>

            <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle>Personal Details</CardTitle>
                    <CardDescription>Keep your information up-to-date to ensure we can reach you.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-center gap-6">
                        <div className="relative">
                             <Avatar className="h-24 w-24">
                                <AvatarImage src="https://placehold.co/96x96.png" alt="@donor" data-ai-hint="person portrait" />
                                <AvatarFallback>JD</AvatarFallback>
                            </Avatar>
                            <Button size="icon" variant="outline" className="absolute bottom-0 right-0 rounded-full h-8 w-8">
                                <Camera className="h-4 w-4"/>
                                <span className="sr-only">Change photo</span>
                            </Button>
                        </div>
                        <div className="flex-1">
                            <h3 className="text-2xl font-semibold">Jane Donor</h3>
                        </div>
                    </div>

                    <form className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="fullName">Full Name</Label>
                            <Input id="fullName" defaultValue="Jane Donor" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="idNumber">National ID Number</Label>
                            <Input id="idNumber" defaultValue="12345678" />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="phone">Phone Number</Label>
                            <Input id="phone" defaultValue="+254 712 345 678" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <Input id="email" type="email" defaultValue="jane.donor@example.com" />
                        </div>

                        <div className="md:col-span-2 border-t pt-6 mt-2">
                            <h3 className="text-lg font-semibold mb-4">Medical Information</h3>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="blood-type">Blood Type</Label>
                                    <Select defaultValue="O+">
                                        <SelectTrigger id="blood-type">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="A+">A+</SelectItem>
                                            <SelectItem value="A-">A-</SelectItem>
                                            <SelectItem value="B+">B+</SelectItem>
                                            <SelectItem value="B-">B-</SelectItem>
                                            <SelectItem value="AB+">AB+</SelectItem>
                                            <SelectItem value="AB-">AB-</SelectItem>
                                            <SelectItem value="O+">O+</SelectItem>
                                            <SelectItem value="O-">O-</SelectItem>
                                            <SelectItem value="unknown">I don't know</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>
                        
                        <div className="md:col-span-2 border-t pt-6 mt-2">
                            <h3 className="text-lg font-semibold mb-4">Next of Kin Details</h3>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="kinName">Full Name</Label>
                                    <Input id="kinName" defaultValue="John Donor" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="kinPhone">Phone Number</Label>
                                    <Input id="kinPhone" defaultValue="+254 787 654 321" />
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <Label htmlFor="kinIdNumber">National ID Number</Label>
                                    <Input id="kinIdNumber" defaultValue="87654321" />
                                </div>
                            </div>
                        </div>

                         <div className="md:col-span-2 flex justify-end">
                            <Button type="submit">Save Changes</Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
