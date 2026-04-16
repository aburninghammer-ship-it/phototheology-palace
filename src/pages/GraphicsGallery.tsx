import React, { useState } from 'react';
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { LayoutGrid, BookOpen, Lightbulb, ChevronRight, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { GRAPHICS_REGISTRY } from "@/components/room/RoomGraphicsDisplay";
import { ROOM_NAMES, FLOOR_ROOMS } from "@/components/room-graphics/types";

const FLOOR_NAMES: Record<number, string> = {
  1: "Furnishing Floor",
  2: "Investigation Floor",
  3: "Freestyle Floor",
  4: "Next Level Floor",
  5: "Vision Floor",
  6: "Three Heavens Floor",
  7: "Spiritual & Emotional Floor",
};

const FLOOR_COLORS: Record<number, string> = {
  1: "from-blue-500 to-indigo-600",
  2: "from-purple-500 to-violet-600",
  3: "from-green-500 to-emerald-600",
  4: "from-amber-500 to-orange-600",
  5: "from-rose-500 to-pink-600",
  6: "from-cyan-500 to-teal-600",
  7: "from-red-500 to-rose-600",
};

export default function GraphicsGallery() {
  const [selectedFloor, setSelectedFloor] = useState<number>(1);
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'flowchart' | 'concept' | 'example'>('flowchart');
  const [searchTerm, setSearchTerm] = useState('');

  const rooms = FLOOR_ROOMS[selectedFloor] || [];
  const filteredRooms = rooms.filter(roomId => {
    const roomName = ROOM_NAMES[roomId] || roomId;
    return roomName.toLowerCase().includes(searchTerm.toLowerCase()) && GRAPHICS_REGISTRY[roomId];
  });

  const currentRoom = selectedRoom || filteredRooms[0];
  const graphics = currentRoom ? GRAPHICS_REGISTRY[currentRoom] : null;

  const renderGraphic = () => {
    if (!graphics) return <div className="text-center text-muted-foreground py-20">Select a room to view graphics</div>;
    
    const { flowchart: Flowchart, concept: Concept, example: Example } = graphics;
    
    switch (activeTab) {
      case 'flowchart':
        return <Flowchart />;
      case 'concept':
        return <Concept />;
      case 'example':
        return <Example />;
      default:
        return <Flowchart />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navigation />
      
      <div className="container max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
            📊 At-a-Glance Graphics Gallery
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Visual teaching diagrams for every room in the Palace. Flowcharts show the method, 
            Concepts explain the "why", and Examples demonstrate application.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar - Floor & Room Selection */}
          <div className="lg:col-span-1 space-y-4">
            {/* Floor Tabs */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Select Floor</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[180px]">
                  <div className="p-3 space-y-1">
                    {[1, 2, 3, 4, 5, 6, 7].map(floor => (
                      <Button
                        key={floor}
                        variant={selectedFloor === floor ? "default" : "ghost"}
                        className="w-full justify-start text-left"
                        onClick={() => {
                          setSelectedFloor(floor);
                          setSelectedRoom(null);
                        }}
                      >
                        <Badge 
                          variant="outline" 
                          className={`mr-2 w-6 h-6 p-0 flex items-center justify-center ${selectedFloor === floor ? 'bg-white text-primary' : ''}`}
                        >
                          {floor}
                        </Badge>
                        <span className="truncate text-sm">{FLOOR_NAMES[floor]}</span>
                      </Button>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Room Selection */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Select Room</CardTitle>
                <div className="relative mt-2">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search rooms..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8 h-9"
                  />
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[250px]">
                  <div className="p-3 space-y-1">
                    {filteredRooms.map(roomId => (
                      <Button
                        key={roomId}
                        variant={currentRoom === roomId ? "secondary" : "ghost"}
                        className="w-full justify-between text-left h-auto py-2"
                        onClick={() => setSelectedRoom(roomId)}
                      >
                        <span className="truncate text-sm">{ROOM_NAMES[roomId] || roomId}</span>
                        <ChevronRight className="h-4 w-4 shrink-0" />
                      </Button>
                    ))}
                    {filteredRooms.length === 0 && (
                      <p className="text-sm text-muted-foreground text-center py-4">
                        No graphics available
                      </p>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Quick Link to Room */}
            {currentRoom && (
              <Link to={`/palace/${selectedFloor}/${currentRoom}`}>
                <Button variant="outline" className="w-full">
                  Go to Room <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            )}
          </div>

          {/* Main Content - Graphics Display */}
          <div className="lg:col-span-3">
            <Card className="h-full">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className={`bg-gradient-to-r ${FLOOR_COLORS[selectedFloor]} text-white`}>
                        Floor {selectedFloor}
                      </Badge>
                      <CardTitle className="text-xl">
                        {ROOM_NAMES[currentRoom] || 'Select a Room'}
                      </CardTitle>
                    </div>
                    <CardDescription>
                      Visual teaching diagram for mastering this room's method
                    </CardDescription>
                  </div>
                  
                  {/* Graphic Type Tabs */}
                  <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
                    <TabsList>
                      <TabsTrigger value="flowchart" className="flex items-center gap-1">
                        <LayoutGrid className="h-4 w-4" />
                        <span className="hidden sm:inline">Method</span>
                      </TabsTrigger>
                      <TabsTrigger value="concept" className="flex items-center gap-1">
                        <Lightbulb className="h-4 w-4" />
                        <span className="hidden sm:inline">Concept</span>
                      </TabsTrigger>
                      <TabsTrigger value="example" className="flex items-center gap-1">
                        <BookOpen className="h-4 w-4" />
                        <span className="hidden sm:inline">Example</span>
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="bg-gradient-to-br from-muted/30 to-muted/10 rounded-xl p-4 min-h-[500px] overflow-x-auto">
                  {renderGraphic()}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
