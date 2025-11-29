import { Link } from "react-router-dom";
import { Building2, Mail, MessageSquare, FileText } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="border-t border-border bg-card/50 backdrop-blur-sm mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-3">
            <Link to="/" className="flex items-center gap-2 group">
              <Building2 className="h-6 w-6 text-primary transition-transform group-hover:scale-110" />
              <span className="font-serif text-lg font-semibold bg-gradient-palace bg-clip-text text-transparent">
                Phototheology
              </span>
            </Link>
            <p className="text-sm text-muted-foreground">
              The Palace of Biblical Wisdom - Transform how you study Scripture
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-3 text-foreground">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-muted-foreground hover:text-primary transition-colors font-medium">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/why-phototheology" className="text-muted-foreground hover:text-primary transition-colors">
                  Why Phototheology
                </Link>
              </li>
              <li>
                <Link to="/app-tour" className="text-muted-foreground hover:text-primary transition-colors">
                  App Tour
                </Link>
              </li>
              <li>
                <Link to="/palace" className="text-muted-foreground hover:text-primary transition-colors">
                  The Palace
                </Link>
              </li>
              <li>
                <Link to="/games" className="text-muted-foreground hover:text-primary transition-colors">
                  Games
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="text-muted-foreground hover:text-primary transition-colors">
                  Pricing
                </Link>
              </li>
            </ul>
          </div>

          {/* Community */}
          <div>
            <h3 className="font-semibold mb-3 text-foreground">Community</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/community" className="text-muted-foreground hover:text-primary transition-colors">
                  Community Chat
                </Link>
              </li>
              <li>
                <Link to="/leaderboard" className="text-muted-foreground hover:text-primary transition-colors">
                  Leaderboard
                </Link>
              </li>
              <li>
                <Link to="/achievements" className="text-muted-foreground hover:text-primary transition-colors">
                  Achievements
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Legal */}
          <div>
            <h3 className="font-semibold mb-3 text-foreground">Support & Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/feedback" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2">
                  <MessageSquare className="h-3 w-3" />
                  Submit Feedback
                </Link>
              </li>
              <li>
                <a 
                  href="mailto:support@phototheology.com" 
                  className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
                >
                  <Mail className="h-3 w-3" />
                  Email Support
                </a>
              </li>
              <li>
                <Link to="/privacy-policy" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2">
                  <FileText className="h-3 w-3" />
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms-of-service" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2">
                  <FileText className="h-3 w-3" />
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-6 border-t border-border text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Phototheology. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};