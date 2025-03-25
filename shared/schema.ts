import { pgTable, text, serial, integer, boolean, doublePrecision, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table for authentication
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  fullName: text("full_name"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Categories for jewelry products
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  image: text("image"),
});

// Subcategories for more specific jewelry types
export const subcategories = pgTable("subcategories", {
  id: serial("id").primaryKey(),
  categoryId: integer("category_id").notNull().references(() => categories.id),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
});

// Products table
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description").notNull(),
  price: doublePrecision("price").notNull(),
  discountPrice: doublePrecision("discount_price"),
  categoryId: integer("category_id").notNull().references(() => categories.id),
  subcategoryId: integer("subcategory_id").references(() => subcategories.id),
  image: text("image").notNull(),
  additionalImages: text("additional_images").array(),
  metal: text("metal"),
  gemstone: text("gemstone"),
  isNew: boolean("is_new").default(false),
  isBestseller: boolean("is_bestseller").default(false),
  isFeatured: boolean("is_featured").default(false),
  isOnSale: boolean("is_on_sale").default(false),
  inStock: boolean("in_stock").default(true),
  rating: doublePrecision("rating").default(0),
  reviewCount: integer("review_count").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Cart items
export const cartItems = pgTable("cart_items", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  sessionId: text("session_id"),
  productId: integer("product_id").notNull().references(() => products.id),
  quantity: integer("quantity").notNull().default(1),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Schema validation for inserting users
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  fullName: true,
});

// Schema validation for inserting categories
export const insertCategorySchema = createInsertSchema(categories).pick({
  name: true,
  slug: true,
  description: true,
  image: true,
});

// Schema validation for inserting subcategories
export const insertSubcategorySchema = createInsertSchema(subcategories).pick({
  categoryId: true,
  name: true,
  slug: true,
  description: true,
});

// Schema validation for inserting products
export const insertProductSchema = createInsertSchema(products).omit({
  id: true,
  createdAt: true,
});

// Schema validation for inserting cart items
export const insertCartItemSchema = createInsertSchema(cartItems).pick({
  userId: true,
  sessionId: true,
  productId: true,
  quantity: true,
});

// Types for use in the application
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Category = typeof categories.$inferSelect;
export type InsertCategory = z.infer<typeof insertCategorySchema>;

export type Subcategory = typeof subcategories.$inferSelect;
export type InsertSubcategory = z.infer<typeof insertSubcategorySchema>;

export type Product = typeof products.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;

export type CartItem = typeof cartItems.$inferSelect;
export type InsertCartItem = z.infer<typeof insertCartItemSchema>;

// For cart context API
export interface CartItemWithProduct extends CartItem {
  product: Product;
}
