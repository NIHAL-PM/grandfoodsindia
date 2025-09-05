import { useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "kaisan_wishlist_v1";

export type WishlistItem = {
  id: string;
  title: string;
  price?: string | number | null;
};

export function useWishlist() {
  const [items, setItems] = useState<WishlistItem[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const add = (item: WishlistItem) => {
    setItems((prev) => (prev.find((i) => i.id === item.id) ? prev : [...prev, item]));
  };

  const remove = (id: string) => setItems((prev) => prev.filter((i) => i.id !== id));

  const toggle = (item: WishlistItem) => {
    setItems((prev) => (prev.find((i) => i.id === item.id) ? prev.filter((i) => i.id !== item.id) : [...prev, item]));
  };

  const has = (id: string) => items.some((i) => i.id === id);

  const count = items.length;

  return useMemo(() => ({ items, add, remove, toggle, has, count }), [items]);
}
