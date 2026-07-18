-- ============================================================
--  EMPIREKONGO — Schéma MySQL Complet v2.0
--  Vision : Écosystème numérique congolais (RDC)
--  Généré le : 2026-07-18
--  Encodage  : UTF-8 / utf8mb4
--  Moteur    : InnoDB
--  Modules   : Store, Entreprises, Fournisseurs, Communauté,
--              Emploi, Services, Affiliation, Paiements,
--              Administration, Statistiques
-- ============================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;
SET SQL_MODE = 'NO_AUTO_VALUE_ON_ZERO';

-- ------------------------------------------------------------
-- Création de la base de données
-- ------------------------------------------------------------
CREATE DATABASE IF NOT EXISTS `empirekongo`
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE `empirekongo`;

-- ============================================================
-- MODULE 0 : CONFIGURATION GLOBALE
-- ============================================================

-- TABLE : parametres_site
CREATE TABLE IF NOT EXISTS `parametres_site` (
  `id`            INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  `cle`           VARCHAR(100)  NOT NULL UNIQUE COMMENT 'Clé du paramètre',
  `valeur`        TEXT          DEFAULT NULL COMMENT 'Valeur du paramètre',
  `type`          ENUM('texte','nombre','booleen','json','image','email') NOT NULL DEFAULT 'texte',
  `groupe`        VARCHAR(80)   NOT NULL DEFAULT 'general' COMMENT 'general, smtp, seo, api, paiement',
  `description`   VARCHAR(255)  DEFAULT NULL,
  `updated_at`    DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_groupe` (`groupe`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Paramètres globaux de la plateforme';

-- TABLE : provinces
CREATE TABLE IF NOT EXISTS `provinces` (
  `id`          INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  `nom`         VARCHAR(100)  NOT NULL,
  `code`        VARCHAR(10)   DEFAULT NULL,
  `actif`       TINYINT(1)    NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_nom` (`nom`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Provinces de la RDC';

-- TABLE : villes
CREATE TABLE IF NOT EXISTS `villes` (
  `id`          INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  `province_id` INT UNSIGNED  NOT NULL,
  `nom`         VARCHAR(100)  NOT NULL,
  `actif`       TINYINT(1)    NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`),
  KEY `idx_province` (`province_id`),
  CONSTRAINT `fk_ville_prov` FOREIGN KEY (`province_id`) REFERENCES `provinces` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Villes par province';

-- TABLE : communes
CREATE TABLE IF NOT EXISTS `communes` (
  `id`          INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  `ville_id`    INT UNSIGNED  NOT NULL,
  `nom`         VARCHAR(100)  NOT NULL,
  `actif`       TINYINT(1)    NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`),
  KEY `idx_ville` (`ville_id`),
  CONSTRAINT `fk_commune_ville` FOREIGN KEY (`ville_id`) REFERENCES `villes` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Communes par ville';

-- TABLE : quartiers
CREATE TABLE IF NOT EXISTS `quartiers` (
  `id`          INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  `commune_id`  INT UNSIGNED  NOT NULL,
  `nom`         VARCHAR(100)  NOT NULL,
  `actif`       TINYINT(1)    NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`),
  KEY `idx_commune` (`commune_id`),
  CONSTRAINT `fk_quartier_commune` FOREIGN KEY (`commune_id`) REFERENCES `communes` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Quartiers par commune';

-- ============================================================
-- MODULE 1 : UTILISATEURS (6 types)
-- ============================================================

-- TABLE : categories
CREATE TABLE IF NOT EXISTS `categories` (
  `id`          INT UNSIGNED     NOT NULL AUTO_INCREMENT,
  `parent_id`   INT UNSIGNED     DEFAULT NULL COMMENT 'NULL = catégorie principale',
  `nom`         VARCHAR(120)     NOT NULL,
  `slug`        VARCHAR(140)     NOT NULL UNIQUE,
  `description` TEXT             DEFAULT NULL,
  `icone`       VARCHAR(255)     DEFAULT NULL COMMENT 'URL ou classe icône',
  `image`       VARCHAR(255)     DEFAULT NULL,
  `ordre`       TINYINT UNSIGNED NOT NULL DEFAULT 0,
  `actif`       TINYINT(1)       NOT NULL DEFAULT 1,
  `created_at`  DATETIME         NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`  DATETIME         NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_parent` (`parent_id`),
  CONSTRAINT `fk_cat_parent` FOREIGN KEY (`parent_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Catégories et sous-catégories de produits/services';

-- TABLE : utilisateurs
CREATE TABLE IF NOT EXISTS `utilisateurs` (
  `id`                  INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  `nom`                 VARCHAR(100)  NOT NULL,
  `prenom`              VARCHAR(100)  NOT NULL,
  `email`               VARCHAR(191)  NOT NULL UNIQUE,
  `telephone`           VARCHAR(30)   DEFAULT NULL,
  `mot_de_passe`        VARCHAR(255)  NOT NULL COMMENT 'Hash bcrypt',
  `avatar`              VARCHAR(255)  DEFAULT NULL,
  `couverture`          VARCHAR(255)  DEFAULT NULL,
  `biographie`          TEXT          DEFAULT NULL,
  `role`                ENUM('admin','super_admin','membre','vendeur','entreprise','fournisseur','affilie') NOT NULL DEFAULT 'membre',
  `statut`              ENUM('actif','inactif','suspendu','banni') NOT NULL DEFAULT 'actif',
  `email_verifie`       TINYINT(1)    NOT NULL DEFAULT 0,
  `telephone_verifie`   TINYINT(1)    NOT NULL DEFAULT 0,
  `token_verification`  VARCHAR(255)  DEFAULT NULL,
  `token_reset`         VARCHAR(255)  DEFAULT NULL,
  `token_reset_expire`  DATETIME      DEFAULT NULL,
  `adresse`             VARCHAR(255)  DEFAULT NULL,
  `ville_id`            INT UNSIGNED  DEFAULT NULL,
  `province_id`         INT UNSIGNED  DEFAULT NULL,
  `pays`                VARCHAR(80)   NOT NULL DEFAULT 'RDC',
  `langue`              VARCHAR(10)   NOT NULL DEFAULT 'fr',
  `devise_preferee`     VARCHAR(10)   NOT NULL DEFAULT 'CDF',
  `derniere_connexion`  DATETIME      DEFAULT NULL,
  `ip_derniere_connexion` VARCHAR(45) DEFAULT NULL,
  `nb_connexions`       INT UNSIGNED  NOT NULL DEFAULT 0,
  `created_at`          DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`          DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_email`      (`email`),
  KEY `idx_role`       (`role`),
  KEY `idx_statut`     (`statut`),
  KEY `idx_ville`      (`ville_id`),
  KEY `idx_province`   (`province_id`),
  CONSTRAINT `fk_user_ville`    FOREIGN KEY (`ville_id`)    REFERENCES `villes`    (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_user_province` FOREIGN KEY (`province_id`) REFERENCES `provinces` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Comptes utilisateurs — 6 rôles : membre, vendeur, entreprise, fournisseur, affilié, admin';

-- TABLE : sessions
CREATE TABLE IF NOT EXISTS `sessions` (
  `id`              VARCHAR(128)  NOT NULL,
  `utilisateur_id`  INT UNSIGNED  NOT NULL,
  `ip_address`      VARCHAR(45)   DEFAULT NULL,
  `user_agent`      VARCHAR(500)  DEFAULT NULL,
  `payload`         TEXT          DEFAULT NULL,
  `expire_at`       DATETIME      NOT NULL,
  `created_at`      DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_utilisateur` (`utilisateur_id`),
  KEY `idx_expire`      (`expire_at`),
  CONSTRAINT `fk_sess_user` FOREIGN KEY (`utilisateur_id`) REFERENCES `utilisateurs` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Sessions actives des utilisateurs';

-- TABLE : profils_vendeurs
CREATE TABLE IF NOT EXISTS `profils_vendeurs` (
  `id`                INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  `utilisateur_id`    INT UNSIGNED  NOT NULL UNIQUE,
  `nom_boutique`      VARCHAR(200)  NOT NULL,
  `slug_boutique`     VARCHAR(220)  NOT NULL UNIQUE,
  `description`       TEXT          DEFAULT NULL,
  `logo`              VARCHAR(255)  DEFAULT NULL,
  `couverture`        VARCHAR(255)  DEFAULT NULL,
  `telephone`         VARCHAR(30)   DEFAULT NULL,
  `email_boutique`    VARCHAR(191)  DEFAULT NULL,
  `adresse`           VARCHAR(255)  DEFAULT NULL,
  `ville_id`          INT UNSIGNED  DEFAULT NULL,
  `province_id`       INT UNSIGNED  DEFAULT NULL,
  `statut`            ENUM('actif','inactif','suspendu','en_attente') NOT NULL DEFAULT 'en_attente',
  `verifie`           TINYINT(1)    NOT NULL DEFAULT 0,
  `note_moyenne`      DECIMAL(3,2)  NOT NULL DEFAULT 0.00,
  `nb_ventes`         INT UNSIGNED  NOT NULL DEFAULT 0,
  `nb_produits`       INT UNSIGNED  NOT NULL DEFAULT 0,
  `created_at`        DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`        DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_utilisateur` (`utilisateur_id`),
  KEY `idx_ville`       (`ville_id`),
  CONSTRAINT `fk_vendeur_user`  FOREIGN KEY (`utilisateur_id`) REFERENCES `utilisateurs` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_vendeur_ville` FOREIGN KEY (`ville_id`)       REFERENCES `villes`       (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Profils boutiques des vendeurs';

-- ============================================================
-- MODULE 2 : ENTREPRISES
-- ============================================================

-- TABLE : entreprises
CREATE TABLE IF NOT EXISTS `entreprises` (
  `id`              INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  `utilisateur_id`  INT UNSIGNED  NOT NULL,
  `categorie_id`    INT UNSIGNED  DEFAULT NULL,
  `nom`             VARCHAR(200)  NOT NULL,
  `slug`            VARCHAR(220)  NOT NULL UNIQUE,
  `description`     TEXT          DEFAULT NULL,
  `secteur`         VARCHAR(120)  DEFAULT NULL,
  `logo`            VARCHAR(255)  DEFAULT NULL,
  `couverture`      VARCHAR(255)  DEFAULT NULL,
  `email`           VARCHAR(191)  DEFAULT NULL,
  `telephone`       VARCHAR(30)   DEFAULT NULL,
  `telephone2`      VARCHAR(30)   DEFAULT NULL,
  `site_web`        VARCHAR(255)  DEFAULT NULL,
  `adresse`         VARCHAR(255)  DEFAULT NULL,
  `ville_id`        INT UNSIGNED  DEFAULT NULL,
  `province_id`     INT UNSIGNED  DEFAULT NULL,
  `commune_id`      INT UNSIGNED  DEFAULT NULL,
  `pays`            VARCHAR(80)   NOT NULL DEFAULT 'RDC',
  `latitude`        DECIMAL(10,7) DEFAULT NULL,
  `longitude`       DECIMAL(10,7) DEFAULT NULL,
  `facebook`        VARCHAR(255)  DEFAULT NULL,
  `instagram`       VARCHAR(255)  DEFAULT NULL,
  `twitter`         VARCHAR(255)  DEFAULT NULL,
  `linkedin`        VARCHAR(255)  DEFAULT NULL,
  `whatsapp`        VARCHAR(30)   DEFAULT NULL,
  `nb_employes`     VARCHAR(50)   DEFAULT NULL COMMENT 'Ex: 1-10, 11-50, 51-200',
  `annee_creation`  YEAR          DEFAULT NULL,
  `type_entreprise` ENUM('sarl','sa','ong','cooperative','individuelle','autre') DEFAULT 'individuelle',
  `rccm`            VARCHAR(100)  DEFAULT NULL COMMENT 'Numéro RCCM',
  `id_national`     VARCHAR(100)  DEFAULT NULL,
  `verifie`         TINYINT(1)    NOT NULL DEFAULT 0,
  `mise_en_avant`   TINYINT(1)    NOT NULL DEFAULT 0,
  `statut`          ENUM('actif','inactif','en_attente','suspendu','refuse') NOT NULL DEFAULT 'en_attente',
  `nb_followers`    INT UNSIGNED  NOT NULL DEFAULT 0,
  `note_moyenne`    DECIMAL(3,2)  NOT NULL DEFAULT 0.00,
  `nb_avis`         INT UNSIGNED  NOT NULL DEFAULT 0,
  `nb_vues`         INT UNSIGNED  NOT NULL DEFAULT 0,
  `created_at`      DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`      DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_utilisateur` (`utilisateur_id`),
  KEY `idx_categorie`   (`categorie_id`),
  KEY `idx_ville`       (`ville_id`),
  KEY `idx_province`    (`province_id`),
  KEY `idx_verifie`     (`verifie`),
  KEY `idx_statut`      (`statut`),
  KEY `idx_mise_avant`  (`mise_en_avant`),
  CONSTRAINT `fk_ent_user`    FOREIGN KEY (`utilisateur_id`) REFERENCES `utilisateurs` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_ent_cat`     FOREIGN KEY (`categorie_id`)   REFERENCES `categories`   (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_ent_ville`   FOREIGN KEY (`ville_id`)       REFERENCES `villes`       (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_ent_prov`    FOREIGN KEY (`province_id`)    REFERENCES `provinces`    (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_ent_commune` FOREIGN KEY (`commune_id`)     REFERENCES `communes`     (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Profils des entreprises inscrites';

-- TABLE : entreprise_services
CREATE TABLE IF NOT EXISTS `entreprise_services` (
  `id`            INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  `entreprise_id` INT UNSIGNED  NOT NULL,
  `titre`         VARCHAR(200)  NOT NULL,
  `description`   TEXT          DEFAULT NULL,
  `prix`          DECIMAL(12,2) DEFAULT NULL,
  `devise`        VARCHAR(10)   NOT NULL DEFAULT 'CDF',
  `image`         VARCHAR(255)  DEFAULT NULL,
  `ordre`         TINYINT UNSIGNED NOT NULL DEFAULT 0,
  `actif`         TINYINT(1)    NOT NULL DEFAULT 1,
  `created_at`    DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_entreprise` (`entreprise_id`),
  CONSTRAINT `fk_serv_ent` FOREIGN KEY (`entreprise_id`) REFERENCES `entreprises` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Services proposés par les entreprises';

-- TABLE : entreprise_realisations
CREATE TABLE IF NOT EXISTS `entreprise_realisations` (
  `id`            INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  `entreprise_id` INT UNSIGNED  NOT NULL,
  `titre`         VARCHAR(200)  NOT NULL,
  `description`   TEXT          DEFAULT NULL,
  `image`         VARCHAR(255)  DEFAULT NULL,
  `date_realisation` DATE       DEFAULT NULL,
  `lien`          VARCHAR(255)  DEFAULT NULL,
  `ordre`         TINYINT UNSIGNED NOT NULL DEFAULT 0,
  `created_at`    DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_entreprise` (`entreprise_id`),
  CONSTRAINT `fk_real_ent` FOREIGN KEY (`entreprise_id`) REFERENCES `entreprises` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Réalisations / portfolio des entreprises';

-- TABLE : followers
CREATE TABLE IF NOT EXISTS `followers` (
  `id`              INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  `utilisateur_id`  INT UNSIGNED  NOT NULL,
  `entreprise_id`   INT UNSIGNED  NOT NULL,
  `created_at`      DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_follow` (`utilisateur_id`, `entreprise_id`),
  KEY `idx_entreprise` (`entreprise_id`),
  CONSTRAINT `fk_fol_user` FOREIGN KEY (`utilisateur_id`) REFERENCES `utilisateurs` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_fol_ent`  FOREIGN KEY (`entreprise_id`)  REFERENCES `entreprises`  (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Abonnements aux entreprises';

-- ============================================================
-- MODULE 3 : FOURNISSEURS (B2B)
-- ============================================================

-- TABLE : fournisseurs
CREATE TABLE IF NOT EXISTS `fournisseurs` (
  `id`                INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  `utilisateur_id`    INT UNSIGNED  NOT NULL UNIQUE,
  `nom_societe`       VARCHAR(200)  NOT NULL,
  `slug`              VARCHAR(220)  NOT NULL UNIQUE,
  `description`       TEXT          DEFAULT NULL,
  `type_fournisseur`  ENUM('grossiste','producteur','fabricant','importateur','distributeur','autre') NOT NULL DEFAULT 'grossiste',
  `logo`              VARCHAR(255)  DEFAULT NULL,
  `couverture`        VARCHAR(255)  DEFAULT NULL,
  `email`             VARCHAR(191)  DEFAULT NULL,
  `telephone`         VARCHAR(30)   DEFAULT NULL,
  `site_web`          VARCHAR(255)  DEFAULT NULL,
  `adresse`           VARCHAR(255)  DEFAULT NULL,
  `ville_id`          INT UNSIGNED  DEFAULT NULL,
  `province_id`       INT UNSIGNED  DEFAULT NULL,
  `pays`              VARCHAR(80)   NOT NULL DEFAULT 'RDC',
  `commande_min`      DECIMAL(12,2) DEFAULT NULL COMMENT 'Montant minimum de commande',
  `devise`            VARCHAR(10)   NOT NULL DEFAULT 'CDF',
  `delai_livraison`   VARCHAR(100)  DEFAULT NULL COMMENT 'Ex: 3-5 jours ouvrables',
  `zones_livraison`   TEXT          DEFAULT NULL COMMENT 'Zones couvertes',
  `verifie`           TINYINT(1)    NOT NULL DEFAULT 0,
  `statut`            ENUM('actif','inactif','en_attente','suspendu') NOT NULL DEFAULT 'en_attente',
  `note_moyenne`      DECIMAL(3,2)  NOT NULL DEFAULT 0.00,
  `nb_avis`           INT UNSIGNED  NOT NULL DEFAULT 0,
  `created_at`        DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`        DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_utilisateur`     (`utilisateur_id`),
  KEY `idx_type`            (`type_fournisseur`),
  KEY `idx_ville`           (`ville_id`),
  KEY `idx_statut`          (`statut`),
  CONSTRAINT `fk_fourn_user`  FOREIGN KEY (`utilisateur_id`) REFERENCES `utilisateurs` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_fourn_ville` FOREIGN KEY (`ville_id`)       REFERENCES `villes`       (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Profils fournisseurs B2B';

-- TABLE : fournisseur_categories
CREATE TABLE IF NOT EXISTS `fournisseur_categories` (
  `fournisseur_id` INT UNSIGNED NOT NULL,
  `categorie_id`   INT UNSIGNED NOT NULL,
  PRIMARY KEY (`fournisseur_id`, `categorie_id`),
  CONSTRAINT `fk_fc_fourn` FOREIGN KEY (`fournisseur_id`) REFERENCES `fournisseurs` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_fc_cat`   FOREIGN KEY (`categorie_id`)   REFERENCES `categories`   (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Catégories couvertes par chaque fournisseur';

-- TABLE : demandes_approvisionnement
CREATE TABLE IF NOT EXISTS `demandes_approvisionnement` (
  `id`              INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  `entreprise_id`   INT UNSIGNED  NOT NULL COMMENT 'Entreprise qui demande',
  `fournisseur_id`  INT UNSIGNED  DEFAULT NULL COMMENT 'Fournisseur ciblé (optionnel)',
  `categorie_id`    INT UNSIGNED  DEFAULT NULL,
  `titre`           VARCHAR(200)  NOT NULL,
  `description`     TEXT          NOT NULL,
  `quantite`        VARCHAR(100)  DEFAULT NULL,
  `budget_max`      DECIMAL(12,2) DEFAULT NULL,
  `devise`          VARCHAR(10)   NOT NULL DEFAULT 'CDF',
  `date_limite`     DATE          DEFAULT NULL,
  `statut`          ENUM('ouverte','en_cours','fermee','annulee') NOT NULL DEFAULT 'ouverte',
  `created_at`      DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`      DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_entreprise`  (`entreprise_id`),
  KEY `idx_fournisseur` (`fournisseur_id`),
  KEY `idx_statut`      (`statut`),
  CONSTRAINT `fk_da_ent`   FOREIGN KEY (`entreprise_id`)  REFERENCES `entreprises`  (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_da_fourn` FOREIGN KEY (`fournisseur_id`) REFERENCES `fournisseurs` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_da_cat`   FOREIGN KEY (`categorie_id`)   REFERENCES `categories`   (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Demandes d approvisionnement B2B';

-- TABLE : devis
CREATE TABLE IF NOT EXISTS `devis` (
  `id`                  INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  `reference`           VARCHAR(30)   NOT NULL UNIQUE,
  `demande_id`          INT UNSIGNED  DEFAULT NULL,
  `fournisseur_id`      INT UNSIGNED  NOT NULL,
  `entreprise_id`       INT UNSIGNED  NOT NULL,
  `description`         TEXT          NOT NULL,
  `montant_total`       DECIMAL(12,2) NOT NULL,
  `devise`              VARCHAR(10)   NOT NULL DEFAULT 'CDF',
  `delai_livraison`     VARCHAR(100)  DEFAULT NULL,
  `conditions`          TEXT          DEFAULT NULL,
  `validite_jours`      TINYINT UNSIGNED NOT NULL DEFAULT 30,
  `statut`              ENUM('envoye','accepte','refuse','expire') NOT NULL DEFAULT 'envoye',
  `created_at`          DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`          DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_fournisseur` (`fournisseur_id`),
  KEY `idx_entreprise`  (`entreprise_id`),
  KEY `idx_demande`     (`demande_id`),
  CONSTRAINT `fk_devis_fourn` FOREIGN KEY (`fournisseur_id`) REFERENCES `fournisseurs` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_devis_ent`   FOREIGN KEY (`entreprise_id`)  REFERENCES `entreprises`  (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_devis_da`    FOREIGN KEY (`demande_id`)     REFERENCES `demandes_approvisionnement` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Devis proposés par les fournisseurs';

-- TABLE : devis_lignes
CREATE TABLE IF NOT EXISTS `devis_lignes` (
  `id`            INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  `devis_id`      INT UNSIGNED  NOT NULL,
  `designation`   VARCHAR(200)  NOT NULL,
  `quantite`      DECIMAL(10,3) NOT NULL DEFAULT 1.000,
  `unite`         VARCHAR(50)   DEFAULT NULL,
  `prix_unitaire` DECIMAL(12,2) NOT NULL,
  `montant`       DECIMAL(12,2) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_devis` (`devis_id`),
  CONSTRAINT `fk_dl_devis` FOREIGN KEY (`devis_id`) REFERENCES `devis` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Lignes de détail des devis';

-- ============================================================
-- MODULE 4 : STORE (Produits & Boutiques)
-- ============================================================

-- TABLE : produits
CREATE TABLE IF NOT EXISTS `produits` (
  `id`                INT UNSIGNED    NOT NULL AUTO_INCREMENT,
  `vendeur_id`        INT UNSIGNED    DEFAULT NULL COMMENT 'Si vendeur individuel',
  `entreprise_id`     INT UNSIGNED    DEFAULT NULL COMMENT 'Si entreprise',
  `fournisseur_id`    INT UNSIGNED    DEFAULT NULL COMMENT 'Si fournisseur B2B',
  `categorie_id`      INT UNSIGNED    DEFAULT NULL,
  `sous_categorie_id` INT UNSIGNED    DEFAULT NULL,
  `nom`               VARCHAR(200)    NOT NULL,
  `slug`              VARCHAR(220)    NOT NULL UNIQUE,
  `description`       TEXT            DEFAULT NULL,
  `description_courte` VARCHAR(500)   DEFAULT NULL,
  `prix`              DECIMAL(12,2)   DEFAULT NULL,
  `prix_ancien`       DECIMAL(12,2)   DEFAULT NULL COMMENT 'Prix barré',
  `prix_promo`        DECIMAL(12,2)   DEFAULT NULL,
  `devise`            VARCHAR(10)     NOT NULL DEFAULT 'CDF',
  `unite`             VARCHAR(50)     DEFAULT NULL,
  `stock`             INT             DEFAULT NULL COMMENT 'NULL = illimité',
  `stock_alerte`      INT             DEFAULT NULL COMMENT 'Seuil alerte stock bas',
  `sku`               VARCHAR(100)    DEFAULT NULL UNIQUE COMMENT 'Code produit',
  `poids`             DECIMAL(8,3)    DEFAULT NULL COMMENT 'En kg',
  `dimensions`        VARCHAR(100)    DEFAULT NULL COMMENT 'L x l x H en cm',
  `photo_principale`  VARCHAR(255)    DEFAULT NULL,
  `type_produit`      ENUM('physique','numerique','service') NOT NULL DEFAULT 'physique',
  `statut`            ENUM('actif','brouillon','en_attente','archive','refuse') NOT NULL DEFAULT 'brouillon',
  `disponible`        TINYINT(1)      NOT NULL DEFAULT 1,
  `mise_en_avant`     TINYINT(1)      NOT NULL DEFAULT 0,
  `est_nouveau`       TINYINT(1)      NOT NULL DEFAULT 1,
  `est_populaire`     TINYINT(1)      NOT NULL DEFAULT 0,
  `meilleure_vente`   TINYINT(1)      NOT NULL DEFAULT 0,
  `nb_vues`           INT UNSIGNED    NOT NULL DEFAULT 0,
  `nb_ventes`         INT UNSIGNED    NOT NULL DEFAULT 0,
  `note_moyenne`      DECIMAL(3,2)    NOT NULL DEFAULT 0.00,
  `nb_avis`           INT UNSIGNED    NOT NULL DEFAULT 0,
  `created_at`        DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`        DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_vendeur`       (`vendeur_id`),
  KEY `idx_entreprise`    (`entreprise_id`),
  KEY `idx_fournisseur`   (`fournisseur_id`),
  KEY `idx_categorie`     (`categorie_id`),
  KEY `idx_sous_cat`      (`sous_categorie_id`),
  KEY `idx_statut`        (`statut`),
  KEY `idx_disponible`    (`disponible`),
  KEY `idx_mise_avant`    (`mise_en_avant`),
  KEY `idx_meilleure_vente` (`meilleure_vente`),
  CONSTRAINT `fk_prod_vendeur` FOREIGN KEY (`vendeur_id`)      REFERENCES `profils_vendeurs` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_prod_ent`     FOREIGN KEY (`entreprise_id`)   REFERENCES `entreprises`      (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_prod_fourn`   FOREIGN KEY (`fournisseur_id`)  REFERENCES `fournisseurs`     (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_prod_cat`     FOREIGN KEY (`categorie_id`)    REFERENCES `categories`       (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_prod_sous_cat`FOREIGN KEY (`sous_categorie_id`) REFERENCES `categories`    (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Produits et services publiés sur la plateforme';

-- TABLE : produit_images
CREATE TABLE IF NOT EXISTS `produit_images` (
  `id`          INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  `produit_id`  INT UNSIGNED  NOT NULL,
  `url`         VARCHAR(255)  NOT NULL,
  `legende`     VARCHAR(255)  DEFAULT NULL,
  `ordre`       TINYINT UNSIGNED NOT NULL DEFAULT 0,
  `created_at`  DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_produit` (`produit_id`),
  CONSTRAINT `fk_pi_prod` FOREIGN KEY (`produit_id`) REFERENCES `produits` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Images multiples des produits';

-- TABLE : produit_variantes
CREATE TABLE IF NOT EXISTS `produit_variantes` (
  `id`          INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  `produit_id`  INT UNSIGNED  NOT NULL,
  `nom`         VARCHAR(100)  NOT NULL COMMENT 'Ex: Taille, Couleur',
  `valeur`      VARCHAR(100)  NOT NULL COMMENT 'Ex: XL, Rouge',
  `prix_extra`  DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  `stock`       INT           DEFAULT NULL,
  `sku`         VARCHAR(100)  DEFAULT NULL,
  `actif`       TINYINT(1)    NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`),
  KEY `idx_produit` (`produit_id`),
  CONSTRAINT `fk_pv_prod` FOREIGN KEY (`produit_id`) REFERENCES `produits` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Variantes des produits (taille, couleur, etc.)';

-- TABLE : galeries (photos entreprises)
CREATE TABLE IF NOT EXISTS `galeries` (
  `id`            INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  `entite_type`   ENUM('entreprise','fournisseur','vendeur') NOT NULL,
  `entite_id`     INT UNSIGNED  NOT NULL,
  `url`           VARCHAR(255)  NOT NULL,
  `legende`       VARCHAR(255)  DEFAULT NULL,
  `ordre`         TINYINT UNSIGNED NOT NULL DEFAULT 0,
  `created_at`    DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_entite` (`entite_type`, `entite_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Galeries photos pour entreprises, fournisseurs et vendeurs';

-- TABLE : favoris
CREATE TABLE IF NOT EXISTS `favoris` (
  `id`              INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  `utilisateur_id`  INT UNSIGNED  NOT NULL,
  `entite_type`     ENUM('produit','entreprise','fournisseur') NOT NULL,
  `entite_id`       INT UNSIGNED  NOT NULL,
  `created_at`      DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_favori` (`utilisateur_id`, `entite_type`, `entite_id`),
  KEY `idx_entite` (`entite_type`, `entite_id`),
  CONSTRAINT `fk_fav_user` FOREIGN KEY (`utilisateur_id`) REFERENCES `utilisateurs` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Produits et entreprises mis en favoris';

-- ============================================================
-- MODULE 5 : COMMANDES & PANIER
-- ============================================================

-- TABLE : paniers
CREATE TABLE IF NOT EXISTS `paniers` (
  `id`              INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  `utilisateur_id`  INT UNSIGNED  NOT NULL,
  `session_id`      VARCHAR(128)  DEFAULT NULL COMMENT 'Pour visiteurs non connectés',
  `created_at`      DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`      DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_utilisateur` (`utilisateur_id`),
  CONSTRAINT `fk_panier_user` FOREIGN KEY (`utilisateur_id`) REFERENCES `utilisateurs` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Paniers d achat';

-- TABLE : panier_items
CREATE TABLE IF NOT EXISTS `panier_items` (
  `id`            INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  `panier_id`     INT UNSIGNED  NOT NULL,
  `produit_id`    INT UNSIGNED  NOT NULL,
  `variante_id`   INT UNSIGNED  DEFAULT NULL,
  `quantite`      INT UNSIGNED  NOT NULL DEFAULT 1,
  `prix_unitaire` DECIMAL(12,2) NOT NULL,
  `created_at`    DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_panier`  (`panier_id`),
  KEY `idx_produit` (`produit_id`),
  CONSTRAINT `fk_pi_panier`   FOREIGN KEY (`panier_id`)   REFERENCES `paniers`           (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_pi_produit`  FOREIGN KEY (`produit_id`)  REFERENCES `produits`           (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_pi_variante` FOREIGN KEY (`variante_id`) REFERENCES `produit_variantes`  (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Articles dans les paniers';

-- TABLE : commandes
CREATE TABLE IF NOT EXISTS `commandes` (
  `id`                    INT UNSIGNED    NOT NULL AUTO_INCREMENT,
  `reference`             VARCHAR(30)     NOT NULL UNIQUE,
  `utilisateur_id`        INT UNSIGNED    NOT NULL,
  `vendeur_id`            INT UNSIGNED    DEFAULT NULL,
  `entreprise_id`         INT UNSIGNED    DEFAULT NULL,
  `fournisseur_id`        INT UNSIGNED    DEFAULT NULL,
  `sous_total`            DECIMAL(12,2)   NOT NULL DEFAULT 0.00,
  `frais_livraison`       DECIMAL(12,2)   NOT NULL DEFAULT 0.00,
  `remise`                DECIMAL(12,2)   NOT NULL DEFAULT 0.00,
  `montant_total`         DECIMAL(12,2)   NOT NULL,
  `devise`                VARCHAR(10)     NOT NULL DEFAULT 'CDF',
  `note`                  TEXT            DEFAULT NULL,
  `statut`                ENUM('en_attente','confirmee','en_preparation','expediee','livree','annulee','remboursee') NOT NULL DEFAULT 'en_attente',
  `statut_paiement`       ENUM('non_paye','paye','partiellement_paye','rembourse') NOT NULL DEFAULT 'non_paye',
  `mode_livraison`        ENUM('livraison','retrait_boutique','livraison_express') DEFAULT 'livraison',
  `adresse_livraison`     VARCHAR(255)    DEFAULT NULL,
  `ville_livraison`       VARCHAR(100)    DEFAULT NULL,
  `telephone_livraison`   VARCHAR(30)     DEFAULT NULL,
  `nom_destinataire`      VARCHAR(200)    DEFAULT NULL,
  `code_promo`            VARCHAR(50)     DEFAULT NULL,
  `affilie_id`            INT UNSIGNED    DEFAULT NULL COMMENT 'Affilié ayant apporté la commande',
  `commission_affilie`    DECIMAL(10,2)   DEFAULT NULL,
  `created_at`            DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`            DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_utilisateur`   (`utilisateur_id`),
  KEY `idx_vendeur`       (`vendeur_id`),
  KEY `idx_entreprise`    (`entreprise_id`),
  KEY `idx_fournisseur`   (`fournisseur_id`),
  KEY `idx_statut`        (`statut`),
  KEY `idx_statut_pmt`    (`statut_paiement`),
  KEY `idx_affilie`       (`affilie_id`),
  CONSTRAINT `fk_cmd_user`   FOREIGN KEY (`utilisateur_id`) REFERENCES `utilisateurs`    (`id`) ON DELETE RESTRICT,
  CONSTRAINT `fk_cmd_vend`   FOREIGN KEY (`vendeur_id`)     REFERENCES `profils_vendeurs` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_cmd_ent`    FOREIGN KEY (`entreprise_id`)  REFERENCES `entreprises`      (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_cmd_fourn`  FOREIGN KEY (`fournisseur_id`) REFERENCES `fournisseurs`     (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Commandes passées par les utilisateurs';

-- TABLE : commande_items
CREATE TABLE IF NOT EXISTS `commande_items` (
  `id`              INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  `commande_id`     INT UNSIGNED  NOT NULL,
  `produit_id`      INT UNSIGNED  DEFAULT NULL,
  `variante_id`     INT UNSIGNED  DEFAULT NULL,
  `nom_produit`     VARCHAR(200)  NOT NULL COMMENT 'Snapshot du nom au moment de la commande',
  `quantite`        INT UNSIGNED  NOT NULL DEFAULT 1,
  `prix_unitaire`   DECIMAL(12,2) NOT NULL,
  `montant`         DECIMAL(12,2) NOT NULL,
  `statut`          ENUM('en_attente','confirme','annule') NOT NULL DEFAULT 'en_attente',
  PRIMARY KEY (`id`),
  KEY `idx_commande` (`commande_id`),
  KEY `idx_produit`  (`produit_id`),
  CONSTRAINT `fk_ci_cmd`     FOREIGN KEY (`commande_id`) REFERENCES `commandes`         (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_ci_prod`    FOREIGN KEY (`produit_id`)  REFERENCES `produits`           (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_ci_var`     FOREIGN KEY (`variante_id`) REFERENCES `produit_variantes`  (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Lignes de commande';

-- TABLE : commande_historique
CREATE TABLE IF NOT EXISTS `commande_historique` (
  `id`              INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  `commande_id`     INT UNSIGNED  NOT NULL,
  `statut`          VARCHAR(50)   NOT NULL,
  `commentaire`     TEXT          DEFAULT NULL,
  `modifie_par`     INT UNSIGNED  DEFAULT NULL COMMENT 'ID utilisateur ou admin',
  `created_at`      DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_commande` (`commande_id`),
  CONSTRAINT `fk_ch_cmd` FOREIGN KEY (`commande_id`) REFERENCES `commandes` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Historique des changements de statut des commandes';

-- TABLE : reservations
CREATE TABLE IF NOT EXISTS `reservations` (
  `id`              INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  `reference`       VARCHAR(30)   NOT NULL UNIQUE,
  `utilisateur_id`  INT UNSIGNED  NOT NULL,
  `entreprise_id`   INT UNSIGNED  NOT NULL,
  `produit_id`      INT UNSIGNED  DEFAULT NULL,
  `quantite`        INT UNSIGNED  NOT NULL DEFAULT 1,
  `date_souhaitee`  DATE          DEFAULT NULL,
  `heure_souhaitee` TIME          DEFAULT NULL,
  `note`            TEXT          DEFAULT NULL,
  `statut`          ENUM('en_attente','confirmee','annulee','expiree','terminee') NOT NULL DEFAULT 'en_attente',
  `created_at`      DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`      DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_utilisateur` (`utilisateur_id`),
  KEY `idx_entreprise`  (`entreprise_id`),
  KEY `idx_produit`     (`produit_id`),
  KEY `idx_statut`      (`statut`),
  CONSTRAINT `fk_res_user` FOREIGN KEY (`utilisateur_id`) REFERENCES `utilisateurs` (`id`) ON DELETE RESTRICT,
  CONSTRAINT `fk_res_ent`  FOREIGN KEY (`entreprise_id`)  REFERENCES `entreprises`  (`id`) ON DELETE RESTRICT,
  CONSTRAINT `fk_res_prod` FOREIGN KEY (`produit_id`)     REFERENCES `produits`     (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Réservations de produits ou services';

-- ============================================================
-- MODULE 6 : COMMUNAUTÉ (Publications, Événements, Annonces)
-- ============================================================

-- TABLE : publications
CREATE TABLE IF NOT EXISTS `publications` (
  `id`              INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  `auteur_type`     ENUM('utilisateur','entreprise','fournisseur') NOT NULL DEFAULT 'utilisateur',
  `auteur_id`       INT UNSIGNED  NOT NULL,
  `type`            ENUM('post','annonce','evenement','offre_emploi','promotion','actualite') NOT NULL DEFAULT 'post',
  `titre`           VARCHAR(300)  DEFAULT NULL,
  `contenu`         TEXT          NOT NULL,
  `image`           VARCHAR(255)  DEFAULT NULL,
  `lien`            VARCHAR(255)  DEFAULT NULL,
  `categorie_id`    INT UNSIGNED  DEFAULT NULL,
  `ville_id`        INT UNSIGNED  DEFAULT NULL,
  `statut`          ENUM('publie','brouillon','archive','signale','masque') NOT NULL DEFAULT 'publie',
  `nb_vues`         INT UNSIGNED  NOT NULL DEFAULT 0,
  `nb_likes`        INT UNSIGNED  NOT NULL DEFAULT 0,
  `nb_commentaires` INT UNSIGNED  NOT NULL DEFAULT 0,
  `nb_partages`     INT UNSIGNED  NOT NULL DEFAULT 0,
  `created_at`      DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`      DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_auteur`    (`auteur_type`, `auteur_id`),
  KEY `idx_type`      (`type`),
  KEY `idx_statut`    (`statut`),
  KEY `idx_categorie` (`categorie_id`),
  KEY `idx_ville`     (`ville_id`),
  CONSTRAINT `fk_pub_cat`  FOREIGN KEY (`categorie_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_pub_ville`FOREIGN KEY (`ville_id`)     REFERENCES `villes`     (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Publications communautaires (posts, annonces, événements)';

-- TABLE : publication_images
CREATE TABLE IF NOT EXISTS `publication_images` (
  `id`              INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  `publication_id`  INT UNSIGNED  NOT NULL,
  `url`             VARCHAR(255)  NOT NULL,
  `ordre`           TINYINT UNSIGNED NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `idx_publication` (`publication_id`),
  CONSTRAINT `fk_pubimg_pub` FOREIGN KEY (`publication_id`) REFERENCES `publications` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Images attachées aux publications';

-- TABLE : commentaires
CREATE TABLE IF NOT EXISTS `commentaires` (
  `id`              INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  `publication_id`  INT UNSIGNED  NOT NULL,
  `parent_id`       INT UNSIGNED  DEFAULT NULL COMMENT 'Pour les réponses',
  `auteur_type`     ENUM('utilisateur','entreprise') NOT NULL DEFAULT 'utilisateur',
  `auteur_id`       INT UNSIGNED  NOT NULL,
  `contenu`         TEXT          NOT NULL,
  `statut`          ENUM('publie','masque','signale') NOT NULL DEFAULT 'publie',
  `nb_likes`        INT UNSIGNED  NOT NULL DEFAULT 0,
  `created_at`      DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`      DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_publication` (`publication_id`),
  KEY `idx_parent`      (`parent_id`),
  KEY `idx_auteur`      (`auteur_type`, `auteur_id`),
  CONSTRAINT `fk_com_pub`    FOREIGN KEY (`publication_id`) REFERENCES `publications` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_com_parent` FOREIGN KEY (`parent_id`)      REFERENCES `commentaires` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Commentaires sur les publications';

-- TABLE : reactions
CREATE TABLE IF NOT EXISTS `reactions` (
  `id`              INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  `entite_type`     ENUM('publication','commentaire') NOT NULL,
  `entite_id`       INT UNSIGNED  NOT NULL,
  `utilisateur_id`  INT UNSIGNED  NOT NULL,
  `type`            ENUM('like','love','haha','wow','triste','colere') NOT NULL DEFAULT 'like',
  `created_at`      DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_reaction` (`entite_type`, `entite_id`, `utilisateur_id`),
  KEY `idx_entite`      (`entite_type`, `entite_id`),
  KEY `idx_utilisateur` (`utilisateur_id`),
  CONSTRAINT `fk_react_user` FOREIGN KEY (`utilisateur_id`) REFERENCES `utilisateurs` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Réactions (likes, etc.) sur publications et commentaires';

-- TABLE : evenements
CREATE TABLE IF NOT EXISTS `evenements` (
  `id`              INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  `publication_id`  INT UNSIGNED  DEFAULT NULL,
  `organisateur_type` ENUM('utilisateur','entreprise') NOT NULL DEFAULT 'entreprise',
  `organisateur_id` INT UNSIGNED  NOT NULL,
  `titre`           VARCHAR(300)  NOT NULL,
  `description`     TEXT          DEFAULT NULL,
  `image`           VARCHAR(255)  DEFAULT NULL,
  `lieu`            VARCHAR(255)  DEFAULT NULL,
  `ville_id`        INT UNSIGNED  DEFAULT NULL,
  `date_debut`      DATETIME      NOT NULL,
  `date_fin`        DATETIME      DEFAULT NULL,
  `lien_inscription` VARCHAR(255) DEFAULT NULL,
  `prix_entree`     DECIMAL(10,2) DEFAULT NULL,
  `devise`          VARCHAR(10)   NOT NULL DEFAULT 'CDF',
  `capacite_max`    INT UNSIGNED  DEFAULT NULL,
  `nb_inscrits`     INT UNSIGNED  NOT NULL DEFAULT 0,
  `statut`          ENUM('a_venir','en_cours','termine','annule') NOT NULL DEFAULT 'a_venir',
  `created_at`      DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_organisateur` (`organisateur_type`, `organisateur_id`),
  KEY `idx_date_debut`   (`date_debut`),
  KEY `idx_statut`       (`statut`),
  CONSTRAINT `fk_evt_pub`  FOREIGN KEY (`publication_id`) REFERENCES `publications` (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_evt_ville`FOREIGN KEY (`ville_id`)       REFERENCES `villes`       (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Événements organisés sur la plateforme';

-- TABLE : signalements
CREATE TABLE IF NOT EXISTS `signalements` (
  `id`              INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  `signaleur_id`    INT UNSIGNED  NOT NULL,
  `entite_type`     ENUM('publication','commentaire','produit','entreprise','utilisateur','message') NOT NULL,
  `entite_id`       INT UNSIGNED  NOT NULL,
  `motif`           ENUM('spam','contenu_inapproprie','fausse_information','arnaque','autre') NOT NULL,
  `description`     TEXT          DEFAULT NULL,
  `statut`          ENUM('en_attente','traite','rejete') NOT NULL DEFAULT 'en_attente',
  `traite_par`      INT UNSIGNED  DEFAULT NULL COMMENT 'ID admin',
  `traite_at`       DATETIME      DEFAULT NULL,
  `created_at`      DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_signaleur` (`signaleur_id`),
  KEY `idx_entite`    (`entite_type`, `entite_id`),
  KEY `idx_statut`    (`statut`),
  CONSTRAINT `fk_sig_user` FOREIGN KEY (`signaleur_id`) REFERENCES `utilisateurs` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Signalements de contenus inappropriés';

-- ============================================================
-- MODULE 7 : EMPLOI & RECRUTEMENT
-- ============================================================

-- TABLE : offres_emploi
CREATE TABLE IF NOT EXISTS `offres_emploi` (
  `id`              INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  `entreprise_id`   INT UNSIGNED  NOT NULL,
  `titre`           VARCHAR(300)  NOT NULL,
  `description`     TEXT          NOT NULL,
  `type_contrat`    ENUM('cdi','cdd','stage','freelance','temps_partiel','autre') NOT NULL DEFAULT 'cdi',
  `categorie_id`    INT UNSIGNED  DEFAULT NULL,
  `ville_id`        INT UNSIGNED  DEFAULT NULL,
  `salaire_min`     DECIMAL(12,2) DEFAULT NULL,
  `salaire_max`     DECIMAL(12,2) DEFAULT NULL,
  `devise`          VARCHAR(10)   NOT NULL DEFAULT 'CDF',
  `experience`      VARCHAR(100)  DEFAULT NULL COMMENT 'Ex: 2-5 ans',
  `niveau_etude`    VARCHAR(100)  DEFAULT NULL,
  `competences`     TEXT          DEFAULT NULL COMMENT 'JSON ou texte libre',
  `date_limite`     DATE          DEFAULT NULL,
  `nb_postes`       TINYINT UNSIGNED NOT NULL DEFAULT 1,
  `nb_candidatures` INT UNSIGNED  NOT NULL DEFAULT 0,
  `statut`          ENUM('actif','expire','ferme','brouillon') NOT NULL DEFAULT 'actif',
  `created_at`      DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`      DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_entreprise` (`entreprise_id`),
  KEY `idx_categorie`  (`categorie_id`),
  KEY `idx_ville`      (`ville_id`),
  KEY `idx_statut`     (`statut`),
  CONSTRAINT `fk_oe_ent`  FOREIGN KEY (`entreprise_id`) REFERENCES `entreprises` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_oe_cat`  FOREIGN KEY (`categorie_id`)  REFERENCES `categories`  (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_oe_ville`FOREIGN KEY (`ville_id`)      REFERENCES `villes`      (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Offres d emploi publiées par les entreprises';

-- TABLE : candidatures
CREATE TABLE IF NOT EXISTS `candidatures` (
  `id`              INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  `offre_id`        INT UNSIGNED  NOT NULL,
  `utilisateur_id`  INT UNSIGNED  NOT NULL,
  `lettre_motivation` TEXT        DEFAULT NULL,
  `cv_url`          VARCHAR(255)  DEFAULT NULL,
  `statut`          ENUM('envoyee','vue','retenue','refusee','entretien') NOT NULL DEFAULT 'envoyee',
  `note_recruteur`  TEXT          DEFAULT NULL,
  `created_at`      DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`      DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_candidature` (`offre_id`, `utilisateur_id`),
  KEY `idx_utilisateur` (`utilisateur_id`),
  KEY `idx_statut`      (`statut`),
  CONSTRAINT `fk_cand_offre` FOREIGN KEY (`offre_id`)       REFERENCES `offres_emploi` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_cand_user`  FOREIGN KEY (`utilisateur_id`) REFERENCES `utilisateurs`  (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Candidatures aux offres d emploi';

-- ============================================================
-- MODULE 8 : MESSAGERIE
-- ============================================================

-- TABLE : conversations
CREATE TABLE IF NOT EXISTS `conversations` (
  `id`                INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  `type`              ENUM('utilisateur_entreprise','utilisateur_vendeur','utilisateur_fournisseur','support','admin') NOT NULL DEFAULT 'utilisateur_entreprise',
  `participant1_type` ENUM('utilisateur','entreprise','vendeur','fournisseur','admin') NOT NULL,
  `participant1_id`   INT UNSIGNED  NOT NULL,
  `participant2_type` ENUM('utilisateur','entreprise','vendeur','fournisseur','admin') NOT NULL,
  `participant2_id`   INT UNSIGNED  NOT NULL,
  `sujet`             VARCHAR(255)  DEFAULT NULL,
  `dernier_message`   TEXT          DEFAULT NULL,
  `dernier_msg_at`    DATETIME      DEFAULT NULL,
  `nb_non_lus_p1`     SMALLINT UNSIGNED NOT NULL DEFAULT 0,
  `nb_non_lus_p2`     SMALLINT UNSIGNED NOT NULL DEFAULT 0,
  `statut`            ENUM('actif','archive','bloque') NOT NULL DEFAULT 'actif',
  `created_at`        DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`        DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_p1` (`participant1_type`, `participant1_id`),
  KEY `idx_p2` (`participant2_type`, `participant2_id`),
  KEY `idx_statut` (`statut`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Conversations entre utilisateurs et entités';

-- TABLE : messages
CREATE TABLE IF NOT EXISTS `messages` (
  `id`              INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  `conversation_id` INT UNSIGNED  NOT NULL,
  `expediteur_type` ENUM('utilisateur','entreprise','vendeur','fournisseur','admin') NOT NULL,
  `expediteur_id`   INT UNSIGNED  NOT NULL,
  `contenu`         TEXT          NOT NULL,
  `type_message`    ENUM('texte','image','fichier','audio','systeme') NOT NULL DEFAULT 'texte',
  `piece_jointe`    VARCHAR(255)  DEFAULT NULL,
  `lu`              TINYINT(1)    NOT NULL DEFAULT 0,
  `lu_at`           DATETIME      DEFAULT NULL,
  `created_at`      DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_conversation` (`conversation_id`),
  KEY `idx_expediteur`   (`expediteur_type`, `expediteur_id`),
  KEY `idx_lu`           (`lu`),
  CONSTRAINT `fk_msg_conv` FOREIGN KEY (`conversation_id`) REFERENCES `conversations` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Messages dans les conversations';

-- TABLE : tickets_support
CREATE TABLE IF NOT EXISTS `tickets_support` (
  `id`              INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  `reference`       VARCHAR(20)   NOT NULL UNIQUE,
  `utilisateur_id`  INT UNSIGNED  NOT NULL,
  `sujet`           VARCHAR(255)  NOT NULL,
  `description`     TEXT          NOT NULL,
  `categorie`       ENUM('commande','paiement','compte','produit','technique','autre') NOT NULL DEFAULT 'autre',
  `priorite`        ENUM('basse','normale','haute','urgente') NOT NULL DEFAULT 'normale',
  `statut`          ENUM('ouvert','en_cours','resolu','ferme') NOT NULL DEFAULT 'ouvert',
  `assigne_a`       INT UNSIGNED  DEFAULT NULL COMMENT 'ID admin assigné',
  `created_at`      DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`      DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_utilisateur` (`utilisateur_id`),
  KEY `idx_statut`      (`statut`),
  KEY `idx_priorite`    (`priorite`),
  CONSTRAINT `fk_ticket_user` FOREIGN KEY (`utilisateur_id`) REFERENCES `utilisateurs` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Tickets de support client';

-- TABLE : ticket_reponses
CREATE TABLE IF NOT EXISTS `ticket_reponses` (
  `id`          INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  `ticket_id`   INT UNSIGNED  NOT NULL,
  `auteur_id`   INT UNSIGNED  NOT NULL,
  `auteur_type` ENUM('utilisateur','admin') NOT NULL DEFAULT 'admin',
  `contenu`     TEXT          NOT NULL,
  `created_at`  DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_ticket` (`ticket_id`),
  CONSTRAINT `fk_tr_ticket` FOREIGN KEY (`ticket_id`) REFERENCES `tickets_support` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Réponses aux tickets de support';

-- ============================================================
-- MODULE 9 : AVIS & NOTES
-- ============================================================

-- TABLE : avis
CREATE TABLE IF NOT EXISTS `avis` (
  `id`              INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  `utilisateur_id`  INT UNSIGNED  NOT NULL,
  `entite_type`     ENUM('entreprise','produit','vendeur','fournisseur') NOT NULL,
  `entite_id`       INT UNSIGNED  NOT NULL,
  `commande_id`     INT UNSIGNED  DEFAULT NULL COMMENT 'Avis lié à une commande',
  `note`            TINYINT UNSIGNED NOT NULL DEFAULT 5,
  `titre`           VARCHAR(200)  DEFAULT NULL,
  `commentaire`     TEXT          DEFAULT NULL,
  `images`          TEXT          DEFAULT NULL COMMENT 'JSON array d URLs',
  `statut`          ENUM('publie','en_attente','rejete','masque') NOT NULL DEFAULT 'en_attente',
  `reponse`         TEXT          DEFAULT NULL COMMENT 'Réponse du vendeur/entreprise',
  `reponse_at`      DATETIME      DEFAULT NULL,
  `created_at`      DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`      DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_utilisateur` (`utilisateur_id`),
  KEY `idx_entite`      (`entite_type`, `entite_id`),
  KEY `idx_statut`      (`statut`),
  KEY `idx_commande`    (`commande_id`),
  CONSTRAINT `fk_avis_user` FOREIGN KEY (`utilisateur_id`) REFERENCES `utilisateurs` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_avis_cmd`  FOREIGN KEY (`commande_id`)    REFERENCES `commandes`    (`id`) ON DELETE SET NULL,
  CONSTRAINT `chk_note` CHECK (`note` BETWEEN 1 AND 5)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Avis et notes sur entreprises, produits, vendeurs, fournisseurs';

-- ============================================================
-- MODULE 10 : PROMOTIONS & PUBLICITÉS
-- ============================================================

-- TABLE : promotions
CREATE TABLE IF NOT EXISTS `promotions` (
  `id`              INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  `nom`             VARCHAR(200)  NOT NULL,
  `description`     TEXT          DEFAULT NULL,
  `type`            ENUM('pourcentage','montant_fixe','livraison_gratuite','code_promo','flash') NOT NULL DEFAULT 'pourcentage',
  `valeur`          DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  `code`            VARCHAR(50)   DEFAULT NULL UNIQUE COMMENT 'Code promo',
  `date_debut`      DATETIME      NOT NULL,
  `date_fin`        DATETIME      NOT NULL,
  `usage_max`       INT UNSIGNED  DEFAULT NULL COMMENT 'Nombre max d utilisations',
  `usage_actuel`    INT UNSIGNED  NOT NULL DEFAULT 0,
  `montant_min`     DECIMAL(12,2) DEFAULT NULL COMMENT 'Montant minimum de commande',
  `applicable_a`    ENUM('tous','categorie','produit','entreprise','vendeur') NOT NULL DEFAULT 'tous',
  `entite_id`       INT UNSIGNED  DEFAULT NULL COMMENT 'ID de l entité ciblée',
  `actif`           TINYINT(1)    NOT NULL DEFAULT 1,
  `cree_par`        INT UNSIGNED  DEFAULT NULL COMMENT 'ID admin ou vendeur',
  `created_at`      DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`      DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_code`       (`code`),
  KEY `idx_date_debut` (`date_debut`),
  KEY `idx_date_fin`   (`date_fin`),
  KEY `idx_actif`      (`actif`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Promotions et codes promo';

-- TABLE : promotion_produits
CREATE TABLE IF NOT EXISTS `promotion_produits` (
  `promotion_id` INT UNSIGNED NOT NULL,
  `produit_id`   INT UNSIGNED NOT NULL,
  PRIMARY KEY (`promotion_id`, `produit_id`),
  CONSTRAINT `fk_pp_promo` FOREIGN KEY (`promotion_id`) REFERENCES `promotions` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_pp_prod`  FOREIGN KEY (`produit_id`)   REFERENCES `produits`   (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Produits inclus dans une promotion';

-- TABLE : publicites
CREATE TABLE IF NOT EXISTS `publicites` (
  `id`            INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  `titre`         VARCHAR(200)  NOT NULL,
  `type`          ENUM('image','video','texte','banniere') NOT NULL DEFAULT 'image',
  `position`      ENUM('hero','sidebar','header','footer','entre_produits','popup') NOT NULL DEFAULT 'hero',
  `media_url`     VARCHAR(255)  DEFAULT NULL COMMENT 'URL image ou vidéo',
  `lien`          VARCHAR(255)  DEFAULT NULL COMMENT 'URL de redirection',
  `annonceur_type` ENUM('admin','entreprise','vendeur') NOT NULL DEFAULT 'admin',
  `annonceur_id`  INT UNSIGNED  DEFAULT NULL,
  `date_debut`    DATETIME      NOT NULL,
  `date_fin`      DATETIME      NOT NULL,
  `nb_clics`      INT UNSIGNED  NOT NULL DEFAULT 0,
  `nb_impressions` INT UNSIGNED NOT NULL DEFAULT 0,
  `budget`        DECIMAL(12,2) DEFAULT NULL,
  `cout_par_clic` DECIMAL(8,4)  DEFAULT NULL,
  `actif`         TINYINT(1)    NOT NULL DEFAULT 1,
  `created_at`    DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`    DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_position`   (`position`),
  KEY `idx_date_debut` (`date_debut`),
  KEY `idx_date_fin`   (`date_fin`),
  KEY `idx_actif`      (`actif`),
  KEY `idx_annonceur`  (`annonceur_type`, `annonceur_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Publicités et bannières de la plateforme';

-- ============================================================
-- MODULE 11 : AFFILIATION
-- ============================================================

-- TABLE : profils_affilies
CREATE TABLE IF NOT EXISTS `profils_affilies` (
  `id`                  INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  `utilisateur_id`      INT UNSIGNED  NOT NULL UNIQUE,
  `code_parrainage`     VARCHAR(20)   NOT NULL UNIQUE,
  `lien_parrainage`     VARCHAR(500)  DEFAULT NULL,
  `taux_commission`     DECIMAL(5,2)  NOT NULL DEFAULT 5.00 COMMENT 'Pourcentage',
  `solde_disponible`    DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  `solde_en_attente`    DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  `total_gagné`         DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  `total_retire`        DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  `nb_filleuls`         INT UNSIGNED  NOT NULL DEFAULT 0,
  `nb_conversions`      INT UNSIGNED  NOT NULL DEFAULT 0,
  `statut`              ENUM('actif','suspendu','inactif') NOT NULL DEFAULT 'actif',
  `created_at`          DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`          DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_utilisateur`   (`utilisateur_id`),
  KEY `idx_code`          (`code_parrainage`),
  CONSTRAINT `fk_aff_user` FOREIGN KEY (`utilisateur_id`) REFERENCES `utilisateurs` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Profils des affiliés';

-- TABLE : parrainages
CREATE TABLE IF NOT EXISTS `parrainages` (
  `id`              INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  `affilie_id`      INT UNSIGNED  NOT NULL COMMENT 'Profil affilié parrain',
  `filleul_id`      INT UNSIGNED  NOT NULL COMMENT 'Utilisateur parrainé',
  `statut`          ENUM('inscrit','actif','converti') NOT NULL DEFAULT 'inscrit',
  `created_at`      DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_parrainage` (`affilie_id`, `filleul_id`),
  KEY `idx_filleul` (`filleul_id`),
  CONSTRAINT `fk_par_aff`     FOREIGN KEY (`affilie_id`) REFERENCES `profils_affilies` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_par_filleul` FOREIGN KEY (`filleul_id`) REFERENCES `utilisateurs`     (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Liens de parrainage entre affiliés et filleuls';

-- TABLE : commissions_affiliation
CREATE TABLE IF NOT EXISTS `commissions_affiliation` (
  `id`              INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  `affilie_id`      INT UNSIGNED  NOT NULL,
  `commande_id`     INT UNSIGNED  DEFAULT NULL,
  `filleul_id`      INT UNSIGNED  NOT NULL,
  `montant_commande` DECIMAL(12,2) NOT NULL,
  `taux`            DECIMAL(5,2)  NOT NULL,
  `montant_commission` DECIMAL(12,2) NOT NULL,
  `devise`          VARCHAR(10)   NOT NULL DEFAULT 'CDF',
  `statut`          ENUM('en_attente','validee','payee','annulee') NOT NULL DEFAULT 'en_attente',
  `created_at`      DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`      DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_affilie`  (`affilie_id`),
  KEY `idx_commande` (`commande_id`),
  KEY `idx_filleul`  (`filleul_id`),
  KEY `idx_statut`   (`statut`),
  CONSTRAINT `fk_ca_aff`  FOREIGN KEY (`affilie_id`) REFERENCES `profils_affilies` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_ca_cmd`  FOREIGN KEY (`commande_id`) REFERENCES `commandes`       (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_ca_fil`  FOREIGN KEY (`filleul_id`)  REFERENCES `utilisateurs`    (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Commissions générées par les affiliés';

-- TABLE : demandes_retrait
CREATE TABLE IF NOT EXISTS `demandes_retrait` (
  `id`              INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  `affilie_id`      INT UNSIGNED  NOT NULL,
  `montant`         DECIMAL(12,2) NOT NULL,
  `devise`          VARCHAR(10)   NOT NULL DEFAULT 'CDF',
  `methode`         ENUM('mobile_money','virement','cash','autre') NOT NULL DEFAULT 'mobile_money',
  `details_paiement` TEXT         DEFAULT NULL COMMENT 'JSON: numéro, banque, etc.',
  `statut`          ENUM('en_attente','approuvee','payee','refusee') NOT NULL DEFAULT 'en_attente',
  `note_admin`      TEXT          DEFAULT NULL,
  `traite_par`      INT UNSIGNED  DEFAULT NULL,
  `traite_at`       DATETIME      DEFAULT NULL,
  `created_at`      DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_affilie` (`affilie_id`),
  KEY `idx_statut`  (`statut`),
  CONSTRAINT `fk_dr_aff` FOREIGN KEY (`affilie_id`) REFERENCES `profils_affilies` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Demandes de retrait des commissions affiliés';

-- ============================================================
-- MODULE 12 : PAIEMENTS & TRANSACTIONS
-- ============================================================

-- TABLE : transactions
CREATE TABLE IF NOT EXISTS `transactions` (
  `id`              INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  `reference`       VARCHAR(50)   NOT NULL UNIQUE,
  `type`            ENUM('paiement_commande','remboursement','commission','retrait','depot','frais') NOT NULL,
  `statut`          ENUM('en_attente','reussi','echoue','annule','rembourse') NOT NULL DEFAULT 'en_attente',
  `montant`         DECIMAL(12,2) NOT NULL,
  `devise`          VARCHAR(10)   NOT NULL DEFAULT 'CDF',
  `payeur_type`     ENUM('utilisateur','entreprise','vendeur','fournisseur','admin') NOT NULL,
  `payeur_id`       INT UNSIGNED  NOT NULL,
  `beneficiaire_type` ENUM('utilisateur','entreprise','vendeur','fournisseur','plateforme') DEFAULT NULL,
  `beneficiaire_id` INT UNSIGNED  DEFAULT NULL,
  `commande_id`     INT UNSIGNED  DEFAULT NULL,
  `methode_paiement` ENUM('mobile_money','carte_bancaire','virement','cash','portefeuille','autre') NOT NULL DEFAULT 'mobile_money',
  `reference_externe` VARCHAR(200) DEFAULT NULL COMMENT 'Référence opérateur (MTN, Airtel, etc.)',
  `description`     TEXT          DEFAULT NULL,
  `metadata`        JSON          DEFAULT NULL COMMENT 'Données supplémentaires',
  `created_at`      DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`      DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_type`       (`type`),
  KEY `idx_statut`     (`statut`),
  KEY `idx_payeur`     (`payeur_type`, `payeur_id`),
  KEY `idx_commande`   (`commande_id`),
  KEY `idx_created`    (`created_at`),
  CONSTRAINT `fk_trans_cmd` FOREIGN KEY (`commande_id`) REFERENCES `commandes` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Toutes les transactions financières de la plateforme';

-- TABLE : portefeuilles
CREATE TABLE IF NOT EXISTS `portefeuilles` (
  `id`              INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  `proprietaire_type` ENUM('utilisateur','entreprise','vendeur','fournisseur') NOT NULL,
  `proprietaire_id` INT UNSIGNED  NOT NULL,
  `solde`           DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  `solde_bloque`    DECIMAL(12,2) NOT NULL DEFAULT 0.00,
  `devise`          VARCHAR(10)   NOT NULL DEFAULT 'CDF',
  `created_at`      DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`      DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_portefeuille` (`proprietaire_type`, `proprietaire_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Portefeuilles virtuels des utilisateurs et entités';

-- ============================================================
-- MODULE 13 : NOTIFICATIONS
-- ============================================================

-- TABLE : notifications
CREATE TABLE IF NOT EXISTS `notifications` (
  `id`                  INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  `destinataire_type`   ENUM('utilisateur','entreprise','vendeur','fournisseur','admin') NOT NULL,
  `destinataire_id`     INT UNSIGNED  NOT NULL,
  `type`                ENUM(
                          'nouveau_message',
                          'nouveau_follower',
                          'nouvelle_commande',
                          'statut_commande',
                          'nouvelle_reservation',
                          'statut_reservation',
                          'nouvel_avis',
                          'produit_approuve',
                          'produit_refuse',
                          'entreprise_verifiee',
                          'entreprise_refusee',
                          'nouveau_devis',
                          'devis_accepte',
                          'devis_refuse',
                          'nouvelle_candidature',
                          'candidature_retenue',
                          'commission_gagnee',
                          'retrait_approuve',
                          'retrait_refuse',
                          'paiement_recu',
                          'paiement_echoue',
                          'nouveau_signalement',
                          'alerte_stock',
                          'alerte_systeme',
                          'annonce_admin'
                        ) NOT NULL,
  `titre`               VARCHAR(200)  NOT NULL,
  `contenu`             TEXT          DEFAULT NULL,
  `lien`                VARCHAR(255)  DEFAULT NULL,
  `entite_type`         VARCHAR(50)   DEFAULT NULL,
  `entite_id`           INT UNSIGNED  DEFAULT NULL,
  `lu`                  TINYINT(1)    NOT NULL DEFAULT 0,
  `lu_at`               DATETIME      DEFAULT NULL,
  `created_at`          DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_destinataire` (`destinataire_type`, `destinataire_id`),
  KEY `idx_type`         (`type`),
  KEY `idx_lu`           (`lu`),
  KEY `idx_created`      (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Notifications en temps réel pour tous les acteurs';

-- ============================================================
-- MODULE 14 : ADMINISTRATION
-- ============================================================

-- TABLE : admins
CREATE TABLE IF NOT EXISTS `admins` (
  `id`              INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  `utilisateur_id`  INT UNSIGNED  NOT NULL UNIQUE,
  `niveau`          ENUM('super_admin','admin','moderateur','support','comptable') NOT NULL DEFAULT 'moderateur',
  `permissions`     JSON          DEFAULT NULL COMMENT 'Permissions spécifiques',
  `actif`           TINYINT(1)    NOT NULL DEFAULT 1,
  `created_at`      DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_utilisateur` (`utilisateur_id`),
  CONSTRAINT `fk_admin_user` FOREIGN KEY (`utilisateur_id`) REFERENCES `utilisateurs` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Profils administrateurs avec niveaux de permission';

-- TABLE : logs_activite
CREATE TABLE IF NOT EXISTS `logs_activite` (
  `id`              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `acteur_type`     ENUM('utilisateur','admin','systeme') NOT NULL DEFAULT 'utilisateur',
  `acteur_id`       INT UNSIGNED  DEFAULT NULL,
  `action`          VARCHAR(100)  NOT NULL COMMENT 'Ex: connexion, modification_produit',
  `entite_type`     VARCHAR(80)   DEFAULT NULL COMMENT 'Table concernée',
  `entite_id`       INT UNSIGNED  DEFAULT NULL,
  `description`     TEXT          DEFAULT NULL,
  `donnees_avant`   JSON          DEFAULT NULL COMMENT 'État avant modification',
  `donnees_apres`   JSON          DEFAULT NULL COMMENT 'État après modification',
  `ip_address`      VARCHAR(45)   DEFAULT NULL,
  `user_agent`      VARCHAR(500)  DEFAULT NULL,
  `created_at`      DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_acteur`    (`acteur_type`, `acteur_id`),
  KEY `idx_action`    (`action`),
  KEY `idx_entite`    (`entite_type`, `entite_id`),
  KEY `idx_created`   (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Journal d activité complet (audit trail)';

-- TABLE : annonces_admin
CREATE TABLE IF NOT EXISTS `annonces_admin` (
  `id`              INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  `titre`           VARCHAR(300)  NOT NULL,
  `contenu`         TEXT          NOT NULL,
  `type`            ENUM('info','avertissement','maintenance','promotion','urgence') NOT NULL DEFAULT 'info',
  `cible`           ENUM('tous','membres','vendeurs','entreprises','fournisseurs','affilies') NOT NULL DEFAULT 'tous',
  `actif`           TINYINT(1)    NOT NULL DEFAULT 1,
  `date_debut`      DATETIME      DEFAULT NULL,
  `date_fin`        DATETIME      DEFAULT NULL,
  `cree_par`        INT UNSIGNED  NOT NULL,
  `created_at`      DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_type`   (`type`),
  KEY `idx_cible`  (`cible`),
  KEY `idx_actif`  (`actif`),
  CONSTRAINT `fk_ann_admin` FOREIGN KEY (`cree_par`) REFERENCES `utilisateurs` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Annonces et messages diffusés par les administrateurs';

-- ============================================================
-- MODULE 15 : STATISTIQUES & ANALYTICS
-- ============================================================

-- TABLE : stats_journalieres
CREATE TABLE IF NOT EXISTS `stats_journalieres` (
  `id`                  INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  `date`                DATE          NOT NULL UNIQUE,
  `nb_visiteurs`        INT UNSIGNED  NOT NULL DEFAULT 0,
  `nb_inscriptions`     INT UNSIGNED  NOT NULL DEFAULT 0,
  `nb_commandes`        INT UNSIGNED  NOT NULL DEFAULT 0,
  `montant_commandes`   DECIMAL(14,2) NOT NULL DEFAULT 0.00,
  `nb_produits_ajoutes` INT UNSIGNED  NOT NULL DEFAULT 0,
  `nb_messages`         INT UNSIGNED  NOT NULL DEFAULT 0,
  `nb_avis`             INT UNSIGNED  NOT NULL DEFAULT 0,
  `nb_publications`     INT UNSIGNED  NOT NULL DEFAULT 0,
  `nb_nouvelles_entreprises` INT UNSIGNED NOT NULL DEFAULT 0,
  `nb_nouveaux_vendeurs` INT UNSIGNED NOT NULL DEFAULT 0,
  `created_at`          DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_date` (`date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Statistiques agrégées par jour';

-- TABLE : vues_pages
CREATE TABLE IF NOT EXISTS `vues_pages` (
  `id`              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `page`            VARCHAR(255)  NOT NULL,
  `entite_type`     VARCHAR(80)   DEFAULT NULL,
  `entite_id`       INT UNSIGNED  DEFAULT NULL,
  `utilisateur_id`  INT UNSIGNED  DEFAULT NULL,
  `session_id`      VARCHAR(128)  DEFAULT NULL,
  `ip_address`      VARCHAR(45)   DEFAULT NULL,
  `referrer`        VARCHAR(500)  DEFAULT NULL,
  `user_agent`      VARCHAR(500)  DEFAULT NULL,
  `created_at`      DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_page`        (`page`),
  KEY `idx_entite`      (`entite_type`, `entite_id`),
  KEY `idx_utilisateur` (`utilisateur_id`),
  KEY `idx_created`     (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Suivi des vues de pages pour analytics';

-- TABLE : recherches
CREATE TABLE IF NOT EXISTS `recherches` (
  `id`              INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  `terme`           VARCHAR(255)  NOT NULL,
  `type`            ENUM('produit','entreprise','fournisseur','emploi','global') NOT NULL DEFAULT 'global',
  `utilisateur_id`  INT UNSIGNED  DEFAULT NULL,
  `nb_resultats`    INT UNSIGNED  NOT NULL DEFAULT 0,
  `created_at`      DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_terme`       (`terme`),
  KEY `idx_type`        (`type`),
  KEY `idx_utilisateur` (`utilisateur_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Historique des recherches pour analytics';

-- ============================================================
-- DONNÉES INITIALES
-- ============================================================

-- Paramètres du site
INSERT INTO `parametres_site` (`cle`, `valeur`, `type`, `groupe`, `description`) VALUES
  ('site_nom',          'EmpireKongo',                    'texte',   'general', 'Nom de la plateforme'),
  ('site_description',  'Écosystème numérique congolais', 'texte',   'general', 'Description courte'),
  ('site_email',        'contact@empirekongo.com',        'email',   'general', 'Email de contact'),
  ('site_telephone',    '+243 000 000 000',               'texte',   'general', 'Téléphone principal'),
  ('site_devise',       'CDF',                            'texte',   'general', 'Devise par défaut'),
  ('site_langue',       'fr',                             'texte',   'general', 'Langue par défaut'),
  ('site_logo',         '/assets/images/app_logo.png',   'image',   'general', 'Logo principal'),
  ('site_pays',         'RDC',                            'texte',   'general', 'Pays principal'),
  ('maintenance_mode',  '0',                              'booleen', 'general', 'Mode maintenance'),
  ('inscription_ouverte','1',                             'booleen', 'general', 'Inscriptions ouvertes'),
  ('taux_commission_plateforme', '5',                     'nombre',  'paiement','Commission plateforme (%)'),
  ('taux_commission_affiliation','5',                     'nombre',  'paiement','Commission affiliation (%)'),
  ('retrait_minimum',   '5000',                           'nombre',  'paiement','Montant minimum de retrait (CDF)'),
  ('smtp_host',         '',                               'texte',   'smtp',    'Serveur SMTP'),
  ('smtp_port',         '587',                            'nombre',  'smtp',    'Port SMTP'),
  ('smtp_user',         '',                               'texte',   'smtp',    'Utilisateur SMTP'),
  ('smtp_password',     '',                               'texte',   'smtp',    'Mot de passe SMTP'),
  ('seo_titre',         'EmpireKongo - Marketplace RDC',  'texte',   'seo',     'Titre SEO'),
  ('seo_description',   'La première marketplace numérique de la RDC', 'texte', 'seo', 'Description SEO'),
  ('seo_mots_cles',     'marketplace, RDC, Congo, commerce, entreprises', 'texte', 'seo', 'Mots-clés SEO');

-- Provinces de la RDC
INSERT INTO `provinces` (`nom`, `code`) VALUES
  ('Kinshasa',          'KIN'),
  ('Kongo-Central',     'KOC'),
  ('Kwango',            'KWA'),
  ('Kwilu',             'KWI'),
  ('Mai-Ndombe',        'MAI'),
  ('Kasaï',             'KAS'),
  ('Kasaï-Central',     'KAC'),
  ('Kasaï-Oriental',    'KAO'),
  ('Lomami',            'LOM'),
  ('Sankuru',           'SAN'),
  ('Maniema',           'MAN'),
  ('Sud-Kivu',          'SUK'),
  ('Nord-Kivu',         'NOK'),
  ('Ituri',             'ITU'),
  ('Haut-Uele',         'HAU'),
  ('Tshopo',            'TSH'),
  ('Bas-Uele',          'BAU'),
  ('Nord-Ubangi',       'NOU'),
  ('Mongala',           'MON'),
  ('Sud-Ubangi',        'SOU'),
  ('Équateur',          'EQU'),
  ('Tshuapa',           'TSU'),
  ('Tanganyika',        'TAN'),
  ('Haut-Lomami',       'HAL'),
  ('Lualaba',           'LUA'),
  ('Haut-Katanga',      'HAK');

-- Villes principales de Kinshasa
INSERT INTO `villes` (`province_id`, `nom`) VALUES
  (1, 'Kinshasa'),
  (1, 'Kinkole'),
  (2, 'Matadi'),
  (2, 'Boma'),
  (2, 'Mbanza-Ngungu'),
  (13, 'Goma'),
  (13, 'Butembo'),
  (12, 'Bukavu'),
  (11, 'Kindu'),
  (26, 'Lubumbashi'),
  (26, 'Likasi'),
  (26, 'Kolwezi'),
  (25, 'Kolwezi'),
  (16, 'Kisangani'),
  (6, 'Tshikapa'),
  (7, 'Kananga'),
  (8, 'Mbuji-Mayi');

-- Catégories principales
INSERT INTO `categories` (`nom`, `slug`, `description`, `ordre`, `actif`) VALUES
  ('Agriculture',          'agriculture',          'Produits agricoles et alimentaires',         1, 1),
  ('Élevage',              'elevage',              'Animaux et produits d élevage',              2, 1),
  ('Artisanat',            'artisanat',            'Produits artisanaux locaux',                 3, 1),
  ('Commerce',             'commerce',             'Commerce général et distribution',           4, 1),
  ('Services',             'services',             'Prestations de services',                    5, 1),
  ('Technologie',          'technologie',          'Informatique, télécoms et tech',             6, 1),
  ('Construction',         'construction',         'Matériaux et services de construction',      7, 1),
  ('Transport',            'transport',            'Transport et logistique',                    8, 1),
  ('Santé',                'sante',                'Santé, pharmacie et bien-être',              9, 1),
  ('Éducation',            'education',            'Formation et enseignement',                 10, 1),
  ('Mode & Vêtements',     'mode-vetements',       'Habillement et accessoires',                11, 1),
  ('Alimentation',         'alimentation',         'Produits alimentaires et boissons',         12, 1),
  ('Électronique',         'electronique',         'Appareils électroniques et accessoires',    13, 1),
  ('Immobilier',           'immobilier',           'Vente et location immobilière',             14, 1),
  ('Énergie',              'energie',              'Énergie solaire, groupes électrogènes',     15, 1),
  ('Beauté & Bien-être',   'beaute-bien-etre',     'Cosmétiques, soins et beauté',              16, 1),
  ('Sport & Loisirs',      'sport-loisirs',        'Articles de sport et loisirs',              17, 1),
  ('Automobile',           'automobile',           'Véhicules, pièces et accessoires',          18, 1),
  ('Finance & Assurance',  'finance-assurance',    'Services financiers et assurances',         19, 1),
  ('Médias & Communication','medias-communication','Presse, radio, TV et communication',        20, 1);

-- Sous-catégories Agriculture
INSERT INTO `categories` (`parent_id`, `nom`, `slug`, `ordre`, `actif`) VALUES
  (1, 'Céréales',          'cereales',          1, 1),
  (1, 'Légumes',           'legumes',           2, 1),
  (1, 'Fruits',            'fruits',            3, 1),
  (1, 'Tubercules',        'tubercules',        4, 1),
  (1, 'Huiles végétales',  'huiles-vegetales',  5, 1),
  (1, 'Épices & Condiments','epices-condiments', 6, 1);

-- Sous-catégories Élevage
INSERT INTO `categories` (`parent_id`, `nom`, `slug`, `ordre`, `actif`) VALUES
  (2, 'Bovins',            'bovins',            1, 1),
  (2, 'Volaille',          'volaille',          2, 1),
  (2, 'Poissons',          'poissons',          3, 1),
  (2, 'Produits laitiers', 'produits-laitiers', 4, 1),
  (2, 'Porcins',           'porcins',           5, 1);

-- Sous-catégories Technologie
INSERT INTO `categories` (`parent_id`, `nom`, `slug`, `ordre`, `actif`) VALUES
  (6, 'Développement web',     'developpement-web',     1, 1),
  (6, 'Réseaux & Télécoms',    'reseaux-telecoms',      2, 1),
  (6, 'Maintenance informatique','maintenance-info',     3, 1),
  (6, 'Logiciels & Applications','logiciels-apps',      4, 1);

-- Sous-catégories Services
INSERT INTO `categories` (`parent_id`, `nom`, `slug`, `ordre`, `actif`) VALUES
  (5, 'Comptabilité & Finance', 'comptabilite-finance', 1, 1),
  (5, 'Juridique & Notariat',   'juridique-notariat',   2, 1),
  (5, 'Marketing & Communication','marketing-comm',     3, 1),
  (5, 'Nettoyage & Entretien',  'nettoyage-entretien',  4, 1),
  (5, 'Sécurité',               'securite',             5, 1),
  (5, 'Événementiel',           'evenementiel',         6, 1);

-- Compte super admin par défaut (mot de passe: Admin@2026 — À CHANGER)
INSERT INTO `utilisateurs` (`nom`, `prenom`, `email`, `telephone`, `mot_de_passe`, `role`, `statut`, `email_verifie`) VALUES
  ('Admin', 'EmpireKongo', 'admin@empirekongo.com', '+243000000000',
   '$2y$12$exampleHashToReplaceWithRealBcryptHash', 'super_admin', 'actif', 1);

INSERT INTO `admins` (`utilisateur_id`, `niveau`, `actif`) VALUES (1, 'super_admin', 1);

-- ============================================================
-- VUES UTILES (VIEWS)
-- ============================================================

-- Vue : produits avec informations vendeur/entreprise
CREATE OR REPLACE VIEW `v_produits_complets` AS
SELECT
  p.id,
  p.nom,
  p.slug,
  p.prix,
  p.prix_ancien,
  p.prix_promo,
  p.devise,
  p.stock,
  p.photo_principale,
  p.statut,
  p.disponible,
  p.mise_en_avant,
  p.meilleure_vente,
  p.note_moyenne,
  p.nb_avis,
  p.nb_vues,
  p.nb_ventes,
  p.created_at,
  c.nom AS categorie_nom,
  c.slug AS categorie_slug,
  COALESCE(e.nom, pv.nom_boutique) AS vendeur_nom,
  COALESCE(e.slug, pv.slug_boutique) AS vendeur_slug,
  CASE WHEN p.entreprise_id IS NOT NULL THEN 'entreprise'
       WHEN p.vendeur_id IS NOT NULL THEN 'vendeur'
       ELSE 'fournisseur' END AS type_vendeur
FROM `produits` p
LEFT JOIN `categories` c ON p.categorie_id = c.id
LEFT JOIN `entreprises` e ON p.entreprise_id = e.id
LEFT JOIN `profils_vendeurs` pv ON p.vendeur_id = pv.id
WHERE p.statut = 'actif' AND p.disponible = 1;

-- Vue : statistiques globales admin
CREATE OR REPLACE VIEW `v_stats_globales` AS
SELECT
  (SELECT COUNT(*) FROM `utilisateurs` WHERE role = 'membre')       AS nb_membres,
  (SELECT COUNT(*) FROM `utilisateurs` WHERE role = 'vendeur')      AS nb_vendeurs,
  (SELECT COUNT(*) FROM `entreprises`  WHERE statut = 'actif')      AS nb_entreprises,
  (SELECT COUNT(*) FROM `fournisseurs` WHERE statut = 'actif')      AS nb_fournisseurs,
  (SELECT COUNT(*) FROM `profils_affilies` WHERE statut = 'actif')  AS nb_affilies,
  (SELECT COUNT(*) FROM `produits`     WHERE statut = 'actif')      AS nb_produits,
  (SELECT COUNT(*) FROM `commandes`)                                 AS nb_commandes_total,
  (SELECT COUNT(*) FROM `commandes` WHERE statut = 'livree')        AS nb_commandes_livrees,
  (SELECT COALESCE(SUM(montant_total),0) FROM `commandes` WHERE statut_paiement = 'paye') AS chiffre_affaires,
  (SELECT COUNT(*) FROM `utilisateurs` WHERE DATE(created_at) = CURDATE()) AS inscriptions_aujourd_hui,
  (SELECT COUNT(*) FROM `commandes`    WHERE DATE(created_at) = CURDATE()) AS commandes_aujourd_hui,
  (SELECT COUNT(*) FROM `signalements` WHERE statut = 'en_attente') AS signalements_en_attente,
  (SELECT COUNT(*) FROM `tickets_support` WHERE statut = 'ouvert')  AS tickets_ouverts;

-- Vue : commandes avec détails
CREATE OR REPLACE VIEW `v_commandes_details` AS
SELECT
  c.id,
  c.reference,
  c.montant_total,
  c.devise,
  c.statut,
  c.statut_paiement,
  c.created_at,
  u.nom AS client_nom,
  u.prenom AS client_prenom,
  u.email AS client_email,
  COALESCE(e.nom, pv.nom_boutique) AS vendeur_nom
FROM `commandes` c
JOIN `utilisateurs` u ON c.utilisateur_id = u.id
LEFT JOIN `entreprises` e ON c.entreprise_id = e.id
LEFT JOIN `profils_vendeurs` pv ON c.vendeur_id = pv.id;

-- ============================================================
-- PROCÉDURES STOCKÉES
-- ============================================================

DELIMITER $$

-- Procédure : Mettre à jour la note moyenne d'un produit
CREATE PROCEDURE IF NOT EXISTS `maj_note_produit`(IN p_produit_id INT UNSIGNED)
BEGIN
  UPDATE `produits` p
  SET
    p.note_moyenne = (
      SELECT COALESCE(AVG(a.note), 0)
      FROM `avis` a
      WHERE a.entite_type = 'produit'
        AND a.entite_id = p_produit_id
        AND a.statut = 'publie'
    ),
    p.nb_avis = (
      SELECT COUNT(*)
      FROM `avis` a
      WHERE a.entite_type = 'produit'
        AND a.entite_id = p_produit_id
        AND a.statut = 'publie'
    )
  WHERE p.id = p_produit_id;
END$$

-- Procédure : Mettre à jour la note moyenne d'une entreprise
CREATE PROCEDURE IF NOT EXISTS `maj_note_entreprise`(IN p_ent_id INT UNSIGNED)
BEGIN
  UPDATE `entreprises` e
  SET
    e.note_moyenne = (
      SELECT COALESCE(AVG(a.note), 0)
      FROM `avis` a
      WHERE a.entite_type = 'entreprise'
        AND a.entite_id = p_ent_id
        AND a.statut = 'publie'
    ),
    e.nb_avis = (
      SELECT COUNT(*)
      FROM `avis` a
      WHERE a.entite_type = 'entreprise'
        AND a.entite_id = p_ent_id
        AND a.statut = 'publie'
    )
  WHERE e.id = p_ent_id;
END$$

-- Procédure : Générer une référence de commande unique
CREATE PROCEDURE IF NOT EXISTS `gen_ref_commande`(OUT p_reference VARCHAR(30))
BEGIN
  SET p_reference = CONCAT(
    'CMD-',
    DATE_FORMAT(NOW(), '%Y%m%d'),
    '-',
    LPAD((SELECT COUNT(*) + 1 FROM `commandes` WHERE DATE(created_at) = CURDATE()), 4, '0')
  );
END$$

-- Procédure : Valider une commission affilié après livraison
CREATE PROCEDURE IF NOT EXISTS `valider_commissions_commande`(IN p_commande_id INT UNSIGNED)
BEGIN
  UPDATE `commissions_affiliation`
  SET statut = 'validee', updated_at = NOW()
  WHERE commande_id = p_commande_id AND statut = 'en_attente';

  -- Mettre à jour le solde de l'affilié
  UPDATE `profils_affilies` pa
  JOIN (
    SELECT affilie_id, SUM(montant_commission) AS total
    FROM `commissions_affiliation`
    WHERE commande_id = p_commande_id AND statut = 'validee'
    GROUP BY affilie_id
  ) ca ON pa.id = ca.affilie_id
  SET
    pa.solde_disponible = pa.solde_disponible + ca.total,
    pa.solde_en_attente = pa.solde_en_attente - ca.total,
    pa.total_gagné = pa.total_gagné + ca.total;
END$$

DELIMITER ;

-- ============================================================
-- RÉACTIVATION DES CONTRAINTES
-- ============================================================
SET FOREIGN_KEY_CHECKS = 1;

-- ============================================================
-- RÉSUMÉ DU SCHÉMA EMPIREKONGO v2.0
-- ============================================================
-- TABLES CRÉÉES (45 tables) :
--
-- CONFIGURATION (5)
--   1.  parametres_site       — Paramètres globaux
--   2.  provinces             — 26 provinces RDC
--   3.  villes                — Villes par province
--   4.  communes              — Communes par ville
--   5.  quartiers             — Quartiers par commune
--
-- UTILISATEURS (4)
--   6.  categories            — Catégories & sous-catégories
--   7.  utilisateurs          — 7 rôles (admin, membre, vendeur, entreprise, fournisseur, affilié)
--   8.  sessions              — Sessions de connexion
--   9.  profils_vendeurs      — Boutiques des vendeurs
--
-- ENTREPRISES (4)
--  10.  entreprises           — Profils entreprises complets
--  11.  entreprise_services   — Services proposés
--  12.  entreprise_realisations — Portfolio/réalisations
--  13.  followers             — Abonnements aux entreprises
--
-- FOURNISSEURS (5)
--  14.  fournisseurs          — Profils fournisseurs B2B
--  15.  fournisseur_categories — Catégories couvertes
--  16.  demandes_approvisionnement — Demandes B2B
--  17.  devis                 — Devis fournisseurs
--  18.  devis_lignes          — Lignes de devis
--
-- STORE (6)
--  19.  produits              — Produits & services
--  20.  produit_images        — Images multiples
--  21.  produit_variantes     — Variantes (taille, couleur)
--  22.  galeries              — Galeries photos entités
--  23.  favoris               — Produits/entreprises favoris
--  24.  paniers               — Paniers d achat
--  25.  panier_items          — Articles dans paniers
--
-- COMMANDES (4)
--  26.  commandes             — Commandes clients
--  27.  commande_items        — Lignes de commande
--  28.  commande_historique   — Historique statuts
--  29.  reservations          — Réservations services
--
-- COMMUNAUTÉ (5)
--  30.  publications          — Posts, annonces, événements
--  31.  publication_images    — Images des publications
--  32.  commentaires          — Commentaires & réponses
--  33.  reactions             — Likes & réactions
--  34.  evenements            — Événements détaillés
--  35.  signalements          — Signalements de contenus
--
-- EMPLOI (2)
--  36.  offres_emploi         — Offres de recrutement
--  37.  candidatures          — Candidatures aux offres
--
-- MESSAGERIE (4)
--  38.  conversations         — Fils de conversation
--  39.  messages              — Messages
--  40.  tickets_support       — Tickets support client
--  41.  ticket_reponses       — Réponses aux tickets
--
-- AVIS (1)
--  42.  avis                  — Notes & commentaires
--
-- PROMOTIONS & PUBLICITÉS (3)
--  43.  promotions            — Promotions & codes promo
--  44.  promotion_produits    — Produits en promotion
--  45.  publicites            — Bannières publicitaires
--
-- AFFILIATION (4)
--  46.  profils_affilies      — Profils affiliés
--  47.  parrainages           — Liens parrain/filleul
--  48.  commissions_affiliation — Commissions générées
--  49.  demandes_retrait      — Retraits de commissions
--
-- PAIEMENTS (2)
--  50.  transactions          — Toutes les transactions
--  51.  portefeuilles         — Portefeuilles virtuels
--
-- NOTIFICATIONS (1)
--  52.  notifications         — Alertes temps réel (24 types)
--
-- ADMINISTRATION (3)
--  53.  admins                — Profils admins (5 niveaux)
--  54.  logs_activite         — Journal d activité complet
--  55.  annonces_admin        — Annonces administrateurs
--
-- STATISTIQUES (3)
--  56.  stats_journalieres    — Stats agrégées par jour
--  57.  vues_pages            — Analytics pages
--  58.  recherches            — Historique recherches
--
-- VUES (3) :
--   v_produits_complets, v_stats_globales, v_commandes_details
--
-- PROCÉDURES (4) :
--   maj_note_produit, maj_note_entreprise,
--   gen_ref_commande, valider_commissions_commande
--
-- DONNÉES INITIALES :
--   20 paramètres site, 26 provinces, 17 villes,
--   20 catégories principales + 20 sous-catégories,
--   1 compte super admin
--
-- IMPORT : mysql -u root -p empirekongo < empirekongo_schema_v2.sql
--       ou phpMyAdmin → Importer → choisir ce fichier
-- ============================================================
