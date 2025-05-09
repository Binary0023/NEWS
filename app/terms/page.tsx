import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center mb-6">
        <Link href="/">
          <Button variant="ghost" size="sm" className="mr-2">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </Link>
        <h1 className="text-3xl font-bold">Terms of Service</h1>
      </div>

      <div className="prose dark:prose-invert max-w-none">
        <p>Last Updated: May 9, 2025</p>

        <h2>1. Acceptance of Terms</h2>
        <p>
          By accessing or using News Hub, you agree to be bound by these Terms of Service. If you do not agree to these
          terms, please do not use our service.
        </p>

        <h2>2. Description of Service</h2>
        <p>
          News Hub provides a platform for users to access news articles, videos, and other content. We may modify,
          suspend, or discontinue any aspect of the service at any time.
        </p>

        <h2>3. User Accounts</h2>
        <p>
          To access certain features of News Hub, you may need to create an account. You are responsible for maintaining
          the confidentiality of your account information and for all activities that occur under your account.
        </p>

        <h2>4. User Conduct</h2>
        <p>You agree not to:</p>
        <ul>
          <li>Use the service for any illegal purpose</li>
          <li>Post or transmit any content that is unlawful, harmful, threatening, or otherwise objectionable</li>
          <li>Attempt to gain unauthorized access to any part of the service</li>
          <li>Interfere with the proper functioning of the service</li>
          <li>Collect or store personal data about other users without their consent</li>
        </ul>

        <h2>5. Content</h2>
        <p>
          News Hub may contain content provided by third parties. We do not endorse, guarantee, or assume responsibility
          for any such content. Users may submit comments and other content, which is subject to our Community
          Guidelines.
        </p>

        <h2>6. Intellectual Property</h2>
        <p>
          All content, features, and functionality of News Hub, including but not limited to text, graphics, logos,
          icons, and software, are the exclusive property of News Hub or its licensors and are protected by copyright,
          trademark, and other intellectual property laws.
        </p>

        <h2>7. Privacy</h2>
        <p>
          Your use of News Hub is subject to our Privacy Policy, which governs our collection and use of your
          information.
        </p>

        <h2>8. Termination</h2>
        <p>
          We reserve the right to terminate or suspend your account and access to News Hub at our sole discretion,
          without notice, for conduct that we believe violates these Terms of Service or is harmful to other users, us,
          or third parties, or for any other reason.
        </p>

        <h2>9. Disclaimer of Warranties</h2>
        <p>
          News Hub is provided "as is" and "as available" without any warranties of any kind, either express or implied.
        </p>

        <h2>10. Limitation of Liability</h2>
        <p>
          In no event shall News Hub be liable for any indirect, incidental, special, consequential, or punitive damages
          arising out of or related to your use of the service.
        </p>

        <h2>11. Changes to Terms</h2>
        <p>
          We may modify these Terms of Service at any time. Your continued use of News Hub after any such changes
          constitutes your acceptance of the new terms.
        </p>

        <h2>12. Governing Law</h2>
        <p>
          These Terms of Service shall be governed by and construed in accordance with the laws of the jurisdiction in
          which News Hub operates, without regard to its conflict of law provisions.
        </p>

        <h2>13. Contact Information</h2>
        <p>
          If you have any questions about these Terms of Service, please contact us at{" "}
          <a href="mailto:support@newshub.com">support@newshub.com</a>.
        </p>
      </div>
    </div>
  )
}
