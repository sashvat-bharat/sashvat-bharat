import { Metadata } from 'next';
import { getResearchBySlug, getResearchSlugs, Author } from '@/lib/markdown';

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

    const authorNames = Array.isArray(frontmatter.authors) && frontmatter.authors.length > 0
        ? frontmatter.authors.map((a: Author) => a.name)
        : frontmatter.author ? [frontmatter.author] : [];

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
            authors: authorNames,
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

    const displayAuthors = Array.isArray(frontmatter.authors) && frontmatter.authors.length > 0
        ? frontmatter.authors.map((a: Author) => a.affiliation ? `${a.name} (${a.affiliation})` : a.name).join(', ')
        : frontmatter.author
        ? `${frontmatter.author}${frontmatter.author_affiliation ? ` - ${frontmatter.author_affiliation}` : ''}`
        : '';

    return (
        <div className='home-container'>
            <TopBar />
            <div className='article_container'>
                <article>
                    <p className='datetime'>{frontmatter.date}</p>
                    <h1 className='title'>{frontmatter.title}</h1>
                    {displayAuthors && <p className='author'>By, {displayAuthors}</p>}
                    <div className='separator'></div>
                    <div className='content' dangerouslySetInnerHTML={{ __html: contentHtml.replace(/<h1[^>]*>.*?<\/h1>/i, '') }} />
                </article>
            </div>
        </div>
    );
}

export default page;