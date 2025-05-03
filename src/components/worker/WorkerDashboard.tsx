
import React, { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { useUser } from '../../contexts/UserContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { 
  UserRound, 
  MapPin, 
  FileEdit, 
  Save, 
  X, 
  ShieldCheck, 
  Clock,
  AlertTriangle
} from 'lucide-react';

const WorkerDashboard: React.FC = () => {
  const { t } = useLanguage();
  const { userProfile, setUserProfile } = useUser();
  
  const [available, setAvailable] = useState(userProfile?.available || false);
  const [isEditing, setIsEditing] = useState(false);
  
  // Form state for editing
  const [name, setName] = useState(userProfile?.name || '');
  const [age, setAge] = useState<string>(userProfile?.age?.toString() || '');
  const [workersCount, setWorkersCount] = useState<string>(userProfile?.workersCount?.toString() || '1');
  const [address, setAddress] = useState(userProfile?.address || '');
  const [skills, setSkills] = useState<string[]>(userProfile?.skills || []);
  const [otherSkill, setOtherSkill] = useState(userProfile?.otherSkill || '');

  const skillOptions = [
    { value: 'electrician', label: t('electrician') },
    { value: 'plumber', label: t('plumber') },
    { value: 'carpenter', label: t('carpenter') },
    { value: 'painter', label: t('painter') },
    { value: 'cleaning', label: 'Cleaning' },
    { value: 'ac-technician', label: 'AC Service & Installation' },
    { value: 'washing-machine', label: 'Washing Machine Service' },
    { value: 'fridge-service', label: 'Fridge Service' },
    { value: 'other', label: t('other') }
  ];
  
  const handleAvailabilityChange = (checked: boolean) => {
    setAvailable(checked);
    setUserProfile({
      ...userProfile,
      available: checked
    });
    
    toast.info(checked ? "You are now available for jobs" : "You are now unavailable for jobs");
  };

  const handleSkillChange = (value: string) => {
    if (skills.includes(value)) {
      setSkills(skills.filter(skill => skill !== value));
    } else {
      setSkills([...skills, value]);
    }
  };

  const startEditing = () => {
    setName(userProfile?.name || '');
    setAge(userProfile?.age?.toString() || '');
    setWorkersCount(userProfile?.workersCount?.toString() || '1');
    setAddress(userProfile?.address || '');
    setSkills(userProfile?.skills || []);
    setOtherSkill(userProfile?.otherSkill || '');
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setIsEditing(false);
  };

  const saveChanges = () => {
    if (!name) {
      toast.error("Please enter your name");
      return;
    }
    
    if (!age || isNaN(Number(age))) {
      toast.error("Please enter a valid age");
      return;
    }
    
    if (!workersCount || isNaN(Number(workersCount)) || Number(workersCount) < 1) {
      toast.error("Please enter a valid number of workers");
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
      workersCount: Number(workersCount),
      address,
      skills,
      otherSkill
    });

    toast.success("Profile updated successfully");
    setIsEditing(false);
  };

  // Helper function to get KYC status badge
  const getKycStatusBadge = () => {
    if (!userProfile?.kycSubmittedAt) {
      return <Badge variant="outline" className="bg-gray-100">Not Submitted</Badge>;
    }
    
    switch (userProfile.kycStatus) {
      case 'approved':
        return <Badge variant="outline" className="bg-green-100 text-green-800">Verified <ShieldCheck className="ml-1 h-3 w-3" /></Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-red-100 text-red-800">Rejected <AlertTriangle className="ml-1 h-3 w-3" /></Badge>;
      case 'pending':
      default:
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800">Pending <Clock className="ml-1 h-3 w-3" /></Badge>;
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">{t('dashboard')}</h1>
      
      <div className="grid grid-cols-1 gap-6 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg">Profile Details</CardTitle>
            {!isEditing ? (
              <Button variant="ghost" size="sm" onClick={startEditing}>
                <FileEdit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            ) : (
              <div className="flex space-x-2">
                <Button variant="ghost" size="sm" onClick={cancelEditing}>
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button variant="ghost" size="sm" onClick={saveChanges}>
                  <Save className="h-4 w-4 mr-2" />
                  Save
                </Button>
              </div>
            )}
          </CardHeader>
          <CardContent>
            {!isEditing ? (
              <div className="space-y-4">
                <div className="flex items-center">
                  <UserRound className="h-5 w-5 text-gray-500 mr-3" />
                  <div>
                    <div className="font-medium">{userProfile?.name}</div>
                    <div className="text-sm text-gray-500">Age: {userProfile?.age}</div>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 text-gray-500 mr-3 mt-0.5" />
                  <div>
                    <div className="font-medium">Address</div>
                    <div className="text-sm text-gray-500">{userProfile?.address}</div>
                  </div>
                </div>
                
                <div>
                  <div className="font-medium mb-2">Number of Workers</div>
                  <div className="text-gray-600">{userProfile?.workersCount || 1}</div>
                </div>
                
                <div>
                  <div className="font-medium mb-2">Skills</div>
                  <div className="flex flex-wrap gap-1">
                    {userProfile?.skills?.map(skill => {
                      const skillOption = skillOptions.find(option => option.value === skill);
                      return (
                        <Badge key={skill} variant="secondary" className="rounded-full px-3 py-1">
                          {skill === 'other' ? userProfile.otherSkill : skillOption?.label}
                        </Badge>
                      );
                    })}
                  </div>
                </div>
                
                <div>
                  <div className="font-medium mb-2">KYC Status</div>
                  <div className="flex items-center space-x-2">
                    {getKycStatusBadge()}
                    {!userProfile?.kycSubmittedAt && (
                      <Button variant="outline" size="sm" onClick={() => toast.info("Redirecting to KYC verification")}>
                        Complete KYC
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="edit-name">Name</Label>
                  <Input
                    id="edit-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full"
                  />
                </div>
                
                <div>
                  <Label htmlFor="edit-age">Age</Label>
                  <Input
                    id="edit-age"
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    className="w-full"
                  />
                </div>
                
                <div>
                  <Label htmlFor="edit-workers-count">Number of Workers</Label>
                  <Input
                    id="edit-workers-count"
                    type="number"
                    value={workersCount}
                    min="1"
                    onChange={(e) => setWorkersCount(e.target.value)}
                    className="w-full"
                  />
                  <p className="text-sm text-gray-500 mt-1">Including yourself</p>
                </div>
                
                <div>
                  <Label htmlFor="edit-address">Address</Label>
                  <Textarea
                    id="edit-address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full"
                    rows={3}
                  />
                </div>
                
                <div>
                  <Label>Skills</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {skillOptions.map((skill) => (
                      <div key={skill.value} className="flex items-center space-x-2">
                        <Checkbox
                          id={`edit-skill-${skill.value}`}
                          checked={skills.includes(skill.value)}
                          onCheckedChange={() => handleSkillChange(skill.value)}
                        />
                        <Label htmlFor={`edit-skill-${skill.value}`}>{skill.label}</Label>
                      </div>
                    ))}
                  </div>
                  
                  {skills.includes('other') && (
                    <div className="mt-2">
                      <Label htmlFor="edit-other-skill">Specify Other Skill</Label>
                      <Input
                        id="edit-other-skill"
                        value={otherSkill}
                        onChange={(e) => setOtherSkill(e.target.value)}
                        className="w-full"
                      />
                    </div>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">{t('available')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Switch
                id="availability"
                checked={available}
                onCheckedChange={handleAvailabilityChange}
              />
              <Label htmlFor="availability">
                {available ? "Available for jobs" : "Not available for jobs"}
              </Label>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Payment Status</CardTitle>
          </CardHeader>
          <CardContent>
            {userProfile?.paymentCompleted ? (
              <div className="text-green-600 font-medium">Registration fee paid</div>
            ) : (
              <div>
                <div className="text-amber-600 font-medium mb-2">Registration fee pending</div>
                <Button size="sm" onClick={() => toast.info("Redirecting to payment")}>
                  Pay Now
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{t('nearby_jobs')}</CardTitle>
        </CardHeader>
        <CardContent>
          {!userProfile?.paymentCompleted && (
            <div className="text-center p-4 bg-amber-50 rounded-md mb-4">
              <p className="text-amber-600">
                Complete your payment to receive job notifications
              </p>
            </div>
          )}
          
          {!available && (
            <div className="text-center p-4 bg-gray-50 rounded-md mb-4">
              <p className="text-gray-600">
                Toggle availability to receive job notifications
              </p>
            </div>
          )}
          
          {userProfile?.paymentCompleted && available && (
            <div className="text-center p-8">
              <p className="text-gray-500">No job requests at the moment</p>
              <p className="text-sm text-gray-400 mt-2">
                You'll be notified when a customer requests a service near you
              </p>
            </div>
          )}
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">{t('past_work')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center p-4">
              <p className="text-gray-500">No past work yet</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">{t('reviews')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center p-4">
              <p className="text-gray-500">No reviews yet</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WorkerDashboard;
