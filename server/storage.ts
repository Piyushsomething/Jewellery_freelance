import { 
  users, User, InsertUser, 
  categories, Category, InsertCategory,
  subcategories, Subcategory, InsertSubcategory,
  products, Product, InsertProduct,
  cartItems, CartItem, InsertCartItem, CartItemWithProduct
} from "@shared/schema";

// Full storage interface for the application
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Category operations
  getAllCategories(): Promise<Category[]>;
  getCategoryById(id: number): Promise<Category | undefined>;
  getCategoryBySlug(slug: string): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;

  // Subcategory operations
  getAllSubcategories(): Promise<Subcategory[]>;
  getSubcategoriesByCategoryId(categoryId: number): Promise<Subcategory[]>;
  getSubcategoryById(id: number): Promise<Subcategory | undefined>;
  getSubcategoryBySlug(slug: string): Promise<Subcategory | undefined>;
  createSubcategory(subcategory: InsertSubcategory): Promise<Subcategory>;

  // Product operations
  getAllProducts(): Promise<Product[]>;
  getProductById(id: number): Promise<Product | undefined>;
  getProductBySlug(slug: string): Promise<Product | undefined>;
  getProductsByCategoryId(categoryId: number): Promise<Product[]>;
  getProductsBySubcategoryId(subcategoryId: number): Promise<Product[]>;
  searchProducts(query: string): Promise<Product[]>;
  getFeaturedProducts(): Promise<Product[]>;
  getNewArrivals(): Promise<Product[]>;
  getBestsellers(): Promise<Product[]>;
  getOnSaleProducts(): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;

  // Cart operations
  getCartItems(userId?: number, sessionId?: string): Promise<CartItemWithProduct[]>;
  getCartItemById(id: number): Promise<CartItem | undefined>;
  addToCart(cartItem: InsertCartItem): Promise<CartItem>;
  updateCartItemQuantity(id: number, quantity: number): Promise<CartItem | undefined>;
  removeFromCart(id: number): Promise<boolean>;
  clearCart(userId?: number, sessionId?: string): Promise<boolean>;
  getCartTotal(userId?: number, sessionId?: string): Promise<number>;
}

// In-memory implementation of the storage interface
export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private categories: Map<number, Category>;
  private subcategories: Map<number, Subcategory>;
  private products: Map<number, Product>;
  private cartItems: Map<number, CartItem>;
  
  private userId: number;
  private categoryId: number;
  private subcategoryId: number;
  private productId: number;
  private cartItemId: number;

  constructor() {
    this.users = new Map();
    this.categories = new Map();
    this.subcategories = new Map();
    this.products = new Map();
    this.cartItems = new Map();
    
    this.userId = 1;
    this.categoryId = 1;
    this.subcategoryId = 1;
    this.productId = 1;
    this.cartItemId = 1;
    
    // Initialize with sample data
    this.initializeData();
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username.toLowerCase() === username.toLowerCase()
    );
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email.toLowerCase() === email.toLowerCase()
    );
  }

  async createUser(userData: InsertUser): Promise<User> {
    const id = this.userId++;
    const createdAt = new Date();
    const user: User = { ...userData, id, createdAt };
    this.users.set(id, user);
    return user;
  }

  // Category operations
  async getAllCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }

  async getCategoryById(id: number): Promise<Category | undefined> {
    return this.categories.get(id);
  }

  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    return Array.from(this.categories.values()).find(
      (category) => category.slug === slug
    );
  }

  async createCategory(categoryData: InsertCategory): Promise<Category> {
    const id = this.categoryId++;
    const category: Category = { ...categoryData, id };
    this.categories.set(id, category);
    return category;
  }

  // Subcategory operations
  async getAllSubcategories(): Promise<Subcategory[]> {
    return Array.from(this.subcategories.values());
  }

  async getSubcategoriesByCategoryId(categoryId: number): Promise<Subcategory[]> {
    return Array.from(this.subcategories.values()).filter(
      (subcategory) => subcategory.categoryId === categoryId
    );
  }

  async getSubcategoryById(id: number): Promise<Subcategory | undefined> {
    return this.subcategories.get(id);
  }

  async getSubcategoryBySlug(slug: string): Promise<Subcategory | undefined> {
    return Array.from(this.subcategories.values()).find(
      (subcategory) => subcategory.slug === slug
    );
  }

  async createSubcategory(subcategoryData: InsertSubcategory): Promise<Subcategory> {
    const id = this.subcategoryId++;
    const subcategory: Subcategory = { ...subcategoryData, id };
    this.subcategories.set(id, subcategory);
    return subcategory;
  }

  // Product operations
  async getAllProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async getProductById(id: number): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async getProductBySlug(slug: string): Promise<Product | undefined> {
    return Array.from(this.products.values()).find(
      (product) => product.slug === slug
    );
  }

  async getProductsByCategoryId(categoryId: number): Promise<Product[]> {
    return Array.from(this.products.values()).filter(
      (product) => product.categoryId === categoryId
    );
  }

  async getProductsBySubcategoryId(subcategoryId: number): Promise<Product[]> {
    return Array.from(this.products.values()).filter(
      (product) => product.subcategoryId === subcategoryId
    );
  }

  async searchProducts(query: string): Promise<Product[]> {
    const lowercaseQuery = query.toLowerCase();
    return Array.from(this.products.values()).filter(
      (product) =>
        product.name.toLowerCase().includes(lowercaseQuery) ||
        (product.description && product.description.toLowerCase().includes(lowercaseQuery)) ||
        (product.metal && product.metal.toLowerCase().includes(lowercaseQuery)) ||
        (product.gemstone && product.gemstone.toLowerCase().includes(lowercaseQuery))
    );
  }

  async getFeaturedProducts(): Promise<Product[]> {
    return Array.from(this.products.values()).filter(
      (product) => product.isFeatured
    );
  }

  async getNewArrivals(): Promise<Product[]> {
    return Array.from(this.products.values()).filter(
      (product) => product.isNew
    );
  }

  async getBestsellers(): Promise<Product[]> {
    return Array.from(this.products.values()).filter(
      (product) => product.isBestseller
    );
  }

  async getOnSaleProducts(): Promise<Product[]> {
    return Array.from(this.products.values()).filter(
      (product) => product.isOnSale
    );
  }

  async createProduct(productData: InsertProduct): Promise<Product> {
    const id = this.productId++;
    const createdAt = new Date();
    const product: Product = { ...productData, id, createdAt };
    this.products.set(id, product);
    return product;
  }

  // Cart operations
  async getCartItems(userId?: number, sessionId?: string): Promise<CartItemWithProduct[]> {
    return Array.from(this.cartItems.values())
      .filter(item => 
        (userId && item.userId === userId) || 
        (sessionId && item.sessionId === sessionId)
      )
      .map(item => {
        const product = this.products.get(item.productId);
        if (!product) {
          throw new Error(`Product with id ${item.productId} not found`);
        }
        return { ...item, product };
      });
  }

  async getCartItemById(id: number): Promise<CartItem | undefined> {
    return this.cartItems.get(id);
  }

  async addToCart(cartItemData: InsertCartItem): Promise<CartItem> {
    // Check if product exists
    const product = this.products.get(cartItemData.productId);
    if (!product) {
      throw new Error(`Product with id ${cartItemData.productId} not found`);
    }
    
    // Check if item already exists in cart
    const existingItem = Array.from(this.cartItems.values()).find(
      item => 
        item.productId === cartItemData.productId && 
        ((cartItemData.userId && item.userId === cartItemData.userId) || 
         (cartItemData.sessionId && item.sessionId === cartItemData.sessionId))
    );
    
    if (existingItem) {
      // Update quantity instead of adding new item
      const updatedItem = { 
        ...existingItem, 
        quantity: existingItem.quantity + (cartItemData.quantity || 1) 
      };
      this.cartItems.set(existingItem.id, updatedItem);
      return updatedItem;
    } else {
      // Add new item
      const id = this.cartItemId++;
      const createdAt = new Date();
      const cartItem: CartItem = { ...cartItemData, id, createdAt };
      this.cartItems.set(id, cartItem);
      return cartItem;
    }
  }

  async updateCartItemQuantity(id: number, quantity: number): Promise<CartItem | undefined> {
    const cartItem = this.cartItems.get(id);
    if (!cartItem) {
      return undefined;
    }
    
    if (quantity <= 0) {
      this.cartItems.delete(id);
      return undefined;
    }
    
    const updatedItem = { ...cartItem, quantity };
    this.cartItems.set(id, updatedItem);
    return updatedItem;
  }

  async removeFromCart(id: number): Promise<boolean> {
    return this.cartItems.delete(id);
  }

  async clearCart(userId?: number, sessionId?: string): Promise<boolean> {
    if (!userId && !sessionId) {
      return false;
    }
    
    const itemsToDelete = Array.from(this.cartItems.values())
      .filter(item => 
        (userId && item.userId === userId) || 
        (sessionId && item.sessionId === sessionId)
      );
    
    for (const item of itemsToDelete) {
      this.cartItems.delete(item.id);
    }
    
    return true;
  }

  async getCartTotal(userId?: number, sessionId?: string): Promise<number> {
    const cartItems = await this.getCartItems(userId, sessionId);
    return cartItems.reduce((total, item) => {
      const price = item.product.discountPrice || item.product.price;
      return total + (price * item.quantity);
    }, 0);
  }

  // Initialize sample data
  private initializeData() {
    // Sample categories
    const categories: InsertCategory[] = [
      {
        name: "Rings",
        slug: "rings",
        description: "Elegant rings for all occasions",
        image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80"
      },
      {
        name: "Earrings",
        slug: "earrings",
        description: "Beautiful earrings to complete your look",
        image: "https://images.unsplash.com/photo-1589128777073-263566ae5e4d?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80"
      },
      {
        name: "Necklaces",
        slug: "necklaces",
        description: "Stunning necklaces for any style",
        image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80"
      },
      {
        name: "Bracelets",
        slug: "bracelets",
        description: "Charming bracelets for your wrist",
        image: "https://images.unsplash.com/photo-1630018548696-e1900b010acc?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80"
      },
      {
        name: "Gemstones",
        slug: "gemstones",
        description: "Precious gems for unique jewelry",
        image: "https://images.unsplash.com/photo-1574010498544-4d73cfd939ed?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80"
      }
    ];

    // Add sample categories
    for (const category of categories) {
      this.createCategory(category);
    }

    // Sample subcategories
    const subcategories: InsertSubcategory[] = [
      // Rings subcategories
      { categoryId: 1, name: "Diamond Rings", slug: "diamond-rings", description: "Sparkling diamond rings" },
      { categoryId: 1, name: "Engagement Rings", slug: "engagement-rings", description: "Perfect for your special moment" },
      { categoryId: 1, name: "Wedding Bands", slug: "wedding-bands", description: "Elegant wedding bands" },
      { categoryId: 1, name: "Gemstone Rings", slug: "gemstone-rings", description: "Rings with beautiful gemstones" },
      
      // Earrings subcategories
      { categoryId: 2, name: "Stud Earrings", slug: "stud-earrings", description: "Classic stud earrings" },
      { categoryId: 2, name: "Hoop Earrings", slug: "hoop-earrings", description: "Fashionable hoop earrings" },
      { categoryId: 2, name: "Drop Earrings", slug: "drop-earrings", description: "Elegant drop earrings" },
      
      // Necklaces subcategories
      { categoryId: 3, name: "Pendants", slug: "pendants", description: "Beautiful pendant necklaces" },
      { categoryId: 3, name: "Chokers", slug: "chokers", description: "Stylish choker necklaces" },
      { categoryId: 3, name: "Chains", slug: "chains", description: "Fine chain necklaces" },
      
      // Bracelets subcategories
      { categoryId: 4, name: "Tennis Bracelets", slug: "tennis-bracelets", description: "Elegant tennis bracelets" },
      { categoryId: 4, name: "Cuff Bracelets", slug: "cuff-bracelets", description: "Bold cuff bracelets" },
      { categoryId: 4, name: "Charm Bracelets", slug: "charm-bracelets", description: "Delightful charm bracelets" },
      
      // Gemstones subcategories
      { categoryId: 5, name: "Diamonds", slug: "diamonds", description: "Brilliant diamonds" },
      { categoryId: 5, name: "Sapphires", slug: "sapphires", description: "Rich sapphires" },
      { categoryId: 5, name: "Emeralds", slug: "emeralds", description: "Vibrant emeralds" },
      { categoryId: 5, name: "Rubies", slug: "rubies", description: "Passionate rubies" }
    ];

    // Add sample subcategories
    for (const subcategory of subcategories) {
      this.createSubcategory(subcategory);
    }

    // Sample products
    const products: InsertProduct[] = [
      // Rings
      {
        name: "Diamond Engagement Ring",
        slug: "diamond-engagement-ring",
        description: "A stunning diamond engagement ring set in 14k white gold, featuring a brilliant-cut diamond center stone surrounded by a halo of smaller diamonds.",
        price: 1499.00,
        discountPrice: 1299.00,
        categoryId: 1,
        subcategoryId: 2,
        image: "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
        additionalImages: [],
        metal: "White Gold",
        gemstone: "Diamond",
        isNew: true,
        isBestseller: false,
        isFeatured: true,
        isOnSale: true,
        inStock: true,
        rating: 4.5,
        reviewCount: 42
      },
      {
        name: "White Gold Diamond Ring",
        slug: "white-gold-diamond-ring",
        description: "Elegant white gold ring with a cluster of diamonds for a timeless look.",
        price: 899.00,
        categoryId: 1,
        subcategoryId: 1,
        image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
        additionalImages: [],
        metal: "White Gold",
        gemstone: "Diamond",
        isNew: false,
        isBestseller: false,
        isFeatured: false,
        isOnSale: false,
        inStock: true,
        rating: 4.0,
        reviewCount: 36
      },
      {
        name: "Emerald Statement Ring",
        slug: "emerald-statement-ring",
        description: "Bold emerald statement ring set in yellow gold with diamond accents.",
        price: 1499.00,
        discountPrice: 1199.00,
        categoryId: 1,
        subcategoryId: 4,
        image: "https://images.unsplash.com/photo-1574010498544-4d73cfd939ed?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
        additionalImages: [],
        metal: "Yellow Gold",
        gemstone: "Emerald",
        isNew: false,
        isBestseller: false,
        isFeatured: false,
        isOnSale: true,
        inStock: true,
        rating: 4.5,
        reviewCount: 41
      },
      
      // Earrings
      {
        name: "Pearl Stud Earrings",
        slug: "pearl-stud-earrings",
        description: "Classic pearl stud earrings set in 14k white gold, featuring lustrous freshwater pearls.",
        price: 399.00,
        discountPrice: 349.00,
        categoryId: 2,
        subcategoryId: 5,
        image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
        additionalImages: [],
        metal: "White Gold",
        gemstone: "Pearl",
        isNew: false,
        isBestseller: true,
        isFeatured: true,
        isOnSale: true,
        inStock: true,
        rating: 5.0,
        reviewCount: 87
      },
      {
        name: "Golden Hoop Earrings",
        slug: "golden-hoop-earrings",
        description: "Elegant gold hoop earrings with a polished finish, perfect for everyday wear.",
        price: 429.00,
        categoryId: 2,
        subcategoryId: 6,
        image: "https://images.unsplash.com/photo-1617038220319-276d3cfab638?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
        additionalImages: [],
        metal: "Yellow Gold",
        gemstone: null,
        isNew: false,
        isBestseller: false,
        isFeatured: false,
        isOnSale: false,
        inStock: true,
        rating: 4.5,
        reviewCount: 52
      },
      {
        name: "Pearl Drop Earrings",
        slug: "pearl-drop-earrings",
        description: "Elegant pearl drop earrings with white gold posts and settings.",
        price: 399.00,
        categoryId: 2,
        subcategoryId: 7,
        image: "https://images.unsplash.com/photo-1602173574767-37ac01994b2a?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
        additionalImages: [],
        metal: "White Gold",
        gemstone: "Pearl",
        isNew: false,
        isBestseller: false,
        isFeatured: false,
        isOnSale: false,
        inStock: true,
        rating: 4.0,
        reviewCount: 33
      },
      
      // Necklaces
      {
        name: "Sapphire Pendant Necklace",
        slug: "sapphire-pendant-necklace",
        description: "Stunning sapphire pendant necklace set in 18k white gold with a delicate chain.",
        price: 729.00,
        categoryId: 3,
        subcategoryId: 8,
        image: "https://images.unsplash.com/photo-1576022162933-67afca6d2783?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
        additionalImages: [],
        metal: "White Gold",
        gemstone: "Sapphire",
        isNew: false,
        isBestseller: false,
        isFeatured: true,
        isOnSale: false,
        inStock: true,
        rating: 4.0,
        reviewCount: 29
      },
      {
        name: "Gold Chain Necklace",
        slug: "gold-chain-necklace",
        description: "Classic gold chain necklace with a durable link design.",
        price: 599.00,
        categoryId: 3,
        subcategoryId: 10,
        image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
        additionalImages: [],
        metal: "Yellow Gold",
        gemstone: null,
        isNew: false,
        isBestseller: false,
        isFeatured: false,
        isOnSale: false,
        inStock: true,
        rating: 4.0,
        reviewCount: 28
      },
      
      // Bracelets
      {
        name: "Diamond Tennis Bracelet",
        slug: "diamond-tennis-bracelet",
        description: "Luxurious diamond tennis bracelet featuring 4 carats of round brilliant diamonds set in 18k white gold.",
        price: 2499.00,
        discountPrice: 1899.00,
        categoryId: 4,
        subcategoryId: 11,
        image: "https://images.unsplash.com/photo-1535632787350-4e68ef0ac584?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
        additionalImages: [],
        metal: "White Gold",
        gemstone: "Diamond",
        isNew: false,
        isBestseller: false,
        isFeatured: true,
        isOnSale: true,
        inStock: true,
        rating: 4.5,
        reviewCount: 54
      },
      {
        name: "Gemstone Charm Bracelet",
        slug: "gemstone-charm-bracelet",
        description: "Colorful gemstone charm bracelet with mixed stones in gold settings.",
        price: 549.00,
        categoryId: 4,
        subcategoryId: 13,
        image: "https://images.unsplash.com/photo-1630018548696-e1900b010acc?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
        additionalImages: [],
        metal: "Yellow Gold",
        gemstone: "Mixed",
        isNew: true,
        isBestseller: false,
        isFeatured: false,
        isOnSale: false,
        inStock: true,
        rating: 5.0,
        reviewCount: 19
      }
    ];

    // Add more sample products to reach at least 50
    const gemstones = ["Diamond", "Sapphire", "Emerald", "Ruby", "Pearl", "Amethyst", "Topaz", "Opal"];
    const metals = ["White Gold", "Yellow Gold", "Rose Gold", "Platinum", "Silver"];
    
    for (let i = 1; i <= 40; i++) {
      const categoryId = 1 + (i % 5); // Distribute among 5 categories
      const subcategoryIndex = (i % subcategories.filter(s => s.categoryId === categoryId).length);
      const subcategory = subcategories.filter(s => s.categoryId === categoryId)[subcategoryIndex];
      
      const gemstone = gemstones[i % gemstones.length];
      const metal = metals[i % metals.length];
      const price = 300 + (i * 150);
      const hasDiscount = i % 4 === 0;
      const discountPrice = hasDiscount ? price * 0.85 : undefined;
      
      const product: InsertProduct = {
        name: `${metal} ${gemstone} ${categoryId === 1 ? 'Ring' : categoryId === 2 ? 'Earrings' : categoryId === 3 ? 'Necklace' : 'Bracelet'} ${i}`,
        slug: `${metal.toLowerCase().replace(' ', '-')}-${gemstone.toLowerCase()}-${categoryId === 1 ? 'ring' : categoryId === 2 ? 'earrings' : categoryId === 3 ? 'necklace' : 'bracelet'}-${i}`,
        description: `Beautiful ${gemstone.toLowerCase()} jewelry piece crafted from ${metal.toLowerCase()}.`,
        price: price,
        discountPrice: discountPrice,
        categoryId: categoryId,
        subcategoryId: subcategory?.id,
        image: products[i % products.length].image, // Reuse images from sample products
        additionalImages: [],
        metal: metal,
        gemstone: gemstone,
        isNew: i % 7 === 0,
        isBestseller: i % 8 === 0,
        isFeatured: i % 5 === 0,
        isOnSale: hasDiscount,
        inStock: true,
        rating: 3.5 + (i % 3) * 0.5,
        reviewCount: 10 + (i % 30)
      };
      
      products.push(product);
    }

    // Add sample products
    for (const product of products) {
      this.createProduct(product);
    }
  }
}

export const storage = new MemStorage();
