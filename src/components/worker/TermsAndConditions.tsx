
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import { useUser } from '../../contexts/UserContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';

const TermsAndConditions: React.FC = () => {
  const { t } = useLanguage();
  const { userProfile, setUserProfile } = useUser();
  const [agreed, setAgreed] = useState(userProfile?.agreedToTerms || false);
  const navigate = useNavigate();

  const handleContinue = () => {
    if (!agreed) {
      toast.error("You must agree to the terms and conditions to continue");
      return;
    }

    setUserProfile({
      ...userProfile,
      agreedToTerms: agreed
    });

    navigate('/worker/payment');
  };

  return (
    <div className="flex items-center justify-center min-h-full p-4">
      <Card className="w-full max-w-md">
        <CardContent className="pt-6">
          <h1 className="text-2xl font-bold text-center mb-6">{t('terms_conditions')}</h1>
          
          <ScrollArea className="h-64 rounded border p-4 mb-4">
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">QuickFix Terms of Service</h2>
              
              <p>
                Welcome to QuickFix, the platform that connects service providers with customers
                in need of professional assistance. By using our platform, you agree to the following terms:
              </p>
              
              <h3 className="font-semibold mt-4">1. Service Provider Responsibilities</h3>
              <p>
                As a service provider on QuickFix, you agree to:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Provide services in a professional and timely manner</li>
                <li>Accurately represent your skills, qualifications, and experience</li>
                <li>Maintain appropriate insurance and licenses for your services</li>
                <li>Comply with all applicable laws and regulations</li>
                <li>Respond promptly to service requests and customer communications</li>
                <li>Charge fair and transparent rates for your services</li>
              </ul>
              
              <h3 className="font-semibold mt-4">2. Platform Fees</h3>
              <p>
                QuickFix charges a one-time registration fee of ₹99 for service providers. 
                This fee helps us maintain the platform and connect you with potential customers.
              </p>
              
              <h3 className="font-semibold mt-4">3. Job Acceptance</h3>
              <p>
                When you receive a job notification, you have 1 minute to accept or decline.
                Repeatedly ignoring job requests may affect your visibility on the platform.
              </p>
              
              <h3 className="font-semibold mt-4">4. Payment Processing</h3>
              <p>
                All payments for services are processed through the QuickFix platform.
                Service providers may not request direct payment from customers.
              </p>
              
              <h3 className="font-semibold mt-4">5. Ratings and Reviews</h3>
              <p>
                Customers may leave ratings and reviews based on your service.
                These ratings affect your visibility and ranking on the platform.
              </p>
              
              <h3 className="font-semibold mt-4">6. Termination</h3>
              <p>
                QuickFix reserves the right to terminate your account for violations of these terms,
                including but not limited to fraudulent activity, inappropriate behavior, or poor service quality.
              </p>
              
              <h3 className="font-semibold mt-4">7. Privacy</h3>
              <p>
                We collect and process personal information as described in our Privacy Policy.
                By using QuickFix, you consent to the collection and processing of your information.
              </p>
              
              <h3 className="font-semibold mt-4">8. Limitation of Liability</h3>
              <p>
                QuickFix is not responsible for any damages, injuries, or losses that may occur
                during the provision of services between service providers and customers.
              </p>
              
              <h3 className="font-semibold mt-4">9. Modifications to Terms</h3>
              <p>
                QuickFix may modify these terms at any time. Continued use of the platform
                after such modifications constitutes acceptance of the new terms.
              </p>
              
              <p className="mt-4">
                By checking the box below, you acknowledge that you have read, understood,
                and agree to be bound by these terms and conditions.
              </p>
            </div>
          </ScrollArea>
          
          <div className="flex items-center space-x-2 mb-4">
            <Checkbox
              id="terms"
              checked={agreed}
              onCheckedChange={(checked) => setAgreed(checked === true)}
            />
            <Label htmlFor="terms">{t('i_agree')}</Label>
          </div>
          
          <Button className="w-full" onClick={handleContinue}>
            {t('continue')}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default TermsAndConditions;
