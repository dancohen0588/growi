import {
  Controller,
  Get,
  Query,
  Param,
  UseGuards,
  Post,
  Body,
  Put,
  Patch,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery, ApiParam, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { BlogService, BlogQuery } from './blog.service';
import { AdminGuard } from '../auth/guards/admin.guard';

@ApiTags('Blog')
@Controller('blog')
export class BlogController {
  constructor(private readonly blogService: BlogService) {}

  // ==========================================
  // ENDPOINTS PUBLICS
  // ==========================================

  @Get('articles')
  @ApiOperation({ summary: 'Lister les articles' })
  @ApiQuery({ name: 'q', required: false, description: 'Recherche textuelle' })
  @ApiQuery({ name: 'category', required: false, description: 'Slug de catégorie' })
  @ApiQuery({ name: 'subcategory', required: false, description: 'Slug de sous-catégorie' })
  @ApiQuery({ name: 'tags', required: false, description: 'Tags (array)', type: [String] })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Numéro de page' })
  @ApiQuery({ name: 'pageSize', required: false, type: Number, description: 'Nombre d\'articles par page' })
  @ApiQuery({ name: 'sort', required: false, enum: ['publishedAt', 'viewCount', 'title'] })
  @ApiQuery({ name: 'order', required: false, enum: ['asc', 'desc'] })
  @ApiResponse({ status: 200, description: 'Liste des articles avec pagination' })
  async getArticles(@Query() query: BlogQuery) {
    // Convertir les tags en array si nécessaire
    if (query.tags && typeof query.tags === 'string') {
      query.tags = [query.tags];
    }

    // Convertir les paramètres numériques
    const processedQuery: BlogQuery = {
      ...query,
      page: query.page ? +query.page : 1,
      pageSize: query.pageSize ? +query.pageSize : 10,
    };

    return this.blogService.getArticles(processedQuery);
  }

  @Get('articles/:slug')
  @ApiOperation({ summary: 'Récupérer un article par slug' })
  @ApiParam({ name: 'slug', description: 'Slug de l\'article' })
  @ApiResponse({ status: 200, description: 'Article trouvé' })
  @ApiResponse({ status: 404, description: 'Article non trouvé' })
  async getArticleBySlug(@Param('slug') slug: string) {
    const article = await this.blogService.getArticleBySlug(slug);
    
    // Récupérer les articles liés
    const relatedArticles = await this.blogService.getRelatedArticles(
      article.id,
      article.categoryId,
      3
    );

    return {
      ...article,
      relatedArticles,
    };
  }

  @Get('categories')
  @ApiOperation({ summary: 'Lister les catégories' })
  @ApiResponse({ status: 200, description: 'Liste des catégories avec compteurs' })
  async getCategories() {
    return this.blogService.getCategories();
  }

  @Get('categories/:slug')
  @ApiOperation({ summary: 'Récupérer une catégorie par slug' })
  @ApiParam({ name: 'slug', description: 'Slug de la catégorie' })
  @ApiResponse({ status: 200, description: 'Catégorie trouvée' })
  @ApiResponse({ status: 404, description: 'Catégorie non trouvée' })
  async getCategoryBySlug(@Param('slug') slug: string) {
    return this.blogService.getCategoryBySlug(slug);
  }

  @Get('tags')
  @ApiOperation({ summary: 'Lister les tags' })
  @ApiResponse({ status: 200, description: 'Liste des tags avec compteurs' })
  async getTags() {
    return this.blogService.getTags();
  }

  @Get('authors/:slug')
  @ApiOperation({ summary: 'Récupérer un auteur par slug' })
  @ApiParam({ name: 'slug', description: 'Slug de l\'auteur' })
  @ApiResponse({ status: 200, description: 'Auteur trouvé' })
  @ApiResponse({ status: 404, description: 'Auteur non trouvé' })
  async getAuthorBySlug(@Param('slug') slug: string) {
    return this.blogService.getAuthorBySlug(slug);
  }

  @Get('authors/:slug/articles')
  @ApiOperation({ summary: 'Articles d\'un auteur' })
  @ApiParam({ name: 'slug', description: 'Slug de l\'auteur' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'pageSize', required: false, type: Number })
  async getArticlesByAuthor(
    @Param('slug') slug: string,
    @Query('page') page = 1,
    @Query('pageSize') pageSize = 10,
  ) {
    return this.blogService.getArticlesByAuthor(slug, +page, +pageSize);
  }

  @Get('featured')
  @ApiOperation({ summary: 'Articles en vedette' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async getFeaturedArticles(@Query('limit') limit = 3) {
    return this.blogService.getFeaturedArticles(+limit);
  }

  @Get('popular')
  @ApiOperation({ summary: 'Articles populaires' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async getPopularArticles(@Query('limit') limit = 5) {
    return this.blogService.getPopularArticles(+limit);
  }

  // ==========================================
  // ENDPOINTS ADMIN (Protégés)
  // ==========================================

  @Post('articles')
  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Créer un article (Admin)' })
  @ApiResponse({ status: 201, description: 'Article créé' })
  @ApiResponse({ status: 401, description: 'Non autorisé' })
  async createArticle(@Body() createArticleDto: any) {
    // TODO: Implémenter création d'article
    return { message: 'Création d\'article - À implémenter' };
  }

  @Put('articles/:id')
  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Mettre à jour un article (Admin)' })
  @ApiParam({ name: 'id', description: 'ID de l\'article' })
  @ApiResponse({ status: 200, description: 'Article mis à jour' })
  @ApiResponse({ status: 401, description: 'Non autorisé' })
  @ApiResponse({ status: 404, description: 'Article non trouvé' })
  async updateArticle(@Param('id') id: string, @Body() updateArticleDto: any) {
    // TODO: Implémenter mise à jour d'article
    return { message: `Mise à jour de l'article ${id} - À implémenter` };
  }

  @Patch('articles/:id/publish')
  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Publier/Dépublier un article (Admin)' })
  @ApiParam({ name: 'id', description: 'ID de l\'article' })
  @ApiResponse({ status: 200, description: 'Statut mis à jour' })
  async toggleArticleStatus(@Param('id') id: string) {
    // TODO: Implémenter toggle statut
    return { message: `Toggle statut de l'article ${id} - À implémenter` };
  }

  @Delete('articles/:id')
  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Supprimer un article (Admin)' })
  @ApiParam({ name: 'id', description: 'ID de l\'article' })
  @ApiResponse({ status: 204, description: 'Article supprimé' })
  @ApiResponse({ status: 401, description: 'Non autorisé' })
  @ApiResponse({ status: 404, description: 'Article non trouvé' })
  async deleteArticle(@Param('id') id: string) {
    // TODO: Implémenter suppression d'article
    return;
  }

  // CRUD Categories (Admin)
  @Post('categories')
  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Créer une catégorie (Admin)' })
  async createCategory(@Body() createCategoryDto: any) {
    return { message: 'Création de catégorie - À implémenter' };
  }

  @Put('categories/:id')
  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Mettre à jour une catégorie (Admin)' })
  @ApiParam({ name: 'id', description: 'ID de la catégorie' })
  async updateCategory(@Param('id') id: string, @Body() updateCategoryDto: any) {
    return { message: `Mise à jour de la catégorie ${id} - À implémenter` };
  }

  @Delete('categories/:id')
  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Supprimer une catégorie (Admin)' })
  @ApiParam({ name: 'id', description: 'ID de la catégorie' })
  async deleteCategory(@Param('id') id: string) {
    return;
  }

  // CRUD Tags (Admin)
  @Post('tags')
  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Créer un tag (Admin)' })
  async createTag(@Body() createTagDto: any) {
    return { message: 'Création de tag - À implémenter' };
  }

  @Put('tags/:id')
  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Mettre à jour un tag (Admin)' })
  @ApiParam({ name: 'id', description: 'ID du tag' })
  async updateTag(@Param('id') id: string, @Body() updateTagDto: any) {
    return { message: `Mise à jour du tag ${id} - À implémenter` };
  }

  @Delete('tags/:id')
  @UseGuards(AdminGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Supprimer un tag (Admin)' })
  @ApiParam({ name: 'id', description: 'ID du tag' })
  async deleteTag(@Param('id') id: string) {
    return;
  }
}