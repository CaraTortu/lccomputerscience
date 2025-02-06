import Link from "next/link";
import { Button } from "~/app/_components/ui/button";
import { auth } from "~/server/auth";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "~/app/_components/ui/dialog";
import { Separator } from "~/app/_components/ui/separator";
import { headers } from "next/headers";

function AboutMe() {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="secondary" size="lg">
                    About me
                </Button>
            </DialogTrigger>
            <DialogContent className="w-full max-w-xl bg-background backdrop-blur-md">
                <div className="p-4 flex flex-col gap-6">
                    <DialogTitle className="mb-4 text-xl font-bold">About me</DialogTitle>
                    <p>I am Eoin Gallen, a computer science teacher at Saint Eunans College in Letterkenny. I am a phase 1 teacher for the subject and have a track record of producing excellent results with my students. In the past academic year, 14 of my students achieved a grade of H1 and 7 achieved a H2. Prior to my time at Saint Eunans, I taught at Le Cheile Secondary School in Dublin for two years.</p>
                    <p>I have a strong educational and professional background in computer science, having earned a degree in the subject from ATU Donegal and working as a software developer for Orreco, a company based in Galway. I further honed my skills by completing my PGCE in Queens University Belfast, where I graduated with a 1.1 degree classification.</p>
                </div>
            </DialogContent>
        </Dialog >
    )
}

const testimonials = [
    { name: "Adam Saava", quote: "Eoin Gallen at LCComputerScience.com is an outstanding computer science teacher who goes above and beyond to ensure his students succeed. His knowledge of the subject matter is extensive and he is able to explain complex concepts in a clear and easy to understand manner. I credit much of my success in the Leaving Certificate computer science exam to his teaching and guidance." },
    { name: "Shania Maja", quote: "I had the pleasure of having Eoin Gallen as my computer science teacher for the Leaving Certificate. His teaching style was very effective in helping me to understand the material, and I felt well-prepared for the exam as a result. He was always available to answer any questions I had and provided valuable feedback on my work. I would definitely recommend him to any student looking to excel in computer science." },
    { name: "Caolan Harkin", quote: "Eoin Gallen is an excellent computer science teacher who has a real talent for making complex concepts easy to understand. His approach to teaching is hands-on and interactive, which made learning the material fun and engaging. I would highly recommend him to any student looking to excel in the Leaving Certificate computer science exam." }
]

export default async function Home() {
    const session = await auth.api.getSession({
        headers: await headers()
    })

    return (
        <div className="flex flex-col">
            <section className="mt-[-4rem] w-full h-full min-h-dvh bg-gradient-to-r from-blue-500 to-green-400 dark:from-blue-800 dark:to-green-600 flex items-center justify-center">
                <div className="mx-auto text-center text-white flex flex-col gap-2 items-center px-4">
                    <h1 className="text-3xl md:text-5xl font-bold">Ace Your Leaving Certificate Computer Science with confidence</h1>
                    <p className="text-xl md:text-2xl font-light">Comprehensive study materials, practice exams, and expert guidance to help you succeed.</p>
                    <div className="flex gap-2 items-center justify-center  mt-8">
                        <Link href={session ? "/content" : "/login"}>
                            <Button size="lg" className="w-fit">
                                Start Your Journey
                            </Button>
                        </Link>
                        <AboutMe />
                    </div>
                </div>
            </section>
            <Separator />
            <section className="min-h-[60lvh] md:min-h-lvh flex flex-col items-center justify-center p-8 md:p-4 gap-4 bg-background">
                <h1 className="text-3xl md:text-4xl text-center md:text-left font-bold mb-10 font-baskerville px-4">Tutorials, Examples, Worksheets and more at the tip of your fingers</h1>
                <iframe src="https://drive.google.com/file/d/1dAlX01i8Cy9QDmv-Cuy9y1tYLIouRief/preview" className="w-full max-w-6xl aspect-video rounded-lg" allow="autoplay" />
            </section>
            <Separator />
            <section className="py-20 dark:bg-secondary bg-white">
                <div className="container mx-auto">
                    <h2 className="text-3xl font-bold text-center mb-12">What Our Students Say</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 p-8">
                        {testimonials.map((testimonial, index) => (
                            <div key={index} className="bg-gray-50 dark:bg-gray-600 p-6 rounded-lg shadow-md border border-primary">
                                <p className="text-gray-600 dark:text-gray-200 mb-4 text-left">&quot;{testimonial.quote}&quot;</p>
                                <div className="flex items-center">
                                    <div>
                                        <h3 className="text-black dark:text-white font-semibold">{testimonial.name}</h3>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div >
    );
}
