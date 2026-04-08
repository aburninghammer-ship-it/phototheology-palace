import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Building2, Mail, MessageSquare, FileText } from "lucide-react";
import { useExperienceMode } from "@/contexts/ExperienceModeContext";

export const Footer = () => {
  const { t } = useTranslation();
  const { isBasic, isImmersion } = useExperienceMode();

  return (
    <footer className="border-t border-border bg-card/50 backdrop-blur-sm mt-auto pb-28 md:pb-0">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-3">
            <Link to="/" className="flex items-center gap-2 group">
              <Building2 className="h-6 w-6 text-primary transition-transform group-hover:scale-110" />
              <span className="font-serif text-lg font-semibold bg-gradient-palace bg-clip-text text-transparent">
                {t('footer.brandName')}
              </span>
            </Link>
            <p className="text-sm text-muted-foreground">
              {t('footer.tagline')}
            </p>
          </div>

          {/* Quick Links — adapted per level */}
          <div>
            <h3 className="font-semibold mb-3 text-foreground">{t('footer.quickLinks')}</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-muted-foreground hover:text-primary transition-colors font-medium">
                  {t('footer.home')}
                </Link>
              </li>
              <li>
                <Link to="/why-phototheology" className="text-muted-foreground hover:text-primary transition-colors">
                  {t('footer.whyPhototheology')}
                </Link>
              </li>
              <li>
                <Link to="/app-tour" className="text-muted-foreground hover:text-primary transition-colors">
                  {t('footer.appTour')}
                </Link>
              </li>
              {!isBasic && (
                <li>
                  <Link to="/palace" className="text-muted-foreground hover:text-primary transition-colors">
                    {t('footer.thePalace')}
                  </Link>
                </li>
              )}
              {isImmersion && (
                <li>
                  <Link to="/sermon-topics" className="text-muted-foreground hover:text-primary transition-colors">
                    {t('footer.sermonTopics')}
                  </Link>
                </li>
              )}
              {!isBasic && (
                <li>
                  <Link to="/games" className="text-muted-foreground hover:text-primary transition-colors">
                    {t('footer.games')}
                  </Link>
                </li>
              )}
              <li>
                <Link to="/pricing" className="text-muted-foreground hover:text-primary transition-colors">
                  {t('footer.pricing')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Training — adapted per level */}
          <div>
            <h3 className="font-semibold mb-3 text-foreground">{t('footer.training')}</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/quick-start" className="text-muted-foreground hover:text-primary transition-colors">
                  {t('footer.quickStartGuide')}
                </Link>
              </li>
              {!isBasic && (
                <li>
                  <Link to="/study-suite" className="text-muted-foreground hover:text-primary transition-colors">
                    {t('footer.studySuite')}
                  </Link>
                </li>
              )}
              {!isBasic && (
                <li>
                  <Link to="/courses" className="text-muted-foreground hover:text-primary transition-colors">
                    {t('footer.courses')}
                  </Link>
                </li>
              )}
              {isImmersion && (
                <li>
                  <Link to="/video-training" className="text-muted-foreground hover:text-primary transition-colors">
                    {t('footer.videoTraining')}
                  </Link>
                </li>
              )}
            </ul>
          </div>

          {/* Contact & Legal — same for all levels */}
          <div>
            <h3 className="font-semibold mb-3 text-foreground">{t('footer.supportLegal')}</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/feedback" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2">
                  <MessageSquare className="h-3 w-3" />
                  {t('footer.submitFeedback')}
                </Link>
              </li>
              <li>
              <a
                  href="mailto:support@phototheology.app"
                  className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
                >
                  <Mail className="h-3 w-3" />
                  {t('footer.emailSupport')}
                </a>
              </li>
              <li>
                <Link to="/privacy-policy" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2">
                  <FileText className="h-3 w-3" />
                  {t('footer.privacyPolicy')}
                </Link>
              </li>
              <li>
                <Link to="/terms-of-service" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2">
                  <FileText className="h-3 w-3" />
                  {t('footer.termsOfService')}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Scripture & Copyright */}
        <div className="mt-8 pt-6 border-t border-border text-center text-sm text-muted-foreground space-y-2">
          <p className="italic font-serif text-foreground/60">
            {t('footer.scripture')}
          </p>
          <p>{t('footer.copyright', { year: new Date().getFullYear() })}</p>
        </div>
      </div>
    </footer>
  );
};
