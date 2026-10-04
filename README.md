# Karramna Agro — Site web

Site multi-pages HTML/CSS/JS (sans framework, aucune compilation nécessaire) pour
la marketplace agroalimentaire Karramna Agro, basée à Pikine, Dakar. Ce document
explique comment le site est organisé et comment le modifier, pour qu'un
développeur puisse le reprendre facilement.

## Principe général : les produits vivent dans `js/catalog.js`

**Depuis la dernière évolution du projet (passage à une architecture pensée pour
grandir vers plusieurs centaines/milliers de produits), les fiches produits et
packs ne sont plus écrites directement en blocs `<article>` dans le HTML.**
Elles sont centralisées dans **`js/catalog.js`**, sous forme de deux tableaux
`PRODUCTS` et `PACKS` — une seule source de vérité, lue par `catalogue.html`,
`packs.html` et `index.html` pour générer les cartes à l'affichage.

> Historique : une version précédente du site stockait le contenu directement
> en HTML pour une édition sans JavaScript. Ce choix ne tenait plus face à
> l'objectif de faire évoluer le catalogue vers un vrai volume B2B (variantes,
> profils clients, tags, prix pro) sans dupliquer chaque produit à plusieurs
> endroits. Le changement a été validé avant d'être appliqué.

### Modifier un produit ou un pack (le plus courant)

Ouvrez `js/catalog.js`. Chaque produit est un objet dans le tableau `PRODUCTS` :

```js
{
  id: "p01", department: "alimentaire", category: "cereales", subcategory: "riz",
  name: "Riz brisé parfumé", nameEn: "Fragrant broken rice",
  unit: "sac de 25 kg", unitEn: "25 kg bag",
  price: 13500, supplier: "Coopérative Vallée du Fleuve",
  desc: "...", descEn: "...",
  badge: "Populaire", badgeEn: "Popular",
  img: "images/products/p01.jpg",
  tags: ["essentiel", "gros_volume"],
  eligibleProfiles: ["restaurant", "traiteur", "menage", "boulangerie"],
},
```

| Vous voulez changer... | Modifiez... |
|---|---|
| Le nom, le prix, l'unité, la description | Le champ correspondant dans l'objet du produit |
| L'image | Le champ `img` (chemin vers `images/products/...jpg`) |
| La catégorie | Le champ `category` (doit correspondre à un `id` de `CATEGORIES` dans `js/data.js`) |
| Les profils professionnels concernés | Le tableau `eligibleProfiles` |
| La traduction anglaise | Les champs `...En` |

- **Pour AJOUTER un produit** : copiez un objet, donnez-lui un `id` unique (ex. `p21`), modifiez le contenu.
- **Pour SUPPRIMER un produit** : supprimez son objet du tableau.
- Les packs suivent la même logique dans le tableau `PACKS` du même fichier
  (avec `tagline`, `contents` en tableau de chaînes, et `oldPrice` optionnel
  pour afficher un prix barré).
- Aucune donnée produit n'est dupliquée ailleurs : modifier `js/catalog.js`
  met à jour le catalogue, la page Packs et la sélection sur l'accueil en
  même temps.

## Structure des fichiers

```
index.html          Accueil (hero, catégories, produits/packs en avant, avis...)
catalogue.html       Catalogue complet (filtres/recherche/tri, généré depuis catalog.js)
packs.html            Packs & Kits (généré depuis catalog.js)
panier.html            Panier + tunnel de commande (WhatsApp)
apropos.html            À propos (mission, étapes, programme fidélité, valeurs)
contact.html              Contact (coordonnées + formulaire)
compte.html                  Connexion / inscription / espace client

css/style.css        Toutes les couleurs, polices, styles des composants
js/catalog.js          Départements, produits (PRODUCTS) et packs (PACKS) — source unique
js/data.js            Icônes de catégories, catégories, zones de livraison, config (WhatsApp, NAKA)
js/i18n.js              Dictionnaire de traduction FR/EN (textes de l'interface)
js/auth.js                Comptes clients, session, commandes, fidélité (localStorage)
js/account-page.js          Logique de la page "Mon compte"
js/main.js                    Rendu des cartes, panier, filtres/recherche/tri, modale, menu

images/               Toutes les images du site (voir plus bas)
icons/                 Favicon
fonts/                  Note sur les polices (voir fonts/README.txt)
```

## Modifier une catégorie  <div class="card-body">
    <h3>Riz brisé parfumé</h3>
    <span class="card-unit">sac de 25 kg · Coopérative Vallée du Fleuve</span>
## Modifier une catégorie (accueil)

Les 6 catégories affichées sur l'accueil (`#categories-grid` dans `index.html`)
sont elles aussi écrites directement en HTML, juste au-dessus de la section
"Produits populaires" :

```html
<a class="cat-card" href="catalogue.html?cat=poissons">
  <svg>...</svg>
  <span data-i18n="categories.poissons">Poissons</span>
</a>
```

Changez le texte du `<span>` pour le français, et la valeur correspondante
dans `js/i18n.js` (même clé, ex. `categories.poissons`) pour l'anglais. Le lien
`href="catalogue.html?cat=..."` doit correspondre à la valeur `data-cat` déjà
utilisée sur les fiches produits du catalogue pour que le filtre fonctionne.

## Modifier un texte de l'interface (boutons, menus, titres de page...)

La plupart des textes fixes sont écrits directement dans le HTML de chaque
page (ex. `<h1>Catalogue produits agroalimentaires — Dakar</h1>` dans
`catalogue.html`). Modifiez-les directement là où ils apparaissent.

Les textes qui possèdent un attribut `data-i18n="clé"` sont en plus reliés au
système de traduction FR/EN (`js/i18n.js`) : le texte visible dans le HTML est
la version française par défaut, et la clé indique où se trouve la version
anglaise. **Si vous changez un texte qui a un attribut `data-i18n`, pensez à
mettre à jour aussi la valeur correspondante dans `js/i18n.js`** (recherchez la
même clé, ex. `pageHeaders.catalogue.h1`), sinon la version anglaise restera
l'ancien texte.

## Images

Toutes les images sont dans `images/`, organisées par usage :
```
images/hero/       5 images du carrousel de l'accueil
images/pages/       Bannières en haut de chaque page intérieure
images/products/     Une image par produit (p01.jpg à p20.jpg)
images/packs/          Une image par pack (k01.jpg à k06.jpg)
images/logo/              Logo du site (logo.svg)
```
Pour remplacer une image, déposez votre fichier avec **le même nom** dans le
même dossier (ou changez le `src="..."` dans le HTML si vous utilisez un autre
nom de fichier). Toutes les images utilisent le même marquage :
```html
<div class="img-style scale-img">
  <img src="images/dossier/fichier.jpg" width="800" height="600" alt="...">
</div>
```

## Ce qui reste géré en JavaScript (et pourquoi)

Certaines choses ne peuvent pas être du HTML statique car elles dépendent de
l'action du visiteur :
- **Le panier** (`js/main.js`) : stocké dans le navigateur (localStorage) le
  temps de la session.
- **Les comptes clients / historique de commandes / fidélité** (`js/auth.js`,
  `js/account-page.js`) : démonstration côté navigateur, voir avertissement
  ci-dessous.
- **Le filtre / la recherche / le tri du catalogue** (`js/main.js`,
  `initCataloguePage`) : génèrent les cartes à partir de `js/catalog.js` à
  chaque changement de filtre. La recherche reconnaît aussi quelques
  synonymes de base (ex. "patate" retrouve "pomme de terre") via
  `SEARCH_SYNONYMS` dans `js/main.js` — à compléter au besoin.
- **Le sélecteur de langue FR/EN** : bascule l'affichage entre le texte
  français du HTML et les valeurs `-en` / celles de `js/i18n.js`.
- **Les zones de livraison** (menu déroulant du panier) : liste définie dans
  `js/data.js` (`ZONES`), utilisée pour calculer les frais de livraison.

## ⚠️ Comptes clients : démonstration, pas une vraie authentification

Le système "Mon compte" fonctionne uniquement avec le stockage local du
navigateur (`localStorage`) : chaque compte n'existe que sur l'appareil où il
a été créé, sans synchronisation, et les mots de passe ne sont pas protégés
sérieusement. C'est fonctionnel pour démontrer l'expérience utilisateur, mais
**avant une vraie mise en production, il faut le remplacer par une authentification
réelle** (Supabase Auth est recommandé, voir plus bas).

## Évolutivité prévue (feuille de route B2B)

`js/catalog.js` contient déjà, en plus de `PRODUCTS`/`PACKS`, un tableau
`DEPARTMENTS` (Alimentaire, Boissons, Emballages, Hygiène & entretien) et,
sur chaque produit, des champs `tags` et `eligibleProfiles` prêts à être
exploités par de futurs filtres (profil métier, gros volume, produit local...).
Ce sont les fondations posées pour faire évoluer le catalogue vers plusieurs
centaines de références et une logique B2B (prix pro, paliers de quantité,
devis, pages par profil) sans tout reconstruire — voir le document d'audit
livré séparément pour le plan détaillé par priorité.

## À personnaliser avant mise en ligne

1. Dans `js/data.js` : remplacer `WHATSAPP_NUMBER` par le vrai numéro WhatsApp Business.
2. Dans chaque page HTML : remplacer les numéros de téléphone (+221 77 000 00 00)
   et l'email (contact@karramna-agro.sn) par les vraies coordonnées.
3. Remplacer les images de `images/products/`, `images/packs/`, `images/hero/`
   et `images/pages/` par de vraies photos (actuellement des visuels de
   substitution).
4. Brancher un vrai moyen de paiement (Wave / Orange Money) sur `panier.html`.
5. Remplacer le système de comptes par une vraie authentification (Supabase
   Auth recommandé) pour une utilisation en production multi-appareils.
6. Mettre à jour `sitemap.xml` et les balises `og:url` avec le nom de domaine définitif.

## Ouverture en local

Ouvrez simplement `index.html` dans un navigateur, ou lancez un petit serveur local :
```bash
python3 -m http.server 8000
# puis ouvrez http://localhost:8000
```
