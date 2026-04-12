import { Metadata } from 'next';
import { getResearchBySlug, getResearchSlugs } from '@/lib/markdown';

import TopBar from '@/components/layout/TopBar';
import "@/styles/global.css";
import "@/styles/research/research.css";
import "@/styles/markdown.css";

export async function generateStaticParams() {
    const slugs = getResearchSlugs();
    return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const resolvedParams = await params;
    const { frontmatter } = await getResearchBySlug(resolvedParams.slug);

    return {
        title: frontmatter.title,
        description: frontmatter.description,
        alternates: {
            canonical: `/research/${resolvedParams.slug}`,
        },
        openGraph: {
            title: frontmatter.title,
            description: frontmatter.description,
            type: 'article',
            publishedTime: frontmatter.date,
            authors: [frontmatter.author],
        },
        twitter: {
            card: 'summary_large_image',
            title: frontmatter.title,
            description: frontmatter.description,
        },
    };
}

const page = async ({
    params
}: {
    params: Promise<{ slug: string }>
}) => {
    // Await the params before destructuring
    const resolvedParams = await params;

    // Fetch the actual string slug
    const { contentHtml, frontmatter } = await getResearchBySlug(resolvedParams.slug);

    return (
        <div className='home-container'>
            <TopBar />
            <div className='article_container'>
                <article>
                    <p className='datetime'>{frontmatter.date}</p>
                    <h1 className='title'>{frontmatter.title}</h1>
                    <p className='author'>By, {frontmatter.author}{frontmatter.author_affiliation ? ` - ${frontmatter.author_affiliation}` : ''}</p>
                    <div className='separator'></div>
                    <div className='content' dangerouslySetInnerHTML={{ __html: contentHtml.replace(/<h1[^>]*>.*?<\/h1>/i, '') }} />
                </article>
            </div>
        </div>
    );
}

export default page;