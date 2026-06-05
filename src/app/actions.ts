"use server";

import prisma from "@/lib/db";
import { FoodListing, Claim, User, MOCK_USERS, MOCK_LISTINGS, MOCK_CLAIMS } from "@/lib/mock-data";
import { revalidatePath } from "next/cache";

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

// ---------------------------------------------------------
// MUTATIONS (Writes to XAMPP Database)
// ---------------------------------------------------------
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

export async function createListing(data: Omit<FoodListing, "id" | "createdAt" | "status" | "quantityAvailable">) {
  const id = "f" + Date.now();
  await prisma.foodlistings.create({
    data: {
      id,
      donor_id: data.donorId,
      food_name: data.foodName,
      category: data.category,
      description: data.description,
      quant_total: data.quantityTotal,
      quant_avail: data.quantityTotal,
      pickup_loc: data.pickupLocation,
      pickup_deadline: new Date(data.pickupDeadline),
      expiry_time: new Date(data.expiryTime),
      isHalal: data.halal,
      isVegetarian: data.vegetarian,
      allergies: data.allergies,
      urgent_lvl: data.urgencyLevel,
      status: "Available",
      image_url: data.imageUrl,
    }
  });
  revalidatePath('/listings');
  revalidatePath('/dashboard');
  return { success: true, id };
}

export async function createClaim(foodId: string, receiverId: string, quantity: number, pickupTime: string) {
  const id = "c" + Date.now();
  await prisma.claims.create({
    data: {
      id,
      food_id: foodId,
      receiver_id: receiverId,
      quantity,
      pickup_time: new Date(pickupTime),
      status: "Pending"
    }
  });

  // Deduct quantity from listing
  await prisma.foodlistings.update({
    where: { id: foodId },
    data: {
      quant_avail: { decrement: quantity }
    }
  });

  revalidatePath('/listings');
  revalidatePath('/dashboard');
  return { success: true, id };
}
