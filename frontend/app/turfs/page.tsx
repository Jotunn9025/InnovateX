"use client";

import { useState } from "react";
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

export default function TurfsPage() {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSport, setSelectedSport] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [priceRange, setPriceRange] = useState("all");

  const turfs = [
    {
      id: 1,
      name: "Elite Sports Arena",
      location: "Downtown, Mumbai",
      rating: 4.8,
      reviews: 124,
      price: 1200,
      originalPrice: 1500,
      image: "/placeholder.svg?height=200&width=300",
      sports: ["Football", "Cricket"],
      availability: "Available",
      amenities: ["Parking", "Changing Room", "Floodlights"],
      distance: "2.3 km",
    },
    {
      id: 2,
      name: "Champions Ground",
      location: "Bandra, Mumbai",
      rating: 4.6,
      reviews: 89,
      price: 1000,
      originalPrice: 1200,
      image: "/placeholder.svg?height=200&width=300",
      sports: ["Cricket", "Tennis"],
      availability: "Available",
      amenities: ["Parking", "Cafeteria", "Equipment Rental"],
      distance: "3.1 km",
    },
    {
      id: 3,
      name: "Victory Courts",
      location: "Andheri, Mumbai",
      rating: 4.9,
      reviews: 156,
      price: 800,
      originalPrice: 1000,
      image: "/placeholder.svg?height=200&width=300",
      sports: ["Tennis", "Badminton"],
      availability: "Filling Fast",
      amenities: ["AC", "Parking", "Pro Shop"],
      distance: "1.8 km",
    },
    {
      id: 4,
      name: "Metro Sports Complex",
      location: "Powai, Mumbai",
      rating: 4.7,
      reviews: 203,
      price: 1500,
      originalPrice: 1800,
      image: "/placeholder.svg?height=200&width=300",
      sports: ["Football", "Basketball", "Tennis"],
      availability: "Available",
      amenities: ["Swimming Pool", "Gym", "Spa", "Restaurant"],
      distance: "4.2 km",
    },
    {
      id: 5,
      name: "Green Valley Turf",
      location: "Thane, Mumbai",
      rating: 4.4,
      reviews: 67,
      price: 900,
      originalPrice: 1100,
      image: "/placeholder.svg?height=200&width=300",
      sports: ["Football", "Cricket"],
      availability: "Available",
      amenities: ["Parking", "Changing Room", "First Aid"],
      distance: "5.7 km",
    },
    {
      id: 6,
      name: "Ace Badminton Center",
      location: "Malad, Mumbai",
      rating: 4.8,
      reviews: 91,
      price: 600,
      originalPrice: 750,
      image: "/placeholder.svg?height=200&width=300",
      sports: ["Badminton"],
      availability: "Available",
      amenities: ["AC", "Equipment Rental", "Coaching"],
      distance: "6.1 km",
    },
  ];

  const filteredTurfs = turfs.filter((turf) => {
    const matchesSearch =
      turf.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      turf.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSport =
      selectedSport === "all" ||
      turf.sports.some(
        (sport) => sport.toLowerCase() === selectedSport.toLowerCase()
      );
    const matchesLocation =
      selectedLocation === "all" ||
      turf.location.toLowerCase().includes(selectedLocation.toLowerCase());
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
              <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">TB</span>
              </div>
              <span className="text-xl font-bold text-white">TurfBook</span>
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
              key={turf.id}
              className="bg-slate-900 border-slate-800 overflow-hidden hover:shadow-lg transition-shadow"
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
                      {turf.location} • {turf.distance}
                    </CardDescription>
                  </div>
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-medium ml-1 text-white">
                      {turf.rating}
                    </span>
                    <span className="text-xs text-slate-400 ml-1">
                      ({turf.reviews})
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex flex-wrap gap-2 mb-3">
                  {turf.sports.map((sport) => (
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
                  {turf.amenities.slice(0, 3).map((amenity) => (
                    <span
                      key={amenity}
                      className="text-xs text-slate-400 bg-slate-800 px-2 py-1 rounded"
                    >
                      {amenity}
                    </span>
                  ))}
                  {turf.amenities.length > 3 && (
                    <span className="text-xs text-slate-400">
                      +{turf.amenities.length - 3} more
                    </span>
                  )}
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-emerald-400">
                        ₹{turf.price}
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
                    <Link href={`/turfs/${turf.id}`}>Book Now</Link>
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
