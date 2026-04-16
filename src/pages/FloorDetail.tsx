import { useParams, Link } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { useTranslatedPalaceData } from "@/hooks/useTranslatedPalaceData";
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
import { SequentialMasteryNotice } from "@/components/palace/SequentialMasteryNotice";

export default function FloorDetail() {
  const { t } = useTranslation();
  const { translatedFloors } = useTranslatedPalaceData();
  const { floorNumber } = useParams();
  const { user } = useAuth();
  const floor = translatedFloors.find(f => f.number === Number(floorNumber));

  if (!floor) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">{t('floorDetail.notFound')}</h1>
          <Link to="/palace">
            <Button>{t('floorDetail.returnToPalace')}</Button>
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
    <div className="min-h-screen bg-gradient-subtle overflow-y-auto">
      <Navigation />
      <div className="container mx-auto px-4 py-8 pb-24 max-w-6xl">
        <Link to="/palace">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t('floorDetail.backToPalace')}
          </Button>
        </Link>

        <div className={`${gradient} rounded-2xl p-10 mb-8 text-white relative overflow-hidden shadow-2xl`}>
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
          </div>

          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="text-white border-white/70 text-lg px-4 py-1 font-bold backdrop-blur-sm bg-white/10">
                  {t('floorDetail.floor', { number: floor.number })}
                </Badge>
                <Badge variant="outline" className="text-white border-white/70 px-4 py-1 backdrop-blur-sm bg-white/10">
                  {t('floorDetail.rooms', { count: floor.rooms.length })}
                </Badge>
              </div>
              <HowItWorksDialog
                title={t('floorDetail.howToUse', { number: floor.number })}
                steps={[
                  {
                    title: `${t('floorDetail.floor', { number: floor.number })}: ${t(`floorDetail.floorName${floor.number}`, floor.name)}`,
                    description: t(`floorDetail.floorDesc${floor.number}`, floor.description),
                    highlights: [
                      t(`floorDetail.floorSubtitle${floor.number}`, floor.subtitle),
                      t('floorDetail.roomsToExplore', { count: floor.rooms.length }),
                      t('floorDetail.eachRoomTeaches')
                    ],
                    icon: Layers,
                  },
                  {
                    title: t('floorDetail.roomCards'),
                    description: t('floorDetail.roomCardsDesc'),
                    highlights: [
                      t('floorDetail.roomCodeAndName'),
                      t('floorDetail.detailedDesc'),
                      t('floorDetail.clickToExplore')
                    ],
                    icon: BookOpen,
                  },
                  {
                    title: t('floorDetail.roomCodes'),
                    description: t('floorDetail.roomCodesDesc'),
                    highlights: [
                      t('floorDetail.shortCodes'),
                      t('floorDetail.usedInStudy'),
                      t('floorDetail.partOfPTLanguage')
                    ],
                    icon: Code,
                  },
                  {
                    title: t('floorDetail.practicalApp'),
                    description: t('floorDetail.practicalAppDesc'),
                    highlights: [
                      t('floorDetail.systematicStudy'),
                      t('floorDetail.organizedThinking'),
                      t('floorDetail.christCentered')
                    ],
                    icon: Lightbulb,
                  },
                ]}
              />
            </div>

            <h1 className="text-5xl md:text-6xl font-serif font-black mb-3 drop-shadow-2xl tracking-tight">{t(`floorDetail.floorName${floor.number}`, floor.name)}</h1>
            <p className="text-2xl md:text-3xl mb-5 opacity-95 font-medium drop-shadow-lg">{t(`floorDetail.floorSubtitle${floor.number}`, floor.subtitle)} ✨</p>
            <p className="text-lg opacity-90 leading-relaxed max-w-3xl drop-shadow-md">{t(`floorDetail.floorDesc${floor.number}`, floor.description)}</p>
          </div>
        </div>

        <div className="mb-6">
          <SequentialMasteryNotice floorNumber={floor.number} />
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
