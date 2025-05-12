"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, Search, User, Heart, ShoppingBag, LogOut, ChevronDown } from "lucide-react";
import SearchBar from "../ui/search/SearchBar";
import WishlistIcon from "../ui/wishlist/WishlistIcon";
import { useAuth } from "@/app/providers/AuthProvider";
import { useTheme } from "@/app/providers/theme/ThemeProvider";
import { usePathname, useRouter } from "next/navigation";
import ThemeToggle from "../ui/ThemeToggle";

export const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const { theme, isDark } = useTheme();
  const pathname = usePathname();
  const router = useRouter();
  
  // Log bookings data when it changes
  useEffect(() => {
    if (user?.bookings) {
      console.log("User bookings in Header:", user.bookings.length, user.bookings);
    }
  }, [user?.bookings]);
  
  // Check if we're on login, signup, account page, or tour detail page
  const isAuthPage = pathname === "/login" || pathname === "/signup";
  const isAccountPage = pathname === "/account" || pathname.startsWith("/account/");
  const isTourPage = pathname.includes("/tours/");
  const isHomePage = pathname === "/";
  const isDashboardPage = pathname === "/dashboard";

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const mainNavItems = [
    { name: "Home", href: "/" },
    { name: "Tours", href: "/tours" },
    { name: "Destinations", href: "/destinations" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <header
      className={isDashboardPage? 'hidden' : `fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isDark ? `dark-header ${isScrolled ? 'scrolled' : ''}` : ''} ${
        isScrolled
          ? `bg-white/90 backdrop-blur-sm shadow-md py-3 ${isDark ? 'dark-header-scrolled' : ''}` 
          : isAuthPage || isAccountPage 
            ? `bg-white/70 backdrop-blur-sm py-5 ${isDark ? 'dark-header-auth' : ''}`
            : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <div className="flex items-center gap-2">
            <div className="relative h-10 w-40">
              {/* White logo for transparent header */}
              <Image
                src="/logo-white.png"
                alt="Natours Logo"
                fill
                style={{ objectFit: "contain" }}
                className={`transition-opacity duration-300 ${isScrolled ? 'opacity-0' : 'opacity-100'}`}
                priority
              />
              
              {/* Regular logo for scrolled header */}
              <Image
                src="/logo.png"
                alt="Natours Logo"
                fill
                style={{ objectFit: "contain" }}
                className={`transition-opacity duration-300 absolute top-0 left-0 ${isScrolled ? 'opacity-100' : 'opacity-0'}`}
                priority
              />
            </div>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
        {mainNavItems.map((item) => (
        <Link
        key={item.name}
        href={item.href}
        className={`text-sm font-medium hover:text-emerald-600 transition-colors relative group ${
          isScrolled
            ? (isDark ? 'text-white' : 'text-gray-800')
            : isAuthPage || isAccountPage
              ? (isDark ? 'text-white' : 'text-gray-800')
              : 'text-white'
        }`}
        >
        {item.name}
        <span className="absolute left-0 right-0 bottom-0 h-0.5 bg-emerald-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out"></span>
        </Link>
        ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center space-x-6">
          <SearchBar isAuthPage={isAuthPage || isAccountPage} isScrolled={isScrolled} />
          <WishlistIcon isAuthPage={isAuthPage || isAccountPage} isScrolled={isScrolled} />
          <Link href={isAuthenticated ? "/account?tab=bookings" : "/login"}
            aria-label={isAuthenticated ? "View your bookings" : "Log in to view bookings"}
            title={isAuthenticated ? "View your bookings" : "Log in to view bookings"}
          >
            <button
              className={`p-1.5 relative rounded-full transition-colors ${isAuthenticated ? '' : 'opacity-80'} ${
                isScrolled
                  ? (isDark ? 'text-white hover:bg-gray-700' : 'text-slate-700 hover:bg-gray-100')
                  : isAuthPage || isAccountPage
                    ? (isDark ? 'text-white hover:bg-gray-700' : 'text-slate-700 hover:bg-gray-100')
                    : 'text-white hover:bg-white/10'
              }`}
            >
              <ShoppingBag size={18} />
              {isAuthenticated && user?.bookings?.length > 0 && (
                <span className={`absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 text-xs font-bold rounded-full ${
                  isDark 
                    ? "bg-emerald-500 text-white" 
                    : isScrolled || isAuthPage || isAccountPage
                      ? "bg-emerald-600 text-white " 
                      : "bg-white text-emerald-600"
                }`}>
                  {user.bookings.length}
                </span>
              )}
            </button>
          </Link>
          <ThemeToggle 
            className={`${
              isScrolled
                ? (isDark ? 'text-white hover:bg-gray-700' : 'text-slate-700 hover:bg-gray-100')
                : isAuthPage || isAccountPage
                  ? (isDark ? 'text-white hover:bg-gray-700' : 'text-slate-700 hover:bg-gray-100')
                  : 'text-white hover:bg-white/10'
            }`}
          />
          
          {isAuthenticated ? (
            <div className="relative">
              <button 
                onClick={() => setDropdownOpen(!dropdownOpen)}
                onBlur={() => setTimeout(() => setDropdownOpen(false), 100)}
                className={`flex items-center space-x-2 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  isScrolled || (!isHomePage && !isAuthPage && !isAccountPage)
                    ? "bg-emerald-600 text-white hover:bg-emerald-700"
                    : "bg-white text-emerald-600 hover:bg-emerald-50"
                }`}
              >
                {user?.photo ? (
                  <div className="relative w-6 h-6 rounded-full overflow-hidden">
                    <Image 
                      src={user.photo.startsWith('http') ? user.photo : `https://natours-yslc.onrender.com/img/users/${user.photo}`} 
                      alt={user.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <User size={16} />
                )}
                <span className="max-w-[100px] truncate">{user?.name || 'My Account'}</span>
                <ChevronDown size={14} className={`transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-2 border border-gray-100 dark:border-gray-700 z-50">
                  <Link href="/account">
                    <div className="px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-3">
                      <User size={16} className="text-emerald-600" />
                      <span>My Account</span>
                    </div>
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-3"
                  >
                    <LogOut size={16} className="text-red-500" />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <Link href="/login">
                <button
                  className={`flex items-center space-x-2 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                    isScrolled ? 
                      "bg-emerald-600 text-white hover:bg-emerald-700" : 
                      isAuthPage || isAccountPage ?
                        "bg-emerald-600 text-white hover:bg-emerald-700" :
                        "bg-white text-emerald-600 hover:bg-emerald-50"
                  }`}
                >
                  <User size={16} />
                  <span>Login</span>
                </button>
              </Link>
              <Link href="/signup">
                <button
                  className={`flex items-center space-x-2 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                    isScrolled ?
                      "border border-emerald-600 text-emerald-600 hover:bg-emerald-50" :
                      isAuthPage || isAccountPage ?
                        "border border-emerald-600 text-emerald-600 hover:bg-emerald-50" :
                        "border border-white text-white hover:bg-white/10"
                  }`}
                >
                  <span>Sign Up</span>
                </button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className={`md:hidden p-1.5 rounded-full transition-colors ${
            isScrolled
              ? (isDark ? 'text-white hover:bg-gray-700' : 'text-slate-700 hover:bg-gray-100')
              : isAuthPage || isAccountPage
                ? (isDark ? 'text-white hover:bg-gray-700' : 'text-slate-700 hover:bg-gray-100')
                : 'text-white hover:bg-white/10'
          }`}
        >
          {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className={`md:hidden absolute top-full left-0 right-0 z-40 ${isDark ? 'dark-mobile-menu' : 'bg-white/95 backdrop-blur-sm shadow-lg border-t border-gray-200'}`}>
          <div className="px-4 py-6 space-y-1">
            {mainNavItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="block px-4 py-3 text-base font-medium text-gray-800 dark:text-gray-200 hover:text-emerald-600 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <hr className="my-4" />
            <div className="grid grid-cols-4 gap-2 mb-4">
              <Link href="/search" className="p-2 text-slate-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors flex items-center justify-center">
                <Search size={18} />
              </Link>
              <Link href="/wishlist" className="p-2 text-slate-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors flex items-center justify-center">
                <Heart size={18} />
              </Link>
              <Link 
                href={isAuthenticated ? "/account?tab=bookings" : "/login"}
                className="p-2 text-slate-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors flex items-center justify-center relative"
                onClick={() => setMobileMenuOpen(false)}
              >
                <ShoppingBag size={18} />
                {isAuthenticated && user?.bookings?.length > 0 && (
                  <span className="absolute -top-1 -right-1 flex items-center justify-center w-4 h-4 text-xs font-bold rounded-full bg-emerald-600 text-white">
                    {user.bookings.length}
                  </span>
                )}
              </Link>
              <div className="p-2 text-slate-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors flex items-center justify-center">
                <ThemeToggle />
              </div>
            </div>
            
            {isAuthenticated ? (
              <div className="space-y-2">
                <Link href="/account" onClick={() => setMobileMenuOpen(false)}>
                  <div className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    {user?.photo ? (
                      <div className="relative w-8 h-8 rounded-full overflow-hidden">
                        <Image 
                          src={user.photo.startsWith('http') ? user.photo : `https://natours-yslc.onrender.com/img/users/${user.photo}`} 
                          alt={user.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <User size={18} className="text-emerald-600" />
                    )}
                    <div>
                      <span className="font-medium text-gray-800 dark:text-gray-200">{user?.name || 'My Account'}</span>
                      <p className="text-xs text-gray-500 dark:text-gray-400">View your profile</p>
                    </div>
                  </div>
                </Link>
                <button 
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-3 w-full text-left px-4 py-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <LogOut size={18} className="text-red-500" />
                  <span className="text-gray-800 dark:text-gray-200">Logout</span>
                </button>
              </div>
            ) : (
              <div className="space-y-3 px-4 pt-2">
                <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                  <button className="w-full bg-emerald-600 text-white py-3 rounded-lg font-medium hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2">
                    <User size={16} />
                    <span>Login</span>
                  </button>
                </Link>
                <Link href="/signup" onClick={() => setMobileMenuOpen(false)}>
                  <button className="w-full border border-emerald-600 text-emerald-600 py-3 rounded-lg font-medium hover:bg-emerald-50 transition-colors">
                    <span>Sign Up</span>
                  </button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
