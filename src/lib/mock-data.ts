export type Role = "donor" | "receiver" | "volunteer" | "admin";

export type User = {
  id: string;
  name: string;
  email: string;
  role: Role;
  noShowCount?: number;
  isVerified?: boolean;
};

export type UrgencyLevel = "Low" | "Medium" | "High" | "Critical" | "Expired";

export type FoodListing = {
  id: string;
  donorId: string;
  foodName: string;
  category: string;
  description: string;
  quantityTotal: number;
  quantityAvailable: number;
  pickupLocation: string;
  pickupDeadline: string; // ISO String
  expiryTime: string; // ISO String
  halal: boolean;
  vegetarian: boolean;
  allergies: string;
  urgencyLevel: UrgencyLevel;
  status: "Available" | "Partially Claimed" | "Fully Claimed" | "Collected" | "Expired" | "Cancelled";
  imageUrl?: string;
  createdAt: string; // ISO String
};

export type Claim = {
  id: string;
  foodId: string;
  receiverId: string;
  quantity: number;
  pickupTime: string; // ISO String
  status: "Pending" | "Approved" | "Rejected" | "Collected" | "Cancelled" | "No-Show";
  createdAt: string; // ISO String
};

// Initial Mock Data
export const MOCK_USERS: User[] = [
  { id: "u1", name: "Campus Cafe", email: "cafe@campus.edu", role: "donor", isVerified: true },
  { id: "u2", name: "Aina", email: "aina@student.edu", role: "receiver", noShowCount: 0 },
  { id: "u3", name: "Sarah", email: "sarah@volunteer.org", role: "volunteer", noShowCount: 0 },
  { id: "u4", name: "Admin John", email: "admin@campus.edu", role: "admin" },
];

export const MOCK_LISTINGS: FoodListing[] = [
  {
    id: "f1",
    donorId: "u1",
    foodName: "Fried Rice (Nasi Goreng)",
    category: "Main Course",
    description: "Leftover from a seminar lunch. Includes some chicken and egg.",
    quantityTotal: 30,
    quantityAvailable: 30,
    pickupLocation: "Dewan Seminar Block A",
    pickupDeadline: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2 hours from now
    expiryTime: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(), // 4 hours from now
    halal: true,
    vegetarian: false,
    allergies: "Egg, Chicken",
    urgencyLevel: "Critical",
    status: "Available",
    createdAt: new Date().toISOString(),
  },
  {
    id: "f2",
    donorId: "u1",
    foodName: "Assorted Pastries",
    category: "Snack",
    description: "Croissants and muffins from morning cafe.",
    quantityTotal: 15,
    quantityAvailable: 10,
    pickupLocation: "Main Campus Cafe",
    pickupDeadline: new Date(Date.now() + 5 * 60 * 60 * 1000).toISOString(),
    expiryTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    halal: true,
    vegetarian: true,
    allergies: "Dairy, Gluten",
    urgencyLevel: "Low",
    status: "Available",
    createdAt: new Date().toISOString(),
  }
];

export const MOCK_CLAIMS: Claim[] = [
  {
    id: "c1",
    foodId: "f2",
    receiverId: "u2",
    quantity: 5,
    pickupTime: new Date(Date.now() + 1 * 60 * 60 * 1000).toISOString(),
    status: "Approved",
    createdAt: new Date().toISOString()
  }
];
