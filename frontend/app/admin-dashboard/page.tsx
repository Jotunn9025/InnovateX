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
  AreaChart,
  Area,
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
  Users,
  Eye,
  Star,
  Activity,
  TrendingDown,
} from "lucide-react";

export default function AdminDashboard() {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );

  // Sample data with net profit focus
  const revenueData = [
    {
      month: "Jan",
      revenue: 45000,
      expenses: 32000,
      profit: 13000,
      bookings: 120,
    },
    {
      month: "Feb",
      revenue: 52000,
      expenses: 35000,
      profit: 17000,
      bookings: 140,
    },
    {
      month: "Mar",
      revenue: 48000,
      expenses: 33000,
      profit: 15000,
      bookings: 130,
    },
    {
      month: "Apr",
      revenue: 61000,
      expenses: 40000,
      profit: 21000,
      bookings: 165,
    },
    {
      month: "May",
      revenue: 55000,
      expenses: 38000,
      profit: 17000,
      bookings: 150,
    },
    {
      month: "Jun",
      revenue: 67000,
      expenses: 42000,
      profit: 25000,
      bookings: 180,
    },
  ];

  const profitTrend = [
    { month: "Jan", netProfit: 13000 },
    { month: "Feb", netProfit: 17000 },
    { month: "Mar", netProfit: 15000 },
    { month: "Apr", netProfit: 21000 },
    { month: "May", netProfit: 17000 },
    { month: "Jun", netProfit: 25000 },
  ];

  const myTurfs = [
    {
      id: 1,
      name: "Elite Sports Arena",
      location: "Downtown, Mumbai",
      status: "Active",
      bookings: 45,
      revenue: 54000,
      expenses: 35000,
      profit: 19000,
      rating: 4.8,
      lastBooking: {
        customer: "Rahul Sharma",
        date: "2024-12-15",
        time: "18:00 - 19:00",
        sport: "Football",
      },
    },
    {
      id: 2,
      name: "Champions Ground",
      location: "Bandra, Mumbai",
      status: "Active",
      bookings: 38,
      revenue: 38000,
      expenses: 28000,
      profit: 10000,
      rating: 4.6,
      lastBooking: {
        customer: "Priya Patel",
        date: "2024-12-15",
        time: "16:00 - 17:00",
        sport: "Cricket",
      },
    },
    {
      id: 3,
      name: "Victory Courts",
      location: "Andheri, Mumbai",
      status: "Maintenance",
      bookings: 0,
      revenue: 0,
      expenses: 5000,
      profit: -5000,
      rating: 4.9,
      lastBooking: {
        customer: "Sneha Reddy",
        date: "2024-12-10",
        time: "17:00 - 18:00",
        sport: "Tennis",
      },
    },
    {
      id: 4,
      name: "Premier Fields",
      location: "Powai, Mumbai",
      status: "Active",
      bookings: 52,
      revenue: 62000,
      expenses: 38000,
      profit: 24000,
      rating: 4.7,
      lastBooking: {
        customer: "Team Alpha",
        date: "2024-12-15",
        time: "20:00 - 21:00",
        sport: "Football",
      },
    },
  ];

  const pendingBookings = [
    {
      id: 1,
      customer: "Rohit Verma",
      phone: "+91 98765 43210",
      turf: "Elite Sports Arena",
      date: "2024-12-16",
      time: "18:00 - 19:00",
      sport: "Football",
      amount: 1200,
      status: "Pending",
      submittedAt: "2 hours ago",
    },
    {
      id: 2,
      customer: "Priya Singh",
      phone: "+91 87654 32109",
      turf: "Champions Ground",
      date: "2024-12-17",
      time: "16:00 - 18:00",
      sport: "Cricket",
      amount: 2000,
      status: "Pending",
      submittedAt: "4 hours ago",
    },
    {
      id: 3,
      customer: "Team Warriors",
      phone: "+91 76543 21098",
      turf: "Premier Fields",
      date: "2024-12-18",
      time: "19:00 - 20:00",
      sport: "Football",
      amount: 1400,
      status: "Pending",
      submittedAt: "1 day ago",
    },
  ];

  const allBookings = [
    {
      id: 1,
      customer: "Rahul Sharma",
      turf: "Elite Sports Arena",
      date: "2024-12-15",
      time: "18:00 - 19:00",
      sport: "Football",
      amount: 1200,
      status: "Confirmed",
    },
    {
      id: 2,
      customer: "Priya Patel",
      turf: "Champions Ground",
      date: "2024-12-15",
      time: "16:00 - 17:00",
      sport: "Cricket",
      amount: 1000,
      status: "Confirmed",
    },
    {
      id: 3,
      customer: "Amit Kumar",
      turf: "Elite Sports Arena",
      date: "2024-12-16",
      time: "19:00 - 20:00",
      sport: "Football",
      amount: 1200,
      status: "Confirmed",
    },
    {
      id: 4,
      customer: "Sneha Reddy",
      turf: "Victory Courts",
      date: "2024-12-10",
      time: "17:00 - 18:00",
      sport: "Tennis",
      amount: 800,
      status: "Cancelled",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Confirmed":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "Pending":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "Cancelled":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const getTurfStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "Maintenance":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "Inactive":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const handleApproveBooking = (bookingId: number) => {
    console.log(`Approved booking ${bookingId}`);
    // Handle approval logic here
  };

  const handleRejectBooking = (bookingId: number) => {
    console.log(`Rejected booking ${bookingId}`);
    // Handle rejection logic here
  };

  const totalProfit = myTurfs.reduce((sum, turf) => sum + turf.profit, 0);
  const activeTurfs = myTurfs.filter((turf) => turf.status === "Active").length;
  const totalBookings = myTurfs.reduce((sum, turf) => sum + turf.bookings, 0);
  const avgRating =
    myTurfs.reduce((sum, turf) => sum + turf.rating, 0) / myTurfs.length;

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100">
      {/* Header */}
      <header className="bg-gray-900/50 border-b border-gray-800 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">
                Turf Admin Dashboard
              </h1>
              <p className="text-gray-400 mt-1">
                Manage your turfs and track performance
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Button className="bg-green-600 hover:bg-green-700 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Add New Turf
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">
                Total Net Profit
              </CardTitle>
              <TrendingUp className="h-5 w-5 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-400">
                ₹{totalProfit.toLocaleString()}
              </div>
              <p className="text-xs text-gray-400 mt-1">
                <span className="text-green-400">+18.2%</span> from last month
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">
                Total Bookings
              </CardTitle>
              <CalendarDays className="h-5 w-5 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {totalBookings}
              </div>
              <p className="text-xs text-gray-400 mt-1">
                <span className="text-green-400">+8.2%</span> from last month
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">
                Active Turfs
              </CardTitle>
              <MapPin className="h-5 w-5 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{activeTurfs}</div>
              <p className="text-xs text-gray-400 mt-1">
                <span className="text-yellow-400">
                  {myTurfs.length - activeTurfs}
                </span>{" "}
                under maintenance
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">
                Average Rating
              </CardTitle>
              <Star className="h-5 w-5 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {avgRating.toFixed(1)}
              </div>
              <p className="text-xs text-gray-400 mt-1">
                <span className="text-green-400">+0.3</span> from last month
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-gray-900/50 border-gray-800">
            <TabsTrigger
              value="overview"
              className="data-[state=active]:bg-green-600 data-[state=active]:text-white"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="bookings"
              className="data-[state=active]:bg-green-600 data-[state=active]:text-white"
            >
              All Bookings
            </TabsTrigger>
            <TabsTrigger
              value="pending"
              className="data-[state=active]:bg-green-600 data-[state=active]:text-white"
            >
              Pending Approvals
              {pendingBookings.length > 0 && (
                <Badge className="ml-2 bg-red-500 text-white text-xs">
                  {pendingBookings.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger
              value="turfs"
              className="data-[state=active]:bg-green-600 data-[state=active]:text-white"
            >
              My Turfs
            </TabsTrigger>
            <TabsTrigger
              value="analytics"
              className="data-[state=active]:bg-green-600 data-[state=active]:text-white"
            >
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Profit Chart */}
              <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white">
                    Net Profit Overview
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Monthly profit after expenses
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={profitTrend}>
                      <defs>
                        <linearGradient
                          id="profitGradient"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#10B981"
                            stopOpacity={0.3}
                          />
                          <stop
                            offset="95%"
                            stopColor="#10B981"
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="month" stroke="#9CA3AF" />
                      <YAxis stroke="#9CA3AF" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1F2937",
                          border: "1px solid #374151",
                          borderRadius: "8px",
                          color: "#F3F4F6",
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="netProfit"
                        stroke="#10B981"
                        strokeWidth={2}
                        fill="url(#profitGradient)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Revenue vs Expenses */}
              <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white">
                    Revenue vs Expenses
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Monthly breakdown of income and costs
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={revenueData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="month" stroke="#9CA3AF" />
                      <YAxis stroke="#9CA3AF" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1F2937",
                          border: "1px solid #374151",
                          borderRadius: "8px",
                          color: "#F3F4F6",
                        }}
                      />
                      <Bar dataKey="revenue" fill="#10B981" name="Revenue" />
                      <Bar dataKey="expenses" fill="#EF4444" name="Expenses" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">Recent Bookings</CardTitle>
                <CardDescription className="text-gray-400">
                  Latest confirmed bookings across all turfs
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {allBookings.slice(0, 5).map((booking) => (
                    <div
                      key={booking.id}
                      className="flex items-center justify-between p-4 bg-gray-800/50 border border-gray-700 rounded-lg"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-green-600/20 rounded-full flex items-center justify-center">
                          <Users className="w-5 h-5 text-green-400" />
                        </div>
                        <div>
                          <p className="font-medium text-white">
                            {booking.customer}
                          </p>
                          <p className="text-sm text-gray-400">
                            {booking.turf}
                          </p>
                        </div>
                        <div className="text-sm text-gray-400">
                          <p>
                            {booking.date} • {booking.time}
                          </p>
                          <p>{booking.sport}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className="font-semibold text-green-400">
                          ₹{booking.amount}
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

          <TabsContent value="pending" className="space-y-6">
            <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Activity className="w-5 h-5 mr-2 text-yellow-500" />
                  Pending Booking Approvals
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Review and approve booking requests
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pendingBookings.map((booking) => (
                    <div
                      key={booking.id}
                      className="flex items-center justify-between p-5 bg-gray-800/50 border border-yellow-500/30 rounded-lg hover:bg-gray-800/70 transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center">
                          <Clock className="w-6 h-6 text-yellow-400" />
                        </div>
                        <div>
                          <p className="font-semibold text-white">
                            {booking.customer}
                          </p>
                          <p className="text-sm text-gray-400">
                            {booking.phone}
                          </p>
                          <p className="text-sm text-gray-400">
                            {booking.turf} • {booking.sport}
                          </p>
                        </div>
                        <div className="text-sm text-gray-400">
                          <p className="font-medium text-white">
                            {booking.date}
                          </p>
                          <p>{booking.time}</p>
                          <p className="text-xs text-yellow-400">
                            Submitted {booking.submittedAt}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className="font-bold text-green-400 text-lg">
                          ₹{booking.amount}
                        </span>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700 text-white"
                            onClick={() => handleApproveBooking(booking.id)}
                          >
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-red-500 text-red-400 hover:bg-red-500/20"
                            onClick={() => handleRejectBooking(booking.id)}
                          >
                            <XCircle className="w-4 h-4 mr-1" />
                            Reject
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {pendingBookings.length === 0 && (
                    <div className="text-center py-12">
                      <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                      <p className="text-gray-400 text-lg">
                        No pending approvals
                      </p>
                      <p className="text-gray-500 text-sm">
                        All booking requests have been processed
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="turfs" className="space-y-6">
            <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">My Turfs</CardTitle>
                <CardDescription className="text-gray-400">
                  Manage your sports venues and view performance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {myTurfs.map((turf) => (
                    <div
                      key={turf.id}
                      className="p-6 bg-gray-800/50 border border-gray-700 rounded-lg hover:bg-gray-800/70 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="font-bold text-lg text-white">
                            {turf.name}
                          </h3>
                          <p className="text-gray-400 text-sm flex items-center mt-1">
                            <MapPin className="w-4 h-4 mr-1" />
                            {turf.location}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={getTurfStatusColor(turf.status)}>
                            {turf.status}
                          </Badge>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-gray-600 hover:bg-gray-700"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4 mb-4">
                        <div className="text-center">
                          <p className="text-2xl font-bold text-green-400">
                            ₹{turf.profit.toLocaleString()}
                          </p>
                          <p className="text-xs text-gray-400">Net Profit</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-white">
                            {turf.bookings}
                          </p>
                          <p className="text-xs text-gray-400">Bookings</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-yellow-400">
                            {turf.rating}
                          </p>
                          <p className="text-xs text-gray-400">Rating</p>
                        </div>
                      </div>

                      <div className="border-t border-gray-700 pt-4">
                        <p className="text-sm text-gray-400 mb-2">
                          Last Booking:
                        </p>
                        <div className="flex items-center justify-between bg-gray-700/50 rounded-lg p-3">
                          <div>
                            <p className="font-medium text-white">
                              {turf.lastBooking.customer}
                            </p>
                            <p className="text-xs text-gray-400">
                              {turf.lastBooking.sport}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-white">
                              {turf.lastBooking.date}
                            </p>
                            <p className="text-xs text-gray-400">
                              {turf.lastBooking.time}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bookings" className="space-y-6">
            <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">All Bookings</CardTitle>
                <CardDescription className="text-gray-400">
                  Complete booking history
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {allBookings.map((booking) => (
                    <div
                      key={booking.id}
                      className="flex items-center justify-between p-4 bg-gray-800/50 border border-gray-700 rounded-lg"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-blue-600/20 rounded-full flex items-center justify-center">
                          <Users className="w-5 h-5 text-blue-400" />
                        </div>
                        <div>
                          <p className="font-medium text-white">
                            {booking.customer}
                          </p>
                          <p className="text-sm text-gray-400">
                            {booking.turf}
                          </p>
                        </div>
                        <div className="text-sm text-gray-400">
                          <p>
                            {booking.date} • {booking.time}
                          </p>
                          <p>{booking.sport}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className="font-semibold text-green-400">
                          ₹{booking.amount}
                        </span>
                        <Badge className={getStatusColor(booking.status)}>
                          {booking.status}
                        </Badge>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-gray-600 hover:bg-gray-700"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white">Booking Trends</CardTitle>
                  <CardDescription className="text-gray-400">
                    Monthly booking patterns
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={revenueData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="month" stroke="#9CA3AF" />
                      <YAxis stroke="#9CA3AF" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1F2937",
                          border: "1px solid #374151",
                          borderRadius: "8px",
                          color: "#F3F4F6",
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="bookings"
                        stroke="#10B981"
                        strokeWidth={3}
                        dot={{ fill: "#10B981", strokeWidth: 2, r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white">Peak Hours</CardTitle>
                  <CardDescription className="text-gray-400">
                    Most popular booking times
                  </CardDescription>
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
                        className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg"
                      >
                        <span className="text-sm font-medium text-white">
                          {slot.time}
                        </span>
                        <div className="flex items-center space-x-3">
                          <div className="w-32 bg-gray-700 rounded-full h-2">
                            <div
                              className="bg-green-500 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${slot.percentage}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-400 min-w-[80px]">
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
              <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white">Profit Margin</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-400">32%</div>
                  <p className="text-sm text-gray-400 mt-2">
                    Average across all turfs
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white">
                    Customer Satisfaction
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-yellow-400">4.7</div>
                  <p className="text-sm text-gray-400 mt-2">Average rating</p>
                </CardContent>
              </Card>

              <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white">Repeat Customers</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-purple-400">65%</div>
                  <p className="text-sm text-gray-400 mt-2">
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
