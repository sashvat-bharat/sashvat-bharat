import type { Metadata } from 'next';
import ArticleContent from '@/components/research/ArticleContent';
import ArticleHeader from '@/components/research/ArticleHeader';
import { calculateReadingTime } from '@/lib/date-utils';
import { type Author, getResearchBySlug, getResearchSlugs } from '@/lib/markdown';

import '@/styles/global.css';
import '@/styles/research/research.css';
import '@/styles/markdown.css';

export async function generateStaticParams() {
  const slugs = getResearchSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const { frontmatter } = await getResearchBySlug(resolvedParams.slug);

  const authorNames =
    Array.isArray(frontmatter.authors) && frontmatter.authors.length > 0
      ? frontmatter.authors.map((a: Author) => a.name)
      : frontmatter.author
        ? [frontmatter.author]
        : [];

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

const page = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const resolvedParams = await params;

  const { contentHtml, frontmatter } = await getResearchBySlug(resolvedParams.slug);

  const authorsList: Author[] =
    Array.isArray(frontmatter.authors) && frontmatter.authors.length > 0
      ? frontmatter.authors
      : frontmatter.author
        ? [{ name: frontmatter.author, affiliation: frontmatter.author_affiliation }]
        : [{ name: 'Sashvat Bharat Team' }];

  // Strip top h1 if duplicate
  const cleanContent = contentHtml.replace(/<h1[^>]*>.*?<\/h1>/i, '');
  const { minutes } = calculateReadingTime(cleanContent);

  return (
    <div className='home-container'>
      <main className='article_container'>
        <article className='article_wrapper'>
          <ArticleHeader
            title={frontmatter.title || 'Research Article'}
            date={frontmatter.date}
            authors={authorsList}
            readingMinutes={minutes}
          />

          <ArticleContent htmlContent={cleanContent} />
        </article>
      </main>
    </div>
  );
};

export default page;
