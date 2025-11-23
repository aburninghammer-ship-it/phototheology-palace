import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useGuilds } from "@/hooks/useGuilds";
import { GuildCard } from "@/components/guilds/GuildCard";
import { CreateGuildDialog } from "@/components/guilds/CreateGuildDialog";
import { Users, Sword, Shield, Loader2 } from "lucide-react";

const Guilds = () => {
  const { guilds, myGuilds, isLoading, createGuild, joinGuild, leaveGuild, isCreating, isJoining } = useGuilds();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Guild System</h1>
        <p className="text-muted-foreground">
          Join forces with other believers to master the Palace together
        </p>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="all">All Guilds</TabsTrigger>
          <TabsTrigger value="my-guilds">My Guilds ({myGuilds?.length || 0})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-6">
          <div className="flex justify-between items-center">
            <div className="flex gap-4">
              <Card className="flex-1">
                <CardContent className="pt-6 flex items-center gap-3">
                  <Users className="w-5 h-5 text-primary" />
                  <div>
                    <div className="text-2xl font-bold">{guilds?.length || 0}</div>
                    <div className="text-xs text-muted-foreground">Total Guilds</div>
                  </div>
                </CardContent>
              </Card>
            </div>
            <CreateGuildDialog onCreate={createGuild} isCreating={isCreating} />
          </div>

          {/* Guild Type Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  🏰 Houses
                </CardTitle>
                <CardDescription>Family-style communities (8-15 members)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {guilds?.filter(g => g.guild_type === 'house').length || 0}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sword className="w-5 h-5" /> Orders
                </CardTitle>
                <CardDescription>Mission-focused groups (15-25 members)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {guilds?.filter(g => g.guild_type === 'order').length || 0}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" /> Squads
                </CardTitle>
                <CardDescription>Small teams (4-8 members)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {guilds?.filter(g => g.guild_type === 'squad').length || 0}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Guild Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {guilds?.map((guild) => (
              <GuildCard
                key={guild.id}
                guild={guild}
                onJoin={joinGuild}
                onLeave={leaveGuild}
                isJoining={isJoining}
              />
            ))}
          </div>

          {guilds?.length === 0 && (
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-muted-foreground mb-4">No guilds yet. Be the first to create one!</p>
                <CreateGuildDialog onCreate={createGuild} isCreating={isCreating} />
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="my-guilds" className="space-y-6">
          {myGuilds && myGuilds.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {myGuilds.map((guild) => (
                <GuildCard
                  key={guild.id}
                  guild={guild}
                  onLeave={leaveGuild}
                />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-muted-foreground mb-4">You haven't joined any guilds yet.</p>
                <CreateGuildDialog onCreate={createGuild} isCreating={isCreating} />
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Guilds;