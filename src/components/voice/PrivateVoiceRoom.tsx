import { useState, useEffect } from 'react';
import { Users, Copy, Check, Plus, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SimpleVoiceRoom } from './SimpleVoiceRoom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface PrivateVoiceRoomProps {
  className?: string;
}

export function PrivateVoiceRoom({ className }: PrivateVoiceRoomProps) {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [activeRoom, setActiveRoom] = useState<string | null>(null);
  const [roomName, setRoomName] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [displayName, setDisplayName] = useState('User');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('display_name')
          .eq('id', user.id)
          .single();
        
        if (data?.display_name) {
          setDisplayName(data.display_name);
        }
      }
    };
    fetchProfile();
  }, [user]);

  const generateRoomCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  const handleCreateRoom = () => {
    const code = generateRoomCode();
    const name = roomName.trim() || `${displayName}'s Room`;
    setActiveRoom(`private-${code}`);
    setRoomName(name);
    toast.success(`Room created! Share code: ${code}`);
  };

  const handleJoinRoom = () => {
    const code = joinCode.trim().toUpperCase();
    if (code.length < 4) {
      toast.error('Please enter a valid room code');
      return;
    }
    setActiveRoom(`private-${code}`);
    setRoomName(`Room ${code}`);
    toast.success('Joining room...');
  };

  const handleCopyCode = () => {
    if (activeRoom) {
      const code = activeRoom.replace('private-', '');
      navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success('Room code copied!');
    }
  };

  const handleLeaveRoom = () => {
    setActiveRoom(null);
    setRoomName('');
    setJoinCode('');
  };

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className={className}>
          <Users className="h-4 w-4 mr-2" />
          Private Voice Room
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Private Voice Room</DialogTitle>
          <DialogDescription>
            Create or join a private voice room with specific people
          </DialogDescription>
        </DialogHeader>

        {activeRoom ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div>
                <p className="text-sm font-medium">{roomName}</p>
                <p className="text-xs text-muted-foreground">
                  Code: {activeRoom.replace('private-', '')}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyCode}
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>

            <SimpleVoiceRoom
              roomId={activeRoom}
              userId={user.id}
              userName={displayName}
              roomName={roomName}
            />

            <Button 
              variant="outline" 
              className="w-full"
              onClick={handleLeaveRoom}
            >
              Leave & Close Room
            </Button>
          </div>
        ) : (
          <Tabs defaultValue="create" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="create">Create Room</TabsTrigger>
              <TabsTrigger value="join">Join Room</TabsTrigger>
            </TabsList>

            <TabsContent value="create" className="space-y-4 mt-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Room Name (optional)</label>
                <Input
                  placeholder="My Study Group"
                  value={roomName}
                  onChange={(e) => setRoomName(e.target.value)}
                />
              </div>
              <Button 
                className="w-full" 
                onClick={handleCreateRoom}
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Private Room
              </Button>
              <p className="text-xs text-muted-foreground text-center">
                A unique code will be generated to share with others
              </p>
            </TabsContent>

            <TabsContent value="join" className="space-y-4 mt-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Room Code</label>
                <Input
                  placeholder="Enter code (e.g., ABC123)"
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                  maxLength={6}
                />
              </div>
              <Button 
                className="w-full" 
                onClick={handleJoinRoom}
                disabled={joinCode.length < 4}
              >
                <Phone className="h-4 w-4 mr-2" />
                Join Room
              </Button>
            </TabsContent>
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  );
}
