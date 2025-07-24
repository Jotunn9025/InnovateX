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
  price: number;
  status?: string;
  bookings?: number;
  revenue?: number;
  rating?: number;
  [key: string]: any;
}

export default function AdminDashboard() {
  // your states and logic unchanged as per your original code

  return (
    <div className="min-h-screen bg-gray-900 text-green-300">
      {/* Header */}
      <header className="bg-green-900 border-b border-green-800 shadow-sm">
        <div className="container mx-auto px-6 py-5 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-green-400">
              Admin Dashboard
            </h1>
            <p className="text-green-300">Manage your turfs and bookings</p>
          </div>
          <div>
            <Button className="flex items-center bg-green-600 hover:bg-green-700">
              <Plus className="w-5 h-5 mr-2" />
              Add New Turf
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-10">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <Card className="bg-gray-800 border border-green-700 shadow">
            <CardHeader className="flex justify-between items-center pb-2">
              <CardTitle className="text-green-400 text-sm font-semibold">
                Total Revenue
              </CardTitle>
              <DollarSign className="h-5 w-5 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-extrabold text-green-400">
                ₹{totalRevenue}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border border-green-700 shadow">
            <CardHeader className="flex justify-between items-center pb-2">
              <CardTitle className="text-green-400 text-sm font-semibold">
                Total Bookings
              </CardTitle>
              <CalendarDays className="h-5 w-5 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-extrabold text-green-400">
                {totalBookings}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border border-green-700 shadow">
            <CardHeader className="flex justify-between items-center pb-2">
              <CardTitle className="text-green-400 text-sm font-semibold">
                Active Turfs
              </CardTitle>
              <MapPin className="h-5 w-5 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-extrabold text-green-400">
                {activeTurfs}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border border-green-700 shadow">
            <CardHeader className="flex justify-between items-center pb-2">
              <CardTitle className="text-green-400 text-sm font-semibold">
                Avg. Utilization
              </CardTitle>
              <TrendingUp className="h-5 w-5 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-extrabold text-green-400">
                {utilization}%
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="overview" className="space-y-8">
          <TabsList className="grid grid-cols-5 rounded-md border border-green-700 bg-gray-800">
            <TabsTrigger
              value="overview"
              className="text-green-400 data-[state=active]:bg-green-600 data-[state=active]:text-white"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="bookings"
              className="text-green-400 data-[state=active]:bg-green-600 data-[state=active]:text-white"
            >
              Bookings
            </TabsTrigger>
            <TabsTrigger
              value="turfs"
              className="text-green-400 data-[state=active]:bg-green-600 data-[state=active]:text-white"
            >
              Turfs
            </TabsTrigger>
            <TabsTrigger
              value="calendar"
              className="text-green-400 data-[state=active]:bg-green-600 data-[state=active]:text-white"
            >
              Calendar
            </TabsTrigger>
            <TabsTrigger
              value="analytics"
              className="text-green-400 data-[state=active]:bg-green-600 data-[state=active]:text-white"
            >
              Analytics
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Revenue Chart Card */}
              <Card className="bg-gray-800 border border-green-700 shadow">
                <CardHeader>
                  <CardTitle className="text-green-400">
                    Revenue Overview
                  </CardTitle>
                  <CardDescription className="text-green-300">
                    Monthly revenue and booking trends
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={revenueData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#065f46" />
                      <XAxis dataKey="month" stroke="#22c55e" />
                      <YAxis stroke="#22c55e" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#064e3b",
                          borderRadius: 6,
                        }}
                      />
                      <Bar dataKey="revenue" fill="#22c55e" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Sports Distribution Card */}
              <Card className="bg-gray-800 border border-green-700 shadow">
                <CardHeader>
                  <CardTitle className="text-green-400">
                    Sports Distribution
                  </CardTitle>
                  <CardDescription className="text-green-300">
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
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#064e3b",
                          borderRadius: 6,
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Recent Bookings */}
            <Card className="bg-gray-800 border border-green-700 shadow">
              <CardHeader>
                <CardTitle className="text-green-400">
                  Recent Bookings
                </CardTitle>
                <CardDescription className="text-green-300">
                  Latest booking requests and confirmations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {liveBookings.slice(0, 5).map((booking) => (
                    <div
                      key={booking._id}
                      className="flex items-center justify-between p-4 border border-green-700 rounded-lg hover:bg-green-900 transition"
                    >
                      <div className="flex items-center space-x-4">
                        <div>
                          <p className="font-semibold text-green-400">
                            {booking.user}
                          </p>
                          <p className="text-sm text-green-300">
                            {
                              myTurfs.find((turf) => turf._id === booking.turf)
                                ?.name
                            }
                          </p>
                        </div>
                        <div className="text-sm text-green-300">
                          <p>
                            {booking.date} • {booking.timeSlot}
                          </p>
                          <p>{booking.sport}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className="font-semibold text-green-400">
                          ₹
                          {
                            myTurfs.find((turf) => turf._id === booking.turf)
                              ?.price
                          }
                        </span>
                        <Badge
                          className={`px-3 py-1 rounded-full ${getStatusColor(
                            booking.status
                          )}`}
                        >
                          {booking.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Bookings Tab */}
          <TabsContent value="bookings" className="space-y-6">
            <Card className="bg-gray-800 border border-green-700 shadow">
              <CardHeader>
                <CardTitle className="text-green-400">All Bookings</CardTitle>
                <CardDescription className="text-green-300">
                  Manage all booking requests
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {liveBookings.map((booking) => (
                    <div
                      key={booking._id}
                      className="flex items-center justify-between p-4 border border-green-700 rounded-lg hover:bg-green-900 transition"
                    >
                      <div className="flex items-center space-x-4">
                        <div>
                          <p className="font-semibold text-green-400">
                            {booking.user}
                          </p>
                          <p className="text-sm text-green-300">
                            {
                              myTurfs.find((turf) => turf._id === booking.turf)
                                ?.name
                            }
                          </p>
                        </div>
                        <div className="text-sm text-green-300">
                          <p>
                            {booking.date} • {booking.timeSlot}
                          </p>
                          <p>{booking.sport}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className="font-semibold text-green-400">
                          ₹
                          {
                            myTurfs.find((turf) => turf._id === booking.turf)
                              ?.price
                          }
                        </span>
                        <Badge
                          className={`px-3 py-1 rounded-full ${getStatusColor(
                            booking.status
                          )}`}
                        >
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
                              className="border-green-600 text-green-400 hover:bg-green-700 hover:text-white"
                              onClick={() => handleApprove(booking._id)}
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-red-600 text-red-400 hover:bg-red-700 hover:text-white"
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

          {/* Turfs Tab */}
          <TabsContent value="turfs" className="space-y-6">
            <Card className="bg-gray-800 border border-green-700 shadow">
              <CardHeader>
                <CardTitle className="text-green-400">Manage Turfs</CardTitle>
                <CardDescription className="text-green-300">
                  Add, edit, or manage your sports venues
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {myTurfs.map((turf) => (
                    <div
                      key={turf._id}
                      className="flex items-center justify-between p-4 border border-green-700 rounded-lg hover:bg-green-900 transition"
                    >
                      <div className="flex items-center space-x-4">
                        <div>
                          <p className="font-semibold text-green-400">
                            {turf.name}
                          </p>
                          <p className="text-sm text-green-300">
                            {turf.location}
                          </p>
                        </div>
                        <Badge
                          className={`px-3 py-1 rounded-full ${getTurfStatusColor(
                            turf.status || ""
                          )}`}
                        >
                          {turf.status || "Unknown"}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-6">
                        <div className="text-center text-green-300 text-sm">
                          <p className="font-semibold">{turf.bookings ?? 0}</p>
                          <p>Bookings</p>
                        </div>
                        <div className="text-center text-green-300 text-sm">
                          <p className="font-semibold">
                            ₹{(turf.revenue ?? 0).toLocaleString()}
                          </p>
                          <p>Revenue</p>
                        </div>
                        <div className="text-center text-green-300 text-sm">
                          <p className="font-semibold">
                            {turf.rating ?? "N/A"}
                          </p>
                          <p>Rating</p>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-green-600 text-green-400 hover:bg-green-700 hover:text-white"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-red-600 text-red-400 hover:bg-red-700 hover:text-white"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6">
                  <h3 className="text-xl font-semibold text-green-400 mb-4">
                    Add New Turf
                  </h3>
                  <form
                    onSubmit={handleAddTurf}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                  >
                    <input
                      type="text"
                      placeholder="Turf Name"
                      value={newTurf.name}
                      onChange={(e) =>
                        setNewTurf({ ...newTurf, name: e.target.value })
                      }
                      className="p-3 rounded-md border border-green-600 bg-gray-800 text-green-300 placeholder-green-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                      required
                    />
                    <input
                      type="text"
                      placeholder="Location (e.g., Mumbai)"
                      value={newTurf.location}
                      onChange={(e) =>
                        setNewTurf({ ...newTurf, location: e.target.value })
                      }
                      className="p-3 rounded-md border border-green-600 bg-gray-800 text-green-300 placeholder-green-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                      required
                    />
                    <input
                      type="text"
                      placeholder="Full Address"
                      value={newTurf.fullAddress}
                      onChange={(e) =>
                        setNewTurf({ ...newTurf, fullAddress: e.target.value })
                      }
                      className="p-3 rounded-md border border-green-600 bg-gray-800 text-green-300 placeholder-green-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                      required
                    />
                    <input
                      type="number"
                      placeholder="Price per hour"
                      value={newTurf.price}
                      onChange={(e) =>
                        setNewTurf({ ...newTurf, price: e.target.value })
                      }
                      className="p-3 rounded-md border border-green-600 bg-gray-800 text-green-300 placeholder-green-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                      min={0}
                      required
                    />
                    <Button
                      type="submit"
                      className="md:col-span-2 bg-green-600 hover:bg-green-700"
                    >
                      Add Turf
                    </Button>
                  </form>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Calendar Tab */}
          <TabsContent value="calendar" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="bg-gray-800 border border-green-700 shadow lg:col-span-1">
                <CardHeader>
                  <CardTitle className="text-green-400">Select Date</CardTitle>
                </CardHeader>
                <CardContent>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    className="rounded-md border border-green-600"
                  />
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border border-green-700 shadow lg:col-span-2">
                <CardHeader>
                  <CardTitle className="text-green-400">
                    Daily Schedule
                  </CardTitle>
                  <CardDescription className="text-green-300">
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
                        className="flex items-center justify-between p-3 bg-green-900 rounded-lg"
                      >
                        <div className="flex items-center space-x-4">
                          <Clock className="w-5 h-5 text-green-400" />
                          <div>
                            <p className="font-semibold text-green-300">
                              {slot.time}
                            </p>
                            <p className="text-green-400 text-sm">
                              {slot.turf}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-green-300">
                            {slot.customer}
                          </p>
                          <p className="text-green-400 text-sm">{slot.sport}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-gray-800 border border-green-700 shadow">
                <CardHeader>
                  <CardTitle className="text-green-400">
                    Booking Trends
                  </CardTitle>
                  <CardDescription className="text-green-300">
                    Daily booking patterns over time
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={revenueData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#065f46" />
                      <XAxis dataKey="month" stroke="#22c55e" />
                      <YAxis stroke="#22c55e" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#064e3b",
                          borderRadius: 6,
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="bookings"
                        stroke="#22c55e"
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border border-green-700 shadow">
                <CardHeader>
                  <CardTitle className="text-green-400">Peak Hours</CardTitle>
                  <CardDescription className="text-green-300">
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
                        className="flex items-center justify-between"
                      >
                        <span className="text-green-400 font-semibold">
                          {slot.time}
                        </span>
                        <div className="flex items-center space-x-3">
                          <div className="w-32 bg-green-800 rounded-full h-2">
                            <div
                              className="bg-green-500 h-2 rounded-full"
                              style={{ width: `${slot.percentage}%` }}
                            ></div>
                          </div>
                          <span className="text-green-300 text-sm">
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              <Card className="bg-gray-800 border border-green-700 shadow">
                <CardHeader>
                  <CardTitle className="text-green-400">
                    Occupancy Rate
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-extrabold text-green-500">
                    78%
                  </div>
                  <p className="text-green-300 mt-2">
                    Average across all turfs
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border border-green-700 shadow">
                <CardHeader>
                  <CardTitle className="text-green-400">
                    Customer Satisfaction
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-extrabold text-green-500">
                    4.7
                  </div>
                  <p className="text-green-300 mt-2">Average rating</p>
                </CardContent>
              </Card>

              <Card className="bg-gray-800 border border-green-700 shadow">
                <CardHeader>
                  <CardTitle className="text-green-400">
                    Repeat Customers
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-extrabold text-green-500">
                    65%
                  </div>
                  <p className="text-green-300 mt-2">Return booking rate</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
