import { eq } from "drizzle-orm"
import { notFound } from "next/navigation"
import { UserEdit } from "~/app/_components/ui/admin/users/userEdit"
import { db } from "~/server/db"
import { user as dbUser } from "~/server/db/schema"

export default async function AdminUsersPage({ params }: { params: Promise<{ userId: string }> }) {
    const userId = (await params).userId

    const user = await db.query.user.findFirst({
        where: eq(dbUser.id, userId)
    })

    if (!user) {
        notFound()
    }

    return (
        <div className="p-6" >
            <UserEdit user={user} />
        </div >
    )
}
