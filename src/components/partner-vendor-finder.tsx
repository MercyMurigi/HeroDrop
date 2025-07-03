'use client';

import { Card } from '@/components/ui/card';
import { Building2, CheckCircle, MapPin, ShoppingCart } from 'lucide-react';

export type Vendor = {
  name: string;
  address: string;
  type: 'Supermarket' | 'Pharmacy';
};

const vendors: Vendor[] = [
  { name: "Naivas Supermarket", address: "Westlands, Nairobi", type: "Supermarket" },
  { name: "Carrefour", address: "Two Rivers Mall, Nairobi", type: "Supermarket" },
  { name: "Goodlife Pharmacy", address: "Village Market, Nairobi", type: "Pharmacy" },
  { name: "Naivas Supermarket", address: "Mombasa Road, Nairobi", type: "Supermarket" },
  { name: "Goodlife Pharmacy", address: "City Mall, Mombasa", type: "Pharmacy" },
  { name: "Tuskys Supermarket", address: "Mega City, Kisumu", type: "Supermarket" },
  { name: "Pharmaplus Pharmacy", address: "64 Street, Eldoret", type: "Pharmacy" },
];

interface PartnerVendorFinderProps {
  onVendorSelect: (vendor: Vendor | null) => void;
  selectedVendor: Vendor | null;
}

export function PartnerVendorFinder({ onVendorSelect, selectedVendor }: PartnerVendorFinderProps) {
  
  const handleSelect = (vendor: Vendor) => {
      onVendorSelect(vendor);
  }

  return (
    <div className="space-y-6">
      <div className="text-sm text-muted-foreground">Select a partner store below to generate your shopping voucher code.</div>
      <div className="grid gap-4 md:grid-cols-2">
          {vendors.map((vendor) => (
            <Card 
              key={`${vendor.name}-${vendor.address}`} 
              onClick={() => handleSelect(vendor)}
              className={`p-4 hover:shadow-xl transition-all cursor-pointer ${selectedVendor?.name === vendor.name && selectedVendor?.address === vendor.address ? 'border-primary ring-2 ring-primary' : 'hover:border-primary/50'}`}
            >
              <div className="flex items-start gap-4">
                 <div className="bg-primary/10 p-3 rounded-lg">
                   {vendor.type === 'Supermarket' ? <ShoppingCart className="h-6 w-6 text-primary" /> : <Building2 className="h-6 w-6 text-primary" />}
                </div>
                <div>
                  <h3 className="font-semibold">{vendor.name}</h3>
                  <div className="flex items-center text-sm text-muted-foreground mt-1">
                    <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span>{vendor.address}</span>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground mt-1">
                    <span className={`px-2 py-0.5 text-xs rounded-full ${vendor.type === 'Supermarket' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'}`}>
                        {vendor.type}
                    </span>
                  </div>
                </div>
                {selectedVendor?.name === vendor.name && selectedVendor?.address === vendor.address && (
                    <CheckCircle className="h-6 w-6 text-primary ml-auto flex-shrink-0" />
                )}
              </div>
            </Card>
          ))}
        </div>
    </div>
  );
}
