"use server";

import prisma from "@/lib/db";
import { FoodListing, Claim, User, MOCK_USERS, MOCK_LISTINGS, MOCK_CLAIMS } from "@/lib/mock-data";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { registerSchema, createListingSchema, createClaimSchema, updateClaimStatusSchema } from "@/lib/schemas";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// ---------------------------------------------------------
// DATABASE SEEDING (One-time use to populate your local DB)
// ---------------------------------------------------------
export async function seedDatabase() {
  try {
    // 1. Seed Users
    for (const user of MOCK_USERS) {
      await prisma.users.upsert({
        where: { email: user.email },
        update: {},
        create: {
          id: user.id,
          name: user.name,
          email: user.email,
          password_hash: "hashed_password", // Placeholder
          role: user.role,
          no_show_count: user.noShowCount || 0,
          isVerified: user.isVerified || false,
        }
      });
    }

    // 2. Seed Food Listings
    for (const listing of MOCK_LISTINGS) {
      await prisma.foodlistings.upsert({
        where: { id: listing.id },
        update: {},
        create: {
          id: listing.id,
          donor_id: listing.donorId,
          food_name: listing.foodName,
          category: listing.category,
          description: listing.description,
          quant_total: listing.quantityTotal,
          quant_avail: listing.quantityAvailable,
          pickup_loc: listing.pickupLocation,
          pickup_deadline: new Date(listing.pickupDeadline),
          expiry_time: new Date(listing.expiryTime),
          isHalal: listing.halal,
          isVegetarian: listing.vegetarian,
          allergies: listing.allergies,
          urgent_lvl: listing.urgencyLevel,
          status: listing.status === "Partially Claimed" ? "Partially_Claimed" : 
                  listing.status === "Fully Claimed" ? "Fully_Claimed" : listing.status as any,
          created_at: new Date(listing.createdAt),
        }
      });
    }

    // 3. Seed Claims
    for (const claim of MOCK_CLAIMS) {
      await prisma.claims.upsert({
        where: { id: claim.id },
        update: {},
        create: {
          id: claim.id,
          food_id: claim.foodId,
          receiver_id: claim.receiverId,
          quantity: claim.quantity,
          pickup_time: new Date(claim.pickupTime),
          status: claim.status === "No-Show" ? "No_Show" : claim.status as any,
          created_at: new Date(claim.createdAt),
        }
      });
    }
    return { success: true, message: "Database seeded perfectly!" };
  } catch (error) {
    console.error("Seed Error:", error);
    return { success: false, message: "Failed to seed." };
  }
}

// ---------------------------------------------------------
// DATA FETCHING (Reads from XAMPP Database)
// ---------------------------------------------------------
export async function getFoodListings(): Promise<FoodListing[]> {
  const listings = await prisma.foodlistings.findMany({
    orderBy: { created_at: 'desc' }
  });
  
  // Convert DB format back to the UI's expected format
  return listings.map(l => ({
    id: l.id,
    donorId: l.donor_id,
    foodName: l.food_name,
    category: l.category,
    description: l.description,
    quantityTotal: l.quant_total,
    quantityAvailable: l.quant_avail,
    pickupLocation: l.pickup_loc,
    pickupDeadline: l.pickup_deadline.toISOString(),
    expiryTime: l.expiry_time.toISOString(),
    halal: l.isHalal,
    vegetarian: l.isVegetarian,
    allergies: l.allergies || "",
    urgencyLevel: l.urgent_lvl,
    status: l.status === "Partially_Claimed" ? "Partially Claimed" :
            l.status === "Fully_Claimed" ? "Fully Claimed" : l.status,
    imageUrl: l.image_url || undefined,
    createdAt: l.created_at.toISOString(),
  }));
}

export async function getListingById(id: string): Promise<FoodListing | null> {
  const l = await prisma.foodlistings.findUnique({ where: { id } });
  if (!l) return null;
  
  return {
    id: l.id,
    donorId: l.donor_id,
    foodName: l.food_name,
    category: l.category,
    description: l.description,
    quantityTotal: l.quant_total,
    quantityAvailable: l.quant_avail,
    pickupLocation: l.pickup_loc,
    pickupDeadline: l.pickup_deadline.toISOString(),
    expiryTime: l.expiry_time.toISOString(),
    halal: l.isHalal,
    vegetarian: l.isVegetarian,
    allergies: l.allergies || "",
    urgencyLevel: l.urgent_lvl,
    status: l.status === "Partially_Claimed" ? "Partially Claimed" :
            l.status === "Fully_Claimed" ? "Fully Claimed" : l.status,
    imageUrl: l.image_url || undefined,
    createdAt: l.created_at.toISOString(),
  };
}

export async function getUserTodayClaims(userId: string): Promise<Claim[]> {
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const claims = await prisma.claims.findMany({
    where: {
      receiver_id: userId,
      created_at: {
        gte: startOfDay,
      }
    }
  });

  return claims.map(c => ({
    id: c.id,
    foodId: c.food_id,
    receiverId: c.receiver_id,
    quantity: c.quantity,
    pickupTime: c.pickup_time.toISOString(),
    status: c.status === "No_Show" ? "No-Show" : c.status,
    createdAt: c.created_at.toISOString(),
  }));
}

export async function getClaims(): Promise<Claim[]> {
  const claims = await prisma.claims.findMany({
    orderBy: { created_at: 'desc' }
  });

  return claims.map(c => ({
    id: c.id,
    foodId: c.food_id,
    receiverId: c.receiver_id,
    quantity: c.quantity,
    pickupTime: c.pickup_time.toISOString(),
    status: c.status === "No_Show" ? "No-Show" : c.status,
    createdAt: c.created_at.toISOString(),
  }));
}

export async function getUserProfile(email: string): Promise<User | null> {
  const user = await prisma.users.findUnique({ where: { email } });
  if (!user) return null;
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    noShowCount: user.no_show_count,
    isVerified: user.isVerified,
  };
}

export async function getUserById(id: string): Promise<User | null> {
  const user = await prisma.users.findUnique({ where: { id } });
  if (!user) return null;
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    noShowCount: user.no_show_count,
    isVerified: user.isVerified,
  };
}

// ---------------------------------------------------------
// MUTATIONS (Writes to XAMPP Database)
// ---------------------------------------------------------
// AUTHENTICATION
// ---------------------------------------------------------
export async function registerUser(name: string, email: string, role: string, passwordHash: string) {
  const result = registerSchema.safeParse({ name, email, role, password: passwordHash });
  if (!result.success) {
    return { success: false, error: (result.error as any).errors[0].message };
  }
  
  const existingUser = await prisma.users.findUnique({ where: { email } });
  if (existingUser) {
    return { success: false, error: "Email already registered" };
  }

  const hashed = await bcrypt.hash(passwordHash, 10);
  
  const user = await prisma.users.create({
    data: {
      name: result.data.name,
      email: result.data.email,
      role: result.data.role as any,
      password_hash: hashed,
    }
  });
  
  return {
    success: true,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    }
  };
}

export async function loginUser(email: string, passwordHash: string): Promise<User | null> {
  // In a real app, verify passwordHash
  const user = await prisma.users.findUnique({ where: { email } });
  if (!user) return null;
  
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role as any,
    noShowCount: user.no_show_count,
    isVerified: user.isVerified,
  };
}
export async function updateClaimStatus(claimId: string, newStatus: Claim["status"]) {
  const dbStatus = newStatus === "No-Show" ? "No_Show" : newStatus;
  
  await prisma.claims.update({
    where: { id: claimId },
    data: { status: dbStatus as any }
  });

  if (newStatus === "No-Show") {
    // Increment penalty count
    const claim = await prisma.claims.findUnique({ where: { id: claimId } });
    if (claim) {
      await prisma.users.update({
        where: { id: claim.receiver_id },
        data: { no_show_count: { increment: 1 } }
      });
    }
  }

  revalidatePath('/dashboard');
  return { success: true };
}

export async function createListing(data: any) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return { success: false, error: "Unauthorized" };

  const result = createListingSchema.safeParse(data);
  if (!result.success) return { success: false, error: (result.error as any).errors[0].message };

  const parsed = result.data;
  const listing = await prisma.foodlistings.create({
    data: {
      donor_id: (session.user as any).id,
      food_name: parsed.foodName,
      category: parsed.category,
      description: parsed.description,
      quant_total: parsed.quantityTotal,
      quant_avail: parsed.quantityTotal,
      pickup_loc: parsed.pickupLocation,
      pickup_deadline: new Date(parsed.pickupDeadline),
      expiry_time: new Date(parsed.expiryTime),
      isHalal: parsed.halal,
      isVegetarian: parsed.vegetarian,
      allergies: parsed.allergies,
      urgent_lvl: parsed.urgencyLevel as any,
      status: "Available",
      image_url: parsed.imageUrl,
    }
  });
  revalidatePath('/listings');
  revalidatePath('/dashboard');
  return { success: true, id: listing.id };
}

export async function createClaim(foodId: string, quantity: number, pickupTime: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return { success: false, error: "Unauthorized" };
  const receiverId = (session.user as any).id;

  const result = createClaimSchema.safeParse({ foodId, quantity, pickupTime });
  if (!result.success) return { success: false, error: (result.error as any).errors[0].message };

  // 1. Check User Penalties
  const user = await prisma.users.findUnique({ where: { id: receiverId } });
  if (!user) return { success: false, error: "User not found" };
  if (user.no_show_count >= 3) {
    return { success: false, error: "Account Restricted: You have 3 or more no-shows." };
  }

  // 2. Check Daily Limits
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  const todayClaims = await prisma.claims.findMany({
    where: { receiver_id: receiverId, created_at: { gte: startOfDay } }
  });
  
  if (todayClaims.length >= 2) {
    return { success: false, error: "Daily Limit Reached: You have already made 2 claims today." };
  }
  const totalMealsClaimedToday = todayClaims.reduce((acc, curr) => acc + curr.quantity, 0);
  if (totalMealsClaimedToday + quantity > 5) {
    return { success: false, error: `Daily Limit Reached: You can only claim up to 5 meals per day.` };
  }

  // 3. Check Listing Availability
  const listing = await prisma.foodlistings.findUnique({ where: { id: foodId } });
  if (!listing) return { success: false, error: "Listing not found" };
  if (listing.quant_avail < quantity) {
    return { success: false, error: `Only ${listing.quant_avail} packs available.` };
  }

  // 4. Create Claim and Deduct Inventory
  const claim = await prisma.claims.create({
    data: {
      food_id: foodId,
      receiver_id: receiverId,
      quantity,
      pickup_time: new Date(pickupTime),
      status: "Pending"
    }
  });

  const newAvail = listing.quant_avail - quantity;
  let newStatus = listing.status;
  if (newAvail === 0) newStatus = "Fully_Claimed";
  else if (newAvail < listing.quant_total) newStatus = "Partially_Claimed";

  await prisma.foodlistings.update({
    where: { id: foodId },
    data: {
      quant_avail: newAvail,
      status: newStatus as any
    }
  });

  revalidatePath('/listings');
  revalidatePath('/dashboard');
  revalidatePath(`/listings/${foodId}`);
  return { success: true, id: claim.id };
}
