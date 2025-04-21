import { Home, Menu as MenuIcon, ShoppingCart, User, LogOut } from "lucide-react";

const studentNavItems = [
  { label: "Dashboard", href: "/dashboard/student", icon: Home },
  { label: "Menu", href: "/dashboard/student/menu", icon: MenuIcon },
  { label: "Orders", href: "/dashboard/student/orders", icon: ShoppingCart },
  { label: "Profile", href: "/dashboard/student/profile", icon: User },
];

const staffNavItems = [
  { label: "Dashboard", href: "/dashboard/staff", icon: Home },
  { label: "Orders", href: "/dashboard/staff/orders", icon: ShoppingCart },
  { label: "Profile", href: "/dashboard/staff/profile", icon: User },
]; 