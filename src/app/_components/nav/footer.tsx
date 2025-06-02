import Link from 'next/link'
import { Button } from '../ui/button';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="flex items-center border-t px-4 md:px-10 py-4 z-20 bg-background">
            {/* Copyright and Social Media in a Flexbox */}
            <div className="flex items-center w-full flex-wrap md:flex-nowrap gap-8 md:gap-12 ">
                <p className="text-nowrap  text-black/70 dark:text-primary-foreground/80">{"©"} {currentYear} LCComputerScience</p>
                <div className="flex flex-col md:flex-row gap-2 md:gap-4 md:items-center justify-center">
                    <Link href="/terms"><Button variant={"ghost"}>Terms and Conditions</Button></Link>
                    <Link href="/contact"><Button variant={"ghost"}>Contact us</Button></Link>
                </div>
            </div>
        </footer>
    );
}

