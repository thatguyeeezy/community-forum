import EditUserClient from "./edit-user-client"

// This is a server component that can directly use params
export default function EditUserPage({ params }: { params: { id: string } }) {
  return <EditUserClient userId={params.id} />
}
