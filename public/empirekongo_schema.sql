-- ============================================================
--  EMPIREKONGO — Schéma de base de données MySQL complet
--  Généré le : 2026-07-18
--  Encodage  : UTF-8 / utf8mb4
--  Moteur    : InnoDB
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
-- TABLE : categories
-- ============================================================
CREATE TABLE IF NOT EXISTS `categories` (
  `id`          INT UNSIGNED     NOT NULL AUTO_INCREMENT,
  `parent_id`   INT UNSIGNED     DEFAULT NULL COMMENT 'NULL = catégorie principale',
  `nom`         VARCHAR(120)     NOT NULL,
  `slug`        VARCHAR(140)     NOT NULL UNIQUE,
  `description` TEXT             DEFAULT NULL,
  `icone`       VARCHAR(255)     DEFAULT NULL COMMENT 'URL ou classe icône',
  `ordre`       TINYINT UNSIGNED NOT NULL DEFAULT 0,
  `actif`       TINYINT(1)       NOT NULL DEFAULT 1,
  `created_at`  DATETIME         NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`  DATETIME         NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_parent` (`parent_id`),
  CONSTRAINT `fk_cat_parent` FOREIGN KEY (`parent_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Catégories et sous-catégories de produits/services';

-- ============================================================
-- TABLE : utilisateurs
-- ============================================================
CREATE TABLE IF NOT EXISTS `utilisateurs` (
  `id`                  INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  `nom`                 VARCHAR(100)  NOT NULL,
  `prenom`              VARCHAR(100)  NOT NULL,
  `email`               VARCHAR(191)  NOT NULL UNIQUE,
  `telephone`           VARCHAR(30)   DEFAULT NULL,
  `mot_de_passe`        VARCHAR(255)  NOT NULL COMMENT 'Hash bcrypt',
  `avatar`              VARCHAR(255)  DEFAULT NULL COMMENT 'URL photo de profil',
  `role`                ENUM('admin','membre','entreprise') NOT NULL DEFAULT 'membre',
  `statut`              ENUM('actif','inactif','suspendu')  NOT NULL DEFAULT 'actif',
  `email_verifie`       TINYINT(1)    NOT NULL DEFAULT 0,
  `token_verification`  VARCHAR(255)  DEFAULT NULL,
  `token_reset`         VARCHAR(255)  DEFAULT NULL,
  `token_reset_expire`  DATETIME      DEFAULT NULL,
  `derniere_connexion`  DATETIME      DEFAULT NULL,
  `created_at`          DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`          DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_email` (`email`),
  KEY `idx_role`  (`role`),
  KEY `idx_statut`(`statut`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Comptes utilisateurs de la plateforme';

-- ============================================================
-- TABLE : entreprises
-- ============================================================
CREATE TABLE IF NOT EXISTS `entreprises` (
  `id`              INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  `utilisateur_id`  INT UNSIGNED  NOT NULL COMMENT 'Propriétaire du compte',
  `categorie_id`    INT UNSIGNED  DEFAULT NULL,
  `nom`             VARCHAR(200)  NOT NULL,
  `slug`            VARCHAR(220)  NOT NULL UNIQUE,
  `description`     TEXT          DEFAULT NULL,
  `secteur`         VARCHAR(120)  DEFAULT NULL,
  `logo`            VARCHAR(255)  DEFAULT NULL,
  `couverture`      VARCHAR(255)  DEFAULT NULL COMMENT 'Image de couverture',
  `email`           VARCHAR(191)  DEFAULT NULL,
  `telephone`       VARCHAR(30)   DEFAULT NULL,
  `site_web`        VARCHAR(255)  DEFAULT NULL,
  `adresse`         VARCHAR(255)  DEFAULT NULL,
  `ville`           VARCHAR(100)  DEFAULT NULL,
  `province`        VARCHAR(100)  DEFAULT NULL,
  `pays`            VARCHAR(80)   NOT NULL DEFAULT 'RDC',
  `latitude`        DECIMAL(10,7) DEFAULT NULL,
  `longitude`       DECIMAL(10,7) DEFAULT NULL,
  `verifie`         TINYINT(1)    NOT NULL DEFAULT 0 COMMENT '1 = entreprise vérifiée',
  `statut`          ENUM('actif','inactif','en_attente','suspendu') NOT NULL DEFAULT 'en_attente',
  `nb_followers`    INT UNSIGNED  NOT NULL DEFAULT 0 COMMENT 'Compteur dénormalisé',
  `created_at`      DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`      DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_utilisateur` (`utilisateur_id`),
  KEY `idx_categorie`   (`categorie_id`),
  KEY `idx_ville`       (`ville`),
  KEY `idx_verifie`     (`verifie`),
  KEY `idx_statut`      (`statut`),
  CONSTRAINT `fk_ent_user` FOREIGN KEY (`utilisateur_id`) REFERENCES `utilisateurs` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_ent_cat`  FOREIGN KEY (`categorie_id`)   REFERENCES `categories`   (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Profils des entreprises inscrites';

-- ============================================================
-- TABLE : produits
-- ============================================================
CREATE TABLE IF NOT EXISTS `produits` (
  `id`              INT UNSIGNED    NOT NULL AUTO_INCREMENT,
  `entreprise_id`   INT UNSIGNED    NOT NULL,
  `categorie_id`    INT UNSIGNED    DEFAULT NULL,
  `sous_categorie_id` INT UNSIGNED  DEFAULT NULL,
  `nom`             VARCHAR(200)    NOT NULL,
  `slug`            VARCHAR(220)    NOT NULL UNIQUE,
  `description`     TEXT            DEFAULT NULL,
  `prix`            DECIMAL(12,2)   DEFAULT NULL,
  `devise`          VARCHAR(10)     NOT NULL DEFAULT 'CDF',
  `unite`           VARCHAR(50)     DEFAULT NULL COMMENT 'kg, litre, pièce…',
  `stock`           INT             DEFAULT NULL COMMENT 'NULL = illimité',
  `photo_principale` VARCHAR(255)   DEFAULT NULL,
  `statut`          ENUM('actif','brouillon','en_attente','archive') NOT NULL DEFAULT 'brouillon',
  `disponible`      TINYINT(1)      NOT NULL DEFAULT 1,
  `nb_vues`         INT UNSIGNED    NOT NULL DEFAULT 0,
  `created_at`      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_entreprise`    (`entreprise_id`),
  KEY `idx_categorie`     (`categorie_id`),
  KEY `idx_sous_cat`      (`sous_categorie_id`),
  KEY `idx_statut`        (`statut`),
  KEY `idx_disponible`    (`disponible`),
  CONSTRAINT `fk_prod_ent`     FOREIGN KEY (`entreprise_id`)     REFERENCES `entreprises` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_prod_cat`     FOREIGN KEY (`categorie_id`)      REFERENCES `categories`  (`id`) ON DELETE SET NULL,
  CONSTRAINT `fk_prod_sous_cat`FOREIGN KEY (`sous_categorie_id`) REFERENCES `categories`  (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Produits et services publiés par les entreprises';

-- ============================================================
-- TABLE : galeries  (photos d'entreprise ET de produit)
-- ============================================================
CREATE TABLE IF NOT EXISTS `galeries` (
  `id`            INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  `entite_type`   ENUM('entreprise','produit') NOT NULL COMMENT 'Type de l entité parente',
  `entite_id`     INT UNSIGNED  NOT NULL COMMENT 'ID de l entreprise ou du produit',
  `url`           VARCHAR(255)  NOT NULL COMMENT 'URL de l image',
  `legende`       VARCHAR(255)  DEFAULT NULL,
  `ordre`         TINYINT UNSIGNED NOT NULL DEFAULT 0,
  `created_at`    DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_entite` (`entite_type`, `entite_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Galeries photos pour entreprises et produits';

-- ============================================================
-- TABLE : followers  (abonnements entreprise)
-- ============================================================
CREATE TABLE IF NOT EXISTS `followers` (
  `id`            INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  `utilisateur_id` INT UNSIGNED NOT NULL COMMENT 'Celui qui suit',
  `entreprise_id` INT UNSIGNED  NOT NULL COMMENT 'Entreprise suivie',
  `created_at`    DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_follow` (`utilisateur_id`, `entreprise_id`),
  KEY `idx_entreprise` (`entreprise_id`),
  CONSTRAINT `fk_fol_user` FOREIGN KEY (`utilisateur_id`) REFERENCES `utilisateurs` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_fol_ent`  FOREIGN KEY (`entreprise_id`)  REFERENCES `entreprises`  (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Système d abonnement (follow) aux entreprises';

-- ============================================================
-- TABLE : conversations
-- ============================================================
CREATE TABLE IF NOT EXISTS `conversations` (
  `id`              INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  `utilisateur_id`  INT UNSIGNED  NOT NULL COMMENT 'Initiateur de la conversation',
  `entreprise_id`   INT UNSIGNED  NOT NULL COMMENT 'Entreprise concernée',
  `sujet`           VARCHAR(255)  DEFAULT NULL,
  `dernier_message` TEXT          DEFAULT NULL COMMENT 'Cache du dernier message',
  `dernier_msg_at`  DATETIME      DEFAULT NULL,
  `nb_non_lus_user` SMALLINT UNSIGNED NOT NULL DEFAULT 0,
  `nb_non_lus_ent`  SMALLINT UNSIGNED NOT NULL DEFAULT 0,
  `created_at`      DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`      DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_conv` (`utilisateur_id`, `entreprise_id`),
  KEY `idx_entreprise` (`entreprise_id`),
  CONSTRAINT `fk_conv_user` FOREIGN KEY (`utilisateur_id`) REFERENCES `utilisateurs` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_conv_ent`  FOREIGN KEY (`entreprise_id`)  REFERENCES `entreprises`  (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Fils de conversation entre utilisateurs et entreprises';

-- ============================================================
-- TABLE : messages
-- ============================================================
CREATE TABLE IF NOT EXISTS `messages` (
  `id`              INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  `conversation_id` INT UNSIGNED  NOT NULL,
  `expediteur_type` ENUM('utilisateur','entreprise') NOT NULL,
  `expediteur_id`   INT UNSIGNED  NOT NULL,
  `contenu`         TEXT          NOT NULL,
  `piece_jointe`    VARCHAR(255)  DEFAULT NULL COMMENT 'URL fichier joint',
  `lu`              TINYINT(1)    NOT NULL DEFAULT 0,
  `lu_at`           DATETIME      DEFAULT NULL,
  `created_at`      DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_conversation` (`conversation_id`),
  KEY `idx_expediteur`   (`expediteur_type`, `expediteur_id`),
  CONSTRAINT `fk_msg_conv` FOREIGN KEY (`conversation_id`) REFERENCES `conversations` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Messages échangés dans les conversations';

-- ============================================================
-- TABLE : commandes
-- ============================================================
CREATE TABLE IF NOT EXISTS `commandes` (
  `id`              INT UNSIGNED    NOT NULL AUTO_INCREMENT,
  `reference`       VARCHAR(30)     NOT NULL UNIQUE COMMENT 'Ex: CMD-20260718-0001',
  `utilisateur_id`  INT UNSIGNED    NOT NULL,
  `entreprise_id`   INT UNSIGNED    NOT NULL,
  `produit_id`      INT UNSIGNED    DEFAULT NULL,
  `quantite`        INT UNSIGNED    NOT NULL DEFAULT 1,
  `prix_unitaire`   DECIMAL(12,2)   NOT NULL,
  `montant_total`   DECIMAL(12,2)   NOT NULL,
  `devise`          VARCHAR(10)     NOT NULL DEFAULT 'CDF',
  `note`            TEXT            DEFAULT NULL,
  `statut`          ENUM('en_attente','confirmee','en_preparation','expediee','livree','annulee','remboursee')
                    NOT NULL DEFAULT 'en_attente',
  `adresse_livraison` VARCHAR(255)  DEFAULT NULL,
  `ville_livraison`   VARCHAR(100)  DEFAULT NULL,
  `telephone_livraison` VARCHAR(30) DEFAULT NULL,
  `created_at`      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_utilisateur` (`utilisateur_id`),
  KEY `idx_entreprise`  (`entreprise_id`),
  KEY `idx_produit`     (`produit_id`),
  KEY `idx_statut`      (`statut`),
  CONSTRAINT `fk_cmd_user` FOREIGN KEY (`utilisateur_id`) REFERENCES `utilisateurs` (`id`) ON DELETE RESTRICT,
  CONSTRAINT `fk_cmd_ent`  FOREIGN KEY (`entreprise_id`)  REFERENCES `entreprises`  (`id`) ON DELETE RESTRICT,
  CONSTRAINT `fk_cmd_prod` FOREIGN KEY (`produit_id`)     REFERENCES `produits`     (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Commandes passées par les utilisateurs';

-- ============================================================
-- TABLE : reservations
-- ============================================================
CREATE TABLE IF NOT EXISTS `reservations` (
  `id`              INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  `reference`       VARCHAR(30)   NOT NULL UNIQUE COMMENT 'Ex: RES-20260718-0001',
  `utilisateur_id`  INT UNSIGNED  NOT NULL,
  `entreprise_id`   INT UNSIGNED  NOT NULL,
  `produit_id`      INT UNSIGNED  DEFAULT NULL,
  `quantite`        INT UNSIGNED  NOT NULL DEFAULT 1,
  `date_souhaitee`  DATE          DEFAULT NULL,
  `heure_souhaitee` TIME          DEFAULT NULL,
  `note`            TEXT          DEFAULT NULL,
  `statut`          ENUM('en_attente','confirmee','annulee','expiree') NOT NULL DEFAULT 'en_attente',
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
-- TABLE : avis  (reviews)
-- ============================================================
CREATE TABLE IF NOT EXISTS `avis` (
  `id`              INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  `utilisateur_id`  INT UNSIGNED  NOT NULL,
  `entite_type`     ENUM('entreprise','produit') NOT NULL,
  `entite_id`       INT UNSIGNED  NOT NULL,
  `note`            TINYINT UNSIGNED NOT NULL DEFAULT 5 COMMENT '1 à 5 étoiles',
  `commentaire`     TEXT          DEFAULT NULL,
  `statut`          ENUM('publie','en_attente','rejete') NOT NULL DEFAULT 'en_attente',
  `created_at`      DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`      DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_utilisateur` (`utilisateur_id`),
  KEY `idx_entite`      (`entite_type`, `entite_id`),
  KEY `idx_statut`      (`statut`),
  CONSTRAINT `fk_avis_user` FOREIGN KEY (`utilisateur_id`) REFERENCES `utilisateurs` (`id`) ON DELETE CASCADE,
  CONSTRAINT `chk_note` CHECK (`note` BETWEEN 1 AND 5)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Avis et notes laissés sur les entreprises et produits';

-- ============================================================
-- TABLE : notifications
-- ============================================================
CREATE TABLE IF NOT EXISTS `notifications` (
  `id`              INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  `destinataire_type` ENUM('utilisateur','entreprise') NOT NULL,
  `destinataire_id`   INT UNSIGNED NOT NULL,
  `type`            ENUM(
                      'nouveau_message',
                      'nouveau_follower',
                      'nouvelle_commande',
                      'statut_commande',
                      'nouvelle_reservation',
                      'statut_reservation',
                      'nouvel_avis',
                      'produit_approuve',
                      'entreprise_verifiee',
                      'alerte_systeme'
                    ) NOT NULL,
  `titre`           VARCHAR(200)  NOT NULL,
  `contenu`         TEXT          DEFAULT NULL,
  `lien`            VARCHAR(255)  DEFAULT NULL COMMENT 'URL de redirection',
  `entite_type`     VARCHAR(50)   DEFAULT NULL COMMENT 'Type de l entité source',
  `entite_id`       INT UNSIGNED  DEFAULT NULL COMMENT 'ID de l entité source',
  `lu`              TINYINT(1)    NOT NULL DEFAULT 0,
  `lu_at`           DATETIME      DEFAULT NULL,
  `created_at`      DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_destinataire` (`destinataire_type`, `destinataire_id`),
  KEY `idx_type`         (`type`),
  KEY `idx_lu`           (`lu`),
  KEY `idx_created`      (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Notifications en temps réel pour utilisateurs et entreprises';

-- ============================================================
-- TABLE : sessions  (gestion des tokens de connexion)
-- ============================================================
CREATE TABLE IF NOT EXISTS `sessions` (
  `id`              VARCHAR(128)  NOT NULL,
  `utilisateur_id`  INT UNSIGNED  NOT NULL,
  `ip_address`      VARCHAR(45)   DEFAULT NULL,
  `user_agent`      VARCHAR(255)  DEFAULT NULL,
  `payload`         TEXT          DEFAULT NULL,
  `expire_at`       DATETIME      NOT NULL,
  `created_at`      DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_utilisateur` (`utilisateur_id`),
  KEY `idx_expire`      (`expire_at`),
  CONSTRAINT `fk_sess_user` FOREIGN KEY (`utilisateur_id`) REFERENCES `utilisateurs` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  COMMENT='Sessions actives des utilisateurs';

-- ============================================================
-- DONNÉES INITIALES — Catégories principales
-- ============================================================
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
  ('Éducation',            'education',            'Formation et enseignement',                 10, 1);

-- Sous-catégories Agriculture
INSERT INTO `categories` (`parent_id`, `nom`, `slug`, `ordre`, `actif`) VALUES
  (1, 'Céréales',          'cereales',          1, 1),
  (1, 'Légumes',           'legumes',           2, 1),
  (1, 'Fruits',            'fruits',            3, 1),
  (1, 'Tubercules',        'tubercules',        4, 1),
  (1, 'Huiles végétales',  'huiles-vegetales',  5, 1);

-- Sous-catégories Élevage
INSERT INTO `categories` (`parent_id`, `nom`, `slug`, `ordre`, `actif`) VALUES
  (2, 'Bovins',            'bovins',            1, 1),
  (2, 'Volaille',          'volaille',          2, 1),
  (2, 'Poissons',          'poissons',          3, 1),
  (2, 'Produits laitiers', 'produits-laitiers', 4, 1);

-- ============================================================
-- Réactivation des contraintes
-- ============================================================
SET FOREIGN_KEY_CHECKS = 1;

-- ============================================================
-- FIN DU SCHÉMA EMPIREKONGO
-- Tables créées :
--   1. categories       — Catégories & sous-catégories
--   2. utilisateurs     — Comptes membres
--   3. entreprises      — Profils entreprises
--   4. produits         — Produits & services
--   5. galeries         — Photos entreprises & produits
--   6. followers        — Abonnements aux entreprises
--   7. conversations    — Fils de discussion
--   8. messages         — Messages dans les conversations
--   9. commandes        — Commandes clients
--  10. reservations     — Réservations clients
--  11. avis             — Notes & commentaires
--  12. notifications    — Alertes temps réel
--  13. sessions         — Sessions de connexion
-- ============================================================
