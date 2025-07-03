'use client';

import { useState } from 'react';
import { findFacilities } from '@/ai/flows/find-facilities';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Loader2, MapPin, Phone, Hospital, Search, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { FindFacilitiesOutput } from '@/ai/schemas/facilities';

type Facility = FindFacilitiesOutput['facilities'][0];

interface FacilityFinderProps {
  onFacilitySelect: (facility: Facility) => void;
}

export function FacilityFinder({ onFacilitySelect }: FacilityFinderProps) {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null);
  const { toast } = useToast();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query) return;

    setIsLoading(true);
    setFacilities([]);
    setSelectedFacility(null);

    try {
      const result = await findFacilities({ locationQuery: query });
      setFacilities(result.facilities);
      if (result.facilities.length === 0) {
        toast({
          title: "No facilities found",
          description: "Please try a different location or a broader search term.",
        });
      }
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Search Failed",
        description: "There was a problem finding facilities. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSelect = (facility: Facility) => {
      setSelectedFacility(facility);
      onFacilitySelect(facility);
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSearch} className="flex items-end gap-2">
        <div className="grid flex-1 gap-2">
          <Label htmlFor="location-search">Enter your location</Label>
          <Input
            id="location-search"
            placeholder="e.g., 'KNH', 'Central Nairobi', or 'Mombasa town'"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <Button type="submit" disabled={isLoading} className="h-10">
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Search className="mr-2 h-4 w-4" />
          )}
          Find
        </Button>
      </form>
      
      {isLoading && (
         <div className="grid gap-4 md:grid-cols-2">
            {[...Array(2)].map((_, i) => (
                <Card key={i} className="p-4 animate-pulse">
                    <div className="flex items-start gap-4">
                        <div className="bg-muted p-3 rounded-lg h-12 w-12" />
                        <div>
                            <div className="h-5 w-40 bg-muted rounded" />
                            <div className="h-4 w-48 bg-muted rounded mt-2" />
                            <div className="h-4 w-32 bg-muted rounded mt-1" />
                        </div>
                    </div>
                </Card>
            ))}
         </div>
      )}

      {facilities.length > 0 && !isLoading && (
        <div className="grid gap-4 md:grid-cols-2">
          {facilities.map((facility) => (
            <Card 
              key={facility.name} 
              onClick={() => handleSelect(facility)}
              className={`p-4 hover:shadow-xl transition-all cursor-pointer ${selectedFacility?.name === facility.name ? 'border-primary ring-2 ring-primary' : 'hover:border-primary/50'}`}
            >
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
                    <span className="font-semibold text-foreground mr-4">~ {facility.distance}</span>
                    <span className={`px-2 py-0.5 text-xs rounded-full ${facility.availability === 'High' ? 'bg-green-100 text-green-800' : facility.availability === 'Medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                        {facility.availability} Availability
                    </span>
                  </div>
                </div>
                {selectedFacility?.name === facility.name && (
                    <CheckCircle className="h-6 w-6 text-primary ml-auto flex-shrink-0" />
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
