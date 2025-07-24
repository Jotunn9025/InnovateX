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
  const [pastBookings, setPastBookings] = useState<Booking[]>([]);
  const [futureBookings, setFutureBookings] = useState<Booking[]>([]);
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

        const now = new Date();
        const past = bookings.filter(
          (booking: any) => new Date(booking.date) < now
        );
        const future = bookings.filter(
          (booking: any) => new Date(booking.date) >= now
        );

        setPastBookings(past);
        setFutureBookings(future);
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

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Player Dashboard</h1>
              <p className="text-gray-300">Welcome, {user.firstName}!</p>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-4">Future Bookings</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {futureBookings.map((booking) => (
            <Card key={booking._id} className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle>{booking.turf}</CardTitle>
                <CardDescription>
                  {booking.sport} - {booking.date}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>Time: {booking.timeSlot}</p>
                <p>Status: {booking.status}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <h2 className="text-2xl font-bold mt-8 mb-4">Past Bookings</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pastBookings.map((booking) => (
            <Card key={booking._id} className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle>{booking.turf}</CardTitle>
                <CardDescription>
                  {booking.sport} - {booking.date}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p>Time: {booking.timeSlot}</p>
                <p>Status: {booking.status}</p>
                <Button variant="outline">Rate Booking</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
