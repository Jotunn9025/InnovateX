// Player dashboard
"use client";

import { useUser } from "@/contexts/UserContext";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Star } from "lucide-react";

interface Booking {
  _id: string;
  turf: string;
  sport: string;
  date: string;
  timeSlot: string;
  status: string;
  amount: number;
}

export default function PlayerDashboard() {
  const { user, setUser } = useUser();
  const router = useRouter();
  const [allBookings, setAllBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookings = async () => {
      if (!user) return;
      try {
        const res = await axios.get(
          `http://localhost:5000/api/bookings/user/${user.id}`
        );
        const bookings = res.data.bookings;
        setAllBookings(bookings);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to fetch bookings");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [user]);

  const handleLogout = () => {
    setUser(null);
    router.push("/");
  };

  if (!user) {
    router.push("/login");
    return null;
  }

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  // Helper to get card color based on status
  const getCardClass = (status: string, isActive = false) => {
    if (isActive) return 'bg-green-500 border-green-300 text-white';
    switch ((status || '').toLowerCase()) {
      case 'approved':
      case 'confirmed':
        return 'bg-green-800 border-green-500 text-white';
      case 'waiting for approval':
      case 'pending':
        return 'bg-yellow-600 border-yellow-400 text-white';
      case 'rejected':
      case 'cancelled':
        return 'bg-red-800 border-red-500 text-white';
      default:
        return 'bg-gray-800 border-gray-700 text-white';
    }
  };

  // Take last booking as active
  const bookingsCopy = [...allBookings];
  const activeBooking = bookingsCopy.pop();

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Player Dashboard</h1>
              <p className="text-gray-300">Welcome, {user.firstName}!</p>
            </div>
            <div className="flex items-center space-x-3 " >
              <Button onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>
      <div className="container mx-auto px-4 py-8">
        {activeBooking && (
          <>
            <h2 className="text-2xl font-bold mb-4">Active Booking</h2>
            <Card className={getCardClass(activeBooking.status, true) + " mb-8 shadow-lg"}>
              <CardHeader>
                <CardTitle>{activeBooking.turf}</CardTitle>
                <CardDescription className="text-white">
                  {activeBooking.sport}  -  {activeBooking.date.split('T')[0]}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>Time: {activeBooking.timeSlot}</p>
                <b><p className="text-white text-lg">Status: {activeBooking.status}</p></b>
              </CardContent>
            </Card>
          </>
        )}
        <h2 className="text-2xl font-bold mb-4">Your Bookings</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookingsCopy.map((booking) => (
            <Card key={booking._id} className={getCardClass(booking.status)}>
              <CardHeader>
                <CardTitle>{booking.turf}</CardTitle>
                <CardDescription className="text-gray-300">
                  {booking.sport} - {booking.date.split('T')[0]}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>Time: {booking.timeSlot}</p>
                <p>Status: {booking.status}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
