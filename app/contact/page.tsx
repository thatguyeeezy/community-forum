import { Card, CardContent } from "@/components/ui/card"

export default function ContactPage() {
  return (
    <div className="mt-8 text-center">
      <h2 className="text-xl font-bold mb-2">Other Ways to Reach Us</h2>
      <p className="text-muted-foreground mb-4">Have a question or feedback? Get in touch with our team.</p>
      <div className="grid gap-4 md:grid-cols-2 justify-center">
        <Card>
          <CardContent className="pt-6">
            <h3 className="font-medium mb-2">Fan Discord</h3>
            <p className="text-muted-foreground">
              Open a support ticket in our Discord:
              <a href="https://discord.gg/DaPzAiREBGp" className="text-blue-500 underline">
                Join Here
              </a>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

