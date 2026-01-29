// Security summary (student note): cart data is stored locally only; prices are still
// validated on the server to prevent client-side tampering.
export type CartItem = {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
};

const STORAGE_KEY = 'beers_cart';

function readCart(): CartItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as CartItem[];
  } catch {
    return [];
  }
}

function writeCart(items: CartItem[]) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event('cart_updated'));
}

export function getCart(): CartItem[] {
  return readCart();
}

export function addToCart(item: Omit<CartItem, 'quantity'>, quantity = 1) {
  const items = readCart();
  const existing = items.find((entry) => entry.id === item.id);
  if (existing) {
    existing.quantity += quantity;
  } else {
    items.push({ ...item, quantity });
  }
  writeCart(items);
  return items;
}

export function updateQuantity(id: string, quantity: number) {
  const items = readCart().map((entry) =>
    entry.id === id ? { ...entry, quantity: Math.max(1, quantity) } : entry
  );
  writeCart(items);
  return items;
}

export function removeFromCart(id: string) {
  const items = readCart().filter((entry) => entry.id !== id);
  writeCart(items);
  return items;
}

export function clearCart() {
  writeCart([]);
  return [];
}
