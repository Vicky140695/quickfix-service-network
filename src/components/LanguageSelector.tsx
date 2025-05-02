
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { ChevronRight, Globe } from 'lucide-react';

const LanguageSelector: React.FC = () => {
  const { t, language, setLanguage } = useLanguage();
  const [selectedLang, setSelectedLang] = useState<string>(language);
  const navigate = useNavigate();

  const languages = [
    { code: 'english', name: 'English', nativeName: 'English' },
    { code: 'tamil', name: 'Tamil', nativeName: 'தமிழ்' },
    { code: 'telugu', name: 'Telugu', nativeName: 'తెలుగు' },
    { code: 'kannada', name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
    { code: 'malayalam', name: 'Malayalam', nativeName: 'മലയാളം' },
    { code: 'hindi', name: 'Hindi', nativeName: 'हिन्दी' },
  ];

  const handleLanguageChange = (lang: string) => {
    setSelectedLang(lang);
    setLanguage(lang as any);
  };

  const handleContinue = () => {
    navigate('/role-selection');
  };

  return (
    <div className="flex items-center justify-center h-full p-4">
      <Card className="w-full max-w-md shadow-lg border-0">
        <CardContent className="pt-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <div className="flex justify-center mb-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <Globe className="h-8 w-8 text-primary" />
              </div>
            </div>
            
            <h1 className="text-2xl font-bold text-center mb-6">{t('select_language')}</h1>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {languages.map((lang) => (
                <div
                  key={lang.code}
                  className={`p-4 border rounded-lg cursor-pointer transition-all flex justify-between items-center ${
                    selectedLang === lang.code 
                      ? 'border-primary bg-primary/10 shadow-sm' 
                      : 'hover:bg-gray-50'
                  }`}
                  onClick={() => handleLanguageChange(lang.code)}
                >
                  <div className="flex items-center">
                    <div>
                      <h3 className="font-medium">{lang.nativeName}</h3>
                      {lang.name !== lang.nativeName && (
                        <p className="text-xs text-muted-foreground">{lang.name}</p>
                      )}
                    </div>
                  </div>
                  {selectedLang === lang.code && (
                    <div className="text-primary">
                      <motion.div 
                        initial={{ scale: 0 }} 
                        animate={{ scale: 1 }} 
                        transition={{ duration: 0.2 }}
                        className="bg-primary rounded-full p-0.5"
                      >
                        <div className="h-4 w-4 text-white flex items-center justify-center">
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3"><polyline points="20 6 9 17 4 12"></polyline></svg>
                        </div>
                      </motion.div>
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            <Button 
              className="w-full mt-6 flex items-center justify-center gap-2" 
              onClick={handleContinue}
              size="lg"
            >
              {t('continue')}
              <ChevronRight className="h-4 w-4" />
            </Button>
          </motion.div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LanguageSelector;
