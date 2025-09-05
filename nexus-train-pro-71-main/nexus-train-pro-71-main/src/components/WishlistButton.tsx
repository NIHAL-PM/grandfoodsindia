import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { useWishlist, WishlistItem } from "@/hooks/use-wishlist-supabase";
import { useToast } from "@/components/ui/use-toast";
import { useLanguage } from "@/context/LanguageContext";

interface WishlistButtonProps {
  item: WishlistItem;
  className?: string;
  variant?: "default" | "outline" | "ghost";
  size?: "sm" | "lg" | "icon";
}

const WishlistButton = ({ 
  item, 
  className, 
  variant = "outline", 
  size = "sm" 
}: WishlistButtonProps) => {
  const { has, toggle } = useWishlist();
  const { toast } = useToast();
  const { t } = useLanguage();
  
  const isInWishlist = has(item.id);

  const handleToggle = () => {
    toggle(item);
    toast({ 
      title: isInWishlist ? "Removed from wishlist" : "Added to wishlist",
      description: isInWishlist ? 
        `${item.title} removed from your wishlist` : 
        `${item.title} added to your wishlist`
    });
  };

  return (
    <Button 
      variant={variant} 
      size={size} 
      onClick={handleToggle}
      className={`${className} ${isInWishlist ? 'text-red-500 hover:text-red-600' : ''}`}
    >
      <Heart className={`w-4 h-4 mr-1 ${isInWishlist ? 'fill-current' : ''}`} />
      {isInWishlist ? t("actions.removeWishlist") : t("actions.addWishlist")}
    </Button>
  );
};

export default WishlistButton;