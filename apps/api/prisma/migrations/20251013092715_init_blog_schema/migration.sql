-- CreateEnum
CREATE TYPE "ArticleStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "MediaType" AS ENUM ('IMAGE', 'VIDEO', 'DOCUMENT');

-- CreateTable
CREATE TABLE "authors" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "bio" TEXT,
    "avatar" TEXT,
    "website" TEXT,
    "twitter" TEXT,
    "linkedin" TEXT,
    "instagram" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "authors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categories" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "color" TEXT,
    "icon" TEXT,
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subcategories" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "categoryId" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "subcategories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tags" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "color" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "articles" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "subtitle" TEXT,
    "excerpt" TEXT,
    "contentMarkdown" TEXT NOT NULL,
    "contentHtml" TEXT,
    "heroImageUrl" TEXT,
    "heroImageAlt" TEXT,
    "metaTitle" TEXT,
    "metaDescription" TEXT,
    "readingTimeMin" INTEGER,
    "tableOfContents" JSONB,
    "keyTakeaways" TEXT[],
    "status" "ArticleStatus" NOT NULL DEFAULT 'DRAFT',
    "publishedAt" TIMESTAMP(3),
    "featuredUntil" TIMESTAMP(3),
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "authorId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "subcategoryId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "articles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "media" (
    "id" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "originalName" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "type" "MediaType" NOT NULL,
    "url" TEXT NOT NULL,
    "thumbnailUrl" TEXT,
    "alt" TEXT,
    "caption" TEXT,
    "width" INTEGER,
    "height" INTEGER,
    "articleId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "media_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "article_views" (
    "id" TEXT NOT NULL,
    "articleId" TEXT NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "referer" TEXT,
    "viewedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "article_views_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ArticleToTag" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "authors_slug_key" ON "authors"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "authors_email_key" ON "authors"("email");

-- CreateIndex
CREATE INDEX "authors_slug_idx" ON "authors"("slug");

-- CreateIndex
CREATE INDEX "authors_email_idx" ON "authors"("email");

-- CreateIndex
CREATE INDEX "authors_isActive_idx" ON "authors"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "categories_slug_key" ON "categories"("slug");

-- CreateIndex
CREATE INDEX "categories_slug_idx" ON "categories"("slug");

-- CreateIndex
CREATE INDEX "categories_isActive_idx" ON "categories"("isActive");

-- CreateIndex
CREATE INDEX "categories_sortOrder_idx" ON "categories"("sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "subcategories_slug_key" ON "subcategories"("slug");

-- CreateIndex
CREATE INDEX "subcategories_slug_idx" ON "subcategories"("slug");

-- CreateIndex
CREATE INDEX "subcategories_categoryId_idx" ON "subcategories"("categoryId");

-- CreateIndex
CREATE INDEX "subcategories_isActive_idx" ON "subcategories"("isActive");

-- CreateIndex
CREATE INDEX "subcategories_sortOrder_idx" ON "subcategories"("sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "tags_slug_key" ON "tags"("slug");

-- CreateIndex
CREATE INDEX "tags_slug_idx" ON "tags"("slug");

-- CreateIndex
CREATE INDEX "tags_isActive_idx" ON "tags"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "articles_slug_key" ON "articles"("slug");

-- CreateIndex
CREATE INDEX "articles_slug_idx" ON "articles"("slug");

-- CreateIndex
CREATE INDEX "articles_status_idx" ON "articles"("status");

-- CreateIndex
CREATE INDEX "articles_publishedAt_idx" ON "articles"("publishedAt");

-- CreateIndex
CREATE INDEX "articles_authorId_idx" ON "articles"("authorId");

-- CreateIndex
CREATE INDEX "articles_categoryId_idx" ON "articles"("categoryId");

-- CreateIndex
CREATE INDEX "articles_subcategoryId_idx" ON "articles"("subcategoryId");

-- CreateIndex
CREATE INDEX "articles_featuredUntil_idx" ON "articles"("featuredUntil");

-- CreateIndex
CREATE INDEX "articles_viewCount_idx" ON "articles"("viewCount");

-- CreateIndex
CREATE INDEX "media_type_idx" ON "media"("type");

-- CreateIndex
CREATE INDEX "media_articleId_idx" ON "media"("articleId");

-- CreateIndex
CREATE INDEX "media_mimeType_idx" ON "media"("mimeType");

-- CreateIndex
CREATE INDEX "article_views_articleId_idx" ON "article_views"("articleId");

-- CreateIndex
CREATE INDEX "article_views_viewedAt_idx" ON "article_views"("viewedAt");

-- CreateIndex
CREATE UNIQUE INDEX "_ArticleToTag_AB_unique" ON "_ArticleToTag"("A", "B");

-- CreateIndex
CREATE INDEX "_ArticleToTag_B_index" ON "_ArticleToTag"("B");

-- AddForeignKey
ALTER TABLE "subcategories" ADD CONSTRAINT "subcategories_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "articles" ADD CONSTRAINT "articles_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "authors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "articles" ADD CONSTRAINT "articles_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "articles" ADD CONSTRAINT "articles_subcategoryId_fkey" FOREIGN KEY ("subcategoryId") REFERENCES "subcategories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "media" ADD CONSTRAINT "media_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "articles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "article_views" ADD CONSTRAINT "article_views_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "articles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ArticleToTag" ADD CONSTRAINT "_ArticleToTag_A_fkey" FOREIGN KEY ("A") REFERENCES "articles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ArticleToTag" ADD CONSTRAINT "_ArticleToTag_B_fkey" FOREIGN KEY ("B") REFERENCES "tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;
