# Karramna Agro — Site web

Site multi-pages HTML/CSS/JS (sans framework, aucune compilation nécessaire) pour
la marketplace et coopérative d'achat agroalimentaire Karramna Agro, basée à
Pikine, Dakar. Ce document explique comment le site est organisé et comment le
modifier, pour qu'un développeur puisse le reprendre facilement.

## Principe général : tout le contenu est dans le HTML

**Le contenu du site (textes, produits, packs, prix, images) est écrit
directement dans les fichiers `.html`.** Il n'y a pas de base de données ni de
CMS : pour changer un texte, un prix ou une image, on modifie le fichier HTML
concerné et on enregistre — c'est immédiatement visible en rechargeant la page.

Le JavaScript (`js/`) ne sert qu'à faire fonctionner des mécanismes
(panier, filtres, recherche, traduction, menu mobile...) ; il ne contient
plus aucune donnée produit.

## Structure des fichiers

```
index.html          Accueil (hero, catégories, produits/packs en avant, avis...)
catalogue.html       Catalogue complet (20 fiches produits + filtres/recherche/tri)
packs.html            Packs & Kits (6 fiches packs)
panier.html            Panier + tunnel de commande (WhatsApp)
apropos.html            À propos (mission, étapes, programme fidélité, valeurs)
contact.html              Contact (coordonnées + formulaire)
compte.html                  Connexion / inscription / espace client

css/style.css        Toutes les couleurs, polices, styles des composants
js/data.js            Icônes de catégories, zones de livraison, numéro WhatsApp
js/i18n.js              Dictionnaire de traduction FR/EN (textes de l'interface)
js/auth.js                Comptes clients, session, commandes, fidélité (localStorage)
js/account-page.js          Logique de la page "Mon compte"
js/main.js                    Panier, filtres/recherche/tri, modale produit, menu

images/               Toutes les images du site (voir plus bas)
icons/                 Favicon
fonts/                  Note sur les polices (voir fonts/README.txt)
```

## Modifier un produit ou un pack (le plus courant)

Ouvrez `catalogue.html` (pour un produit) ou `packs.html` (pour un pack).
Chaque fiche est un bloc `<article>` clairement délimité par un commentaire :

```html
<!-- ===== PRODUIT : Riz brisé parfumé (p01) ===== -->
<article class="product-card"
  data-id="p01" data-cat="cereales" data-price="13500"
  data-name="Riz brisé parfumé" data-name-en="Fragrant broken rice"
  data-unit="sac de 25 kg" data-unit-en="25 kg bag"
  data-supplier="Coopérative Vallée du Fleuve"
  data-desc="Riz brisé importé, grain court..." data-desc-en="Imported broken rice..."
  data-badge="Populaire" data-badge-en="Popular">
  <div class="card-media">
    <div class="img-style scale-img"><img src="images/products/p01.jpg" ...></div>
    <span class="tag-badge">Populaire</span>
    <span class="price-tag">13 500 FCFA</span>
  </div>
  <div class="card-body">
    <h3>Riz brisé parfumé</h3>
    <span class="card-unit">sac de 25 kg · Coopérative Vallée du Fleuve</span>
    <div class="card-price-row">
      <span class="card-price">13 500 FCFA<br><small>sac de 25 kg</small></span>
      <button class="btn btn-primary btn-sm" data-add="p01">Ajouter</button>
    </div>
  </div>
</article>
```

**Chaque information apparaît DEUX fois** : une fois dans les attributs
`data-...` (utilisés par le panier, la fiche détail et la traduction) et une
fois dans le texte visible (`<h3>`, `<span class="price-tag">`...). **Il faut
changer les deux** pour rester cohérent. C'est la seule contrainte à retenir :

| Vous voulez changer... | Modifiez... |
|---|---|
| Le nom du produit | `data-name` **et** le texte dans `<h3>` |
| Le prix | `data-price` (nombre sans espace) **et** les 2 endroits où le prix est écrit (`price-tag` et `card-price`) |
| L'unité (ex. "sac de 25 kg") | `data-unit` **et** le texte dans `.card-unit` et `<small>` |
| La description (fiche détail) | `data-desc` uniquement (n'apparaît que dans la pop-up) |
| L'image | le `src="images/products/....jpg"` de la balise `<img>` (voir aussi la section Images) |
| La traduction anglaise | tous les attributs `-en` (`data-name-en`, `data-desc-en`...) |

- **Pour AJOUTER un produit/pack** : copiez un bloc `<article>...</article>` en
  entier, collez-le juste après, changez `data-id` (doit être unique sur tout
  le site, ex. `p21`) et modifiez le contenu.
- **Pour SUPPRIMER un produit/pack** : supprimez le bloc `<article>...</article>`
  en entier.
- Les prix sont en FCFA ; le format d'affichage utilisé est `13 500 FCFA`
  (espace comme séparateur de milliers).
- `index.html` reprend telles quelles 4 fiches produits et 3 fiches packs dans
  ses sections "Produits populaires" / "Packs & Kits" (mêmes blocs `<article>`,
  à modifier là-bas séparément si besoin).

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
- **Le filtre / la recherche / le tri du catalogue** : ils affichent ou
  masquent les fiches déjà présentes dans `catalogue.html`, sans jamais les
  régénérer.
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
