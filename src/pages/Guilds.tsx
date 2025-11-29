import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useGuilds } from "@/hooks/useGuilds";
import { GuildCard } from "@/components/guilds/GuildCard";
import { CreateGuildDialog } from "@/components/guilds/CreateGuildDialog";
import { PartnerDashboard } from "@/components/partnership/PartnerDashboard";
import { Navigation } from "@/components/Navigation";
import { Users, Sword, Shield, Loader2, Heart, Sparkles } from "lucide-react";

const Guilds = () => {
  const { guilds, myGuilds, isLoading, createGuild, joinGuild, leaveGuild, isCreating, isJoining } = useGuilds();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-background via-muted/30 to-palace-purple/5">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-palace-purple/5 relative overflow-hidden">
      <Navigation />
      
      {/* Animated background glow effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-1/4 w-1/2 h-1/2 bg-palace-purple/20 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-0 -right-1/4 w-1/2 h-1/2 bg-palace-pink/20 rounded-full blur-[100px] animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1/3 h-1/3 bg-palace-blue/10 rounded-full blur-[80px] animate-pulse delay-500" />
      </div>

      <div className="container mx-auto py-8 px-4 max-w-6xl pt-24 relative z-10">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-palace-purple via-palace-pink to-palace-blue bg-clip-text text-transparent">
            Community & Partnerships
          </h1>
          <p className="text-muted-foreground text-lg">
            Join forces with other believers to master the Palace together
          </p>
        </div>

        {/* Featured Partnership Section */}
        <Card variant="glass" className="mb-8 border-2 border-palace-pink/30 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-palace-pink/10 via-palace-purple/10 to-palace-blue/10" />
          <CardHeader className="relative z-10">
            <div className="flex items-center gap-3 mb-2">
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-palace-pink to-palace-purple flex items-center justify-center">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <CardTitle className="text-2xl">Training Partner Mode</CardTitle>
                  <Sparkles className="h-5 w-5 text-palace-pink animate-pulse" />
                </div>
                <CardDescription className="text-base">
                  1-on-1 accountability for 65% better retention!
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <PartnerDashboard />
          </CardContent>
        </Card>

        {/* Guild Tabs */}
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto mb-6 bg-background/50 backdrop-blur-sm">
            <TabsTrigger value="all">All Guilds</TabsTrigger>
            <TabsTrigger value="my-guilds">My Guilds ({myGuilds?.length || 0})</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-6">
            <div className="flex justify-between items-center">
              <Card variant="glass" className="flex-1 max-w-xs">
                <CardContent className="pt-6 flex items-center gap-3">
                  <Users className="w-5 h-5 text-primary" />
                  <div>
                    <div className="text-2xl font-bold">{guilds?.length || 0}</div>
                    <div className="text-xs text-muted-foreground">Total Guilds</div>
                  </div>
                </CardContent>
              </Card>
              <CreateGuildDialog onCreate={createGuild} isCreating={isCreating} />
            </div>

            {/* Guild Type Filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card variant="glass">
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

              <Card variant="glass">
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

              <Card variant="glass">
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
              <Card variant="glass">
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
              <Card variant="glass">
                <CardContent className="pt-6 text-center">
                  <p className="text-muted-foreground mb-4">You haven't joined any guilds yet.</p>
                  <CreateGuildDialog onCreate={createGuild} isCreating={isCreating} />
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Guilds;