import type { Metadata } from 'next';
import ArticleContent from '@/components/research/ArticleContent';
import ArticleHeader from '@/components/research/ArticleHeader';
import { type Author, getArticleBySlug, getArticlesSlugs } from '@/lib/articles';
import { calculateReadingTime } from '@/lib/date-utils';

import '@/styles/global.css';
import '@/styles/articles/articles.css';
import '@/styles/markdown.css';

export async function generateStaticParams() {
  const slugs = getArticlesSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const { frontmatter } = await getArticleBySlug(resolvedParams.slug);

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
      canonical: `/articles/${resolvedParams.slug}`,
    },
    openGraph: {
      title: frontmatter.title,
      description: frontmatter.description,
      type: 'article',
      url: `https://sashvat.com/articles/${resolvedParams.slug}`,
      publishedTime: frontmatter.date,
      authors: authorNames,
      images: [
        {
          url: '/logo/og-image.png',
          width: 1200,
          height: 630,
          alt: frontmatter.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: frontmatter.title,
      description: frontmatter.description,
      images: ['/logo/og-image.png'],
    },
  };
}

const page = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const resolvedParams = await params;

  const { contentHtml, frontmatter } = await getArticleBySlug(resolvedParams.slug);

  const authorsList: Author[] =
    Array.isArray(frontmatter.authors) && frontmatter.authors.length > 0
      ? frontmatter.authors
      : frontmatter.author
        ? [{ name: frontmatter.author, affiliation: frontmatter.author_affiliation }]
        : [{ name: 'Sashvat Bharat Team' }];

  // Strip top h1 if duplicate
  const cleanContent = contentHtml.replace(/<h1[^>]*>.*?<\/h1>/i, '');
  const { minutes } = calculateReadingTime(cleanContent);

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: frontmatter.title,
    description: frontmatter.description,
    datePublished: frontmatter.date,
    dateModified: frontmatter.date,
    author: authorsList.map((a) => ({
      '@type': 'Person',
      name: a.name,
    })),
    publisher: {
      '@type': 'Organization',
      name: 'Sashvat Bharat',
      url: 'https://sashvat.com',
      logo: {
        '@type': 'ImageObject',
        url: 'https://sashvat.com/logo/favicon-1.svg',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://sashvat.com/articles/${resolvedParams.slug}`,
    },
    image: 'https://sashvat.com/logo/og-image.png',
  };

  return (
    <div className='home-container'>
      <script
        type='application/ld+json'
        // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD schema is JSON.stringify of static metadata
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <main className='article_container'>
        <article className='article_wrapper'>
          <ArticleHeader
            title={frontmatter.title || 'Article'}
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
