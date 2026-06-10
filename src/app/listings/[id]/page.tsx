"use client";

import { useSession } from "next-auth/react";
import { calculateUrgency } from "@/lib/urgency";
import { ArrowLeft, Clock, MapPin, ShieldAlert, CheckCircle2, BadgeCheck, Loader2 } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { getListingById, createClaim, getUserById } from "@/app/actions";
import { FoodListing, User } from "@/lib/mock-data";

export default function FoodDetailPage() {
  const { id } = useParams();
  const { data: session } = useSession();
  const user = session?.user as any;
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [claimed, setClaimed] = useState(false);
  const [allergyChecked, setAllergyChecked] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(true);
  const [listing, setListing] = useState<FoodListing | null>(null);
  const [donor, setDonor] = useState<User | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    getListingById(id as string).then(async data => {
      setListing(data);
      if (data) {
        const d = await getUserById(data.donorId);
        setDonor(d);
      }
      setLoading(false);
    });
  }, [id]);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading details...</div>;
  if (!listing) return <div className="p-8 text-center text-gray-500">Listing not found</div>;

  const urgency = calculateUrgency(listing);
  const requiresAllergyCheck = Boolean(listing.allergies);
  const canClaim = !requiresAllergyCheck || allergyChecked;

  const handleClaim = async () => {
    if (!user) {
      router.push("/login");
      return;
    }

    setSubmitting(true);
    setErrorMsg("");

    try {
      // Hardcode pickup to 1 hour from now for MVP
      const pickupTime = new Date(Date.now() + 60 * 60 * 1000).toISOString();
      const result = await createClaim(listing.id, quantity, pickupTime);
      
      if (!result.success) {
        throw new Error(result.error);
      }
      
      setClaimed(true);
      setTimeout(() => {
        router.push("/dashboard");
      }, 2000);
    } catch (error: any) {
      setErrorMsg(error.message || "Failed to claim food. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-bg p-4 sm:p-8">
      <div className="max-w-3xl mx-auto">
        <Link href="/listings" className="inline-flex items-center text-gray-500 hover:text-gray-900 mb-6">
          <ArrowLeft className="w-5 h-5 mr-2" /> Back to listings
        </Link>

        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{listing.foodName}</h1>
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                    {listing.category}
                  </span>
                  {donor?.isVerified && (
                    <span className="inline-flex items-center text-sm font-medium text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full">
                      <BadgeCheck className="w-4 h-4 mr-1 text-blue-600" /> Verified Donor
                    </span>
                  )}
                </div>
              </div>
              <div className="text-right flex flex-col items-end">
                <span className="text-sm text-gray-500 mb-1">Available Quantity</span>
                <span className="text-3xl font-black text-primary">{listing.quantityAvailable}</span>
              </div>
            </div>

            <div className="prose max-w-none text-gray-700 mb-8">
              <p>{listing.description}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
              <div className="bg-gray-50 p-4 rounded-xl flex items-start gap-3">
                <MapPin className="w-6 h-6 text-gray-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-gray-900">Pickup Location</h4>
                  <p className="text-gray-600 text-sm mt-1">{listing.pickupLocation}</p>
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl flex items-start gap-3">
                <Clock className="w-6 h-6 text-gray-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-gray-900">Time Windows</h4>
                  <p className="text-gray-600 text-sm mt-1">
                    <span className="font-medium">Pickup by:</span> {new Date(listing.pickupDeadline).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    <br/>
                    <span className="font-medium">Expires at:</span> {new Date(listing.expiryTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4 mb-8">
              <h4 className="font-bold text-gray-900 border-b pb-2">Dietary & Safety Information</h4>
              <div className="flex gap-4">
                {listing.halal && (
                  <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm font-medium border border-green-200">Halal</span>
                )}
                {listing.vegetarian && (
                  <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm font-medium border border-green-200">Vegetarian</span>
                )}
              </div>
              {listing.allergies && (
                <div className="flex items-start gap-2 text-orange-700 bg-orange-50 p-3 rounded-lg text-sm">
                  <ShieldAlert className="w-5 h-5 shrink-0" />
                  <p><strong>Allergens:</strong> {listing.allergies}</p>
                </div>
              )}
            </div>

            {urgency === "Critical" && (
              <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-xl text-red-800 text-sm">
                <strong>Critical Urgency:</strong> This food will expire very soon or has a large quantity. Please claim only if you can pick it up immediately.
              </div>
            )}

            <div className="border-t pt-8 mt-8">
              {claimed ? (
                <div className="flex flex-col items-center justify-center p-6 bg-green-50 rounded-xl text-green-800">
                  <CheckCircle2 className="w-12 h-12 mb-3 text-green-600" />
                  <h3 className="text-xl font-bold">Claim Request Sent!</h3>
                  <p className="text-sm mt-2 text-center">Waiting for donor approval. Redirecting to dashboard...</p>
                </div>
              ) : user?.role === "donor" ? (
                <div className="flex flex-col items-center justify-center p-6 bg-gray-50 rounded-xl text-gray-600">
                  <h3 className="text-lg font-semibold">Registered as a Donor</h3>
                  <p className="text-sm mt-2 text-center">Donors cannot claim food. Please log in with a receiver account if you wish to claim items.</p>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {/* Allergy Confirmation Checkbox */}
                  {requiresAllergyCheck && (
                    <label className="flex items-start gap-3 p-4 border border-orange-200 bg-orange-50/50 rounded-lg cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="mt-1 w-5 h-5 text-primary rounded focus:ring-primary"
                        checked={allergyChecked}
                        onChange={(e) => setAllergyChecked(e.target.checked)}
                      />
                      <span className="text-sm text-gray-800 font-medium">
                        I have checked the allergy and dietary information and confirm it is safe for me to consume.
                      </span>
                    </label>
                  )}

                  {errorMsg && (
                    <div className="p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-200">
                      {errorMsg}
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row items-center gap-4 mt-2">
                    <div className="flex-1 w-full sm:w-auto">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Packs to Claim</label>
                      <input 
                        type="number" 
                        min={1} 
                        max={listing.quantityAvailable} 
                        value={quantity}
                        onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                        className="block w-full rounded-md border-gray-300 border px-4 py-3 focus:border-primary focus:ring-primary text-lg font-medium"
                      />
                    </div>
                    <button 
                      onClick={handleClaim}
                      disabled={!canClaim}
                      className="w-full sm:w-2/3 py-3 px-6 bg-primary hover:bg-primary-hover text-white rounded-lg font-bold text-lg shadow-sm transition-transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100 cursor-pointer disabled:cursor-not-allowed"
                    >
                      Claim Food
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
