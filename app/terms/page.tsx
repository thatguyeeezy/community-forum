import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TermsPage() {
  return (
    <div className="container mx-auto py-6 px-4 md:px-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Terms of Service</CardTitle>
        </CardHeader>
        <CardContent className="prose dark:prose-invert max-w-none">
          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing and using Florida Coast Roleplay ("FCRP"), you agree to
            abide by these Terms of Service. If you do not agree, you must
            discontinue use immediately.
          </p>

          <h2>2. Community Conduct</h2>
          <p>
            Users are expected to follow all server rules and regulations.
            Disruptive behavior, including harassment, discrimination,
            exploitation of game mechanics, or any form of toxicity, will not
            be tolerated.
          </p>

          <h2>3. Roleplay Standards</h2>
          <p>
            Florida Coast Roleplay is a serious roleplay server. Users must
            engage in realistic roleplay and adhere to community guidelines.
            Fail RP, meta-gaming, power-gaming, and other prohibited actions
            will result in disciplinary actions, including bans.
          </p>

          <h2>4. Content Ownership</h2>
          <p>
            Any in-game content, including user-created assets, characters,
            and roleplay scenarios, remain the property of FCRP. Users may not
            claim ownership or distribute server-related content without
            explicit permission.
          </p>

          <h2>5. Moderation & Enforcement</h2>
          <p>
            FCRP staff reserve the right to enforce community rules at their
            discretion. Admins and moderators may take actions such as warnings,
            kicks, bans, or content removal to maintain a fair and respectful
            environment.
          </p>

          <h2>6. Privacy & Data Usage</h2>
          <p>
            By using our services, you acknowledge that FCRP may collect and
            store limited user data, including but not limited to usernames,
            Discord IDs, and gameplay logs, for moderation and community
            management purposes. Our full Privacy Policy can be found at <a href="/privacy">Privacy Policy</a>.
          </p>

          <h2>7. Donations & Virtual Goods</h2>
          <p>
            Donations to FCRP are voluntary and non-refundable. Any perks or
            in-game items received in return for donations are virtual goods and
            hold no real-world monetary value.
          </p>

          <h2>8. Changes to Terms</h2>
          <p>
            We reserve the right to update or modify these terms at any time.
            Continued use of our services constitutes acceptance of any
            revisions.
          </p>

          <h2>9. Limitation of Liability</h2>
          <p>
            FCRP is provided "as is" without warranties of any kind. We are not
            responsible for any disruptions, lost data, or damages arising from
            server use.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
