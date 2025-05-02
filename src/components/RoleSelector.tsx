
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useUser } from '../contexts/UserContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

const RoleSelector: React.FC = () => {
  const { t } = useLanguage();
  const { setRole } = useUser();
  const navigate = useNavigate();

  const handleRoleSelect = (selectedRole: 'customer' | 'worker') => {
    setRole(selectedRole);
    
    if (selectedRole === 'worker') {
      navigate('/worker/phone-verification');
    } else {
      navigate('/customer/phone-verification');
    }
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
            <h1 className="text-2xl font-bold text-center mb-8">{t('select_role')}</h1>
            
            <div className="flex flex-col gap-6 mb-6">
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="card-hover"
              >
                <Card 
                  className="cursor-pointer border-2 hover:border-primary"
                  onClick={() => handleRoleSelect('customer')}
                >
                  <CardContent className="p-6">
                    <h3 className="text-xl font-medium mb-2">{t('customer')}</h3>
                    <p className="text-gray-600">{t('customer_description')}</p>
                  </CardContent>
                </Card>
              </motion.div>
              
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="card-hover"
              >
                <Card 
                  className="cursor-pointer border-2 hover:border-primary"
                  onClick={() => handleRoleSelect('worker')}
                >
                  <CardContent className="p-6">
                    <h3 className="text-xl font-medium mb-2">{t('worker')}</h3>
                    <p className="text-gray-600">{t('worker_description')}</p>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </motion.div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RoleSelector;
