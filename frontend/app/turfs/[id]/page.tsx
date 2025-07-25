"use client";

import { useState, useEffect, useRef } from "react";
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
  Clock,
  Calendar as CalendarIcon,
  MapIcon,
  AirVent,
  Zap,
  Wind,
  Droplets,
  Sun,
  Moon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {
  format,
  addDays,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameDay,
  isToday,
} from "date-fns";
import axios from "axios";
import React from "react";
import { useUser } from "@/contexts/UserContext";
import { useRouter } from "next/navigation";
import io from "socket.io-client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

interface Amenity {
  name: string;
  icon: React.ComponentType<any>;
}

interface Turf {
  _id: string;
  name: string;
  location: string;
  images: string[];
  sports: string[];
  amenities: Amenity[];
  rules: string[];
  owner: {
    name: string;
    phone: string;
    email: string;
    responseTime: string;
  };
  rating: number;
  reviews: number;
  prices: number[][];
  lowestPrice: number;
  originalPrice: number;
  availability: any;
  description: string;
  fullAddress: string;
}

const timeSlots = [
  { time: "06:00", label: "6:00 AM", period: "morning" },
  { time: "07:00", label: "7:00 AM", period: "morning" },
  { time: "08:00", label: "8:00 AM", period: "morning" },
  { time: "09:00", label: "9:00 AM", period: "morning" },
  { time: "10:00", label: "10:00 AM", period: "morning" },
  { time: "11:00", label: "11:00 AM", period: "morning" },
  { time: "12:00", label: "12:00 PM", period: "afternoon" },
  { time: "13:00", label: "1:00 PM", period: "afternoon" },
  { time: "14:00", label: "2:00 PM", period: "afternoon" },
  { time: "15:00", label: "3:00 PM", period: "afternoon" },
  { time: "16:00", label: "4:00 PM", period: "afternoon" },
  { time: "17:00", label: "5:00 PM", period: "evening" },
  { time: "18:00", label: "6:00 PM", period: "evening" },
  { time: "19:00", label: "7:00 PM", period: "evening" },
  { time: "20:00", label: "8:00 PM", period: "evening" },
  { time: "21:00", label: "9:00 PM", period: "evening" },
  { time: "22:00", label: "10:00 PM", period: "night" },
  { time: "23:00", label: "11:00 PM", period: "night" },
];

export default function TurfDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [turf, setTurf] = useState<Turf | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedDuration, setSelectedDuration] = useState("1");
  const [currentWeek, setCurrentWeek] = useState<Date>(new Date());
  const socketRef = useRef(null);
  const [lastBookingId, setLastBookingId] = useState(null);
  const [showPayment, setShowPayment] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("UPI");
  const [upiId, setUpiId] = useState("");
  const [isPaying, setIsPaying] = useState(false);
  const [userBookings, setUserBookings] = useState<any[]>([]);
  const [stripeClientSecret, setStripeClientSecret] = useState<string | null>(null);
  const [stripeAmount, setStripeAmount] = useState<number>(0);

  const unwrappedParams = React.use(params);
  const turfId = unwrappedParams.id;

  const { user, setUser } = useUser();
  const router = useRouter();

  const handleLogout = () => {
    setUser(null);
    router.push("/");
  };

  useEffect(() => {
    const fetchTurf = async () => {
      try {
        console.log(`Fetching turf with ID: ${turfId}`);
        const res = await axios.get(
          `http://localhost:5000/api/turfs/${turfId}`
        );
        console.log("API response:", res);
        setTurf(res.data.turf);
      } catch (err: any) {
        console.error("Error fetching turf:", err);
        setError(err.response?.data?.message || "Failed to fetch turf");
      } finally {
        setLoading(false);
      }
    };
    fetchTurf();
  }, [turfId]);

  useEffect(() => {
    const socket = io("http://localhost:5000");
    socketRef.current = socket;
    if (user) {
      socket.emit("register", {
        userId: user.id,
        userType: user.userType,
        email: user.email,
      });
    }
    socket.on(
      "booking-status",
      ({ bookingId, status }: { bookingId: string; status: string }) => {
        if (lastBookingId && bookingId === lastBookingId) {
          alert(`Your booking was ${status}`);
        }
      }
    );
    return () => {
      socket.disconnect();
    };
  }, [user, lastBookingId]);

  useEffect(() => {
    // Fetch all bookings for this turf and date
    const fetchBookings = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/bookings/user/${user?.id}`
        );
        setUserBookings(res.data.bookings);
      } catch (err) {
        setUserBookings([]);
      }
    };
    if (user) fetchBookings();
  }, [user, turfId, selectedDate, lastBookingId]);

  // Helper to get slot status for the current user
  const getSlotStatus = (date: Date, time: string) => {
    const dateKey = format(date, "yyyy-MM-dd");
    // Find bookings for this turf, date, and timeSlot
    const bookings = userBookings.filter(
      (b) =>
        b.turf === turf?.name &&
        format(new Date(b.date), "yyyy-MM-dd") === dateKey &&
        b.timeSlot === time
    );
    if (bookings.length > 0) {
      const myBooking = bookings.find((b) => b.user === user?.id);
      if (myBooking) return myBooking.status;
      // If not my booking, return the first status (should be 'waiting for approval', 'approved', or 'waitlist')
      return bookings[0].status;
    }
    return null;
  };

  if (loading)
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-400 mx-auto"></div>
          <p className="text-white mt-4">Loading turf details...</p>
        </div>
      </div>
    );
  if (error)
    return <div className="text-center text-red-500 py-12">{error}</div>;
  if (!turf)
    return <div className="text-center text-red-500 py-12">Turf not found</div>;

  const images = turf.images || [];
  const amenities = turf.amenities || [];
  const rules = turf.rules || [];
  const owner = turf.owner || { name: "N/A", phone: "N/A", email: "N/A" };
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

  const weekDays = eachDayOfInterval({
    start: startOfWeek(currentWeek),
    end: endOfWeek(currentWeek),
  });

  const getTimeSlotPrice = (date: Date, time: string) => {
    if (!turf || !turf.prices) return turf?.lowestPrice || 1000;
    const day = date.getDay();
    const hour = parseInt(time.split(":")[0], 10);
    return turf.prices[day]?.[hour] ?? turf.lowestPrice ?? 1000;
  };

  const getTimeSlotAvailability = (date: Date, time: string) => {
    const dateKey = format(date, "yyyy-MM-dd");
    const availability = turf.availability?.[dateKey]?.[time];
    // If slot info is missing, treat as available by default
    return (
      availability || {
        available: true,
        price: getTimeSlotPrice(date, time),
      }
    );
  };

  const calculatePrice = () => {
    if (!selectedTime || !selectedDuration) return 0;
    const basePrice = getTimeSlotPrice(selectedDate, selectedTime);
    return basePrice * Number.parseInt(selectedDuration);
  };

  const handleBooking = async () => {
    // Call backend to create PaymentIntent
    const userId = user?.id || "mockUserId";
    const res = await axios.post("http://localhost:5000/api/bookings", {
      userId,
      turf: turf.name,
      sport: turf.sports[0],
      date: selectedDate,
      timeSlot: selectedTime,
    });
    setStripeClientSecret(res.data.clientSecret);
    setStripeAmount(res.data.amount);
    setShowPayment(true);
  };

  const handleStripeSuccess = async () => {
    setShowPayment(false);
    // Now create the booking in backend (and trigger WhatsApp message)
    try {
      const userId = user?.id || "mockUserId";
      const res = await axios.post("http://localhost:5000/api/bookings/confirm", {
        userId,
        turf: turf.name,
        sport: turf.sports[0],
        date: selectedDate,
        timeSlot: selectedTime,
      });
      setLastBookingId(res.data.booking._id);
      alert("Payment successful! Booking confirmed and WhatsApp message sent.");
    } catch (err: any) {
      alert(err.response?.data?.message || "Booking confirmation failed");
    }
  };

  const getPeriodIcon = (period: string) => {
    switch (period) {
      case "morning":
        return <Sun className="w-4 h-4 text-yellow-400" />;
      case "afternoon":
        return <Sun className="w-4 h-4 text-orange-400" />;
      case "evening":
        return <Sun className="w-4 h-4 text-orange-600" />;
      case "night":
        return <Moon className="w-4 h-4 text-blue-400" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  function StripeCheckout({ clientSecret, onSuccess }: { clientSecret: string, onSuccess: () => void }) {
    const stripe = useStripe();
    const elements = useElements();
    const [loading, setLoading] = useState(false);
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!stripe || !elements) return;
      setLoading(true);
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement)!,
        },
      });
      setLoading(false);
      if (result.error) {
        alert(result.error.message);
      } else if (result.paymentIntent?.status === 'succeeded') {
        onSuccess();
      }
    };
    return (
      <form onSubmit={handleSubmit}>
        <CardElement />
        <Button type="submit" disabled={loading}>{loading ? 'Processing...' : 'Pay'}</Button>
      </form>
    );
  }

  const stripePromise = loadStripe('pk_test_51RoRgOJTkGjQcsNFasPubDjRLT1Ryt1nyBxYyrSfhonCtaSkTILEqKbJkbb9uOJ7FCtbULWOtxyu4wxZ37DVOjBc00YsHvvOEH');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Enhanced Header */}
      <header className="border-b border-gray-700 bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/turfs"
              className="flex items-center space-x-2 text-gray-400 hover:text-emerald-400 transition-colors duration-200"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Turfs</span>
            </Link>
            <div className="flex items-center space-x-3">
              {user ? (
                <>
                  <Button
                    className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white shadow-lg"
                    onClick={() =>
                      router.push(
                        user.userType === "admin"
                          ? "/admin-dashboard"
                          : "/player-dashboard"
                      )
                    }
                  >
                    {user.firstName}
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={handleLogout}
                    className="text-gray-300 hover:text-white hover:bg-gray-800"
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="outline"
                    size="icon"
                    className="bg-gray-800/50 border-gray-600 text-white hover:bg-red-600 hover:border-red-600 transition-all duration-200"
                  >
                    <Heart className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="bg-gray-800/50 border-gray-600 text-white hover:bg-blue-600 hover:border-blue-600 transition-all duration-200"
                  >
                    <Share2 className="w-4 h-4" />
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Enhanced Image Gallery */}
            <div className="relative">
              <div className="grid grid-cols-4 gap-3 h-96">
                <div className="col-span-2 row-span-2">
                  <div className="relative h-full rounded-xl overflow-hidden group">
                    <Image
                      src={images[0] || "/placeholder.svg"}
                      alt={turf.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                </div>
                {images.slice(1, 5).map((image: string, index: number) => (
                  <div
                    key={index}
                    className="relative rounded-lg overflow-hidden group"
                  >
                    <Image
                      src={image || "/placeholder.svg"}
                      alt={`${turf.name} ${index + 2}`}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {index === 3 && images.length > 5 && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <span className="text-white font-semibold text-lg">
                          +{images.length - 4} more
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Enhanced Turf Info */}
            <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700 shadow-2xl">
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <CardTitle className="text-3xl font-bold text-white">
                      {turf.name}
                    </CardTitle>
                    <CardDescription className="flex items-center text-gray-300 text-lg">
                      <MapPin className="w-5 h-5 mr-2 text-emerald-400" />
                      {turf.location}
                    </CardDescription>
                  </div>
                  <div className="flex items-center bg-gray-700/50 px-4 py-2 rounded-full">
                    <Star className="w-6 h-6 text-yellow-400 fill-current" />
                    <span className="text-xl font-bold ml-2 text-white">
                      {turf.rating}
                    </span>
                    <span className="text-sm text-gray-400 ml-2">
                      ({turf.reviews} reviews)
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-wrap gap-2">
                  {turf.sports.map((sport: string) => (
                    <Badge
                      key={sport}
                      variant="secondary"
                      className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white px-4 py-2 text-sm font-medium"
                    >
                      {sport}
                    </Badge>
                  ))}
                </div>
                <p className="text-gray-300 text-lg leading-relaxed">
                  {turf.description}
                </p>
                <div className="flex items-center gap-6 p-4 bg-gray-700/30 rounded-xl">
                  <div className="flex items-center gap-3">
                    <span className="text-4xl font-bold text-emerald-400">
                      ₹
                      {(() => {
                        const allPrices = turf.prices
                          .flat()
                          .filter((price) => price != null && price > 0);
                        return allPrices.length > 0
                          ? Math.min(...allPrices)
                          : 0;
                      })()}
                      + 
                    </span>
                  </div>
                  <span className="text-gray-400 text-lg">per hour</span>
                  {turf.originalPrice > turf.lowestPrice && (
                    <Badge className="bg-gradient-to-r from-red-600 to-red-700 text-white">
                      {Math.round(
                        ((turf.originalPrice - turf.lowestPrice) /
                          turf.originalPrice) *
                          100
                      )}
                      % OFF
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Enhanced Tabs */}
            <Tabs defaultValue="amenities" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4 bg-gray-800/50 backdrop-blur-sm p-1 rounded-xl">
                <TabsTrigger
                  value="amenities"
                  className="text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-600 data-[state=active]:to-emerald-700 data-[state=active]:text-white rounded-lg transition-all duration-200"
                >
                  Amenities
                </TabsTrigger>
                <TabsTrigger
                  value="rules"
                  className="text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-600 data-[state=active]:to-emerald-700 data-[state=active]:text-white rounded-lg transition-all duration-200"
                >
                  Rules
                </TabsTrigger>
                <TabsTrigger
                  value="location"
                  className="text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-600 data-[state=active]:to-emerald-700 data-[state=active]:text-white rounded-lg transition-all duration-200"
                >
                  Location
                </TabsTrigger>
                <TabsTrigger
                  value="reviews"
                  className="text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-600 data-[state=active]:to-emerald-700 data-[state=active]:text-white rounded-lg transition-all duration-200"
                >
                  Reviews
                </TabsTrigger>
              </TabsList>

              <TabsContent value="amenities">
                <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700">
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {turf.amenities.map((amenity: Amenity, index: number) => (
                        <div
                          key={index}
                          className="flex items-center space-x-3 p-3 bg-gray-700/30 rounded-lg hover:bg-gray-700/50 transition-colors duration-200"
                        >
                          <span className="text-gray-300 font-medium">
                            {amenity}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="rules">
                <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700">
                  <CardContent className="pt-6">
                    <ul className="space-y-3">
                      {turf.rules.map((rule: string, index: number) => (
                        <li
                          key={index}
                          className="flex items-start space-x-3 p-3 bg-gray-700/20 rounded-lg"
                        >
                          <CheckCircle className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-300">{rule}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="location">
                <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700">
                  <CardContent className="pt-6">
                    <div className="space-y-6">
                      <div className="p-4 bg-gray-700/30 rounded-xl">
                        <h4 className="font-semibold text-white mb-3 flex items-center">
                          <MapIcon className="w-5 h-5 mr-2 text-emerald-400" />
                          Address
                        </h4>
                        <p className="text-gray-300 text-lg">
                          {turf.fullAddress}
                        </p>
                      </div>
                      <div className="h-64 bg-gradient-to-br from-gray-700 to-gray-800 rounded-xl flex items-center justify-center border-2 border-dashed border-gray-600">
                        <div className="text-center w-full h-full">
                          <iframe
                            title="Google Map"
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3651.5449798045586!2d72.84495151543115!3d19.04188198710478!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7ce347acc47e3%3A0x688148bd4ffd1bce7ef682b6!2sYour%20Place%20Name!5e0!3m2!1sen!2sin!4v1688711787871!5m2!1sen!2sin"
                            width="100%"
                            height="100%"
                            style={{ border: 0, borderRadius: "0.75rem" }}
                            allowFullScreen=""
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                          ></iframe>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reviews">
                <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700">
                  <CardContent className="pt-6">
                    <div className="space-y-6">
                      {reviews.map((review) => (
                        <div
                          key={review.id}
                          className="border-b border-gray-700 pb-6 last:border-b-0 p-4 bg-gray-700/20 rounded-lg hover:bg-gray-700/30 transition-colors duration-200"
                        >
                          <div className="flex items-start space-x-4">
                            <Avatar className="w-12 h-12">
                              <AvatarImage
                                src={review.avatar || "/placeholder.svg"}
                                alt={review.user}
                              />
                              <AvatarFallback className="bg-emerald-600 text-white">
                                {review.user
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-2">
                                <h5 className="font-semibold text-white text-lg">
                                  {review.user}
                                </h5>
                                <span className="text-sm text-gray-400">
                                  {review.date}
                                </span>
                              </div>
                              <div className="flex items-center mb-3">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-5 h-5 ${
                                      i < review.rating
                                        ? "text-yellow-400 fill-current"
                                        : "text-gray-600"
                                    }`}
                                  />
                                ))}
                              </div>
                              <p className="text-gray-300 leading-relaxed">
                                {review.comment}
                              </p>
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

          {/* Enhanced Booking Sidebar */}
          <div className="lg:col-span-1">
            <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700 sticky top-24 shadow-2xl">
              <CardHeader>
                <CardTitle className="text-white text-xl flex items-center">
                  <CalendarIcon className="w-6 h-6 mr-2 text-emerald-400" />
                  Book This Turf
                </CardTitle>
                <CardDescription className="text-gray-400 text-base">
                  Select your preferred date and time
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Weekly Time Slot View */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-white">
                      Weekly Schedule
                    </h3>
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setCurrentWeek(addDays(currentWeek, -7))}
                        className="text-gray-300 hover:text-white"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setCurrentWeek(addDays(currentWeek, 7))}
                        className="text-gray-300 hover:text-white"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-7 gap-1 text-xs">
                    {weekDays.map((day) => (
                      <div
                        key={day.toISOString()}
                        className={`p-2 text-center rounded-lg cursor-pointer transition-all duration-200 ${
                          isSameDay(day, selectedDate)
                            ? "bg-emerald-600 text-white"
                            : isToday(day)
                            ? "bg-blue-600 text-white"
                            : "bg-gray-700/50 text-gray-300 hover:bg-gray-600"
                        }`}
                        onClick={() => setSelectedDate(day)}
                      >
                        <div className="font-medium">{format(day, "EEE")}</div>
                        <div className="text-xs">{format(day, "d")}</div>
                      </div>
                    ))}
                  </div>

                  {/* Time Slots for Selected Date */}
                  <div className="space-y-3">
                    <h4 className="text-white font-medium">
                      Available Times - {format(selectedDate, "MMM d, yyyy")}
                    </h4>
                    <div className="max-h-60 overflow-y-auto space-y-2">
                      {["morning", "afternoon", "evening", "night"].map(
                        (period) => {
                          const periodSlots = timeSlots.filter(
                            (slot) => slot.period === period
                          );
                          return (
                            <div key={period} className="space-y-2">
                              <div className="flex items-center text-sm text-gray-400 font-medium">
                                {getPeriodIcon(period)}
                                <span className="ml-2 capitalize">
                                  {period}
                                </span>
                              </div>
                              <div className="grid grid-cols-2 gap-2">
                                {periodSlots.map((slot) => {
                                  const availability = getTimeSlotAvailability(
                                    selectedDate,
                                    slot.time
                                  );
                                  const slotStatus = getSlotStatus(
                                    selectedDate,
                                    slot.time
                                  );
                                  const isMine = userBookings.some(
                                    (b) =>
                                      b.turf === turf.name &&
                                      format(new Date(b.date), "yyyy-MM-dd") ===
                                        format(selectedDate, "yyyy-MM-dd") &&
                                      b.timeSlot === slot.time &&
                                      b.user === user?.id
                                  );
                                  return (
                                    <Button
                                      key={slot.time}
                                      variant={
                                        selectedTime === slot.time
                                          ? "default"
                                          : "outline"
                                      }
                                      size="sm"
                                      disabled={
                                        slotStatus === "approved" ||
                                        (slotStatus ===
                                          "waiting for approval" &&
                                          !isMine)
                                      }
                                      onClick={() => setSelectedTime(slot.time)}
                                      className={`text-xs ${
                                        slotStatus === "approved" ||
                                        (slotStatus ===
                                          "waiting for approval" &&
                                          !isMine)
                                          ? "bg-gray-800 border-gray-700 text-gray-500 cursor-not-allowed opacity-50"
                                          : selectedTime === slot.time
                                          ? "bg-emerald-600 text-white border-emerald-600"
                                          : "bg-gray-700/50 border-gray-600 text-white hover:bg-gray-600 hover:border-gray-500"
                                      }`}
                                    >
                                      <div className="text-center w-full">
                                        <div>{slot.label}</div>
                                        <div className="text-xs text-gray-300">
                                          ₹{availability.price}
                                        </div>
                                        {slotStatus && (
                                          <div className="text-xs mt-1">
                                            {isMine
                                              ? slotStatus === "waitlist"
                                                ? "You are on waitlist"
                                                : slotStatus ===
                                                  "waiting for approval"
                                                ? "Your booking is pending"
                                                : slotStatus
                                                    .charAt(0)
                                                    .toUpperCase() +
                                                  slotStatus.slice(1)
                                              : slotStatus
                                                  .charAt(0)
                                                  .toUpperCase() +
                                                slotStatus.slice(1)}
                                          </div>
                                        )}
                                      </div>
                                      {!availability.available && (
                                        <XCircle className="w-3 h-3 ml-1" />
                                      )}
                                      {availability.available &&
                                        selectedTime === slot.time && (
                                          <CheckCircle className="w-3 h-3 ml-1" />
                                        )}
                                    </Button>
                                  );
                                })}
                              </div>
                            </div>
                          );
                        }
                      )}
                    </div>
                  </div>
                </div>

                {selectedDate && selectedTime && (
                  <>
                    <div>
                      <label className="text-sm font-medium text-gray-300 mb-3 block">
                        Duration
                      </label>
                      <Select
                        value={selectedDuration}
                        onValueChange={setSelectedDuration}
                      >
                        <SelectTrigger className="bg-gray-700/50 border-gray-600 text-white">
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
                          <SelectItem value="4" className="text-white">
                            4 hours
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Enhanced Booking Summary */}
                    <div className="border border-gray-600 rounded-xl p-4 bg-gray-700/20 backdrop-blur-sm">
                      <h4 className="font-semibold text-white mb-3 flex items-center">
                        <CheckCircle className="w-5 h-5 mr-2 text-emerald-400" />
                        Booking Summary
                      </h4>
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between items-center p-2 bg-gray-800/50 rounded-lg">
                          <span className="text-gray-300">Date</span>
                          <span className="text-white font-medium">
                            {format(selectedDate, "MMM d, yyyy")}
                          </span>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-gray-800/50 rounded-lg">
                          <span className="text-gray-300">Time</span>
                          <span className="text-white font-medium">
                            {
                              timeSlots.find(
                                (slot) => slot.time === selectedTime
                              )?.label
                            }
                          </span>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-gray-800/50 rounded-lg">
                          <span className="text-gray-300">Duration</span>
                          <span className="text-white font-medium">
                            {selectedDuration}h
                          </span>
                        </div>
                        <div className="border-t border-gray-600 pt-3 space-y-2">
                          <div className="flex justify-between text-gray-300">
                            <span>Base price ({selectedDuration}h)</span>
                            <span>₹{calculatePrice()}</span>
                          </div>
                          <div className="flex justify-between text-gray-300">
                            <span>Platform fee</span>
                            <span>₹50</span>
                          </div>
                          <div className="flex justify-between text-gray-300">
                            <span>GST (18%)</span>
                            <span>
                              ₹{Math.round((calculatePrice() + 50) * 0.18)}
                            </span>
                          </div>
                          <div className="flex justify-between font-bold text-lg text-white border-t border-gray-600 pt-2">
                            <span>Total Amount</span>
                            <span className="text-emerald-400">
                              ₹{Math.round((calculatePrice() + 50) * 1.18)}
                            </span>
                          </div>
                        </div>
                        <Button
                          className="w-full mt-4 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-semibold py-3 text-lg shadow-lg"
                          onClick={handleBooking}
                        >
                          Book Now - ₹
                          {Math.round((calculatePrice() + 50) * 1.18)}
                        </Button>
                      </div>
                    </div>
                  </>
                )}

                {/* Enhanced Contact Owner Section */}
                <div className="border-t border-gray-600 pt-6">
                  <h4 className="font-semibold text-white mb-4 flex items-center">
                    <Phone className="w-5 h-5 mr-2 text-emerald-400" />
                    Contact Owner
                  </h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold">
                            {owner?.name?.charAt(0) || "N/A"}
                          </span>
                        </div>
                        <div>
                          <p className="text-white font-medium">
                            Nitish Agrawal
                          </p>
                          <p className="text-xs text-gray-400">
                            {owner.responseTime}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-gray-700/50 border-gray-600 text-white hover:bg-green-700 hover:border-green-600"
                      >
                        <Phone className="w-4 h-4 mr-2" />
                        Call
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-gray-700/50 border-gray-600 text-white hover:bg-blue-700 hover:border-blue-600"
                      >
                        <Mail className="w-4 h-4 mr-2" />
                        Email
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-3 gap-3 p-4 bg-gray-700/20 rounded-xl">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-emerald-400">
                      {turf.rating}
                    </div>
                    <div className="text-xs text-gray-400">Rating</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-400">
                      {turf.reviews}
                    </div>
                    <div className="text-xs text-gray-400">Reviews</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-400">
                      24/7
                    </div>
                    <div className="text-xs text-gray-400">Available</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Payment Gateway Modal */}
      <Dialog open={showPayment} onOpenChange={setShowPayment}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Stripe Payment</DialogTitle>
            <DialogDescription>
              Complete your payment to book this turf.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="text-lg font-bold">
              Amount to Pay: ₹{Math.round((stripeAmount + 50) * 1.18)}
            </div>
            {stripeClientSecret && (
              <Elements stripe={stripePromise} options={{ clientSecret: stripeClientSecret }}>
                <StripeCheckout clientSecret={stripeClientSecret} onSuccess={handleStripeSuccess} />
              </Elements>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
