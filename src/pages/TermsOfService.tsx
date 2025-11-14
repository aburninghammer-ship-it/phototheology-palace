import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const TermsOfService = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <Card className="p-8">
          <h1 className="text-4xl font-bold mb-2">Terms of Service</h1>
          <p className="text-muted-foreground mb-8">Last updated: {new Date().toLocaleDateString()}</p>

          <div className="space-y-6 text-foreground">
            <section>
              <h2 className="text-2xl font-semibold mb-3">1. Acceptance of Terms</h2>
              <p>
                By accessing and using Phototheology, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to these terms, please do not use our service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">2. Description of Service</h2>
              <p>
                Phototheology provides a comprehensive Bible study platform incorporating memory techniques, interactive learning, AI assistance, and community features to help users engage with Scripture through the Phototheology method.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">3. User Accounts</h2>
              <p className="mb-3">To access certain features, you must create an account. You agree to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Provide accurate and complete information</li>
                <li>Maintain the security of your account credentials</li>
                <li>Accept responsibility for all activities under your account</li>
                <li>Notify us immediately of any unauthorized access</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">4. User Conduct</h2>
              <p className="mb-3">You agree not to:</p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Violate any applicable laws or regulations</li>
                <li>Infringe on intellectual property rights</li>
                <li>Upload harmful or malicious content</li>
                <li>Harass, abuse, or harm other users</li>
                <li>Attempt to breach security measures</li>
                <li>Use the service for unauthorized commercial purposes</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">5. User Content</h2>
              <p className="mb-3">
                You retain ownership of content you create and share. By posting content, you grant us a license to use, modify, and display it as necessary to provide the service.
              </p>
              <p>
                We reserve the right to remove content that violates these terms or is otherwise objectionable.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">6. Intellectual Property</h2>
              <p>
                The Phototheology method, platform design, content, and materials are protected by copyright and other intellectual property laws. You may not copy, modify, or distribute our proprietary content without permission.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">7. Subscription and Payment</h2>
              <p className="mb-3">
                Some features require a paid subscription. By subscribing, you agree to:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Pay all applicable fees</li>
                <li>Provide accurate billing information</li>
                <li>Automatic renewal unless cancelled</li>
                <li>Our refund policy as stated at time of purchase</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">8. AI-Assisted Features</h2>
              <p>
                Our service includes AI-powered study assistance (Jeeves). While we strive for accuracy, AI responses should be verified against Scripture and sound doctrine. We are not responsible for theological interpretations provided by AI features.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">9. Disclaimer of Warranties</h2>
              <p>
                The service is provided "as is" without warranties of any kind. We do not guarantee uninterrupted access or error-free operation. Use of the service is at your own risk.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">10. Limitation of Liability</h2>
              <p>
                To the maximum extent permitted by law, we shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">11. Termination</h2>
              <p>
                We reserve the right to suspend or terminate your account for violations of these terms. You may terminate your account at any time through your account settings.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">12. Changes to Terms</h2>
              <p>
                We may modify these terms at any time. Continued use of the service after changes constitutes acceptance of the modified terms. We will notify users of significant changes.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">13. Governing Law</h2>
              <p>
                These terms are governed by applicable laws. Any disputes shall be resolved in accordance with the jurisdiction where the service is operated.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-3">14. Contact Information</h2>
              <p>
                For questions about these Terms of Service, please contact us through the Feedback page or email support@phototheology.app
              </p>
            </section>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default TermsOfService;
