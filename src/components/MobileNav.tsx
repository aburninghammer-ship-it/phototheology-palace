import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu, Building2, BookOpen, Sparkles, User, CreditCard, LogOut, Gift, Clock, Home } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

export const MobileNav = () => {
  const { user, signOut } = useAuth();
  const { t } = useTranslation();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-80">
        <SheetHeader>
          <SheetTitle>
            <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <Building2 className="h-5 w-5 text-primary" />
              <span className="bg-gradient-palace bg-clip-text text-transparent">
                Phototheology
              </span>
            </Link>
          </SheetTitle>
        </SheetHeader>
        
        <ScrollArea className="h-[calc(100vh-5rem)] mt-6">
        <div className="flex flex-col gap-2 pr-4">
          {user ? (
            <>
              <Link to="/">
                <Button variant="default" className="w-full justify-start gradient-palace" size="sm">
                  <Home className="h-4 w-4 mr-2" />
                  {t('nav.backToHome')}
                </Button>
              </Link>
              
              <Separator className="my-2" />
              <div className="text-xs font-semibold text-muted-foreground px-2 py-1 uppercase tracking-wide">{t('nav.quickLinks')}</div>
              
              <Link to="/app-tour">
                <Button variant="ghost" className="w-full justify-start" size="sm">
                  <BookOpen className="h-4 w-4 mr-2" />
                  {t('nav.appTour')}
                </Button>
              </Link>
              <Link to="/palace">
                <Button variant="ghost" className="w-full justify-start" size="sm">
                  <Building2 className="h-4 w-4 mr-2" />
                  {t('nav.thePalace')}
                </Button>
              </Link>
              
              <Separator className="my-2" />
              <div className="text-xs font-semibold text-muted-foreground px-2 py-1">{t('nav.bibleTools')}</div>
              
              <Link to="/bible/John/3">
                <Button variant="ghost" className="w-full justify-start" size="sm">
                  📖 {t('nav.phototheologyBible')}
                </Button>
              </Link>
              <Link to="/palace">
                <Button variant="ghost" className="w-full justify-start" size="sm">
                  🏰 {t('nav.thePalace')}
                </Button>
              </Link>
              <Link to="/palace/floor/1/room/br">
                <Button variant="ghost" className="w-full justify-start" size="sm">
                  📚 {t('nav.bibleRendered')}
                </Button>
              </Link>
              <Link to="/give-me-a-gem">
                <Button variant="ghost" className="w-full justify-start" size="sm">
                  💎 {t('nav.giveGem')}
                </Button>
              </Link>
              <Link to="/verse-memory-hall">
                <Button variant="ghost" className="w-full justify-start" size="sm">
                  🧠 {t('nav.verseMemoryHall')}
                </Button>
              </Link>
              <Link to="/bible-image-library">
                <Button variant="ghost" className="w-full justify-start" size="sm">
                  🎨 {t('nav.imageLibrary')}
                </Button>
              </Link>
              <Link to="/my-studies">
                <Button variant="ghost" className="w-full justify-start" size="sm">
                  📝 {t('study.myStudies')}
                </Button>
              </Link>
              <Link to="/public-image-library">
                <Button variant="ghost" className="w-full justify-start" size="sm">
                  🌐 {t('nav.publicGallery')}
                </Button>
              </Link>
              <Link to="/quarterly-study">
                <Button variant="ghost" className="w-full justify-start" size="sm">
                  📅 {t('nav.lessonStudy')}
                </Button>
              </Link>
              <Separator className="my-2" />
              <div className="text-xs font-semibold text-muted-foreground px-2 py-1">{t('nav.researchTools')}</div>
              
              <Link to="/research-mode">
                <Button variant="ghost" className="w-full justify-start" size="sm">
                  🔬 {t('nav.researchMode')}
                </Button>
              </Link>
              <Link to="/prophecy-watch">
                <Button variant="ghost" className="w-full justify-start" size="sm">
                  👁️ {t('nav.prophecyWatch')}
                </Button>
              </Link>
              <Link to="/culture-controversy">
                <Button variant="ghost" className="w-full justify-start" size="sm">
                  🌍 {t('nav.cultureControversy')}
                </Button>
              </Link>
              
              <Separator className="my-2" />
              <div className="text-xs font-semibold text-muted-foreground px-2 py-1">{t('nav.games')}</div>
              
              <Link to="/games">
                <Button variant="ghost" className="w-full justify-start" size="sm">
                  🎮 {t('nav.palaceGames')}
                </Button>
              </Link>
              <Link to="/kids-games">
                <Button variant="ghost" className="w-full justify-start" size="sm">
                  👶 {t('nav.kidsGames')}
                </Button>
              </Link>
              
              <Separator className="my-2" />
              <div className="text-xs font-semibold text-muted-foreground px-2 py-1">{t('nav.gpts')}</div>
              
              <Link to="/phototheologygpt">
                <Button variant="ghost" className="w-full justify-start" size="sm">
                  🤖 {t('nav.phototheologyGpt')}
                </Button>
              </Link>
              <Link to="/branch-study">
                <Button variant="ghost" className="w-full justify-start" size="sm">
                  🌳 {t('nav.branchStudy')}
                </Button>
              </Link>
              <Link to="/apologetics-gpt">
                <Button variant="ghost" className="w-full justify-start" size="sm">
                  🛡️ {t('nav.apologeticsGpt')}
                </Button>
              </Link>
              <Link to="/daniel-revelation-gpt">
                <Button variant="ghost" className="w-full justify-start" size="sm">
                  📜 {t('nav.danielRevelationGpt')}
                </Button>
              </Link>
              <Link to="/kidgpt">
                <Button variant="ghost" className="w-full justify-start" size="sm">
                  👶 {t('nav.kidGpt')}
                </Button>
              </Link>
              
              <Separator className="my-2" />
              <div className="text-xs font-semibold text-muted-foreground px-2 py-1">{t('nav.spiritualTraining')}</div>
              
              <Link to="/spiritual-training">
                <Button variant="ghost" className="w-full justify-start" size="sm">
                  ⚔️ {t('nav.spiritualTraining')}
                </Button>
              </Link>
              <Link to="/power-of-the-lamb">
                <Button variant="ghost" className="w-full justify-start" size="sm">
                  🔥 {t('nav.powerOfLamb')}
                </Button>
              </Link>
              
              <Separator className="my-2" />
              <div className="text-xs font-semibold text-muted-foreground px-2 py-1">{t('nav.courses')}</div>
              
              <Link to="/courses">
                <Button variant="default" className="w-full justify-start mb-2" size="sm">
                  📚 {t('nav.viewAllCourses')}
                </Button>
              </Link>
              
              <Link to="/blueprint-course">
                <Button variant="ghost" className="w-full justify-start" size="sm">
                  {t('nav.blueprintCourse')}
                </Button>
              </Link>
              <Link to="/daniel-course">
                <Button variant="ghost" className="w-full justify-start" size="sm">
                  {t('nav.danielCourse')}
                </Button>
              </Link>
              <Link to="/phototheology-course">
                <Button variant="ghost" className="w-full justify-start" size="sm">
                  {t('nav.phototheologyCourse')}
                </Button>
              </Link>
              <Link to="/revelation-course">
                <Button variant="ghost" className="w-full justify-start" size="sm">
                  {t('nav.revelationCourse')}
                </Button>
              </Link>
              <Link to="/revelation-course/kids">
                <Button variant="ghost" className="w-full justify-start" size="sm">
                  📚 {t('nav.revelationForKids')}
                </Button>
              </Link>
              
              <Separator className="my-2" />
              <div className="text-xs font-semibold text-muted-foreground px-2 py-1">{t('nav.community')}</div>
              
              <Link to="/escape-room">
                <Button variant="ghost" className="w-full justify-start font-semibold text-primary" size="sm">
                  <Clock className="h-4 w-4 mr-2" />
                  🚨 {t('nav.escapeRooms')}
                </Button>
              </Link>
              <Link to="/daily-challenges">
                <Button variant="ghost" className="w-full justify-start" size="sm">
                  📅 {t('challenges.dailyChallenge')}
                </Button>
              </Link>
              <Link to="/treasure-hunt">
                <Button variant="ghost" className="w-full justify-start" size="sm">
                  🏆 {t('nav.treasureHunt')}
                </Button>
              </Link>
              <Link to="/equations-challenge">
                <Button variant="ghost" className="w-full justify-start" size="sm">
                  🧮 {t('nav.equationsChallenge')}
                </Button>
              </Link>
              <Link to="/live-study">
                <Button variant="ghost" className="w-full justify-start" size="sm">
                  📺 {t('nav.liveStudy')}
                </Button>
              </Link>
              <Link to="/community">
                <Button variant="ghost" className="w-full justify-start" size="sm">
                  💬 {t('nav.communityChat')}
                </Button>
              </Link>
              <Link to="/leaderboard">
                <Button variant="ghost" className="w-full justify-start" size="sm">
                  🏅 {t('challenges.leaderboard')}
                </Button>
              </Link>
              <Link to="/achievements">
                <Button variant="ghost" className="w-full justify-start" size="sm">
                  🎖️ {t('nav.achievements')}
                </Button>
              </Link>
              <Link to="/feedback">
                <Button variant="ghost" className="w-full justify-start" size="sm">
                  💡 {t('nav.feedback')}
                </Button>
              </Link>
              <Link to="/critics-analysis">
                <Button variant="ghost" className="w-full justify-start" size="sm">
                  🎥 {t('nav.criticsAnalysis')}
                </Button>
              </Link>
              
              <Separator className="my-2" />
              
              <Link to="/profile">
                <Button variant="ghost" className="w-full justify-start" size="sm">
                  <User className="h-4 w-4 mr-2" />
                  {t('nav.myProfile')}
                </Button>
              </Link>
              <Link to="/pricing">
                <Button variant="ghost" className="w-full justify-start" size="sm">
                  <CreditCard className="h-4 w-4 mr-2" />
                  {t('nav.pricingPlans')}
                </Button>
              </Link>
              <Link to="/referrals">
                <Button variant="ghost" className="w-full justify-start" size="sm">
                  <Gift className="h-4 w-4 mr-2" />
                  {t('nav.referrals')}
                </Button>
              </Link>
              <Link to="/app-update-ideas">
                <Button variant="ghost" className="w-full justify-start" size="sm">
                  <Sparkles className="h-4 w-4 mr-2" />
                  💡 {t('nav.submitIdeas')}
                </Button>
              </Link>
              
              <Separator className="my-2" />
              
              <Button
                variant="ghost"
                className="w-full justify-start text-destructive hover:text-destructive"
                size="sm"
                onClick={signOut}
              >
                <LogOut className="h-4 w-4 mr-2" />
                {t('nav.signOut')}
              </Button>
            </>
          ) : (
            <>
              <div className="text-center mb-4">
                <h3 className="font-serif text-lg font-semibold mb-2 text-foreground">{t('nav.getStarted')}</h3>
                <p className="text-sm text-muted-foreground mb-4">{t('nav.beginJourney')}</p>
              </div>
              
              <Link to="/app-tour">
                <Button variant="outline" className="w-full border-2 border-palace-blue text-palace-blue font-semibold">
                  <BookOpen className="h-4 w-4 mr-2" />
                  {t('nav.takeTourFirst')}
                </Button>
              </Link>
              <Link to="/auth">
                <Button className="w-full gradient-palace">
                  <Sparkles className="h-4 w-4 mr-2" />
                  {t('nav.getStartedFree')}
                </Button>
              </Link>
              <Link to="/pricing">
                <Button variant="outline" className="w-full">
                  {t('nav.viewPricing')}
                </Button>
              </Link>
            </>
          )}
        </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};
