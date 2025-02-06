import { Card, CardContent } from "~/app/_components/ui/card"
import Image from "next/image"
import Link from "next/link"
import { Separator } from "~/app/_components/ui/separator"
import { db } from "~/server/db"
import { eq, type InferSelectModel, not } from "drizzle-orm"
import { courses } from "~/server/db/schema"

type ContentType = InferSelectModel<typeof courses>

function ContentCell(course: ContentType) {
    return (
        <Card>
            {course.status !== "disabled" ? (
                <Link href={`/content/${course.id}`}>
                    <CardContent className="p-4 flex flex-col gap-4 items-center justify-center">
                        <Image className="aspect-square" src={course.image} alt={course.name} width={150} height={150} />
                        <h2 className="text-xl text-center">{course.name}</h2>
                    </CardContent>
                </Link>
            ) : (
                <CardContent className="p-4 flex flex-col gap-4 items-center justify-center filter blur-xs grayscale">
                    <Image className="aspect-square" src={course.image} alt={course.name} width={150} height={150} />
                    <h2 className="text-xl text-center">{course.name}</h2>
                </CardContent>
            )}
        </Card>
    )
}

export default async function Content() {

    const content = await db.query.courses.findMany({
        where: not(eq(courses.status, "draft")),
    });

    return (
        <div className="grow flex flex-col items-center w-full py-8">
            <h1 className="text-2xl font-bold">Content</h1>
            <h3>Choose the topic you want to view</h3>

            <div className="flex flex-col gap-16 items-center">
                <div className="w-full grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 mt-4 p-8 md:p-4">
                    {content.filter(c => c.status === "active").map((c) => (
                        <ContentCell key={c.id} {...c} />
                    ))}
                </div>

                <Separator className="bg-primary" />

                <div className="w-full items-center flex flex-col">
                    <h1 className="text-2xl font-bold">Archive</h1>
                    <h3>Topics archived</h3>

                    <div className="w-full grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 mt-4 p-8 md:p-4">
                        {content.filter(c => c.status === "archived").map((c) => (
                            <ContentCell key={c.id} {...c} />
                        ))}
                    </div>
                </div>

                <Separator className="bg-primary" />

                <div className="w-full items-center flex flex-col">
                    <h1 className="text-2xl font-bold">Coming soon...</h1>

                    <div className="w-full grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 mt-4 p-8 md:p-4">
                        {content.filter(c => c.status === "disabled").map((c) => (
                            <ContentCell key={c.id} {...c} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
