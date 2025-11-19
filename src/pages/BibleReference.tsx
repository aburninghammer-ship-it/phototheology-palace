import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Navigation } from "@/components/Navigation";
import {
  Book,
  MapPin,
  Clock,
  BarChart3,
  Users,
  Calendar,
  Globe,
  Scroll,
  ChevronRight,
  Sparkles
} from "lucide-react";

const BibleReference = () => {
  const navigate = useNavigate();

  const factCategories = [
    {
      title: "Books of the Bible",
      icon: Book,
      description: "66 books written over 1,500 years by 40+ authors",
      items: ["39 Old Testament books", "27 New Testament books", "5 books of Law (Torah)", "12 books of History", "5 books of Poetry", "17 books of Prophecy", "4 Gospels", "21 Epistles"]
    },
    {
      title: "Key Numbers",
      icon: BarChart3,
      description: "Biblical numerology and significant counts",
      items: ["7 - Days of creation", "12 - Tribes of Israel, Apostles", "40 - Days of testing", "70 - Years of captivity", "3 - Days in tomb", "50 - Days to Pentecost"]
    },
    {
      title: "Biblical People",
      icon: Users,
      description: "Major figures in Scripture",
      items: ["Patriarchs: Abraham, Isaac, Jacob", "Moses - Lawgiver", "David - King after God's heart", "Prophets: Isaiah, Jeremiah, Ezekiel, Daniel", "Jesus Christ - Messiah", "12 Apostles"]
    }
  ];

  const timelines = [
    {
      title: "Old Testament Timeline",
      period: "~2000 BC - 400 BC",
      events: [
        { year: "~2000 BC", event: "Abraham called" },
        { year: "~1446 BC", event: "Exodus from Egypt" },
        { year: "~1010 BC", event: "David becomes king" },
        { year: "~970 BC", event: "Solomon builds Temple" },
        { year: "931 BC", event: "Kingdom divides" },
        { year: "722 BC", event: "Israel falls to Assyria" },
        { year: "586 BC", event: "Judah exiled to Babylon" },
        { year: "538 BC", event: "Return from exile" }
      ]
    },
    {
      title: "New Testament Timeline",
      period: "~4 BC - 95 AD",
      events: [
        { year: "~4 BC", event: "Jesus born in Bethlehem" },
        { year: "~27 AD", event: "Jesus begins ministry" },
        { year: "~30 AD", event: "Crucifixion & Resurrection" },
        { year: "~33 AD", event: "Pentecost - Church born" },
        { year: "~34 AD", event: "Paul's conversion" },
        { year: "~46-48 AD", event: "First missionary journey" },
        { year: "~70 AD", event: "Jerusalem destroyed" },
        { year: "~95 AD", event: "Revelation written" }
      ]
    }
  ];

  const mapLocations = [
    {
      region: "Holy Land",
      locations: ["Jerusalem - City of David", "Bethlehem - Birthplace of Jesus", "Nazareth - Jesus' hometown", "Galilee - Ministry center", "Jericho - Oldest city", "Dead Sea - Lowest point on earth"]
    },
    {
      region: "Ancient Empires",
      locations: ["Egypt - Land of bondage", "Babylon - City of captivity", "Assyria - Northern kingdom's conqueror", "Persia - Return enabler", "Greece - Cultural influence", "Rome - Jesus' era empire"]
    }
  ];

  const charts = [
    {
      title: "Covenants",
      description: "God's promises through history",
      data: ["Adamic - Promise of redemption", "Noahic - Never flood again", "Abrahamic - Father of nations", "Mosaic - Law covenant", "Davidic - Eternal kingdom", "New - Through Christ's blood"]
    },
    {
      title: "Prophetic Cycles",
      description: "Major prophetic timelines",
      data: ["70 Weeks of Daniel", "2300 Days - Sanctuary cleansed", "1260 Days - Time of persecution", "Seven Seals", "Seven Trumpets", "Three Angels' Messages"]
    },
    {
      title: "Sanctuary System",
      description: "Types pointing to Christ",
      data: ["Daily Service - Continual intercession", "Yearly Service - Day of Atonement", "Furniture - Christ's work revealed", "Priesthood - Christ our High Priest", "Sacrifices - Lamb of God", "Feast Days - Prophetic calendar"]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Book className="h-12 w-12 text-primary" />
            <h1 className="text-4xl md:text-5xl font-bold">
              The Everything Bible
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            The Ultimate Collection of Bible Facts, Timelines, Maps, and Charts
          </p>
          <Badge variant="secondary" className="mt-4">
            <Sparkles className="h-3 w-3 mr-1" />
            Comprehensive Reference Library
          </Badge>
        </div>

        <Tabs defaultValue="facts" className="space-y-6">
          <TabsList className="grid grid-cols-4 w-full max-w-2xl mx-auto">
            <TabsTrigger value="facts" className="gap-2">
              <Scroll className="h-4 w-4" />
              Facts
            </TabsTrigger>
            <TabsTrigger value="timelines" className="gap-2">
              <Clock className="h-4 w-4" />
              Timelines
            </TabsTrigger>
            <TabsTrigger value="maps" className="gap-2">
              <MapPin className="h-4 w-4" />
              Maps
            </TabsTrigger>
            <TabsTrigger value="charts" className="gap-2">
              <BarChart3 className="h-4 w-4" />
              Charts
            </TabsTrigger>
          </TabsList>

          <TabsContent value="facts" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {factCategories.map((category, idx) => {
                const Icon = category.icon;
                return (
                  <Card key={idx} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <Icon className="h-6 w-6 text-primary" />
                        </div>
                        <CardTitle className="text-xl">{category.title}</CardTitle>
                      </div>
                      <CardDescription>{category.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {category.items.map((item, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm">
                            <ChevronRight className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="timelines" className="space-y-6">
            {timelines.map((timeline, idx) => (
              <Card key={idx}>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Calendar className="h-6 w-6 text-primary" />
                    <div>
                      <CardTitle>{timeline.title}</CardTitle>
                      <CardDescription>{timeline.period}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-96">
                    <div className="relative space-y-4 pl-6">
                      <div className="absolute left-2 top-0 bottom-0 w-0.5 bg-primary/20" />
                      {timeline.events.map((event, i) => (
                        <div key={i} className="relative">
                          <div className="absolute -left-[1.3rem] top-2 h-3 w-3 rounded-full bg-primary border-4 border-background" />
                          <div className="bg-accent/50 rounded-lg p-4">
                            <div className="font-semibold text-primary">{event.year}</div>
                            <div className="text-sm mt-1">{event.event}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="maps" className="space-y-6">
            {mapLocations.map((region, idx) => (
              <Card key={idx}>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Globe className="h-6 w-6 text-primary" />
                    <CardTitle>{region.region}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3 md:grid-cols-2">
                    {region.locations.map((location, i) => (
                      <div key={i} className="flex items-start gap-2 p-3 rounded-lg bg-accent/50">
                        <MapPin className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{location}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
            
            <Card className="border-primary/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5" />
                  Interactive Biblical Maps Coming Soon
                </CardTitle>
                <CardDescription>
                  Explore journeys of Abraham, Exodus route, Paul's missionary trips, and more
                </CardDescription>
              </CardHeader>
            </Card>
          </TabsContent>

          <TabsContent value="charts" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              {charts.map((chart, idx) => (
                <Card key={idx} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <BarChart3 className="h-6 w-6 text-primary" />
                      <div>
                        <CardTitle>{chart.title}</CardTitle>
                        <CardDescription>{chart.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {chart.data.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm p-2 rounded bg-accent/50">
                          <ChevronRight className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="border-primary/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5" />
                  Phototheology Integration
                </CardTitle>
                <CardDescription>
                  All charts connect to Palace Rooms and Phototheology principles
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-between" onClick={() => navigate("/palace")}>
                  Explore the Palace
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button variant="outline" className="w-full justify-between" onClick={() => navigate("/bible")}>
                  Study Scripture
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default BibleReference;
