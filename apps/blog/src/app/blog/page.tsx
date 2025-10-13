import { Metadata } from 'next';
import { ArticleCard } from '@/components/blog/article-card';
import { CategoryFilter } from '@/components/blog/category-filter';
import { SearchInput } from '@/components/blog/search-input';
import { Pagination } from '@/components/blog/pagination';
import { getArticles, getCategories } from '@/lib/api';

export const metadata: Metadata = {
  title: 'Blog Growi - Conseils jardinage et guides pratiques',
  description: 'Découvrez nos articles sur le jardinage, l\'entretien des plantes, le potager urbain et l\'écologie. Conseils d\'experts pour tous les jardiniers.',
  openGraph: {
    title: 'Blog Growi - Conseils jardinage et guides pratiques',
    description: 'Découvrez nos articles sur le jardinage, l\'entretien des plantes, le potager urbain et l\'écologie.',
    type: 'website',
  },
};

interface BlogPageProps {
  searchParams: {
    q?: string;
    category?: string;
    subcategory?: string;
    tags?: string | string[];
    page?: string;
  };
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const page = parseInt(searchParams.page || '1');
  const pageSize = 12;

  // Préparer les paramètres de requête
  const queryParams = {
    q: searchParams.q,
    category: searchParams.category,
    subcategory: searchParams.subcategory,
    tags: Array.isArray(searchParams.tags) ? searchParams.tags : searchParams.tags ? [searchParams.tags] : undefined,
    page,
    pageSize,
    sort: 'publishedAt' as const,
    order: 'desc' as const,
  };

  // Récupérer les données
  const [articlesResponse, categoriesResponse] = await Promise.all([
    getArticles(queryParams),
    getCategories(),
  ]);

  const articles = articlesResponse.data || [];
  const meta = articlesResponse.meta || { page: 1, pageSize: 12, total: 0, totalPages: 0 };
  const categories = categoriesResponse || [];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-growi-forest font-poppins mb-4">
          Blog Growi
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Conseils d'experts, guides pratiques et astuces pour réussir votre jardin
        </p>
      </div>

      {/* Filtres et recherche */}
      <div className="flex flex-col lg:flex-row gap-6 mb-12">
        <div className="lg:w-1/4">
          <div className="bg-growi-sand rounded-xl p-6 sticky top-6">
            <h3 className="font-semibold text-growi-forest font-poppins mb-4">
              Filtrer les articles
            </h3>
            
            <SearchInput 
              initialValue={searchParams.q}
              placeholder="Rechercher un article..."
            />
            
            <CategoryFilter 
              categories={categories}
              activeCategory={searchParams.category}
              activeSubcategory={searchParams.subcategory}
            />
          </div>
        </div>

        {/* Liste des articles */}
        <div className="lg:w-3/4">
          {/* Breadcrumbs */}
          <div className="mb-6 text-sm text-gray-600">
            <span>Accueil</span>
            <span className="mx-2">›</span>
            <span>Blog</span>
            {searchParams.category && (
              <>
                <span className="mx-2">›</span>
                <span className="capitalize">{searchParams.category.replace('-', ' ')}</span>
              </>
            )}
          </div>

          {/* Résultats */}
          <div className="mb-6">
            <p className="text-gray-600">
              {meta.total} article{meta.total > 1 ? 's' : ''} trouvé{meta.total > 1 ? 's' : ''}
              {searchParams.q && (
                <span> pour "{searchParams.q}"</span>
              )}
            </p>
          </div>

          {/* Articles */}
          {articles.length > 0 ? (
            <>
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-1 mb-12">
                {articles.map((article) => (
                  <ArticleCard
                    key={article.id}
                    article={article}
                    variant="full"
                  />
                ))}
              </div>

              {/* Pagination */}
              {meta.totalPages > 1 && (
                <Pagination
                  currentPage={meta.page}
                  totalPages={meta.totalPages}
                  baseUrl="/blog"
                  searchParams={searchParams}
                />
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🌱</div>
              <h3 className="text-xl font-semibold text-growi-forest font-poppins mb-2">
                Aucun article trouvé
              </h3>
              <p className="text-gray-600 mb-6">
                Essayez de modifier vos filtres ou votre recherche
              </p>
              <a
                href="/blog"
                className="inline-flex items-center gap-2 bg-growi-lime hover:bg-growi-forest text-white px-6 py-3 rounded-lg transition-colors font-medium"
              >
                Voir tous les articles
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Articles populaires sidebar (optionnel) */}
      <div className="bg-growi-sand rounded-xl p-8">
        <h2 className="text-2xl font-bold text-growi-forest font-poppins mb-6 text-center">
          Articles populaires
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Les articles populaires seront chargés ici */}
        </div>
      </div>
    </div>
  );
}

// Force revalidation every hour
export const revalidate = 3600;