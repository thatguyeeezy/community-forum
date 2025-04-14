import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import "@/app/auth-pages.css"

export default function PrivacyPage() {
  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <Card className="auth-card">
        <CardHeader className="border-b dark:border-slate-700 border-slate-200">
          <CardTitle className="text-3xl font-bold">Privacy Policy</CardTitle>
        </CardHeader>
        <CardContent className="prose dark:prose-invert max-w-none pt-6">
          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-semibold">1. Information We Collect</h2>
              <p>
                Florida Coast Roleplay ("FCRP") collects limited user data necessary for community management and server
                functionality. This includes Discord usernames, in-game character names, IP addresses, and gameplay
                logs. We do not collect sensitive personal information.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold">2. How We Use Information</h2>
              <p>
                The information collected is used solely for moderation, community engagement, rule enforcement, and
                improving server functionality. We do not sell or distribute user data for commercial purposes.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold">3. Information Sharing</h2>
              <p>
                We do not share your personal information with third parties, except when required by law, to enforce
                community guidelines, or in cases of severe rule violations where external authorities may be involved.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold">4. Cookies & Tracking</h2>
              <p>
                Our website may use cookies to enhance user experience, including session management and authentication.
                Users can adjust browser settings to disable cookies, though this may impact certain functionalities.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold">5. Data Security</h2>
              <p>
                We take reasonable measures to protect user data from unauthorized access, misuse, or loss. However,
                users acknowledge that no online platform can guarantee complete security.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold">6. Community Transparency</h2>
              <p>
                FCRP staff may log server activity to ensure fair play and maintain community integrity. Gameplay logs
                may be reviewed in case of disputes, rule enforcement, or server maintenance.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold">7. Age Restrictions</h2>
              <p>
                Florida Coast Roleplay is intended for users aged 16 and older. We do not knowingly collect or store
                data from individuals under 16. If we become aware that an individual under 16 has provided personal
                data, it will be promptly deleted. Additionally, in compliance with the Children's Online Privacy
                Protection Act (COPPA), we do not collect or retain data from users under 13 under any circumstances.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold">8. Changes to This Policy</h2>
              <p>
                We reserve the right to update this privacy policy at any time. Continued use of our services after
                modifications indicates acceptance of the revised policy.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold">9. Contact Us</h2>
              <p>
                If you have any questions regarding this policy, please{" "}
                <a
                  href="/contact"
                  className="dark:text-blue-400 text-blue-600 hover:dark:text-blue-300 hover:text-blue-800 underline"
                >
                  contact us
                </a>
                .
              </p>
            </section>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
