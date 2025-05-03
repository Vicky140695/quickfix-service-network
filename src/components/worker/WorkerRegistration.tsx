
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import { useUser } from '../../contexts/UserContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

const WorkerRegistration: React.FC = () => {
  const { t } = useLanguage();
  const { userProfile, setUserProfile } = useUser();
  const navigate = useNavigate();
  
  const [name, setName] = useState(userProfile?.name || '');
  const [age, setAge] = useState<string>(userProfile?.age?.toString() || '');
  const [address, setAddress] = useState(userProfile?.address || '');
  const [skills, setSkills] = useState<string[]>(userProfile?.skills || []);
  const [otherSkill, setOtherSkill] = useState(userProfile?.otherSkill || '');

  const skillOptions = [
    { value: 'electrician', label: t('electrician') },
    { value: 'plumber', label: t('plumber') },
    { value: 'carpenter', label: t('carpenter') },
    { value: 'painter', label: t('painter') },
    { value: 'ac-technician', label: 'AC Technician' },
    { value: 'appliance-repair', label: 'Appliance Repair' },
    { value: 'other', label: t('other') }
  ];

  const handleSkillChange = (value: string) => {
    if (skills.includes(value)) {
      setSkills(skills.filter(skill => skill !== value));
    } else {
      setSkills([...skills, value]);
    }
  };

  const handleCurrentLocation = () => {
    // In a real app, we would use the Geolocation API to get the user's location
    toast.info("Getting current location...");
    setTimeout(() => {
      setAddress("123 Main Street, Sample City");
      toast.success("Location set successfully!");
    }, 1000);
  };

  const handleContinue = () => {
    if (!name) {
      toast.error("Please enter your name");
      return;
    }
    
    if (!age || isNaN(Number(age))) {
      toast.error("Please enter a valid age");
      return;
    }
    
    if (!address) {
      toast.error("Please enter your address");
      return;
    }
    
    if (skills.length === 0) {
      toast.error("Please select at least one skill");
      return;
    }
    
    if (skills.includes('other') && !otherSkill) {
      toast.error("Please specify your other skill");
      return;
    }

    setUserProfile({
      ...userProfile,
      name,
      age: Number(age),
      address,
      skills,
      otherSkill
    });

    navigate('/worker/terms');
  };

  return (
    <div className="flex items-center justify-center min-h-full p-4">
      <Card className="w-full max-w-md">
        <CardContent className="pt-6">
          <h1 className="text-2xl font-bold text-center mb-6">{t('worker_registration')}</h1>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">{t('name')}</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full"
              />
            </div>
            
            <div>
              <Label htmlFor="age">{t('age')}</Label>
              <Input
                id="age"
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="w-full"
              />
            </div>
            
            <div>
              <Label htmlFor="address">{t('address')}</Label>
              <Textarea
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full"
                rows={3}
              />
              <Button
                variant="outline"
                className="mt-2 text-sm"
                onClick={handleCurrentLocation}
              >
                {t('use_current_location')}
              </Button>
            </div>
            
            <div>
              <Label>{t('select_skills')}</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {skillOptions.map((skill) => (
                  <div key={skill.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={`skill-${skill.value}`}
                      checked={skills.includes(skill.value)}
                      onCheckedChange={() => handleSkillChange(skill.value)}
                    />
                    <Label htmlFor={`skill-${skill.value}`}>{skill.label}</Label>
                  </div>
                ))}
              </div>
              
              {skills.includes('other') && (
                <div className="mt-2">
                  <Label htmlFor="other-skill">{t('specify_other')}</Label>
                  <Input
                    id="other-skill"
                    value={otherSkill}
                    onChange={(e) => setOtherSkill(e.target.value)}
                    className="w-full"
                  />
                </div>
              )}
            </div>
            
            <Button className="w-full" onClick={handleContinue}>
              {t('continue')}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WorkerRegistration;
