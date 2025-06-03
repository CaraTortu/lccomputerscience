"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/app/_components/ui/card"
import Image from "next/image"
import { type InferSelectModel } from "drizzle-orm"
import { type courses } from "~/server/db/schema"
import { useRouter } from "next/navigation"
import { Badge } from "../badge"
import { Calendar, Clock } from "lucide-react"
import { Button } from "../button"

type ContentType = InferSelectModel<typeof courses>

export function CoursesGrid({ courses }: { courses: ContentType[] }) {
    // Filter out disabled courses for regular users
    const visibleCourses = courses.filter((course) => course.status !== "disabled")

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {visibleCourses.map((course) => (
                <CourseCard key={course.id} course={course} />
            ))}
        </div>
    )
}

function CourseCard({ course: oldCourse }: { course: ContentType }) {
    const router = useRouter()
    // TODO: MAKE THIS IN THE DB
    const course = {
        ...oldCourse,
        free: false
    }

    const handleCardClick = () => {
        router.push(`/content/${course.id}`)
    }

    const getStatusBadgeVariant = (status: ContentType["status"]) => {
        switch (status) {
            case "active":
                return "default"
            case "archived":
                return "secondary"
            case "disabled":
                return "destructive"
            default:
                return "default"
        }
    }

    const formatDate = (date: Date) => {
        return new Intl.DateTimeFormat("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        }).format(date)
    }

    return (
        <Card
            className="group cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] pt-0"
            onClick={handleCardClick}
        >
            <div className="relative overflow-hidden rounded-t-lg">
                <Image
                    src={course.image}
                    alt={course.name}
                    width={300}
                    height={200}
                    className="w-full h-48 object-cover transition-transform duration-200 group-hover:scale-105"
                />
                <div className="absolute top-3 left-3 flex gap-2">
                    <Badge variant={getStatusBadgeVariant(course.status)} className="capitalize">
                        {course.status}
                    </Badge>
                    {course.free && (
                        <Badge
                            variant="outline"
                            className="bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800"
                        >
                            Free
                        </Badge>
                    )}
                </div>
            </div>

            <CardHeader className="pb-3">
                <CardTitle className="text-xl line-clamp-2 group-hover:text-primary transition-colors">{course.name}</CardTitle>
                <CardDescription className="line-clamp-3 text-sm">{course.description}</CardDescription>
            </CardHeader>

            <CardContent className="pt-0">
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>Created {formatDate(course.createdAt)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>Updated {formatDate(course.updatedAt)}</span>
                    </div>
                </div>
            </CardContent>

            <CardFooter className="pt-0">
                <Button
                    className="w-full group-hover:bg-primary/90 transition-colors"
                    onClick={(e) => {
                        e.stopPropagation()
                        handleCardClick()
                    }}
                >
                    {course.free ? "Start Learning" : "View Course"}
                </Button>
            </CardFooter>
        </Card>
    )
}
