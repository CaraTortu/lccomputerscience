import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "~/app/_components/ui/card";
import { Separator } from "~/app/_components/ui/separator";
import Image from "next/image";
import { env } from "~/env";

export default async function Terms() {
    return (
        <div className="p-10 pt-20 w-full flex items-center justify-center">
            <Card className="max-w-(--breakpoint-xl)">
                <CardHeader className="flex flex-col justify-center items-center">
                    <Image src="/assets/png/char.png" alt="LC Computer Science" width={150} height={150} />
                    <CardTitle className="text-3xl">LCComputerScience Terms and Conditions</CardTitle>
                </CardHeader>
                <Separator />
                <CardContent className="pt-8">
                    <p>Welcome to LCComputerScience! By accessing and using our website, you agree to comply with these terms and conditions. If you disagree with any part of these terms, please refrain from using our site.</p>

                    <h2 className="mt-8 text-2xl font-bold">Content and Intellectual Property</h2>
                    <p>All content created by LCComputerScience is protected by intellectual property laws. This includes copyrights, trademarks, and other intellectual property rights. Users may not reproduce, modify, or distribute our content without the express written permission of LCComputerScience. Users may not redistribute any content from LCComputerScience without explicit permission.
                        However, teachers are allowed to use our content within the classroom for educational purposes.</p>

                    <h2 className="mt-8 text-2xl font-bold">Termination of Access</h2>
                    <p>LCComputerScience reserves the right to terminate your access to the Service at any time, with or without cause, and with or without notice. This may occur if you violate these terms, engage in inappropriate behavior, or for any other reason.</p>

                    <h2 className="mt-8 text-2xl font-bold">Privacy Policy</h2>
                    <p>LCComputerScience takes your privacy seriously. Our privacy policy outlines how we collect, use, and protect user data. At LCComputerScience, we take your privacy seriously. This privacy policy outlines how we collect, use, and protect user data. By using our website. When you interact with our site, we may collect personal information such as your name, email address, and location. This information helps us personalize your experience and improve our services.
                        We collect data on how you use LCComputerScience, including pages visited, time spent, and interactions. This helps us enhance your browsing experience and tailor content to your interests.</p>

                    <h2 className="mt-8 text-2xl font-bold">User Conduct</h2>
                    <p>Users must use the Service in a lawful, respectful, and non-disruptive manner. Prohibited activities include:</p>
                    <ul className="list-group mb-3">
                        <li className="list-group-item">Uploading or transmitting any content that is defamatory, harassing, obscene, threatening, or violates the intellectual property rights of others.</li>
                        <li className="list-group-item">Engaging in spamming, hacking, or other activities that may damage or interfere with the Service or other users.</li>
                        <li className="list-group-item">Attempting to gain unauthorized access to the Service or any other account or computer system.</li>
                    </ul>

                    <h2 className="mt-8 text-2xl font-bold">Cookies and Tracking</h2>
                    <p>We use cookies and tracking technologies on the Website. These technologies allow us to collect information about how you use the Service, such as the pages you visit, the time you spend on the site, and the links you click. We use this information to improve your experience, personalize content, and analyze website usage. You can choose to disable cookies in your browser settings. However, this may limit your ability to use certain features of the website.</p>

                    <h2 className="mt-8 text-2xl font-bold">Limitation of Liability</h2>
                    <p>LCComputerScience is not liable for any damages arising from your use of the Website or the Service. This includes, but is not limited to, direct, indirect, incidental, consequential, or punitive damages. You use the service at your own risk.</p>

                    <h2 className="mt-8 text-2xl font-bold">AI Fair Usage Policy</h2>
                    <p>LCComputerScience uses AI to provide personalized learning experiences. To ensure fair usage, we may limit the number of questions you can answer in a given time period. This helps us maintain a high-quality experience for all users.</p>

                    <h2 className="mt-8 text-2xl font-bold">Changes to Terms</h2>
                    <p>We reserve the right to update these Terms at any time. We will notify users of any changes by posting the revised Terms on the Website. Your continued use of the service after the revised Terms are posted constitutes your agreement to be bound by the revised Terms.</p>

                    <h2 className="mt-8 text-2xl font-bold">Contact Us</h2>
                    <p>If you have any questions or concerns about these Terms, please feel free to contact us at <Link className="underline" href={`mailto:${env.CONTACT_EMAIL}`}>{env.CONTACT_EMAIL}</Link>.</p>
                </CardContent>
            </Card>
        </div>
    )
}
