import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = "https://shrinkpic.ir";

    return [
        {
            url: `${baseUrl}/`,
            lastModified: new Date(),
            changeFrequency: "weekly",
            priority: 1.0,
        },
        // {
        //     url: `${baseUrl}/about`,
        //     lastModified: new Date(),
        //     changeFrequency: "monthly",
        //     priority: 0.8,
        // },

        // Add more routes as your site grows
    ];
}
