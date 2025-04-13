import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function TermsPage() {
  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <Card className="border-slate-700 bg-slate-800 shadow-lg">
        <CardHeader className="border-b border-slate-700 bg-slate-800/50">
          <CardTitle className="text-3xl font-bold text-white">Terms of Service</CardTitle>
        </CardHeader>
        <CardContent className="prose dark:prose-invert max-w-none pt-6">
          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-semibold text-white">1. Acceptance of Terms</h2>
              <p className="text-slate-300">
                By accessing and using Florida Coast Roleplay ("FCRP"), you agree to abide by these Terms of Service. If
                you do not agree, you must discontinue use immediately.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white">2. Community Conduct</h2>
              <p className="text-slate-300">
                Users are expected to follow all server rules and regulations. Disruptive behavior, including
                harassment, discrimination, exploitation of game mechanics, or any form of toxicity, will not be
                tolerated.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white">3. Roleplay Standards</h2>
              <p className="text-slate-300">
                Florida Coast Roleplay is a serious roleplay server. Users must engage in realistic roleplay and adhere
                to community guidelines. Fail RP, meta-gaming, power-gaming, and other prohibited actions will result in
                disciplinary actions, including bans.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white">4. Content Ownership</h2>
              <p className="text-slate-300">
                Any in-game content, including user-created assets, characters, and roleplay scenarios, remain the
                property of FCRP. Users may not claim ownership or distribute server-related content without explicit
                permission.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white">5. Moderation & Enforcement</h2>
              <p className="text-slate-300">
                FCRP staff reserve the right to enforce community rules at their discretion. Admins and moderators may
                take actions such as warnings, kicks, bans, or content removal to maintain a fair and respectful
                environment.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white">6. Privacy & Data Usage</h2>
              <p className="text-slate-300">
                By using our services, you acknowledge that FCRP may collect and store limited user data, including but
                not limited to usernames, Discord IDs, and gameplay logs, for moderation and community management
                purposes. Our full Privacy Policy can be found at{" "}
                <a href="/privacy" className="text-blue-400 hover:text-blue-300 underline">
                  Privacy Policy
                </a>
                .
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white">7. Donations & Virtual Goods</h2>
              <p className="text-slate-300">
                Donations to FCRP are voluntary and non-refundable. Any perks or in-game items received in return for
                donations are virtual goods and hold no real-world monetary value.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white">8. Changes to Terms</h2>
              <p className="text-slate-300">
                We reserve the right to update or modify these terms at any time. Continued use of our services
                constitutes acceptance of any revisions.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white">9. Limitation of Liability</h2>
              <p className="text-slate-300">
                FCRP is provided "as is" without warranties of any kind. We are not responsible for any disruptions,
                lost data, or damages arising from server use.
              </p>
            </section>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
