import { useParams, Link } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { RoomCard } from "@/components/RoomCard";
import { palaceFloors } from "@/data/palaceData";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const FloorDetail = () => {
  const { floorNumber } = useParams();
  const floorNum = parseInt(floorNumber || "1");
  const floor = palaceFloors.find(f => f.number === floorNum);
  
  if (!floor) {
    return (
      <div className="min-h-screen bg-gradient-subtle">
        <Navigation />
        <div className="pt-24 pb-16 px-4 text-center">
          <h1 className="font-serif text-3xl mb-4">Floor not found</h1>
          <Button asChild>
            <Link to="/palace">Return to Palace</Link>
          </Button>
        </div>
      </div>
    );
  }

  const prevFloor = palaceFloors.find(f => f.number === floorNum - 1);
  const nextFloor = palaceFloors.find(f => f.number === floorNum + 1);

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navigation />
      
      <div className="pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-6xl">
          {/* Floor Header */}
          <div className="mb-12">
            <Button asChild variant="ghost" className="mb-4">
              <Link to="/palace">
                <ChevronLeft className="mr-2 h-4 w-4" />
                Back to Palace
              </Link>
            </Button>
            
            <div className="mb-4">
              <Badge variant="outline" className="font-mono mb-2">
                Floor {floor.number} of 8
              </Badge>
              <h1 className="font-serif text-4xl md:text-5xl font-bold mb-2">
                {floor.name}
              </h1>
              <p className="text-xl text-accent font-medium mb-4">{floor.subtitle}</p>
              <p className="text-lg text-muted-foreground max-w-3xl">
                {floor.description}
              </p>
            </div>
          </div>

          {/* Rooms Grid */}
          <div className="mb-12">
            <h2 className="font-serif text-2xl font-semibold mb-6">
              {floor.rooms.length} Rooms
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {floor.rooms.map((room) => (
                <RoomCard key={room.id} room={room} floorNumber={floor.number} />
              ))}
            </div>
          </div>

          {/* Floor Navigation */}
          <div className="flex justify-between items-center pt-8 border-t border-border">
            {prevFloor ? (
              <Button asChild variant="outline">
                <Link to={`/floor/${prevFloor.number}`}>
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Floor {prevFloor.number}: {prevFloor.name}
                </Link>
              </Button>
            ) : (
              <div />
            )}
            
            {nextFloor && (
              <Button asChild className="gradient-palace text-primary-foreground">
                <Link to={`/floor/${nextFloor.number}`}>
                  Floor {nextFloor.number}: {nextFloor.name}
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FloorDetail;
