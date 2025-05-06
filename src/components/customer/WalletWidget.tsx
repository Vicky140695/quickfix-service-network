
import React from 'react';
import { useWallet } from '../../contexts/WalletContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Coins } from 'lucide-react';

const WalletWidget: React.FC = () => {
  const { wallet, isLoading } = useWallet();
  const navigate = useNavigate();
  
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your Wallet</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Loading wallet information...</p>
        </CardContent>
      </Card>
    );
  }
  
  if (!wallet) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your Wallet</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Wallet not available. Please sign in again.</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Wallet</CardTitle>
        <CardDescription>QuickFix coins can be used for service payments</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Coins className="h-6 w-6 mr-2 text-yellow-500" />
            <span className="text-2xl font-bold">{wallet.balance}</span>
          </div>
          <span className="text-sm text-muted-foreground">
            Worth ₹{wallet.balance}
          </span>
        </div>
        
        {wallet.transactions && wallet.transactions.length > 0 ? (
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Recent Transactions</h3>
            <div className="max-h-48 overflow-y-auto space-y-2">
              {wallet.transactions
                .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                .slice(0, 5)
                .map((transaction) => (
                <div key={transaction.id} className="flex justify-between py-2 border-b last:border-0">
                  <div className="text-sm">
                    <p className="font-medium">{transaction.description}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(transaction.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className={`text-sm font-medium ${transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
                    {transaction.type === 'credit' ? '+' : '-'}{transaction.amount}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-sm text-center py-2 text-gray-500">
            No transactions yet
          </p>
        )}
        
        <Button 
          className="w-full mt-4" 
          variant="outline"
          onClick={() => navigate('/customer/wallet')}
        >
          View All Transactions
        </Button>
      </CardContent>
    </Card>
  );
};

export default WalletWidget;
