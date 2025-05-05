
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bell, CheckCircle, AlertTriangle, Info, X } from 'lucide-react';

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'info' | 'success' | 'warning';
  read: boolean;
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'New Worker Registration',
    message: 'A new worker has registered and needs approval',
    time: '5 minutes ago',
    type: 'info',
    read: false
  },
  {
    id: '2',
    title: 'Booking Completed',
    message: 'Job #12345 was completed successfully',
    time: '1 hour ago',
    type: 'success',
    read: false
  },
  {
    id: '3',
    title: 'Payment Issue',
    message: 'Failed payment for worker onboarding from user John Doe',
    time: '2 hours ago',
    type: 'warning',
    read: false
  },
  {
    id: '4',
    title: 'System Update',
    message: 'System maintenance scheduled for tomorrow at 2 AM',
    time: 'Yesterday',
    type: 'info',
    read: true
  },
  {
    id: '5',
    title: 'New Customer',
    message: 'New customer registration: Jane Smith',
    time: '2 days ago',
    type: 'info',
    read: true
  },
];

const AdminNotificationsPage = () => {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  
  const unreadCount = notifications.filter(n => !n.read).length;
  
  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
  };
  
  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };
  
  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      case 'info':
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Notifications</h1>
        {unreadCount > 0 && (
          <Button variant="outline" onClick={markAllAsRead}>
            Mark all as read
          </Button>
        )}
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            System Notifications
            {unreadCount > 0 && (
              <span className="bg-primary text-white text-xs rounded-full px-2 py-1">
                {unreadCount} new
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <TabsList className="mb-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="unread">Unread ({unreadCount})</TabsTrigger>
            </TabsList>
            <TabsContent value="all">
              <div className="space-y-4">
                {notifications.map((notification) => (
                  <div 
                    key={notification.id}
                    className={`flex items-start gap-3 p-3 rounded-lg ${
                      notification.read ? 'bg-gray-50' : 'bg-blue-50'
                    }`}
                  >
                    <div className="flex-shrink-0 mt-1">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-grow">
                      <div className="flex justify-between">
                        <h3 className="font-semibold">{notification.title}</h3>
                        <span className="text-xs text-muted-foreground">{notification.time}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{notification.message}</p>
                    </div>
                    {!notification.read && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="flex-shrink-0 h-8 w-8 p-0" 
                        onClick={() => markAsRead(notification.id)}
                      >
                        <X className="h-4 w-4" />
                        <span className="sr-only">Mark as read</span>
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="unread">
              <div className="space-y-4">
                {notifications.filter(n => !n.read).length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No unread notifications
                  </div>
                ) : (
                  notifications
                    .filter(n => !n.read)
                    .map((notification) => (
                      <div 
                        key={notification.id}
                        className="flex items-start gap-3 p-3 rounded-lg bg-blue-50"
                      >
                        <div className="flex-shrink-0 mt-1">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-grow">
                          <div className="flex justify-between">
                            <h3 className="font-semibold">{notification.title}</h3>
                            <span className="text-xs text-muted-foreground">{notification.time}</span>
                          </div>
                          <p className="text-sm text-muted-foreground">{notification.message}</p>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="flex-shrink-0 h-8 w-8 p-0" 
                          onClick={() => markAsRead(notification.id)}
                        >
                          <X className="h-4 w-4" />
                          <span className="sr-only">Mark as read</span>
                        </Button>
                      </div>
                    ))
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminNotificationsPage;
