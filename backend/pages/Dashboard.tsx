import React from 'react';
import { useUser } from '@/contexts/UserContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import OrderManagement from '@/components/staff/OrderManagement';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Package, Settings, History } from 'lucide-react';

const Dashboard = () => {
  const { user, signOut, isStudent, isStaff } = useUser();
  const navigate = useNavigate();
  
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <CardHeader>
            <CardTitle>Not Authenticated</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">You need to login to access this page</p>
            <Button onClick={() => navigate('/login')}>Go to Login</Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-bufc-gray p-4">
      <div className="max-w-6xl mx-auto">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-2xl">
              {isStudent && "Student Dashboard"}
              {isStaff && "Staff Dashboard"}
              {!isStudent && !isStaff && "Dashboard"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <p className="font-semibold">Welcome, {user.email}</p>
              <p className="text-gray-500">
                User ID: {user.id}
              </p>
              <p className="text-gray-500">
                Role: {isStudent ? "Student" : isStaff ? "Staff" : "User"}
              </p>
            </div>
            
            {isStudent && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <Card className="p-4 bg-bufc-lightblue hover:shadow-md transition-all cursor-pointer">
                  <h3 className="font-bold mb-2">Place an Order</h3>
                  <p className="text-sm">Browse the menu and place your food orders</p>
                </Card>
                <Card className="p-4 bg-bufc-lightblue hover:shadow-md transition-all cursor-pointer">
                  <h3 className="font-bold mb-2">Order History</h3>
                  <p className="text-sm">View your past orders and track current orders</p>
                </Card>
              </div>
            )}
            
            {isStaff && (
              <Tabs defaultValue="orders" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="orders" className="flex items-center gap-2">
                    <Package className="h-4 w-4" />
                    Orders
                  </TabsTrigger>
                  <TabsTrigger value="history" className="flex items-center gap-2">
                    <History className="h-4 w-4" />
                    History
                  </TabsTrigger>
                  <TabsTrigger value="settings" className="flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    Settings
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="orders">
                  <OrderManagement />
                </TabsContent>
                <TabsContent value="history">
                  <Card>
                    <CardHeader>
                      <CardTitle>Order History</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>Order history and analytics will be displayed here.</p>
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="settings">
                  <Card>
                    <CardHeader>
                      <CardTitle>Staff Settings</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>Staff settings and preferences will be displayed here.</p>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            )}
            
            <Button onClick={signOut} variant="outline" className="mt-4">Sign Out</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
