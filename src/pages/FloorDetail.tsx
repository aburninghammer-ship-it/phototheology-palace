import { useParams, Link } from "react-router-dom";
import { palaceFloors } from "@/data/palaceData";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, ArrowLeft, Lock, Layers, BookOpen, Code, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRoomUnlock } from "@/hooks/useRoomUnlock";
import { useAuth } from "@/hooks/useAuth";
import { FloorRoomCard } from "@/components/FloorRoomCard";
import { HowItWorksDialog } from "@/components/HowItWorksDialog";
import { motion } from "framer-motion";

export default function FloorDetail() {
  const { floorNumber } = useParams();
  const { user } = useAuth();
  const floor = palaceFloors.find(f => f.number === Number(floorNumber));

  if (!floor) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Floor Not Found</h1>
          <Link to="/palace">
            <Button>Return to Palace</Button>
          </Link>
        </div>
      </div>
    );
  }

  const gradient = [
    "gradient-palace",
    "gradient-royal", 
    "gradient-ocean",
    "gradient-forest",
    "gradient-sunset",
    "gradient-warmth",
    "gradient-dreamy",
    "gradient-palace"
  ][floor.number - 1];

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navigation />
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <Link to="/palace">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Palace
          </Button>
        </Link>

        <div className={`${gradient} rounded-2xl p-10 mb-8 text-white relative overflow-hidden shadow-2xl`}>
          {/* Animated background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
          </div>
          
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="text-white border-white/70 text-lg px-4 py-1 font-bold backdrop-blur-sm bg-white/10">
                  Floor {floor.number}
                </Badge>
                <Badge variant="outline" className="text-white border-white/70 px-4 py-1 backdrop-blur-sm bg-white/10">
                  {floor.rooms.length} Rooms ✨
                </Badge>
              </div>
              <HowItWorksDialog
                title={`How to Use Floor ${floor.number}`}
                steps={[
                  {
                    title: `Floor ${floor.number}: ${floor.name}`,
                    description: floor.description,
                    highlights: [
                      floor.subtitle,
                      `${floor.rooms.length} rooms to explore`,
                      "Each room teaches specific principles"
                    ],
                    icon: Layers,
                  },
                  {
                    title: "Room Cards",
                    description: "Each card represents a room on this floor. Click any room card to dive deeper into its specific teachings and exercises.",
                    highlights: [
                      "Room code and full name",
                      "Detailed description",
                      "Click to explore"
                    ],
                    icon: BookOpen,
                  },
                  {
                    title: "Room Codes",
                    description: "Every room has a unique code (like SR, OR, CR) used throughout the Phototheology system for quick reference.",
                    highlights: [
                      "Short memorable codes",
                      "Used in Bible study",
                      "Part of PT language"
                    ],
                    icon: Code,
                  },
                  {
                    title: "Practical Application",
                    description: "Use these rooms when studying Scripture to organize your insights and apply the correct principles to each passage.",
                    highlights: [
                      "Systematic Bible study",
                      "Organized thinking",
                      "Christ-centered approach"
                    ],
                    icon: Lightbulb,
                  },
                ]}
              />
            </div>
            
            <h1 className="text-5xl md:text-6xl font-serif font-black mb-3 drop-shadow-2xl tracking-tight">{floor.name}</h1>
            <p className="text-2xl md:text-3xl mb-5 opacity-95 font-medium drop-shadow-lg">{floor.subtitle} ✨</p>
            <p className="text-lg opacity-90 leading-relaxed max-w-3xl drop-shadow-md">{floor.description}</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
          {floor.rooms.map((room, index) => (
            <motion.div
              key={room.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.4 }}
              className={index % 5 === 0 ? "md:col-span-2 lg:col-span-1" : ""}
            >
              <FloorRoomCard
                room={room}
                floorNumber={floor.number}
                gradient={gradient}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
