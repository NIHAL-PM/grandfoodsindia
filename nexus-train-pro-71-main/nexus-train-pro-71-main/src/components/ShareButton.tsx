import { Button } from "@/components/ui/button";
import { Share2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface ShareButtonProps {
  title: string;
  description?: string;
  url?: string;
  className?: string;
  variant?: "default" | "outline" | "ghost";
  size?: "sm" | "lg" | "icon";
}

const ShareButton = ({ 
  title, 
  description, 
  url, 
  className, 
  variant = "outline", 
  size = "sm" 
}: ShareButtonProps) => {
  const { toast } = useToast();

  const handleShare = async () => {
    const shareUrl = url || window.location.href;
    const shareText = description || `Check out: ${title}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: shareText,
          url: shareUrl,
        });
      } catch (error) {
        // User cancelled sharing, do nothing
      }
    } else {
      // Fallback to clipboard
      try {
        await navigator.clipboard.writeText(shareUrl);
        toast({ 
          title: "Link copied!", 
          description: "Share link copied to clipboard" 
        });
      } catch (error) {
        toast({ 
          title: "Error", 
          description: "Failed to copy link",
          variant: "destructive"
        });
      }
    }
  };

  return (
    <Button 
      variant={variant} 
      size={size} 
      onClick={handleShare}
      className={className}
    >
      <Share2 className="w-4 h-4 mr-1" />
      Share
    </Button>
  );
};

export default ShareButton;