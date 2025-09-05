import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Trash2, Share2, ArrowRight, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import { useWishlist } from "@/hooks/use-wishlist";
import { useLanguage } from "@/context/LanguageContext";
import { useToast } from "@/components/ui/use-toast";

const Wishlist = () => {
  const { items, remove, count } = useWishlist();
  const { t, dir } = useLanguage();
  const { toast } = useToast();

  const handleShare = (item: any) => {
    if (navigator.share) {
      navigator.share({
        title: item.title,
        text: `Check out this course: ${item.title}`,
        url: `/courses/${item.id}`,
      });
    } else {
      navigator.clipboard.writeText(`${window.location.origin}/courses/${item.id}`);
      toast({ title: "Link copied to clipboard!" });
    }
  };

  return (
    <div className="min-h-screen bg-background" dir={dir}>
      <Navigation />
      
      {/* Header */}
      <section className="py-12 bg-gradient-to-br from-primary via-primary-light to-accent-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl font-playfair font-bold text-primary-foreground mb-4">
              {t("actions.wishlist")}
            </h1>
            <p className="text-xl text-primary-foreground/90">
              {count} saved courses for later
            </p>
          </div>
        </div>
      </section>

      {/* Wishlist Content */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {items.length === 0 ? (
            <div className="text-center py-20">
              <Heart className="w-16 h-16 text-muted-foreground mx-auto mb-6" />
              <h2 className="text-2xl font-playfair font-bold mb-4">Your wishlist is empty</h2>
              <p className="text-muted-foreground mb-8">
                Start adding courses you're interested in to keep track of them.
              </p>
              <Button asChild className="btn-hero">
                <Link to="/courses">
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Browse Courses
                </Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {items.map((item) => (
                <Card key={item.id} className="card-elevated group hover:scale-105 transition-all duration-300">
                  <CardHeader className="pb-4">
                    <div className="flex justify-between items-start mb-3">
                      <Badge className="bg-primary/10 text-primary">
                        Saved Course
                      </Badge>
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleShare(item)}
                          className="text-muted-foreground hover:text-primary"
                        >
                          <Share2 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => remove(item.id)}
                          className="text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <CardTitle className="text-xl mb-2 group-hover:text-primary transition-colors">
                      {item.title}
                    </CardTitle>

                    {item.price && (
                      <div className="text-2xl font-bold text-primary">
                        ₹{typeof item.price === 'number' ? item.price.toLocaleString() : item.price}
                      </div>
                    )}
                  </CardHeader>

                  <CardContent>
                    <div className="space-y-3">
                      <Button asChild className="w-full btn-hero">
                        <Link to={`/courses/${item.id}`}>
                          <ArrowRight className="w-4 h-4 mr-2" />
                          {t("actions.viewDetails")}
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Wishlist;