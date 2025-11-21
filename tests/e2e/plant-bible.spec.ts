import { test, expect } from '@playwright/test';

test.describe('Bible des plantes - Frontend', () => {
  test('Test 1: Accès à la Bible des plantes via le menu', async ({ page }) => {
    // Naviguer vers la homepage
    await page.goto('http://localhost:3001');
    
    // Vérifier que l'entrée menu existe
    await expect(page.getByRole('link', { name: 'Bible des plantes' })).toBeVisible();
    
    // Cliquer sur le menu Bible des plantes
    await page.getByRole('link', { name: 'Bible des plantes' }).click();
    
    // Vérifier l'URL et le titre
    await expect(page).toHaveURL('/bible-des-plantes');
    await expect(page.getByRole('heading', { name: 'Bible des plantes' })).toBeVisible();
    
    // Vérifier la présence des filtres
    await expect(page.getByText('🔍 Recherche & filtres')).toBeVisible();
    await expect(page.getByText('🌿 Catégorie')).toBeVisible();
    await expect(page.getByText('🇫🇷 Climat français')).toBeVisible();
    
    // Vérifier la barre de recherche
    await expect(page.getByPlaceholder('Rechercher une plante...')).toBeVisible();
    
    // Vérifier les suggestions de recherche
    await expect(page.getByRole('button', { name: 'Rosier' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Lavande' })).toBeVisible();
  });

  test('Test 2: Recherche par nom commun', async ({ page }) => {
    await page.goto('http://localhost:3001/bible-des-plantes');
    
    // Rechercher "Rosier"
    await page.getByPlaceholder('Rechercher une plante...').fill('Rosier');
    
    // Vérifier que l'URL change avec le paramètre de recherche
    await expect(page).toHaveURL(/.*\?.*q=Rosier/);
    
    // Vérifier le message de résultats
    await expect(page.getByText(/espèce.*trouvée.*pour/i)).toBeVisible();
    
    // Test avec suggestion rapide
    await page.getByRole('button', { name: 'Lavande' }).click();
    await expect(page).toHaveURL(/.*\?.*q=Lavande/);
  });

  test('Test 3: Filtrage par climat français', async ({ page }) => {
    await page.goto('http://localhost:3001/bible-des-plantes');
    
    // Sélectionner le climat méditerranéen
    await page.getByRole('radio', { name: 'Méditerranéen' }).click();
    
    // Vérifier que l'URL contient le filtre climat
    await expect(page).toHaveURL(/.*climate=MEDITERRANEAN/);
    
    // Vérifier le message contextuel
    await expect(page.getByText('📍 Adaptées au climat méditerranéen')).toBeVisible();
    
    // Tester combinaison de filtres
    await page.getByRole('radio', { name: 'Arbuste' }).click();
    await expect(page).toHaveURL(/.*category=SHRUB.*climate=MEDITERRANEAN/);
  });

  test('Test 4: Navigation vers fiche détail rosier', async ({ page }) => {
    // Naviguer directement vers la fiche rosier (données mock)
    await page.goto('http://localhost:3001/bible-des-plantes/rosier-buisson');
    
    // Vérifier le titre de la page
    await expect(page).toHaveTitle(/Rosier buisson.*Guide de culture/);
    
    // Vérifier les sections principales
    await expect(page.getByRole('heading', { name: 'Rosier buisson' })).toBeVisible();
    await expect(page.getByText('Rosa x hybrida')).toBeVisible();
    
    // Section adaptation climat
    await expect(page.getByRole('heading', { name: /Adaptée à votre jardin en France/ })).toBeVisible();
    await expect(page.getByText('✓ Océanique')).toBeVisible();
    await expect(page.getByText('✓ Continental')).toBeVisible();
    await expect(page.getByText('✓ Méditerranéen')).toBeVisible();
    
    // Section conditions de culture
    await expect(page.getByRole('heading', { name: /Conditions de culture/ })).toBeVisible();
    await expect(page.getByText('☀️ Exposition')).toBeVisible();
    await expect(page.getByText('💧 Arrosage')).toBeVisible();
    
    // Calendrier d'entretien
    await expect(page.getByRole('heading', { name: /Calendrier d'entretien/ })).toBeVisible();
    await expect(page.getByText('🌱')).toBeVisible(); // Icône plantation
    await expect(page.getByText('🌸')).toBeVisible(); // Icône floraison
    await expect(page.getByText('✂️')).toBeVisible(); // Icône taille
    
    // Santé de la plante
    await expect(page.getByRole('heading', { name: /Santé de la plante/ })).toBeVisible();
    await expect(page.getByText('🦠 Maladies fréquentes')).toBeVisible();
    await expect(page.getByText('🐛 Ravageurs')).toBeVisible();
    
    // Sidebar technique
    await expect(page.getByRole('heading', { name: '📋 Fiche technique' })).toBeVisible();
    await expect(page.getByRole('heading', { name: '📅 Calendrier' })).toBeVisible();
    
    // Actions
    await expect(page.getByRole('button', { name: /Ajouter à mes favoris/ })).toBeVisible();
    await expect(page.getByRole('button', { name: /Ajouter à mon jardin/ })).toBeVisible();
    await expect(page.getByRole('link', { name: /Retour à la Bible/ })).toBeVisible();
  });
});

test.describe('Bible des plantes - Admin', () => {
  test.beforeEach(async ({ page }) => {
    // Se connecter en tant qu'admin (nécessaire pour accéder aux pages admin)
    await page.goto('http://localhost:3001/login');
    
    // Remplir le formulaire de connexion avec les identifiants test
    await page.getByPlaceholder('votre-email@exemple.com').fill('admin@test.com');
    await page.getByPlaceholder('••••••••').fill('admin123');
    await page.getByRole('button', { name: 'Se connecter' }).click();
    
    // Attendre la redirection 
    await page.waitForURL(/\/mes-projets|\/admin|\/$/);
  });

  test('Test 5: Accès à la liste admin Bible des plantes', async ({ page }) => {
    // Naviguer vers l'admin plant-bible
    await page.goto('http://localhost:3001/admin/plant-bible');
    
    // Vérifier le titre et l'interface admin
    await expect(page.getByRole('heading', { name: 'Bible des plantes - Administration' })).toBeVisible();
    
    // Vérifier les éléments de l'interface
    await expect(page.getByRole('link', { name: /Nouvelle espèce/ })).toBeVisible();
    await expect(page.getByPlaceholder('Nom commun ou latin...')).toBeVisible();
    
    // Vérifier les statistiques
    await expect(page.getByText('Total espèces')).toBeVisible();
    await expect(page.getByText('Actives')).toBeVisible();
    
    // Vérifier le tableau
    await expect(page.getByRole('columnheader', { name: 'Espèce' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Nom latin' })).toBeVisible();
    await expect(page.getByRole('columnheader', { name: 'Catégorie' })).toBeVisible();
  });

  test('Test 6: Création d\'une nouvelle espèce', async ({ page }) => {
    // Naviguer vers le formulaire de création
    await page.goto('http://localhost:3001/admin/plant-bible/nouveau');
    
    // Vérifier le titre du formulaire
    await expect(page.getByRole('heading', { name: 'Nouvelle espèce de plante' })).toBeVisible();
    
    // Remplir le formulaire avec des données valides
    await page.getByPlaceholder('ex: Rosier buisson').fill('Test Lavande');
    await page.getByPlaceholder('ex: Bush Rose').fill('Test Lavender');
    await page.getByPlaceholder('ex: Rosa x hybrida').fill('Lavandula test');
    
    // Sélectionner au moins un climat (requis)
    await page.getByRole('checkbox', { name: 'Méditerranéen' }).check();
    
    // Remplir les conseils débutant
    await page.getByPlaceholder('Conseils clairs et concrets pour jardiniers débutants...').fill('Plante très facile, soleil et sol drainant obligatoires');
    
    // Soumettre le formulaire
    await page.getByRole('button', { name: /Créer l'espèce/ }).click();
    
    // Vérifier la confirmation ou redirection
    await expect(page.getByText('Espèce créée avec succès!')).toBeVisible();
  });

  test('Test 7: Édition d\'une espèce', async ({ page }) => {
    // Aller sur la liste admin
    await page.goto('http://localhost:3001/admin/plant-bible');
    
    // Cliquer sur "Éditer" pour la première espèce si disponible
    const editButton = page.getByRole('link', { name: /Éditer/ }).first();
    if (await editButton.isVisible()) {
      await editButton.click();
      
      // Vérifier qu'on arrive sur la page d'édition
      await expect(page.getByRole('heading', { name: /Édition/ })).toBeVisible();
    }
  });

  test('Test 8: Suppression d\'une espèce', async ({ page }) => {
    // Aller sur la liste admin
    await page.goto('http://localhost:3001/admin/plant-bible');
    
    // Déclencher la suppression (mockée)
    page.on('dialog', dialog => {
      expect(dialog.message()).toContain('Êtes-vous sûr');
      dialog.accept(); // Confirmer la suppression
    });
    
    const deleteButton = page.getByRole('button', { name: /Supprimer/ }).first();
    if (await deleteButton.isVisible()) {
      await deleteButton.click();
      
      // Vérifier la confirmation
      await expect(page.getByText('Espèce supprimée avec succès')).toBeVisible();
    }
  });
});

test.describe('Bible des plantes - Filtres avancés', () => {
  test('Filtrage par sécurité (non toxique)', async ({ page }) => {
    await page.goto('http://localhost:3001/bible-des-plantes');
    
    // Activer le filtre "non toxique pour humains"
    await page.getByRole('checkbox', { name: /Non toxique \(humains\)/ }).check();
    await expect(page).toHaveURL(/.*safeForHumans=true/);
    
    // Activer le filtre "non toxique pour animaux"
    await page.getByRole('checkbox', { name: /Non toxique \(animaux\)/ }).check();
    await expect(page).toHaveURL(/.*safeForPets=true/);
  });

  test('Effacer tous les filtres', async ({ page }) => {
    // Naviguer avec des filtres actifs
    await page.goto('http://localhost:3001/bible-des-plantes?category=SHRUB&climate=MEDITERRANEAN&difficulty=EASY');
    
    // Cliquer sur "Effacer tous les filtres"
    await page.getByRole('button', { name: /Effacer tous les filtres/ }).click();
    
    // Vérifier qu'on revient à l'URL de base
    await expect(page).toHaveURL('/bible-des-plantes');
  });
});