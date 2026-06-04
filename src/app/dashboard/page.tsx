"use client";

import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { PlusCircle, List, ArrowRight, Check, X, Utensils, HeartHandshake, Leaf, Clock, MapPin, QrCode, AlertTriangle, Award } from "lucide-react";
import { MOCK_CLAIMS, MOCK_LISTINGS } from "@/lib/mock-data";
import { QRCodeSVG } from "qrcode.react";

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [claims, setClaims] = useState(MOCK_CLAIMS);
  const [showCertificate, setShowCertificate] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user, router]);

  if (!user) return null;

  const pendingClaims = claims.filter(c => c.status === "Pending");
  const myClaims = claims.filter(c => c.receiverId === user.id);

  const handleApprove = (id: string) => {
    setClaims(claims.map(c => c.id === id ? { ...c, status: "Approved" } : c));
  };

  const handleReject = (id: string) => {
    setClaims(claims.map(c => c.id === id ? { ...c, status: "Rejected" } : c));
  };

  const handleMarkCollected = (id: string) => {
    setClaims(claims.map(c => c.id === id ? { ...c, status: "Collected" } : c));
  };

  const handleNoShow = (id: string) => {
    // In a real app, we would update the backend to increment user's noShowCount
    setClaims(claims.map(c => c.id === id ? { ...c, status: "No-Show" } : c));
    alert("Receiver marked as No-Show. A penalty has been recorded on their account.");
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
        
        {/* Receiver No-Show Penalty Warning */}
        {user.role === "receiver" && (user.noShowCount || 0) > 0 && (
          <div className={`p-4 rounded-xl border flex items-start gap-3 ${
            (user.noShowCount || 0) >= 3 ? "bg-red-50 border-red-200 text-red-800" : "bg-orange-50 border-orange-200 text-orange-800"
          }`}>
            <AlertTriangle className="w-6 h-6 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold">No-Show Penalty Notice</h3>
              <p className="text-sm mt-1">
                You currently have {user.noShowCount} missed pickups. 
                {(user.noShowCount || 0) >= 3 ? " Your account is restricted from making new claims." : " Please ensure you collect food on time to avoid account restrictions."}
              </p>
            </div>
          </div>
        )}

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
                            claim.status === "Rejected" ? "bg-red-100 text-red-800" : 
                            claim.status === "No-Show" ? "bg-red-100 text-red-800" :
                            "bg-gray-100 text-gray-800"
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
              <div className="space-y-4 mb-8">
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
            
            {/* Show approved claims so donor can verify QR and mark no-show */}
            {claims.filter(c => c.status === "Approved").length > 0 && (
              <div className="mt-8 border-t pt-6">
                <h3 className="font-bold text-gray-700 mb-4 text-sm uppercase tracking-wide">Approved Pickups (Verify QR)</h3>
                <div className="space-y-3">
                  {claims.filter(c => c.status === "Approved").map(claim => {
                    const food = MOCK_LISTINGS.find(l => l.id === claim.foodId);
                    return (
                      <div key={claim.id} className="flex flex-col sm:flex-row justify-between items-center p-4 border border-green-200 bg-green-50 rounded-lg gap-4">
                        <div className="flex-1">
                          <p className="font-bold text-green-900">{food?.foodName} <span className="font-normal">({claim.quantity} packs)</span></p>
                          <p className="text-xs font-mono text-green-700 mt-1">ID: {claim.id}</p>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => handleNoShow(claim.id)} className="text-xs font-bold text-red-700 hover:text-red-900 border border-red-300 px-3 py-1.5 rounded bg-white shadow-sm transition-colors">
                            Mark No-Show
                          </button>
                          <button onClick={() => handleMarkCollected(claim.id)} className="text-xs font-bold text-white bg-green-600 hover:bg-green-700 px-3 py-1.5 rounded shadow-sm transition-colors">
                            Mark Collected
                          </button>
                        </div>
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
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">Your Impact Dashboard</h2>
            {user.role === "donor" && (
              <button 
                onClick={() => setShowCertificate(true)}
                className="flex items-center gap-1.5 text-sm font-medium text-primary hover:text-primary-hover bg-green-50 px-3 py-1.5 rounded-md border border-green-200 transition-colors"
              >
                <Award className="w-4 h-4" /> View Certificate
              </button>
            )}
          </div>
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

        {/* Impact Certificate Modal */}
        {showCertificate && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full p-8 shadow-2xl relative text-center border-4 border-double border-green-200">
              <button 
                onClick={() => setShowCertificate(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
              
              <div className="mx-auto bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <Award className="w-8 h-8 text-primary" />
              </div>
              
              <h2 className="text-3xl font-serif text-gray-900 mb-2">Certificate of Impact</h2>
              <p className="text-gray-500 font-medium uppercase tracking-widest text-sm mb-8">FoodBridge Campus</p>
              
              <div className="space-y-4 mb-8">
                <p className="text-gray-600 text-lg">This acknowledges that</p>
                <p className="text-2xl font-bold text-gray-900 border-b pb-2 inline-block px-8">{user.name}</p>
                <p className="text-gray-600 text-lg">has successfully saved</p>
                <p className="text-3xl font-black text-primary">45 meals</p>
                <p className="text-gray-600 text-lg">from becoming food waste and provided direct assistance to students in need.</p>
              </div>
              
              <p className="text-sm text-gray-400 font-mono">Issued on: {new Date().toLocaleDateString()}</p>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
