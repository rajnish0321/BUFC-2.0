import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X, User, LogOut, Home, BookOpen, Clock, Moon, Sun } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useUser } from '@/contexts/UserContext';
import { useTheme } from '@/contexts/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';

const NavLink = ({ to, children, onClick = () => {} }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link 
      to={to} 
      onClick={onClick}
      className="relative group px-4 py-2"
    >
      <span className={`relative z-10 transition-colors duration-200 ${isActive ? 'text-white' : 'text-gray-700 group-hover:text-white'}`}>
        {children}
      </span>
      <motion.div
        className="absolute inset-0 bg-bufc-blue rounded-full"
        initial={false}
        animate={{
          scale: isActive ? 1 : 0,
          opacity: isActive ? 1 : 0
        }}
        transition={{ duration: 0.2 }}
      />
      <motion.div
        className="absolute inset-0 bg-bufc-blue rounded-full opacity-0 group-hover:opacity-100"
        initial={false}
        whileHover={{ scale: 1 }}
        transition={{ duration: 0.2 }}
      />
    </Link>
  );
};

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user, signOut, isStudent, isStaff } = useUser();
  const { theme, toggleTheme } = useTheme();
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  
  const handleLogin = () => {
    navigate('/login');
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  const handleDashboard = () => {
    navigate('/dashboard');
  };

  return (
    <motion.nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg shadow-lg' 
          : 'bg-transparent'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div className="bufc-container">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <motion.div 
            className="flex items-center"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link to="/" className="flex items-center gap-2">
              <motion.div 
                className="bg-bufc-blue text-white font-bold rounded-md p-2"
                whileHover={{ rotate: 5 }}
              >
                BUFC
              </motion.div>
              <motion.span 
                className={`font-bold hidden md:block transition-colors duration-300 ${
                  isScrolled 
                    ? 'text-bufc-blue dark:text-white' 
                    : 'text-white'
                }`}
              >
                Bennett University Food Courtyard
              </motion.span>
            </Link>
          </motion.div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-2">
            <NavLink to="/">
              <span className="flex items-center gap-2">
                <Home size={18} />
                Home
              </span>
            </NavLink>
            <NavLink to="/menu">
              <span className="flex items-center gap-2">
                <BookOpen size={18} />
                Menu
              </span>
            </NavLink>
            <NavLink to="/dashboard/student/orders">
              <span className="flex items-center gap-2">
                <Clock size={18} />
                My Orders
              </span>
            </NavLink>
            
            {/* Theme Toggle Button */}
            <motion.div 
              whileHover={{ scale: 1.05 }} 
              whileTap={{ scale: 0.95 }}
              className="ml-2"
            >
              <Button
                variant="outline"
                size="icon"
                onClick={toggleTheme}
                className="h-9 w-9 border-white/20 bg-white/20 backdrop-blur-sm hover:bg-white/30 dark:border-gray-800 dark:bg-gray-800/50 dark:hover:bg-gray-800/70"
              >
                <AnimatePresence mode="wait">
                  {theme === 'light' ? (
                    <motion.div
                      key="sun"
                      initial={{ opacity: 0, rotate: -90 }}
                      animate={{ opacity: 1, rotate: 0 }}
                      exit={{ opacity: 0, rotate: 90 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Sun className="h-4 w-4 text-yellow-500" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="moon"
                      initial={{ opacity: 0, rotate: -90 }}
                      animate={{ opacity: 1, rotate: 0 }}
                      exit={{ opacity: 0, rotate: 90 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Moon className="h-4 w-4 text-slate-300" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </Button>
            </motion.div>
            
            {user ? (
              <div className="flex items-center gap-2 ml-4">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button 
                    onClick={handleDashboard} 
                    variant="outline" 
                    className="flex items-center gap-2 bg-white/20 backdrop-blur-sm border-white/30 text-gray-700 dark:text-white hover:bg-white/30 dark:bg-gray-800/50 dark:border-gray-700 dark:hover:bg-gray-800/70"
                  >
                    <User size={18} />
                    <span>Dashboard</span>
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button 
                    onClick={handleLogout} 
                    variant="ghost" 
                    className="flex items-center gap-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20"
                  >
                    <LogOut size={18} />
                    <span>Logout</span>
                  </Button>
                </motion.div>
              </div>
            ) : (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="ml-4">
                <Button 
                  onClick={handleLogin} 
                  variant="outline" 
                  className="flex items-center gap-2 bg-white/20 backdrop-blur-sm border-white/30 text-gray-700 dark:text-white hover:bg-white/30 dark:bg-gray-800/50 dark:border-gray-700 dark:hover:bg-gray-800/70"
                >
                  <User size={18} />
                  <span>Login</span>
                </Button>
              </motion.div>
            )}
          </div>
          
          {/* Mobile menu button and theme toggle */}
          <div className="md:hidden flex items-center gap-2">
            <motion.div 
              whileHover={{ scale: 1.05 }} 
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="outline"
                size="icon"
                onClick={toggleTheme}
                className="h-9 w-9 border-white/20 bg-white/20 backdrop-blur-sm hover:bg-white/30 dark:border-gray-800 dark:bg-gray-800/50 dark:hover:bg-gray-800/70"
              >
                {theme === 'light' ? (
                  <Sun className="h-4 w-4 text-yellow-500" />
                ) : (
                  <Moon className="h-4 w-4 text-slate-300" />
                )}
              </Button>
            </motion.div>
            <Button 
              variant="ghost" 
              onClick={toggleMenu} 
              aria-label="Toggle menu"
              className={`p-2 ${isScrolled ? 'text-gray-700 dark:text-white' : 'text-white'}`}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={isOpen ? 'close' : 'menu'}
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {isOpen ? <X size={24} /> : <Menu size={24} />}
                </motion.div>
              </AnimatePresence>
            </Button>
          </div>
        </div>
        
        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              className="md:hidden py-3 space-y-1 bg-white dark:bg-gray-900 rounded-b-2xl shadow-lg"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              {[
                { to: '/', icon: <Home size={18} />, label: 'Home' },
                { to: '/menu', icon: <BookOpen size={18} />, label: 'Menu' },
                { to: '/dashboard/student/orders', icon: <Clock size={18} />, label: 'My Orders' },
              ].map((item) => (
                <motion.div
                  key={item.to}
                  whileHover={{ x: 10 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link 
                    to={item.to} 
                    className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-bufc-blue"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </Link>
                </motion.div>
              ))}
              
              {user ? (
                <>
                  <motion.div whileHover={{ x: 10 }} whileTap={{ scale: 0.95 }}>
                    <Button 
                      onClick={() => {
                        setIsOpen(false);
                        navigate('/dashboard');
                      }} 
                      variant="outline"
                      className="w-full justify-start px-4 py-2"
                    >
                      <User size={18} className="mr-2" />
                      <span>Dashboard</span>
                    </Button>
                  </motion.div>
                  <motion.div whileHover={{ x: 10 }} whileTap={{ scale: 0.95 }}>
                    <Button 
                      onClick={() => {
                        setIsOpen(false);
                        handleLogout();
                      }} 
                      variant="ghost"
                      className="w-full justify-start px-4 py-2 text-red-500"
                    >
                      <LogOut size={18} className="mr-2" />
                      <span>Logout</span>
                    </Button>
                  </motion.div>
                </>
              ) : (
                <motion.div whileHover={{ x: 10 }} whileTap={{ scale: 0.95 }}>
                  <Button 
                    onClick={() => {
                      setIsOpen(false);
                      navigate('/login');
                    }} 
                    variant="outline"
                    className="w-full justify-start px-4 py-2"
                  >
                    <User size={18} className="mr-2" />
                    <span>Login</span>
                  </Button>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

export default Navbar;
