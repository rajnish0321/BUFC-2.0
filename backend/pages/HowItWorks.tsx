import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Card, CardContent } from '@/components/ui/card';
import { ShoppingBag, Clock, CheckCircle, User, BarChart3, Mail, HelpCircle, MessageSquare, Phone, ExternalLink, BookOpen, MapPin, Calendar, Settings } from 'lucide-react';
import { motion } from 'framer-motion';

const HowItWorks = () => {
  return (
    <MainLayout>
      <div className="bufc-container py-8">
        <h1 className="text-3xl font-bold mb-4">How BUFC Works</h1>
        <p className="text-lg text-gray-600 mb-8">
          Bennett University Food Courtyard (BUFC) simplifies campus dining by allowing you to order food in advance and skip the long lines.
        </p>
        
        {/* Student Flow */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <User className="mr-2 text-bufc-blue" />
            For Students
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {studentSteps.map((step, index) => (
              <Card key={index} className="relative">
                <div className="absolute top-4 left-4 w-8 h-8 bg-bufc-blue text-white rounded-full flex items-center justify-center font-bold">
                  {index + 1}
                </div>
                <CardContent className="pt-16 pb-6">
                  <div className="mb-4 flex justify-center">
                    {step.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-center">{step.title}</h3>
                  <p className="text-gray-600 text-center">{step.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
        
        {/* Staff Flow */}
        <section className="mb-12 bg-bufc-lightblue dark:bg-gray-800 rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <BarChart3 className="mr-2 text-bufc-blue dark:text-bufc-blue" />
            For Outlet Staff
          </h2>
          
          <div className="space-y-6">
            {staffSteps.map((step, index) => (
              <div key={index} className="flex items-start gap-4">
                <div className="w-8 h-8 bg-bufc-blue text-white rounded-full flex items-center justify-center font-bold shrink-0 mt-1">
                  {index + 1}
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-1 dark:text-white">{step.title}</h3>
                  <p className="text-gray-700 dark:text-gray-300">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
        
        {/* Benefits */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Benefits of Using BUFC</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex gap-4 p-5 border border-gray-200 rounded-lg">
                <div className="text-bufc-blue">
                  <CheckCircle size={24} />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">{benefit.title}</h3>
                  <p className="text-gray-600 text-sm">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
        
        {/* FAQ */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
          
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="p-5 bg-gray-50 font-semibold">
                  {faq.question}
                </div>
                <div className="p-5">
                  {faq.answer}
                </div>
              </div>
            ))}
          </div>
        </section>
        
        {/* Quick Links & Support */}
        <section className="mt-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8"
          >
            <h2 className="text-2xl font-bold mb-2">Quick Links & Support</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Find helpful resources and get assistance with any questions or issues you may have.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto mb-12">
            {quickLinks.map((link, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
                className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
              >
                <div className="p-5">
                  <div className="flex items-center mb-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${link.iconBg}`}>
                      {link.icon}
                    </div>
                    <h3 className="font-semibold text-lg">{link.title}</h3>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">{link.description}</p>
                  <a 
                    href={link.url} 
                    className="inline-flex items-center text-bufc-blue hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium"
                  >
                    {link.linkText}
                    <ExternalLink size={14} className="ml-1" />
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 rounded-xl p-8 max-w-4xl mx-auto"
          >
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold mb-2">Need Additional Help?</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Our support team is here to assist you with any questions or issues you may have.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <motion.div 
                whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
                className="bg-white dark:bg-gray-800 p-5 rounded-lg border border-blue-100 dark:border-gray-700"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-4">
                    <Mail className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="font-semibold mb-2">Email Support</h3>
                  <a 
                    href="mailto:e23cseuxxx@bennett.edu.in" 
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    e23cseuxxx@bennett.edu.in
                  </a>
                </div>
              </motion.div>
              
              <motion.div 
                whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
                className="bg-white dark:bg-gray-800 p-5 rounded-lg border border-green-100 dark:border-gray-700"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-4">
                    <User className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="font-semibold mb-2">Student Support</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Visit the student help desk
                  </p>
                </div>
              </motion.div>
              
              <motion.div 
                whileHover={{ y: -5, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
                className="bg-white dark:bg-gray-800 p-5 rounded-lg border border-purple-100 dark:border-gray-700"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mb-4">
                    <BarChart3 className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="font-semibold mb-2">Outlet Support</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Contact your outlet directly
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center mt-8"
          >
            <p className="text-sm text-gray-500 dark:text-gray-400">
              For technical issues, please contact our IT support team
            </p>
          </motion.div>
        </section>
      </div>
    </MainLayout>
  );
};

// Data
const studentSteps = [
  {
    title: 'Browse & Order',
    description: 'Browse the menu from your favorite campus outlets and select your items.',
    icon: <ShoppingBag size={36} className="text-bufc-blue" />
  },
  {
    title: 'Place Your Order',
    description: 'Add items to your cart and place your order. The outlet will start preparing your food.',
    icon: <Clock size={36} className="text-bufc-blue" />
  },
  {
    title: 'Pick Up Your Order',
    description: 'Show your order ID at the counter and collect your food when it\'s ready.',
    icon: <CheckCircle size={36} className="text-bufc-blue" />
  }
];

const staffSteps = [
  {
    title: 'Receive Orders in Real-time',
    description: 'Staff can view all incoming orders through a dedicated dashboard.'
  },
  {
    title: 'Prepare Orders',
    description: 'Start preparing orders as they come in, ensuring fresh and hot food for students.'
  },
  {
    title: 'Mark Orders as Ready',
    description: 'Once an order is prepared, staff can mark it as "Ready for Pickup", notifying the student.'
  },
  {
    title: 'Verify and Hand Over',
    description: 'When students arrive, staff verify the order ID and hand over the prepared food.'
  }
];

const benefits = [
  {
    title: 'No More Long Queues',
    description: 'Save valuable time by skipping the lines during peak lunch hours.'
  },
  {
    title: 'Better Planning for Students',
    description: 'Order your meals in advance and pick them up when ready.'
  },
  {
    title: 'Efficient Resource Management for Outlets',
    description: 'Outlets can better predict demand and prepare food in advance to serve more students.'
  },
  {
    title: 'Reduced Food Wastage',
    description: 'Pre-orders help outlets prepare the right amount of food, reducing overall wastage.'
  },
  {
    title: 'Enhanced Campus Experience',
    description: 'A more efficient dining system improves the overall quality of campus life.'
  },
  {
    title: 'Transparent Process',
    description: 'Clear visibility on order status for both students and staff.'
  }
];

const faqs = [
  {
    question: 'How do I know when my order is ready?',
    answer: 'You\'ll receive a notification when your order is ready for pickup. You can also check the order status in your dashboard.'
  },
  {
    question: 'What happens if I miss my pickup?',
    answer: 'If you miss your pickup, your order will be held for a short period. After that, you may need to contact the outlet staff directly.'
  },
  {
    question: 'Can I modify my order after placing it?',
    answer: 'No, orders cannot be modified after they are placed. Please review your order carefully before confirming.'
  },
  {
    question: 'How do I pay for my order?',
    answer: 'Currently, BUFC operates on a pay-at-pickup system. We plan to integrate online payment options in future updates.'
  },
  {
    question: 'What if an item is unavailable after I order it?',
    answer: 'The outlet staff will contact you directly if an item becomes unavailable, offering alternatives or partial order fulfillment.'
  }
];

const quickLinks = [
  {
    title: 'Menu',
    description: 'Browse our delicious menu items from various campus outlets.',
    icon: <BookOpen size={20} className="text-blue-600 dark:text-blue-400" />,
    iconBg: "bg-blue-100 dark:bg-blue-900",
    url: "/menu",
    linkText: "View Menu"
  },
  {
    title: 'My Orders',
    description: 'Track your current orders and view your order history.',
    icon: <ShoppingBag size={20} className="text-green-600 dark:text-green-400" />,
    iconBg: "bg-green-100 dark:bg-green-900",
    url: "/orders",
    linkText: "View Orders"
  },
  {
    title: 'Outlet Locations',
    description: 'Find the locations of all food outlets on campus.',
    icon: <MapPin size={20} className="text-red-600 dark:text-red-400" />,
    iconBg: "bg-red-100 dark:bg-red-900",
    url: "/locations",
    linkText: "Find Outlets"
  },
  {
    title: 'Account Settings',
    description: 'Manage your profile, preferences, and account settings.',
    icon: <Settings size={20} className="text-purple-600 dark:text-purple-400" />,
    iconBg: "bg-purple-100 dark:bg-purple-900",
    url: "/profile",
    linkText: "Manage Account"
  }
];

export default HowItWorks;
