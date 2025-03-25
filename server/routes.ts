import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { insertCartItemSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes
  app.get('/api/categories', async (req: Request, res: Response) => {
    try {
      const categories = await storage.getAllCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch categories' });
    }
  });

  app.get('/api/subcategories', async (req: Request, res: Response) => {
    try {
      const categoryId = req.query.categoryId ? parseInt(req.query.categoryId as string) : undefined;
      
      if (categoryId) {
        const subcategories = await storage.getSubcategoriesByCategoryId(categoryId);
        res.json(subcategories);
      } else {
        const subcategories = await storage.getAllSubcategories();
        res.json(subcategories);
      }
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch subcategories' });
    }
  });

  app.get('/api/products', async (req: Request, res: Response) => {
    try {
      const categoryId = req.query.categoryId ? parseInt(req.query.categoryId as string) : undefined;
      const subcategoryId = req.query.subcategoryId ? parseInt(req.query.subcategoryId as string) : undefined;
      const featured = req.query.featured === 'true';
      const newArrivals = req.query.new === 'true';
      const bestsellers = req.query.bestsellers === 'true';
      const onSale = req.query.sale === 'true';
      const search = req.query.search as string | undefined;

      let products;

      if (search) {
        products = await storage.searchProducts(search);
      } else if (categoryId) {
        products = await storage.getProductsByCategoryId(categoryId);
      } else if (subcategoryId) {
        products = await storage.getProductsBySubcategoryId(subcategoryId);
      } else if (featured) {
        products = await storage.getFeaturedProducts();
      } else if (newArrivals) {
        products = await storage.getNewArrivals();
      } else if (bestsellers) {
        products = await storage.getBestsellers();
      } else if (onSale) {
        products = await storage.getOnSaleProducts();
      } else {
        products = await storage.getAllProducts();
      }

      // Optional filtering
      if (req.query.metal) {
        products = products.filter(p => p.metal?.toLowerCase() === (req.query.metal as string).toLowerCase());
      }
      if (req.query.gemstone) {
        products = products.filter(p => p.gemstone?.toLowerCase() === (req.query.gemstone as string).toLowerCase());
      }
      if (req.query.minPrice) {
        const minPrice = parseFloat(req.query.minPrice as string);
        products = products.filter(p => {
          const price = p.discountPrice || p.price;
          return price >= minPrice;
        });
      }
      if (req.query.maxPrice) {
        const maxPrice = parseFloat(req.query.maxPrice as string);
        products = products.filter(p => {
          const price = p.discountPrice || p.price;
          return price <= maxPrice;
        });
      }

      // Sorting
      const sort = req.query.sort as string | undefined;
      if (sort) {
        switch (sort) {
          case 'price-asc':
            products = products.sort((a, b) => {
              const priceA = a.discountPrice || a.price;
              const priceB = b.discountPrice || b.price;
              return priceA - priceB;
            });
            break;
          case 'price-desc':
            products = products.sort((a, b) => {
              const priceA = a.discountPrice || a.price;
              const priceB = b.discountPrice || b.price;
              return priceB - priceA;
            });
            break;
          case 'newest':
            products = products.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            break;
          case 'rating':
            products = products.sort((a, b) => b.rating - a.rating);
            break;
        }
      }

      // Pagination
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 12;
      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;
      const totalItems = products.length;

      const paginatedProducts = products.slice(startIndex, endIndex);

      res.json({
        products: paginatedProducts,
        pagination: {
          total: totalItems,
          page,
          limit,
          totalPages: Math.ceil(totalItems / limit)
        }
      });
    } catch (error) {
      console.error('Error fetching products:', error);
      res.status(500).json({ message: 'Failed to fetch products' });
    }
  });

  app.get('/api/products/:slug', async (req: Request, res: Response) => {
    try {
      const { slug } = req.params;
      const product = await storage.getProductBySlug(slug);
      
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
      
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch product' });
    }
  });

  // Cart endpoints
  app.get('/api/cart', async (req: Request, res: Response) => {
    try {
      const sessionId = req.query.sessionId as string;
      
      if (!sessionId) {
        return res.status(400).json({ message: 'Session ID is required' });
      }
      
      const cartItems = await storage.getCartItems(undefined, sessionId);
      const total = await storage.getCartTotal(undefined, sessionId);
      
      res.json({
        items: cartItems,
        total,
        itemCount: cartItems.reduce((sum, item) => sum + item.quantity, 0)
      });
    } catch (error) {
      console.error('Error fetching cart:', error);
      res.status(500).json({ message: 'Failed to fetch cart' });
    }
  });

  app.post('/api/cart', async (req: Request, res: Response) => {
    try {
      const cartItemData = insertCartItemSchema.parse(req.body);
      
      // Verify product exists and is in stock
      const product = await storage.getProductById(cartItemData.productId);
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }
      
      if (!product.inStock) {
        return res.status(400).json({ message: 'Product is out of stock' });
      }
      
      const cartItem = await storage.addToCart(cartItemData);
      const sessionId = cartItemData.sessionId;
      
      const cartItems = await storage.getCartItems(undefined, sessionId);
      const total = await storage.getCartTotal(undefined, sessionId);
      
      res.status(201).json({
        items: cartItems,
        total,
        itemCount: cartItems.reduce((sum, item) => sum + item.quantity, 0),
        addedItem: cartItem
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Invalid cart data', errors: error.errors });
      }
      console.error('Error adding to cart:', error);
      res.status(500).json({ message: 'Failed to add to cart' });
    }
  });

  app.put('/api/cart/:id', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const { quantity } = req.body;
      
      // Validate quantity
      if (typeof quantity !== 'number' || quantity < 0) {
        return res.status(400).json({ message: 'Invalid quantity' });
      }
      
      const cartItem = await storage.getCartItemById(id);
      if (!cartItem) {
        return res.status(404).json({ message: 'Cart item not found' });
      }
      
      if (quantity === 0) {
        await storage.removeFromCart(id);
      } else {
        await storage.updateCartItemQuantity(id, quantity);
      }
      
      const sessionId = cartItem.sessionId;
      const cartItems = await storage.getCartItems(undefined, sessionId);
      const total = await storage.getCartTotal(undefined, sessionId);
      
      res.json({
        items: cartItems,
        total,
        itemCount: cartItems.reduce((sum, item) => sum + item.quantity, 0)
      });
    } catch (error) {
      console.error('Error updating cart:', error);
      res.status(500).json({ message: 'Failed to update cart' });
    }
  });

  app.delete('/api/cart/:id', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      
      const cartItem = await storage.getCartItemById(id);
      if (!cartItem) {
        return res.status(404).json({ message: 'Cart item not found' });
      }
      
      const sessionId = cartItem.sessionId;
      
      await storage.removeFromCart(id);
      
      const cartItems = await storage.getCartItems(undefined, sessionId);
      const total = await storage.getCartTotal(undefined, sessionId);
      
      res.json({
        items: cartItems,
        total,
        itemCount: cartItems.reduce((sum, item) => sum + item.quantity, 0)
      });
    } catch (error) {
      console.error('Error removing from cart:', error);
      res.status(500).json({ message: 'Failed to remove from cart' });
    }
  });

  app.delete('/api/cart', async (req: Request, res: Response) => {
    try {
      const sessionId = req.query.sessionId as string;
      
      if (!sessionId) {
        return res.status(400).json({ message: 'Session ID is required' });
      }
      
      await storage.clearCart(undefined, sessionId);
      
      res.json({
        items: [],
        total: 0,
        itemCount: 0
      });
    } catch (error) {
      console.error('Error clearing cart:', error);
      res.status(500).json({ message: 'Failed to clear cart' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
