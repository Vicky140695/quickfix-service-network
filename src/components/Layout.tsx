
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  showBack?: boolean;
  showLanguageToggle?: boolean;
  hideOnInitialPages?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  showBack = true, 
  showLanguageToggle = true,
  hideOnInitialPages = true 
}) => {
  const { t, language, setLanguage } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  const isInitialPage = location.pathname === '/' || location.pathname === '/language' || location.pathname === '/role-selection';
  const shouldHideNavigation = hideOnInitialPages && isInitialPage;

  const toggleLanguage = () => {
    setLanguage(language === 'english' ? 'tamil' : 'english');
  };

  return (
    <div className="min-h-screen flex flex-col">
      {!shouldHideNavigation && (
        <header className="py-4 px-4 flex items-center justify-between border-b">
          <div className="flex items-center gap-4">
            {showBack && (
              <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
            )}
            <h2 className="font-bold text-xl">QuickFix</h2>
          </div>
          {showLanguageToggle && (
            <Button variant="outline" onClick={toggleLanguage}>
              {language === 'english' ? 'தமிழ்' : 'English'}
            </Button>
          )}
        </header>
      )}
      <main className="flex-grow flex flex-col">
        {children}
      </main>
    </div>
  );
};

export default Layout;
