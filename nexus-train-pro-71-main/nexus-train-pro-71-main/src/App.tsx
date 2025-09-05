import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from 'react';
import { LanguageProvider } from "./context/LanguageContext";
import { AuthProvider } from "./context/AuthContext";
import CookieConsent from "./components/CookieConsent";
import { ErrorBoundary } from '@/components/ErrorBoundary';

const Index = lazy(() => import('./pages/Index'));
const NotFound = lazy(() => import('./pages/NotFound'));
const About = lazy(() => import('./pages/About'));
const Courses = lazy(() => import('./pages/Courses'));
const CourseDetail = lazy(() => import('./pages/CourseDetail'));
const Trainers = lazy(() => import('./pages/Trainers'));
const TrainerProfile = lazy(() => import('./pages/TrainerProfile'));
const Contact = lazy(() => import('./pages/Contact'));
const VerifyCertificate = lazy(() => import('./pages/VerifyCertificate'));
const BecomeTrainer = lazy(() => import('./pages/BecomeTrainer'));
const Login = lazy(() => import('./pages/Login'));
const EnhancedAdminPanel = lazy(() => import('./pages/EnhancedAdminPanel'));
const TrainerDashboard = lazy(() => import('./pages/TrainerDashboard'));
const StudentDashboard = lazy(() => import('./pages/StudentDashboard'));
const StudentProfile = lazy(() => import('./pages/StudentProfile'));
const CourseMaterials = lazy(() => import('./pages/CourseMaterials'));
const LiveClass = lazy(() => import('./pages/LiveClass'));
const Privacy = lazy(() => import('./pages/Privacy'));
const TermsOfService = lazy(() => import('./pages/TermsOfService'));
const CookiePolicy = lazy(() => import('./pages/CookiePolicy'));
const Wishlist = lazy(() => import('./pages/Wishlist'));

const Fallback = () => <div className="p-8 text-center text-sm text-muted-foreground">Loading...</div>;

const App = () => (
    <LanguageProvider>
      <AuthProvider>
        <TooltipProvider>
        <Toaster />
        <Sonner />
          <BrowserRouter>
            <CookieConsent />
            <ErrorBoundary>
              <Suspense fallback={<Fallback />}>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/courses" element={<Courses />} />
                  <Route path="/courses/:courseId" element={<CourseDetail />} />
                  <Route path="/trainers" element={<Trainers />} />
                  <Route path="/trainers/:trainerId" element={<TrainerProfile />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/verify-certificate" element={<VerifyCertificate />} />
                  <Route path="/become-trainer" element={<BecomeTrainer />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/admin" element={<EnhancedAdminPanel />} />
                  <Route path="/trainer-dashboard" element={<TrainerDashboard />} />
                  <Route path="/student-dashboard" element={<StudentDashboard />} />
                  <Route path="/student-profile/:id" element={<StudentProfile />} />
                  <Route path="/course/:id/materials" element={<CourseMaterials />} />
                  <Route path="/live-class/:classId" element={<LiveClass />} />
                  <Route path="/privacy" element={<Privacy />} />
                  <Route path="/terms" element={<TermsOfService />} />
                  <Route path="/cookie-policy" element={<CookiePolicy />} />
                  <Route path="/wishlist" element={<Wishlist />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </ErrorBoundary>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </LanguageProvider>
);

export default App;
