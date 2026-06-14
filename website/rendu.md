# SAé Web & Programmation Répartie — Carte Interactive Nancy

> Application web cartographique interactive centrée sur la ville de Nancy, proposant la visualisation de stations Vélib', restaurants, CROUS et incidents routiers, avec un système de réservation intégré.

---

## Sommaire

1. [Technologies utilisées](#technologies-utilisées)
2. [Ce qui a été réalisé](#ce-qui-a-été-réalisé)
3. [Lancement du projet](#lancement-du-projet)
4. [Utilisation](#utilisation)
5. [Structure du projet](#structure-du-projet)
6. [Dépôt Git](#dépôt-git)

**Flux de données :**
- Le **frontend** communique uniquement avec l'API Java (sauf Vélib' qui appelle `api.cyclocity.fr` directement).
- L'**API Java** sert de proxy pour les APIs externes (CROUS, données routières) et de couche d'accès à MariaDB pour les restaurants et réservations.
- Les échanges sont tous en **JSON** via HTTP, avec gestion des headers CORS côté API.

---

## Technologies utilisées

| Couche | Technologie | Rôle |
|---|---|---|
| Frontend | TypeScript + esbuild | Code source typé, compilation vers JS |
| Cartographie | Leaflet 1.9 | Affichage interactif de la carte |
| Bundler | esbuild | Build du frontend en `bundle.js` |
| Backend | Java (HttpServer JDK) | Serveur API REST léger, aucun framework |
| Base de données | MariaDB | Stockage restaurants et réservations |
| Driver BDD | mariadb-java-client 3.5.8 | Connexion JDBC à MariaDB |
| JSON | org.json | Sérialisation/désérialisation JSON côté Java |
| Config | `.env` (EnvLoader maison) | Variables d'environnement (BDD) |
| Déploiement | webetu (hébergement universitaire) | Mise en ligne du frontend |

---

## Ce qui a été réalisé

### Carte interactive (Leaflet)
Déploiement d'une carte centrée sur Nancy avec zoom, déplacement, et affichage dynamique de marqueurs selon le mode actif. Chaque point cliquable affiche une popup avec les informations associées.

### Stations Vélib'
Affichage des stations de vélos en libre-service de Nancy via l'API publique `api.cyclocity.fr`. Pour chaque station : nom, adresse et capacité totale.

### Travaux et incidents routiers
Création d'un proxy Java (`/road`) pour contourner les restrictions CORS de l'API de données routières externe. Les incidents sont représentés sur la carte avec leurs informations.

### Restaurants
- Données stockées en base MariaDB (nom, adresse, coordonnées GPS, nombre de places).
- Exposition via l'endpoint `/restaurants` de l'API Java.
- Affichage sur la carte avec popup et bouton de réservation.

### CROUS et menus
- Récupération des restaurants CROUS via l'API officielle, proxifiée par l'API Java (`/crous`, `/crous/menu`).
- Affichage des menus du jour dans une modale dédiée.

### Système de réservation
Formulaire de réservation de table intégré (nom, prénom, téléphone, date, nombre de personnes). L'API Java gère la réservation avec :
- Vérification de la disponibilité des places (`nbPlace` vs somme des réservations du jour).
- Transaction SQL avec verrous (`FOR UPDATE`) pour éviter les réservations concurrentes.
- Retour d'erreur explicite si la capacité est dépassée.

### Base de données
Schéma conçu et déployé manuellement : tables `restaurants` et `reservations`. La connexion est gérée avec reconnexion automatique si la connexion est perdue.

### Déploiement
Le frontend compilé est hébergé sur **webetu** (serveur universitaire). Le site est fonctionnel uniquement si l'API Java est démarrée en parallèle.

### Barre de navigation et recherche
Navigation entre les modes (Vélib', Restaurants, CROUS, Incidents) via la barre du haut. Une barre de recherche permet de filtrer les points affichés dans le volet latéral en temps réel.

---

## Lancement du projet

### Prérequis

- Java JDK 17+
- MariaDB opérationnel
- Node.js + npm (pour recompiler le frontend si besoin)

### 1. Configurer la base de données

Créer un fichier `api/.env` en vous basant sur `api/.env-example` :

```env
DB_HOST=webetu.iutnc.univ-lorraine.fr
DB_PORT=3306
DB_NAME=nom_de_la_base
DB_USER=votre_utilisateur
DB_PASSWORD=votre_mot_de_passe
```

Créer les tables nécessaires :

```sql
CREATE TABLE restaurants (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nom VARCHAR(255),
  adresse VARCHAR(255),
  gps VARCHAR(50),
  nbPlace INT
);

CREATE TABLE reservations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  id_rest INT,
  nom VARCHAR(100),
  prenom VARCHAR(100),
  nb_personne INT,
  telephone VARCHAR(20),
  date DATE,
  FOREIGN KEY (id_rest) REFERENCES restaurants(id)
);
```

### 2. Compiler et lancer l'API Java

Sur windows :

```bash
cd api/src
javac -cp ".;../lib/*" *.java
java -cp ".;../lib/*;." Main
```
Sur Linux : 

```bash
cd api/src
javac -cp ".:../lib/*" *.java
java -cp ".:../lib/*:." Main
```

> L'API démarre sur **http://localhost:8080**

### 3. (Optionnel) Recompiler le frontend

```bash
cd website
npm install
npm install marked
npm run build
```

### 4. Accéder au site

Ouvrir `website/index.html` dans un navigateur, ou accéder au site déployé sur webetu.

> Le site nécessite que l'API Java soit active pour afficher les restaurants, réservations, CROUS et incidents.

---

## Utilisation

| Fonctionnalité | Description |
|---|---|
| **Navigation** | La barre en haut permet de basculer entre Vélib', Restaurants, CROUS et Incidents |
| **Carte** | Zoom et déplacement libres sur la carte Leaflet |
| **Volet latéral** | Liste les points du mode actif avec leurs informations |
| **Barre de recherche** | Filtre les résultats affichés dans le volet en temps réel |
| **Popup carte** | Cliquer sur un marqueur affiche les détails du lieu |
| **Réservation** | Sur un restaurant, un bouton ouvre le formulaire de réservation de table |
| **Menu CROUS** | Sur un restaurant CROUS, un bouton affiche le menu du jour |

---

## Structure du projet

```
Sae_web_programation_repartie/
├── api/
│   ├── src/
│   │   ├── Main.java              # Point d'entrée, enregistrement des routes
│   │   ├── Database.java          # Gestion connexion MariaDB (JDBC)
│   │   ├── EnvLoader.java         # Chargement du fichier .env
│   │   ├── Route.java             # Modèle de route
│   │   ├── PingHandler.java       # GET /ping — test de vie
│   │   ├── RoadHandler.java       # GET /road — proxy travaux
│   │   ├── RestaurantHandler.java # GET /restaurants — liste BDD
│   │   ├── ReservationHandler.java# POST /reservation — réservation BDD
│   │   ├── CrousHandler.java      # GET /crous — proxy CROUS
│   │   └── CrousMenuHandler.java  # GET /crous/menu — proxy menu CROUS
│   ├── lib/
│   │   ├── mariadb-java-client-3.5.8.jar
│   │   └── json-20260522.jar
│   └── .env-example
│
└── website/
    ├── index.html
    ├── style.css
    ├── build.js                   # Script esbuild
    ├── package.json
    ├── assets/                    # Icônes SVG
    └── ts/
        ├── main.ts                # Point d'entrée — init et routing
        ├── map.ts                 # Initialisation Leaflet, gestion marqueurs
        ├── store.ts               # État global (mode actif)
        ├── bike.ts                # Chargement stations Vélib'
        ├── food.ts                # Chargement restaurants
        ├── crous.ts               # Chargement CROUS
        ├── car.ts                 # Chargement incidents
        ├── search.ts              # Filtrage en temps réel
        ├── modal.ts               # Modale réservation
        ├── uiList.ts              # Rendu du volet latéral
        └── menuModal.ts           # Modale menu CROUS
```

---

## Dépôt Git

**[https://github.com/FloH54/Sae_web_programation_repartie.git](https://github.com/FloH54/Sae_web_programation_repartie.git)**
