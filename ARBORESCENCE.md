# ARBORESCENCE — EmpireKongo

Structure complète des dossiers et fichiers du projet PHP EmpireKongo.

```
EmpireKongo/
│
├── index.php
├── about.php
├── contact.php
├── pricing.php
├── faq.php
├── terms.php
├── privacy.php
├── cookies.php
│
├── assets/
│   ├── css/
│   ├── js/
│   ├── images/
│   │   ├── logo/
│   │   ├── hero/
│   │   ├── icons/
│   │   ├── banners/
│   │   ├── avatars/
│   │   ├── products/
│   │   └── companies/
│   ├── fonts/
│   └── vendor/
│
├── includes/
│   ├── header.php
│   ├── navbar.php
│   ├── sidebar.php
│   ├── footer.php
│   ├── loader.php
│   ├── alerts.php
│   ├── notifications.php
│   ├── search.php
│   └── functions.php
│
├── config/
│   ├── database.php
│   ├── app.php
│   ├── session.php
│   ├── auth.php
│   ├── mail.php
│   ├── upload.php
│   └── security.php
│
├── auth/
│   ├── login.php
│   ├── register.php
│   ├── forgot-password.php
│   ├── reset-password.php
│   ├── verify-email.php
│   ├── logout.php
│   └── two-factor.php
│
├── dashboard/
│   ├── index.php
│   ├── profile.php
│   ├── settings.php
│   ├── security.php
│   ├── notifications.php
│   ├── messages.php
│   ├── favorites.php
│   ├── history.php
│   └── analytics.php
│
├── profile/
│   ├── view.php
│   ├── edit.php
│   ├── experience.php
│   ├── education.php
│   ├── certifications.php
│   ├── portfolio.php
│   ├── documents.php
│   ├── followers.php
│   ├── following.php
│   └── activity.php
│
├── companies/
│   ├── index.php
│   ├── create.php
│   ├── dashboard.php
│   ├── profile.php
│   ├── employees.php
│   ├── departments.php
│   ├── jobs.php
│   ├── products.php
│   ├── services.php
│   ├── reviews.php
│   └── analytics.php
│
├── store/
│   ├── index.php
│   ├── categories.php
│   ├── category.php
│   ├── product.php
│   ├── search.php
│   ├── promotions.php
│   ├── wishlist.php
│   ├── compare.php
│   ├── brands.php
│   └── reviews.php
│
├── my-products/
│   ├── index.php
│   ├── create.php
│   ├── edit.php
│   ├── inventory.php
│   ├── pricing.php
│   ├── orders.php
│   ├── statistics.php
│   └── archive.php
│
├── orders/
│   ├── cart.php
│   ├── checkout.php
│   ├── payment.php
│   ├── invoices.php
│   ├── shipping.php
│   ├── tracking.php
│   ├── returns.php
│   └── history.php
│
├── marketplace/
│   ├── suppliers.php
│   ├── manufacturers.php
│   ├── wholesalers.php
│   ├── exporters.php
│   ├── importers.php
│   ├── requests.php
│   ├── quotations.php
│   └── contracts.php
│
├── community/
│   ├── feed.php
│   ├── posts.php
│   ├── groups.php
│   ├── events.php
│   ├── marketplace.php
│   ├── polls.php
│   ├── stories.php
│   └── livestream.php
│
├── messaging/
│   ├── inbox.php
│   ├── conversation.php
│   ├── video.php
│   ├── audio.php
│   ├── files.php
│   └── archive.php
│
├── jobs/
│   ├── index.php
│   ├── offers.php
│   ├── candidates.php
│   ├── applications.php
│   ├── interviews.php
│   └── recruitment.php
│
├── services/
│   ├── freelancers.php
│   ├── agencies.php
│   ├── consultants.php
│   ├── technicians.php
│   └── requests.php
│
├── academy/
│   ├── courses.php
│   ├── lessons.php
│   ├── certifications.php
│   ├── webinars.php
│   └── library.php
│
├── finance/
│   ├── wallet.php
│   ├── transactions.php
│   ├── withdrawals.php
│   ├── deposits.php
│   ├── commissions.php
│   └── affiliates.php
│
├── support/
│   ├── tickets.php
│   ├── faq.php
│   ├── live-chat.php
│   ├── documentation.php
│   └── reports.php
│
├── notifications/
│   ├── all.php
│   ├── system.php
│   ├── orders.php
│   ├── messages.php
│   └── security.php
│
├── uploads/
│   ├── profiles/
│   ├── companies/
│   ├── products/
│   ├── documents/
│   ├── videos/
│   └── temp/
│
├── api/
│   ├── auth/
│   ├── users/
│   ├── companies/
│   ├── products/
│   ├── orders/
│   ├── payments/
│   └── notifications/
│
├── admin/
│   ├── dashboard.php
│   ├── users.php
│   ├── companies.php
│   ├── products.php
│   ├── orders.php
│   ├── payments.php
│   ├── reports.php
│   ├── settings.php
│   ├── permissions.php
│   ├── logs.php
│   └── backups.php
│
└── database/
    ├── migrations/
    ├── seeders/
    ├── sql/
    └── backups/
```

---

## Légende

| Dossier | Rôle |
|---|---|
| `assets/` | Ressources statiques (CSS, JS, images, polices, librairies tierces) |
| `includes/` | Composants réutilisables (header, footer, navbar, sidebar…) |
| `config/` | Fichiers de configuration (BDD, session, sécurité, mail…) |
| `auth/` | Authentification (connexion, inscription, 2FA, réinitialisation) |
| `dashboard/` | Tableau de bord utilisateur |
| `profile/` | Gestion du profil (expérience, portfolio, documents…) |
| `companies/` | Pages entreprises (création, employés, services, analytics) |
| `store/` | Boutique en ligne (catégories, produits, promotions, avis) |
| `my-products/` | Gestion des produits du vendeur |
| `orders/` | Commandes (panier, paiement, livraison, retours) |
| `marketplace/` | B2B (fournisseurs, devis, contrats, importateurs/exportateurs) |
| `community/` | Communauté (fil d'actualité, groupes, événements, live) |
| `messaging/` | Messagerie (inbox, vidéo, audio, fichiers) |
| `jobs/` | Emploi (offres, candidats, entretiens, recrutement) |
| `services/` | Services (freelancers, agences, consultants, techniciens) |
| `academy/` | Formation (cours, certifications, webinaires, bibliothèque) |
| `finance/` | Finance (portefeuille, transactions, retraits, commissions) |
| `support/` | Support (tickets, FAQ, chat en direct, documentation) |
| `notifications/` | Notifications (système, commandes, messages, sécurité) |
| `uploads/` | Fichiers uploadés (profils, produits, documents, vidéos) |
| `api/` | Points d'entrée API REST |
| `admin/` | Administration (utilisateurs, produits, paiements, logs) |
| `database/` | Migrations, seeders, fichiers SQL, sauvegardes |
