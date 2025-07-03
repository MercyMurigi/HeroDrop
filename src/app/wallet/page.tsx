'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Coins, PlusCircle, MinusCircle } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const initialTransactions = [
  { date: '2024-07-20', description: 'Welcome Bonus', amount: 10, type: 'credit' },
  { date: '2024-07-15', description: 'Refer a friend: Alex', amount: 30, type: 'credit' },
];

type Transaction = {
  date: string;
  description: string;
  amount: number;
  type: 'credit' | 'debit';
};

export default function WalletPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    // Load transactions from local storage, or set initial state
    const storedTransactions = localStorage.getItem('transactions');
    if (storedTransactions) {
      setTransactions(JSON.parse(storedTransactions));
    } else {
      setTransactions(initialTransactions);
      localStorage.setItem('transactions', JSON.stringify(initialTransactions));
    }
    setIsLoading(false);
  }, []);

  const totalBalance = transactions.reduce((acc, tx) => acc + tx.amount, 0);

  if (isLoading) {
    return (
      <div className="flex-1 space-y-8 p-4 md:p-8">
        <div className="flex items-center justify-between space-y-2">
          <Skeleton className="h-8 w-72 rounded-md" />
        </div>
        <Card className="shadow-lg text-center w-full max-w-md mx-auto bg-primary text-primary-foreground">
          <CardHeader>
            <Skeleton className="h-6 w-32 mx-auto rounded-md bg-primary-foreground/20" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center gap-4">
              <Skeleton className="h-16 w-16 rounded-full bg-primary-foreground/20" />
              <Skeleton className="h-16 w-32 rounded-md bg-primary-foreground/20" />
            </div>
            <Skeleton className="h-4 w-24 mx-auto mt-2 rounded-md bg-primary-foreground/20" />
          </CardContent>
        </Card>
        <Card className="shadow-lg">
          <CardHeader>
            <Skeleton className="h-6 w-48 rounded-md" />
            <Skeleton className="h-4 w-72 mt-2 rounded-md" />
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Amount (DT)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[...Array(5)].map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-5 w-24 rounded-md" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-48 rounded-md" /></TableCell>
                    <TableCell className="text-right"><Skeleton className="h-6 w-20 ml-auto rounded-md" /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-8 p-4 md:p-8">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight font-headline">My DamuToken Wallet</h2>
      </div>

      <Card className="shadow-lg text-center w-full max-w-md mx-auto bg-primary text-primary-foreground">
        <CardHeader>
          <CardTitle className="text-xl">Total Balance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center gap-4">
            <Coins className="h-16 w-16" />
            <span className="text-7xl font-bold">{totalBalance}</span>
          </div>
          <p className="mt-2 text-primary-foreground/80">DamuTokens</p>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline">Transaction History</CardTitle>
          <CardDescription>Your recent token earnings and redemptions.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Amount (DT)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((tx, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{new Date(tx.date).toLocaleDateString()}</TableCell>
                  <TableCell>{tx.description}</TableCell>
                  <TableCell className="text-right">
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
  );
}
