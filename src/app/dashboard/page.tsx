"use client";

import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { PlusCircle, List, ArrowRight, Check, X, Utensils, HeartHandshake, Leaf, Clock, MapPin, QrCode } from "lucide-react";
import { MOCK_CLAIMS, MOCK_LISTINGS } from "@/lib/mock-data";
import { QRCodeSVG } from "qrcode.react";

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [claims, setClaims] = useState(MOCK_CLAIMS);

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  if (!user) return null;

  const pendingClaims = claims.filter(c => c.status === "Pending");
  
  // Get claims made by the current user
  const myClaims = claims.filter(c => c.receiverId === user.id);

  const handleApprove = (id: string) => {
    setClaims(claims.map(c => c.id === id ? { ...c, status: "Approved" } : c));
  };

  const handleReject = (id: string) => {
    setClaims(claims.map(c => c.id === id ? { ...c, status: "Rejected" } : c));
  };

  return (
    <div className="min-h-screen bg-neutral-bg">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome, {user.name}
          </h1>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 capitalize">
              {user.role}
            </span>
            <button
              onClick={() => {
                logout();
                router.push("/");
              }}
              className="text-sm font-medium text-gray-500 hover:text-gray-700"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {user.role === "donor" && (
            <div className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow border border-gray-100">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <PlusCircle className="h-6 w-6 text-primary" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Donate Food</dt>
                      <dd>
                        <div className="text-lg font-medium text-gray-900">Post extra food</div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-5 py-3 border-t border-gray-100">
                <div className="text-sm">
                  <Link href="/dashboard/post-food" className="font-medium text-primary hover:text-primary-hover flex items-center">
                    Get started <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          )}

          {(user.role === "receiver" || user.role === "volunteer" || user.role === "donor") && (
            <div className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow border border-gray-100">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <List className="h-6 w-6 text-accent" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">Available Food</dt>
                      <dd>
                        <div className="text-lg font-medium text-gray-900">Browse current listings</div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-5 py-3 border-t border-gray-100">
                <div className="text-sm">
                  <Link href="/listings" className="font-medium text-primary hover:text-primary-hover flex items-center">
                    View Listings <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* My Pickups (Cart) */}
        {(user.role === "receiver" || user.role === "volunteer") && (
          <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <QrCode className="w-6 h-6 text-primary" /> My Pickups
            </h2>
            {myClaims.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                <p className="text-gray-500">You haven't claimed any food yet.</p>
                <Link href="/listings" className="text-primary font-medium hover:underline mt-2 inline-block">Browse available food</Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {myClaims.map(claim => {
                  const food = MOCK_LISTINGS.find(l => l.id === claim.foodId);
                  if (!food) return null;

                  return (
                    <div key={claim.id} className="border rounded-xl p-5 bg-gray-50 flex flex-col sm:flex-row gap-6">
                      <div className="flex-1 space-y-3">
                        <div className="flex items-start justify-between">
                          <h3 className="font-bold text-lg text-gray-900">{food.foodName}</h3>
                          <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${
                            claim.status === "Approved" ? "bg-green-100 text-green-800" :
                            claim.status === "Pending" ? "bg-yellow-100 text-yellow-800" :
                            claim.status === "Rejected" ? "bg-red-100 text-red-800" : "bg-gray-100 text-gray-800"
                          }`}>
                            {claim.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">You requested <strong>{claim.quantity} packs</strong>.</p>
                        
                        <div className="space-y-1 mt-4">
                          <div className="flex items-center text-sm text-gray-500">
                            <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                            {food.pickupLocation}
                          </div>
                          <div className="flex items-center text-sm text-gray-500">
                            <Clock className="w-4 h-4 mr-2 text-gray-400" />
                            By: {new Date(claim.pickupTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                          </div>
                        </div>
                      </div>

                      {/* QR Code Section */}
                      {claim.status === "Approved" && (
                        <div className="flex flex-col items-center justify-center p-4 bg-white rounded-lg border shadow-sm sm:w-40 shrink-0">
                          <QRCodeSVG value={claim.id} size={100} level="H" />
                          <p className="text-[10px] text-gray-500 mt-2 font-mono break-all text-center">ID: {claim.id}</p>
                          <p className="text-xs text-center font-semibold text-primary mt-1">Show at pickup</p>
                        </div>
                      )}
                      
                      {claim.status === "Pending" && (
                        <div className="flex items-center justify-center p-4 bg-gray-100 rounded-lg border border-dashed border-gray-300 sm:w-40 shrink-0 text-center">
                          <p className="text-sm text-gray-500 italic">Waiting for donor to approve...</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        )}

        {/* Donor Claim Management */}
        {user.role === "donor" && (
          <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Check className="w-6 h-6 text-primary" /> Manage Claims
            </h2>
            {pendingClaims.length === 0 ? (
              <p className="text-gray-500 italic">No pending claims.</p>
            ) : (
              <div className="space-y-4">
                {pendingClaims.map(claim => {
                  const food = MOCK_LISTINGS.find(l => l.id === claim.foodId);
                  return (
                    <div key={claim.id} className="flex flex-col sm:flex-row items-center justify-between p-4 border rounded-lg bg-gray-50 gap-4">
                      <div>
                        <h4 className="font-bold text-gray-900">{food?.foodName}</h4>
                        <p className="text-sm text-gray-600">Requested: {claim.quantity} packs • Pickup: {new Date(claim.pickupTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                        <p className="text-xs text-gray-500 font-mono mt-1">Claim ID: {claim.id}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => handleApprove(claim.id)} className="flex items-center gap-1 bg-primary text-white px-3 py-1.5 rounded-md text-sm font-medium hover:bg-primary-hover">
                          <Check className="w-4 h-4"/> Approve
                        </button>
                        <button onClick={() => handleReject(claim.id)} className="flex items-center gap-1 bg-red-100 text-red-700 px-3 py-1.5 rounded-md text-sm font-medium hover:bg-red-200">
                          <X className="w-4 h-4"/> Reject
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            
            {/* Show approved claims so donor can verify QR */}
            {claims.filter(c => c.status === "Approved").length > 0 && (
              <div className="mt-8">
                <h3 className="font-bold text-gray-700 mb-4 text-sm uppercase tracking-wide">Approved Pickups (Verify QR)</h3>
                <div className="space-y-3">
                  {claims.filter(c => c.status === "Approved").map(claim => {
                    const food = MOCK_LISTINGS.find(l => l.id === claim.foodId);
                    return (
                      <div key={claim.id} className="flex justify-between items-center p-3 border border-green-200 bg-green-50 rounded-lg">
                        <div>
                          <p className="font-medium text-green-900">{food?.foodName} ({claim.quantity} packs)</p>
                          <p className="text-xs font-mono text-green-700">ID: {claim.id}</p>
                        </div>
                        <button className="text-xs font-bold text-green-700 hover:text-green-900 border border-green-300 px-3 py-1.5 rounded bg-white">
                          Mark Collected
                        </button>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </section>
        )}

        {/* Impact Dashboard */}
        <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Your Impact Dashboard</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 bg-green-50 rounded-lg flex items-center gap-4 border border-green-100">
              <div className="p-3 bg-green-100 rounded-full text-green-600"><Utensils className="w-6 h-6"/></div>
              <div>
                <p className="text-sm text-gray-600 font-medium">Meals Saved</p>
                <p className="text-2xl font-black text-gray-900">45</p>
              </div>
            </div>
            <div className="p-4 bg-orange-50 rounded-lg flex items-center gap-4 border border-orange-100">
              <div className="p-3 bg-orange-100 rounded-full text-orange-600"><HeartHandshake className="w-6 h-6"/></div>
              <div>
                <p className="text-sm text-gray-600 font-medium">Completed Donations</p>
                <p className="text-2xl font-black text-gray-900">12</p>
              </div>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg flex items-center gap-4 border border-blue-100">
              <div className="p-3 bg-blue-100 rounded-full text-blue-600"><Leaf className="w-6 h-6"/></div>
              <div>
                <p className="text-sm text-gray-600 font-medium">Waste Reduced</p>
                <p className="text-2xl font-black text-gray-900">~22 kg</p>
              </div>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}
