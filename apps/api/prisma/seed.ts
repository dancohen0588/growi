import { PrismaClient, ArticleStatus } from '@prisma/client';

const prisma = new PrismaClient();

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/[^a-z0-9 -]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/-+/g, '-') // Replace multiple - with single -
    .trim();
}

function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const wordCount = content.split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
}

function generateExcerpt(content: string, maxLength: number = 200): string {
  const plainText = content
    .replace(/#{1,6}\s+/g, '') // Remove markdown headers
    .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold markdown
    .replace(/\*(.*?)\*/g, '$1') // Remove italic markdown
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Remove links, keep text
    .replace(/`([^`]+)`/g, '$1') // Remove inline code
    .trim();
  
  if (plainText.length <= maxLength) return plainText;
  
  const excerpt = plainText.substring(0, maxLength);
  const lastSpaceIndex = excerpt.lastIndexOf(' ');
  return excerpt.substring(0, lastSpaceIndex) + '...';
}

async function main() {
  console.log('🌱 Starting Growi Blog database seeding...');

  // Clear existing data
  await prisma.articleView.deleteMany();
  await prisma.media.deleteMany();
  await prisma.article.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.subcategory.deleteMany();
  await prisma.category.deleteMany();
  await prisma.author.deleteMany();

  console.log('🧹 Cleared existing data');

  // Create author
  const author = await prisma.author.create({
    data: {
      slug: 'julie-botanique',
      displayName: 'Julie Botanique',
      email: 'julie@growi.io',
      bio: 'Experte en jardinage urbain et biologique, Julie partage ses conseils pratiques pour cultiver la nature au quotidien. Diplômée en horticulture, elle accompagne jardiniers débutants et confirmés.',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b1e4?w=150&h=150&fit=crop&crop=face',
      website: 'https://julie-botanique.fr',
      instagram: '@julie_botanique',
    },
  });

  console.log('👤 Created author: Julie Botanique');

  // Create categories
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        slug: 'conseils-jardinage',
        name: 'Conseils jardinage',
        description: 'Techniques, astuces et guides pour réussir son jardin',
        color: '#B4DD7F', // Vert lime Growi
        icon: '🌿',
        seoTitle: 'Conseils jardinage - Guides pratiques | Growi',
        seoDescription: 'Découvrez nos conseils d\'experts pour réussir votre jardin : techniques de jardinage, astuces pratiques et guides détaillés.',
        sortOrder: 1,
      },
    }),
    prisma.category.create({
      data: {
        slug: 'plantes-interieur',
        name: 'Plantes d\'intérieur',
        description: 'Tout savoir sur les plantes vertes et fleuries d\'intérieur',
        color: '#1E5631', // Vert sapin Growi
        icon: '🪴',
        seoTitle: 'Plantes d\'intérieur - Soins et entretien | Growi',
        seoDescription: 'Guides complets pour choisir, entretenir et faire prospérer vos plantes d\'intérieur. Conseils d\'experts.',
        sortOrder: 2,
      },
    }),
    prisma.category.create({
      data: {
        slug: 'potager-et-fruits',
        name: 'Potager & fruits',
        description: 'Cultiver ses légumes et fruits au jardin ou sur le balcon',
        color: '#F6C445', // Jaune soleil Growi
        icon: '🥕',
        seoTitle: 'Potager et fruits - Culture maison | Growi',
        seoDescription: 'Apprenez à cultiver vos légumes et fruits : semis, plantation, récolte et conseils pour un potager productif.',
        sortOrder: 3,
      },
    }),
    prisma.category.create({
      data: {
        slug: 'ecologie-biodiversite',
        name: 'Écologie & biodiversité',
        description: 'Jardiner en respectant l\'environnement et la biodiversité',
        color: '#F9F7E8', // Beige sable Growi
        icon: '🦋',
        seoTitle: 'Jardinage écologique - Biodiversité au jardin | Growi',
        seoDescription: 'Découvrez les pratiques de jardinage écologique pour préserver la biodiversité et jardiner sans produits chimiques.',
        sortOrder: 4,
      },
    }),
  ]);

  console.log('🏷️ Created categories');

  // Create subcategories
  const subcategories = await Promise.all([
    prisma.subcategory.create({
      data: {
        slug: 'arrosage',
        name: 'Arrosage',
        description: 'Techniques et conseils d\'arrosage',
        categoryId: categories[0].id, // Conseils jardinage
        sortOrder: 1,
      },
    }),
    prisma.subcategory.create({
      data: {
        slug: 'taille-et-soins',
        name: 'Taille & soins',
        description: 'Entretien et taille des plantes',
        categoryId: categories[1].id, // Plantes d'intérieur
        sortOrder: 1,
      },
    }),
    prisma.subcategory.create({
      data: {
        slug: 'semis',
        name: 'Semis',
        description: 'Techniques de semis et germination',
        categoryId: categories[2].id, // Potager & fruits
        sortOrder: 1,
      },
    }),
  ]);

  console.log('🏷️ Created subcategories');

  // Create tags
  const tags = await Promise.all([
    prisma.tag.create({
      data: {
        slug: 'printemps',
        name: 'printemps',
        color: '#B4DD7F',
      },
    }),
    prisma.tag.create({
      data: {
        slug: 'arrosage',
        name: 'arrosage',
        color: '#1E5631',
      },
    }),
    prisma.tag.create({
      data: {
        slug: 'taille',
        name: 'taille',
        color: '#F6C445',
      },
    }),
    prisma.tag.create({
      data: {
        slug: 'semis',
        name: 'semis',
        color: '#F9F7E8',
      },
    }),
    prisma.tag.create({
      data: {
        slug: 'zero-phyto',
        name: 'zéro phyto',
        color: '#B4DD7F',
      },
    }),
    prisma.tag.create({
      data: {
        slug: 'balcon',
        name: 'balcon',
        color: '#1E5631',
      },
    }),
  ]);

  console.log('🏷️ Created tags');

  // Article contents
  const articleContents = [
    {
      title: 'Arroser juste: éviter les 3 erreurs les plus courantes',
      subtitle: 'Un guide simple pour garder vos plantes en forme',
      categoryId: categories[0].id, // Conseils jardinage
      subcategoryId: subcategories[0].id, // Arrosage
      tags: [tags[1], tags[5]], // arrosage, balcon
      heroImageUrl: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=1200&h=630&fit=crop',
      heroImageAlt: 'Arrosage de plantes avec un arrosoir',
      contentMarkdown: `
L'arrosage est l'un des gestes les plus importants au jardin, mais aussi l'un des plus délicats à maîtriser. Entre trop et pas assez, la marge d'erreur est parfois mince !

## Comprendre les besoins de vos plantes

Chaque plante a des besoins hydriques différents selon :
- Son origine géographique (méditerranéenne, tropicale, etc.)
- La saison et le stade de croissance
- Le type de sol et l'exposition

**Conseil pratique** : Observez vos plantes ! Les feuilles qui pendent ou jaunissent sont souvent le premier signe d'un problème d'arrosage.

## Quand arroser : le bon timing

L'erreur n°1 est d'arroser selon un calendrier fixe. Privilégiez l'observation :
- **Le test du doigt** : enfoncez votre doigt de 2-3 cm dans la terre
- **Le poids du pot** : un pot léger indique un besoin d'eau
- **L'aspect du feuillage** : légèrement flétri mais pas jauni

**Meilleur moment** : tôt le matin ou en fin de journée, jamais en plein soleil.

## Tester l'humidité du sol

L'erreur n°2 : se fier uniquement à l'aspect de la surface. La terre peut être sèche en surface mais humide en profondeur.

**Techniques fiables** :
- Sonde d'humidité (environ 10€)
- Bâtonnet en bois planté 5 minutes
- Observation des coupelles : eau stagnante = trop d'eau

> **À retenir**
> - Arrosez moins souvent mais plus abondamment
> - Testez toujours l'humidité avant d'arroser
> - Adaptez la fréquence selon la saison et la météo

Un bon arrosage, c'est la clé d'un jardin qui prospère !
      `,
      keyTakeaways: [
        'Arrosez moins souvent mais plus abondamment',
        'Testez toujours l\'humidité avant d\'arroser',
        'Adaptez la fréquence selon la saison et la météo'
      ],
    },
    {
      title: 'Monstera: tailler sans stresser la plante',
      subtitle: 'Gestes sûrs, cicatrisation et nouvelles pousses',
      categoryId: categories[1].id, // Plantes d'intérieur
      subcategoryId: subcategories[1].id, // Taille & soins
      tags: [tags[2]], // taille
      heroImageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=630&fit=crop',
      heroImageAlt: 'Feuilles de Monstera deliciosa',
      contentMarkdown: `
Le Monstera deliciosa est devenu la star des intérieurs, mais sa taille peut intimider. Pas de panique ! Avec les bons gestes, c'est un jeu d'enfant.

## Pourquoi tailler votre Monstera ?

La taille n'est pas obligatoire, mais elle permet de :
- Contrôler la taille et la forme
- Stimuler la croissance de nouvelles pousses
- Éliminer les feuilles abîmées ou malades
- Récolter des boutures pour multiplier la plante

## Le matériel indispensable

**Outils nécessaires** :
- Sécateur propre et bien aiguisé
- Alcool à 70° pour désinfecter
- Gants (la sève peut être irritante)

**Désinfection** : Nettoyez les lames avant et après chaque coupe pour éviter la propagation de maladies.

## Technique de coupe : où et comment ?

**Règle d'or** : Coupez toujours juste au-dessus d'un nœud (petit renflement sur la tige).

**Types de tailles** :
- **Taille d'entretien** : éliminer feuilles jaunies
- **Taille de forme** : raccourcir les tiges trop longues
- **Bouturage** : prélever des segments avec nœuds aériens

La cicatrisation se fait naturellement en quelques jours. Évitez d'appliquer des produits sur la coupe.

## Après la taille : soins et récupération

- Placez la plante à la lumière indirecte
- Réduisez légèrement l'arrosage pendant 1-2 semaines
- Observez l'apparition de nouvelles pousses (2-4 semaines)

> **À retenir**
> - Taillez de préférence au printemps
> - Désinfectez toujours vos outils
> - Les boutures reprennent facilement dans l'eau

Votre Monstera vous remerciera par une croissance plus dense et vigoureuse !
      `,
      keyTakeaways: [
        'Taillez de préférence au printemps',
        'Désinfectez toujours vos outils',
        'Les boutures reprennent facilement dans l\'eau'
      ],
    },
    {
      title: 'Semer les tomates en 6 étapes faciles',
      subtitle: 'Calendrier, substrat, lumière et repiquage',
      categoryId: categories[2].id, // Potager & fruits
      subcategoryId: subcategories[2].id, // Semis
      tags: [tags[3], tags[0]], // semis, printemps
      heroImageUrl: 'https://images.unsplash.com/photo-1592841200221-a4e45b8a4952?w=1200&h=630&fit=crop',
      heroImageAlt: 'Jeunes plants de tomates en godet',
      contentMarkdown: `
Semer ses tomates, c'est le début de l'aventure potagère ! Suivez ces 6 étapes pour réussir vos semis à coup sûr.

## Étape 1: Choisir le bon moment

**Calendrier de semis** :
- **Sous abri chauffé** : fin février - début mars
- **Serre froide** : mi-mars - début avril
- **Semis direct** : après les dernières gelées (mi-mai)

La température idéale de germination est de 20-25°C.

## Étape 2: Préparer le substrat

**Mélange idéal** :
- 1/3 terreau de semis
- 1/3 compost bien mûr
- 1/3 vermiculite ou perlite

Le substrat doit être fin, drainant et riche en nutriments. Évitez la terre de jardin, trop lourde.

## Étape 3: Technique de semis

**Méthode simple** :
1. Remplissez des godets de 7-8 cm
2. Tassez légèrement et arrosez
3. Placez 2-3 graines par godet
4. Recouvrez de 5mm de substrat
5. Vaporisez délicatement

**Profondeur** : 2-3 fois la taille de la graine (environ 5mm pour les tomates).

## Étape 4: Conditions de germination

- **Température** : 20-25°C constant
- **Humidité** : Sol humide mais pas détrempé
- **Lumière** : Pas nécessaire avant la levée
- **Durée** : 5-10 jours selon la variété

Couvrez avec un film plastique ou une mini-serre pour maintenir l'humidité.

## Étape 5: Soins des jeunes plants

Dès l'apparition des premières feuilles :
- Retirez le film plastique
- Placez sous une source lumineuse (15h/jour)
- Arrosez par capillarité
- Éclaircissez : gardez le plus vigoureux par godet

**Attention** : Les plants qui filent (tiges longues et fines) manquent de lumière !

## Étape 6: Repiquage et transplantation

**Premier repiquage** : quand les cotylédons sont bien développés
**Repiquage en pot individuel** : au stade 3-4 vraies feuilles
**Plantation définitive** : après les saints de glace (mi-mai)

Durcissez vos plants 1 semaine avant la plantation en les sortant progressivement.

> **À retenir**
> - Température constante de 20-25°C pour germer
> - Beaucoup de lumière dès la levée
> - Repiquage progressif pour des plants robustes

Avec ces étapes, vous obtiendrez des plants vigoureux prêts à produire tout l'été !
      `,
      keyTakeaways: [
        'Température constante de 20-25°C pour germer',
        'Beaucoup de lumière dès la levée',
        'Repiquage progressif pour des plants robustes'
      ],
    },
    {
      title: 'Zéro phyto au jardin: par où commencer ?',
      subtitle: 'Des pratiques simples pour un jardin vivant',
      categoryId: categories[3].id, // Écologie & biodiversité
      subcategoryId: null,
      tags: [tags[4]], // zéro phyto
      heroImageUrl: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=1200&h=630&fit=crop',
      heroImageAlt: 'Jardin naturel sans produits chimiques',
      contentMarkdown: `
Dire adieu aux produits chimiques au jardin, c'est possible ! Découvrez des alternatives naturelles qui préservent votre santé et celle de votre environnement.

## Comprendre l'approche "zéro phyto"

Le jardinage sans produits phytosanitaires repose sur trois principes :
- **Prévention** : créer un équilibre naturel
- **Observation** : surveiller pour agir au bon moment  
- **Patience** : accepter que la nature prenne son temps

Cette approche demande un changement de regard : accepter quelques "imperfections" pour un jardin vivant !

## Alternatives naturelles aux pesticides

**Contre les pucerons** :
- Savon noir dilué (30ml/L d'eau)
- Coccinelles et chrysopes (auxiliaires)
- Plantation de capucines (plantes pièges)

**Contre les limaces** :
- Cendres de bois autour des plants
- Pièges à bière
- Plantes répulsives : thym, sauge

**Maladies cryptogamiques** :
- Bicarbonate de soude (5g/L)
- Décoction de prêle
- Rotation des cultures

## Favoriser la biodiversité

Un jardin riche en biodiversité s'autorégule naturellement :

**Créer des habitats** :
- Tas de bois pour les hérissons
- Hôtels à insectes
- Points d'eau pour les oiseaux
- Haies champêtres

**Plantes mellifères** : lavande, bourrache, phacélie attirent les pollinisateurs qui régulent aussi les nuisibles.

## Nourrir le sol naturellement

**Compostage** : transformez vos déchets verts en or noir
**Mulching** : paillez pour nourrir et protéger
**Engrais verts** : trèfle, moutarde enrichissent le sol

Un sol vivant produit des plantes plus résistantes !

## Planning de conversion

**Année 1** : Arrêt des traitements, compostage, observation
**Année 2** : Installation d'auxiliaires, diversification  
**Année 3** : Équilibre établi, jardin autonome

Soyez patient : les résultats se voient après 2-3 saisons.

> **À retenir**
> - Favoriser les équilibres naturels plutôt que combattre
> - Diversifier les plantations pour attirer les auxiliaires  
> - Soigner le sol pour des plantes résistantes

Un jardin zéro phyto, c'est un écosystème qui vit en harmonie !
      `,
      keyTakeaways: [
        'Favoriser les équilibres naturels plutôt que combattre',
        'Diversifier les plantations pour attirer les auxiliaires',
        'Soigner le sol pour des plantes résistantes'
      ],
    },
  ];

  // Create articles
  const articles = [];
  for (let i = 0; i < articleContents.length; i++) {
    const content = articleContents[i];
    const slug = slugify(content.title);
    const excerpt = generateExcerpt(content.contentMarkdown);
    const readingTime = calculateReadingTime(content.contentMarkdown);
    
    const article = await prisma.article.create({
      data: {
        slug,
        title: content.title,
        subtitle: content.subtitle,
        excerpt,
        contentMarkdown: content.contentMarkdown.trim(),
        contentHtml: '', // Will be generated by the API
        heroImageUrl: content.heroImageUrl,
        heroImageAlt: content.heroImageAlt,
        metaTitle: `${content.title} | Blog Growi`,
        metaDescription: excerpt,
        readingTimeMin: readingTime,
        keyTakeaways: content.keyTakeaways,
        status: ArticleStatus.PUBLISHED,
        publishedAt: new Date(),
        viewCount: Math.floor(Math.random() * 500) + 50, // Random view count
        authorId: author.id,
        categoryId: content.categoryId,
        subcategoryId: content.subcategoryId,
        tags: {
          connect: content.tags.map(tag => ({ id: tag.id })),
        },
      },
    });
    
    articles.push(article);
  }

  console.log('📝 Created articles');
  console.log('\n✅ Database seeding completed successfully!');
  console.log('\n📊 Summary:');
  console.log(`- Author: 1 (Julie Botanique)`);
  console.log(`- Categories: ${categories.length}`);
  console.log(`- Subcategories: ${subcategories.length}`);
  console.log(`- Tags: ${tags.length}`);
  console.log(`- Articles: ${articles.length} (all PUBLISHED)`);

  console.log('\n🌐 Articles created:');
  articles.forEach((article, index) => {
    console.log(`  ${index + 1}. "${article.title}" (/${article.slug})`);
  });
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });