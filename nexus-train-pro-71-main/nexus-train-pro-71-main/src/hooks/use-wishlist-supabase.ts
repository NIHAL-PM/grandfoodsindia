import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/use-toast";

export type WishlistItem = {
  id: string;
  title: string;
  price?: string | number | null;
};

export function useWishlist() {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  // Load wishlist from Supabase when user is authenticated
  useEffect(() => {
    if (user) {
      loadWishlist();
    } else {
      // Load from localStorage for unauthenticated users
      loadLocalWishlist();
    }
  }, [user]);

  const loadWishlist = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Type cast for migration compatibility
      const supabaseClient = supabase as any;
      const { data, error } = await supabaseClient
        .from('wishlists')
        .select('*')
        .eq('user_id', user.id);

      if (error) {
        console.error('Error loading wishlist:', error);
        toast({
          title: "Error",
          description: "Failed to load wishlist",
          variant: "destructive",
        });
      } else {
        const wishlistItems = data?.map((item: any) => ({
          id: item.course_id,
          title: item.course_title,
          price: item.course_price,
        })) || [];
        setItems(wishlistItems);
      }
    } catch (error) {
      console.error('Error loading wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadLocalWishlist = () => {
    try {
      const raw = localStorage.getItem("kaisan_wishlist_v1");
      setItems(raw ? JSON.parse(raw) : []);
    } catch {
      setItems([]);
    }
  };

  const syncToSupabase = async (item: WishlistItem, action: 'add' | 'remove') => {
    if (!user) return;

    try {
      // Type cast for migration compatibility
      const supabaseClient = supabase as any;
      if (action === 'add') {
        const { error } = await supabaseClient
          .from('wishlists')
          .insert({
            user_id: user.id,
            course_id: item.id,
            course_title: item.title,
            course_price: item.price?.toString(),
          });

        if (error) {
          console.error('Error adding to wishlist:', error);
          throw error;
        }
      } else {
        const { error } = await supabaseClient
          .from('wishlists')
          .delete()
          .eq('user_id', user.id)
          .eq('course_id', item.id);

        if (error) {
          console.error('Error removing from wishlist:', error);
          throw error;
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${action} item ${action === 'add' ? 'to' : 'from'} wishlist`,
        variant: "destructive",
      });
      throw error;
    }
  };

  const syncToLocal = (newItems: WishlistItem[]) => {
    localStorage.setItem("kaisan_wishlist_v1", JSON.stringify(newItems));
  };

  const add = async (item: WishlistItem) => {
    const exists = items.find((i) => i.id === item.id);
    if (exists) return;

    const newItems = [...items, item];
    setItems(newItems);

    if (user) {
      try {
        await syncToSupabase(item, 'add');
      } catch {
        // Revert on error
        setItems(items);
      }
    } else {
      syncToLocal(newItems);
    }
  };

  const remove = async (id: string) => {
    const item = items.find(i => i.id === id);
    if (!item) return;

    const newItems = items.filter((i) => i.id !== id);
    setItems(newItems);

    if (user) {
      try {
        await syncToSupabase(item, 'remove');
      } catch {
        // Revert on error
        setItems(items);
      }
    } else {
      syncToLocal(newItems);
    }
  };

  const toggle = async (item: WishlistItem) => {
    const exists = items.find((i) => i.id === item.id);
    if (exists) {
      await remove(item.id);
    } else {
      await add(item);
    }
  };

  const has = (id: string) => items.some((i) => i.id === id);

  const count = items.length;

  // Migrate local wishlist to Supabase when user logs in
  useEffect(() => {
    const migrateLocalWishlist = async () => {
      if (!user) return;

      try {
        const raw = localStorage.getItem("kaisan_wishlist_v1");
        const localItems = raw ? JSON.parse(raw) : [];
        
        if (localItems.length > 0) {
          // Add all local items to Supabase
          for (const item of localItems) {
            try {
              await syncToSupabase(item, 'add');
            } catch (error) {
              // Continue if item already exists
            }
          }
          
          // Clear local storage after migration
          localStorage.removeItem("kaisan_wishlist_v1");
          
          // Reload wishlist from Supabase
          await loadWishlist();
        }
      } catch (error) {
        console.error('Error migrating wishlist:', error);
      }
    };

    if (user && items.length === 0) {
      migrateLocalWishlist();
    }
  }, [user]);

  return useMemo(() => ({ 
    items, 
    add, 
    remove, 
    toggle, 
    has, 
    count, 
    loading 
  }), [items, loading]);
}