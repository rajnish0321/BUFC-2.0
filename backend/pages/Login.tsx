import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { GraduationCap, Utensils } from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';
import { motion } from 'framer-motion';

const Login = () => {
  const navigate = useNavigate();

  return (
    <MainLayout>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md w-full space-y-8"
        >
          <motion.div 
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-center"
          >
            <h2 className="mt-6 text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              Welcome back!
            </h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Please select your login type
            </p>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-8 space-y-4"
          >
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                onClick={() => navigate('/login/student')}
                className="w-full py-6 flex items-center justify-center space-x-4 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 dark:from-indigo-500 dark:to-indigo-600 dark:hover:from-indigo-600 dark:hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  <GraduationCap className="h-6 w-6" />
                </motion.div>
                <span className="text-lg font-medium">Student Login</span>
              </Button>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                onClick={() => navigate('/login/staff')}
                className="w-full py-6 flex items-center justify-center space-x-4 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 dark:from-green-500 dark:to-green-600 dark:hover:from-green-600 dark:hover:to-green-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  <Utensils className="h-6 w-6" />
                </motion.div>
                <span className="text-lg font-medium">Staff Login</span>
              </Button>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="text-center text-sm text-gray-500 dark:text-gray-400"
          >
            <p>Need help? Contact support at support@bennett.edu.in</p>
          </motion.div>
        </motion.div>
      </div>
    </MainLayout>
  );
};

export default Login;
