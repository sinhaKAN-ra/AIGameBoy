import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const PrivacyPage = () => {
  return (
    <div className="min-h-screen bg-[#121212] py-12">
      <div className="container max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="font-pixel text-3xl text-white mb-4">Privacy Policy</h1>
          <p className="text-gray-400">Last updated: {new Date().toLocaleDateString()}</p>
        </div>
        
        <div className="bg-[#2a2a2a] rounded-lg p-6 md:p-8 mb-8">
          <div className="prose prose-invert max-w-none">
            <h2 className="font-pixel text-xl text-primary">Introduction</h2>
            <p>
              At AI Game Arcade, we respect your privacy and are committed to protecting your personal data.
              This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website
              and use our services.
            </p>
            
            <h2 className="font-pixel text-xl text-primary mt-8">Information We Collect</h2>
            <p>We collect several types of information from and about users of our website, including:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong className="text-[#ffc857]">Personal Data:</strong> Username, email address, and other contact information you provide when creating an account.
              </li>
              <li>
                <strong className="text-[#ffc857]">Usage Data:</strong> Information about how you interact with our website, including game scores, preferences, and activity logs.
              </li>
              <li>
                <strong className="text-[#ffc857]">Device Information:</strong> Information about the device you use to access our platform, including IP address, browser type, and operating system.
              </li>
            </ul>
            
            <h2 className="font-pixel text-xl text-primary mt-8">How We Use Your Information</h2>
            <p>We may use the information we collect from you for various purposes, including to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Create and maintain your account</li>
              <li>Provide, operate, and maintain our website and services</li>
              <li>Track and display game scores on leaderboards</li>
              <li>Improve and personalize your experience on our website</li>
              <li>Communicate with you, including sending notifications about new games or features</li>
              <li>Monitor and analyze usage patterns and trends</li>
              <li>Detect, prevent, and address technical issues</li>
            </ul>
            
            <h2 className="font-pixel text-xl text-primary mt-8">Data Sharing and Disclosure</h2>
            <p>We may share your information in the following situations:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>
                <strong className="text-[#ffc857]">Public Leaderboards:</strong> Your username and game scores may be displayed on public leaderboards.
              </li>
              <li>
                <strong className="text-[#ffc857]">Service Providers:</strong> We may share your information with third-party vendors and service providers that perform services for us or on our behalf.
              </li>
              <li>
                <strong className="text-[#ffc857]">Legal Requirements:</strong> We may disclose your information where required by law or if we believe that disclosure is necessary to protect our rights or comply with a legal process.
              </li>
            </ul>
            
            <h2 className="font-pixel text-xl text-primary mt-8">Data Security</h2>
            <p>
              We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
              However, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
            </p>
            
            <h2 className="font-pixel text-xl text-primary mt-8">Your Data Protection Rights</h2>
            <p>Depending on your location, you may have certain rights regarding your personal information, including:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>The right to access information we hold about you</li>
              <li>The right to request correction of your personal information</li>
              <li>The right to request deletion of your personal information</li>
              <li>The right to object to processing of your personal information</li>
              <li>The right to data portability</li>
              <li>The right to withdraw consent at any time</li>
            </ul>
            
            <h2 className="font-pixel text-xl text-primary mt-8">Cookies and Tracking Technologies</h2>
            <p>
              We use cookies and similar tracking technologies to track activity on our website and store certain information.
              You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
            </p>
            
            <h2 className="font-pixel text-xl text-primary mt-8">Children's Privacy</h2>
            <p>
              Our service is not directed to children under 13. We do not knowingly collect personal information from children under 13.
              If we discover that a child under 13 has provided us with personal information, we will promptly delete it.
            </p>
            
            <h2 className="font-pixel text-xl text-primary mt-8">Changes to This Privacy Policy</h2>
            <p>
              We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page
              and updating the "Last updated" date.
            </p>
            
            <h2 className="font-pixel text-xl text-primary mt-8">Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at:
            </p>
            <p className="bg-[#121212] p-4 rounded mt-2 flex items-center justify-center">
              <span className="text-[#ffc857]">privacy@aigamearcade.com</span>
            </p>
          </div>
        </div>
        
        <Separator className="my-8 bg-gray-800" />
        
        <div className="text-center mb-8">
          <p className="text-gray-400 mb-4">
            By using our website, you acknowledge that you have read and understood this Privacy Policy.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/">
              <Button variant="outline" className="border-gray-700">
                Return to Home
              </Button>
            </Link>
            <Link href="/terms">
              <Button variant="outline" className="border-gray-700">
                View Terms & Conditions
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPage;
