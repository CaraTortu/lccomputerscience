import Image from 'next/image'
import Link from 'next/link'

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="flex items-center border-t px-10 py-4">
            {/* Copyright and Social Media in a Flexbox */}
            <div className="flex items-center w-full flex-wrap md:flex-nowrap gap-6">
                <p className="text-nowrap text-black/70 dark:text-primary-foreground">{"©"} {currentYear} LCComputerScience.com</p>
                <div className="grow flex flex-col md:flex-row gap-2 md:gap-8 w-full md:items-center justify-center">
                    <Link href="/terms">Terms and Conditions</Link>
                    <Link href="/contact">Contact Us</Link>
                    <Link href="/grinds">Interested in Grinds</Link>
                </div>
                <div className="flex gap-4">
                    <Link href="https://x.com/LCComputerSci" prefetch={false}>
                        <Image className='dark:invert' src="/assets/svg/twitter.svg" width="32" height="32" alt="X logo" />
                    </Link>
                    <Link className='dark:invert' href="https://www.instagram.com/lccomputerscience/" prefetch={false}>
                        <Image src="/assets/svg/instagram.svg" width="32" height="32" alt="Instagram logo" />
                    </Link>
                    <Link className='dark:invert' href="https://www.facebook.com/LCComputerScience/" prefetch={false}>
                        <Image src="/assets/svg/facebook.svg" width="32" height="32" alt="Facebook logo" />
                    </Link>
                    <Link className='dark:invert' href="https://www.tiktok.com/@lccomputerscience" prefetch={false}>
                        <Image src="/assets/svg/tiktok.svg" width="32" height="32" alt="TikTok logo" />
                    </Link>
                </div>
            </div>
        </footer>
    );
}

