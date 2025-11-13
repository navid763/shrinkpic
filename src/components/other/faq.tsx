"use client";

import { useState } from "react";

interface FAQItem {
    question: string;
    answer: string;
}

const faqs: FAQItem[] = [
    {
        question: "Is shrinkPic really free?",
        answer: "Yes! shrinkPic is 100% free with no hidden costs, subscriptions, or limitations. All processing happens in your browser."
    },
    {
        question: "Are my images uploaded to a server?",
        answer: "No, never! All image processing happens directly in your browser. Your images never leave your device, ensuring complete privacy and security."
    },
    {
        question: "What image formats are supported?",
        answer: "We support JPG, JPEG, PNG, and WebP formats. You can compress and resize any of these image types."
    },
    {
        question: "What's the maximum file size?",
        answer: "You can upload images up to 10MB. This covers most use cases while ensuring fast processing."
    },
    {
        question: "How much can I compress my images?",
        answer: "Compression rates vary, but typically you can reduce file size by 50-80% while maintaining good visual quality. You have full control over the quality slider."
    },
    {
        question: "Can I resize multiple images at once?",
        answer: "Batch processing for multiple images is coming soon! Currently, you can process one image at a time."
    }
];

export default function FAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const toggleFAQ = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section className="max-w-3xl mx-auto mt-16 px-4" aria-labelledby="faq-heading">
            <h2 id="faq-heading" className="text-2xl sm:text-3xl font-bold text-center mb-8 text-gray-800 dark:text-[#e4e0f1]">
                Frequently Asked Questions
            </h2>

            <div className="space-y-4">
                {faqs.map((faq, index) => (
                    <div
                        key={index}
                        className="bg-[#D9EAFD] dark:bg-[#1a1229] rounded-xl border border-purple-100 dark:border-[#2d2142] overflow-hidden"
                    >
                        <button
                            onClick={() => toggleFAQ(index)}
                            className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-purple-50 dark:hover:bg-[#251a35] transition-colors"
                            aria-expanded={openIndex === index}
                        >
                            <span className="font-semibold text-gray-800 dark:text-[#8b7fb8]">
                                {faq.question}
                            </span>
                            <svg
                                className={`w-5 h-5 text-violet-500 transition-transform ${openIndex === index ? "rotate-180" : ""
                                    }`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>

                        {openIndex === index && (
                            <div className="px-6 pb-4 text-gray-600 dark:text-[#b4a7d6]">
                                {faq.answer}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Schema.org FAQ structured data */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "FAQPage",
                        "mainEntity": faqs.map(faq => ({
                            "@type": "Question",
                            "name": faq.question,
                            "acceptedAnswer": {
                                "@type": "Answer",
                                "text": faq.answer
                            }
                        }))
                    })
                }}
            />
        </section>
    );
}