import { notFound } from "next/navigation";
import { TableModules } from "~/app/_components/ui/admin/content/table-modules";
import { api } from "~/trpc/server";

export default async function AdminModulesPage({ params }: { params: Promise<{ courseId: string }> }) {
    const courseId = (await params).courseId;
    const course = await api.course.getCourse({ courseId });

    if (!course) {
        notFound();
    }

    return (
        <div className="p-6">
            <TableModules courseId={courseId} />
        </div>
    )
}
