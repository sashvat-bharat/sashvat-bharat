import { getResearchBySlug, getResearchSlugs } from '@/lib/markdown';
import TopBar from '@/components/layout/TopBar';
import "@/styles/global.css";
import "@/styles/research/research.css";

export async function generateStaticParams() {
    const slugs = getResearchSlugs();
    return slugs.map((slug) => ({ slug }));
}

const page = async ({
    params
}: {
    params: Promise<{ slug: string }>
}) => {
    // Await the params before destructuring
    const resolvedParams = await params;

    // Fetch the actual string slug
    const { contentHtml } = await getResearchBySlug(resolvedParams.slug);

    return (
        <div className='research_page_container'>
            <TopBar />
            <br />
            <div className='research_articles_container'>
                <article>
                    <div dangerouslySetInnerHTML={{ __html: contentHtml }} />
                </article>
            </div>
        </div>
    );
}

export default page;