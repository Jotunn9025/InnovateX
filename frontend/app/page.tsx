import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  const featuredTurfs = [
    {
      id: 1,
      name: "Elite Sports Arena",
      location: "Downtown, Mumbai",
      rating: 4.8,
      price: 1200,
      image: "/placeholder.svg?height=200&width=300",
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
      date: "Dec 15-17, 2024",
      prize: "₹50,000",
      participants: 16,
    },
    {
      id: 2,
      name: "Cricket Championship",
      date: "Dec 20-22, 2024",
      prize: "₹75,000",
      participants: 12,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">TB</span>
              </div>
              <span className="text-xl font-bold text-white">TurfBook</span>
            </div>
            <nav className="hidden md:flex items-center space-x-6">
              <Link
                href="/turfs"
                className="text-slate-400 hover:text-emerald-400 transition-colors"
              >
                Find Turfs
              </Link>
              <Link
                href="/tournaments"
                className="text-slate-400 hover:text-emerald-400 transition-colors"
              >
                Tournaments
              </Link>
              <Link
                href="/community"
                className="text-slate-400 hover:text-emerald-400 transition-colors"
              >
                Community
              </Link>
            </nav>
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                asChild
                className="text-slate-400 hover:text-white"
              >
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild className="bg-emerald-600 hover:bg-emerald-700">
                <Link href="/signup">Sign Up</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Book Your Perfect
            <span className="text-emerald-400 block">Sports Venue</span>
          </h1>
          <p className="text-xl text-slate-400 mb-8 max-w-2xl mx-auto">
            Discover and book premium sports facilities near you. From football
            turfs to tennis courts, find the perfect venue for your game.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="text-lg px-8 py-3 bg-emerald-600 hover:bg-emerald-700"
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
              className="text-lg px-8 py-3 border-slate-700 text-slate-300 hover:bg-slate-800 bg-transparent"
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
      <section className="py-16 px-4 bg-slate-900">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-white">
            Why Choose TurfBook?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader className="text-center">
                <Clock className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
                <CardTitle className="text-white">Dynamic Pricing</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-400 text-center">
                  Smart pricing based on demand, time, and weather conditions
                  for the best deals.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader className="text-center">
                <Trophy className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
                <CardTitle className="text-white">Host Tournaments</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-400 text-center">
                  Organize and participate in local tournaments with prize pools
                  and rankings.
                </p>
              </CardContent>
            </Card>
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader className="text-center">
                <Users className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
                <CardTitle className="text-white">Find Teammates</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-400 text-center">
                  Connect with players near you and build your sports community.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Turfs */}
      <section className="py-16 px-4 bg-slate-950">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold text-white">Featured Venues</h2>
            <Button
              variant="outline"
              asChild
              className="border-slate-700 text-slate-300 hover:bg-slate-800 bg-transparent"
            >
              <Link href="/turfs">View All</Link>
            </Button>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {featuredTurfs.map((turf) => (
              <Card
                key={turf.id}
                className="bg-slate-800 border-slate-700 overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="relative">
                  <Image
                    src={turf.image || "/placeholder.svg"}
                    alt={turf.name}
                    width={300}
                    height={200}
                    className="w-full h-48 object-cover"
                  />
                  <Badge className="absolute top-3 right-3 bg-emerald-600">
                    {turf.availability}
                  </Badge>
                </div>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg text-white">
                        {turf.name}
                      </CardTitle>
                      <CardDescription className="flex items-center mt-1 text-slate-400">
                        <MapPin className="w-4 h-4 mr-1" />
                        {turf.location}
                      </CardDescription>
                    </div>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
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
                        className="bg-slate-700 text-slate-300"
                      >
                        {sport}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-emerald-400">
                      ₹{turf.price}
                    </span>
                    <Button
                      asChild
                      className="bg-emerald-600 hover:bg-emerald-700"
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
      <section className="py-16 px-4 bg-slate-900">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold text-white">
              Upcoming Tournaments
            </h2>
            <Button
              variant="outline"
              asChild
              className="border-slate-700 text-slate-300 hover:bg-slate-800 bg-transparent"
            >
              <Link href="/tournaments">View All</Link>
            </Button>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {upcomingTournaments.map((tournament) => (
              <Card
                key={tournament.id}
                className="bg-slate-800 border-slate-700 hover:shadow-lg transition-shadow"
              >
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl text-white">
                        {tournament.name}
                      </CardTitle>
                      <CardDescription className="flex items-center mt-2 text-slate-400">
                        <Calendar className="w-4 h-4 mr-2" />
                        {tournament.date}
                      </CardDescription>
                    </div>
                    <Badge
                      variant="outline"
                      className="text-emerald-400 border-emerald-400"
                    >
                      Prize: {tournament.prize}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-400">
                      {tournament.participants} teams registered
                    </span>
                    <Button className="bg-emerald-600 hover:bg-emerald-700">
                      Register Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-emerald-600 text-white">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Play?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of players who trust TurfBook for their sports venue
            needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              variant="secondary"
              className="text-lg px-8 py-3 bg-white text-emerald-600 hover:bg-slate-100"
              asChild
            >
              <Link href="/signup">Get Started</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 text-white py-12 px-4 border-t border-slate-800">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">TB</span>
                </div>
                <span className="text-xl font-bold">TurfBook</span>
              </div>
              <p className="text-slate-400">
                Your trusted platform for booking sports venues and building
                communities.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-white">For Players</h3>
              <ul className="space-y-2 text-slate-400">
                <li>
                  <Link
                    href="/turfs"
                    className="hover:text-white transition-colors"
                  >
                    Find Venues
                  </Link>
                </li>
                <li>
                  <Link
                    href="/tournaments"
                    className="hover:text-white transition-colors"
                  >
                    Tournaments
                  </Link>
                </li>
                <li>
                  <Link
                    href="/community"
                    className="hover:text-white transition-colors"
                  >
                    Community
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-white">Features</h3>
              <ul className="space-y-2 text-slate-400">
                <li>Dynamic Pricing</li>
                <li>Tournament Hosting</li>
                <li>Player Matching</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4 text-white">Support</h3>
              <ul className="space-y-2 text-slate-400">
                <li>
                  <Link
                    href="/help"
                    className="hover:text-white transition-colors"
                  >
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="hover:text-white transition-colors"
                  >
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms"
                    className="hover:text-white transition-colors"
                  >
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 mt-8 pt-8 text-center text-slate-400">
            <p>&copy; 2024 TurfBook. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
