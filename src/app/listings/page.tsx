"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { MOCK_USERS } from "@/lib/mock-data";
import { calculateUrgency } from "@/lib/urgency";
import { Clock, MapPin, ArrowLeft, BadgeCheck } from "lucide-react";
import { getFoodListings } from "@/app/actions";
import { FoodListing } from "@/lib/mock-data";
import Link from "next/link";

export default function ListingsPage() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [listings, setListings] = useState<FoodListing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getFoodListings().then(l => {
      setListings(l);
      setLoading(false);
    });
  }, []);

  const filteredListings = listings.filter(listing => {
    const matchesSearch = 
      listing.foodName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (listing.description && listing.description.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = categoryFilter === "All" || listing.category === categoryFilter;
    
    // Hide Fully Claimed and Expired by default
    const isAvailable = listing.status !== "Fully Claimed" && listing.status !== "Expired" && listing.status !== "No-Show";

    return matchesSearch && matchesCategory && isAvailable;
  });

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading listings...</div>;

  return (
    <div className="min-h-screen bg-neutral-bg p-4 sm:p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
          <div className="flex items-center">
            <Link href="/dashboard" className="text-gray-500 hover:text-gray-900 mr-4">
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">Available Food</h1>
          </div>
          {user?.role === "donor" && (
            <Link href="/dashboard/post-food" className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-md font-medium text-sm">
              Post Food
            </Link>
          )}
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <input 
            type="text" 
            placeholder="Search food (e.g. Rice)..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
          />
          <select 
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
          >
            <option value="All">All Categories</option>
            <option value="Main Course">Main Course</option>
            <option value="Snack">Snack</option>
            <option value="Dessert">Dessert</option>
            <option value="Beverage">Beverage</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredListings.length === 0 ? (
            <div className="col-span-full py-12 text-center text-gray-500">
              No food available matching your criteria.
            </div>
          ) : (
            filteredListings.map(listing => {
              const urgency = calculateUrgency(listing);
              // Since MOCK_USERS is used here in the map, we don't have donor sync on listing list page for MVP unless we join.
              // We'll just leave it out or assume unverified.
              
              return (
                <Link href={`/listings/${listing.id}`} key={listing.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden border border-gray-100 flex flex-col">
                  <div className="p-5 flex-1">
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                        {listing.category}
                      </span>
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${getUrgencyColor(urgency)}`}>
                        {urgency}
                      </span>
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{listing.foodName}</h3>
                    
                    <p className="text-gray-600 text-sm line-clamp-2 mb-4">{listing.description}</p>
                    
                    <div className="space-y-2 mt-auto">
                      <div className="flex items-center text-sm text-gray-500">
                        <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                        {listing.pickupLocation}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="w-4 h-4 mr-2 text-gray-400" />
                        Expires: {new Date(listing.expiryTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 px-5 py-3 border-t border-gray-100 flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">
                      {listing.quantityAvailable} packs left
                    </span>
                    <span className="text-primary font-medium text-sm flex items-center">
                      Claim <ArrowLeft className="w-4 h-4 ml-1 rotate-180" />
                    </span>
                  </div>
                </Link>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
