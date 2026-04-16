import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Navigation } from "@/components/Navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { Sparkles } from "lucide-react";

const KidsGames = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const youngKidsGames = [
    { id: "palace_explorer", name: "🏰 Palace Explorer", description: "Go on an adventure through the 9 rooms! Meet friendly characters and learn what makes each room special.", icon: "🗺️" },
    { id: "verse_memory", name: "🎴 Verse Memory Match", description: "Flip cards to match Bible verses! Find pairs and learn simple verses by heart.", icon: "🧠" },
    { id: "color_prophet", name: "🎨 Color the Prophets", description: "Color pictures of Bible heroes like Daniel, Moses, and David while learning their stories.", icon: "✏️" },
    { id: "palace_builder", name: "🏗️ Palace Builder", description: "Build your very own memory palace! Place pictures in rooms to remember your favorite verses.", icon: "🏛️" },
    { id: "story_time", name: "📖 Story Time", description: "Listen to exciting Bible stories with colorful pictures and fun sound effects!", icon: "🎵" },
    { id: "jeeves_friend", name: "🤖 Jeeves' Friend", description: "Help Jeeves organize Bible stories! Put pictures in the right rooms and learn the palace.", icon: "🎯" },
    { id: "animal_ark", name: "🦁 Animal Ark", description: "Learn about animals in the Bible! From Noah's ark to Daniel's lions, discover God's creatures.", icon: "🐘" },
    { id: "treasure_finder", name: "💎 Treasure Finder", description: "Find hidden gems in Bible verses! Click on special words to discover what they mean.", icon: "✨" },
    { id: "song_sing", name: "🎶 Sing & Learn", description: "Sing fun songs about Bible stories! Learn verses through music and rhythm.", icon: "🎤" },
    { id: "hero_cards", name: "🦸 Bible Heroes", description: "Collect cards of Bible heroes! Learn what made them special and brave.", icon: "⭐" },
    { id: "rainbow_promise", name: "🌈 Rainbow Promise", description: "Learn about God's promises! Paint rainbows and discover what each color means.", icon: "☁️" },
    { id: "angel_messenger", name: "👼 Angel Messenger", description: "Help angels deliver good news! Fly through clouds and share happy messages from God.", icon: "✉️" },
    { id: "fruit_garden", name: "🍎 Fruit Garden", description: "Grow the fruits of the Spirit! Water your garden and watch love, joy, and peace bloom.", icon: "🌱" },
    { id: "shepherd_search", name: "🐑 Shepherd Search", description: "Help the Good Shepherd find lost sheep! Count sheep and learn about Jesus' love.", icon: "🧺" },
    { id: "tower_build", name: "🗼 Tower Builder", description: "Build the tower of Babel! Learn about different languages and how people spread around the world.", icon: "🧱" },
    { id: "prayer_time", name: "🙏 Prayer Time", description: "Learn simple prayers! Practice talking to God about your day, friends, and family.", icon: "💫" },
    { id: "creation_craft", name: "🌍 Creation Week", description: "Make the world in 7 days! Add sun, moon, animals, and rest on the Sabbath.", icon: "☀️" },
  ];

  const middleKidsGames = [
    { id: "principle_detective", name: "🔍 Principle Detective", description: "Solve mysteries by finding which Palace principle is hidden in each Bible verse. Use clues from Jeeves!", icon: "🕵️" },
    { id: "palace_race", name: "🏃 Palace Race", description: "Race through all 9 floors of the Palace! Answer questions quickly to reach the top first.", icon: "⚡" },
    { id: "jeeves_helper", name: "🤖 Jeeves' Helper", description: "Help Jeeves organize verses into the correct rooms. Learn why each verse belongs where it does.", icon: "🎓" },
    { id: "verse_builder", name: "🧩 Verse Builder", description: "Complete Bible verses by filling in the missing words. Start easy and unlock harder challenges!", icon: "📝" },
    { id: "timeline_adventure", name: "⏰ Timeline Adventure", description: "Travel through Bible history! Put events in the right order from Creation to Jesus and beyond.", icon: "📅" },
    { id: "sanctuary_quest", name: "⛪ Sanctuary Quest", description: "Explore the tabernacle! Learn about each piece of furniture and what it means for Jesus.", icon: "🕯️" },
    { id: "prophecy_path", name: "🔮 Prophecy Path", description: "Follow the path of prophecy from Daniel to Revelation! Connect the dots across time.", icon: "🗺️" },
    { id: "symbol_safari", name: "🦅 Symbol Safari", description: "Hunt for biblical symbols! Find eagles, lions, lambs and learn what each represents.", icon: "🔍" },
    { id: "feast_festival", name: "🎊 Feast Festival", description: "Celebrate God's feasts! Learn about Passover, Pentecost and more through fun activities.", icon: "🎉" },
    { id: "parable_picker", name: "📚 Parable Picker", description: "Match Jesus' parables to their meanings! Learn the lessons Jesus taught through stories.", icon: "💭" },
    { id: "miracle_maker", name: "✨ Miracle Maker", description: "Recreate Jesus' miracles! Turn water to wine, feed 5000, and walk on water in this interactive game.", icon: "🌊" },
    { id: "armor_builder", name: "🛡️ Armor of God", description: "Put on the full armor of God! Learn about each piece and how it protects you spiritually.", icon: "⚔️" },
    { id: "temple_builder", name: "⛩️ Temple Builder", description: "Build Solomon's Temple! Place each room and object correctly while learning their meanings.", icon: "🏛️" },
    { id: "psalm_composer", name: "🎼 Psalm Composer", description: "Create music from the Psalms! Turn verses into melodies and share your worship songs.", icon: "🎹" },
    { id: "disciple_trainer", name: "🎒 Disciple Trainer", description: "Train to be a disciple! Follow Jesus' footsteps and learn what it means to be a follower.", icon: "👣" },
    { id: "covenant_keeper", name: "📜 Covenant Keeper", description: "Track God's covenants through history! From Noah to Jesus, see how God keeps His promises.", icon: "🤝" },
    { id: "wisdom_seeker", name: "🦉 Wisdom Seeker", description: "Collect wisdom from Proverbs! Solve riddles and apply wise sayings to everyday situations.", icon: "💡" },
  ];

  const olderKidsGames = [
    { id: "chain_junior", name: "⛓️ Chain Chess Junior", description: "Build chains of connected Bible verses. Compete with Jeeves to create the longest biblical connections!", icon: "🔗" },
    { id: "palace_master", name: "👑 Palace Master", description: "Master all 50 principles across the 9 rooms. Complete challenges to earn your Palace Master badge!", icon: "🏆" },
    { id: "prophecy_puzzle", name: "🔮 Prophecy Puzzle", description: "Connect Old Testament prophecies with their New Testament fulfillments. Unlock the prophetic timeline!", icon: "📜" },
    { id: "principle_challenge", name: "💪 Principle Challenge", description: "Take on advanced challenges matching complex verses to multiple principles. Think deeply!", icon: "🧠" },
    { id: "study_creator", name: "✍️ Study Creator", description: "Create your own Bible study guides using Palace principles. Share them with friends!", icon: "📚" },
    { id: "dimension_diver", name: "💎 Dimension Diver", description: "Dive deep into all 5 dimensions of a verse! Uncover literal, Christ, personal, church, and heaven meanings.", icon: "🌊" },
    { id: "cycle_climber", name: "🔄 Cycle Climber", description: "Climb through the 8 covenant cycles! From Adam to the Return, see God's redemptive patterns.", icon: "🪜" },
    { id: "cross_linker", name: "🔗 Cross Reference Linker", description: "Build massive cross-reference chains! Connect verses across the entire Bible to see God's unified message.", icon: "🕸️" },
    { id: "apologetics_arena", name: "🛡️ Apologetics Arena", description: "Defend the faith! Answer tough questions about the Bible using Scripture and sound reasoning.", icon: "⚔️" },
    { id: "wisdom_warrior", name: "⚡ Wisdom Warrior", description: "Battle against wrong thinking! Apply biblical wisdom to real-life scenarios and tough choices.", icon: "🧙" },
    { id: "hebrew_decoder", name: "🔤 Hebrew Decoder", description: "Unlock original Hebrew meanings! Discover deeper truths by studying words in their original language.", icon: "📖" },
    { id: "greek_scholar", name: "📚 Greek Scholar", description: "Master New Testament Greek! Learn key words and see how they reveal Jesus throughout Scripture.", icon: "✍️" },
    { id: "typology_tracker", name: "🎯 Typology Tracker", description: "Find types and shadows of Christ! Match Old Testament symbols to their New Testament fulfillment.", icon: "🔍" },
    { id: "eschatology_explorer", name: "🌅 End Times Explorer", description: "Navigate prophetic timelines! Study Daniel and Revelation to understand God's final plan.", icon: "⏳" },
    { id: "sanctuary_scholar", name: "🕯️ Sanctuary Scholar", description: "Master the sanctuary system! Learn how every detail points to Jesus' ministry in heaven.", icon: "⛪" },
    { id: "debate_master", name: "🗣️ Debate Master", description: "Prepare biblical defenses! Practice responding to challenges about faith with Scripture and logic.", icon: "💬" },
  ];

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-3">
              <Sparkles className="h-12 w-12 text-purple-500 animate-pulse" />
              <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                {t('kids.title')}
              </h1>
              <Sparkles className="h-12 w-12 text-blue-500 animate-pulse" />
            </div>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {t('kids.subtitle')}
            </p>
            <Button 
              onClick={() => navigate("/pt-kids-games")}
              className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
              size="lg"
            >
              {t('kids.tryPtKidsZone')}
            </Button>
          </div>

          <Tabs defaultValue="6-9" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="6-9">{t('kids.ages6to9')}</TabsTrigger>
              <TabsTrigger value="10-12">{t('kids.ages10to12')}</TabsTrigger>
              <TabsTrigger value="13-15">{t('kids.ages13to15')}</TabsTrigger>
            </TabsList>

            <TabsContent value="6-9" className="space-y-4">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {youngKidsGames.map((game) => (
                  <Card key={game.id} className="hover:shadow-lg transition-all hover:scale-105">
                    <CardHeader>
                      <div className="text-4xl mb-2 text-center">{game.icon}</div>
                      <CardTitle className="text-center">{game.name}</CardTitle>
                      <CardDescription className="text-center min-h-[60px]">{game.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button onClick={() => navigate(`/kids-games/${game.id}`)} className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                        {t('kids.playNow')}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="10-12" className="space-y-4">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {middleKidsGames.map((game) => (
                  <Card key={game.id} className="hover:shadow-lg transition-all hover:scale-105">
                    <CardHeader>
                      <div className="text-4xl mb-2 text-center">{game.icon}</div>
                      <CardTitle className="text-center">{game.name}</CardTitle>
                      <CardDescription className="text-center min-h-[60px]">{game.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button onClick={() => navigate(`/kids-games/${game.id}`)} className="w-full bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600">
                        {t('kids.playNow')}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="13-15" className="space-y-4">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {olderKidsGames.map((game) => (
                  <Card key={game.id} className="hover:shadow-lg transition-all hover:scale-105">
                    <CardHeader>
                      <div className="text-4xl mb-2 text-center">{game.icon}</div>
                      <CardTitle className="text-center">{game.name}</CardTitle>
                      <CardDescription className="text-center min-h-[60px]">{game.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button onClick={() => navigate(`/kids-games/${game.id}`)} className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600">
                        {t('kids.playNow')}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default KidsGames;
