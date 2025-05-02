
import React from 'react';
import { Bell, Search, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const AdminHeader = () => {
  return (
    <header className="bg-white border-b px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-4 w-1/3">
        <div className="relative w-full">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
          <Input 
            placeholder="Search..." 
            className="w-full pl-9"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="rounded-full">
          <Bell className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Settings className="h-5 w-5" />
        </Button>
        <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white font-medium">
          A
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
