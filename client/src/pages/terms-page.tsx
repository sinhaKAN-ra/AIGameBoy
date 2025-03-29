import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const TermsPage = () => {
  return (
    <div className="min-h-screen bg-[#121212] py-12">
      <div className="container max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="font-pixel text-3xl text-white mb-4">Terms & Conditions</h1>
          <p className="text-gray-400">Last updated: {new Date().toLocaleDateString()}</p>
        </div>
        
        <div className="bg-[#2a2a2a] rounded-lg p-6 md:p-8 mb-8">
          <div className="prose prose-invert max-w-none">
            <h2 className="font-pixel text-xl text-primary">Agreement to Terms</h2>
            <p>
              These Terms and Conditions constitute a legally binding agreement made between you, whether personally or on behalf of an entity,
              and AI Game Arcade, concerning your access to and use of our website and services.
              By accessing or using our platform, you agree to be bound by these Terms. If you disagree with any part of these Terms,
              you may not access the website.
            </p>
            
            <h2 className="font-pixel text-xl text-primary mt-8">User Accounts</h2>
            <p>
              When you create an account with us, you must provide accurate, complete, and current information.
              Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account.
            </p>
            <p>
              You are responsible for safeguarding the password that you use to access our platform and for any activities or actions under your password.
              You agree not to disclose your password to any third party. You must notify us immediately upon becoming aware of any breach of security or unauthorized use of your account.
            </p>
            
            <h2 className="font-pixel text-xl text-primary mt-8">User Conduct</h2>
            <p>You agree not to use our platform:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>In any way that violates any applicable national or international law or regulation</li>
              <li>To exploit or harm minors in any way</li>
              <li>To transmit any material that is defamatory, obscene, or offensive</li>
              <li>To impersonate or attempt to impersonate AI Game Arcade, an employee, another user, or any other person</li>
              <li>To engage in any conduct that restricts or inhibits anyone's use or enjoyment of the platform</li>
              <li>To attempt to gain unauthorized access to, interfere with, damage, or disrupt any parts of the platform</li>
              <li>To use any robot, spider, or other automatic device to access the platform for any purpose</li>
            </ul>
            
            <h2 className="font-pixel text-xl text-primary mt-8">Game Scores and Leaderboards</h2>
            <p>
              By submitting scores to our platform, you grant us the right to display your username and score on public leaderboards.
              We reserve the right to remove any scores that we suspect of being fraudulent or obtained through cheating.
            </p>
            <p>
              You agree not to use any third-party software, hacks, or other means to artificially inflate your game scores or rankings.
              Such actions may result in the removal of your scores and/or termination of your account.
            </p>
            
            <h2 className="font-pixel text-xl text-primary mt-8">Intellectual Property</h2>
            <p>
              The website and its original content, features, and functionality are owned by AI Game Arcade and are protected by international copyright,
              trademark, patent, trade secret, and other intellectual property or proprietary rights laws.
            </p>
            <p>
              The games available on our platform are created by AI models and are provided for entertainment purposes only.
              The intellectual property rights for each game belong to their respective owners or creators.
            </p>
            
            <h2 className="font-pixel text-xl text-primary mt-8">Limitation of Liability</h2>
            <p>
              In no event shall AI Game Arcade, its directors, employees, partners, agents, suppliers, or affiliates be liable for any indirect,
              incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill,
              or other intangible losses, resulting from:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Your access to or use of or inability to access or use the platform</li>
              <li>Any conduct or content of any third party on the platform</li>
              <li>Any content obtained from the platform</li>
              <li>Unauthorized access, use, or alteration of your transmissions or content</li>
            </ul>
            
            <h2 className="font-pixel text-xl text-primary mt-8">Termination</h2>
            <p>
              We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever,
              including without limitation if you breach the Terms.
            </p>
            <p>
              Upon termination, your right to use the platform will immediately cease. If you wish to terminate your account,
              you may simply discontinue using the platform or contact us to request account deletion.
            </p>
            
            <h2 className="font-pixel text-xl text-primary mt-8">Changes to These Terms</h2>
            <p>
              We reserve the right, at our sole discretion, to modify or replace these Terms at any time.
              If a revision is material, we will try to provide at least 30 days' notice prior to any new terms taking effect.
              What constitutes a material change will be determined at our sole discretion.
            </p>
            <p>
              By continuing to access or use our platform after those revisions become effective,
              you agree to be bound by the revised terms. If you do not agree to the new terms, please stop using the platform.
            </p>
            
            <h2 className="font-pixel text-xl text-primary mt-8">Governing Law</h2>
            <p>
              These Terms shall be governed and construed in accordance with the laws, without regard to its conflict of law provisions.
            </p>
            <p>
              Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights.
              If any provision of these Terms is held to be invalid or unenforceable by a court,
              the remaining provisions of these Terms will remain in effect.
            </p>
            
            <h2 className="font-pixel text-xl text-primary mt-8">Contact Us</h2>
            <p>
              If you have any questions about these Terms and Conditions, please contact us at:
            </p>
            <p className="bg-[#121212] p-4 rounded mt-2 flex items-center justify-center">
              <span className="text-[#ffc857]">terms@aigamearcade.com</span>
            </p>
          </div>
        </div>
        
        <Separator className="my-8 bg-gray-800" />
        
        <div className="text-center mb-8">
          <p className="text-gray-400 mb-4">
            By using our website, you acknowledge that you have read and agreed to these Terms & Conditions.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/">
              <Button variant="outline" className="border-gray-700">
                Return to Home
              </Button>
            </Link>
            <Link href="/privacy">
              <Button variant="outline" className="border-gray-700">
                View Privacy Policy
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;
