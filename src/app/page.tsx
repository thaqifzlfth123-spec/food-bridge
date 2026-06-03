import Link from "next/link";
import { ArrowRight, Utensils, HeartHandshake, Leaf } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-neutral-bg">
      <header className="px-6 py-4 bg-white shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-2 text-primary font-bold text-xl">
          <Leaf className="w-6 h-6" />
          <span>FoodBridge Campus</span>
        </div>
        <nav className="flex gap-4">
          <Link href="/login" className="text-gray-600 hover:text-primary font-medium px-4 py-2">
            Log In
          </Link>
          <Link href="/signup" className="bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-lg font-medium transition-colors">
            Sign Up
          </Link>
        </nav>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="px-6 py-20 flex flex-col items-center text-center bg-secondary">
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 tracking-tight max-w-3xl mb-6">
            Rescue Extra Food. <br />
            <span className="text-primary">Feed Students.</span> <br />
            Reduce Waste.
          </h1>
          <p className="text-lg md:text-xl text-gray-700 max-w-2xl mb-10">
            FoodBridge Campus is an AI-powered food rescue platform connecting cafes, events, and student organizations with students in need.
          </p>
          <div className="flex gap-4">
            <Link href="/signup" className="bg-primary hover:bg-primary-hover text-white px-8 py-4 rounded-xl font-bold text-lg flex items-center gap-2 transition-transform hover:scale-105 shadow-md">
              Get Started <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/listings" className="bg-white hover:bg-gray-50 text-gray-900 border border-gray-200 px-8 py-4 rounded-xl font-bold text-lg transition-transform hover:scale-105 shadow-sm">
              View Food
            </Link>
          </div>
        </section>

        {/* Impact Stats */}
        <section className="px-6 py-16 bg-white">
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-green-50 rounded-2xl flex flex-col items-center text-center">
              <Utensils className="w-10 h-10 text-primary mb-4" />
              <div className="text-4xl font-black text-gray-900 mb-2">500+</div>
              <div className="text-gray-600 font-medium">Meals Saved in Pilot</div>
            </div>
            <div className="p-6 bg-orange-50 rounded-2xl flex flex-col items-center text-center">
              <HeartHandshake className="w-10 h-10 text-accent mb-4" />
              <div className="text-4xl font-black text-gray-900 mb-2">120+</div>
              <div className="text-gray-600 font-medium">Active Students</div>
            </div>
            <div className="p-6 bg-red-50 rounded-2xl flex flex-col items-center text-center">
              <Leaf className="w-10 h-10 text-alert mb-4" />
              <div className="text-4xl font-black text-gray-900 mb-2">~150kg</div>
              <div className="text-gray-600 font-medium">Food Waste Reduced</div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-gray-900 text-gray-400 py-8 text-center text-sm">
        <p>&copy; {new Date().getFullYear()} FoodBridge Campus. Built for positive impact.</p>
      </footer>
    </div>
  );
}
