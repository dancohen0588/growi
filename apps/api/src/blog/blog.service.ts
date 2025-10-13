import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { Article, ArticleStatus, Category, Tag, Author } from '@prisma/client';
import { remark } from 'remark';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeSlug from 'rehype-slug';
import rehypeStringify from 'rehype-stringify';

export interface ArticleWithRelations extends Article {
  author: Author;
  category: Category;
  subcategory?: { id: string; name: string; slug: string } | null;
  tags: Tag[];
}

export interface BlogQuery {
  q?: string;
  category?: string;
  subcategory?: string;
  tags?: string[];
  page?: number;
  pageSize?: number;
  sort?: 'publishedAt' | 'viewCount' | 'title';
  order?: 'asc' | 'desc';
}

export interface BlogResponse<T> {
  data: T;
  meta?: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

@Injectable()
export class BlogService {
  constructor(private prisma: PrismaService) {}

  // Convertir Markdown en HTML
  async markdownToHtml(markdown: string): Promise<string> {
    const result = await remark()
      .use(remarkGfm)
      .use(remarkRehype)
      .use(rehypeSlug)
      .use(rehypeStringify)
      .process(markdown);
    
    return String(result);
  }

  // Extraire la table des matières (TOC) des headers H2
  extractTableOfContents(markdown: string): { id: string; title: string; level: number }[] {
    const headingRegex = /^(#{2})\s+(.+)$/gm;
    const toc: { id: string; title: string; level: number }[] = [];
    let match;

    while ((match = headingRegex.exec(markdown)) !== null) {
      const level = match[1].length;
      const title = match[2].trim();
      const id = title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
      
      if (level === 2) {
        toc.push({ id, title, level });
      }
    }

    return toc;
  }

  // Calculer le temps de lecture
  calculateReadingTime(content: string): number {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
  }

  // Lister les articles avec filtres et pagination
  async getArticles(query: BlogQuery): Promise<BlogResponse<ArticleWithRelations[]>> {
    const {
      q,
      category,
      subcategory,
      tags = [],
      page = 1,
      pageSize = 10,
      sort = 'publishedAt',
      order = 'desc',
    } = query;

    const skip = (page - 1) * pageSize;

    // Construction des filtres
    const where: any = {
      status: ArticleStatus.PUBLISHED,
    };

    if (q) {
      where.OR = [
        { title: { contains: q, mode: 'insensitive' } },
        { subtitle: { contains: q, mode: 'insensitive' } },
        { excerpt: { contains: q, mode: 'insensitive' } },
        { contentMarkdown: { contains: q, mode: 'insensitive' } },
      ];
    }

    if (category) {
      where.category = { slug: category };
    }

    if (subcategory) {
      where.subcategory = { slug: subcategory };
    }

    if (tags.length > 0) {
      where.tags = {
        some: {
          slug: { in: tags },
        },
      };
    }

    // Récupération des articles
    const [articles, total] = await Promise.all([
      this.prisma.article.findMany({
        where,
        include: {
          author: true,
          category: true,
          subcategory: {
            select: { id: true, name: true, slug: true },
          },
          tags: true,
        },
        orderBy: { [sort]: order },
        skip,
        take: pageSize,
      }),
      this.prisma.article.count({ where }),
    ]);

    return {
      data: articles,
      meta: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  }

  // Récupérer un article par son slug
  async getArticleBySlug(slug: string): Promise<ArticleWithRelations> {
    const article = await this.prisma.article.findUnique({
      where: { slug, status: ArticleStatus.PUBLISHED },
      include: {
        author: true,
        category: true,
        subcategory: {
          select: { id: true, name: true, slug: true },
        },
        tags: true,
      },
    });

    if (!article) {
      throw new NotFoundException(`Article avec le slug "${slug}" non trouvé`);
    }

    // Incrémenter le compteur de vues
    await this.prisma.article.update({
      where: { id: article.id },
      data: { viewCount: { increment: 1 } },
    });

    // Générer le HTML et la TOC si pas encore fait
    if (!article.contentHtml) {
      const contentHtml = await this.markdownToHtml(article.contentMarkdown);
      const tableOfContents = this.extractTableOfContents(article.contentMarkdown);
      
      await this.prisma.article.update({
        where: { id: article.id },
        data: {
          contentHtml,
          tableOfContents,
        },
      });

      article.contentHtml = contentHtml;
      article.tableOfContents = tableOfContents;
    }

    return article;
  }

  // Articles liés (même catégorie)
  async getRelatedArticles(articleId: string, categoryId: string, limit = 3): Promise<ArticleWithRelations[]> {
    return this.prisma.article.findMany({
      where: {
        NOT: { id: articleId },
        categoryId,
        status: ArticleStatus.PUBLISHED,
      },
      include: {
        author: true,
        category: true,
        subcategory: {
          select: { id: true, name: true, slug: true },
        },
        tags: true,
      },
      orderBy: { publishedAt: 'desc' },
      take: limit,
    });
  }

  // Lister les catégories avec compteurs d'articles
  async getCategories(): Promise<any[]> {
    const categories = await this.prisma.category.findMany({
      where: { isActive: true },
      include: {
        subcategories: {
          where: { isActive: true },
          orderBy: { sortOrder: 'asc' },
        },
        _count: {
          select: {
            articles: {
              where: { status: ArticleStatus.PUBLISHED },
            },
          },
        },
      },
      orderBy: { sortOrder: 'asc' },
    });

    return categories.map(category => ({
      ...category,
      articleCount: category._count.articles,
    }));
  }

  // Récupérer une catégorie par slug
  async getCategoryBySlug(slug: string) {
    const category = await this.prisma.category.findUnique({
      where: { slug, isActive: true },
      include: {
        subcategories: {
          where: { isActive: true },
          orderBy: { sortOrder: 'asc' },
        },
        _count: {
          select: {
            articles: {
              where: { status: ArticleStatus.PUBLISHED },
            },
          },
        },
      },
    });

    if (!category) {
      throw new NotFoundException(`Catégorie "${slug}" non trouvée`);
    }

    return {
      ...category,
      articleCount: category._count.articles,
    };
  }

  // Lister tous les tags avec compteurs
  async getTags(): Promise<any[]> {
    const tags = await this.prisma.tag.findMany({
      where: { isActive: true },
      include: {
        _count: {
          select: {
            articles: {
              where: { status: ArticleStatus.PUBLISHED },
            },
          },
        },
      },
      orderBy: { name: 'asc' },
    });

    return tags.map(tag => ({
      ...tag,
      articleCount: tag._count.articles,
    }));
  }

  // Récupérer un auteur par slug
  async getAuthorBySlug(slug: string) {
    const author = await this.prisma.author.findUnique({
      where: { slug, isActive: true },
      include: {
        _count: {
          select: {
            articles: {
              where: { status: ArticleStatus.PUBLISHED },
            },
          },
        },
      },
    });

    if (!author) {
      throw new NotFoundException(`Auteur "${slug}" non trouvé`);
    }

    return {
      ...author,
      articleCount: author._count.articles,
    };
  }

  // Articles par auteur
  async getArticlesByAuthor(authorSlug: string, page = 1, pageSize = 10) {
    const author = await this.getAuthorBySlug(authorSlug);
    
    const skip = (page - 1) * pageSize;

    const [articles, total] = await Promise.all([
      this.prisma.article.findMany({
        where: {
          authorId: author.id,
          status: ArticleStatus.PUBLISHED,
        },
        include: {
          author: true,
          category: true,
          subcategory: {
            select: { id: true, name: true, slug: true },
          },
          tags: true,
        },
        orderBy: { publishedAt: 'desc' },
        skip,
        take: pageSize,
      }),
      this.prisma.article.count({
        where: {
          authorId: author.id,
          status: ArticleStatus.PUBLISHED,
        },
      }),
    ]);

    return {
      data: articles,
      meta: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    };
  }

  // Articles en vedette
  async getFeaturedArticles(limit = 3): Promise<ArticleWithRelations[]> {
    return this.prisma.article.findMany({
      where: {
        status: ArticleStatus.PUBLISHED,
        featuredUntil: {
          gte: new Date(),
        },
      },
      include: {
        author: true,
        category: true,
        subcategory: {
          select: { id: true, name: true, slug: true },
        },
        tags: true,
      },
      orderBy: { publishedAt: 'desc' },
      take: limit,
    });
  }

  // Articles les plus populaires
  async getPopularArticles(limit = 5): Promise<ArticleWithRelations[]> {
    return this.prisma.article.findMany({
      where: {
        status: ArticleStatus.PUBLISHED,
      },
      include: {
        author: true,
        category: true,
        subcategory: {
          select: { id: true, name: true, slug: true },
        },
        tags: true,
      },
      orderBy: { viewCount: 'desc' },
      take: limit,
    });
  }
}