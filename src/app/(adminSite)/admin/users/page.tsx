import { TableUsers } from "~/app/_components/ui/admin/content/table-users";

export default async function UsersAdmin() {
    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Users</h1>
            </div>
            <TableUsers />
        </div>
    )
}
