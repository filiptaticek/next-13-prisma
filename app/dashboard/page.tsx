import { getServerSession } from "next-auth"
import { authOptions } from "@/pages/api/auth/[...nextauth]"
import { redirect } from "next/navigation"
import MyPosts from "../../src/server/components/MyPosts"

export default async function Dashboard () {

  const session = await getServerSession(authOptions)
  if (!session) {
    return redirect("/api/auth/signin")
  }

  return(
    <div>
      <h1 className="text-2xl font-bold"> My posts </h1>
      <MyPosts />
    </div>
  )
}