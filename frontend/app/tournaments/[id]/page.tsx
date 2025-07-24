"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Trophy,
  Calendar,
  MapPin,
  Users,
  DollarSign,
  Clock,
  ArrowLeft,
  Phone,
  Mail,
  Globe,
  Share2,
  Heart,
  AlertCircle,
  CheckCircle,
  User,
  Shield,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useUser } from "@/contexts/UserContext";

interface RegistrationData {
  teamName: string;
  captainName: string;
  captainPhone: string;
  captainEmail: string;
  playerCount: string;
  experience: string;
  specialRequests: string;
}

interface Tournament {
  id: string;
  name: string;
  sport: string;
  date: string;
  startDate: string;
  location: string;
  fullAddress: string;
  prize: string;
  prizeAmount: number;
  teams: number;
  maxTeams: number;
  registrationFee: string;
  status: string;
  image: string;
  organizer: string;
  organizerContact: {
    phone: string;
    email: string;
    website: string;
  };
  description: string;
  format: string;
  difficulty: string;
  registrationDeadline: string;
  rules: string[];
  schedule: Array<{
    date: string;
    matches: string;
    time: string;
  }>;
  prizeDistribution: Array<{
    position: string;
    amount: string;
  }>;
  facilities: string[];
  registeredTeams: Array<{
    name: string;
    captain: string;
    experience: string;
  }>;
}

export default function TournamentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user, setUser } = useUser();
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [registrationData, setRegistrationData] = useState<RegistrationData>({
    teamName: "",
    captainName: "",
    captainPhone: "",
    captainEmail: "",
    playerCount: "",
    experience: "",
    specialRequests: "",
  });

  // Mock tournament data - in real app, this would come from API
  const tournaments: Tournament[] = [
    {
      id: "1",
      name: "Mumbai Football Championship",
      sport: "Football",
      date: "Jan 15-17, 2025",
      startDate: "2025-01-15",
      location: "Multiple venues, Mumbai",
      fullAddress: "Cooperage Ground, Oval Maidan, Mumbai - 400001",
      prize: "₹1,00,000",
      prizeAmount: 100000,
      teams: 16,
      maxTeams: 32,
      registrationFee: "₹5,000",
      status: "Open",
      image: "/placeholder.svg?height=400&width=600&text=Football+Championship",
      organizer: "Mumbai Sports Club",
      organizerContact: {
        phone: "+91 98765 43210",
        email: "info@mumbaisportsclub.com",
        website: "www.mumbaisportsclub.com",
      },
      description:
        "Premier football tournament featuring the best teams from Mumbai and surrounding areas. This championship brings together professional and semi-professional teams for an exciting 3-day tournament.",
      format: "Knockout",
      difficulty: "Professional",
      registrationDeadline: "Jan 10, 2025",
      rules: [
        "11-a-side football matches",
        "90 minutes per match (45 min each half)",
        "Maximum 18 players per squad",
        "Minimum 3 substitutions allowed",
        "Yellow and red card system applies",
        "FIFA standard equipment required",
      ],
      schedule: [
        { date: "Jan 15", matches: "Round of 32", time: "9:00 AM - 6:00 PM" },
        {
          date: "Jan 16",
          matches: "Round of 16 & Quarter Finals",
          time: "10:00 AM - 8:00 PM",
        },
        {
          date: "Jan 17",
          matches: "Semi Finals & Final",
          time: "2:00 PM - 8:00 PM",
        },
      ],
      prizeDistribution: [
        { position: "Winner", amount: "₹60,000" },
        { position: "Runner-up", amount: "₹25,000" },
        { position: "3rd Place", amount: "₹10,000" },
        { position: "Best Player", amount: "₹5,000" },
      ],
      facilities: [
        "Professional referees",
        "Medical support on-site",
        "Live streaming",
        "Photography coverage",
        "Refreshments for players",
        "Parking available",
      ],
      registeredTeams: [
        {
          name: "Mumbai United FC",
          captain: "Rahul Sharma",
          experience: "5 years",
        },
        {
          name: "Coastal Warriors",
          captain: "Arjun Patel",
          experience: "3 years",
        },
        {
          name: "City Strikers",
          captain: "Vikram Singh",
          experience: "7 years",
        },
        {
          name: "Thunder Bolts FC",
          captain: "Amit Kumar",
          experience: "4 years",
        },
      ],
    },
    {
      id: "2",
      name: "Tennis Masters Cup",
      sport: "Tennis",
      date: "Jan 20-22, 2025",
      startDate: "2025-01-20",
      location: "Elite Tennis Academy",
      fullAddress: "Elite Tennis Academy, Bandra West, Mumbai - 400050",
      prize: "₹50,000",
      prizeAmount: 50000,
      teams: 8,
      maxTeams: 16,
      registrationFee: "₹2,000",
      status: "Open",
      image: "/placeholder.svg?height=400&width=600&text=Tennis+Masters",
      organizer: "Tennis Federation Mumbai",
      organizerContact: {
        phone: "+91 98765 43211",
        email: "info@tennisfedmumbai.com",
        website: "www.tennisfedmumbai.com",
      },
      description:
        "Singles and doubles tennis tournament for advanced players. This prestigious tournament attracts the best tennis talent from across the region.",
      format: "Round Robin + Knockout",
      difficulty: "Advanced",
      registrationDeadline: "Jan 15, 2025",
      rules: [
        "Singles and doubles categories",
        "Best of 3 sets format",
        "Standard ITF rules apply",
        "Professional umpires provided",
        "Players must bring own rackets",
        "Dress code: All white attire",
      ],
      schedule: [
        {
          date: "Jan 20",
          matches: "Round Robin Matches",
          time: "8:00 AM - 6:00 PM",
        },
        {
          date: "Jan 21",
          matches: "Quarter Finals & Semi Finals",
          time: "9:00 AM - 7:00 PM",
        },
        { date: "Jan 22", matches: "Finals", time: "4:00 PM - 8:00 PM" },
      ],
      prizeDistribution: [
        { position: "Singles Winner", amount: "₹25,000" },
        { position: "Doubles Winner", amount: "₹15,000" },
        { position: "Singles Runner-up", amount: "₹7,000" },
        { position: "Doubles Runner-up", amount: "₹3,000" },
      ],
      facilities: [
        "Professional courts",
        "Ball boys/girls provided",
        "Medical support",
        "Live scoring",
        "Refreshments",
        "Changing rooms",
      ],
      registeredTeams: [
        {
          name: "Ace Tennis Club",
          captain: "Priya Sharma",
          experience: "6 years",
        },
        {
          name: "Court Masters",
          captain: "Rajesh Kumar",
          experience: "4 years",
        },
        { name: "Net Winners", captain: "Anita Patel", experience: "5 years" },
      ],
    },
  ];

  // Fix: safe check for params and id
  const id = params?.id;

  useEffect(() => {
    if (!id) {
      setTournament(null);
      return;
    }
    const foundTournament = tournaments.find((t) => t.id === id);
    setTournament(foundTournament || null);
  }, [id]);

  const handleLogout = () => {
    setUser(null);
    router.push("/");
  };

  const handleRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsRegistering(true);

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      alert(
        "Registration submitted successfully! You will receive a confirmation email shortly."
      );

      // Optionally update tournament data to reflect new registration
      if (tournament) {
        setTournament({
          ...tournament,
          teams: tournament.teams + 1,
          registeredTeams: [
            ...tournament.registeredTeams,
            {
              name: registrationData.teamName,
              captain: registrationData.captainName,
              experience: registrationData.experience,
            },
          ],
        });
      }

      // Reset form
      setRegistrationData({
        teamName: "",
        captainName: "",
        captainPhone: "",
        captainEmail: "",
        playerCount: "",
        experience: "",
        specialRequests: "",
      });
    } catch (error: any) {
      console.error("Registration failed:", error);
      alert("Registration failed. Please try again.");
    } finally {
      setIsRegistering(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Open":
        return "bg-green-600 text-white";
      case "Filling Fast":
        return "bg-yellow-600 text-white";
      case "Closed":
        return "bg-red-600 text-white";
      default:
        return "bg-gray-600 text-white";
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Amateur":
        return "bg-blue-600 text-white";
      case "Intermediate":
        return "bg-purple-600 text-white";
      case "Advanced":
        return "bg-orange-600 text-white";
      case "Professional":
        return "bg-red-600 text-white";
      default:
        return "bg-gray-600 text-white";
    }
  };

  if (!tournament) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">
            Tournament Not Found
          </h2>
          <p className="text-gray-300 mb-6">
            The tournament you're looking for doesn't exist.
          </p>
          <Button asChild>
            <Link href="/tournaments">Back to Tournaments</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">TB</span>
              </div>
              <span className="text-xl font-bold text-white">TurfBook</span>
            </Link>
            <nav className="hidden md:flex items-center space-x-6">
              <Link
                href="/turfs"
                className="text-gray-300 hover:text-green-400 transition-colors"
              >
                Find Turfs
              </Link>
              <Link
                href="/community"
                className="text-gray-300 hover:text-green-400 transition-colors"
              >
                Community
              </Link>
              <Link
                href="/host"
                className="text-gray-300 hover:text-green-400 transition-colors"
              >
                Host Your Turf
              </Link>
            </nav>
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                asChild
                className="text-gray-300 hover:text-white"
              >
                <Link href="/tournaments">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Tournaments
                </Link>
              </Button>
              {user ? (
                <>
                  <Button
                    className="bg-emerald-600 hover:bg-emerald-700"
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
                    className="text-gray-300 hover:text-white"
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="ghost"
                    asChild
                    className="text-gray-300 hover:text-white"
                  >
                    <Link href="/login">Login</Link>
                  </Button>
                  <Button asChild>
                    <Link href="/signup">Sign Up</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="relative mb-8">
          <div className="relative h-96 rounded-xl overflow-hidden">
            <Image
              src={tournament.image || "/placeholder.svg"}
              alt={tournament.name}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-50" />
            <div className="absolute bottom-6 left-6 right-6">
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge className={getStatusColor(tournament.status)}>
                  {tournament.status}
                </Badge>
                <Badge className={getDifficultyColor(tournament.difficulty)}>
                  {tournament.difficulty}
                </Badge>
                <Badge className="bg-green-600">
                  Prize: {tournament.prize}
                </Badge>
              </div>
              <h1 className="text-4xl font-bold text-white mb-2">
                {tournament.name}
              </h1>
              <p className="text-xl text-gray-200">
                Organized by {tournament.organizer}
              </p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Info */}
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center text-gray-300">
                      <Calendar className="w-5 h-5 mr-3 text-green-400" />
                      <div>
                        <p className="font-medium text-white">
                          Tournament Dates
                        </p>
                        <p className="text-sm">{tournament.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center text-gray-300">
                      <MapPin className="w-5 h-5 mr-3 text-green-400" />
                      <div>
                        <p className="font-medium text-white">Location</p>
                        <p className="text-sm">{tournament.fullAddress}</p>
                      </div>
                    </div>
                    <div className="flex items-center text-gray-300">
                      <Users className="w-5 h-5 mr-3 text-green-400" />
                      <div>
                        <p className="font-medium text-white">Teams</p>
                        <p className="text-sm">
                          {tournament.teams}/{tournament.maxTeams} registered
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center text-gray-300">
                      <DollarSign className="w-5 h-5 mr-3 text-green-400" />
                      <div>
                        <p className="font-medium text-white">
                          Registration Fee
                        </p>
                        <p className="text-sm">{tournament.registrationFee}</p>
                      </div>
                    </div>
                    <div className="flex items-center text-gray-300">
                      <Clock className="w-5 h-5 mr-3 text-green-400" />
                      <div>
                        <p className="font-medium text-white">
                          Registration Deadline
                        </p>
                        <p className="text-sm">
                          {tournament.registrationDeadline}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center text-gray-300">
                      <Trophy className="w-5 h-5 mr-3 text-green-400" />
                      <div>
                        <p className="font-medium text-white">Format</p>
                        <p className="text-sm">{tournament.format}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tabs Content */}
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="bg-gray-800">
                <TabsTrigger
                  value="overview"
                  className="text-white data-[state=active]:bg-green-600"
                >
                  Overview
                </TabsTrigger>
                <TabsTrigger
                  value="schedule"
                  className="text-white data-[state=active]:bg-green-600"
                >
                  Schedule
                </TabsTrigger>
                <TabsTrigger
                  value="rules"
                  className="text-white data-[state=active]:bg-green-600"
                >
                  Rules
                </TabsTrigger>
                <TabsTrigger
                  value="teams"
                  className="text-white data-[state=active]:bg-green-600"
                >
                  Teams
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white">
                      About Tournament
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-300 mb-6">
                      {tournament.description}
                    </p>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-white mb-3">
                          Prize Distribution
                        </h4>
                        <div className="space-y-2">
                          {tournament.prizeDistribution.map((prize, index) => (
                            <div
                              key={index}
                              className="flex justify-between items-center py-2 border-b border-gray-700 last:border-b-0"
                            >
                              <span className="text-gray-300">
                                {prize.position}
                              </span>
                              <span className="font-medium text-green-400">
                                {prize.amount}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold text-white mb-3">
                          Facilities Provided
                        </h4>
                        <div className="space-y-2">
                          {tournament.facilities.map((facility, index) => (
                            <div
                              key={index}
                              className="flex items-center text-gray-300"
                            >
                              <CheckCircle className="w-4 h-4 mr-2 text-green-400" />
                              <span className="text-sm">{facility}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="schedule" className="space-y-6">
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white">
                      Tournament Schedule
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {tournament.schedule.map((day, index) => (
                        <div
                          key={index}
                          className="border border-gray-700 rounded-lg p-4"
                        >
                          <div className="flex justify-between items-center mb-2">
                            <h4 className="font-semibold text-white">
                              {day.date}
                            </h4>
                            <Badge
                              variant="secondary"
                              className="bg-gray-700 text-gray-300"
                            >
                              {day.time}
                            </Badge>
                          </div>
                          <p className="text-gray-300">{day.matches}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="rules" className="space-y-6">
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white">
                      Tournament Rules
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {tournament.rules.map((rule, index) => (
                        <div key={index} className="flex items-start">
                          <span className="inline-flex items-center justify-center w-6 h-6 bg-green-600 text-white text-xs font-bold rounded-full mr-3 mt-0.5">
                            {index + 1}
                          </span>
                          <p className="text-gray-300">{rule}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="teams" className="space-y-6">
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white">
                      Registered Teams
                    </CardTitle>
                    <CardDescription className="text-gray-300">
                      {tournament.registeredTeams.length} teams registered
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-4">
                      {tournament.registeredTeams.map((team, index) => (
                        <div
                          key={index}
                          className="border border-gray-700 rounded-lg p-4"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold text-white">
                              {team.name}
                            </h4>
                            <Badge
                              variant="secondary"
                              className="bg-gray-700 text-gray-300"
                            >
                              #{index + 1}
                            </Badge>
                          </div>
                          <div className="text-sm text-gray-300">
                            <p>Captain: {team.captain}</p>
                            <p>Experience: {team.experience}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Registration Card */}
            <Card className="bg-gray-800 border-gray-700 sticky top-24">
              <CardHeader>
                <CardTitle className="text-white">Register Your Team</CardTitle>
                <CardDescription className="text-gray-300">
                  Secure your spot in this tournament
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-400 mb-1">
                    {tournament.registrationFee}
                  </div>
                  <p className="text-sm text-gray-300">Registration Fee</p>
                </div>

                <Separator className="bg-gray-700" />

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Spots Available:</span>
                    <span className="text-white">
                      {tournament.maxTeams - tournament.teams}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Deadline:</span>
                    <span className="text-white">
                      {tournament.registrationDeadline}
                    </span>
                  </div>
                </div>

                {user ? (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        className="w-full"
                        size="lg"
                        disabled={tournament.status === "Closed"}
                      >
                        {tournament.status === "Closed"
                          ? "Registration Closed"
                          : "Register Team"}
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>
                          Register for {tournament.name}
                        </DialogTitle>
                        <DialogDescription className="text-gray-300">
                          Fill in your team details to register for this
                          tournament.
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleRegistration} className="space-y-4">
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="teamName" className="text-white">
                              Team Name
                            </Label>
                            <Input
                              id="teamName"
                              value={registrationData.teamName}
                              onChange={(e) =>
                                setRegistrationData({
                                  ...registrationData,
                                  teamName: e.target.value,
                                })
                              }
                              className="bg-gray-700 border-gray-600 text-white"
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="experience" className="text-white">
                              Team Experience
                            </Label>
                            <Input
                              id="experience"
                              placeholder="e.g., 3 years"
                              value={registrationData.experience}
                              onChange={(e) =>
                                setRegistrationData({
                                  ...registrationData,
                                  experience: e.target.value,
                                })
                              }
                              className="bg-gray-700 border-gray-600 text-white"
                              required
                            />
                          </div>
                        </div>
                        <div>
                          <Label
                            htmlFor="specialRequests"
                            className="text-white"
                          >
                            Special Requests (Optional)
                          </Label>
                          <Textarea
                            id="specialRequests"
                            value={registrationData.specialRequests}
                            onChange={(e) =>
                              setRegistrationData({
                                ...registrationData,
                                specialRequests: e.target.value,
                              })
                            }
                            className="bg-gray-700 border-gray-600 text-white"
                            rows={3}
                          />
                        </div>
                        <Button
                          type="submit"
                          className="w-full"
                          disabled={isRegistering}
                        >
                          {isRegistering
                            ? "Registering..."
                            : `Pay ${tournament.registrationFee} & Register`}
                        </Button>
                      </form>
                    </DialogContent>
                  </Dialog>
                ) : (
                  <div className="space-y-3">
                    <Button asChild className="w-full" size="lg">
                      <Link href="/login">Login to Register</Link>
                    </Button>
                    <p className="text-xs text-gray-400 text-center">
                      You need to be logged in to register for tournaments
                    </p>
                  </div>
                )}

                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 bg-gray-700 border-gray-600 text-white"
                  >
                    <Heart className="w-4 h-4 mr-1" />
                    Save
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 bg-gray-700 border-gray-600 text-white"
                  >
                    <Share2 className="w-4 h-4 mr-1" />
                    Share
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Organizer Info */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Organizer</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">
                      {tournament.organizer}
                    </h4>
                    <div className="flex items-center text-sm text-gray-300">
                      <Shield className="w-3 h-3 mr-1" />
                      Verified Organizer
                    </div>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center text-gray-300">
                    <Phone className="w-4 h-4 mr-2" />
                    {tournament.organizerContact.phone}
                  </div>
                  <div className="flex items-center text-gray-300">
                    <Mail className="w-4 h-4 mr-2" />
                    {tournament.organizerContact.email}
                  </div>
                  <div className="flex items-center text-gray-300">
                    <Globe className="w-4 h-4 mr-2" />
                    {tournament.organizerContact.website}
                  </div>
                </div>

                <Button
                  variant="outline"
                  className="w-full bg-gray-700 border-gray-600 text-white"
                >
                  Contact Organizer
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
