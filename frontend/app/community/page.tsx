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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Users,
  MapPin,
  Calendar,
  Trophy,
  Star,
  MessageCircle,
  UserPlus,
  Search,
  Plus,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import { useUser } from "@/contexts/UserContext";
import { useRouter } from "next/navigation";

export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState("find-players");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSport, setSelectedSport] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const { user, setUser } = useUser();
  const router = useRouter();

  const players = [
    {
      id: 1,
      name: "Rahul Sharma",
      avatar: "/placeholder.svg?height=40&width=40",
      sport: "Football",
      skill: "Intermediate",
      location: "Bandra, Mumbai",
      rating: 4.8,
      gamesPlayed: 45,
      availability: "Weekends",
      bio: "Love playing football on weekends. Looking for regular teammates!",
    },
    {
      id: 2,
      name: "Priya Patel",
      avatar: "/placeholder.svg?height=40&width=40",
      sport: "Tennis",
      skill: "Advanced",
      location: "Andheri, Mumbai",
      rating: 4.9,
      gamesPlayed: 78,
      availability: "Evenings",
      bio: "Tennis enthusiast with 5+ years experience. Open to coaching beginners.",
    },
    {
      id: 3,
      name: "Amit Kumar",
      avatar: "/placeholder.svg?height=40&width=40",
      sport: "Cricket",
      skill: "Expert",
      location: "Powai, Mumbai",
      rating: 4.7,
      gamesPlayed: 120,
      availability: "Flexible",
      bio: "Former club player. Available for matches and practice sessions.",
    },
    {
      id: 4,
      name: "Sneha Reddy",
      avatar: "/placeholder.svg?height=40&width=40",
      sport: "Badminton",
      skill: "Intermediate",
      location: "Malad, Mumbai",
      rating: 4.6,
      gamesPlayed: 32,
      availability: "Mornings",
      bio: "Early bird looking for morning badminton partners!",
    },
  ];

  const teams = [
    {
      id: 1,
      name: "Mumbai Strikers",
      sport: "Football",
      members: 8,
      maxMembers: 11,
      location: "Multiple locations",
      level: "Intermediate",
      image: "/placeholder.svg?height=60&width=60",
      description: "Competitive football team looking for skilled players",
      nextMatch: "Dec 20, 2024",
    },
    {
      id: 2,
      name: "Court Kings",
      sport: "Tennis",
      members: 4,
      maxMembers: 6,
      location: "Bandra, Mumbai",
      level: "Advanced",
      image: "/placeholder.svg?height=60&width=60",
      description: "Serious tennis players competing in local tournaments",
      nextMatch: "Dec 18, 2024",
    },
    {
      id: 3,
      name: "Weekend Warriors",
      sport: "Cricket",
      members: 9,
      maxMembers: 15,
      location: "Thane, Mumbai",
      level: "Beginner",
      image: "/placeholder.svg?height=60&width=60",
      description: "Casual cricket team for weekend fun",
      nextMatch: "Dec 22, 2024",
    },
  ];

  const tournaments = [
    {
      id: 1,
      name: "Mumbai Football Championship",
      sport: "Football",
      date: "Jan 15-17, 2025",
      location: "Multiple venues",
      prize: "₹1,00,000",
      teams: 16,
      maxTeams: 32,
      registrationFee: "₹5,000",
      image: "/placeholder.svg?height=200&width=300",
      organizer: "Mumbai Sports Club",
    },
    {
      id: 2,
      name: "Tennis Masters Cup",
      sport: "Tennis",
      date: "Jan 20-22, 2025",
      location: "Elite Tennis Academy",
      prize: "₹50,000",
      teams: 8,
      maxTeams: 16,
      registrationFee: "₹2,000",
      image: "/placeholder.svg?height=200&width=300",
      organizer: "Tennis Federation",
    },
    {
      id: 3,
      name: "Corporate Cricket League",
      sport: "Cricket",
      date: "Feb 1-3, 2025",
      location: "Champions Ground",
      prize: "₹75,000",
      teams: 12,
      maxTeams: 20,
      registrationFee: "₹8,000",
      image: "/placeholder.svg?height=200&width=300",
      organizer: "Corporate Sports League",
    },
  ];

  const filteredPlayers = players.filter((player) => {
    const matchesSearch =
      player.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      player.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSport =
      selectedSport === "all" ||
      player.sport.toLowerCase() === selectedSport.toLowerCase();
    const matchesLocation =
      selectedLocation === "all" ||
      player.location.toLowerCase().includes(selectedLocation.toLowerCase());

    return matchesSearch && matchesSport && matchesLocation;
  });

  // Example: Create post
  const handleCreatePost = async (content: string) => {
    try {
      const userId = localStorage.getItem("userId") || "mockUserId";
      const res = await axios.post("http://localhost:5000/api/community", {
        userId,
        content,
      });
      alert("Post created!");
    } catch (err: any) {
      alert(err.response?.data?.message || "Post failed");
    }
  };

  // Example: Add comment
  const handleAddComment = async (postId: string, text: string) => {
    try {
      const userId = localStorage.getItem("userId") || "mockUserId";
      const res = await axios.post(
        `http://localhost:5000/api/community/${postId}/comment`,
        { userId, text }
      );
      alert("Comment added!");
    } catch (err: any) {
      alert(err.response?.data?.message || "Comment failed");
    }
  };

  const handleLogout = () => {
    setUser(null);
    router.push("/");
  };

  // Local state for teams/tournaments so we can add new ones
  const [teamsState, setTeamsState] = useState(teams);
  const [tournamentsState, setTournamentsState] = useState(tournaments);

  // Team form state
  const [teamForm, setTeamForm] = useState({
    name: "",
    sport: "",
    level: "",
    location: "",
    maxMembers: "",
    description: "",
  });
  const [teamFormSuccess, setTeamFormSuccess] = useState(false);

  // Tournament form state
  const [tournamentForm, setTournamentForm] = useState({
    name: "",
    sport: "",
    location: "",
    startDate: "",
    endDate: "",
    prize: "",
    registrationFee: "",
    maxTeams: "",
    description: "",
  });
  const [tournamentFormSuccess, setTournamentFormSuccess] = useState(false);

  // Modal state for player/team connect
  const [selectedPlayer, setSelectedPlayer] = useState<any | null>(null);
  const [selectedTeam, setSelectedTeam] = useState<any | null>(null);
  const [connectMessage, setConnectMessage] = useState("");
  const [connectSuccess, setConnectSuccess] = useState(false);

  // Handle team form input
  const handleTeamFormChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setTeamForm({ ...teamForm, [e.target.name]: e.target.value });
  };

  // Handle tournament form input
  const handleTournamentFormChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setTournamentForm({ ...tournamentForm, [e.target.name]: e.target.value });
  };

  // Handle create team
  const handleCreateTeam = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !teamForm.name ||
      !teamForm.sport ||
      !teamForm.level ||
      !teamForm.location ||
      !teamForm.maxMembers ||
      !teamForm.description
    ) {
      setTeamFormSuccess(false);
      return;
    }
    const newTeam = {
      id: Date.now(),
      name: teamForm.name,
      sport: teamForm.sport,
      members: 1,
      maxMembers: parseInt(teamForm.maxMembers),
      location: teamForm.location,
      level: teamForm.level,
      image:
        "/placeholder.svg?height=60&width=60&text=" +
        encodeURIComponent(teamForm.name),
      description: teamForm.description,
      nextMatch: "TBD",
    };
    setTeamsState([newTeam, ...teamsState]);
    setTeamFormSuccess(true);
    setTeamForm({
      name: "",
      sport: "",
      level: "",
      location: "",
      maxMembers: "",
      description: "",
    });
  };

  // Handle create tournament
  const handleCreateTournament = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !tournamentForm.name ||
      !tournamentForm.sport ||
      !tournamentForm.location ||
      !tournamentForm.startDate ||
      !tournamentForm.endDate ||
      !tournamentForm.prize ||
      !tournamentForm.registrationFee ||
      !tournamentForm.maxTeams ||
      !tournamentForm.description
    ) {
      setTournamentFormSuccess(false);
      return;
    }
    const newTournament = {
      id: Date.now(),
      name: tournamentForm.name,
      sport: tournamentForm.sport,
      date: `${tournamentForm.startDate} - ${tournamentForm.endDate}`,
      location: tournamentForm.location,
      prize: tournamentForm.prize,
      teams: 0,
      maxTeams: parseInt(tournamentForm.maxTeams),
      registrationFee: tournamentForm.registrationFee,
      image:
        "/placeholder.svg?height=200&width=300&text=" +
        encodeURIComponent(tournamentForm.name),
      organizer: user ? user.firstName : "You",
    };
    setTournamentsState([newTournament, ...tournamentsState]);
    setTournamentFormSuccess(true);
    setTournamentForm({
      name: "",
      sport: "",
      location: "",
      startDate: "",
      endDate: "",
      prize: "",
      registrationFee: "",
      maxTeams: "",
      description: "",
    });
  };

  // Handle connect (simulate sending a message)
  const handleSendConnect = () => {
    setConnectSuccess(true);
    setConnectMessage("");
    setTimeout(() => {
      setConnectSuccess(false);
      setSelectedPlayer(null);
      setSelectedTeam(null);
    }, 1200);
  };

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
                href="/turfs"
                className="text-slate-400 hover:text-emerald-400 transition-colors"
              >
                Find Turfs
              </Link>
              <Link
                href="/tournaments"
                className="text-slate-400 hover:text-emerald-400 transition-colors"
              >
                Tournaments
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
                    className="text-slate-400 hover:text-white"
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="ghost"
                    asChild
                    className="text-slate-400 hover:text-white"
                  >
                    <Link href="/login">Login</Link>
                  </Button>
                  <Button
                    asChild
                    className="bg-emerald-600 hover:bg-emerald-700"
                  >
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
            Connect with Sports Community
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Find teammates, join teams, participate in tournaments, and build
            lasting friendships through sports
          </p>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-4 bg-slate-900">
            <TabsTrigger
              value="find-players"
              className="text-white data-[state=active]:bg-emerald-600"
            >
              Find Players
            </TabsTrigger>
            <TabsTrigger
              value="teams"
              className="text-white data-[state=active]:bg-emerald-600"
            >
              Teams
            </TabsTrigger>
            <TabsTrigger
              value="tournaments"
              className="text-white data-[state=active]:bg-emerald-600"
            >
              Tournaments
            </TabsTrigger>
            <TabsTrigger
              value="create"
              className="text-white data-[state=active]:bg-emerald-600"
            >
              Create
            </TabsTrigger>
          </TabsList>

          <TabsContent value="find-players" className="space-y-6">
            {/* Search and Filters */}
            <Card className="bg-slate-900 border-slate-800">
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="md:col-span-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <Input
                        placeholder="Search players or locations..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 bg-slate-800 border-slate-700 text-white placeholder-slate-400"
                      />
                    </div>
                  </div>

                  <Select
                    value={selectedSport}
                    onValueChange={setSelectedSport}
                  >
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
                      <SelectItem value="bandra" className="text-white">
                        Bandra
                      </SelectItem>
                      <SelectItem value="andheri" className="text-white">
                        Andheri
                      </SelectItem>
                      <SelectItem value="powai" className="text-white">
                        Powai
                      </SelectItem>
                      <SelectItem value="malad" className="text-white">
                        Malad
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Players Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPlayers.map((player) => (
                <Card
                  key={player.id}
                  className="bg-slate-900 border-slate-800 hover:shadow-lg transition-shadow"
                >
                  <CardHeader>
                    <div className="flex items-center space-x-4">
                      <Avatar className="w-12 h-12">
                        <AvatarImage
                          src={player.avatar || "/placeholder.svg"}
                          alt={player.name}
                        />
                        <AvatarFallback className="bg-emerald-600 text-white">
                          {player.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <CardTitle className="text-lg text-white">
                          {player.name}
                        </CardTitle>
                        <CardDescription className="flex items-center text-slate-400">
                          <MapPin className="w-4 h-4 mr-1" />
                          {player.location}
                        </CardDescription>
                      </div>
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm font-medium ml-1 text-white">
                          {player.rating}
                        </span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <Badge
                          variant="secondary"
                          className="bg-slate-700 text-slate-300"
                        >
                          {player.sport}
                        </Badge>
                        <Badge
                          variant="outline"
                          className="border-slate-600 text-slate-300"
                        >
                          {player.skill}
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-400">{player.bio}</p>
                      <div className="flex justify-between text-sm text-slate-500">
                        <span>{player.gamesPlayed} games played</span>
                        <span>{player.availability}</span>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                          onClick={() => {
                            setSelectedPlayer(player);
                            setConnectMessage("");
                            setConnectSuccess(false);
                          }}
                        >
                          <UserPlus className="w-4 h-4 mr-2" />
                          Connect
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          className="border-slate-700 text-slate-300 hover:bg-slate-800 bg-transparent"
                          onClick={() => {
                            setSelectedPlayer(player);
                            setConnectMessage("");
                            setConnectSuccess(false);
                          }}
                        >
                          <MessageCircle className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="teams" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {teamsState.map((team) => (
                <Card
                  key={team.id}
                  className="bg-slate-900 border-slate-800 hover:shadow-lg transition-shadow"
                >
                  <CardHeader>
                    <div className="flex items-center space-x-4">
                      <Image
                        src={team.image || "/placeholder.svg"}
                        alt={team.name}
                        width={60}
                        height={60}
                        className="rounded-lg"
                      />
                      <div className="flex-1">
                        <CardTitle className="text-lg text-white">
                          {team.name}
                        </CardTitle>
                        <CardDescription className="text-slate-400">
                          {team.sport} • {team.level}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <p className="text-sm text-slate-400">
                        {team.description}
                      </p>
                      <div className="flex justify-between items-center text-sm">
                        <span className="flex items-center text-slate-400">
                          <Users className="w-4 h-4 mr-1" />
                          {team.members}/{team.maxMembers} members
                        </span>
                        <span className="flex items-center text-slate-400">
                          <MapPin className="w-4 h-4 mr-1" />
                          {team.location}
                        </span>
                      </div>
                      <div className="flex items-center text-sm text-slate-500">
                        <Calendar className="w-4 h-4 mr-1" />
                        Next match: {team.nextMatch}
                      </div>
                      <Button
                        className="w-full bg-emerald-600 hover:bg-emerald-700"
                        onClick={() => {
                          setSelectedTeam(team);
                          setConnectMessage("");
                          setConnectSuccess(false);
                        }}
                      >
                        Join Team
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="tournaments" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tournamentsState.map((tournament) => (
                <Card
                  key={tournament.id}
                  className="bg-slate-900 border-slate-800 overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="relative">
                    <Image
                      src={tournament.image || "/placeholder.svg"}
                      alt={tournament.name}
                      width={300}
                      height={200}
                      className="w-full h-48 object-cover"
                    />
                    <Badge className="absolute top-3 right-3 bg-emerald-600">
                      Prize: {tournament.prize}
                    </Badge>
                  </div>
                  <CardHeader>
                    <CardTitle className="text-lg text-white">
                      {tournament.name}
                    </CardTitle>
                    <CardDescription className="text-slate-400">
                      Organized by {tournament.organizer}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center text-sm text-slate-400">
                        <Calendar className="w-4 h-4 mr-2" />
                        {tournament.date}
                      </div>
                      <div className="flex items-center text-sm text-slate-400">
                        <MapPin className="w-4 h-4 mr-2" />
                        {tournament.location}
                      </div>
                      <div className="flex items-center text-sm text-slate-400">
                        <Trophy className="w-4 h-4 mr-2" />
                        {tournament.teams}/{tournament.maxTeams} teams
                        registered
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-slate-300">
                          Fee: {tournament.registrationFee}
                        </span>
                        <Badge
                          variant="secondary"
                          className="bg-slate-700 text-slate-300"
                        >
                          {tournament.sport}
                        </Badge>
                      </div>
                      <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
                        Register Team
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="create" className="space-y-6">
            <div className="grid md:grid-cols-1 gap-8">
              {/* Only Create Team Card */}
              <Card className="bg-slate-900 border-slate-800">
                <CardHeader>
                  <CardTitle className="flex items-center text-white">
                    <Users className="w-5 h-5 mr-2" />
                    Create a Team
                  </CardTitle>
                  <CardDescription className="text-slate-400">
                    Start your own sports team and recruit players
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {teamFormSuccess && (
                    <div className="bg-emerald-700 text-white rounded px-4 py-2 text-center mb-4">
                      Team created successfully!
                    </div>
                  )}
                  <form onSubmit={handleCreateTeam} className="space-y-4">
                    <div>
                      <label className="block text-slate-300 mb-1">
                        Team Name
                      </label>
                      <Input
                        name="name"
                        value={teamForm.name}
                        onChange={handleTeamFormChange}
                        className="bg-slate-800 border-slate-700 text-white"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 mb-1">Sport</label>
                      <select
                        name="sport"
                        value={teamForm.sport}
                        onChange={handleTeamFormChange}
                        className="w-full bg-slate-800 border-slate-700 text-white rounded px-3 py-2"
                        required
                      >
                        <option value="">Select Sport</option>
                        <option value="Football">Football</option>
                        <option value="Cricket">Cricket</option>
                        <option value="Tennis">Tennis</option>
                        <option value="Badminton">Badminton</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-slate-300 mb-1">Level</label>
                      <select
                        name="level"
                        value={teamForm.level}
                        onChange={handleTeamFormChange}
                        className="w-full bg-slate-800 border-slate-700 text-white rounded px-3 py-2"
                        required
                      >
                        <option value="">Select Level</option>
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-slate-300 mb-1">
                        Location
                      </label>
                      <Input
                        name="location"
                        value={teamForm.location}
                        onChange={handleTeamFormChange}
                        className="bg-slate-800 border-slate-700 text-white"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 mb-1">
                        Max Members
                      </label>
                      <Input
                        name="maxMembers"
                        type="number"
                        min={2}
                        value={teamForm.maxMembers}
                        onChange={handleTeamFormChange}
                        className="bg-slate-800 border-slate-700 text-white"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-slate-300 mb-1">
                        Description
                      </label>
                      <textarea
                        name="description"
                        value={teamForm.description}
                        onChange={handleTeamFormChange}
                        className="w-full bg-slate-800 border-slate-700 text-white rounded px-3 py-2"
                        rows={2}
                        required
                      />
                    </div>
                    <Button
                      className="w-full bg-emerald-600 hover:bg-emerald-700"
                      type="submit"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Create Team
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
            {/* Community Stats */}
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader>
                <CardTitle className="text-white">Community Stats</CardTitle>
                <CardDescription className="text-slate-400">
                  See how active our sports community is
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-emerald-400">
                      2,847
                    </div>
                    <p className="text-sm text-slate-400">Active Players</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-400">156</div>
                    <p className="text-sm text-slate-400">Teams</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-400">23</div>
                    <p className="text-sm text-slate-400">Tournaments</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-orange-400">
                      1,234
                    </div>
                    <p className="text-sm text-slate-400">Matches Played</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Player Connect Modal */}
        {selectedPlayer && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
            <div className="bg-slate-900 rounded-xl shadow-2xl w-full max-w-md p-6 relative">
              <Button
                className="absolute top-3 right-3 text-slate-400 hover:text-white text-2xl"
                onClick={() => setSelectedPlayer(null)}
                aria-label="Close"
              >
                ×
              </Button>
              <div className="flex items-center space-x-4 mb-4">
                <Avatar className="w-14 h-14">
                  <AvatarImage
                    src={selectedPlayer.avatar || "/placeholder.svg"}
                    alt={selectedPlayer.name}
                  />
                  <AvatarFallback className="bg-emerald-600 text-white">
                    {selectedPlayer.name
                      .split(" ")
                      .map((n: string) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="text-xl font-bold text-white">
                    {selectedPlayer.name}
                  </div>
                  <div className="text-slate-400">
                    {selectedPlayer.sport} • {selectedPlayer.skill}
                  </div>
                  <div className="text-slate-400">
                    {selectedPlayer.location}
                  </div>
                </div>
              </div>
              <div className="mb-2 text-slate-300">{selectedPlayer.bio}</div>
              <div className="mb-4 text-slate-400 text-sm">
                Availability: {selectedPlayer.availability} <br />
                Games Played: {selectedPlayer.gamesPlayed} <br />
                Rating: {selectedPlayer.rating}
              </div>
              <div className="mb-2 font-semibold text-white">
                Send a message to connect:
              </div>
              <textarea
                className="w-full bg-slate-800 border-slate-700 text-white rounded px-3 py-2 mb-2"
                rows={2}
                placeholder="Write your message..."
                value={connectMessage}
                onChange={(e) => setConnectMessage(e.target.value)}
              />
              <Button
                className="w-full bg-emerald-600 hover:bg-emerald-700"
                onClick={handleSendConnect}
                disabled={!connectMessage.trim() || connectSuccess}
              >
                {connectSuccess ? "Message Sent!" : "Send Message"}
              </Button>
            </div>
          </div>
        )}

        {/* Team Connect Modal */}
        {selectedTeam && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
            <div className="bg-slate-900 rounded-xl shadow-2xl w-full max-w-md p-6 relative">
              <button
                className="absolute top-3 right-3 text-slate-400 hover:text-white text-2xl"
                onClick={() => setSelectedTeam(null)}
                aria-label="Close"
              >
                ×
              </button>
              <div className="flex items-center space-x-4 mb-4">
                <Image
                  src={selectedTeam.image || "/placeholder.svg"}
                  alt={selectedTeam.name}
                  width={60}
                  height={60}
                  className="rounded-lg"
                />
                <div>
                  <div className="text-xl font-bold text-white">
                    {selectedTeam.name}
                  </div>
                  <div className="text-slate-400">
                    {selectedTeam.sport} • {selectedTeam.level}
                  </div>
                  <div className="text-slate-400">{selectedTeam.location}</div>
                </div>
              </div>
              <div className="mb-2 text-slate-300">
                {selectedTeam.description}
              </div>
              <div className="mb-4 text-slate-400 text-sm">
                Members: {selectedTeam.members}/{selectedTeam.maxMembers} <br />
                Next Match: {selectedTeam.nextMatch}
              </div>
              <div className="mb-2 font-semibold text-white">
                Send a message to join:
              </div>
              <textarea
                className="w-full bg-slate-800 border-slate-700 text-white rounded px-3 py-2 mb-2"
                rows={2}
                placeholder="Write your message..."
                value={connectMessage}
                onChange={(e) => setConnectMessage(e.target.value)}
              />
              <Button
                className="w-full bg-emerald-600 hover:bg-emerald-700"
                onClick={handleSendConnect}
                disabled={!connectMessage.trim() || connectSuccess}
              >
                {connectSuccess ? "Request Sent!" : "Send Request"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
