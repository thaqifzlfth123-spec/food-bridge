"use client";

import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Leaf, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const postFoodSchema = z.object({
  foodName: z.string().min(3, "Food name is required"),
  category: z.string().min(1, "Category is required"),
  quantity: z.coerce.number().min(1, "Quantity must be at least 1"),
  pickupLocation: z.string().min(3, "Pickup location is required"),
  pickupDeadline: z.string().min(1, "Pickup deadline is required"),
  expiryTime: z.string().min(1, "Expiry time is required"),
  halal: z.boolean().default(false),
  vegetarian: z.boolean().default(false),
  allergies: z.string().optional(),
  description: z.string().optional(),
});

type PostFoodValues = z.infer<typeof postFoodSchema>;

export default function PostFoodPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PostFoodValues>({
    resolver: zodResolver(postFoodSchema),
    defaultValues: {
      halal: false,
      vegetarian: false,
    }
  });

  if (!user || (user.role !== "donor" && user.role !== "volunteer")) {
    return <div className="p-8 text-center text-red-500">Access Denied. Donors and Volunteers only.</div>;
  }

  const onSubmit = async (data: PostFoodValues) => {
    setIsSubmitting(true);
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // In a real app, we would send this to Supabase
    console.log("Mock saved data:", data);
    
    setIsSubmitting(false);
    router.push("/dashboard?success=true");
  };

  return (
    <div className="min-h-screen bg-neutral-bg p-4 sm:p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-sm p-6 sm:p-8">
        <div className="flex items-center mb-6">
          <Link href="/dashboard" className="text-gray-500 hover:text-gray-900 mr-4">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Post Extra Food</h1>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Food Name */}
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Food Name</label>
              <input
                {...register("foodName")}
                className="mt-1 block w-full rounded-md border-gray-300 border px-3 py-2 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                placeholder="e.g. Fried Rice"
              />
              {errors.foodName && <p className="mt-1 text-sm text-red-600">{errors.foodName.message}</p>}
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Category</label>
              <select
                {...register("category")}
                className="mt-1 block w-full rounded-md border-gray-300 border px-3 py-2 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
              >
                <option value="">Select a category...</option>
                <option value="Main Course">Main Course</option>
                <option value="Snack">Snack / Pastry</option>
                <option value="Dessert">Dessert</option>
                <option value="Beverage">Beverage</option>
                <option value="Other">Other</option>
              </select>
              {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>}
            </div>

            {/* Quantity */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Quantity (Packs/Portions)</label>
              <input
                type="number"
                {...register("quantity")}
                className="mt-1 block w-full rounded-md border-gray-300 border px-3 py-2 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
              />
              {errors.quantity && <p className="mt-1 text-sm text-red-600">{errors.quantity.message}</p>}
            </div>

            {/* Pickup Location */}
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Pickup Location</label>
              <input
                {...register("pickupLocation")}
                className="mt-1 block w-full rounded-md border-gray-300 border px-3 py-2 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                placeholder="e.g. Main Cafe Counter"
              />
              {errors.pickupLocation && <p className="mt-1 text-sm text-red-600">{errors.pickupLocation.message}</p>}
            </div>

            {/* Pickup Deadline */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Pickup Deadline</label>
              <input
                type="time"
                {...register("pickupDeadline")}
                className="mt-1 block w-full rounded-md border-gray-300 border px-3 py-2 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
              />
              {errors.pickupDeadline && <p className="mt-1 text-sm text-red-600">{errors.pickupDeadline.message}</p>}
            </div>

            {/* Expiry Time */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Expiry Time</label>
              <input
                type="time"
                {...register("expiryTime")}
                className="mt-1 block w-full rounded-md border-gray-300 border px-3 py-2 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
              />
              {errors.expiryTime && <p className="mt-1 text-sm text-red-600">{errors.expiryTime.message}</p>}
            </div>

            {/* Dietary Tags */}
            <div className="sm:col-span-2 flex gap-6">
              <label className="flex items-center gap-2">
                <input type="checkbox" {...register("halal")} className="rounded text-primary focus:ring-primary" />
                <span className="text-sm font-medium text-gray-700">Halal</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" {...register("vegetarian")} className="rounded text-primary focus:ring-primary" />
                <span className="text-sm font-medium text-gray-700">Vegetarian</span>
              </label>
            </div>

            {/* Allergies */}
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Allergies / Warnings (Optional)</label>
              <input
                {...register("allergies")}
                className="mt-1 block w-full rounded-md border-gray-300 border px-3 py-2 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                placeholder="e.g. Contains nuts, dairy"
              />
            </div>

            {/* Description */}
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Extra Notes / Description</label>
              <textarea
                {...register("description")}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 border px-3 py-2 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                placeholder="Additional details for receivers..."
              />
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex justify-center items-center py-2 px-6 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                  Publishing...
                </>
              ) : (
                "Post Food"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
