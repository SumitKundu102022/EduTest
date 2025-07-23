// src/components/common/CandidateNavbar.jsx
import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  Menu,
  Settings,
  User,
  LogOut,
  Home,
  FileText,
  BarChart2,
  Calendar,
  LogIn,
  UserPlus,
} from "lucide-react"; // Added LogIn, UserPlus icons
import { useAuth } from "../../contexts/AuthContext";

/**
 * CandidateNavbar Component
 *
 * This component provides the navigation bar for the candidate portal.
 * It includes:
 * - A logo/app name.
 * - Main navigation links (Dashboard, Attend Test, Review Results, Track Progress, Upcoming Tests).
 * - A profile icon with a dropdown menu for settings and logout.
 * - **Conditional Dropdown Menu**: Shows Login/Sign Up if not authenticated,
 * or Profile/Settings/Logout if authenticated.
 * - Responsive design for mobile and desktop.
 * - Uses Shadcn/ui components (Button, Avatar, DropdownMenu) and Lucide React icons.
 * - Applies Framer Motion for subtle hover animations.
 */
const Navbar = () => {
  const { user, logout, isLoading } = useAuth();

  // Function to get initials for AvatarFallback
  const getInitials = (name) => {
    if (!name) return "GU"; // Candidate initials if name is null/undefined
    const parts = name.split(" ");
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (
      parts[0].charAt(0) + parts[parts.length - 1].charAt(0)
    ).toUpperCase();
  };


  // Define navigation links for candidates
  const candidateNavLinks = [
    {
      name: "Dashboard",
      path: "/candidate/dashboard",
      icon: Home,
      requiresAuth: true,
    },
    {
      name: "Attend Test",
      path: "/candidate/dashboard#attend-test",
      icon: FileText,
      requiresAuth: true,
    }, // Re-using create-test for now, or link to a general test list
    {
      name: "Review Results",
      path: "/candidate/dashboard#results",
      icon: BarChart2,
      requiresAuth: true,
    }, // Anchor link to results section
    {
      name: "Track Progress",
      path: "/candidate/dashboard#performance",
      icon: BarChart2,
      requiresAuth: true,
    }, // Anchor link to performance section
    {
      name: "Upcoming Tests",
      path: "/candidate/dashboard#upcoming",
      icon: Calendar,
      requiresAuth: true,
    }, // Anchor link to upcoming tests
  ];

  // Define navigation links for admins
  const adminNavLinks = [
    {
      name: "Dashboard",
      path: "/admin/dashboard",
      icon: Home,
      requiresAuth: true,
    },
    {
      name: "New Test",
      path: "/create-test",
      icon: FileText,
      requiresAuth: true,
    },
    {
      name: "Import Candidate",
      path: "/admin/dashboard#Candidates",
      icon: BarChart2,
      requiresAuth: true,
    }, // Anchor link to results section
    {
      name: "Assign Test",
      path: "/admin/dashboard#assign-test",
      icon: BarChart2,
      requiresAuth: true,
    }, // Anchor link to performance section
    {
      name: "Publish Result",
      path: "/admin/dashboard#publish-result",
      icon: Calendar,
      requiresAuth: true,
    }, // Anchor link to upcoming tests
  ];

  // Determine which set of links to use based on user role
  const currentNavLinks =
    user?.role === "admin" ? adminNavLinks : candidateNavLinks;

  // Render nothing if authentication status is still loading
  if (isLoading) {
    return null; // Or a very minimal loading indicator if desired
  }

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="bg-white dark:bg-gray-800 shadow-md dark:shadow-lg p-4 flex justify-between items-center fixed top-0 left-0 w-full z-50"
    >
      {/* Logo/App Name */}
      <Link to="/" className="flex items-center space-x-2">
        {" "}
        {/* Link back to home page */}
        <motion.span
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-2xl font-bold text-zinc-700 dark:text-zinc-400"
        >
          EduTest
        </motion.span>
      </Link>

      {/* Desktop Navigation Links (only show if authenticated) */}
      <div className="hidden md:flex space-x-6">
        {user &&
          currentNavLinks
            .filter((link) => link.requiresAuth)
            .map((link) => (
              <Link key={link.name} to={link.path}>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center text-zinc-700 dark:text-gray-300 hover:text-red-600 transition-all duration-150
               hover:bg-red-50 hover:border-none hover:border-red-400 hover:rounded-full px-2 py-1"
                >
                  {link.icon && <link.icon className="h-5 w-5 mr-1" />}
                  <span className="font-medium">{link.name}</span>
                </motion.div>
              </Link>
            ))}
      </div>

      {/* Profile Icon and Dropdown Menu */}
      <div className="flex items-center space-x-4">
        <div className="hidden md:block">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="cursor-pointer"
              >
                {user ? (
                  <Avatar className="h-9 w-9 border-2 border-red-600 dark:border-zinc-600">
                    <AvatarImage
                      src={user?.profilePic || "https://github.com/shadcn.png"}
                      alt={user?.name || "User"}
                    />
                    <AvatarFallback className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 font-semibold">
                      {getInitials(user?.name)}
                    </AvatarFallback>
                  </Avatar>
                ) : (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 border-2 border-zinc-400 rounded-full dark:text-gray-200 dark:hover:bg-gray-950 cursor-pointer"
                  >
                    <User className="h-5 w-5 text-zinc-700" />
                    <span className="sr-only">User menu</span>
                  </Button>
                )}
              </motion.div>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-56 dark:bg-gray-700 dark:text-gray-100"
              align="end"
              forceMount
            >
              {user ? (
                <>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {user?.name || "Candidate"}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user?.email || "user@example.com"}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="dark:bg-gray-600" />
                  <DropdownMenuItem
                    onClick={() => alert("Profile feature coming soon!")}
                    className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                  >
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => alert("Settings feature coming soon!")}
                    className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="dark:bg-gray-600" />
                  <DropdownMenuItem
                    onClick={logout}
                    className="cursor-pointer hover:bg-red-50 dark:hover:bg-red-900 text-red-600 dark:text-red-400"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </>
              ) : (
                <>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        Guest User
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        Please log in or sign up
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="dark:bg-gray-600" />
                  <Link to="/login">
                    <DropdownMenuItem className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600">
                      <LogIn className="mr-2 h-4 w-4" />
                      <span>Login</span>
                    </DropdownMenuItem>
                  </Link>
                  <Link to="/register">
                    <DropdownMenuItem className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600">
                      <UserPlus className="mr-2 h-4 w-4" />
                      <span>Sign Up</span>
                    </DropdownMenuItem>
                  </Link>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Mobile Menu Button (Hamburger) */}
        <div className="md:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              {/* <Button
                variant="outline"
                size="icon"
                className="h-9 w-9 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
              > */}
              {/* <Menu className="h-5 w-5" /> */}
              <Avatar className="h-9 w-9 border-2 border-red-600 dark:border-zinc-600">
                <AvatarImage
                  src={user?.profilePic || "https://github.com/shadcn.png"}
                  alt={user?.name || "User"}
                />
                <AvatarFallback className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 font-semibold">
                  {getInitials(user?.name)}
                </AvatarFallback>
              </Avatar>
              {/* <span className="sr-only">Open menu</span>
              </Button> */}
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-56 dark:bg-gray-700 dark:text-gray-100"
              align="end"
              forceMount
            >
              {user ? (
                <>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {user?.name || "Candidate"}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user?.email || "user@example.com"}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="dark:bg-gray-600" />
                  {currentNavLinks
                    .filter((link) => link.requiresAuth)
                    .map((link) => (
                      <Link key={link.name} to={link.path}>
                        <DropdownMenuItem className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600">
                          {link.icon && <link.icon className="mr-2 h-4 w-4" />}
                          <span>{link.name}</span>
                        </DropdownMenuItem>
                      </Link>
                    ))}

                  <DropdownMenuSeparator className="dark:bg-gray-600" />
                  <DropdownMenuItem
                    onClick={() => alert("Profile feature coming soon!")}
                    className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                  >
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => alert("Settings feature coming soon!")}
                    className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="dark:bg-gray-600" />
                  <DropdownMenuItem
                    onClick={logout}
                    className="cursor-pointer hover:bg-red-50 dark:hover:bg-red-900 text-red-600 dark:text-red-400"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </>
              ) : (
                <>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        Guest User
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        Please log in or sign up
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="dark:bg-gray-600" />
                  <Link to="/login">
                    <DropdownMenuItem className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600">
                      <LogIn className="mr-2 h-4 w-4" />
                      <span>Login</span>
                    </DropdownMenuItem>
                  </Link>
                  <Link to="/register">
                    <DropdownMenuItem className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600">
                      <UserPlus className="mr-2 h-4 w-4" />
                      <span>Sign Up</span>
                    </DropdownMenuItem>
                  </Link>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
