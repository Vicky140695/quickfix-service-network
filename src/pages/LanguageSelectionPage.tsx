
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import LanguageSelector from '../components/LanguageSelector';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const LanguageSelectionPage = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/');
  };

  return (
    <Layout showBack={false}>
      <div className="absolute top-4 left-4 z-10">
        <Button variant="ghost" size="icon" onClick={handleBack} className="hover:bg-primary/10">
          <ArrowLeft className="h-5 w-5" />
        </Button>
      </div>
      <LanguageSelector />
    </Layout>
  );
};

export default LanguageSelectionPage;
