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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Trophy,
  Calendar,
  MapPin,
  Users,
  DollarSign,
  Clock,
  Search,
  Filter,
  Plus,
  Star,
  Medal,
} from "lucide-react";
import Image from "next/image";
import TSEC from "@/public/TSEC.png";
import Link from "next/link";
import { useUser } from "@/contexts/UserContext";
import { useRouter } from "next/navigation";

interface Tournament {
  id: number;
  name: string;
  sport: string;
  date: string;
  startDate: string;
  location: string;
  prize: string;
  prizeAmount: number;
  teams: number;
  maxTeams: number;
  registrationFee: string;
  status: string;
  image: string;
  organizer: string;
  description: string;
  format: string;
  difficulty: string;
  registrationDeadline: string;
}

interface PastTournament {
  id: number;
  name: string;
  sport: string;
  date: string;
  winner: string;
  prize: string;
  teams: number;
  image: string;
}

export default function TournamentsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSport, setSelectedSport] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedPrizeRange, setPrizeRange] = useState("all");

  const { user, setUser } = useUser();
  const router = useRouter();

  const handleLogout = () => {
    setUser(null);
    router.push("/");
  };

  const tournaments: Tournament[] = [
    {
      id: 1,
      name: "Mumbai Football Championship",
      sport: "Football",
      date: "Jan 15-17, 2025",
      startDate: "2025-01-15",
      location: "Multiple venues, Mumbai",
      prize: "₹1,00,000",
      prizeAmount: 100000,
      teams: 16,
      maxTeams: 32,
      registrationFee: "₹5,000",
      status: "Open",
      image: "/placeholder.svg?height=200&width=300&text=Football+Championship",
      organizer: "Mumbai Sports Club",
      description:
        "Premier football tournament featuring the best teams from Mumbai and surrounding areas.",
      format: "Knockout",
      difficulty: "Professional",
      registrationDeadline: "Jan 10, 2025",
    },
    {
      id: 2,
      name: "Tennis Masters Cup",
      sport: "Tennis",
      date: "Jan 20-22, 2025",
      startDate: "2025-01-20",
      location: "Elite Tennis Academy",
      prize: "₹50,000",
      prizeAmount: 50000,
      teams: 8,
      maxTeams: 16,
      registrationFee: "₹2,000",
      status: "Open",
      image: "/placeholder.svg?height=200&width=300&text=Tennis+Masters",
      organizer: "Tennis Federation Mumbai",
      description:
        "Singles and doubles tennis tournament for advanced players.",
      format: "Round Robin + Knockout",
      difficulty: "Advanced",
      registrationDeadline: "Jan 15, 2025",
    },
    {
      id: 3,
      name: "Corporate Cricket League",
      sport: "Cricket",
      date: "Feb 1-3, 2025",
      startDate: "2025-02-01",
      location: "Champions Ground",
      prize: "₹75,000",
      prizeAmount: 75000,
      teams: 12,
      maxTeams: 20,
      registrationFee: "₹8,000",
      status: "Filling Fast",
      image: "/placeholder.svg?height=200&width=300&text=Cricket+League",
      organizer: "Corporate Sports League",
      description:
        "Exclusive cricket tournament for corporate teams and professionals.",
      format: "League + Playoffs",
      difficulty: "Intermediate",
      registrationDeadline: "Jan 25, 2025",
    },
    {
      id: 4,
      name: "Badminton Open Championship",
      sport: "Badminton",
      date: "Dec 28-30, 2024",
      startDate: "2024-12-28",
      location: "Ace Badminton Center",
      prize: "₹30,000",
      prizeAmount: 30000,
      teams: 24,
      maxTeams: 32,
      registrationFee: "₹1,500",
      status: "Closed",
      image: "/placeholder.svg?height=200&width=300&text=Badminton+Open",
      organizer: "Badminton Association",
      description:
        "Open championship for all skill levels with multiple categories.",
      format: "Knockout",
      difficulty: "All Levels",
      registrationDeadline: "Dec 20, 2024",
    },
    {
      id: 5,
      name: "Weekend Warriors Football",
      sport: "Football",
      date: "Jan 25-26, 2025",
      startDate: "2025-01-25",
      location: "Green Valley Turf",
      prize: "₹25,000",
      prizeAmount: 25000,
      teams: 6,
      maxTeams: 12,
      registrationFee: "₹3,000",
      status: "Open",
      image: "/placeholder.svg?height=200&width=300&text=Weekend+Warriors",
      organizer: "Weekend Sports Club",
      description:
        "Casual football tournament for amateur and semi-professional teams.",
      format: "Round Robin",
      difficulty: "Amateur",
      registrationDeadline: "Jan 20, 2025",
    },
    {
      id: 6,
      name: "Basketball 3v3 Street Tournament",
      sport: "Basketball",
      date: "Feb 10-11, 2025",
      startDate: "2025-02-10",
      location: "Metro Sports Complex",
      prize: "₹40,000",
      prizeAmount: 40000,
      teams: 10,
      maxTeams: 16,
      registrationFee: "₹2,500",
      status: "Open",
      image: "/placeholder.svg?height=200&width=300&text=Basketball+3v3",
      organizer: "Street Basketball Mumbai",
      description:
        "Fast-paced 3v3 basketball tournament with street-style rules.",
      format: "Knockout",
      difficulty: "Intermediate",
      registrationDeadline: "Feb 5, 2025",
    },
  ];

  const pastTournaments: PastTournament[] = [
    {
      id: 101,
      name: "Mumbai Cricket Premier League",
      sport: "Cricket",
      date: "Nov 15-17, 2024",
      winner: "Mumbai Strikers",
      prize: "₹1,50,000",
      teams: 20,
      image: "/placeholder.svg?height=200&width=300&text=Cricket+Premier",
    },
    {
      id: 102,
      name: "Tennis Championship 2024",
      sport: "Tennis",
      date: "Oct 20-22, 2024",
      winner: "Ace Tennis Club",
      prize: "₹60,000",
      teams: 16,
      image: "/placeholder.svg?height=200&width=300&text=Tennis+Championship",
    },
  ];

  // Add state for tournaments (so we can add new ones)
  const [tournamentsState, setTournamentsState] =
    useState<Tournament[]>(tournaments);
  // Add state for form fields
  const [form, setForm] = useState({
    name: "",
    sport: "",
    location: "",
    startDate: "",
    endDate: "",
    prize: "",
    registrationFee: "",
    maxTeams: "",
    description: "",
    format: "",
    difficulty: "",
  });
  const [formSuccess, setFormSuccess] = useState(false);

  // Use tournamentsState instead of tournaments for filtering
  const filteredTournaments = tournamentsState.filter((tournament) => {
    const matchesSearch =
      tournament.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tournament.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tournament.organizer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSport =
      selectedSport === "all" ||
      tournament.sport.toLowerCase() === selectedSport.toLowerCase();
    const matchesStatus =
      selectedStatus === "all" ||
      tournament.status.toLowerCase() === selectedStatus.toLowerCase();
    const matchesPrize =
      selectedPrizeRange === "all" ||
      (selectedPrizeRange === "low" && tournament.prizeAmount < 50000) ||
      (selectedPrizeRange === "medium" &&
        tournament.prizeAmount >= 50000 &&
        tournament.prizeAmount < 100000) ||
      (selectedPrizeRange === "high" && tournament.prizeAmount >= 100000);

    return matchesSearch && matchesSport && matchesStatus && matchesPrize;
  });

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

  // Helper for form reset
  const resetForm = () => {
    setForm({
      name: "",
      sport: "",
      location: "",
      startDate: "",
      endDate: "",
      prize: "",
      registrationFee: "",
      maxTeams: "",
      description: "",
      format: "",
      difficulty: "",
    });
  };

  // Handle form input change
  const handleFormChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle form submit
  const handleCreateTournament = (e: React.FormEvent) => {
    e.preventDefault();
    // Basic validation
    if (
      !form.name ||
      !form.sport ||
      !form.location ||
      !form.startDate ||
      !form.endDate ||
      !form.prize ||
      !form.registrationFee ||
      !form.maxTeams ||
      !form.description ||
      !form.format ||
      !form.difficulty
    ) {
      setFormSuccess(false);
      return;
    }
    // Parse prize amount (remove non-digits)
    const prizeAmount = parseInt(form.prize.replace(/[^\d]/g, "")) || 0;
    // Create new tournament object
    const newTournament: Tournament = {
      id: Date.now(),
      name: form.name,
      sport: form.sport,
      date: `${form.startDate} - ${form.endDate}`,
      startDate: form.startDate,
      location: form.location,
      prize: form.prize,
      prizeAmount,
      teams: 0,
      maxTeams: parseInt(form.maxTeams),
      registrationFee: form.registrationFee,
      status: "Open",
      image:
        "/placeholder.svg?height=200&width=300&text=" +
        encodeURIComponent(form.name),
      organizer: user ? user.firstName : "You",
      description: form.description,
      format: form.format,
      difficulty: form.difficulty,
      registrationDeadline: form.startDate,
    };
    setTournamentsState([newTournament, ...tournamentsState]);
    setFormSuccess(true);
    resetForm();
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 relative overflow-hidden p-1">
                  <Image
                    src={TSEC}
                    alt="TurfBook Logo"
                    fill
                    className="object-cover rounded-md hover:scale-105 transition-transform duration-300 hover:drop-shadow-lg"
                  />
                </div>
                <span className="text-xl font-bold text-white">TSEC</span>
              </div>
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
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            Sports Tournaments
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Compete with the best, win amazing prizes, and showcase your skills
            in premier sports tournaments
          </p>
        </div>

        <Tabs defaultValue="upcoming" className="space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <TabsList className="bg-gray-800">
              <TabsTrigger
                value="upcoming"
                className="text-white data-[state=active]:bg-green-600"
              >
                Upcoming Tournaments
              </TabsTrigger>
              <TabsTrigger
                value="past"
                className="text-white data-[state=active]:bg-green-600"
              >
                Past Results
              </TabsTrigger>
              <TabsTrigger
                value="create"
                className="text-white data-[state=active]:bg-green-600"
              >
                Host Tournament
              </TabsTrigger>
            </TabsList>

            <Button className="bg-green-600 hover:bg-green-700">
              <Plus className="w-4 h-4 mr-2" />
              Create Tournament
            </Button>
          </div>

          <TabsContent value="upcoming" className="space-y-6">
            {/* Search and Filters */}
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  <div className="lg:col-span-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Search tournaments..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                      />
                    </div>
                  </div>

                  <Select
                    value={selectedSport}
                    onValueChange={setSelectedSport}
                  >
                    <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                      <SelectValue placeholder="Sport" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-700 border-gray-600">
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
                    value={selectedStatus}
                    onValueChange={setSelectedStatus}
                  >
                    <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-700 border-gray-600">
                      <SelectItem value="all" className="text-white">
                        All Status
                      </SelectItem>
                      <SelectItem value="open" className="text-white">
                        Open
                      </SelectItem>
                      <SelectItem value="filling fast" className="text-white">
                        Filling Fast
                      </SelectItem>
                      <SelectItem value="closed" className="text-white">
                        Closed
                      </SelectItem>
                    </SelectContent>
                  </Select>

                  <Select
                    value={selectedPrizeRange}
                    onValueChange={setPrizeRange}
                  >
                    <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                      <SelectValue placeholder="Prize Range" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-700 border-gray-600">
                      <SelectItem value="all" className="text-white">
                        All Prizes
                      </SelectItem>
                      <SelectItem value="low" className="text-white">
                        Under ₹50K
                      </SelectItem>
                      <SelectItem value="medium" className="text-white">
                        ₹50K - ₹1L
                      </SelectItem>
                      <SelectItem value="high" className="text-white">
                        Above ₹1L
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Results Header */}
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">
                {filteredTournaments.length} tournaments found
              </h2>
              <Select defaultValue="date">
                <SelectTrigger className="w-48 bg-gray-800 border-gray-700 text-white">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600">
                  <SelectItem value="date" className="text-white">
                    Start Date
                  </SelectItem>
                  <SelectItem value="prize-high" className="text-white">
                    Prize: High to Low
                  </SelectItem>
                  <SelectItem value="prize-low" className="text-white">
                    Prize: Low to High
                  </SelectItem>
                  <SelectItem value="teams" className="text-white">
                    Teams Registered
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Tournaments Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTournaments.map((tournament) => (
                <Card
                  key={tournament.id}
                  className="bg-gray-800 border-gray-700 overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="relative">
                    <Image
                      src={tournament.image || "/placeholder.svg"}
                      alt={tournament.name}
                      width={300}
                      height={200}
                      className="w-full h-48 object-cover"
                    />
                    <Badge
                      className={`absolute top-3 right-3 ${getStatusColor(
                        tournament.status
                      )}`}
                    >
                      {tournament.status}
                    </Badge>
                    <Badge className="absolute top-3 left-3 bg-green-600">
                      Prize: {tournament.prize}
                    </Badge>
                  </div>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg text-white">
                          {tournament.name}
                        </CardTitle>
                        <CardDescription className="text-gray-300">
                          Organized by {tournament.organizer}
                        </CardDescription>
                      </div>
                      <Badge
                        className={getDifficultyColor(tournament.difficulty)}
                      >
                        {tournament.difficulty}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <p className="text-sm text-gray-300">
                        {tournament.description}
                      </p>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center text-gray-300">
                          <Calendar className="w-4 h-4 mr-2" />
                          {tournament.date}
                        </div>
                        <div className="flex items-center text-gray-300">
                          <MapPin className="w-4 h-4 mr-2" />
                          {tournament.location.split(",")[0]}
                        </div>
                        <div className="flex items-center text-gray-300">
                          <Users className="w-4 h-4 mr-2" />
                          {tournament.teams}/{tournament.maxTeams} teams
                        </div>
                        <div className="flex items-center text-gray-300">
                          <DollarSign className="w-4 h-4 mr-2" />
                          Fee: {tournament.registrationFee}
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-sm text-gray-400">
                        <span>Format: {tournament.format}</span>
                        <Badge
                          variant="secondary"
                          className="bg-gray-700 text-gray-300"
                        >
                          {tournament.sport}
                        </Badge>
                      </div>

                      <div className="text-xs text-gray-400">
                        Registration deadline: {tournament.registrationDeadline}
                      </div>

                      <div className="flex space-x-2">
                        <Button
                          className="flex-1"
                          disabled={tournament.status === "Closed"}
                          asChild
                        >
                          <Link href={`/tournaments/${tournament.id}`}>
                            {tournament.status === "Closed"
                              ? "Registration Closed"
                              : "Register Team"}
                          </Link>
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          className="bg-gray-700 border-gray-600 text-white"
                        >
                          <Trophy className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredTournaments.length === 0 && (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Filter className="w-16 h-16 mx-auto" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  No tournaments found
                </h3>
                <p className="text-gray-300 mb-4">
                  Try adjusting your filters or search criteria
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedSport("all");
                    setSelectedStatus("all");
                    setPrizeRange("all");
                  }}
                  className="bg-gray-800 border-gray-700 text-white"
                >
                  Clear All Filters
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="past" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pastTournaments.map((tournament) => (
                <Card
                  key={tournament.id}
                  className="bg-gray-800 border-gray-700 overflow-hidden"
                >
                  <div className="relative">
                    <Image
                      src={tournament.image || "/placeholder.svg"}
                      alt={tournament.name}
                      width={300}
                      height={200}
                      className="w-full h-48 object-cover opacity-75"
                    />
                    <Badge className="absolute top-3 right-3 bg-gray-600">
                      Completed
                    </Badge>
                  </div>
                  <CardHeader>
                    <CardTitle className="text-lg text-white">
                      {tournament.name}
                    </CardTitle>
                    <CardDescription className="text-gray-300">
                      {tournament.date}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-yellow-400">
                          <Medal className="w-5 h-5 mr-2" />
                          <span className="font-semibold">Winner</span>
                        </div>
                        <span className="text-white font-medium">
                          {tournament.winner}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm text-gray-300">
                        <span>Prize Pool: {tournament.prize}</span>
                        <span>{tournament.teams} teams participated</span>
                      </div>
                      <Button
                        variant="outline"
                        className="w-full bg-gray-700 border-gray-600 text-white"
                      >
                        View Results
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="create" className="space-y-6">
            <div className="max-w-2xl mx-auto">
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader className="text-center">
                  <Trophy className="w-12 h-12 text-green-400 mx-auto mb-4" />
                  <CardTitle className="text-2xl text-white">
                    Host Your Own Tournament
                  </CardTitle>
                  <CardDescription className="text-gray-300">
                    Create exciting tournaments and bring the sports community
                    together
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Success message */}
                  {formSuccess && (
                    <div className="bg-green-700 text-white rounded px-4 py-2 text-center mb-4">
                      Tournament created successfully!
                    </div>
                  )}
                  {/* Host Tournament Form */}
                  <form onSubmit={handleCreateTournament} className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gray-300 mb-1">
                          Tournament Name
                        </label>
                        <Input
                          name="name"
                          value={form.name}
                          onChange={handleFormChange}
                          className="bg-gray-700 border-gray-600 text-white"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-gray-300 mb-1">
                          Sport
                        </label>
                        <select
                          name="sport"
                          value={form.sport}
                          onChange={handleFormChange}
                          className="w-full bg-gray-700 border-gray-600 text-white rounded px-3 py-2"
                          required
                        >
                          <option value="">Select Sport</option>
                          <option value="Football">Football</option>
                          <option value="Cricket">Cricket</option>
                          <option value="Tennis">Tennis</option>
                          <option value="Badminton">Badminton</option>
                          <option value="Basketball">Basketball</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-gray-300 mb-1">
                          Location
                        </label>
                        <Input
                          name="location"
                          value={form.location}
                          onChange={handleFormChange}
                          className="bg-gray-700 border-gray-600 text-white"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-gray-300 mb-1">
                          Start Date
                        </label>
                        <Input
                          name="startDate"
                          type="date"
                          value={form.startDate}
                          onChange={handleFormChange}
                          className="bg-gray-700 border-gray-600 text-white"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-gray-300 mb-1">
                          End Date
                        </label>
                        <Input
                          name="endDate"
                          type="date"
                          value={form.endDate}
                          onChange={handleFormChange}
                          className="bg-gray-700 border-gray-600 text-white"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-gray-300 mb-1">
                          Prize (e.g. ₹50,000)
                        </label>
                        <Input
                          name="prize"
                          value={form.prize}
                          onChange={handleFormChange}
                          className="bg-gray-700 border-gray-600 text-white"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-gray-300 mb-1">
                          Registration Fee
                        </label>
                        <Input
                          name="registrationFee"
                          value={form.registrationFee}
                          onChange={handleFormChange}
                          className="bg-gray-700 border-gray-600 text-white"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-gray-300 mb-1">
                          Max Teams
                        </label>
                        <Input
                          name="maxTeams"
                          type="number"
                          min={2}
                          value={form.maxTeams}
                          onChange={handleFormChange}
                          className="bg-gray-700 border-gray-600 text-white"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-gray-300 mb-1">
                          Format
                        </label>
                        <Input
                          name="format"
                          value={form.format}
                          onChange={handleFormChange}
                          className="bg-gray-700 border-gray-600 text-white"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-gray-300 mb-1">
                          Difficulty
                        </label>
                        <select
                          name="difficulty"
                          value={form.difficulty}
                          onChange={handleFormChange}
                          className="w-full bg-gray-700 border-gray-600 text-white rounded px-3 py-2"
                          required
                        >
                          <option value="">Select Difficulty</option>
                          <option value="Amateur">Amateur</option>
                          <option value="Intermediate">Intermediate</option>
                          <option value="Advanced">Advanced</option>
                          <option value="Professional">Professional</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-gray-300 mb-1">
                        Description
                      </label>
                      <textarea
                        name="description"
                        value={form.description}
                        onChange={handleFormChange}
                        className="w-full bg-gray-700 border-gray-600 text-white rounded px-3 py-2"
                        rows={3}
                        required
                      />
                    </div>
                    <Button className="w-full" size="lg" type="submit">
                      <Plus className="w-5 h-5 mr-2" />
                      Create Tournament
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
