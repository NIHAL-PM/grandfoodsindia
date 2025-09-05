import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Clock,
  Users,
  Award,
  Star,
  Search,
  Calendar,
  Globe,
  Heart,
  BookOpen,
  Video,
  User
} from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import WishlistButton from "@/components/WishlistButton";
import { DbCourse as MockCourse } from "@/lib/api";
import { useLanguage } from '@/context/LanguageContext';
import { fetchCourses } from '@/lib/api';
import { useQuery } from '@tanstack/react-query';

const Courses = () => {
  const { t, dir } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Fetch courses from Supabase
  const { data: courses = [], isLoading, error } = useQuery({
    queryKey: ['courses'],
    queryFn: fetchCourses,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const categories = useMemo(() => {
    const base = Array.from(new Set(courses.map(c => c.category || 'General')));
    return ['All', ...base];
  }, [courses]);

  const filteredCourses = useMemo(() => courses.filter(course => {
    const term = searchTerm.toLowerCase();
    const matchesSearch = course.title.toLowerCase().includes(term) ||
      (course.instructor || '').toLowerCase().includes(term) ||
      (course.description || '').toLowerCase().includes(term);
    const matchesCategory = selectedCategory === 'All' || course.category === selectedCategory;
    return matchesSearch && matchesCategory;
  }), [courses, searchTerm, selectedCategory]);

  const formatPrice = (course: MockCourse) => {
    if (course.price === null) return course.currency; // Custom pricing label
    return `${course.currency}${course.price.toLocaleString()}`;
  };

  return (
    <div className="min-h-screen bg-background" dir={dir}>
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary via-primary-light to-accent-light py-20">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge className="bg-accent/20 text-accent border-accent/30 mb-6">
            {t('courses.hero.badge')}
          </Badge>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-playfair font-bold text-primary-foreground mb-6">
            {t('courses.hero.title1')}
            <span className="block text-accent">{t('courses.hero.title2')}</span>
          </h1>
          <p className="text-xl text-primary-foreground/90 max-w-3xl mx-auto leading-relaxed">
            {t('courses.hero.desc')}
          </p>
        </div>
      </section>

      {/* Search & Filter */}
      <section className="py-12 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-6 items-center">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder={t('courses.search.placeholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className={selectedCategory === category ? "btn-hero" : ""}
                >
                  {category === 'All' ? t('courses.filter.all') : category}
                </Button>
              ))}
            </div>
          </div>

          <div className="mt-6 text-center text-muted-foreground">
            {t('courses.showing')} {filteredCourses.length} {filteredCourses.length === 1 ? t('courses.course') : t('courses.courses')}
          </div>
        </div>
      </section>

      {/* Courses Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading && (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">{t('courses.loading')}</p>
            </div>
          )}

          {error && (
            <div className="text-center py-12">
              <p className="text-destructive mb-4">{t('courses.error')}</p>
              <Button onClick={() => window.location.reload()} variant="outline">
                {t('common.tryAgain')}
              </Button>
            </div>
          )}

          {!isLoading && !error && filteredCourses.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">{t('courses.noResults')}</p>
            </div>
          )}

          {!isLoading && !error && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredCourses.map((course) => (
                <Card key={course.id} className="card-elevated group hover:scale-105 transition-all duration-300">
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start mb-3">
                    <Badge className="bg-primary/10 text-primary">
                      {course.category}
                    </Badge>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary">
                        {formatPrice(course)}
                      </div>
                      {course.price && (
                        <div className="text-xs text-muted-foreground">{t('courses.perPerson')}</div>
                      )}
                    </div>
                  </div>

                  <CardTitle className="text-xl mb-2 group-hover:text-primary transition-colors">
                    {course.title}
                  </CardTitle>
                  {course.subtitle && (
                    <p className="text-sm text-accent font-medium mb-3">
                      {course.subtitle}
                    </p>
                  )}

                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-accent fill-current" />
                      <span>{course.rating}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="w-4 h-4" />
                      <span>{course.students}</span>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  <p className="text-muted-foreground text-sm mb-4 leading-relaxed line-clamp-4">
                    {course.description}
                  </p>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-2">
                        <User className="w-4 h-4 text-primary" />
                        <span className="text-muted-foreground">{t('courses.instructor')}:</span>
                      </div>
                      <span className="font-medium">{course.instructor}</span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-primary" />
                        <span className="text-muted-foreground">{t('courses.duration')}:</span>
                      </div>
                      <span className="font-medium">{course.duration}</span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-2">
                        <Video className="w-4 h-4 text-primary" />
                        <span className="text-muted-foreground">{t('courses.format')}:</span>
                      </div>
                      <span className="font-medium">{course.format}</span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-primary" />
                        <span className="text-muted-foreground">{t('courses.schedule')}:</span>
                      </div>
                      <span className="font-medium text-xs">{course.schedule}</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Button asChild className="w-full btn-hero">
                      <Link to={`/courses/${course.id}`}>
                        <BookOpen className="w-4 h-4 mr-2" />
                        {t('courses.viewDetailsEnroll')}
                      </Link>
                    </Button>

                    <div className="flex justify-center">
                      <WishlistButton
                        item={{ id: course.id, title: course.title, price: course.price ?? course.currency }}
                        variant="ghost"
                        size="sm"
                        className="text-primary hover:text-primary"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
        </div>
      </section>

      {/* Why Choose Our Courses */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-playfair font-bold mb-6">{t('courses.why.title')}</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              {t('courses.why.desc')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="card-feature text-center">
              <Award className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-3">{t('courses.feature.certified')}</h3>
              <p className="text-muted-foreground text-sm">{t('courses.feature.certified.desc')}</p>
            </div>

            <div className="card-feature text-center">
              <Users className="w-12 h-12 text-accent mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-3">{t('courses.feature.expert')}</h3>
              <p className="text-muted-foreground text-sm">{t('courses.feature.expert.desc')}</p>
            </div>

            <div className="card-feature text-center">
              <Globe className="w-12 h-12 text-success mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-3">{t('courses.feature.global')}</h3>
              <p className="text-muted-foreground text-sm">{t('courses.feature.global.desc')}</p>
            </div>

            <div className="card-feature text-center">
              <Heart className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-3">{t('courses.feature.support')}</h3>
              <p className="text-muted-foreground text-sm">{t('courses.feature.support.desc')}</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Courses;