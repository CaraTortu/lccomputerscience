import { notFound } from "next/navigation";
import { ContentEditor } from "~/app/_components/ui/admin/content/content-editor";
import { api } from "~/trpc/server";

export default async function AdminModulesPage({ params }: { params: Promise<{ courseId: string, moduleId: string, lessonId: string }> }) {
    const courseId = (await params).courseId;
    const moduleId = (await params).moduleId;
    const lessonId = (await params).lessonId;

    const course = await api.admin.getCourse({ courseId });
    const cModule = course?.modules.find((m) => m.id === moduleId);
    const lesson = cModule?.lessons.find((l) => l.id === lessonId);

    // Check the course is valid and the module exists
    if (!course || !cModule || !lesson) {
        notFound();
    }

    return (
        <div className="p-6 pt-0 h-full">
            <ContentEditor
                lesson={lesson}
                courseName={course.name}
                courseId={courseId}
                moduleName={cModule.name}
                moduleId={moduleId}
            />
        </div>
    )
}
