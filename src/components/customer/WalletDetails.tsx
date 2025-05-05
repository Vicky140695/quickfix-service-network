
import React from 'react';
import { useWallet } from '../../contexts/WalletContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Coins } from 'lucide-react';

const WalletDetails: React.FC = () => {
  const { wallet, isLoading } = useWallet();

  if (isLoading) {
    return (
      <div className="container mx-auto p-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-center">Loading wallet information...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!wallet) {
    return (
      <div className="container mx-auto p-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-center">Wallet not available. Please sign in again.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Group transactions by type
  const earnedTransactions = wallet.transactions.filter(t => t.type === 'credit');
  const usedTransactions = wallet.transactions.filter(t => t.type === 'debit');

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Wallet Details</CardTitle>
          <CardDescription>Manage your QuickFix coins</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-primary/10 rounded-lg p-4 flex items-center justify-between mb-6">
            <div className="flex items-center">
              <Coins className="h-8 w-8 mr-3 text-yellow-500" />
              <div>
                <p className="text-sm font-medium">Available Balance</p>
                <p className="text-2xl font-bold">{wallet.balance} Coins</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium">Value</p>
              <p className="text-xl font-semibold">₹{wallet.balance}</p>
            </div>
          </div>

          <Tabs defaultValue="all">
            <TabsList className="grid w-full grid-cols-3 mb-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="earned">Earned</TabsTrigger>
              <TabsTrigger value="used">Used</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="space-y-4">
              {wallet.transactions.length > 0 ? (
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {wallet.transactions
                    .sort((a, b) => b.timestamp - a.timestamp)
                    .map((transaction) => (
                    <div key={transaction.id} className="flex justify-between p-3 border rounded-md">
                      <div>
                        <p className="font-medium">{transaction.description}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(transaction.timestamp).toLocaleString()}
                        </p>
                      </div>
                      <div className={`text-sm font-medium ${transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
                        {transaction.type === 'credit' ? '+' : '-'}{transaction.amount}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center py-8 text-gray-500">No transactions yet</p>
              )}
            </TabsContent>
            
            <TabsContent value="earned" className="space-y-4">
              {earnedTransactions.length > 0 ? (
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {earnedTransactions
                    .sort((a, b) => b.timestamp - a.timestamp)
                    .map((transaction) => (
                    <div key={transaction.id} className="flex justify-between p-3 border rounded-md">
                      <div>
                        <p className="font-medium">{transaction.description}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(transaction.timestamp).toLocaleString()}
                        </p>
                      </div>
                      <div className="text-sm font-medium text-green-600">
                        +{transaction.amount}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center py-8 text-gray-500">No coins earned yet</p>
              )}
            </TabsContent>
            
            <TabsContent value="used" className="space-y-4">
              {usedTransactions.length > 0 ? (
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {usedTransactions
                    .sort((a, b) => b.timestamp - a.timestamp)
                    .map((transaction) => (
                    <div key={transaction.id} className="flex justify-between p-3 border rounded-md">
                      <div>
                        <p className="font-medium">{transaction.description}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(transaction.timestamp).toLocaleString()}
                        </p>
                      </div>
                      <div className="text-sm font-medium text-red-600">
                        -{transaction.amount}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center py-8 text-gray-500">No coins used yet</p>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default WalletDetails;
