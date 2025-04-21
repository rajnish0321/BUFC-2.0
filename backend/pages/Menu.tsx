import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Minus, Filter, ShoppingCart, X, CreditCard, Wallet, Banknote, LogIn, Search, Star, Leaf, Clock, Utensils } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/contexts/UserContext';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { motion, AnimatePresence } from "framer-motion";
import { createOrder } from '../lib/orders';

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  stallName: string;
  category: string;
  image?: string;
  veg: boolean;
  bestSeller: boolean;
  outlet: string;
}

const Menu = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useUser();
  
  // Check if we're in the dashboard or public route
  const isDashboard = location.pathname.includes('/dashboard');

  const searchParams = new URLSearchParams(location.search);
  const outletParam = searchParams.get('outlet');
  
  const [selectedOutlet, setSelectedOutlet] = useState(outletParam || 'kathi-junction');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [cart, setCart] = useState<{
    [key: string]: {
      id: string;
      name: string;
      price: number;
      quantity: number;
      outlet: string;
    }
  }>({});
  
  const { toast } = useToast();
  
  const [searchTerm, setSearchTerm] = useState('');

  // Check if user is staff
  const isStaff = user?.role === 'staff';
  
  const handleOutletSelect = (outlet: string) => {
    setSelectedOutlet(outlet);
    setSelectedCategory('all');
  };
  
  // Filter menu items based on selected outlet and category
  const filteredItems = menuItems.filter(item => 
    item.outlet === selectedOutlet && 
    (selectedCategory === 'all' || item.category === selectedCategory)
  );
  
  // Get categories for the selected outlet
  const categories = ['all', ...new Set(menuItems
    .filter(item => item.outlet === selectedOutlet)
    .map(item => item.category))];
  
  const handleAddToCart = (item: typeof menuItems[0]) => {
    if (isStaff) {
      toast({
        title: "Access Denied",
        description: "Staff members cannot place orders.",
        variant: "destructive",
      });
      return;
    }

    setCart(prev => {
      const newCart = { ...prev };
      if (newCart[item.id]) {
        newCart[item.id].quantity += 1;
      } else {
        newCart[item.id] = {
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: 1,
          outlet: item.outlet
        };
      }
      return newCart;
    });
    
    toast({
      title: "Added to cart",
      description: `${item.name} has been added to your cart.`,
    });
  };
  
  const handleRemoveFromCart = (itemId: string) => {
    setCart(prev => {
      const newCart = { ...prev };
      if (newCart[itemId].quantity > 1) {
        newCart[itemId].quantity -= 1;
      } else {
        delete newCart[itemId];
      }
      return newCart;
    });
  };
  
  const getItemQuantityInCart = (itemId: string) => {
    return cart[itemId]?.quantity || 0;
  };
  
  const totalCartItems = Object.values(cart).reduce((sum, item) => sum + item.quantity, 0);
  
  // Calculate cart total
  const cartTotal = Object.values(cart).reduce((total, item) => {
    return total + (item.price * item.quantity);
  }, 0);

  const handlePaymentMethodSelect = (method: string) => {
    if (method === 'card' || method === 'upi') {
      toast({
        title: "Service Not Available",
        description: "Online payment services are currently not available. Please use cash on delivery.",
        variant: "destructive",
      });
      return;
    }
    setPaymentMethod(method);
  };

  const handleCheckout = async () => {
    if (!user) {
      toast({
        title: "Error",
        description: "Please log in to place an order",
        variant: "destructive",
      });
      return;
    }

    if (isStaff) {
    toast({
        title: "Access Denied",
        description: "Staff members cannot place orders.",
        variant: "destructive",
      });
      return;
    }

    if (Object.keys(cart).length === 0) {
      toast({
        title: "Error",
        description: "Your cart is empty",
        variant: "destructive",
      });
      return;
    }

    if (!paymentMethod) {
      toast({
        title: "Error",
        description: "Please select a payment method",
        variant: "destructive",
      });
      return;
    }

    if (paymentMethod === 'card' || paymentMethod === 'upi') {
      toast({
        title: "Service Not Available",
        description: "Online payment services are currently not available. Please use cash on delivery.",
        variant: "destructive",
      });
      return;
    }

    try {
      const orderItems = Object.values(cart).map(item => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price
      }));

      const total = Object.values(cart).reduce((total, item) => total + item.price * item.quantity, 0);

      const orderData = {
        user_id: user.id,
        items: orderItems,
        total: total,
        stall_name: selectedOutlet,
        payment_method: paymentMethod,
        status: 'pending' as const
      };

      console.log('Creating order with data:', orderData);
      const result = await createOrder(orderData);
      console.log('Order created:', result);

      toast({
        title: "Success",
        description: "Order placed successfully!",
      duration: 5000,
    });
    setCart({});
      navigate('/dashboard/student/orders');
    } catch (error) {
      console.error('Error placing order:', error);
      const errorMessage = error instanceof Error ? error.message : "Failed to place order. Please try again.";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
        duration: 5000,
      });
    }
  };

  const renderActionButtons = (item: MenuItem) => {
    if (isStaff) {
      return null; // Don't show add/remove buttons for staff
    }

    const quantity = getItemQuantityInCart(item.id);
  return (
      <div className="flex items-center gap-2">
        {quantity > 0 && (
          <>
          <Button 
              size="icon"
            variant="outline" 
              onClick={() => handleRemoveFromCart(item.id)}
              className="h-8 w-8"
            >
              <Minus size={16} />
            </Button>
            <span className="w-4 text-center">{quantity}</span>
          </>
        )}
        <Button
          size="icon"
          variant="outline"
          onClick={() => handleAddToCart(item)}
          className="h-8 w-8"
        >
          <Plus size={16} />
        </Button>
      </div>
    );
  };

  // Animation variants
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
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10
      }
    }
  };

  const imageVariants = {
    hover: {
      scale: 1.05,
      transition: {
        duration: 0.3
      }
    }
  };

  const buttonVariants = {
    hover: {
      scale: 1.05,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    },
    tap: {
      scale: 0.95
    }
  };

  return isDashboard ? (
    // If in dashboard, render without MainLayout
    <div className="bufc-container py-8">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex justify-between items-center mb-8"
      >
        <h1 className="text-3xl font-bold bg-gradient-to-r from-bufc-blue to-bufc-orange bg-clip-text text-transparent">Menu</h1>
        {!isStaff && (
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button 
              variant="outline" 
              className="flex items-center gap-2 relative shadow-md hover:shadow-lg transition-all"
            onClick={() => setIsCartOpen(true)}
          >
            <ShoppingCart size={18} />
            <span>View Cart</span>
            {totalCartItems > 0 && (
                <motion.span 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-2 -right-2 bg-bufc-orange text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
                >
                {totalCartItems}
                </motion.span>
            )}
          </Button>
          </motion.div>
        )}
      </motion.div>
        
        {/* Outlet Selection */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-8"
      >
        <Tabs 
          defaultValue={selectedOutlet} 
          className="mb-8"
          value={selectedOutlet}
        >
          <TabsList className="grid grid-cols-4 mb-4 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
            {outlets.map(outlet => (
              <TabsTrigger 
                key={outlet.id}
                value={outlet.id}
                onClick={() => handleOutletSelect(outlet.id)}
                className="data-[state=active]:bg-bufc-blue data-[state=active]:text-white relative rounded-md transition-all"
              >
                {outlet.name}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </motion.div>
        
        {/* Category Filters - Only shown for active outlet */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-8"
      >
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex items-center gap-2">
              <Filter size={18} className="text-gray-500" />
              <span className="font-medium">Filter by Category:</span>
            </div>
            <div className="w-full md:w-auto">
              <select
                className="w-full md:w-auto px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-bufc-blue"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                  </option>
              ))}
              </select>
            </div>
          </div>
        </div>
      </motion.div>
        
        {/* Menu Items */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
          {filteredItems.map((item) => (
          <motion.div
            key={item.id}
            variants={itemVariants}
            whileHover={{ y: -5 }}
            className="h-full"
          >
            <Card className="overflow-hidden h-full shadow-md hover:shadow-xl transition-all duration-300 border-0">
              <div className="h-48 overflow-hidden relative">
                <motion.img 
                  src={item.image} 
                  alt={item.name} 
                  className="w-full h-full object-cover"
                  variants={imageVariants}
                  whileHover="hover"
                />
                {item.bestSeller && (
                  <div className="absolute top-2 right-2 bg-bufc-orange text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                    <Star size={12} />
                    <span>Best Seller</span>
              </div>
                )}
                {item.veg && (
                  <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                    <Leaf size={12} />
                    <span>Veg</span>
                </div>
                    )}
                  </div>
              <CardContent className="p-4">
                <div className="flex flex-col gap-2">
                  <h3 className="font-semibold text-lg">{item.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{item.description}</p>
                  <div className="flex justify-between items-center mt-2">
                    <div className="flex items-center gap-1">
                      <span className="text-lg font-bold text-bufc-blue">₹{item.price.toFixed(2)}</span>
                    </div>
                    <motion.div
                      variants={buttonVariants}
                      whileHover="hover"
                      whileTap="tap"
                    >
                      {renderActionButtons(item)}
                    </motion.div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
      
      {filteredItems.length === 0 && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-md"
        >
          <Utensils size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-lg text-gray-600 dark:text-gray-300">No items available in this category.</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Try selecting a different category or outlet.</p>
        </motion.div>
      )}

      {/* Cart Modal */}
      <Dialog open={isCartOpen} onOpenChange={setIsCartOpen}>
        <DialogContent className="sm:max-w-[500px] h-[85vh] p-0 flex flex-col">
          <DialogHeader className="flex-none p-6 border-b">
            <DialogTitle className="flex items-center gap-2">
              <ShoppingCart size={20} />
              Your Cart
            </DialogTitle>
          </DialogHeader>
          
          <div className="flex-1 overflow-y-auto px-6">
            {Object.values(cart).length > 0 ? (
              <div className="space-y-4">
                {/* Cart Items - Scrollable */}
                <div className="space-y-3 py-4">
                  {Object.values(cart).map((item) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-sm"
                    >
                      <div>
                        <h3 className="font-medium">{item.name}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">₹{item.price} × {item.quantity}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold">₹{item.price * item.quantity}</p>
                      <div className="flex items-center space-x-2">
                        <Button 
                          variant="outline" 
                          size="icon" 
                          className="h-8 w-8"
                          onClick={() => handleRemoveFromCart(item.id)}
                        >
                          <Minus size={16} />
                        </Button>
                          <span className="w-6 text-center">{item.quantity}</span>
                        <Button 
                          variant="outline" 
                          size="icon" 
                          className="h-8 w-8 bg-bufc-blue text-white hover:bg-blue-700 border-bufc-blue"
                            onClick={() => handleAddToCart(menuItems.find(i => i.id === item.id)!)}
                        >
                          <Plus size={16} />
                        </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
                      </div>
                    ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-8"
              >
                <ShoppingCart size={40} className="mx-auto mb-4 text-gray-400" />
                <p className="text-gray-600 dark:text-gray-300">Your cart is empty</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Add some delicious items to your cart!</p>
              </motion.div>
            )}
          </div>

          {/* Fixed Bottom Section */}
          <div className="flex-none border-t bg-white dark:bg-gray-900 p-6">
            {Object.values(cart).length > 0 && (
              <>
                {user ? (
                  <>
                    {/* Payment Method Selection */}
                    <div className="mb-6">
                      <h3 className="font-medium mb-3">Select Payment Method</h3>
                      <RadioGroup value={paymentMethod} onValueChange={handlePaymentMethodSelect} className="gap-2">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="cash" id="cash" />
                          <Label htmlFor="cash" className="flex items-center gap-2">
                            <Banknote className="h-4 w-4" />
                            Cash on Delivery
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="card" id="card" />
                          <Label htmlFor="card" className="flex items-center gap-2">
                            <CreditCard className="h-4 w-4" />
                            Card Payment
                            <span className="text-xs text-red-500">(Not Available)</span>
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="upi" id="upi" />
                          <Label htmlFor="upi" className="flex items-center gap-2">
                            <Wallet className="h-4 w-4" />
                            UPI Payment
                            <span className="text-xs text-red-500">(Not Available)</span>
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>

                    {/* Cart Summary */}
                    <div className="space-y-2 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                        <span>₹{cartTotal}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600 dark:text-gray-400">Delivery Fee</span>
                        <span>₹20</span>
                      </div>
                      <div className="flex justify-between font-bold text-lg pt-2 border-t border-gray-200 dark:border-gray-700">
                        <span>Total</span>
                        <span>₹{cartTotal + 20}</span>
                      </div>
                    </div>

                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button 
                        className="w-full bg-bufc-blue hover:bg-blue-700 mt-6 shadow-md"
                        onClick={handleCheckout}
                      >
                        Place Order (₹{cartTotal + 20})
                      </Button>
                    </motion.div>
                  </>
                ) : (
                  <div className="text-center">
                    <div className="mb-4">
                      <LogIn size={40} className="mx-auto text-gray-400 mb-2" />
                      <p className="text-gray-600 dark:text-gray-300 mb-2">Please login to complete your order</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Your cart will be saved</p>
                    </div>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button 
                        className="w-full bg-bufc-blue hover:bg-blue-700 shadow-md"
                        onClick={() => {
                          setIsCartOpen(false);
                          navigate('/login');
                        }}
                      >
                        Login to Continue
                      </Button>
                    </motion.div>
                  </div>
                )}
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  ) : (
    // If public route, wrap with MainLayout
    <MainLayout>
      <div className="bufc-container py-8 mt-16">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-between items-center mb-8"
        >
          <h1 className="text-3xl font-bold bg-gradient-to-r from-bufc-blue to-bufc-orange bg-clip-text text-transparent">Menu</h1>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button 
              variant="outline" 
              className="flex items-center gap-2 relative shadow-md hover:shadow-lg transition-all"
              onClick={() => setIsCartOpen(true)}
            >
              <ShoppingCart size={18} />
              <span>View Cart</span>
              {totalCartItems > 0 && (
                <motion.span 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-2 -right-2 bg-bufc-orange text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
                >
                  {totalCartItems}
                </motion.span>
              )}
            </Button>
          </motion.div>
        </motion.div>
        
        {/* Outlet Selection */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <Tabs 
            defaultValue={selectedOutlet} 
            className="mb-8"
            value={selectedOutlet}
          >
            <TabsList className="grid grid-cols-4 mb-4 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
              {outlets.map(outlet => (
                <TabsTrigger 
                  key={outlet.id}
                  value={outlet.id}
                  onClick={() => handleOutletSelect(outlet.id)}
                  className="data-[state=active]:bg-bufc-blue data-[state=active]:text-white relative rounded-md transition-all"
                >
                  {outlet.name}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </motion.div>
        
        {/* Category Filters - Only shown for active outlet */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-4">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex items-center gap-2">
                <Filter size={18} className="text-gray-500" />
                <span className="font-medium">Filter by Category:</span>
              </div>
              <div className="w-full md:w-auto">
                <select
                  className="w-full md:w-auto px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-bufc-blue"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* Menu Items */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredItems.map((item) => (
            <motion.div
              key={item.id}
              variants={itemVariants}
              whileHover={{ y: -5 }}
              className="h-full"
            >
              <Card className="overflow-hidden h-full shadow-md hover:shadow-xl transition-all duration-300 border-0">
                <div className="h-48 overflow-hidden relative">
                  <motion.img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-full h-full object-cover"
                    variants={imageVariants}
                    whileHover="hover"
                  />
                  {item.bestSeller && (
                    <div className="absolute top-2 right-2 bg-bufc-orange text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                      <Star size={12} />
                      <span>Best Seller</span>
                    </div>
                  )}
                  {item.veg && (
                    <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                      <Leaf size={12} />
                      <span>Veg</span>
                    </div>
                  )}
                </div>
                <CardContent className="p-4">
                  <div className="flex flex-col gap-2">
                    <h3 className="font-semibold text-lg">{item.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{item.description}</p>
                    <div className="flex justify-between items-center mt-2">
                      <div className="flex items-center gap-1">
                        <span className="text-lg font-bold text-bufc-blue">₹{item.price.toFixed(2)}</span>
                      </div>
                      <motion.div
                        variants={buttonVariants}
                        whileHover="hover"
                        whileTap="tap"
                      >
                        {renderActionButtons(item)}
                      </motion.div>
                  </div>
                </div>
              </CardContent>
            </Card>
            </motion.div>
          ))}
        </motion.div>
        
        {filteredItems.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-md"
          >
            <Utensils size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-lg text-gray-600 dark:text-gray-300">No items available in this category.</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Try selecting a different category or outlet.</p>
          </motion.div>
        )}

        {/* Cart Modal - Same as above */}
        <Dialog open={isCartOpen} onOpenChange={setIsCartOpen}>
          <DialogContent className="sm:max-w-[500px] h-[85vh] p-0 flex flex-col">
            <DialogHeader className="flex-none p-6 border-b">
              <DialogTitle className="flex items-center gap-2">
                <ShoppingCart size={20} />
                Your Cart
              </DialogTitle>
            </DialogHeader>
            
            <div className="flex-1 overflow-y-auto px-6">
              {Object.values(cart).length > 0 ? (
                <div className="space-y-4">
                  {/* Cart Items - Scrollable */}
                  <div className="space-y-3 py-4">
                    {Object.values(cart).map((item) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-sm"
                      >
                        <div>
                          <h3 className="font-medium">{item.name}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">₹{item.price} × {item.quantity}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold">₹{item.price * item.quantity}</p>
                          <div className="flex items-center space-x-2">
                            <Button 
                              variant="outline" 
                              size="icon" 
                              className="h-8 w-8"
                              onClick={() => handleRemoveFromCart(item.id)}
                            >
                              <Minus size={16} />
                            </Button>
                            <span className="w-6 text-center">{item.quantity}</span>
                            <Button 
                              variant="outline" 
                              size="icon" 
                              className="h-8 w-8 bg-bufc-blue text-white hover:bg-blue-700 border-bufc-blue"
                              onClick={() => handleAddToCart(menuItems.find(i => i.id === item.id)!)}
                            >
                              <Plus size={16} />
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-8"
                >
                  <ShoppingCart size={40} className="mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-600 dark:text-gray-300">Your cart is empty</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Add some delicious items to your cart!</p>
                </motion.div>
              )}
            </div>

            {/* Fixed Bottom Section */}
            <div className="flex-none border-t bg-white dark:bg-gray-900 p-6">
              {Object.values(cart).length > 0 && (
                <>
                  {user ? (
                    <>
                      {/* Payment Method Selection */}
                      <div className="mb-6">
                        <h3 className="font-medium mb-3">Select Payment Method</h3>
                        <RadioGroup value={paymentMethod} onValueChange={handlePaymentMethodSelect} className="gap-2">
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="cash" id="cash" />
                            <Label htmlFor="cash" className="flex items-center gap-2">
                              <Banknote className="h-4 w-4" />
                              Cash on Delivery
                            </Label>
                          </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="card" id="card" />
                              <Label htmlFor="card" className="flex items-center gap-2">
                              <CreditCard className="h-4 w-4" />
                                Card Payment
                              <span className="text-xs text-red-500">(Not Available)</span>
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="upi" id="upi" />
                              <Label htmlFor="upi" className="flex items-center gap-2">
                              <Wallet className="h-4 w-4" />
                                UPI Payment
                              <span className="text-xs text-red-500">(Not Available)</span>
                              </Label>
                          </div>
                        </RadioGroup>
                      </div>

                      {/* Cart Summary */}
                      <div className="space-y-2 bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                          <span>₹{cartTotal}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600 dark:text-gray-400">Delivery Fee</span>
                          <span>₹20</span>
                        </div>
                        <div className="flex justify-between font-bold text-lg pt-2 border-t border-gray-200 dark:border-gray-700">
                          <span>Total</span>
                          <span>₹{cartTotal + 20}</span>
                        </div>
                      </div>

                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                      <Button 
                          className="w-full bg-bufc-blue hover:bg-blue-700 mt-6 shadow-md"
                        onClick={handleCheckout}
                      >
                        Place Order (₹{cartTotal + 20})
                      </Button>
                      </motion.div>
                    </>
                  ) : (
                    <div className="text-center">
                      <div className="mb-4">
                        <LogIn size={40} className="mx-auto text-gray-400 mb-2" />
                        <p className="text-gray-600 dark:text-gray-300 mb-2">Please login to complete your order</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Your cart will be saved</p>
                      </div>
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                      <Button 
                          className="w-full bg-bufc-blue hover:bg-blue-700 shadow-md"
                        onClick={() => {
                          setIsCartOpen(false);
                          navigate('/login');
                        }}
                      >
                        Login to Continue
                      </Button>
                      </motion.div>
                    </div>
                  )}
                </>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
};

// Updated outlets data
const outlets = [
  {
    id: 'kathi-junction',
    name: 'Kathi Junction',
    comingSoon: false
  },
  {
    id: 'southern',
    name: 'Southern',
    comingSoon: false
  },
  {
    id: 'snapeats',
    name: 'SnapEats',
    comingSoon: false
  },
  {
    id: 'dominos',
    name: 'Dominos',
    comingSoon: false
  }
];

// Sample menu items data - only Kathi Junction is active
const menuItems: MenuItem[] = [
  // Kathi Junction Items
  {
    id: 'kj-1',
    name: 'Paneer Kathi Roll',
    description: 'Soft paneer with spices wrapped in a fresh paratha.',
    price: 120,
    veg: true,
    bestSeller: true,
    category: 'rolls',
    outlet: 'kathi-junction',
    stallName: 'Kathi Junction',
    image: 'https://simpleindianmeals.com/wp-content/uploads/2021/06/Paneer-Kathi-Roll-500x500.jpg'
  },
  {
    id: 'kj-2',
    name: 'Chicken Kathi Roll',
    description: 'Juicy chicken pieces marinated with spices and wrapped in a fresh paratha.',
    price: 150,
    veg: false,
    bestSeller: true,
    category: 'rolls',
    outlet: 'kathi-junction',
    stallName: 'Kathi Junction',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTb4czqjheaYurDAxSuu689Zk03vH5o8-fCug&s'
  },
  {
    id: 'kj-3',
    name: 'Egg Kathi Roll',
    description: 'Delicious egg wrap with vegetables and special spices.',
    price: 100,
    veg: false,
    bestSeller: false,
    category: 'rolls',
    outlet: 'kathi-junction',
    stallName: 'Kathi Junction',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTiux7X9Or5giWrXG0yapEpswypBkcnNJDHqQ&s'
  },
  {
    id: 'kj-4',
    name: 'Mushroom Kathi Roll',
    description: 'Sautéed mushrooms with onions and spices in a paratha.',
    price: 110,
    veg: true,
    bestSeller: false,
    category: 'rolls',
    outlet: 'kathi-junction',
    stallName: 'Kathi Junction',
    image: 'https://cdn.cdnparenting.com/articles/2018/11/03152831/New-Project47-1024x700.webp'
  },
  {
    id: 'kj-5',
    name: 'French Fries',
    description: 'Crispy golden fries served with ketchup.',
    price: 80,
    veg: true,
    bestSeller: false,
    category: 'sides',
    outlet: 'kathi-junction',
    stallName: 'Kathi Junction',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS8ae8p5fO5SDVCFj-xEWTJaECdaCkzSx0jsA&s'
  },
  {
    id: 'kj-6',
    name: 'Masala Cola',
    description: 'Refreshing cola with a spicy twist.',
    price: 40,
    veg: true,
    bestSeller: false,
    category: 'beverages',
    outlet: 'kathi-junction',
    stallName: 'Kathi Junction',
    image: 'https://img-global.cpcdn.com/recipes/c0837579b360054e/680x482cq70/masala-cola-recipe-main-photo.jpg'
  },
  {
    id: 'kj-7',
    name: 'Lemonade',
    description: 'Fresh squeezed lemonade with mint.',
    price: 50,
    veg: true,
    bestSeller: false,
    category: 'beverages',
    outlet: 'kathi-junction',
    stallName: 'Kathi Junction',
    image: 'https://api.pizzahut.io/v1/content/en-in/in-1/images/drink/masala-lemonade.671f99d3f05e6a9bfa620046ac5168c4.1.jpg'
  },

  // Southern Items
  {
    id: 's-1',
    name: 'Masala Dosa',
    description: 'Crispy rice crepe filled with spiced potato filling.',
    price: 110,
    veg: true,
    bestSeller: true,
    category: 'dosa',
    outlet: 'southern',
    stallName: 'Southern',
    image: 'https://www.cookwithmanali.com/wp-content/uploads/2020/05/Masala-Dosa.jpg'
  },
  {
    id: 's-2',
    name: 'Idli Sambar',
    description: 'Soft steamed rice cakes served with lentil soup and chutneys.',
    price: 80,
    veg: true,
    bestSeller: true,
    category: 'idli',
    outlet: 'southern',
    stallName: 'Southern',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSd_q_aLnvh4fo0wMaDx712JYym79oXimH60w&s'
  },
  {
    id: 's-3',
    name: 'Rava Uttapam',
    description: 'Savory semolina pancake with vegetables.',
    price: 90,
    veg: true,
    bestSeller: false,
    category: 'uttapam',
    outlet: 'southern',
    stallName: 'Southern',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSREbM3aQMVeiXpZSV6_ijJdtneR71OuxkVJg&s'
  },
  {
    id: 's-4',
    name: 'Pongal',
    description: 'Creamy rice and lentil porridge with pepper and cumin.',
    price: 70,
    veg: true,
    bestSeller: false,
    category: 'breakfast',
    outlet: 'southern',
    stallName: 'Southern',
    image: 'https://www.indianhealthyrecipes.com/wp-content/uploads/2021/01/pongal-ven-pongal.jpg'
  },
  {
    id: 's-5',
    name: 'Vada',
    description: 'Crispy lentil fritters served with sambar and chutneys.',
    price: 60,
    veg: true,
    bestSeller: false,
    category: 'snacks',
    outlet: 'southern',
    stallName: 'Southern',
    image: 'https://c.ndtvimg.com/2023-09/u113o4r_medu-vada_625x300_06_September_23.jpg'
  },
  {
    id: 's-6',
    name: 'Filter Coffee',
    description: 'Traditional South Indian filter coffee.',
    price: 50,
    veg: true,
    bestSeller: false,
    category: 'beverages',
    outlet: 'southern',
    stallName: 'Southern',
    image: 'https://www.sharmispassions.com/wp-content/uploads/2012/01/filter-coffee-recipe8.jpg'
  },
  {
    id: 's-7',
    name: 'Masala Chai',
    description: 'Spiced Indian tea with milk.',
    price: 40,
    veg: true,
    bestSeller: false,
    category: 'beverages',
    outlet: 'southern',
    stallName: 'Southern',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQsf-pUa1Bemy2CbrIu7hwnuu-ffu64Ug1Lxg&s'
  },

  // SnapEats Items
  {
    id: 'se-1',
    name: 'Chicken Burger',
    description: 'Juicy chicken patty with fresh vegetables in a soft bun.',
    price: 130,
    veg: false,
    bestSeller: true,
    category: 'burgers',
    outlet: 'snapeats',
    stallName: 'SnapEats',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSV8_Q9_dhNnojwi4KjDfPCyRs3ceY0QqGD4g&s'
  },
  {
    id: 'se-2',
    name: 'Veg Burger',
    description: 'Crispy vegetable patty with fresh vegetables in a soft bun.',
    price: 110,
    veg: true,
    bestSeller: true,
    category: 'burgers',
    outlet: 'snapeats',
    stallName: 'SnapEats',
    image: 'https://www.vegrecipesofindia.com/wp-content/uploads/2020/12/burger-recipe-1-500x500.jpg'
  },
  {
    id: 'se-3',
    name: 'Chicken Wrap',
    description: 'Grilled chicken with fresh vegetables in a tortilla.',
    price: 120,
    veg: false,
    bestSeller: false,
    category: 'wraps',
    outlet: 'snapeats',
    stallName: 'SnapEats',
    image: 'https://www.licious.in/blog/wp-content/uploads/2020/12/Chicken-Wrap.jpg'
  },
  {
    id: 'se-4',
    name: 'French Fries',
    description: 'Crispy golden fries with seasoning.',
    price: 70,
    veg: true,
    bestSeller: false,
    category: 'sides',
    outlet: 'snapeats',
    stallName: 'SnapEats',
    image: 'https://crownful.s3.amazonaws.com/recipe/6c46024a2d6a4a6499c5a1a62d8cdd5b.png'
  },
  {
    id: 'se-5',
    name: 'Onion Rings',
    description: 'Crispy battered onion rings.',
    price: 80,
    veg: true,
    bestSeller: false,
    category: 'sides',
    outlet: 'snapeats',
    stallName: 'SnapEats',
    image: 'https://assets-jpcust.jwpsrv.com/thumbnails/7uPbomRC-720.jpg'
  },
  {
    id: 'se-6',
    name: 'Milkshake',
    description: 'Creamy milkshake in various flavors.',
    price: 80,
    veg: true,
    bestSeller: false,
    category: 'beverages',
    outlet: 'snapeats',
    stallName: 'SnapEats',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRA6LM64JNLMv4xKCJ5XLYv2F_mMKAWC8bltA&s'
  },
  {
    id: 'se-7',
    name: 'Iced Tea',
    description: 'Refreshing iced tea with lemon.',
    price: 60,
    veg: true,
    bestSeller: false,
    category: 'beverages',
    outlet: 'snapeats',
    stallName: 'SnapEats',
    image: 'https://images.themodernproper.com/production/posts/IcedTea_8.jpg?w=960&h=960&q=82&fm=jpg&fit=crop&dm=1716306653&s=e7e37b87126eaafc95ddb53435ba341e'
  },

  // Dominos Items
  {
    id: 'd-1',
    name: 'Margherita Pizza',
    description: 'Classic pizza with tomato sauce and mozzarella cheese.',
    price: 199,
    veg: true,
    bestSeller: true,
    category: 'pizza',
    outlet: 'dominos',
    stallName: 'Dominos',
    image: 'https://images.dominos.co.in/nextgen-catalog/media/prod/Dominos/WebHomeProductV1/7ed9c325-2b42-4824-a25a-367bb48332be_double_margherita_side.webp?ver=V0.0.1'
  },
  {
    id: 'd-2',
    name: 'Pepperoni Pizza',
    description: 'Pizza topped with spicy pepperoni and cheese.',
    price: 249,
    veg: false,
    bestSeller: true,
    category: 'pizza',
    outlet: 'dominos',
    stallName: 'Dominos',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT1wkhPxk7Ll0WctlcKUQ_0IeV-EzxW9ML1Pg&s'
  },
  {
    id: 'd-3',
    name: 'Chicken Wings',
    description: 'Spicy chicken wings with BBQ sauce.',
    price: 179,
    veg: false,
    bestSeller: false,
    category: 'sides',
    outlet: 'dominos',
    stallName: 'Dominos',
    image: 'https://www.dominos.co.in/files/items/Roasted-chicken-192x192.png'
  },
  {
    id: 'd-4',
    name: 'Garlic Bread',
    description: 'Toasted bread with garlic butter and herbs.',
    price: 99,
    veg: true,
    bestSeller: false,
    category: 'sides',
    outlet: 'dominos',
    stallName: 'Dominos',
    image: 'https://www.ambitiouskitchen.com/wp-content/uploads/2023/02/Garlic-Bread-4.jpg'
  },
  {
    id: 'd-5',
    name: 'Chicken Supreme Pizza',
    description: 'Pizza topped with chicken, mushrooms, and bell peppers.',
    price: 299,
    veg: false,
    bestSeller: false,
    category: 'pizza',
    outlet: 'dominos',
    stallName: 'Dominos',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQsZQ82v33vLu4rqgAlrJPqbWrV4PQYqNgAhg&s'
  },
  {
    id: 'd-6',
    name: 'Veggie Supreme Pizza',
    description: 'Pizza loaded with fresh vegetables and cheese.',
    price: 249,
    veg: true,
    bestSeller: false,
    category: 'pizza',
    outlet: 'dominos',
    stallName: 'Dominos',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSrjeQRwUZ-0Nk1HQwNoDRVpBltKK_nGAuFxg&s'
  },
  {
    id: 'd-7',
    name: 'Coke',
    description: 'Ice-cold Coca-Cola.',
    price: 60,
    veg: true,
    bestSeller: false,
    category: 'beverages',
    outlet: 'dominos',
    stallName: 'Dominos',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTZ3ZSUMYa4xT8cE4-Nuc1wtZw0Wl8Z0o43hg&s'
  }
];

export default Menu;
