import { Droplet } from 'lucide-react';

export function Logo() {
  return (
    <div className="flex items-center gap-2 p-2">
      <Droplet className="h-8 w-8 text-primary" fill="currentColor" />
      <h1 className="text-2xl font-bold text-primary font-headline">
        HeroDrop+
      </h1>
    </div>
  );
}
