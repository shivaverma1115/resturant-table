export type PublicStoreDemoItem = Readonly<{
  id: string;
  name: string;
  description: string;
  location: string;
  priceCents: number;
  isAvailable: boolean;
}>;

export const PUBLIC_STORE_DEMO_ITEMS: PublicStoreDemoItem[] = [
  {
    id: "espresso-classic",
    name: "Espresso Classic",
    description: "Double-shot espresso with rich crema finish.",
    location: "Bar counter",
    priceCents: 399,
    isAvailable: true,
  },
  {
    id: "caramel-latte",
    name: "Caramel Latte",
    description: "Steamed milk, espresso, and house caramel syrup.",
    location: "Hot drinks",
    priceCents: 549,
    isAvailable: true,
  },
  {
    id: "mocha-frost",
    name: "Mocha Frost",
    description: "Iced mocha blend topped with cream and cocoa.",
    location: "Cold drinks",
    priceCents: 629,
    isAvailable: true,
  },
  {
    id: "vanilla-cheesecake",
    name: "Vanilla Cheesecake",
    description: "Creamy slice served chilled with cookie crust.",
    location: "Desserts",
    priceCents: 459,
    isAvailable: false,
  },
  {
    id: "smoked-chicken-sandwich",
    name: "Smoked Chicken Sandwich",
    description: "Toasted bun, smoked chicken, lettuce, and aioli.",
    location: "Kitchen",
    priceCents: 799,
    isAvailable: true,
  },
  {
    id: "hazelnut-croissant",
    name: "Hazelnut Croissant",
    description: "Buttery croissant filled with hazelnut spread.",
    location: "Bakery",
    priceCents: 349,
    isAvailable: true,
  },
];

export function formatMoneyFromCents(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

export function findPublicStoreDemoItemById(
  itemId: string,
): PublicStoreDemoItem | undefined {
  return PUBLIC_STORE_DEMO_ITEMS.find((item) => item.id === itemId);
}
