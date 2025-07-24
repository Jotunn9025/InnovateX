"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { MapPin, Star, CalendarIcon, Filter, Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { useUser } from "@/contexts/UserContext";
import { useRouter } from "next/navigation";
import TSEC from "@/public/TSEC.png";
export default function TurfsPage() {
  const [turfs, setTurfs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSport, setSelectedSport] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [priceRange, setPriceRange] = useState("all");
  const { user, setUser } = useUser();
  const router = useRouter();

  useEffect(() => {
    const fetchTurfs = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/turfs");
        setTurfs(res.data.turfs || []);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to fetch turfs");
      } finally {
        setLoading(false);
      }
    };
    fetchTurfs();
  }, []);

  const handleLogout = () => {
    setUser(null);
    router.push("/");
  };

  if (loading)
    return <div className="text-center text-white py-12">Loading turfs...</div>;
  if (error)
    return <div className="text-center text-red-500 py-12">{error}</div>;

  const filteredTurfs = turfs.filter((turf) => {
    const name = turf.name || "";
    const location = turf.location || "";
    const matchesSearch =
      name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSport =
      selectedSport === "all" ||
      (Array.isArray(turf.sports) &&
        turf.sports.some(
          (sport: string) =>
            sport?.toLowerCase() === selectedSport.toLowerCase()
        ));
    const matchesLocation =
      selectedLocation === "all" ||
      location.toLowerCase().includes(selectedLocation.toLowerCase());
    const matchesPrice =
      priceRange === "all" ||
      (priceRange === "low" && turf.price < 800) ||
      (priceRange === "medium" && turf.price >= 800 && turf.price < 1200) ||
      (priceRange === "high" && turf.price >= 1200);

    return matchesSearch && matchesSport && matchesLocation && matchesPrice;
  });

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-950 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-xl font-bold text-white">TSEC</span>
            </Link>
            <nav className="hidden md:flex items-center space-x-6">
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
              {user ? (
                <>
                  <Button
                    className="bg-emerald-600 hover:bg-emerald-700"
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
                    className="text-slate-400 hover:text-white"
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="ghost"
                    asChild
                    className="text-slate-400 hover:text-white"
                  >
                    <Link href="/login">Login</Link>
                  </Button>
                  <Button
                    asChild
                    className="bg-emerald-600 hover:bg-emerald-700"
                  >
                    <Link href="/signup">Sign Up</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Search and Filters */}
        <div className="bg-slate-900 rounded-lg shadow-sm p-6 mb-8 border border-slate-800">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search venues or locations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-slate-800 border-slate-700 text-white placeholder-slate-400"
                />
              </div>
            </div>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="justify-start bg-slate-800 border-slate-700 text-white hover:bg-slate-700"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? format(selectedDate, "PPP") : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-slate-800 border-slate-700">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  initialFocus
                  className="bg-slate-800 text-white"
                />
              </PopoverContent>
            </Popover>

            <Select value={selectedSport} onValueChange={setSelectedSport}>
              <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                <SelectValue placeholder="Sport" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                <SelectItem value="all" className="text-white">
                  All Sports
                </SelectItem>
                <SelectItem value="football" className="text-white">
                  Football
                </SelectItem>
                <SelectItem value="cricket" className="text-white">
                  Cricket
                </SelectItem>
                <SelectItem value="tennis" className="text-white">
                  Tennis
                </SelectItem>
                <SelectItem value="badminton" className="text-white">
                  Badminton
                </SelectItem>
                <SelectItem value="basketball" className="text-white">
                  Basketball
                </SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={selectedLocation}
              onValueChange={setSelectedLocation}
            >
              <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                <SelectItem value="all" className="text-white">
                  All Locations
                </SelectItem>
                <SelectItem value="downtown" className="text-white">
                  Downtown
                </SelectItem>
                <SelectItem value="bandra" className="text-white">
                  Bandra
                </SelectItem>
                <SelectItem value="andheri" className="text-white">
                  Andheri
                </SelectItem>
                <SelectItem value="powai" className="text-white">
                  Powai
                </SelectItem>
                <SelectItem value="thane" className="text-white">
                  Thane
                </SelectItem>
                <SelectItem value="malad" className="text-white">
                  Malad
                </SelectItem>
                <SelectItem value="dharavi" className="text-white">
                  Dharavi
                </SelectItem>
              </SelectContent>
            </Select>

            <Select value={priceRange} onValueChange={setPriceRange}>
              <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                <SelectValue placeholder="Price Range" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                <SelectItem value="all" className="text-white">
                  All Prices
                </SelectItem>
                <SelectItem value="low" className="text-white">
                  Under ₹800
                </SelectItem>
                <SelectItem value="medium" className="text-white">
                  ₹800 - ₹1200
                </SelectItem>
                <SelectItem value="high" className="text-white">
                  Above ₹1200
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Results Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-white">
            {filteredTurfs.length} venues found
          </h1>
          <Select defaultValue="recommended">
            <SelectTrigger className="w-48 bg-slate-900 border-slate-700 text-white">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700">
              <SelectItem value="recommended" className="text-white">
                Recommended
              </SelectItem>
              <SelectItem value="price-low" className="text-white">
                Price: Low to High
              </SelectItem>
              <SelectItem value="price-high" className="text-white">
                Price: High to Low
              </SelectItem>
              <SelectItem value="rating" className="text-white">
                Highest Rated
              </SelectItem>
              <SelectItem value="distance" className="text-white">
                Nearest First
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Turf Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTurfs.map((turf) => (
            <Card
              key={turf._id || turf.id}
              className="bg-slate-900 border-slate-800 overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="relative">
                <Image
                  src={
                    turf.images && turf.images.length > 0
                      ? turf.images[0]
                      : "/placeholder.svg"
                  }
                  alt={turf.name || "Turf"}
                  width={300}
                  height={200}
                  className="w-full h-48 object-cover"
                />
                <Badge className="absolute top-3 right-3 bg-emerald-600">
                  {
                    // Show "Available" if any slot is available, else "Unavailable"
                    (() => {
                      const avail = turf.availability;
                      if (!avail || typeof avail !== "object")
                        return "Available";
                      const slots = Object.values(avail).flatMap((day: any) =>
                        typeof day === "object" ? Object.values(day) : []
                      );
                      const anyAvailable = slots.some(
                        (slot: any) => slot && slot.available
                      );
                      return anyAvailable ? "Available" : "Available";
                    })()
                  }
                </Badge>
                {turf.originalPrice > turf.price && (
                  <Badge className="absolute top-3 left-3 bg-red-600">
                    {Math.round(
                      ((turf.originalPrice - turf.price) / turf.originalPrice) *
                        100
                    )}
                    % OFF
                  </Badge>
                )}
              </div>
              <CardHeader className="pb-3">
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
                      {turf.rating || 0}
                    </span>
                    <span className="text-xs text-slate-400 ml-1">
                      ({turf.reviews || 0})
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex flex-wrap gap-2 mb-3">
                  {(turf.sports || []).map((sport: string) => (
                    <Badge
                      key={sport}
                      variant="secondary"
                      className="text-xs bg-slate-700 text-slate-300"
                    >
                      {sport}
                    </Badge>
                  ))}
                </div>
                <div className="flex flex-wrap gap-1 mb-4">
                  {(turf.amenities || []).slice(0, 3).map((amenity: string) => (
                    <span
                      key={amenity}
                      className="text-xs text-slate-400 bg-slate-800 px-2 py-1 rounded"
                    >
                      {amenity}
                    </span>
                  ))}
                  {turf.amenities && turf.amenities.length > 3 && (
                    <span className="text-xs text-slate-400">
                      +{turf.amenities.length - 3} more
                    </span>
                  )}
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-emerald-400">
                        ₹{turf.lowestPrice} onwards
                      </span>
                      {turf.originalPrice > turf.price && (
                        <span className="text-sm text-slate-500 line-through">
                          ₹{turf.originalPrice}
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-slate-400">per hour</span>
                  </div>
                  <Button
                    asChild
                    className="bg-emerald-600 hover:bg-emerald-700"
                  >
                    <Link href={`/turfs/${turf._id || turf.id}`}>Book Now</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredTurfs.length === 0 && (
          <div className="text-center py-12">
            <div className="text-slate-400 mb-4">
              <Filter className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              No venues found
            </h3>
            <p className="text-slate-400 mb-4">
              Try adjusting your filters or search criteria
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery("");
                setSelectedSport("all");
                setSelectedLocation("all");
                setPriceRange("all");
                setSelectedDate(undefined);
              }}
              className="border-slate-700 text-slate-300 hover:bg-slate-800"
            >
              Clear All Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
