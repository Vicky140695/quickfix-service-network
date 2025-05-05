
import React, { useState } from 'react';
import { useWallet } from '../../contexts/WalletContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';

const ReferralWidget: React.FC = () => {
  const { wallet } = useWallet();
  const [copying, setCopying] = useState(false);

  const handleCopyReferral = async () => {
    if (!wallet) return;
    
    try {
      setCopying(true);
      await navigator.clipboard.writeText(`Join me on QuickFix! Use my referral code: ${wallet.referralCode} to get started. https://quickfix.com/signup?ref=${wallet.referralCode}`);
      toast.success("Referral link copied to clipboard!");
    } catch (error) {
      toast.error("Failed to copy referral link");
    } finally {
      setCopying(false);
    }
  };

  const handleShare = async () => {
    if (!wallet) return;
    
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Join me on QuickFix',
          text: `Use my referral code: ${wallet.referralCode} to get started.`,
          url: `https://quickfix.com/signup?ref=${wallet.referralCode}`
        });
      } else {
        toast.info("Sharing not supported on this device");
      }
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  if (!wallet) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Referrals</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Loading wallet information...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Refer & Earn</span>
          <span className="text-sm font-normal bg-green-100 text-green-800 px-2 py-1 rounded">
            50 Coins per referral
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm text-gray-600 mb-2">
            Share your code with friends. When they sign up and complete a service, you earn 50 QuickFix coins worth ₹50!
          </p>
        </div>
        
        <div className="relative">
          <Input 
            value={wallet.referralCode} 
            readOnly 
            className="bg-gray-50 pr-24"
          />
          <Button 
            size="sm" 
            onClick={handleCopyReferral}
            disabled={copying}
            className="absolute right-1 top-1 h-7"
            variant="secondary"
          >
            {copying ? 'Copying...' : 'Copy'}
          </Button>
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          <Button variant="outline" onClick={handleCopyReferral}>
            Copy Link
          </Button>
          <Button variant="outline" onClick={handleShare}>
            Share
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReferralWidget;
