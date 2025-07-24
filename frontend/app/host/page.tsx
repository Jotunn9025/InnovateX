"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  MapPin,
  Upload,
  DollarSign,
  Users,
  CheckCircle,
  ArrowRight,
  Camera,
  Wifi,
  Car,
  Coffee,
  Shield,
} from "lucide-react";
import Link from "next/link";

export default function HostPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Basic Info
    turfName: "",
    description: "",
    location: "",
    fullAddress: "",

    // Sports & Pricing
    sports: [] as string[],
    basePrice: "",
    peakPrice: "",

    // Amenities
    amenities: [] as string[],

    // Images
    images: [] as string[],

    // Contact
    contactName: "",
    phone: "",
    email: "",

    // Rules
    rules: "",
    cancellationPolicy: "",
  });

  const availableSports = [
    "Football",
    "Cricket",
    "Tennis",
    "Badminton",
    "Basketball",
    "Volleyball",
    "Hockey",
  ];

  const availableAmenities = [
    { id: "parking", name: "Parking", icon: Car },
    { id: "changing-room", name: "Changing Room", icon: Users },
    { id: "floodlights", name: "Floodlights", icon: Shield },
    { id: "wifi", name: "WiFi", icon: Wifi },
    { id: "cafeteria", name: "Cafeteria", icon: Coffee },
    { id: "first-aid", name: "First Aid", icon: Shield },
    { id: "equipment-rental", name: "Equipment Rental", icon: Shield },
    { id: "coaching", name: "Coaching Available", icon: Users },
  ];

  const handleSportToggle = (sport: string) => {
    setFormData((prev) => ({
      ...prev,
      sports: prev.sports.includes(sport)
        ? prev.sports.filter((s) => s !== sport)
        : [...prev.sports, sport],
    }));
  };

  const handleAmenityToggle = (amenityId: string) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenityId)
        ? prev.amenities.filter((a) => a !== amenityId)
        : [...prev.amenities, amenityId],
    }));
  };

  const nextStep = () => {
    if (currentStep < 5) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const steps = [
    { number: 1, title: "Basic Info", description: "Tell us about your turf" },
    {
      number: 2,
      title: "Sports & Pricing",
      description: "What sports and pricing",
    },
    { number: 3, title: "Amenities", description: "Available facilities" },
    { number: 4, title: "Images", description: "Upload photos" },
    { number: 5, title: "Contact & Rules", description: "Final details" },
  ];

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
            <div className="flex items-center space-x-3">
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
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            List Your Sports Venue
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Join thousands of venue owners earning money by sharing their sports
            facilities
          </p>
        </div>

        {/* Benefits Section */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="bg-gray-800 border-gray-700 text-center">
            <CardHeader>
              <DollarSign className="w-12 h-12 text-green-400 mx-auto mb-4" />
              <CardTitle className="text-white">Earn Extra Income</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300">
                Generate revenue from your unused sports facilities with
                flexible pricing
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700 text-center">
            <CardHeader>
              <Users className="w-12 h-12 text-green-400 mx-auto mb-4" />
              <CardTitle className="text-white">Reach More Players</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300">
                Connect with thousands of sports enthusiasts looking for quality
                venues
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700 text-center">
            <CardHeader>
              <Shield className="w-12 h-12 text-green-400 mx-auto mb-4" />
              <CardTitle className="text-white">Secure & Reliable</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300">
                Verified bookings, secure payments, and comprehensive insurance
                coverage
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    currentStep >= step.number
                      ? "bg-green-600 text-white"
                      : "bg-gray-700 text-gray-400"
                  }`}
                >
                  {currentStep > step.number ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : (
                    step.number
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`w-full h-1 mx-4 ${
                      currentStep > step.number ? "bg-green-600" : "bg-gray-700"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-2">
              {steps[currentStep - 1].title}
            </h2>
            <p className="text-gray-300">
              {steps[currentStep - 1].description}
            </p>
          </div>
        </div>

        {/* Form Steps */}
        <Card className="bg-gray-800 border-gray-700 max-w-2xl mx-auto">
          <CardContent className="p-8">
            {currentStep === 1 && (
              <div className="space-y-6">
                <div>
                  <Label htmlFor="turfName" className="text-gray-300">
                    Turf Name *
                  </Label>
                  <Input
                    id="turfName"
                    placeholder="e.g., Elite Sports Arena"
                    value={formData.turfName}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        turfName: e.target.value,
                      }))
                    }
                    className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  />
                </div>

                <div>
                  <Label htmlFor="description" className="text-gray-300">
                    Description *
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your sports facility, its features, and what makes it special..."
                    value={formData.description}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 min-h-[100px]"
                  />
                </div>

                <div>
                  <Label htmlFor="location" className="text-gray-300">
                    Location *
                  </Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="location"
                      placeholder="e.g., Bandra, Mumbai"
                      value={formData.location}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          location: e.target.value,
                        }))
                      }
                      className="pl-10 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="fullAddress" className="text-gray-300">
                    Full Address *
                  </Label>
                  <Textarea
                    id="fullAddress"
                    placeholder="Complete address with landmarks..."
                    value={formData.fullAddress}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        fullAddress: e.target.value,
                      }))
                    }
                    className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  />
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-6">
                <div>
                  <Label className="text-gray-300 mb-4 block">
                    Sports Available *
                  </Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {availableSports.map((sport) => (
                      <div
                        key={sport}
                        onClick={() => handleSportToggle(sport)}
                        className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                          formData.sports.includes(sport)
                            ? "bg-green-600 border-green-600 text-white"
                            : "bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600"
                        }`}
                      >
                        <div className="text-center">
                          <span className="font-medium">{sport}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="basePrice" className="text-gray-300">
                      Base Price (per hour) *
                    </Label>
                    <div className="relative">
                      <span className="absolute left-3 top-3 text-gray-400">
                        ₹
                      </span>
                      <Input
                        id="basePrice"
                        type="number"
                        placeholder="1000"
                        value={formData.basePrice}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            basePrice: e.target.value,
                          }))
                        }
                        className="pl-8 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                      />
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                      Regular hours pricing
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="peakPrice" className="text-gray-300">
                      Peak Price (per hour)
                    </Label>
                    <div className="relative">
                      <span className="absolute left-3 top-3 text-gray-400">
                        ₹
                      </span>
                      <Input
                        id="peakPrice"
                        type="number"
                        placeholder="1500"
                        value={formData.peakPrice}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            peakPrice: e.target.value,
                          }))
                        }
                        className="pl-8 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                      />
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                      Evening/weekend pricing
                    </p>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-6">
                <div>
                  <Label className="text-gray-300 mb-4 block">
                    Available Amenities
                  </Label>
                  <div className="grid grid-cols-2 gap-4">
                    {availableAmenities.map((amenity) => (
                      <div
                        key={amenity.id}
                        onClick={() => handleAmenityToggle(amenity.id)}
                        className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                          formData.amenities.includes(amenity.id)
                            ? "bg-green-600 border-green-600 text-white"
                            : "bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600"
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <amenity.icon className="w-5 h-5" />
                          <span className="font-medium">{amenity.name}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div className="space-y-6">
                <div>
                  <Label className="text-gray-300 mb-4 block">
                    Upload Images *
                  </Label>
                  <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center">
                    <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-300 mb-2">
                      Drag and drop images here, or click to browse
                    </p>
                    <p className="text-sm text-gray-400 mb-4">
                      Upload at least 3 high-quality images of your facility
                    </p>
                    <Button
                      variant="outline"
                      className="bg-gray-700 border-gray-600 text-white"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Choose Files
                    </Button>
                  </div>
                </div>

                <div>
                  <h4 className="text-gray-300 font-medium mb-3">
                    Image Guidelines:
                  </h4>
                  <ul className="space-y-2 text-sm text-gray-400">
                    <li>• Upload at least 3 images (maximum 10)</li>
                    <li>
                      • Include main playing area, changing rooms, and parking
                    </li>
                    <li>• Use high-resolution images (minimum 1024x768)</li>
                    <li>• Show different angles and lighting conditions</li>
                    <li>• Avoid blurry or dark images</li>
                  </ul>
                </div>
              </div>
            )}

            {currentStep === 5 && (
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="contactName" className="text-gray-300">
                      Contact Person *
                    </Label>
                    <Input
                      id="contactName"
                      placeholder="Your name"
                      value={formData.contactName}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          contactName: e.target.value,
                        }))
                      }
                      className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone" className="text-gray-300">
                      Phone Number *
                    </Label>
                    <Input
                      id="phone"
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          phone: e.target.value,
                        }))
                      }
                      className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="email" className="text-gray-300">
                    Email Address *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                    className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  />
                </div>

                <div>
                  <Label htmlFor="rules" className="text-gray-300">
                    Facility Rules
                  </Label>
                  <Textarea
                    id="rules"
                    placeholder="List any specific rules for your facility (e.g., no smoking, proper attire required, etc.)"
                    value={formData.rules}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        rules: e.target.value,
                      }))
                    }
                    className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  />
                </div>

                <div>
                  <Label htmlFor="cancellationPolicy" className="text-gray-300">
                    Cancellation Policy
                  </Label>
                  <Select>
                    <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                      <SelectValue placeholder="Select cancellation policy" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-700 border-gray-600">
                      <SelectItem value="flexible" className="text-white">
                        Flexible - Free cancellation up to 2 hours before
                      </SelectItem>
                      <SelectItem value="moderate" className="text-white">
                        Moderate - Free cancellation up to 24 hours before
                      </SelectItem>
                      <SelectItem value="strict" className="text-white">
                        Strict - No refunds for cancellations
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
                className="bg-gray-700 border-gray-600 text-white"
              >
                Previous
              </Button>

              {currentStep < 5 ? (
                <Button
                  onClick={nextStep}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button className="bg-green-600 hover:bg-green-700">
                  Submit for Review
                  <CheckCircle className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* FAQ Section */}
        <div className="mt-16 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Frequently Asked Questions
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">
                  How much can I earn?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">
                  Earnings vary based on location, facility quality, and demand.
                  Most hosts earn ₹15,000 - ₹50,000 per month.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">How do I get paid?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">
                  Payments are processed automatically after each booking.
                  You'll receive money in your bank account within 24-48 hours.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">
                  What if there's damage?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">
                  All bookings include damage protection. We handle claims and
                  ensure you're compensated for any damages.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">
                  Can I block certain dates?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">
                  Yes, you have full control over your calendar. Block dates for
                  maintenance, personal use, or any other reason.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
