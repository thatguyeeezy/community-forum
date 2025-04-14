import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader className="border-b">
            <CardTitle className="text-3xl font-bold">Terms of Service</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="prose max-w-none">
              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
                <p className="mb-4">
                  By accessing or using Florida Coast RP's website and services, you agree to be bound by these Terms of
                  Service. If you do not agree to these terms, please do not use our services.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">2. Description of Service</h2>
                <p className="mb-4">
                  Florida Coast RP provides a platform for role-playing within our FiveM server community. Our services
                  include forums, community resources, and other related features.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">3. User Conduct</h2>
                <p className="mb-4">Users of Florida Coast RP agree to:</p>
                <ul className="list-disc pl-6 mb-4 space-y-2">
                  <li>Comply with all applicable laws and regulations</li>
                  <li>Respect the rights and dignity of other users</li>
                  <li>Not post content that is harmful, offensive, or inappropriate</li>
                  <li>Not attempt to disrupt or compromise the security of our services</li>
                  <li>Not impersonate other individuals or entities</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">4. Content Ownership</h2>
                <p className="mb-4">
                  Users retain ownership of content they post, but grant Florida Coast RP a license to use, modify, and
                  display that content in connection with our services.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">5. Account Security</h2>
                <p className="mb-4">
                  Users are responsible for maintaining the security of their accounts and passwords. Florida Coast RP
                  cannot and will not be liable for any loss or damage resulting from failure to comply with this
                  security obligation.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">6. Termination</h2>
                <p className="mb-4">
                  Florida Coast RP reserves the right to terminate or suspend access to our services without prior
                  notice for conduct that we believe violates these Terms of Service or is harmful to other users, us,
                  or third parties, or for any other reason at our discretion.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">7. Changes to Terms</h2>
                <p className="mb-4">
                  Florida Coast RP reserves the right to modify these terms at any time. We will provide notice of
                  significant changes by posting an announcement on our website or sending an email to users.
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold mb-4">8. Contact Information</h2>
                <p className="mb-4">
                  If you have any questions about these Terms of Service, please contact us through our{" "}
                  <Link href="/contact" className="text-primary hover:underline">
                    contact page
                  </Link>
                  .
                </p>
              </section>

              <div className="mt-8 text-sm">
                <p>Last updated: April 13, 2023</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
