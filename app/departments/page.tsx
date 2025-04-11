import { redirect } from "next/navigation"

export default function DepartmentsPage() {
  // Redirect to home page if someone tries to access /departments directly
  redirect("/")

  // This code will never run due to the redirect
  return null
}
