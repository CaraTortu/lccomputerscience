import { notFound } from "next/navigation";
import { TableLessons } from "~/app/_components/ui/admin/content/table-lessons";
import { api } from "~/trpc/server";

export default async function AdminModulesPage({ params }: { params: Promise<{ courseId: string, moduleId: string }> }) {
    const courseId = (await params).courseId;
    const moduleId = (await params).moduleId;
    const course = await api.course.getCourse({ courseId });
    const courseModule = course?.modules.find((m) => m.id === moduleId);

    // Check the course is valid and the module exists
    if (!course || !courseModule) {
        notFound();
    }

    return (
        <div className="p-6">
            <TableLessons
                courseId={course.id}
                courseName={course.name}
                moduleId={courseModule.id}
                moduleName={courseModule.name}
            />
        </div>
    )
}
