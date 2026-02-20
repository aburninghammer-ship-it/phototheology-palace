import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Library, BookOpen, Music, BookHeart, Mic, Bookmark } from "lucide-react";
import { ResourceLibrary } from "./library/ResourceLibrary";
import { WorshipPlaylists } from "./library/WorshipPlaylists";
import { FamilyDevotionals } from "./library/FamilyDevotionals";
import { SermonStudyLibrary } from "./library/SermonStudyLibrary";
import { SavedVersesLibrary } from "./library/SavedVersesLibrary";

interface LibraryTabProps {
  churchId: string;
}

export function LibraryTab({ churchId }: LibraryTabProps) {
  return (
    <div className="space-y-6">
      <Card variant="glass">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Library className="h-6 w-6 text-primary" />
            <CardTitle>Library</CardTitle>
          </div>
          <CardDescription>
            Resources, worship music, and family devotional materials
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="resources" className="space-y-4">
        <TabsList className="bg-card/50 backdrop-blur flex-wrap h-auto gap-1 p-1 border border-border/50">
          <TabsTrigger value="resources" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <BookOpen className="h-4 w-4" />
            Resources
          </TabsTrigger>
          <TabsTrigger value="playlists" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Music className="h-4 w-4" />
            Worship Playlists
          </TabsTrigger>
           <TabsTrigger value="family" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <BookHeart className="h-4 w-4" />
            Family Devotionals
          </TabsTrigger>
          <TabsTrigger value="sermon-studies" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Mic className="h-4 w-4" />
            Sermon Studies
          </TabsTrigger>
          <TabsTrigger value="saved-verses" className="gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Bookmark className="h-4 w-4" />
            Saved Verses
          </TabsTrigger>
        </TabsList>

        <TabsContent value="resources">
          <ResourceLibrary churchId={churchId} />
        </TabsContent>

        <TabsContent value="playlists">
          <WorshipPlaylists churchId={churchId} />
        </TabsContent>

        <TabsContent value="family">
          <FamilyDevotionals churchId={churchId} />
        </TabsContent>

        <TabsContent value="sermon-studies">
          <SermonStudyLibrary churchId={churchId} />
        </TabsContent>

        <TabsContent value="saved-verses">
          <SavedVersesLibrary />
        </TabsContent>
      </Tabs>
    </div>
  );
}

