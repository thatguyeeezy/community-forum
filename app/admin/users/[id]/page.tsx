import { Suspense } from "react"
import { notFound } from "next/navigation"
import EditUserClient from "./edit-user-client"

export default function EditUserPage({ params }: { params: { id: string } }) {
  // Extract the ID from params
  const userId = params.id

  if (!userId) {
    notFound()
  }

  return (
    <Suspense fallback={<div className="p-6 text-center">Loading user...</div>}>
      <EditUserClient userId={userId} />
    </Suspense>
  )
}
