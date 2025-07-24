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
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  MapPin,
  Star,
  Users,
  Car,
  Wifi,
  Coffee,
  Shield,
  Phone,
  Mail,
  ArrowLeft,
  Heart,
  Share2,
  CheckCircle,
  XCircle,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";

export default function TurfDetailPage({ params }: { params: { id: string } }) {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedDuration, setSelectedDuration] = useState("1");

  // Mock data - in real app, fetch based on params.id
  const turf = {
    id: 1,
    name: "Elite Sports Arena",
    location: "Downtown, Mumbai",
    fullAddress: "123 Sports Complex, Downtown, Mumbai, Maharashtra 400001",
    rating: 4.8,
    reviews: 124,
    price: 1200,
    originalPrice: 1500,
    images: [
      "/placeholder.svg?height=400&width=600&text=Main+Field",
      "/placeholder.svg?height=400&width=600&text=Changing+Room",
      "/placeholder.svg?height=400&width=600&text=Parking+Area",
      "/placeholder.svg?height=400&width=600&text=Night+View",
    ],
    sports: ["Football", "Cricket"],
    amenities: [
      { name: "Parking", icon: Car },
      { name: "Changing Room", icon: Users },
      { name: "Floodlights", icon: Shield },
      { name: "WiFi", icon: Wifi },
      { name: "Cafeteria", icon: Coffee },
      { name: "First Aid", icon: Shield },
    ],
    description:
      "Premium sports facility with state-of-the-art infrastructure. Perfect for professional matches and casual games alike. Features include modern changing rooms, ample parking, and excellent lighting for night games.",
    rules: [
      "No smoking or alcohol allowed",
      "Proper sports attire required",
      "Maximum 22 players for football",
      "Booking cancellation allowed up to 2 hours before",
      "Damage to property will be charged",
    ],
    owner: {
      name: "Sports Arena Management",
      phone: "+91 98765 43210",
      email: "info@elitesportsarena.com",
      responseTime: "Usually responds within 1 hour",
    },
    availability: {
      "2024-12-15": {
        "09:00": { available: true, price: 1000 },
        "10:00": { available: true, price: 1000 },
        "11:00": { available: false, price: 1200 },
        "14:00": { available: true, price: 1200 },
        "15:00": { available: true, price: 1200 },
        "16:00": { available: true, price: 1200 },
        "17:00": { available: false, price: 1500 },
        "18:00": { available: true, price: 1500 },
        "19:00": { available: true, price: 1500 },
        "20:00": { available: true, price: 1500 },
      },
    },
  };

  const reviews = [
    {
      id: 1,
      user: "Rahul Sharma",
      avatar: "/placeholder.svg?height=40&width=40",
      rating: 5,
      date: "2024-12-10",
      comment:
        "Excellent facility! Well-maintained turf and great amenities. Will definitely book again.",
    },
    {
      id: 2,
      user: "Priya Patel",
      avatar: "/placeholder.svg?height=40&width=40",
      rating: 4,
      date: "2024-12-08",
      comment:
        "Good experience overall. The changing rooms could be better, but the turf quality is top-notch.",
    },
    {
      id: 3,
      user: "Amit Kumar",
      avatar: "/placeholder.svg?height=40&width=40",
      rating: 5,
      date: "2024-12-05",
      comment:
        "Perfect for our weekend matches. Great lighting for evening games and ample parking space.",
    },
  ];

  const timeSlots = selectedDate
    ? turf.availability[format(selectedDate, "yyyy-MM-dd")] || {}
    : {};

  const calculatePrice = () => {
    if (!selectedTime || !selectedDuration) return 0;
    const basePrice = timeSlots[selectedTime]?.price || turf.price;
    return basePrice * Number.parseInt(selectedDuration);
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/turfs"
              className="flex items-center space-x-2 text-gray-400 hover:text-white"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Turfs</span>
            </Link>
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                size="icon"
                className="bg-gray-800 border-gray-700 text-white"
              >
                <Heart className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="bg-gray-800 border-gray-700 text-white"
              >
                <Share2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 md:col-span-1">
                <Image
                  src={turf.images[0] || "/placeholder.svg"}
                  alt={turf.name}
                  width={600}
                  height={400}
                  className="w-full h-64 md:h-80 object-cover rounded-lg"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                {turf.images.slice(1, 4).map((image, index) => (
                  <Image
                    key={index}
                    src={image || "/placeholder.svg"}
                    alt={`${turf.name} ${index + 2}`}
                    width={300}
                    height={200}
                    className="w-full h-24 md:h-36 object-cover rounded-lg"
                  />
                ))}
                {turf.images.length > 4 && (
                  <div className="relative">
                    <Image
                      src={turf.images[4] || "/placeholder.svg"}
                      alt="More images"
                      width={300}
                      height={200}
                      className="w-full h-24 md:h-36 object-cover rounded-lg"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center">
                      <span className="text-white font-semibold">
                        +{turf.images.length - 4} more
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Turf Info */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-2xl text-white">
                      {turf.name}
                    </CardTitle>
                    <CardDescription className="flex items-center mt-2 text-gray-300">
                      <MapPin className="w-4 h-4 mr-1" />
                      {turf.location}
                    </CardDescription>
                  </div>
                  <div className="flex items-center">
                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                    <span className="text-lg font-semibold ml-1 text-white">
                      {turf.rating}
                    </span>
                    <span className="text-sm text-gray-400 ml-1">
                      ({turf.reviews} reviews)
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {turf.sports.map((sport) => (
                      <Badge
                        key={sport}
                        variant="secondary"
                        className="bg-green-600 text-white"
                      >
                        {sport}
                      </Badge>
                    ))}
                  </div>
                  <p className="text-gray-300">{turf.description}</p>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-3xl font-bold text-green-400">
                        ₹{turf.price}
                      </span>
                      {turf.originalPrice > turf.price && (
                        <span className="text-lg text-gray-500 line-through">
                          ₹{turf.originalPrice}
                        </span>
                      )}
                    </div>
                    <span className="text-gray-400">per hour</span>
                    {turf.originalPrice > turf.price && (
                      <Badge className="bg-red-600">
                        {Math.round(
                          ((turf.originalPrice - turf.price) /
                            turf.originalPrice) *
                            100
                        )}
                        % OFF
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tabs */}
            <Tabs defaultValue="amenities" className="space-y-4">
              <TabsList className="grid w-full grid-cols-4 bg-gray-800">
                <TabsTrigger
                  value="amenities"
                  className="text-white data-[state=active]:bg-green-600"
                >
                  Amenities
                </TabsTrigger>
                <TabsTrigger
                  value="rules"
                  className="text-white data-[state=active]:bg-green-600"
                >
                  Rules
                </TabsTrigger>
                <TabsTrigger
                  value="location"
                  className="text-white data-[state=active]:bg-green-600"
                >
                  Location
                </TabsTrigger>
                <TabsTrigger
                  value="reviews"
                  className="text-white data-[state=active]:bg-green-600"
                >
                  Reviews
                </TabsTrigger>
              </TabsList>

              <TabsContent value="amenities">
                <Card className="bg-gray-800 border-gray-700">
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {turf.amenities.map((amenity) => (
                        <div
                          key={amenity.name}
                          className="flex items-center space-x-3"
                        >
                          <amenity.icon className="w-5 h-5 text-green-400" />
                          <span className="text-gray-300">{amenity.name}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="rules">
                <Card className="bg-gray-800 border-gray-700">
                  <CardContent className="pt-6">
                    <ul className="space-y-2">
                      {turf.rules.map((rule, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <span className="text-green-400 mt-1">•</span>
                          <span className="text-gray-300">{rule}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="location">
                <Card className="bg-gray-800 border-gray-700">
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-white mb-2">
                          Address
                        </h4>
                        <p className="text-gray-300">{turf.fullAddress}</p>
                      </div>
                      <div className="h-64 bg-gray-700 rounded-lg flex items-center justify-center">
                        <span className="text-gray-400">
                          Map integration would go here
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reviews">
                <Card className="bg-gray-800 border-gray-700">
                  <CardContent className="pt-6">
                    <div className="space-y-6">
                      {reviews.map((review) => (
                        <div
                          key={review.id}
                          className="border-b border-gray-700 pb-4 last:border-b-0"
                        >
                          <div className="flex items-start space-x-4">
                            <Avatar>
                              <AvatarImage
                                src={review.avatar || "/placeholder.svg"}
                                alt={review.user}
                              />
                              <AvatarFallback className="bg-gray-700 text-white">
                                {review.user
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-2">
                                <h5 className="font-semibold text-white">
                                  {review.user}
                                </h5>
                                <span className="text-sm text-gray-400">
                                  {review.date}
                                </span>
                              </div>
                              <div className="flex items-center mb-2">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-4 h-4 ${
                                      i < review.rating
                                        ? "text-yellow-400 fill-current"
                                        : "text-gray-600"
                                    }`}
                                  />
                                ))}
                              </div>
                              <p className="text-gray-300">{review.comment}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <Card className="bg-gray-800 border-gray-700 sticky top-24">
              <CardHeader>
                <CardTitle className="text-white">Book This Turf</CardTitle>
                <CardDescription className="text-gray-400">
                  Select date and time for your booking
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-300 mb-2 block">
                    Select Date
                  </label>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    className="rounded-md border border-gray-700 bg-gray-800"
                    disabled={(date) => date < new Date()}
                  />
                </div>

                {selectedDate && (
                  <>
                    <div>
                      <label className="text-sm font-medium text-gray-300 mb-2 block">
                        Available Time Slots
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {Object.entries(timeSlots).map(([time, slot]) => (
                          <Button
                            key={time}
                            variant={
                              selectedTime === time ? "default" : "outline"
                            }
                            size="sm"
                            disabled={!slot.available}
                            onClick={() => setSelectedTime(time)}
                            className={`${
                              slot.available
                                ? selectedTime === time
                                  ? "bg-green-600 text-white"
                                  : "bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
                                : "bg-gray-700 border-gray-600 text-gray-500 cursor-not-allowed"
                            }`}
                          >
                            <div className="text-center">
                              <div className="text-xs">{time}</div>
                              <div className="text-xs">₹{slot.price}</div>
                            </div>
                            {!slot.available && (
                              <XCircle className="w-3 h-3 ml-1" />
                            )}
                            {slot.available && selectedTime === time && (
                              <CheckCircle className="w-3 h-3 ml-1" />
                            )}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-300 mb-2 block">
                        Duration
                      </label>
                      <Select
                        value={selectedDuration}
                        onValueChange={setSelectedDuration}
                      >
                        <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-700 border-gray-600">
                          <SelectItem value="1" className="text-white">
                            1 hour
                          </SelectItem>
                          <SelectItem value="2" className="text-white">
                            2 hours
                          </SelectItem>
                          <SelectItem value="3" className="text-white">
                            3 hours
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {selectedTime && (
                      <div className="border-t border-gray-700 pt-4">
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between text-gray-300">
                            <span>Base price ({selectedDuration}h)</span>
                            <span>₹{calculatePrice()}</span>
                          </div>
                          <div className="flex justify-between text-gray-300">
                            <span>Service fee</span>
                            <span>₹50</span>
                          </div>
                          <div className="flex justify-between font-semibold text-lg text-white border-t border-gray-700 pt-2">
                            <span>Total</span>
                            <span>₹{calculatePrice() + 50}</span>
                          </div>
                        </div>
                        <Button className="w-full mt-4" size="lg">
                          Book Now - ₹{calculatePrice() + 50}
                        </Button>
                      </div>
                    )}
                  </>
                )}

                <div className="border-t border-gray-700 pt-4">
                  <h4 className="font-semibold text-white mb-2">
                    Contact Owner
                  </h4>
                  <div className="space-y-2 text-sm text-gray-300">
                    <div className="flex items-center space-x-2">
                      <Phone className="w-4 h-4" />
                      <span>{turf.owner.phone}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Mail className="w-4 h-4" />
                      <span>{turf.owner.email}</span>
                    </div>
                    <p className="text-xs text-gray-400">
                      {turf.owner.responseTime}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
