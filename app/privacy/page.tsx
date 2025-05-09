import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center mb-6">
        <Link href="/">
          <Button variant="ghost" size="sm" className="mr-2">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Privacy Policy</h1>
      </div>

      <div className="prose dark:prose-invert max-w-none">
        <p>Last Updated: May 9, 2025</p>

        <p>
          This Privacy Policy describes how News Hub ("we", "our", or "us") collects, uses, and shares your personal
          information when you use our website and services.
        </p>

        <h2>1. Information We Collect</h2>
        <p>We collect several types of information from and about users of our website, including:</p>
        <ul>
          <li>
            <strong>Personal Information:</strong> This includes your name, email address, and other information you
            provide when creating an account or updating your profile.
          </li>
          <li>
            <strong>Usage Data:</strong> We collect information about how you interact with our website, such as the
            articles you read, videos you watch, and features you use.
          </li>
          <li>
            <strong>Device Information:</strong> We collect information about the device you use to access our website,
            including your IP address, browser type, and operating system.
          </li>
          <li>
            <strong>Cookies and Similar Technologies:</strong> We use cookies and similar technologies to track activity
            on our website and hold certain information.
          </li>
        </ul>

        <h2>2. How We Use Your Information</h2>
        <p>We use the information we collect to:</p>
        <ul>
          <li>Provide, maintain, and improve our services</li>
          <li>Personalize your experience and deliver content relevant to your interests</li>
          <li>Process and complete transactions</li>
          <li>Send you technical notices, updates, security alerts, and support messages</li>
          <li>Respond to your comments, questions, and requests</li>
          <li>Monitor and analyze trends, usage, and activities in connection with our services</li>
          <li>Detect, prevent, and address technical issues</li>
          <li>Protect against harmful, unauthorized, or illegal activity</li>
        </ul>

        <h2>3. Sharing Your Information</h2>
        <p>We may share your personal information with:</p>
        <ul>
          <li>
            <strong>Service Providers:</strong> We may share your information with third-party vendors, service
            providers, contractors, or agents who perform services for us.
          </li>
          <li>
            <strong>Legal Requirements:</strong> We may disclose your information if required to do so by law or in
            response to valid requests by public authorities.
          </li>
          <li>
            <strong>Business Transfers:</strong> We may share or transfer your information in connection with a merger,
            acquisition, reorganization, or sale of assets.
          </li>
          <li>
            <strong>With Your Consent:</strong> We may share your information with third parties when we have your
            consent to do so.
          </li>
        </ul>

        <h2>4. Your Choices</h2>
        <p>You have several choices regarding the information we collect and how it is used:</p>
        <ul>
          <li>
            <strong>Account Information:</strong> You can update your account information at any time by logging into
            your account.
          </li>
          <li>
            <strong>Cookies:</strong> Most web browsers are set to accept cookies by default. You can usually choose to
            set your browser to remove or reject cookies.
          </li>
          <li>
            <strong>Promotional Communications:</strong> You can opt out of receiving promotional emails from us by
            following the instructions in those emails.
          </li>
        </ul>

        <h2>5. Data Security</h2>
        <p>
          We have implemented measures designed to secure your personal information from accidental loss and from
          unauthorized access, use, alteration, and disclosure.
        </p>

        <h2>6. Children's Privacy</h2>
        <p>
          Our services are not intended for children under 13 years of age, and we do not knowingly collect personal
          information from children under 13.
        </p>

        <h2>7. Changes to Our Privacy Policy</h2>
        <p>
          We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new
          Privacy Policy on this page and updating the "Last Updated" date.
        </p>

        <h2>8. Contact Information</h2>
        <p>
          If you have any questions about this Privacy Policy, please contact us at{" "}
          <a href="mailto:privacy@newshub.com">privacy@newshub.com</a>.
        </p>
      </div>
    </div>
  )
}
