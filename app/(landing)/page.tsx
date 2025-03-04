import { CreditCard, Database, User, FlaskConical, MessagesSquare, Moon, SpellCheck, CalendarPlus2, LayoutDashboard, Sparkles } from 'lucide-react';
import CTA from '@/components/big/cta';
import SocialProof from '@/components/big/socialProof';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import BentoGrid, { Feature } from '@/components/big/bentoGrid';

export default function HomePage() {
    const features: Feature[] = [
        { title: "Credentials & OAuth", description: ["2 credentials flows :", "The first one has 2 static pages : Sign In / Sign Up.", "The second one has 1 dynamic page : Login.", "And obviously, social login."], icon: User, rowSpan: 2 },
        { title: "Postgres Database", description: "Store your data using Drizzle with any PostgreSQL.", icon: Database },
        { title: "Payments & Subscriptions", description: "One-time payment, subscriptions and discount using Stripe.", icon: CreditCard },
        { title: "A/B Testing", description: "Maximize your conversion by A/B testing, and displaying the most effective component.", icon: FlaskConical, colSpan: 2 },
        { title: "Daily Update", description: "The boilerplate gets new features and fewer bugs daily.", icon: CalendarPlus2 },
        { title: "Admin Dashboard", description: "Manage your users, feedbacks, tickets, and settings in the admin dashboard.", icon: LayoutDashboard },
        { title: "Collect Feedback", description: ["Collect bugs, suggestions and feedback from users with the small button on the bottom right corner of this page.", "These are the one used to fill the wall of love below."], icon: MessagesSquare, rowSpan: 2 },
        { title: "Legal & GDPR", description: "The boilerplate is GDPR compliant and has a legal page.", icon: Moon },
        { title: "Accessibility", description: "The boilerplate is accessible and has a dark mode.", icon: Moon },
        { title: "TailwindCSS and Shadcn/ui", description: "Use the power of TailwindCSS and Shadcn/ui to build your components.", icon: Sparkles, colSpan: 2 },
        { title: "Translations", description: "React-i18next is already set up to translate your app in multiple languages.", icon: SpellCheck },
    ]

    return (
        <main>
            {/* <ABTest A={<h1>Test A</h1>} B={<h1>Test B</h1>} testName="homepage_heading" description="A test to determine which headline make the user stay longer on the page" location="/" /> */}
            <section className='py-4'>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center md:mx-auto min-h-[87dvh] flex flex-col justify-between">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-slate-100 tracking-tight sm:text-4xl md:text-5xl">
                        Start your brilliant idea,&nbsp;<strong className="text-primary">with all the fluff already done</strong>
                    </h1>
                    {/* <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-xl lg:text-lg xl:text-xl">
                            Start your brilliant idea with all the fluff already done and build your next startup in days.
                        </p> */}
                    <AspectRatio ratio={16 / 9} className="mt-8">
                        <div className="w-full h-full bg-gray-500 rounded-md">

                        </div>
                    </AspectRatio>
                    <div className="mt-8 space-y-2 sm:max-w-lg sm:mx-auto sm:text-center">
                        <CTA />
                        <SocialProof />
                    </div>
                </div>
            </section>

            <section className="py-16 bg-white dark:bg-black w-full min-h-screen">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <header className="text-center mb-8">
                        <h2 className="text-4xl font-semibold">Features you’ve always dreamed of but never had the time to build.</h2>
                        <h3 className="text-2xl">Save time, money and mental health.</h3>
                    </header>
                    <BentoGrid features={features} />
                </div>
            </section>

            <section className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="lg:grid lg:grid-cols-2 lg:gap-8 lg:items-center">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 dark:text-slate-100 sm:text-4xl">
                                Ready to [action] ?
                            </h2>
                            <p className="mt-3 max-w-3xl text-lg text-gray-700 dark:text-gray-300">
                                Use a sense of urgency and limited availability to encourage the user to take action now.
                            </p>
                        </div>
                        <div className="mt-8 lg:mt-0 flex justify-center lg:justify-end">
                            <CTA />
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
