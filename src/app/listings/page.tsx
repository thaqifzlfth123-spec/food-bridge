"use client";

import { useAuth } from "@/lib/auth-context";
import { MOCK_LISTINGS } from "@/lib/mock-data";
import { calculateUrgency } from "@/lib/urgency";
import { Clock, MapPin, AlertCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function ListingsPage() {
  const { user } = useAuth();

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "Critical": return "bg-red-100 text-red-800 border-red-200";
      case "High": return "bg-orange-100 text-orange-800 border-orange-200";
      case "Medium": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Low": return "bg-green-100 text-green-800 border-green-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-neutral-bg p-4 sm:p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {MOCK_LISTINGS.map(listing => {
            const urgency = calculateUrgency(listing);
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
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{listing.foodName}</h3>
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
          })}
        </div>
      </div>
    </div>
  );
}
