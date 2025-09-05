import { useState, useEffect, useMemo, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Menu,
  X,
  Globe,
  ChevronDown,
  BookOpen,
  Users,
  Award,
  Phone,
  MessageCircle,
  Heart,
  UserCircle,
  Settings,
  GraduationCap,
  LogOut,
  LogIn
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { useWishlist } from "@/hooks/use-wishlist-supabase";
import { fetchCourses } from '@/lib/api';
import { useEffect, useState } from 'react';
import ConsultationModal from '@/components/ConsultationModal';
import { LoginModal } from "@/components/auth/LoginModal";
import { KAISAN_LOGO_PATH } from '@/lib/branding';
import ForcePasswordChangeModal from '@/components/auth/ForcePasswordChangeModal';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const location = useLocation();
  const { lang, setLang, t, dir } = useLanguage();
  const { user, signOut, isAdmin, isTrainer, isStudent } = useAuth();
  const { count } = useWishlist();

  // Featured courses for dropdown
  const [courses, setCourses] = useState<any[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(true);

  useEffect(() => {
    const loadCourses = async () => {
      try {
        const courseData = await fetchCourses();
        setCourses(courseData.slice(0, 3).map(c => ({
          title: c.title,
          path: `/courses/${c.id}`,
          price: c.price === null ? 'Free' : `AED ${c.price.toLocaleString()}`
        })));
      } catch (error) {
        console.error('Error loading courses for navigation:', error);
      } finally {
        setLoadingCourses(false);
      }
    };

    loadCourses();
  }, []);

  const languages = useMemo(() => ([
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "ar", name: "العربية", flag: "🇦🇪" },
  ]), []);

  // Declarative nav config for maintainability
  const primaryLinks = useMemo(() => ([
    { to: '/', label: t('nav.home'), match: (p: string) => p === '/' },
    { to: '/trainers', label: t('nav.trainers'), icon: Users, match: (p: string) => p.startsWith('/trainers') },
    { to: '/verify-certificate', label: t('nav.verifyShort'), icon: Award, match: (p: string) => p.startsWith('/verify-certificate') },
    { to: '/about', label: t('nav.about'), match: (p: string) => p.startsWith('/about') },
    { to: '/contact', label: t('nav.contact'), icon: Phone, match: (p: string) => p.startsWith('/contact') },
  ]), [t]);

  const isActive = useCallback((matcher: (p: string) => boolean) => matcher(location.pathname), [location.pathname]);

  // Close mobile menu on route change
  useEffect(() => { setIsOpen(false); }, [location.pathname]);

  // ESC key closes mobile menu
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setIsOpen(false); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen]);

  // Prevent body scroll when mobile menu open
  useEffect(() => {
    const root = document.documentElement;
    if (isOpen) root.classList.add('overflow-hidden'); else root.classList.remove('overflow-hidden');
    return () => root.classList.remove('overflow-hidden');
  }, [isOpen]);

  const navLinkClass = (active: boolean) => `nav-link ${active ? 'text-primary font-semibold' : 'text-foreground hover:text-primary'} transition-all duration-200 flex items-center px-3 py-2 rounded-md hover:bg-primary/5`;

  return (
    <>
      {/* Skip link for keyboard users */}
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:bg-primary focus:text-primary-foreground focus:px-4 focus:py-2 focus:rounded z-[100]">{t('actions.skipToContent') || 'Skip to main content'}</a>
      <nav className="bg-white/95 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50" dir={dir} role="navigation" aria-label="Main Navigation">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center" aria-label="Kaisan Associates Home">
            <img
              src={KAISAN_LOGO_PATH}
              alt="Kaisan Associates"
              className="h-14 w-auto object-contain"
              loading="eager"
              decoding="async"
              onError={(e) => {
                console.error('Logo failed to load:', KAISAN_LOGO_PATH);
                // Fallback to text-only logo
                const parent = e.currentTarget.parentElement;
                if (parent) {
                  e.currentTarget.style.display = 'none';
                  const textSpan = parent.querySelector('span');
                  if (textSpan) textSpan.style.display = 'block';
                }
              }}
            />
            <span className="hidden ml-3 text-xl font-bold text-gray-900">Kaisan Associates</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {primaryLinks.map(link => {
              const Icon = link.icon;
              const active = isActive(link.match);
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={navLinkClass(active)}
                  aria-current={active ? 'page' : undefined}
                  tabIndex={0}
                >
                  {Icon && <Icon className="w-4 h-4 mr-2" />}
                  <span>{link.label}</span>
                </Link>
              );
            })}

            {/* Courses Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger className={`flex items-center px-3 py-2 rounded-md transition-all duration-200 ${location.pathname.startsWith('/courses') ? 'text-primary font-semibold bg-primary/5' : 'text-foreground hover:text-primary hover:bg-primary/5'}`} aria-haspopup="menu" aria-label={t('nav.courses')}>
                <BookOpen className="w-4 h-4 mr-2" />
                <span>{t('nav.courses')}</span>
                <ChevronDown className="w-4 h-4 ml-1" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64 bg-white border border-gray-200 shadow-lg">
                {courses.map(course => (
                  <DropdownMenuItem key={course.path} asChild>
                    <Link to={course.path} className="flex justify-between items-center px-4 py-2 hover:bg-gray-50">
                      <span className="text-sm">{course.title}</span>
                      <span className="text-accent font-medium text-sm">{course.price}</span>
                    </Link>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuItem asChild>
                  <Link to="/courses" className="text-primary font-semibold px-4 py-2 hover:bg-primary/5">
                    {t('cta.explore')} →
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Action Buttons - Simplified */}
          <div className="hidden lg:flex items-center space-x-4">
            {/* Wishlist */}
            <Button asChild variant="ghost" size="sm" className="relative">
              <Link to="/wishlist" className="flex items-center">
                <Heart className="w-4 h-4 mr-1" />
                <span className="hidden xl:inline">{t("actions.wishlist")}</span>
                {count > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-accent text-white text-xs rounded-full flex items-center justify-center">
                    {count}
                  </span>
                )}
              </Link>
            </Button>

            {/* User Menu */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                    <UserCircle className="w-5 h-5" />
                    <span className="hidden md:inline">{user.email}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {isAdmin && (
                    <DropdownMenuItem asChild>
                      <Link to="/admin" className="flex items-center">
                        <Settings className="w-4 h-4 mr-2" />
                        Admin Panel
                      </Link>
                    </DropdownMenuItem>
                  )}
                  {isTrainer && (
                    <DropdownMenuItem asChild>
                      <Link to="/trainer-dashboard" className="flex items-center">
                        <GraduationCap className="w-4 h-4 mr-2" />
                        Trainer Dashboard
                      </Link>
                    </DropdownMenuItem>
                  )}
                  {isStudent && (
                    <DropdownMenuItem asChild>
                      <Link to="/student-dashboard" className="flex items-center">
                        <BookOpen className="w-4 h-4 mr-2" />
                        Student Dashboard
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem asChild>
                    <Link to="/wishlist" className="flex items-center">
                      <Heart className="w-4 h-4 mr-2" />
                      Wishlist ({count})
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={signOut} className="text-red-600">
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button onClick={() => setShowLoginModal(true)} size="sm">
                <LogIn className="w-4 h-4 mr-2" />
                Sign In
              </Button>
            )}

            {/* Language Selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Globe className="w-4 h-4 mr-1" />
                  <span>{lang.toUpperCase()}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-white border border-gray-200">
                {languages.map((language) => (
                  <DropdownMenuItem 
                    key={language.code} 
                    className="flex items-center space-x-2 cursor-pointer px-4 py-2"
                    onClick={() => setLang(language.code as "en" | "ar")}
                  >
                    <span>{language.flag}</span>
                    <span>{language.name}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Primary CTA */}
            {!user && (
              <Button asChild className="bg-primary hover:bg-primary/90 text-white">
                <Link to="/courses/prp-mentoring">
                  {t("cta.enroll")}
                </Link>
              </Button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(o => !o)}
              aria-label={isOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isOpen}
              aria-controls="mobile-nav"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div
          id="mobile-nav"
          className={`${isOpen ? 'block' : 'hidden'} lg:hidden border-t border-gray-200 py-6 bg-white`}
        >
          <div className="px-4 space-y-6">
            {/* Primary Links */}
            <div className="space-y-3">
              {primaryLinks.map(link => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`block px-3 py-2 rounded-md text-base ${isActive(link.match) ? 'text-primary font-semibold bg-primary/5' : 'text-gray-700 hover:text-primary hover:bg-gray-50'} transition-colors`}
                  aria-current={isActive(link.match) ? 'page' : undefined}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Courses Section */}
            <div className="space-y-3">
              <div className="text-gray-500 font-medium text-sm uppercase tracking-wide px-3">{t('nav.courses')}</div>
              {courses.map(course => (
                <Link
                  key={course.path}
                  to={course.path}
                  className="block px-6 py-2 text-sm text-gray-600 hover:text-primary hover:bg-gray-50 rounded-md transition-colors"
                >
                  <div className="flex justify-between items-center">
                    <span>{course.title}</span>
                    <span className="text-accent font-medium">{course.price}</span>
                  </div>
                </Link>
              ))}
              <Link
                to="/courses"
                className="block px-6 py-2 text-sm text-primary font-semibold hover:bg-primary/5 rounded-md"
              >
                {t('cta.explore')} →
              </Link>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-4 border-t border-gray-200">
              <Button asChild variant="outline" className="w-full justify-center">
                <Link to="/wishlist" className="flex items-center">
                  <Heart className="w-4 h-4 mr-2" />
                  {t("actions.wishlist")}
                  {count > 0 && (
                    <span className="ml-2 w-5 h-5 bg-accent text-white text-xs rounded-full flex items-center justify-center">
                      {count}
                    </span>
                  )}
                </Link>
              </Button>
              
              <Button asChild className="w-full justify-center bg-primary hover:bg-primary/90 text-white">
                <Link to="/courses/prp-mentoring">{t('cta.enroll')}</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </nav>
    
    <LoginModal open={showLoginModal} onOpenChange={setShowLoginModal} />
  <ForcePasswordChangeModal />
    </>
  );
};

export default Navigation;