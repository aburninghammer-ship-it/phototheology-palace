import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Video, Users, Plus, Trash2 } from "lucide-react";

const LiveStudy = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [rooms, setRooms] = useState<any[]>([]);
  const [roomName, setRoomName] = useState("");
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    if (user && user.id) {
      fetchRooms();
      
      const channel = supabase
        .channel("study_rooms_changes")
        .on("postgres_changes", { event: "*", schema: "public", table: "study_rooms" }, () => {
          fetchRooms();
        })
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user]);

  const fetchRooms = async () => {
    const { data: roomsData } = await supabase
      .from("study_rooms")
      .select("*");
    
    if (roomsData) {
      const roomsWithProfiles = await Promise.all(
        roomsData.map(async (room) => {
          const { data: profile } = await supabase
            .from("profiles")
            .select("username")
            .eq("id", room.host_id)
            .single();
          
          return { ...room, profiles: profile || { username: "Unknown" } };
        })
      );
      setRooms(roomsWithProfiles);
    }
  };

  const createRoom = async () => {
    if (!roomName.trim()) return;

    setCreating(true);
    try {
      const { data, error } = await supabase
        .from("study_rooms")
        .insert({
          name: roomName,
          host_id: user!.id,
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Room created!",
        description: "Your study room is ready.",
      });

      navigate(`/live-study/${data.id}`);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setCreating(false);
    }
  };

  const deleteRoom = async (roomId: string) => {
    try {
      const { error } = await supabase
        .from("study_rooms")
        .delete()
        .eq("id", roomId);

      if (error) throw error;

      toast({
        title: "Room deleted",
        description: "Study room has been removed.",
      });

      fetchRooms();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="flex items-center justify-between">
            <h1 className="text-4xl font-bold flex items-center gap-2">
              <Video className="h-8 w-8 text-blue-500" />
              Live Study Rooms
            </h1>
            <Badge variant="outline" className="text-base px-4 py-2">
              Study Together in Real-Time
            </Badge>
          </div>

          <Card className="mb-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
            <CardHeader>
              <CardTitle className="text-2xl">Welcome to Live Study</CardTitle>
              <CardDescription className="text-base leading-relaxed">
                Create or join study rooms to explore Scripture together. Perfect for Bible studies, prayer groups, or collaborative 
                learning with friends. Share insights, discuss passages, and grow together in understanding. Host your own room or 
                join an active community study session!
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Create New Room
              </CardTitle>
              <CardDescription>Start a new study session</CardDescription>
            </CardHeader>
            <CardContent className="flex gap-2">
              <Input
                placeholder="Room name..."
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
              />
              <Button onClick={createRoom} disabled={creating}>
                Create
              </Button>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {rooms.map((room) => (
              <Card key={room.id}>
                <CardHeader>
                  <CardTitle>{room.name}</CardTitle>
                  <CardDescription>
                    Host: {room.profiles?.username || "Unknown"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button
                    onClick={() => navigate(`/live-study/${room.id}`)}
                    className="w-full"
                  >
                    <Users className="mr-2 h-4 w-4" />
                    Join Room
                  </Button>
                  {room.host_id === user?.id && (
                    <Button
                      onClick={() => deleteRoom(room.id)}
                      variant="destructive"
                      className="w-full"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete Room
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {rooms.length === 0 && (
            <Card className="text-center py-12">
              <CardContent className="space-y-4">
                <Users className="h-16 w-16 text-muted-foreground mx-auto opacity-30" />
                <div>
                  <h3 className="text-xl font-semibold mb-2">No Active Study Rooms</h3>
                  <p className="text-muted-foreground mb-6">
                    Be the first to create a study room and invite others to join your Bible study session!
                  </p>
                  <div className="max-w-md mx-auto mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <p className="text-sm text-left">
                      <strong>Study Room Features:</strong><br />
                      • Real-time chat with other participants<br />
                      • Share verses and insights<br />
                      • Collaborative Bible exploration<br />
                      • Public or private rooms<br />
                      • Up to 10 participants per room
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
};

export default LiveStudy;
