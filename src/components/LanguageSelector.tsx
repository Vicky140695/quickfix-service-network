
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

const LanguageSelector: React.FC = () => {
  const { t, language, setLanguage } = useLanguage();
  const [selectedLang, setSelectedLang] = useState<string>(language);
  const navigate = useNavigate();

  const handleLanguageChange = (lang: 'english' | 'tamil') => {
    setSelectedLang(lang);
    setLanguage(lang);
  };

  const handleContinue = () => {
    navigate('/role-selection');
  };

  return (
    <div className="flex items-center justify-center h-full p-4">
      <Card className="w-full max-w-md">
        <CardContent className="pt-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-2xl font-bold text-center mb-8">{t('select_language')}</h1>
            
            <div className="flex flex-col gap-4 mb-6">
              <div
                className={`p-4 border rounded-lg cursor-pointer transition-all ${
                  selectedLang === 'english' 
                    ? 'border-primary bg-primary/10' 
                    : 'hover:bg-gray-50'
                }`}
                onClick={() => handleLanguageChange('english')}
              >
                <div className="flex items-center">
                  <div className="ml-2">
                    <h3 className="font-medium">English</h3>
                  </div>
                </div>
              </div>
              
              <div
                className={`p-4 border rounded-lg cursor-pointer transition-all ${
                  selectedLang === 'tamil' 
                    ? 'border-primary bg-primary/10' 
                    : 'hover:bg-gray-50'
                }`}
                onClick={() => handleLanguageChange('tamil')}
              >
                <div className="flex items-center">
                  <div className="ml-2">
                    <h3 className="font-medium">தமிழ்</h3>
                  </div>
                </div>
              </div>
            </div>
            
            <Button 
              className="w-full" 
              onClick={handleContinue}
            >
              {t('continue')}
            </Button>
          </motion.div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LanguageSelector;
