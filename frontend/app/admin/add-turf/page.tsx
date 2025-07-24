"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useUser } from "@/contexts/UserContext";
import { useRouter } from "next/navigation";
import axios from "axios";

const allSports = [
  "Football",
  "Cricket",
  "Tennis",
  "Badminton",
  "Basketball",
  "Volleyball",
  "Hockey",
];
const allAmenities = [
  "Parking",
  "Washroom",
  "Drinking Water",
  "Changing Room",
  "Floodlights",
  "Seating",
  "Cafeteria",
  "WiFi",
];

export default function AddTurfPage() {
  const { user } = useUser();
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    location: "",
    fullAddress: "",
    sports: [] as string[],
    amenities: [] as string[],
    images: [""],
    rules: "",
    ratings: 0.0,
    reviews: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleMultiChange = (name: string, value: string) => {
    setForm((prev) => {
      const arr = prev[name as keyof typeof prev] as string[];
      if (arr.includes(value)) {
        return { ...prev, [name]: arr.filter((v) => v !== value) };
      } else {
        return { ...prev, [name]: [...arr, value] };
      }
    });
  };
  const handleImageChange = (idx: number, value: string) => {
    setForm((prev) => {
      const images = [...prev.images];
      images[idx] = value;
      return { ...prev, images };
    });
  };
  const addImageField = () => {
    setForm((prev) => ({ ...prev, images: [...prev.images, ""] }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setError(null);
    if (!user) {
      setError("You must be logged in as admin");
      return;
    }
    if (
      !form.name ||
      !form.location ||
      !form.fullAddress ||
      form.sports.length === 0
    ) {
      setError(
        "Please fill all required fields and select at least one sport."
      );
      return;
    }
    setLoading(true);
    try {
      await axios.post("http://localhost:5000/api/turfs", {
        ...form,
        rules: form.rules.split("\n").filter((r) => r.trim()),
        owner: user.id,
      });
      router.push("/admin");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to add turf");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center py-8">
      <Card className="w-full max-w-2xl bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white text-2xl">Add New Turf</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-white mb-1">Turf Name *</label>
              <Input
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="bg-gray-700 text-white"
              />
            </div>
            <div>
              <label className="block text-white mb-1">Location *</label>
              <Input
                name="location"
                value={form.location}
                onChange={handleChange}
                required
                className="bg-gray-700 text-white"
              />
            </div>
            <div>
              <label className="block text-white mb-1">Full Address *</label>
              <Input
                name="fullAddress"
                value={form.fullAddress}
                onChange={handleChange}
                required
                className="bg-gray-700 text-white"
              />
            </div>
            <div>
              <label className="block text-white mb-1">Sports *</label>
              <div className="flex flex-wrap gap-2">
                {allSports.map((sport) => (
                  <label
                    key={sport}
                    className="flex items-center gap-1 text-white"
                  >
                    <input
                      type="checkbox"
                      checked={form.sports.includes(sport)}
                      onChange={() => handleMultiChange("sports", sport)}
                    />
                    {sport}
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-white mb-1">Amenities</label>
              <div className="flex flex-wrap gap-2">
                {allAmenities.map((amenity) => (
                  <label
                    key={amenity}
                    className="flex items-center gap-1 text-white"
                  >
                    <input
                      type="checkbox"
                      checked={form.amenities.includes(amenity)}
                      onChange={() => handleMultiChange("amenities", amenity)}
                    />
                    {amenity}
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-white mb-1">Images (URLs)</label>
              {form.images.map((img, idx) => (
                <div key={idx} className="flex gap-2 mb-2">
                  <Input
                    value={img}
                    onChange={(e) => handleImageChange(idx, e.target.value)}
                    className="bg-gray-700 text-white"
                    placeholder="https://..."
                  />
                  {idx === form.images.length - 1 && (
                    <Button
                      type="button"
                      onClick={addImageField}
                      className="bg-emerald-600"
                    >
                      +
                    </Button>
                  )}
                </div>
              ))}
            </div>
            <div>
              <label className="block text-white mb-1">Rules</label>
              <Textarea
                name="rules"
                value={form.rules}
                onChange={handleChange}
                className="bg-gray-700 text-white"
                placeholder="One rule per line"
                rows={3}
              />
            </div>
            {error && <div className="text-red-500 text-sm">{error}</div>}
            <Button
              type="submit"
              className="w-full bg-emerald-600"
              disabled={loading}
            >
              {loading ? "Adding..." : "Add Turf"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
