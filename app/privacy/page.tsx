"use client"

import { useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import "@/app/auth-pages.css"

export default function PrivacyPage() {
  // Force the background color
  useEffect(() => {
    document.body.style.backgroundColor = "#1e293b"
    return () => {
      document.body.style.backgroundColor = ""
    }
  }, [])

  return (
    <div className="min-h-screen py-8 px-4 md:px-6" style={{ backgroundColor: "#1e293b" }}>
      <div className="container mx-auto">
        <Card className="auth-card">
          <CardHeader className="border-b border-slate-700">
            <CardTitle className="text-3xl font-bold text-white">Privacy Policy</CardTitle>
          </CardHeader>
          <CardContent className="prose dark:prose-invert max-w-none pt-6">
            <div className="space-y-8">
              <section>
                <h2 className="text-2xl font-semibold text-white">1. Information We Collect</h2>
                <p className="text-slate-300">
                  Florida Coast Roleplay ("FCRP") collects limited user data necessary for community management and
                  server functionality. This includes Discord usernames, in-game character names, IP addresses, and
                  gameplay logs. We do not collect sensitive personal information.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white">2. How We Use Information</h2>
                <p className="text-slate-300">
                  The information collected is used solely for moderation, community engagement, rule enforcement, and
                  improving server functionality. We do not sell or distribute user data for commercial purposes.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white">3. Information Sharing</h2>
                <p className="text-slate-300">
                  We do not share your personal information with third parties, except when required by law, to enforce
                  community guidelines, or in cases of severe rule violations where external authorities may be
                  involved.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white">4. Cookies & Tracking</h2>
                <p className="text-slate-300">
                  Our website may use cookies to enhance user experience, including session management and
                  authentication. Users can adjust browser settings to disable cookies, though this may impact certain
                  functionalities.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white">5. Data Security</h2>
                <p className="text-slate-300">
                  We take reasonable measures to protect user data from unauthorized access, misuse, or loss. However,
                  users acknowledge that no online platform can guarantee complete security.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white">6. Community Transparency</h2>
                <p className="text-slate-300">
                  FCRP staff may log server activity to ensure fair play and maintain community integrity. Gameplay logs
                  may be reviewed in case of disputes, rule enforcement, or server maintenance.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white">7. Age Restrictions</h2>
                <p className="text-slate-300">
                  Florida Coast Roleplay is intended for users aged 16 and older. We do not knowingly collect or store
                  data from individuals under 16. If we become aware that an individual under 16 has provided personal
                  data, it will be promptly deleted. Additionally, in compliance with the Children's Online Privacy
                  Protection Act (COPPA), we do not collect or retain data from users under 13 under any circumstances.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white">8. Changes to This Policy</h2>
                <p className="text-slate-300">
                  We reserve the right to update this privacy policy at any time. Continued use of our services after
                  modifications indicates acceptance of the revised policy.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white">9. Contact Us</h2>
                <p className="text-slate-300">
                  If you have any questions regarding this policy, please{" "}
                  <a href="/contact" className="text-blue-400 hover:text-blue-300 underline">
                    contact us
                  </a>
                  .
                </p>
              </section>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
