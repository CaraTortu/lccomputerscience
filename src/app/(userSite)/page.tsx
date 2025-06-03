import Link from "next/link";
import { Button } from "~/app/_components/ui/button";
import { auth } from "~/server/auth";
import { headers } from "next/headers";

export default async function Home() {
    const session = await auth.api.getSession({
        headers: await headers()
    })

    return (
        <div className="flex flex-col z-0">
            <section className="relative overflow-hidden mt-[-4rem] w-full h-full min-h-dvh bg-gradient-to-br from-purple-800 via-purple-900 to-black flex items-center justify-center ">
                <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-fuchsia-600 rounded-full filter blur-3xl opacity-20 animate-blob"></div>

                <div className="mx-auto text-center text-white flex flex-col gap-2 items-center px-4 z-10">
                    <h1 className="text-3xl md:text-5xl font-bold">Ace Your Leaving Certificate Computer Science with confidence</h1>
                    <p className="text-xl md:text-2xl font-light">Comprehensive study materials, practice exams, and expert guidance to help you succeed.</p>
                    <div className="flex gap-2 items-center justify-center  mt-8">
                        <Link href={session ? "/content" : "/login"}>
                            <Button size="lg" className="w-fit">
                                Start Your Journey
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>
        </div >
    );
}
