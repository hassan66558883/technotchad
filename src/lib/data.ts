export type Service = {
  slug: string;
  icon: string;
  title: string;
  description: string;
};

export const services: Service[] = [
  {
    slug: "developpement-web",
    icon: "🖥️",
    title: "Développement Web & Applications",
    description: "Planification et déploiement de sites web, développement d'applications mobiles et desktop, logiciels de gestion sur mesure.",
  },
  {
    slug: "reseaux-infrastructure",
    icon: "🌐",
    title: "Réseaux & Infrastructure",
    description: "Planification, déploiement et entretien de réseaux LAN, MAN, PAN et WAN, ainsi que l'installation et l'entretien de réseaux VSAT.",
  },
  {
    slug: "cctv-securite",
    icon: "📹",
    title: "Maintenance & Sécurité",
    description: "Vidéosurveillance (CCTV), contrôle d'accès, alarme incendie, PBX et antivirus pour sécuriser vos locaux et vos données.",
  },
  {
    slug: "telephonie-ip",
    icon: "📞",
    title: "Téléphonie IP",
    description: "PBX, VoIP et solutions de communication d'entreprise.",
  },
  {
    slug: "erp-odoo",
    icon: "📊",
    title: "ERP & Odoo",
    description: "Déploiement, personnalisation et hébergement Odoo.",
  },
  {
    slug: "formation",
    icon: "🎓",
    title: "Formation",
    description: "Formations professionnelles et workshops pratiques dans nos filières TIC.",
  },
  {
    slug: "cybersecurite",
    icon: "🛡️",
    title: "Cybersécurité",
    description: "Audit, protection et sécurisation de vos systèmes et de vos données.",
  },
  {
    slug: "maintenance",
    icon: "🛠️",
    title: "Maintenance informatique",
    description: "Support technique et maintenance préventive/curative de vos équipements.",
  },
  {
    slug: "bases-de-donnees",
    icon: "🗄️",
    title: "Bases de données",
    description: "Création et maintien de bases de données avec Access, SQL, MySQL, SQL Server et Oracle.",
  },
  {
    slug: "fourniture-informatique",
    icon: "📦",
    title: "Fourniture informatique",
    description: "Fourniture d'ordinateurs, caméras CCTV et autres appareils électroniques et informatiques.",
  },
  {
    slug: "solutions-sur-mesure",
    icon: "⚙️",
    title: "Solutions sur mesure",
    description: "Développement de solutions adaptées à vos besoins spécifiques.",
  },
];

export type Formation = {
  slug: string;
  category: string;
  title: string;
  image: string;
  startDate: string;
  duration: string;
  schedule: string;
  seats: number;
  seatsLeft: number;
  price: string;
  instructor: string;
  description: string;
};

export const formations: Formation[] = [
  {
    slug: "excel",
    category: "Bureautique",
    title: "Formation Excel",
    image: "📈",
    startDate: "10 Septembre 2026",
    duration: "20 jours",
    schedule: "09h00 – 11h00",
    seats: 20,
    seatsLeft: 6,
    price: "45 000 FCFA",
    instructor: "Mahamat Idriss",
    description: "Maîtrisez Excel du niveau débutant à avancé : formules, tableaux croisés dynamiques, macros.",
  },
  {
    slug: "reseaux-ccna",
    category: "Réseaux",
    title: "Réseaux / CCNA",
    image: "🌐",
    startDate: "22 Septembre 2026",
    duration: "6 semaines",
    schedule: "14h00 – 17h00",
    seats: 15,
    seatsLeft: 4,
    price: "150 000 FCFA",
    instructor: "Hassan Brahim",
    description: "Préparation à la certification CCNA : commutation, routage, sécurité réseau.",
  },
  {
    slug: "cctv",
    category: "CCTV",
    title: "Formation CCTV",
    image: "📹",
    startDate: "05 Octobre 2026",
    duration: "10 jours",
    schedule: "09h00 – 12h00",
    seats: 12,
    seatsLeft: 12,
    price: "80 000 FCFA",
    instructor: "Ousmane Djibrine",
    description: "Installation, configuration et supervision de systèmes de vidéosurveillance professionnels.",
  },
  {
    slug: "odoo",
    category: "Odoo",
    title: "Formation Odoo",
    image: "📊",
    startDate: "12 Octobre 2026",
    duration: "4 semaines",
    schedule: "09h00 – 12h00",
    seats: 15,
    seatsLeft: 9,
    price: "120 000 FCFA",
    instructor: "Amina Youssouf",
    description: "Déploiement et personnalisation d'Odoo : ventes, comptabilité, inventaire, RH.",
  },
  {
    slug: "cybersecurite",
    category: "Cybersécurité",
    title: "Formation Cybersécurité",
    image: "🛡️",
    startDate: "20 Octobre 2026",
    duration: "3 semaines",
    schedule: "14h00 – 17h00",
    seats: 15,
    seatsLeft: 15,
    price: "130 000 FCFA",
    instructor: "Hassan Brahim",
    description: "Fondamentaux de la cybersécurité : audit, protection réseau, gestion des incidents.",
  },
  {
    slug: "intelligence-artificielle",
    category: "IA",
    title: "Introduction à l'IA",
    image: "🤖",
    startDate: "03 Novembre 2026",
    duration: "2 semaines",
    schedule: "09h00 – 11h00",
    seats: 20,
    seatsLeft: 18,
    price: "60 000 FCFA",
    instructor: "Mahamat Idriss",
    description: "Découverte pratique de l'intelligence artificielle appliquée aux entreprises.",
  },
];

export type Workshop = {
  slug: string;
  title: string;
  description: string;
  duration: string;
  schedule: string;
  date: string;
  seatsLeft: number;
};

export const workshops: Workshop[] = [
  {
    slug: "workshop-cctv",
    title: "Workshop CCTV",
    description: "Installation, configuration et mise en service d'un système de vidéosurveillance.",
    duration: "2 jours",
    schedule: "11h00 – 13h00",
    date: "15 Septembre 2026",
    seatsLeft: 5,
  },
  {
    slug: "workshop-reseaux",
    title: "Workshop Réseaux",
    description: "Câblage, configuration de switchs/routeurs et dépannage réseau en conditions réelles.",
    duration: "1 jour",
    schedule: "09h00 – 16h00",
    date: "28 Septembre 2026",
    seatsLeft: 8,
  },
];

export type Project = {
  slug: string;
  category: string;
  title: string;
  client: string;
  location: string;
  image: string;
  problem: string;
  solution: string;
  technologies: string[];
  results: string[];
  gallery: string[];
};

export const projects: Project[] = [
  {
    slug: "modernisation-cctv",
    category: "CCTV",
    title: "Modernisation système CCTV",
    client: "Banque Agricole du Tchad",
    location: "N'Djaména",
    image: "📹",
    problem: "Le système de vidéosurveillance existant était vétuste, avec une couverture insuffisante des zones sensibles et aucun enregistrement centralisé.",
    solution: "Déploiement de caméras IP Hikvision sur l'ensemble des agences, avec un NVR centralisé et une supervision à distance sécurisée.",
    technologies: ["Hikvision", "NVR", "Réseau IP", "Contrôle d'accès"],
    results: ["Couverture vidéo à 100% des zones sensibles", "Temps de réponse incident réduit de 60%", "Supervision centralisée multi-agences"],
    gallery: ["📹", "🖥️", "🏢"],
  },
  {
    slug: "deploiement-erp",
    category: "ERP",
    title: "Déploiement ERP Odoo",
    client: "Groupe Industriel STAR",
    location: "N'Djaména",
    image: "📊",
    problem: "Gestion des ventes, stocks et comptabilité éclatée sur plusieurs outils non connectés, entraînant des erreurs de saisie et des retards de reporting.",
    solution: "Déploiement d'Odoo intégrant ventes, achats, inventaire, comptabilité et RH, avec formation des équipes et hébergement sécurisé.",
    technologies: ["Odoo", "PostgreSQL", "Linux", "Cloud"],
    results: ["Reporting financier en temps réel", "Gain de 15h/semaine sur les tâches administratives", "Un seul système pour tous les départements"],
    gallery: ["📊", "💼", "📈"],
  },
  {
    slug: "infrastructure-reseau",
    category: "Réseaux",
    title: "Infrastructure réseau multi-sites",
    client: "Ministère de la Santé",
    location: "N'Djaména / Moundou",
    image: "🌐",
    problem: "Absence de liaison fiable entre les sites de N'Djaména et Moundou, rendant le partage de données sanitaires lent et instable.",
    solution: "Conception et déploiement d'une infrastructure réseau multi-sites avec liaisons sécurisées, redondance et supervision centralisée.",
    technologies: ["Networking", "VPN", "Windows Server", "Supervision réseau"],
    results: ["Connexion stable entre les deux sites", "Temps de synchronisation des données divisé par 5", "Infrastructure supervisée 24/7"],
    gallery: ["🌐", "🖧", "🏥"],
  },
  {
    slug: "plateforme-web",
    category: "Web",
    title: "Plateforme web institutionnelle",
    client: "Chambre de Commerce",
    location: "N'Djaména",
    image: "🖥️",
    problem: "Le site existant n'était plus à jour, non responsive, et ne permettait pas de publier des actualités ou des annuaires d'entreprises.",
    solution: "Développement d'une plateforme web moderne avec CMS intégré, annuaire d'entreprises et espace actualités.",
    technologies: ["Next.js", "PostgreSQL", "Cloud"],
    results: ["Site 100% responsive", "Publication d'actualités en autonomie", "Trafic multiplié par 3 en 6 mois"],
    gallery: ["🖥️", "📱", "🗂️"],
  },
];

export const technologies = [
  "Odoo",
  "PostgreSQL",
  "Linux",
  "Windows Server",
  "Hikvision",
  "Networking",
  "IP Cameras",
  "VoIP",
  "Cloud",
  "AI",
];

export const whyUs = [
  {
    title: "Prise en charge personnalisée",
    description: "Nous suivons chaque apprenant selon ses lacunes jusqu'à ce que l'objectif soit atteint.",
  },
  {
    title: "Équipe hautement qualifiée",
    description: "Des formateurs triés sur le volet, dévoués et attachés à la déontologie de l'enseignement.",
  },
  {
    title: "Espace de travail ouvert",
    description: "Un centre de recherche accessible tous les jours de 08h00 à 18h00 pour vos lectures et projets.",
  },
  {
    title: "Programmes en libre accès",
    description: "Des programmes d'apprentissage libres sur nos ordinateurs pour développer vos compétences.",
  },
  {
    title: "Renforcement en anglais",
    description: "Un programme de langue anglaise pour améliorer votre écoute et votre grammaire.",
  },
  {
    title: "Moyens à la hauteur",
    description: "Des infrastructures et des moyens suffisants pour répondre à toutes vos exigences.",
  },
];

export const testimonials = [
  { name: "Amina, participante", rating: 5, text: "Une formation très pratique et adaptée aux besoins professionnels." },
  { name: "Djimet, client entreprise", rating: 5, text: "Installation CCTV rapide et une équipe très professionnelle du début à la fin." },
  { name: "Fatima, participante Odoo", rating: 5, text: "J'ai enfin compris comment utiliser Odoo pour gérer notre comptabilité au quotidien." },
];

export const articles = [
  {
    slug: "formation-excel-nouvelle-session",
    category: "Formation",
    title: "Formation Excel : nouvelle session",
    date: "08 Août 2026",
    excerpt: "Une nouvelle session de formation Excel démarre en septembre, places limitées.",
    content: [
      "TechnoTchad ouvre une nouvelle session de formation Excel à partir du 10 septembre 2026. Cette formation de 20 jours s'adresse aussi bien aux débutants qu'aux utilisateurs souhaitant approfondir leurs compétences.",
      "Au programme : prise en main de l'interface, formules et fonctions, tableaux croisés dynamiques, mise en forme conditionnelle et introduction aux macros.",
      "Les places étant limitées à 20 participants, les inscriptions sont ouvertes dès maintenant via notre page Formations.",
    ],
  },
  {
    slug: "securiser-son-reseau-entreprise",
    category: "Cybersécurité",
    title: "Sécuriser son réseau d'entreprise",
    date: "02 Août 2026",
    excerpt: "Les bonnes pratiques essentielles pour protéger l'infrastructure réseau de votre entreprise.",
    content: [
      "La sécurité du réseau est souvent le maillon négligé de la transformation numérique des entreprises tchadiennes. Voici quelques bonnes pratiques essentielles.",
      "Segmentation du réseau, mise à jour régulière des équipements, pare-feu correctement configuré et sensibilisation des équipes restent les fondations d'une infrastructure saine.",
      "TechnoTchad propose un audit complet de votre réseau ainsi qu'un accompagnement pour la mise en conformité de votre infrastructure.",
    ],
  },
  {
    slug: "pourquoi-choisir-odoo",
    category: "ERP",
    title: "Pourquoi choisir Odoo pour votre PME ?",
    date: "25 Juillet 2026",
    excerpt: "Un tour d'horizon des avantages d'Odoo pour la gestion intégrée des petites et moyennes entreprises.",
    content: [
      "Odoo est aujourd'hui l'un des ERP les plus adoptés par les PME grâce à sa modularité et son coût de déploiement maîtrisé.",
      "Ventes, achats, stock, comptabilité, ressources humaines : Odoo permet de centraliser la gestion de l'entreprise dans un seul outil, avec des modules activables selon les besoins.",
      "TechnoTchad accompagne les entreprises tchadiennes dans le déploiement, la personnalisation et l'hébergement de leur instance Odoo.",
    ],
  },
];

export const stats = [
  { value: "100+", label: "Étudiants" },
  { value: "50+", label: "Projets" },
  { value: "20+", label: "Formations" },
  { value: "5+", label: "Domaines d'expertise" },
];

export const companyValues = [
  { title: "Excellence", description: "Nous visons la qualité dans chaque projet et chaque formation." },
  { title: "Proximité", description: "Une équipe locale, à l'écoute des réalités du terrain tchadien." },
  { title: "Transmission", description: "Former les compétences locales pour un impact durable." },
  { title: "Intégrité", description: "Des engagements clairs et un accompagnement transparent." },
];

export const team = [
  { name: "Hassan Ismail Nassour", role: "Directeur Général", initials: "HN" },
  { name: "Mahamat Idriss", role: "Responsable Formation", initials: "MI" },
  { name: "Amina Youssouf", role: "Cheffe de projet ERP / Odoo", initials: "AY" },
  { name: "Ousmane Djibrine", role: "Responsable CCTV & Sécurité", initials: "OD" },
];

export const partners = [
  "ONAPE",
  "3SH",
  "TWINS TECHNOLOGY",
  "IBTIKAR",
  "DOUANE",
  "MEDPHARMA",
  "STE",
];

export const companyFacts = {
  foundedYear: 2016,
  location: {
    neighborhood: "Amriguébé",
    city: "N'Djaména",
    description:
      "Situé en plein cœur du quartier Amriguébé, au nord de la ville de N'Djaména, TechnoTchad offre un cadre idéal à la formation et à l'apprentissage. Entouré de résidences privées, calme et pittoresque, ce cadre est propice à une intense activité intellectuelle et à des interactions dynamiques et enrichissantes.",
  },
  infrastructure: [
    "Salles de classe à effectifs réduits (maximum 20 étudiants par classe)",
    "Laboratoires à la pointe de la technologie en génie informatique, télécommunications et électronique",
    "Centre de recherche ultra-moderne, ouvert tous les jours de 08h00 à 18h00",
  ],
  teachingMethods: [
    "Cours théoriques et pratiques",
    "Travaux dirigés",
    "Travaux d'atelier en salle lors des regroupements",
    "Études de projet",
    "Études de cas",
  ],
  admission:
    "TechnoTchad est ouvert aux personnes qui disposent des meilleures aptitudes à poursuivre les études et qui sont susceptibles, au terme de leur formation, de s'investir efficacement dans la promotion de leur carrière professionnelle, que ce soit dans la recherche ou dans l'exercice de leur fonction.",
};

export type Filiere = {
  slug: string;
  title: string;
  icon: string;
  topics: string[];
};

export const filieres: Filiere[] = [
  {
    slug: "reseaux",
    title: "Réseaux",
    icon: "🌐",
    topics: ["CCNA", "CCNP", "MCSA", "ICDL"],
  },
  {
    slug: "programmation",
    title: "Programmation",
    icon: "💻",
    topics: ["JAVA", "C++", "Visual Basic", "C#", "VB.Net"],
  },
  {
    slug: "bases-de-donnees",
    title: "Bases de données",
    icon: "🗄️",
    topics: ["Oracle Database", "Oracle Developer", "MySQL", "MS Access", "SQL Server", "PL/SQL", "PostgreSQL"],
  },
  {
    slug: "systemes-exploitation",
    title: "Systèmes d'exploitation",
    icon: "🖥️",
    topics: ["Microsoft Windows", "Linux", "Windows Server", "Android"],
  },
  {
    slug: "creation-sites-web",
    title: "Création de sites web",
    icon: "🌍",
    topics: ["HTML", "CSS", "JavaScript", "PHP", "Joomla", "WordPress", "ASP.NET"],
  },
  {
    slug: "bureautique",
    title: "Bureautique",
    icon: "📊",
    topics: ["Word", "Excel", "PowerPoint", "Publisher", "Access", "Outlook"],
  },
  {
    slug: "bms",
    title: "BMS (Building Management System)",
    icon: "🏢",
    topics: ["CCTV", "PBX", "Contrôle d'accès", "Intercom", "Alarme incendie"],
  },
  {
    slug: "linguistique",
    title: "Linguistique",
    icon: "🗣️",
    topics: ["Langue Française", "Langue Anglaise", "Langue Arabe"],
  },
];
