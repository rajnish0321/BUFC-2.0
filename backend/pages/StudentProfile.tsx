import React, { useState } from 'react';
import { useUser } from '@/contexts/UserContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { User, Mail, Phone, Camera, Award } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const StudentProfile = () => {
  const { user } = useUser();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // TODO: Implement profile update functionality
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
      setIsEditing(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <motion.div 
        className="grid grid-cols-1 lg:grid-cols-12 gap-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Left Column - Profile Overview */}
        <motion.div
          variants={itemVariants}
          className="lg:col-span-4 space-y-6"
        >
          {/* Profile Card */}
          <Card className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white overflow-hidden relative">
            <motion.div
              className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"
              animate={{
                backgroundPosition: ['0% 0%', '100% 100%'],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            />
            <CardContent className="pt-6 relative">
              <div className="flex flex-col items-center space-y-4">
                <motion.div 
                  className="relative"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Avatar className="h-32 w-32 border-4 border-white shadow-lg">
                    <AvatarImage src={user?.avatar} />
                    <AvatarFallback className="text-3xl bg-white/10 text-white">
                      {user?.name?.charAt(0)?.toUpperCase() || 'S'}
                    </AvatarFallback>
                  </Avatar>
                  <motion.button 
                    className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Camera className="h-4 w-4 text-blue-600" />
                  </motion.button>
                </motion.div>
                <motion.div 
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <h2 className="text-2xl font-bold">{user?.name}</h2>
                  <p className="text-blue-100">Student</p>
                </motion.div>
                <motion.div 
                  className="w-full pt-4 border-t border-white/20"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="flex items-center justify-center space-x-2 text-sm">
                    <Award className="h-4 w-4" />
                    <span>Verified Student</span>
                  </div>
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Right Column - Profile Settings */}
        <motion.div
          variants={itemVariants}
          className="lg:col-span-8 space-y-6"
        >
          {/* Profile Settings Card */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <CardTitle className="text-2xl font-bold">Profile Settings</CardTitle>
                  <p className="text-sm text-gray-500 mt-1">
                    Manage your account settings and preferences
                  </p>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <Button
                    variant={isEditing ? "outline" : "default"}
                    onClick={() => setIsEditing(!isEditing)}
                    className={isEditing ? "bg-white text-blue-600 border-blue-600 hover:bg-blue-50" : "bg-blue-600 hover:bg-blue-700"}
                  >
                    {isEditing ? "Cancel Editing" : "Edit Profile"}
                  </Button>
                </motion.div>
              </div>
            </CardHeader>
            <CardContent>
              <motion.form 
                onSubmit={handleSubmit} 
                className="space-y-6"
                variants={containerVariants}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name Field */}
                  <motion.div 
                    className="space-y-2"
                    variants={itemVariants}
                  >
                    <Label htmlFor="name" className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Full Name
                    </Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      disabled={!isEditing}
                      className="bg-gray-50"
                    />
                  </motion.div>

                  {/* Email Field */}
                  <motion.div 
                    className="space-y-2"
                    variants={itemVariants}
                  >
                    <Label htmlFor="email" className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      disabled
                      className="bg-gray-50"
                    />
                  </motion.div>

                  {/* Phone Field */}
                  <motion.div 
                    className="space-y-2"
                    variants={itemVariants}
                  >
                    <Label htmlFor="phone" className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      Phone Number
                    </Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      disabled={!isEditing}
                      className="bg-gray-50"
                    />
                  </motion.div>
                </div>

                <AnimatePresence>
                  {isEditing && (
                    <motion.div 
                      className="flex justify-end"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                    >
                      <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                        Save Changes
                      </Button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.form>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default StudentProfile; 