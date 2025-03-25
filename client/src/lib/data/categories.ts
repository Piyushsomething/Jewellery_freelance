export interface Category {
  id: number;
  name: string;
  slug: string;
  image: string;
}

// These are used for navigation and homepage display
// The actual data is fetched from the API
export const categories: Category[] = [
  {
    id: 1,
    name: 'Rings',
    slug: 'rings',
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 2,
    name: 'Earrings',
    slug: 'earrings',
    image: 'https://images.unsplash.com/photo-1589128777073-263566ae5e4d?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 3,
    name: 'Necklaces',
    slug: 'necklaces',
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 4,
    name: 'Bracelets',
    slug: 'bracelets',
    image: 'https://images.unsplash.com/photo-1630018548696-e1900b010acc?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 5,
    name: 'Gemstones',
    slug: 'gemstones',
    image: 'https://images.unsplash.com/photo-1574010498544-4d73cfd939ed?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80'
  },
];

export interface Subcategory {
  id: number;
  name: string;
  slug: string;
  categoryId: number;
}

export const subcategories: Record<string, Subcategory[]> = {
  rings: [
    { id: 1, name: 'Diamond Rings', slug: 'diamond-rings', categoryId: 1 },
    { id: 2, name: 'Engagement Rings', slug: 'engagement-rings', categoryId: 1 },
    { id: 3, name: 'Wedding Bands', slug: 'wedding-bands', categoryId: 1 },
    { id: 4, name: 'Gemstone Rings', slug: 'gemstone-rings', categoryId: 1 },
  ],
  earrings: [
    { id: 5, name: 'Stud Earrings', slug: 'stud-earrings', categoryId: 2 },
    { id: 6, name: 'Hoop Earrings', slug: 'hoop-earrings', categoryId: 2 },
    { id: 7, name: 'Drop Earrings', slug: 'drop-earrings', categoryId: 2 },
  ],
  necklaces: [
    { id: 8, name: 'Pendants', slug: 'pendants', categoryId: 3 },
    { id: 9, name: 'Chokers', slug: 'chokers', categoryId: 3 },
    { id: 10, name: 'Chains', slug: 'chains', categoryId: 3 },
  ],
  bracelets: [
    { id: 11, name: 'Tennis Bracelets', slug: 'tennis-bracelets', categoryId: 4 },
    { id: 12, name: 'Cuff Bracelets', slug: 'cuff-bracelets', categoryId: 4 },
    { id: 13, name: 'Charm Bracelets', slug: 'charm-bracelets', categoryId: 4 },
  ],
  gemstones: [
    { id: 14, name: 'Diamonds', slug: 'diamonds', categoryId: 5 },
    { id: 15, name: 'Sapphires', slug: 'sapphires', categoryId: 5 },
    { id: 16, name: 'Emeralds', slug: 'emeralds', categoryId: 5 },
    { id: 17, name: 'Rubies', slug: 'rubies', categoryId: 5 },
  ],
};
