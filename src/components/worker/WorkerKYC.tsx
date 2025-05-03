
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import { useUser } from '../../contexts/UserContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

const WorkerKYC: React.FC = () => {
  const { t } = useLanguage();
  const { userProfile, setUserProfile } = useUser();
  const navigate = useNavigate();
  
  const [aadhaarNumber, setAadhaarNumber] = useState(userProfile?.aadhaarNumber || '');
  const [aadhaarFront, setAadhaarFront] = useState<string | null>(null);
  const [aadhaarBack, setAadhaarBack] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{
    aadhaarNumber?: string;
    aadhaarFront?: string;
    aadhaarBack?: string;
  }>({});

  const validateAadhaar = (value: string) => {
    return value.length === 12 && /^\d+$/.test(value);
  };

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: React.Dispatch<React.SetStateAction<string | null>>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setter(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = () => {
    // Validate inputs
    const newErrors: {
      aadhaarNumber?: string;
      aadhaarFront?: string;
      aadhaarBack?: string;
    } = {};

    if (!aadhaarNumber || !validateAadhaar(aadhaarNumber)) {
      newErrors.aadhaarNumber = "Please enter a valid 12-digit Aadhaar number";
    }

    if (!aadhaarFront) {
      newErrors.aadhaarFront = "Please upload front side of Aadhaar card";
    }

    if (!aadhaarBack) {
      newErrors.aadhaarBack = "Please upload back side of Aadhaar card";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call for KYC verification
    setTimeout(() => {
      setUserProfile({
        ...userProfile,
        aadhaarNumber,
        aadhaarVerified: true,
        kycStatus: 'pending',
        kycSubmittedAt: new Date().toISOString()
      });
      
      toast.success("KYC documents submitted successfully!");
      setIsSubmitting(false);
      navigate('/worker/dashboard');
    }, 2000);
  };

  return (
    <div className="flex items-center justify-center min-h-full p-4">
      <Card className="w-full max-w-md">
        <CardContent className="pt-6">
          <h1 className="text-2xl font-bold text-center mb-6">KYC Verification</h1>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="aadhaar">Aadhaar Number</Label>
              <Input
                id="aadhaar"
                value={aadhaarNumber}
                onChange={(e) => setAadhaarNumber(e.target.value)}
                placeholder="12-digit Aadhaar number"
                className="w-full"
                maxLength={12}
              />
              {errors.aadhaarNumber && (
                <p className="text-red-500 text-sm mt-1">{errors.aadhaarNumber}</p>
              )}
            </div>
            
            <div>
              <Label htmlFor="aadhaarFront">Upload Aadhaar Front</Label>
              <div className="mt-1">
                <Input
                  id="aadhaarFront"
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageChange(e, setAadhaarFront)}
                  className="w-full"
                />
              </div>
              {errors.aadhaarFront && (
                <p className="text-red-500 text-sm mt-1">{errors.aadhaarFront}</p>
              )}
              {aadhaarFront && (
                <div className="mt-2">
                  <img src={aadhaarFront} alt="Aadhaar front" className="max-h-40 rounded border" />
                </div>
              )}
            </div>
            
            <div>
              <Label htmlFor="aadhaarBack">Upload Aadhaar Back</Label>
              <div className="mt-1">
                <Input
                  id="aadhaarBack"
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageChange(e, setAadhaarBack)}
                  className="w-full"
                />
              </div>
              {errors.aadhaarBack && (
                <p className="text-red-500 text-sm mt-1">{errors.aadhaarBack}</p>
              )}
              {aadhaarBack && (
                <div className="mt-2">
                  <img src={aadhaarBack} alt="Aadhaar back" className="max-h-40 rounded border" />
                </div>
              )}
            </div>
            
            <Button
              className="w-full"
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin mr-2"></div>
                  Submitting
                </div>
              ) : "Submit KYC Details"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WorkerKYC;
