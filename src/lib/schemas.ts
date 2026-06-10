import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  role: z.enum(["donor", "receiver", "volunteer", "admin"]),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const createListingSchema = z.object({
  foodName: z.string().min(1, "Food name is required"),
  category: z.string().min(1, "Category is required"),
  description: z.string().min(1, "Description is required"),
  quantityTotal: z.number().int().positive("Quantity must be positive"),
  pickupLocation: z.string().min(1, "Pickup location is required"),
  pickupDeadline: z.string().datetime({ offset: true }).or(z.string()),
  expiryTime: z.string().datetime({ offset: true }).or(z.string()),
  halal: z.boolean(),
  vegetarian: z.boolean(),
  allergies: z.string().optional(),
  urgencyLevel: z.enum(["Low", "Medium", "High", "Critical", "Expired"]),
  imageUrl: z.string().url().optional().or(z.literal('')),
});

export const createClaimSchema = z.object({
  foodId: z.string(),
  quantity: z.number().int().positive(),
  pickupTime: z.string().datetime({ offset: true }).or(z.string()),
});

export const updateClaimStatusSchema = z.object({
  claimId: z.string(),
  newStatus: z.enum(["Pending", "Approved", "Rejected", "Collected", "Cancelled", "No-Show"]),
});
