import { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Run by a human.',
  };

export default function Page() {
    return (
        <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-black">
                Run by a human.
            </h1>
            <h2 className="text-xl font-bold text-gray-500 mb-4">
                {process.env.APP_NAME || '[App]'} is a bootstrapped web application built and run by <a href="https://x.com/maxime_duhamel_" className="underline hover:text-gray-700" target="_blank">a human</a>.
            </h2>
            <article className="text-gray-700 dark:text-gray-500 space-y-4">
                <p>
                    <span className="text-gray-800 dark:text-gray-400">Building an application</span> is a long and hard journey. This journey is as fulfilling as it is challenging. It's a journey that I, Maxime Duhamel, have been on for the past few years. I learned a lot, failed a lot, had some sleepless nights, and some great moments of joy.
                </p>
                <p>
                    <span className="text-gray-800 dark:text-gray-400">Building an application</span> alone has some advantages. The main advantage is that I can make decisions quickly and implement them even faster. Features shipped in a few hours, bug fixed in a few minutes, support answered in a few seconds. I can move and adapt quickly.
                </p>
                <p>
                    <span className="text-gray-800 dark:text-gray-400">Building an application</span> alone also have some drawbacks. The main drawback is that I have to do everything myself : marketing, development, design, support... <a href="https://x.com/nico_jeannen/status/1880797334361215133" target="_blank" className="underline hover:text-gray-900 dark:hover:text-gray-300">I tick all the boxes.</a>
                </p>
                <p>
                    <span className="text-gray-800 dark:text-gray-400">Building an application</span> is a journey that I'm proud of, and I'm happy to make your life a bit easier with the tools I build. I hope you'll enjoy using {process.env.APP_NAME || '[App]'} as much as I enjoyed building it. Thank you for choosing {process.env.APP_NAME || '[App]'}, thank you for supporting small developpers like me.
                </p>
                <div>
                    Maxime Duhamel,<br/>{process.env.APP_NAME || '[App]'}'s builder.
                </div>
            </article>
        </section>
    )
}