import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Clock, Users, ShoppingBag, Star, Heart, Coffee, Pizza, Sandwich, Utensils, Zap } from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';

const Index = () => {
  const { toast } = useToast();

  const handleComingSoonOutlet = (outletName) => {
    toast({
      title: "Coming Soon!",
      description: `${outletName} will be available soon.`,
      duration: 3000,
    });
  };

  return (
    <MainLayout>
      {/* Hero Section with modern design */}
      <section className="relative min-h-[85vh] bg-gradient-to-br from-[#FF6B6B] to-[#4ECDC4] text-white overflow-hidden">
        {/* Animated background patterns */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full mix-blend-overlay filter blur-3xl animate-blob"></div>
            <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-400 rounded-full mix-blend-overlay filter blur-3xl animate-blob animation-delay-2000"></div>
            <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-pink-400 rounded-full mix-blend-overlay filter blur-3xl animate-blob animation-delay-4000"></div>
          </div>
          {/* Food icons floating animation */}
          <div className="absolute inset-0 overflow-hidden">
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute"
                initial={{ 
                  x: Math.random() * window.innerWidth, 
                  y: Math.random() * window.innerHeight 
                }}
                animate={{
                  y: [0, -20, 0],
                  rotate: [0, 360]
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  repeat: Infinity,
                  delay: i * 0.2
                }}
              >
                <span className="text-4xl opacity-20">
                  {['🍕', '🍔', '🌮', '🍜', '🍱', '🥪', '☕️', '🥤'][i]}
                </span>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="bufc-container relative">
          <div className="flex flex-col md:flex-row items-center justify-between py-20 gap-12">
            {/* Left content */}
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="flex-1 max-w-2xl"
            >
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full text-sm font-medium mb-6"
              >
                <span className="animate-bounce">🚀</span>
                <span>New at Bennett University</span>
                <span className="px-2 py-1 bg-white/20 rounded-full text-xs animate-pulse">Beta</span>
              </motion.div>
              
              <motion.h1 
                className="text-6xl md:text-7xl font-bold mb-6 leading-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <span className="inline-block hover:scale-105 transition-transform cursor-default">Hungry?</span>
                <motion.span 
                  className="block mt-2 bg-clip-text text-transparent bg-gradient-to-r from-white to-yellow-200"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  Order Ahead!
                </motion.span>
              </motion.h1>

              <motion.p 
                className="text-xl mb-8 text-white/90 max-w-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                Skip the campus food lines. Order from your favorite outlets, pick up when ready, and enjoy your meal stress-free.
              </motion.p>

              <motion.div 
                className="flex flex-wrap gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Link to="/menu">
                  <Button size="lg" 
                    className="bg-white text-[#FF6B6B] hover:bg-white/90 shadow-lg hover:shadow-xl transition-all hover:scale-105 px-8 group"
                  >
                    Order Now 
                    <motion.span
                      className="ml-2 inline-block"
                      whileHover={{ x: 5 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                      <ArrowRight size={18} />
                    </motion.span>
                  </Button>
                </Link>
                <Link to="/how-it-works">
                  <Button size="lg" variant="outline" 
                    className="border-2 border-white/50 bg-transparent hover:bg-white/10 text-white shadow-lg hover:shadow-xl transition-all group"
                  >
                    How It Works
                  </Button>
                </Link>
              </motion.div>

              {/* Quick stats with animations */}
              <motion.div 
                className="mt-12 flex items-center gap-8 text-sm text-white/80"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <motion.div 
                  className="flex items-center gap-2 hover:text-white transition-colors"
                  whileHover={{ scale: 1.05 }}
                >
                  <Clock className="w-4 h-4" />
                  <span>Ready in 15 mins</span>
                </motion.div>
              </motion.div>
            </motion.div>

            {/* Right content - Food illustration with 3 images */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex-1 relative"
            >
              <div className="relative w-full h-[500px] group perspective-1000">
                {/* Image Stack/Collage */}
                <motion.div 
                  className="relative w-full h-full"
                  initial={{ rotateY: -15 }}
                  whileHover={{ rotateY: 0 }}
                  transition={{ type: "spring", stiffness: 100 }}
                >
                  {/* First Image - Main */}
                  <motion.div
                    className="absolute top-[5%] right-[5%] w-[65%] h-[65%] z-30"
                    whileHover={{ scale: 1.05, zIndex: 40 }}
                    animate={{ 
                      y: [0, -10, 0],
                      rotate: [0, 1, 0]
                    }}
                    transition={{ 
                      duration: 6,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <img 
                      src="https://www.licious.in/blog/wp-content/uploads/2022/06/shutterstock_311878256-750x750.jpg" 
                      alt="Delicious Campus Food"
                      className="w-full h-full object-cover rounded-2xl shadow-2xl"
                    />
                    <div className="absolute inset-0 rounded-2xl ring-2 ring-white/20 group-hover:ring-white/40 transition-all duration-300" />
                  </motion.div>

                  {/* Second Image - Top Left */}
                  <motion.div
                    className="absolute top-0 left-[-10%] w-[55%] h-[55%] z-20"
                    whileHover={{ scale: 1.05, zIndex: 40 }}
                    animate={{ 
                      y: [0, 8, 0],
                      rotate: [0, -1, 0]
                    }}
                    transition={{ 
                      duration: 5,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 0.5
                    }}
                  >
                    <img 
                      src="https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=800" 
                      alt="Fresh Pizza"
                      className="w-full h-full object-cover rounded-2xl shadow-2xl"
                    />
                    <div className="absolute inset-0 rounded-2xl ring-2 ring-white/20 group-hover:ring-white/40 transition-all duration-300" />
                  </motion.div>

                  {/* Third Image - Bottom Left */}
                  <motion.div
                    className="absolute bottom-[5%] left-[15%] w-[50%] h-[50%] z-10"
                    whileHover={{ scale: 1.05, zIndex: 40 }}
                    animate={{ 
                      y: [0, -5, 0],
                      rotate: [0, 0.5, 0]
                    }}
                    transition={{ 
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 1
                    }}
                  >
                    <img 
                      src="https://images.pexels.com/photos/5560763/pexels-photo-5560763.jpeg?auto=compress&cs=tinysrgb&w=600" 
                      alt="South Indian Delicacies"
                      className="w-full h-full object-cover rounded-2xl shadow-2xl"
                    />
                    <div className="absolute inset-0 rounded-2xl ring-2 ring-white/20 group-hover:ring-white/40 transition-all duration-300" />
                  </motion.div>
                </motion.div>

                {/* Floating elements with updated positions */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute top-5 right-0 group-hover:scale-110 transition-transform z-50"
                >
                  <div className="bg-white/20 backdrop-blur-md rounded-lg px-4 py-2 hover:bg-white/30 transition-colors">
                    🍕 Fresh & Hot
                  </div>
                </motion.div>

                <motion.div
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                  className="absolute bottom-10 right-20 group-hover:scale-110 transition-transform z-50"
                >
                  <div className="bg-white/20 backdrop-blur-md rounded-lg px-4 py-2 hover:bg-white/30 transition-colors">
                    ⚡ Quick Pickup
                  </div>
                </motion.div>

                <motion.div
                  animate={{ y: [0, -8, 0], x: [0, 8, 0] }}
                  transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                  className="absolute top-1/2 left-0 group-hover:scale-110 transition-transform z-50"
                >
                  <div className="bg-white/20 backdrop-blur-md rounded-lg px-4 py-2 hover:bg-white/30 transition-colors">
                    💫 Student Favorite
                  </div>
                </motion.div>

                {/* Decorative elements */}
                <motion.div 
                  className="absolute -top-10 -left-10 w-20 h-20 bg-yellow-400/20 rounded-full blur-2xl"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 4, repeat: Infinity }}
                />
                <motion.div 
                  className="absolute -bottom-10 -right-10 w-20 h-20 bg-pink-400/20 rounded-full blur-2xl"
                  animate={{ scale: [1.2, 1, 1.2] }}
                  transition={{ duration: 4, repeat: Infinity, delay: 2 }}
                />
              </div>
            </motion.div>
          </div>
        </div>

        {/* Bottom wave with animation */}
        <motion.div 
          className="absolute bottom-0 left-0 w-full"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <motion.path 
              d="M0 0L48 8.875C96 17.75 192 35.5 288 44.375C384 53.25 480 53.25 576 44.375C672 35.5 768 17.75 864 8.875C960 0 1056 0 1152 8.875C1248 17.75 1344 35.5 1392 44.375L1440 53.25V120H1392C1344 120 1248 120 1152 120C1056 120 960 120 864 120C768 120 672 120 576 120C480 120 384 120 288 120C192 120 96 120 48 120H0V0Z" 
              fill="white"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.5, delay: 0.8 }}
            />
          </svg>
        </motion.div>
      </section>
      
      {/* Featured Outlets */}
      <section className="py-16 bg-bufc-gray">
        <div className="bufc-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-3">Featured Outlets</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Choose from our campus dining options at Bennett University Food Courtyard!
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {outlets.map((outlet, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group relative"
              >
                {outlet.comingSoon ? (
                  <div 
                    onClick={() => handleComingSoonOutlet(outlet.name)}
                    className="bufc-card overflow-hidden h-full flex flex-col cursor-pointer hover:shadow-xl transition-all duration-300"
                  >
                    <div className="h-48 overflow-hidden relative">
                      <div className="absolute inset-0 bg-black/50 z-10 flex items-center justify-center">
                        <span className="bg-bufc-orange text-white px-4 py-1 rounded-full text-sm font-medium">
                          Coming Soon
                        </span>
                      </div>
                      <img 
                        src={outlet.image} 
                        alt={outlet.name} 
                        className="w-full h-full object-cover filter grayscale"
                      />
                    </div>
                    <div className="p-4 flex-grow">
                      <h3 className="font-bold text-lg mb-2">{outlet.name}</h3>
                      <p className="text-gray-500 mb-3">{outlet.description}</p>
                    </div>
                  </div>
                ) : (
                  <Link to={`/menu?outlet=${outlet.id}`} className="bufc-card overflow-hidden h-full flex flex-col hover:shadow-xl transition-all duration-300">
                    <div className="h-48 overflow-hidden relative">
                      <img 
                        src={outlet.image} 
                        alt={outlet.name} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute bottom-0 right-0 bg-bufc-orange text-white px-3 py-1 text-sm font-medium rounded-tl-md">
                        {outlet.status}
                      </div>
                    </div>
                    <div className="p-4 flex-grow">
                      <h3 className="font-bold text-lg mb-2">{outlet.name}</h3>
                      <p className="text-gray-600 mb-3">{outlet.description}</p>
                    </div>
                  </Link>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Campus Food Journey Section */}
      <section className="py-16 bg-bufc-gray">
        <div className="bufc-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="inline-block bg-bufc-blue/10 text-bufc-blue px-4 py-1.5 rounded-full text-sm font-medium mb-2">
              The BUFC Difference
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-3">Your Campus Food Journey</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Experience the transformation from traditional ordering to BUFC's smart dining system
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Traditional Ordering */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white p-6 rounded-lg shadow-lg relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-red-100 rounded-bl-full opacity-50"></div>
              <div className="relative">
                <div className="flex items-center gap-3 mb-4">
                  <Clock className="w-6 h-6 text-red-500" />
                  <h3 className="text-xl font-bold">Traditional Ordering</h3>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-red-100 text-red-500 flex items-center justify-center shrink-0 mt-1">1</div>
                    <p className="text-gray-600">Stand in long queues during peak hours</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-red-100 text-red-500 flex items-center justify-center shrink-0 mt-1">2</div>
                    <p className="text-gray-600">Wait 20-30 minutes for your order</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-red-100 text-red-500 flex items-center justify-center shrink-0 mt-1">3</div>
                    <p className="text-gray-600">Miss classes or study time</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-red-100 text-red-500 flex items-center justify-center shrink-0 mt-1">4</div>
                    <p className="text-gray-600">Rush through meals between classes</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* BUFC Smart Ordering */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-white p-6 rounded-lg shadow-lg relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-green-100 rounded-bl-full opacity-50"></div>
              <div className="relative">
                <div className="flex items-center gap-3 mb-4">
                  <Zap className="w-6 h-6 text-green-500" />
                  <h3 className="text-xl font-bold">BUFC Smart Ordering</h3>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-green-100 text-green-500 flex items-center justify-center shrink-0 mt-1">1</div>
                    <p className="text-gray-600">Order ahead from your phone</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-green-100 text-green-500 flex items-center justify-center shrink-0 mt-1">2</div>
                    <p className="text-gray-600">Pick up in your chosen time slot</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-green-100 text-green-500 flex items-center justify-center shrink-0 mt-1">3</div>
                    <p className="text-gray-600">Enjoy more time for classes and study</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-green-100 text-green-500 flex items-center justify-center shrink-0 mt-1">4</div>
                    <p className="text-gray-600">Plan meals around your schedule</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Stats Row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12 grid grid-cols-2 gap-6 max-w-md mx-auto"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="text-3xl font-bold text-bufc-blue mb-1">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-bufc-lightblue via-bufc-lightblue to-blue-100 dark:from-gray-800 dark:via-gray-800 dark:to-gray-900">
        <div className="bufc-container text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">Ready to Skip the Lines?</h2>
            <p className="text-lg text-gray-700 dark:text-gray-200 mb-8 max-w-xl mx-auto">
              Join Bennett University students who are already enjoying a more efficient dining experience on campus.
            </p>
            <Link to="/menu">
              <Button size="lg" className="bufc-button-primary shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all">
                Explore Our Menu
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </MainLayout>
  );
};

// Updated outlet data
const outlets = [
  {
    id: 'kathi-junction',
    name: 'Kathi Junction',
    description: 'Delicious rolls, wraps & more. The most popular spot on campus!',
    image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&q=80&w=500',
    status: 'Open Now',
    
    comingSoon: false
  },
  {
    id: 'southern',
    name: 'Southern',
    description: 'Authentic South Indian cuisine with a wide variety of dosas and more.',
    image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&q=80&w=500',
    status: 'Open Now',
  
    comingSoon: false
  },
  {
    id: 'snapeats',
    name: 'SnapEats',
    description: 'Quick bites, refreshing beverages, and snack options.',
    image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?auto=format&fit=crop&q=80&w=500',
    status: 'Open Now',
  
    comingSoon: false
  },
  {
    id: 'dominos',
    name: 'Dominos',
    description: 'Everyone\'s favorite pizza, fresh and hot for you to grab.',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=500',
    status: 'Open Now',
   
    comingSoon: false
  }
];

// Enhanced steps with slightly updated descriptions
const steps = [
  {
    title: 'Browse & Order',
    description: 'Explore our menu and place your order in advance with just a few taps.',
    icon: <ShoppingBag size={28} />
  },
  {
    title: 'Select Pickup Slot',
    description: 'Choose a convenient time that works with your class schedule to collect your food.',
    icon: <Clock size={28} />
  },
  {
    title: 'Skip the Queue',
    description: 'Show your order ID at the counter and collect your food without waiting in line.',
    icon: <Users size={28} />
  }
];

// New stats data
const stats = [
  { value: '15min', label: 'Average Wait Time' },
  { value: '4+', label: 'Food Outlets' }
];

export default Index;
