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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  CalendarDays,
  DollarSign,
  TrendingUp,
  Clock,
  MapPin,
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
} from "lucide-react";
// @ts-ignore
import io, { Socket } from "socket.io-client";
import { useUser } from "@/contexts/UserContext";
import axios from "axios";

interface Booking {
  _id: string;
  user: string;
  turf: string;
  sport: string;
  date: string;
  timeSlot: string;
  status: string;
}
interface Turf {
  _id: string;
  name: string;
  location: string;
  fullAddress: string;
  prices: number[][];
  lowestPrice: number;
  [key: string]: any;
}

export default function AdminDashboard() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );
  const [liveBookings, setLiveBookings] = useState<Booking[]>([]);
  const socketRef = useRef<Socket | null>(null);
  const { user } = useUser();
  // For adding a new turf
  const [newTurf, setNewTurf] = useState({
    name: "",
    location: "",
    fullAddress: "",
  });
  const [myTurfs, setMyTurfs] = useState<Turf[]>([]);

  useEffect(() => {
    if (!user) return;
    const socket = io("http://localhost:5000");
    socketRef.current = socket;
    socket.emit("register", {
      userId: user.id,
      userType: user.userType,
      email: user.email,
    });
    socket.on("new-booking", ({ booking }: { booking: Booking }) => {
      setLiveBookings((prev) => [booking, ...prev]);
    });
    // Fetch my turfs
    axios
      .get(`http://localhost:5000/api/turfs?owner=${user.id}`)
      .then((res) =>
        setMyTurfs(res.data.turfs.filter((t: Turf) => t.owner === user.id))
      );
    // Fetch all bookings for my turfs
    axios
      .get(`http://localhost:5000/api/bookings/admin?ownerId=${user.id}`)
      .then((res) => setLiveBookings(res.data.bookings));
    return () => {
      socket.disconnect();
    };
  }, [user]);

  const handleApprove = (bookingId: string) => {
    if (socketRef.current) {
      socketRef.current.emit("approve-booking", { bookingId });
      setLiveBookings((prev) =>
        prev.map((b) =>
          b._id === bookingId ? { ...b, status: "approved" } : b
        )
      );
    }
  };
  const handleReject = (bookingId: string) => {
    if (socketRef.current) {
      socketRef.current.emit("reject-booking", { bookingId });
      setLiveBookings((prev) =>
        prev.map((b) =>
          b._id === bookingId ? { ...b, status: "rejected" } : b
        )
      );
    }
  };

  const handleAddTurf = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const res = await axios.post("http://localhost:5000/api/turfs", {
      ...newTurf,
      owner: user.id,
    });
    setMyTurfs((prev) => [...prev, res.data.turf]);
    setNewTurf({ name: "", location: "", fullAddress: "" });
  };

  // Calculate dynamic stats
  const totalBookings = liveBookings.length;
  const totalRevenue = liveBookings.reduce((sum, b) => {
    const turf = myTurfs.find((t) => t._id === t._id);
    return sum + (turf ? turf.price : 0);
  }, 0);
  const activeTurfs = myTurfs.length;
  // Example utilization: bookings per turf per day (simple version)
  const utilization =
    activeTurfs > 0 ? Math.round((totalBookings / activeTurfs) * 10) : 0;

  // Analytics: group bookings by month and sport
  const revenueByMonth: { [month: string]: number } = {};
  const bookingsByMonth: { [month: string]: number } = {};
  const sportsCount: { [sport: string]: number } = {};
  liveBookings.forEach((b) => {
    const month = new Date(b.date).toLocaleString("default", {
      month: "short",
    });
    revenueByMonth[month] =
      (revenueByMonth[month] || 0) +
      (myTurfs.find((t) => t._id === b.turf)?.price || 0);
    bookingsByMonth[month] = (bookingsByMonth[month] || 0) + 1;
    sportsCount[b.sport] = (sportsCount[b.sport] || 0) + 1;
  });
  const revenueData = Object.keys(revenueByMonth).map((month) => ({
    month,
    revenue: revenueByMonth[month],
    bookings: bookingsByMonth[month],
  }));
  const sportsData = Object.keys(sportsCount).map((sport) => ({
    name: sport,
    value: sportsCount[sport],
    color: "#10B981",
  }));

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Confirmed":
        return "bg-green-100 text-green-800";
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTurfStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800";
      case "Maintenance":
        return "bg-yellow-100 text-yellow-800";
      case "Inactive":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
              <p className="text-gray-300">Manage your turfs and bookings</p>
            </div>
            <div className="flex items-center space-x-3">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add New Turf
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Revenue
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{totalRevenue}</div>
              <p className="text-xs text-muted-foreground">
                {/* You can add a dynamic comparison here if needed */}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Bookings
              </CardTitle>
              <CalendarDays className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalBookings}</div>
              <p className="text-xs text-muted-foreground">
                {/* You can add a dynamic comparison here if needed */}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Turfs
              </CardTitle>
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeTurfs}</div>
              <p className="text-xs text-muted-foreground">
                {/* You can add a dynamic comparison here if needed */}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Avg. Utilization
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{utilization}%</div>
              <p className="text-xs text-muted-foreground">
                {/* You can add a dynamic comparison here if needed */}
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="turfs">Turfs</TabsTrigger>
            <TabsTrigger value="calendar">Calendar</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Revenue Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Overview</CardTitle>
                  <CardDescription>
                    Monthly revenue and booking trends
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={revenueData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="revenue" fill="#10B981" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Sports Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle>Sports Distribution</CardTitle>
                  <CardDescription>
                    Booking distribution by sport type
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={sportsData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}`}
                      >
                        {sportsData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Recent Bookings */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Bookings</CardTitle>
                <CardDescription>
                  Latest booking requests and confirmations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {liveBookings.slice(0, 5).map((booking) => (
                    <div
                      key={booking._id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center space-x-4">
                        <div>
                          <p className="font-medium">{booking.user}</p>
                          <p className="text-sm text-gray-600">
                            {
                              myTurfs.find((turf) => turf._id === booking.turf)
                                ?.name
                            }
                          </p>
                        </div>
                        <div className="text-sm text-gray-600">
                          <p>
                            {booking.date} • {booking.timeSlot}
                          </p>
                          <p>{booking.sport}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className="font-semibold">
                          ₹
                          {
                            myTurfs.find((turf) => turf._id === booking.turf)
                              ?.price
                          }
                        </span>
                        <Badge className={getStatusColor(booking.status)}>
                          {booking.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bookings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>All Bookings</CardTitle>
                <CardDescription>Manage all booking requests</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {liveBookings.map((booking) => (
                    <div
                      key={booking._id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center space-x-4">
                        <div>
                          <p className="font-medium">{booking.user}</p>
                          <p className="text-sm text-gray-600">
                            {
                              myTurfs.find((turf) => turf._id === booking.turf)
                                ?.name
                            }
                          </p>
                        </div>
                        <div className="text-sm text-gray-600">
                          <p>
                            {booking.date} • {booking.timeSlot}
                          </p>
                          <p>{booking.sport}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className="font-semibold">
                          ₹
                          {
                            myTurfs.find((turf) => turf._id === booking.turf)
                              ?.price
                          }
                        </span>
                        <Badge className={getStatusColor(booking.status)}>
                          {booking.status === "waiting for approval"
                            ? "Waiting for Approval"
                            : booking.status.charAt(0).toUpperCase() +
                              booking.status.slice(1)}
                        </Badge>
                        {booking.status === "waiting for approval" && (
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleApprove(booking._id)}
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleReject(booking._id)}
                            >
                              <XCircle className="w-4 h-4 mr-1" />
                              Reject
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="turfs" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Manage Turfs</CardTitle>
                <CardDescription>
                  Add, edit, or manage your sports venues
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {myTurfs.map((turf) => (
                    <div
                      key={turf._id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center space-x-4">
                        <div>
                          <p className="font-medium">{turf.name}</p>
                          <p className="text-sm text-gray-600">
                            {turf.location}
                          </p>
                        </div>
                        <Badge className={getTurfStatusColor(turf.status)}>
                          {turf.status}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-6">
                        <div className="text-sm text-gray-600 text-center">
                          <p className="font-medium">{turf.bookings}</p>
                          <p>Bookings</p>
                        </div>
                        <div className="text-sm text-gray-600 text-center">
                          <p className="font-medium">
                            ₹{(turf.revenue ?? 0).toLocaleString()}
                          </p>
                          <p>Revenue</p>
                        </div>
                        <div className="text-sm text-gray-600 text-center">
                          <p className="font-medium">{turf.rating}</p>
                          <p>Rating</p>
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-2">Add New Turf</h3>
                  <a href="/admin/add-turf">
                    <Button className="w-full md:col-span-2">
                      Add New Turf
                    </Button>
                  </a>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="calendar" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-1">
                <CardHeader>
                  <CardTitle>Select Date</CardTitle>
                </CardHeader>
                <CardContent>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    className="rounded-md border"
                  />
                </CardContent>
              </Card>

              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Daily Schedule</CardTitle>
                  <CardDescription>
                    {selectedDate
                      ? selectedDate.toDateString()
                      : "Select a date to view schedule"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      {
                        time: "09:00 - 10:00",
                        turf: "Elite Sports Arena",
                        sport: "Football",
                        customer: "Team Alpha",
                      },
                      {
                        time: "10:00 - 11:00",
                        turf: "Champions Ground",
                        sport: "Cricket",
                        customer: "Mumbai Warriors",
                      },
                      {
                        time: "11:00 - 12:00",
                        turf: "Victory Courts",
                        sport: "Tennis",
                        customer: "John Doe",
                      },
                      {
                        time: "14:00 - 15:00",
                        turf: "Elite Sports Arena",
                        sport: "Football",
                        customer: "Team Beta",
                      },
                      {
                        time: "16:00 - 17:00",
                        turf: "Champions Ground",
                        sport: "Cricket",
                        customer: "Local Club",
                      },
                      {
                        time: "18:00 - 19:00",
                        turf: "Elite Sports Arena",
                        sport: "Football",
                        customer: "Team Gamma",
                      },
                    ].map((slot, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center space-x-4">
                          <Clock className="w-4 h-4 text-gray-500" />
                          <div>
                            <p className="font-medium">{slot.time}</p>
                            <p className="text-sm text-gray-600">{slot.turf}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{slot.customer}</p>
                          <p className="text-sm text-gray-600">{slot.sport}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Booking Trends</CardTitle>
                  <CardDescription>
                    Daily booking patterns over time
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={revenueData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="bookings"
                        stroke="#10B981"
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Peak Hours</CardTitle>
                  <CardDescription>Most popular booking times</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { time: "18:00 - 19:00", bookings: 45, percentage: 85 },
                      { time: "19:00 - 20:00", bookings: 42, percentage: 80 },
                      { time: "17:00 - 18:00", bookings: 38, percentage: 72 },
                      { time: "20:00 - 21:00", bookings: 35, percentage: 67 },
                      { time: "16:00 - 17:00", bookings: 28, percentage: 53 },
                    ].map((slot, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between"
                      >
                        <span className="text-sm font-medium">{slot.time}</span>
                        <div className="flex items-center space-x-3">
                          <div className="w-32 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-green-600 h-2 rounded-full"
                              style={{ width: `${slot.percentage}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-600">
                            {slot.bookings} bookings
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Performance Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Occupancy Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600">78%</div>
                  <p className="text-sm text-gray-600 mt-2">
                    Average across all turfs
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Customer Satisfaction</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-600">4.7</div>
                  <p className="text-sm text-gray-600 mt-2">Average rating</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Repeat Customers</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-purple-600">65%</div>
                  <p className="text-sm text-gray-600 mt-2">
                    Return booking rate
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
