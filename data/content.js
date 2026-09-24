/* ==========================================================================
   PORTFOLIO CONTENT — edit this file to change anything visitors see.
   --------------------------------------------------------------------------
   • Plain JavaScript object. Keep the commas and quotes balanced.
   • Text in `backticks` may span multiple lines.
   • Fields that are empty strings ("") are simply hidden on the site.
   • See how-to-edit.md for step-by-step examples.
   ========================================================================== */

export const content = {
  /* ---------------------------------------------------------------- PROFILE */
  profile: {
    name: "Asjad Iftikhar",
    fullName: "Muhammad Asjad Iftikhar Choudhary",
    initials: "AI", // shown in the logo, top-left
    // Rotating lines under your name in the hero section
    roles: [
      "Backend Engineer",
      "AI & Computer Vision Developer",
      "IoT Integration Engineer",
      "Cloud & DevOps Engineer",
      "Full-Stack Web & Mobile Developer",
    ],
    headline: "I build the backends of intelligent things.",
    subheadline:
      "FastAPI & Django backends, AI vision services, IoT pipelines, and the cloud infrastructure that keeps them running — from the device to the dashboard.",
    location: "Islamabad / Rawalpindi, Pakistan",
    availability: "Open to remote & on-site opportunities",
    photo: "assets/img/profile.jpg", // replace the file or change this path
    // Optional: public link to a CV/resume PDF. Leave "" to hide the button.
    resumeUrl: "",
  },

  /* ---------------------------------------------------------------- CONTACT */
  contact: {
    email: "asjadiftikhar150@gmail.com",
    whatsapp: "+923341541899", // digits with country code; "" to hide
    linkedin: "https://www.linkedin.com/in/asjad-iftikhar-ai1/",
    github: "https://github.com/Asjad150",
    fiverr: "https://www.fiverr.com/asjadiftikhar75", // "" to hide
    website: "https://bio.link/asjadiftikhar",
  },

  /* ------------------------------------------------------------------ ABOUT */
  about: {
    title: "Hardware meets software. Models meet production.",
    paragraphs: [
      `I'm a backend developer who works where software meets the physical world. I write the APIs that IoT devices talk to, deploy the AI models that watch camera streams, and set up the cloud pipelines that ship it all to production.`,
      `At Devomech Solutions GmbH I lead cloud deployments, manage Kubernetes clusters, build CI/CD for the development team and integrate IoT hardware with custom FastAPI servers. Before that, at HyperNym UK, I built and shipped computer-vision services such as face-recognition attendance, people and parking detection to production VMs on Azure.`,
      `I studied hardware and software together, so I design systems that work end to end. I'm a Microsoft Certified Azure AI Engineer Associate with 35+ Coursera certificates, and I enjoy running knowledge-transfer sessions for the next group of engineers.`,
    ],
    stats: [
      { value: 2, suffix: "+", label: "Years in industry" },
      { value: 35, suffix: "+", label: "Coursera certificates" },
      { value: 4, suffix: "+", label: "AI services in production" },
      { value: 3.31, suffix: "", label: "CGPA · BS Computer Science", decimals: 2 },
    ],
    hobbies: ["Basketball", "Table Tennis"],
    languages: ["English", "Urdu"],
  },

  /* ------------------------------------------------------ SERVICES / WHAT I DO
     icon: one of  mobile | web | next | api | cloud | ai | iot | data        */
  services: [
    {
      icon: "api",
      title: "Backend APIs",
      text: "Production-grade REST & real-time backends with FastAPI (Uvicorn) or Django / Django REST Framework — auth, queues, WebSockets, PostgreSQL and clean docs.",
      tags: ["FastAPI", "Django", "DRF", "PostgreSQL", "Redis", "WebSockets"],
    },
    {
      icon: "mobile",
      title: "Mobile Apps — Android & iOS",
      text: "Cross-platform mobile apps in React Native with Expo, shipped to both the Play Store and the App Store from a single codebase.",
      tags: ["React Native", "Expo", "Android", "iOS", "EAS"],
    },
    {
      icon: "web",
      title: "Web Portals",
      text: "Dashboards, admin panels and customer portals built with React on the front and Node.js on the back.",
      tags: ["React", "Node.js", "Express", "REST"],
    },
    {
      icon: "next",
      title: "Next.js Monoliths",
      text: "Full-stack Next.js portals where UI, API routes and server rendering ship as one deployable unit. Simple to host and fast to iterate on.",
      tags: ["Next.js", "SSR", "API Routes", "Monolith"],
    },
    {
      icon: "cloud",
      title: "Cloud & DevOps",
      text: "Azure and AWS infrastructure with CI/CD through GitHub Actions, images published to GHCR or Docker Hub, or deployed straight to cloud platforms. Kubernetes when you need scale.",
      tags: ["Azure", "AWS", "Docker", "Kubernetes", "GitHub Actions", "GHCR", "Docker Hub"],
    },
    {
      icon: "ai",
      title: "AI & Computer Vision",
      text: "Custom detection and recognition models (people, faces, fire & smoke, seatbelts, parking) running on RTSP camera streams and served as APIs.",
      tags: ["PyTorch", "OpenCV", "CUDA", "scikit-learn", "RTSP"],
    },
    {
      icon: "iot",
      title: "IoT Integrations",
      text: "Device telemetry from hardware to IoT Hub to event listeners to database to dashboard. I also help source hardware from vendors and connect it to the cloud.",
      tags: ["Azure IoT Hub", "MQTT", "TCP/UDP", "Event Listeners"],
    },
    {
      icon: "data",
      title: "Data & Dashboards",
      text: "Turning telemetry and business data into decisions with Power BI, Microsoft Fabric and Grafana dashboards.",
      tags: ["Power BI", "MS Fabric", "Grafana", "Pandas"],
    },
  ],

  /* ------------------------------------------------------------- TECH STACK
     These scroll in the two marquee rows.                                    */
  stack: [
    ["Python", "FastAPI", "Django", "DRF", "Flask", "Node.js", "Express", "PostgreSQL", "MySQL", "Oracle", "Redis", "MQTT", "WebSockets"],
    ["React", "React Native", "Expo", "Next.js", "Azure", "AWS", "Docker", "Kubernetes", "GitHub Actions", "GHCR", "Docker Hub", "PyTorch", "OpenCV", "Power BI", "n8n", "Power Automate"],
  ],

  /* ------------------------------------------------------------- EXPERIENCE */
  experience: [
    {
      company: "Devomech Solutions GmbH",
      url: "https://devomech.com/",
      role: "Associate II — Dev (IoT, AI & DevOps)",
      period: "Feb 2026 — Present",
      location: "Islamabad, Pakistan",
      points: [
        "Senior resource managing cloud deployments.",
        "IoT integrations with custom FastAPI servers.",
        "Managing Kubernetes clusters.",
        "Implementing CI/CD pipelines for the development team.",
        "Running knowledge-transfer sessions for trainees.",
      ],
      tags: ["FastAPI", "Kubernetes", "CI/CD", "IoT", "Cloud"],
    },
    {
      company: "HyperNym UK",
      url: "",
      role: "Backend IoT & AI Developer",
      period: "Sep 2024 — Sep 2025",
      location: "Islamabad, Pakistan",
      points: [
        "Wrote APIs and backends for IoT devices integrating with a private-cloud IoT Hub.",
        "Built and deployed AI services with Docker on production Azure VMs: human detection, parking detection, gender detection and face recognition for the office attendance system.",
        "Built end-to-end POCs for customer acquisition, e.g. hardware telemetry → IoT Hub → FastAPI event listener → PostgreSQL → Power BI dashboard.",
        "Helped the team source hardware from vendors and integrate it with our cloud.",
        "Kept documentation current and managed delivery on Jira.",
      ],
      tags: ["Azure", "Docker", "FastAPI", "OpenCV", "PostgreSQL", "Power BI"],
    },
  ],

  /* --------------------------------------------------------------- PROJECTS
     category: used by the filter buttons. Any text works — new categories
               create new filter buttons automatically.
     links:    add as many as you like: { label: "Live", url: "https://..." }
     image:    optional screenshot path, e.g. "assets/img/projects/myapp.jpg"
     featured: true makes the card wider                                      */
  projects: [
    {
      title: "Hajji Assist — Pilgrim Companion Platform",
      category: "Full-Stack",
      featured: true,
      year: "2026",
      text: "A two-platform system for a Hajj travel operator. The React Native (Expo) app for iOS & Android gives each pilgrim their schedule, travel, hotel and transfer details, prayer times and guides, plus live chat with staff and one-tap emergency alerts. A Next.js 14 admin portal doubles as the mobile API, with role-based staff access, bulk Excel import, reports and exports. Runs on PostgreSQL (Prisma) with Docker Compose and Nginx on a VPS.",
      tags: ["React Native", "Expo", "Next.js 14", "PostgreSQL", "Prisma", "Docker Compose", "Nginx", "JWT"],
      image: "",
      links: [], // private client project; add App Store / Play Store links here once public
    },
    {
      title: "AI Attendance & Vision Suite",
      category: "AI",
      featured: false,
      year: "2025",
      text: "Face-recognition office attendance, plus human, gender and parking-space detection services, containerised and running on production Azure VMs.",
      tags: ["OpenCV", "Face Recognition", "Docker", "Azure"],
      image: "",
      links: [],
    },
    {
      title: "Text-to-Video Generator",
      category: "AI",
      featured: true,
      year: "2024",
      text: "Final-year thesis: a generative model that takes a text prompt, as you would give ChatGPT, and produces a video that matches its context. Built on UNET and CLIP, with GPU VRAM profiling and steganography experiments.",
      tags: ["PyTorch", "CUDA", "cuDNN", "UNET", "CLIP"],
      image: "",
      links: [],
    },
    {
      title: "IoT Telemetry → Power BI Pipeline",
      category: "IoT",
      featured: false,
      year: "2025",
      text: "End-to-end POC for customer acquisition: hardware telemetry streamed through IoT Hub, consumed by a FastAPI event listener, stored in PostgreSQL and shown on live Power BI dashboards.",
      tags: ["Azure IoT Hub", "FastAPI", "PostgreSQL", "Power BI"],
      image: "",
      links: [],
    },
    {
      title: "Fire & Smoke Detection",
      category: "AI",
      featured: false,
      year: "2025",
      text: "A custom model built from scratch to detect fire and smoke, designed to run on RTSP camera streams.",
      tags: ["OpenCV", "Deep Learning", "RTSP"],
      image: "",
      links: [{ label: "GitHub", url: "https://github.com/Asjad150/OpenCV-fire-smoke-detection" }],
    },
    {
      title: "Seatbelt Detection",
      category: "AI",
      featured: false,
      year: "2025",
      text: "A custom model built from scratch to detect seatbelt usage, designed to run on driver-side dashcams.",
      tags: ["OpenCV", "Computer Vision", "Edge"],
      image: "",
      links: [{ label: "GitHub", url: "https://github.com/Asjad150/OpenCV-seatbelt-detection" }],
    },
    {
      title: "OpenCV Detection API",
      category: "Backend",
      featured: false,
      year: "2025",
      text: "Serves computer-vision detection models over an HTTP API so other services and dashboards can call them.",
      tags: ["Python", "OpenCV", "REST API"],
      image: "",
      links: [{ label: "GitHub", url: "https://github.com/Asjad150/OpenCV-Detection-API" }],
    },
    {
      title: "Kubernetes & CI/CD Platform",
      category: "DevOps",
      featured: false,
      year: "2026",
      text: "Cluster management and automated build, test and deploy pipelines for the Devomech development team: container images, registries and repeatable releases.",
      tags: ["Kubernetes", "GitHub Actions", "Docker", "GHCR"],
      image: "",
      links: [],
    },
    {
      title: "Power Automate Service Checker",
      category: "Automation",
      featured: false,
      year: "2025",
      text: "An automation flow that monitors service health and flags outages.",
      tags: ["Power Automate", "Monitoring"],
      image: "",
      links: [{ label: "GitHub", url: "https://github.com/Asjad150/PowerAutomate-serviceChecker" }],
    },
    {
      title: "My Virtual Clock",
      category: "Web",
      featured: false,
      year: "2025",
      text: "A web project for myvirtualclock.com.",
      tags: ["Web"],
      image: "",
      links: [{ label: "GitHub", url: "https://github.com/Asjad150/myvirtualclock.com" }],
    },
  ],

  /* ---------------------------------------------------------- CERTIFICATIONS
     The first item with featured: true gets the big holographic card.        */
  certifications: [
    {
      featured: true,
      title: "Microsoft Certified: Azure AI Engineer Associate",
      issuer: "Microsoft",
      date: "Jan 2025",
      text: "Validates designing and implementing Azure AI solutions: computer vision, natural language processing, knowledge mining and generative AI on Azure AI services.",
      url: "https://lnkd.in/d9ZXaz83",
    },
    {
      featured: false,
      title: "35 Coursera Certificates",
      issuer: "Google · University of Colorado · Infosync & more",
      date: "Since 2022",
      text: "Structured coursework across machine learning, data, cloud and software engineering.",
      url: "https://www.linkedin.com/in/asjad-iftikhar-ai1/details/certifications/",
    },
  ],

  /* --------------------------------------------------------------- EDUCATION */
  education: [
    {
      degree: "BS Computer Science",
      school: "National University of Technology (NUTECH), Islamabad",
      url: "https://nutech.edu.pk/",
      period: "2020 — 2024",
      detail: "CGPA 3.31 / 4 · EQF Level 6 · Thesis: Text-to-Video Generator",
    },
  ],

  /* --------------------------------------------------------- RECOMMENDATIONS
     Shown as reference cards. Contact details deliberately omitted.          */
  recommendations: [
    {
      name: "Dr Sultan Daud",
      title: "Associate Professor, Computer Science — NUTECH",
      url: "https://drive.google.com/file/d/1zgcuMURz5h3RFYXO2iUnIDS8FNSsejCi/view?usp=sharing",
    },
    {
      name: "Dr Muhammad Rashid",
      title: "Head of Department, Computer Science — NUTECH",
      url: "https://docs.google.com/document/d/13AWTQITE2IoaJRZSfyddKxlYAFZE9N_6/edit?usp=sharing",
    },
  ],

  /* --------------------------------------------------------- SECTION TITLES
     The small label ("eyebrow") and the big heading of every section.        */
  sections: {
    about:      { eyebrow: "01 — About",          title: "" }, // uses about.title
    services:   { eyebrow: "02 — What I build",   title: "From API to App Store to Kubernetes." },
    experience: { eyebrow: "03 — Experience",     title: "Where I've shipped." },
    projects:   { eyebrow: "04 — Selected work",  title: "Things I've engineered." },
    certs:      { eyebrow: "05 — Credentials",    title: "Certified. Trained. Recommended." },
    contact:    { eyebrow: "06 — Contact",        title: "Let's build something intelligent." },
  },

  /* ------------------------------------------------------------------ FOOTER */
  footer: {
    note: "Designed & engineered with Three.js, custom GLSL shaders and a lot of coffee.",
  },
};
