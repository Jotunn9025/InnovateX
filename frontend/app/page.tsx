"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  Clock,
  Users,
  Star,
  Calendar,
  Trophy,
  UserPlus,
} from "lucide-react";
import TSEC from "@/public/TSEC.png";
import Link from "next/link";
import { useUser } from "@/contexts/UserContext";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import axios from "axios";

export default function HomePage() {
  const featuredTurfs = [
    {
      id: 1,
      name: "Elite Sports Arena",
      location: "Downtown, Mumbai",
      rating: 4.8,
      price: 1200,
      image: "/images/1.png",
      sports: ["Football", "Cricket"],
      availability: "Available",
    },
    {
      id: 2,
      name: "Champions Ground",
      location: "Bandra, Mumbai",
      rating: 4.6,
      price: 1000,
      image: "/placeholder.svg?height=200&width=300",
      sports: ["Cricket", "Tennis"],
      availability: "Available",
    },
    {
      id: 3,
      name: "Victory Courts",
      location: "Andheri, Mumbai",
      rating: 4.9,
      price: 800,
      image: "/placeholder.svg?height=200&width=300",
      sports: ["Tennis", "Badminton"],
      availability: "Filling Fast",
    },
  ];

  const upcomingTournaments = [
    {
      id: 1,
      name: "Mumbai Football League",
      date: "Aug 15-17, 2025",
      prize: "₹50,000",
      participants: 16,
    },
    {
      id: 2,
      name: "mumbai Premier League",
      date: "Aug 20-22, 2025",
      prize: "₹75,000",
      participants: 12,
    },
  ];

  const { user, setUser } = useUser();
  const router = useRouter();

  // Chat widget state
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatHistory, setChatHistory] = useState<
    { user: string; assistant: string }[]
  >([]);
  const [chatLoading, setChatLoading] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatOpen && chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatHistory, chatOpen]);

  const handleSendChat = async (e?: any) => {
    if (e) e.preventDefault();
    if (!chatInput.trim()) return;
    const userMessage = chatInput.trim();
    setChatHistory((prev) => [
      ...prev,
      { user: userMessage, assistant: "..." },
    ]);
    setChatInput("");
    setChatLoading(true);
    try {
      const res = await axios.post("http://localhost:8000/chat", {
        message: userMessage,
      });
      const reply = res.data.reply;
      setChatHistory((prev) => {
        const updated = [...prev];
        updated[updated.length - 1].assistant = reply;
        return updated;
      });
    } catch (err) {
      setChatHistory((prev) => {
        const updated = [...prev];
        updated[updated.length - 1].assistant = "Sorry, there was an error.";
        return updated;
      });
    } finally {
      setChatLoading(false);
    }
  };

  const handleLogout = () => {
    setUser(null);
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-emerald-600/10 rounded-full blur-3xl"></div>
        <div className="absolute top-40 right-40 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl"></div>
      </div>

      {/* Header */}
      <header className="border-b border-white/10 bg-white/5 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 relative rounded-lg overflow-hidden backdrop-blur-sm bg-white/10 p-1">
                <Image
                  src={TSEC}
                  alt="TurfBook Logo"
                  fill
                  className="object-cover rounded-md"
                />
              </div>
              <span className="text-xl font-bold text-white">TSEC</span>
            </div>
            <nav className="hidden md:flex items-center space-x-6">
              <Link
                href="/turfs"
                className="text-white/70 hover:text-emerald-400 transition-all duration-300 hover:drop-shadow-lg"
              >
                Find Turfs
              </Link>
              <Link
                href="/tournaments"
                className="text-white/70 hover:text-emerald-400 transition-all duration-300 hover:drop-shadow-lg"
              >
                Tournaments
              </Link>
              <Link
                href="/community"
                className="text-white/70 hover:text-emerald-400 transition-all duration-300 hover:drop-shadow-lg"
              >
                Community
              </Link>
            </nav>
            <div className="flex items-center space-x-3">
              {user ? (
                <>
                  <Button
                    className="bg-emerald-600/80 hover:bg-emerald-700/90 backdrop-blur-sm border border-emerald-500/30 shadow-lg hover:shadow-emerald-500/25 transition-all duration-300"
                    onClick={() =>
                      router.push(
                        user.userType === "admin"
                          ? "/admin"
                          : "/player-dashboard"
                      )
                    }
                  >
                    {user.firstName}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleLogout}
                    className=" hover:text-white border-white/20 hover:bg-white/10 backdrop-blur-sm transition-all duration-300"
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="ghost"
                    asChild
                    className="text-white/80 hover:text-white hover:bg-white/10 backdrop-blur-sm transition-all duration-300"
                  >
                    <Link href="/login">Login</Link>
                  </Button>
                  <Button
                    asChild
                    className="bg-emerald-600/80 hover:bg-emerald-700/90 backdrop-blur-sm border border-emerald-500/30 shadow-lg hover:shadow-emerald-500/25 transition-all duration-300"
                  >
                    <Link href="/signup">Sign Up</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 relative">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 drop-shadow-2xl">
            Book Your Perfect
            <span className="text-emerald-400 block bg-gradient-to-r from-emerald-400 to-emerald-300 bg-clip-text">
              Sports Venue
            </span>
          </h1>
          <p className="text-xl text-white/70 mb-8 max-w-2xl mx-auto drop-shadow-lg">
            Discover and book premium sports facilities near you. From football
            turfs to tennis courts, find the perfect venue for your game.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="text-lg px-8 py-3 bg-emerald-600/80 hover:bg-emerald-700/90 backdrop-blur-sm border border-emerald-500/30 shadow-xl hover:shadow-emerald-500/25 transition-all duration-300 hover:scale-105"
              asChild
            >
              <Link href="/turfs">
                <MapPin className="w-5 h-5 mr-2" />
                Find Venues
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 py-3 border-white/20 text-white hover:bg-white/10 bg-white/5 backdrop-blur-sm shadow-xl transition-all duration-300 hover:scale-105"
              asChild
            >
              <Link href="/community">
                <UserPlus className="w-5 h-5 mr-2" />
                Find Players
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 relative">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-white drop-shadow-lg">
            Why Choose TurfSetConnect?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-xl hover:shadow-2xl hover:bg-white/15 transition-all duration-500 hover:scale-105 hover:-translate-y-2">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-emerald-500/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-500/30">
                  <Clock className="w-8 h-8 text-emerald-400 drop-shadow-lg" />
                </div>
                <CardTitle className="text-white drop-shadow-md">
                  Dynamic Pricing
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-white/70 text-center leading-relaxed">
                  Smart pricing based on demand, time, and weather conditions
                  for the best deals.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-xl hover:shadow-2xl hover:bg-white/15 transition-all duration-500 hover:scale-105 hover:-translate-y-2">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-emerald-500/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-500/30">
                  <Trophy className="w-8 h-8 text-emerald-400 drop-shadow-lg" />
                </div>
                <CardTitle className="text-white drop-shadow-md">
                  Host Tournaments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-white/70 text-center leading-relaxed">
                  Organize and participate in local tournaments with prize pools
                  and rankings.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-white/10 backdrop-blur-xl border-white/20 shadow-xl hover:shadow-2xl hover:bg-white/15 transition-all duration-500 hover:scale-105 hover:-translate-y-2">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-emerald-500/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-500/30">
                  <Users className="w-8 h-8 text-emerald-400 drop-shadow-lg" />
                </div>
                <CardTitle className="text-white drop-shadow-md">
                  Find Teammates
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-white/70 text-center leading-relaxed">
                  Connect with players near you and build your sports community.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Turfs */}
      <section className="py-16 px-4 relative">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold text-white drop-shadow-lg">
              Featured Venues
            </h2>
            <Button
              variant="outline"
              asChild
              className="border-white/20 text-white hover:bg-white/10 bg-white/5 backdrop-blur-sm shadow-lg transition-all duration-300 hover:scale-105"
            >
              <Link href="/turfs">View All</Link>
            </Button>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {featuredTurfs.map((turf) => (
              <Card
                key={turf.id}
                className="bg-white/10 backdrop-blur-xl border-white/20 overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-2 hover:bg-white/15 group"
              >
                <div className="relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent z-10"></div>
                  <Image
                    src={turf.image || "/placeholder.svg"}
                    alt={turf.name}
                    width={300}
                    height={200}
                    className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <Badge className="absolute top-3 right-3 bg-emerald-600/80 backdrop-blur-sm border border-emerald-500/30 shadow-lg z-20">
                    {turf.availability}
                  </Badge>
                </div>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg text-white drop-shadow-md">
                        {turf.name}
                      </CardTitle>
                      <CardDescription className="flex items-center mt-1 text-white/70">
                        <MapPin className="w-4 h-4 mr-1" />
                        {turf.location}
                      </CardDescription>
                    </div>
                    <div className="flex items-center bg-yellow-500/20 backdrop-blur-sm rounded-full px-2 py-1 border border-yellow-500/30">
                      <Star className="w-4 h-4 text-yellow-400 fill-current drop-shadow-sm" />
                      <span className="text-sm font-medium ml-1 text-white">
                        {turf.rating}
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {turf.sports.map((sport) => (
                      <Badge
                        key={sport}
                        variant="secondary"
                        className="bg-white/10 text-white/80 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-colors duration-300"
                      >
                        {sport}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-emerald-400 drop-shadow-lg">
                      ₹{turf.price}
                    </span>
                    <Button
                      asChild
                      className="bg-emerald-600/80 hover:bg-emerald-700/90 backdrop-blur-sm border border-emerald-500/30 shadow-lg hover:shadow-emerald-500/25 transition-all duration-300 hover:scale-105"
                    >
                      <Link href={`/turfs/${turf.id}`}>Book Now</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Tournaments */}
      <section className="py-16 px-4 relative">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold text-white drop-shadow-lg">
              Upcoming Tournaments
            </h2>
            <Button
              variant="outline"
              asChild
              className="border-white/20 text-white hover:bg-white/10 bg-white/5 backdrop-blur-sm shadow-lg transition-all duration-300 hover:scale-105"
            >
              <Link href="/tournaments">View All</Link>
            </Button>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {upcomingTournaments.map((tournament) => (
              <Card
                key={tournament.id}
                className="bg-white/10 backdrop-blur-xl border-white/20 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-2 hover:bg-white/15 group"
              >
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl text-white drop-shadow-md">
                        {tournament.name}
                      </CardTitle>
                      <CardDescription className="flex items-center mt-2 text-white/70">
                        <Calendar className="w-4 h-4 mr-2" />
                        {tournament.date}
                      </CardDescription>
                    </div>
                    <Badge
                      variant="outline"
                      className="text-emerald-400 border-emerald-400/50 bg-emerald-400/10 backdrop-blur-sm shadow-lg"
                    >
                      Prize: {tournament.prize}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-white/70">
                      {tournament.participants} teams registered
                    </span>
                    <Button className="bg-emerald-600/80 hover:bg-emerald-700/90 backdrop-blur-sm border border-emerald-500/30 shadow-lg hover:shadow-emerald-500/25 transition-all duration-300 hover:scale-105">
                      <Link href={`/tournaments/${tournament.id}`}>
                        Book Now
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/20 via-emerald-500/30 to-emerald-600/20 backdrop-blur-sm"></div>
        <div className="container mx-auto text-center relative z-10">
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-12 border border-white/20 shadow-2xl">
            <h2 className="text-4xl font-bold mb-6 text-white drop-shadow-lg">
              Ready to Play?
            </h2>
            <p className="text-xl mb-8 text-white/80 drop-shadow-md">
              Join thousands of players who trust TurfBook for their sports
              venue needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                variant="secondary"
                className="text-lg px-8 py-3 bg-white/90 text-emerald-600 hover:bg-white hover:text-emerald-700 backdrop-blur-sm shadow-xl transition-all duration-300 hover:scale-105 border border-white/30"
                asChild
              >
                <Link href="/signup">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white/5 backdrop-blur-xl text-white py-12 px-4 border-t border-white/10 relative">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-emerald-600/80 backdrop-blur-sm rounded-lg flex items-center justify-center border border-emerald-500/30 shadow-lg">
                  <span className="text-white font-bold text-sm">TB</span>
                </div>
                <span className="text-xl font-bold drop-shadow-md">
                  TurfBook
                </span>
              </div>
              <p className="text-white/70 leading-relaxed">
                Your trusted platform for booking sports venues and building
                communities.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-white drop-shadow-md">
                For Players
              </h3>
              <ul className="space-y-2 text-white/70">
                <li>
                  <Link
                    href="/turfs"
                    className="hover:text-white transition-all duration-300 hover:drop-shadow-lg"
                  >
                    Find Venues
                  </Link>
                </li>
                <li>
                  <Link
                    href="/tournaments"
                    className="hover:text-white transition-all duration-300 hover:drop-shadow-lg"
                  >
                    Tournaments
                  </Link>
                </li>
                <li>
                  <Link
                    href="/community"
                    className="hover:text-white transition-all duration-300 hover:drop-shadow-lg"
                  >
                    Community
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-white drop-shadow-md">
                Features
              </h3>
              <ul className="space-y-2 text-white/70">
                <li>Dynamic Pricing</li>
                <li>Tournament Hosting</li>
                <li>Player Matching</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-white drop-shadow-md">
                Support
              </h3>
              <ul className="space-y-2 text-white/70">
                <li>
                  <Link
                    href="/help"
                    className="hover:text-white transition-all duration-300 hover:drop-shadow-lg"
                  >
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="hover:text-white transition-all duration-300 hover:drop-shadow-lg"
                  >
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms"
                    className="hover:text-white transition-all duration-300 hover:drop-shadow-lg"
                  >
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 mt-8 pt-8 text-center text-white/70">
            <p>&copy; 2025 TurfSetConnect. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Chat Widget */}
      <div className="fixed bottom-6 right-6 z-50">
        {!chatOpen && (
          <button
            className="bg-emerald-600 text-white rounded-full shadow-lg p-4 flex items-center hover:bg-emerald-700 transition"
            onClick={() => setChatOpen(true)}
            aria-label="Open chat"
          >
            <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
              <path
                d="M12 22c5.523 0 10-4.03 10-9s-4.477-9-10-9S2 3.03 2 8c0 2.21 1.343 4.21 3.5 5.5V22l6.5-3.5z"
                fill="currentColor"
              />
            </svg>
          </button>
        )}
        {chatOpen && (
          <div className="w-80 bg-white rounded-xl shadow-2xl flex flex-col overflow-hidden border border-gray-200">
            <div className="bg-emerald-600 text-white px-4 py-3 flex items-center justify-between">
              <span className="font-semibold">Chat</span>
              <button
                onClick={() => setChatOpen(false)}
                className="text-white hover:text-gray-200"
              >
                ×
              </button>
            </div>
            <div
              className="flex-1 p-3 overflow-y-auto max-h-96"
              style={{ minHeight: 200 }}
            >
              {chatHistory.length === 0 && (
                <div className="text-gray-500 text-center mt-8">
                  How may I help you?
                </div>
              )}
              {chatHistory.map((msg, idx) => (
                <div key={idx} className="mb-4">
                  <div className="text-right">
                    <span className="inline-block bg-emerald-100 text-emerald-900 rounded-lg px-3 py-1 text-sm mb-1 max-w-[80%]">
                      {msg.user}
                    </span>
                  </div>
                  <div className="text-left">
                    <span className="inline-block bg-gray-100 text-gray-900 rounded-lg px-3 py-1 text-sm max-w-[80%]">
                      {msg.assistant}
                    </span>
                  </div>
                </div>
              ))}
              <div ref={chatBottomRef} />
            </div>
            <form
              onSubmit={handleSendChat}
              className="flex border-t border-gray-200"
            >
              <input
                type="text"
                className="flex-1 px-3 py-2 text-sm focus:outline-none"
                placeholder="Type your message..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                disabled={chatLoading}
                autoFocus
              />
              <button
                type="submit"
                className="bg-emerald-600 text-white px-4 py-2 text-sm font-semibold hover:bg-emerald-700 transition"
                disabled={chatLoading || !chatInput.trim()}
              >
                Send
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
