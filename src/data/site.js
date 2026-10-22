/* ============================================================================
   SINGLE SOURCE OF TRUTH: edit your content here, nowhere else.
   Anything marked NEW was added from your redesign brief; everything else is carried
   over unchanged from the previous portfolio. Links set to null are hidden in the UI
   (never rendered as dead buttons), so add a URL when you have a verified one.
   ============================================================================ */

export const profile = {
  name: 'Aditya Kumar',
  initials: 'AK',
  roles: ['Full-stack developer', 'MERN stack builder', 'Backend engineer'], // hero typing effect
  positioning: 'I turn practical problems into thoughtful web experiences.',
  intro: 'Computer Science and Engineering student at Silicon University, exploring the space between a clean interface and a dependable backend.',
  email: 'official.adityakumar4005@gmail.com',
  phone: '+91 9262660345',
  githubLabel: 'Aditya-Kumar-Official',
  githubUrl: 'https://github.com/Aditya-Kumar-Official',
  linkedinUrl: 'https://www.linkedin.com/in/aditya-kumar-a8915034a',
  resumeUrl: '/Aditya_Kumar_Resume.pdf',
  target: 'MERN / full-stack internships'
};

export const about = {
  lead: 'I\u2019m a Computer Science and Engineering student at Silicon University, building my way toward becoming a dependable full-stack developer.',
  body: [
    'My focus is on the complete product experience: interfaces that feel considered, APIs that are easy to reason about, and systems that connect the two cleanly.',
    `I\u2019m currently looking for ${profile.target} where I can contribute, learn from real engineering teams, and keep sharpening my fundamentals.`
  ],
  photo: { alt: 'Portrait of Aditya Kumar in a black shirt with an orange lanyard, arms crossed, against a yellow wall', width: 840, height: 1260 }
};

/* Facts strip in the About section. Only CGPA counts up; the others are plain text taken from your
   timeline and profile (graduation year = end of the B.Tech range, target = profile.target). */
export const statsConfig = [
  { id: 'cgpa', label: 'Current CGPA', value: 9.4, decimals: 2, suffix: '/10' },
  { id: 'grad', label: 'B.Tech CSE, Silicon University', text: 'Class of 2028' },
  { id: 'target', label: 'Currently looking for', text: 'MERN internships' }
];

export const nav = [
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'experience', label: 'Experience' },
  { id: 'contact', label: 'Contact' }
];

export const projects = [
  {
    id: 'satquery',
    name: 'SatQuery AI',
    status: 'In progress',
    year: 'Ongoing',
    category: 'Geospatial intelligence',
    summary: 'Ask questions about satellite imagery in plain English and get analysis back, without knowing which model or workflow to use.',
    problem: 'Satellite imagery can be difficult to explore without knowing which analysis workflow or model to use.',
    role: 'Backend engineer',
    approach: [
      'Built FastAPI endpoints for satellite-image uploads, natural-language queries, and retrieval of analysis results.',
      'Integrated backend interfaces with an agent-routing layer that directs queries to satellite-image analysis modules.',
      'Collaborated on REST API integration between the React frontend, FastAPI backend, and AI analysis pipeline.'
    ],
    stack: ['Python', 'FastAPI', 'REST APIs', 'React', 'Vite'],
    architecture: ['React + Vite', 'FastAPI REST API', 'Agent routing', 'Analysis modules', 'Results API'],
    delivers: ['Image upload endpoints', 'Natural-language query endpoint', 'Result retrieval endpoint', 'Agent-to-module routing interface'],
    image: { base: '/projects/satquery', width: 1647, height: 901, alt: 'SatQuery AI workspace showing a satellite image with a natural-language query panel' },
    liveUrl: null,   // add a verified deployment URL to show a "Live demo" button
    // GitHub buttons: every { label, url } here renders as its own link. An empty list hides them.
    repos: [{ label: 'GitHub Repository', url: 'https://github.com/nitto05/TerraMind.git' }]
  },
  {
    id: 'lifelink',
    name: 'LifeLink',
    status: 'Project',
    year: '2026',
    category: 'Health & community',
    // NEW wording: "real-time" and Socket.io come from your brief and project notes. Confirm they are accurate.
    summary: 'A real-time MERN platform connecting blood donors, recipients, and hospitals.',
    problem: 'Donor coordination, blood requests, and hospital workflows need a shared digital interface.',
    role: 'Full-stack project',
    approach: [
      'Developed REST API functionality and JWT-based authentication.',
      'Worked with role-based features and MongoDB data models.',
      'Built React interfaces for donor registration, blood requests, hospital management, and admin modules.',
      'Added Socket.io so request and donor updates reach people live.' // NEW
    ],
    stack: ['MongoDB', 'Express.js', 'React', 'Node.js', 'Socket.io', 'JWT'],
    architecture: ['React UI', 'Express REST API', 'JWT + role checks', 'Socket.io live updates', 'MongoDB models'],
    delivers: ['Donor registration UI', 'Blood request workflows', 'Hospital management modules', 'Admin interfaces'],
    image: { base: '/projects/lifelink', width: 1881, height: 881, alt: 'LifeLink home page for blood donor and hospital coordination' },
    liveUrl: null,
    repos: [
      { label: 'Frontend Repository', url: 'https://github.com/Aditya-Kumar-Official/LifeLink-Frontend.git' },
      { label: 'Backend Repository', url: 'https://github.com/Aditya-Kumar-Official/LifeLink-Backend.git' }
    ]
  }
];

/* Experience timeline: oldest to newest. `cert` links a certificate preview + original PDF. */
export const timeline = [
  {
    id: 'education',
    when: '2024 \u2013 2028',
    title: 'B.Tech in Computer Science and Engineering',
    org: 'Silicon University',
    text: 'Undergraduate degree in progress, currently at a 9.40 CGPA.'
  },
  {
    id: 'codebeat',
    when: '6 June \u2013 12 July 2025',
    title: 'MERN Stack Internship',
    org: 'Codebeat',
    text: 'Certificate records completion of the compulsory internship program in MERN Stack at Codebeat.',
    cert: { base: '/certificates/codebeat', pdf: '/certificates/codebeat-mern-internship.pdf', width: 1348, height: 953,
      alt: 'Codebeat internship certificate issued to Aditya Kumar for MERN Stack, dated 6 June to 12 July 2025' }
  },
  {
    id: 'deloitte',
    when: '9 July 2025',
    title: 'Data Analytics Job Simulation',
    org: 'Deloitte, via Forage',
    text: 'Certificate of Completion for practical tasks in data analysis and forensic technology. This is a virtual job-simulation certificate, not an internship certificate.',
    cert: { base: '/certificates/deloitte', pdf: '/certificates/deloitte-data-analytics-job-simulation.pdf', width: 1671, height: 1240,
      alt: 'Deloitte Data Analytics Job Simulation certificate of completion issued to Aditya Kumar via Forage, dated 9 July 2025' }
  },
  {
    id: 'ibm',
    when: '15 November 2025',
    title: 'Getting Started with Artificial Intelligence',
    org: 'IBM SkillsBuild',
    text: 'Credential issued by IBM SkillsBuild for satisfying the requirements of this course.',
    cert: { base: '/certificates/ibm', pdf: '/certificates/ibm-getting-started-with-ai.pdf', width: 1650, height: 1275,
      verifyUrl: 'https://www.credly.com/badges/0ef3161d-f8d5-49eb-8617-8d1db8e0eac6',
      alt: 'IBM SkillsBuild certificate for Getting Started with Artificial Intelligence issued to Aditya Kumar on 15 November 2025' }
  },
  {
    id: 'aws',
    when: '25 May \u2013 30 June 2026',
    title: 'AWS Data Engineering & DevOps Industrial Training',
    org: 'Ingenious-TechWorld',
    text: 'Certificate of Appreciation for participation in industrial training on AWS Data Engineering & DevOps. This is a training appreciation certificate, not an internship certificate.',
    cert: { base: '/certificates/aws', pdf: '/certificates/aws-data-engineering-devops-training.pdf', width: 1347, height: 953,
      alt: 'Ingenious-TechWorld Certificate of Appreciation for AWS Data Engineering and DevOps industrial training, dated 25 May to 30 June 2026' }
  }
];

export const skillGroups = [
  {
    id: 'languages',
    label: 'Programming Languages',
    items: [
      { name: 'C', mark: 'C', description: 'General-purpose, low-level programming language.', category: 'Programming Languages', projects: [] },
      { name: 'Python', mark: 'Py', description: 'Used for the SatQuery AI backend and its satellite-analysis API layer.', category: 'Programming Languages', projects: ['satquery'] },
      { name: 'Java', mark: 'Ja', description: 'Object-oriented, general-purpose programming language.', category: 'Programming Languages', projects: [] },
      { name: 'JavaScript', mark: 'JS', description: 'The language used across the React frontend and Node.js application stack.', category: 'Programming Languages', projects: ['satquery', 'lifelink'] },
      { name: 'SQL', mark: 'SQL', description: 'Standard language for querying relational databases.', category: 'Programming Languages', projects: [] }
    ]
  },
  {
    id: 'frontend',
    label: 'Frontend Development',
    items: [
      { name: 'React', mark: '⚛', description: 'Builds the component-based user interfaces for the portfolio projects.', category: 'Frontend Development', projects: ['satquery', 'lifelink'] },
      { name: 'HTML', mark: '5', description: 'Provides semantic structure for web interfaces.', category: 'Frontend Development', projects: [] },
      { name: 'CSS', mark: 'CSS', description: 'Styles responsive layouts, typography, and interaction states.', category: 'Frontend Development', projects: [] },
      { name: 'Tailwind CSS', mark: 'Tw', description: 'Utility-first CSS framework for building custom interfaces.', category: 'Frontend Development', projects: [] },
      { name: 'Redux Toolkit', mark: 'RT', description: 'Official toolkit for predictable state management in React apps.', category: 'Frontend Development', projects: [] }
    ]
  },
  {
    id: 'backend',
    label: 'Backend Development',
    items: [
      { name: 'Node.js', mark: 'N', description: 'The JavaScript runtime used in the LifeLink backend stack.', category: 'Backend Development', projects: ['lifelink'] },
      { name: 'Express.js', mark: 'Ex', description: 'The API framework used for LifeLink backend routes.', category: 'Backend Development', projects: ['lifelink'] },
      { name: 'FastAPI', mark: 'API', description: 'Exposes upload, query, and result-retrieval endpoints for SatQuery AI.', category: 'Backend Development', projects: ['satquery'] },
      { name: 'REST APIs', mark: 'API', description: 'Connects frontend, backend, and analysis workflows through API endpoints.', category: 'Backend Development', projects: ['satquery', 'lifelink'] },
      // NEW: Socket.io was in your brief and project notes but missing from the old toolkit.
      { name: 'Socket.io', mark: 'IO', description: 'Powers real-time donor and request updates in LifeLink.', category: 'Backend Development', projects: ['lifelink'] },
      { name: 'JWT', mark: 'JWT', description: 'Token-based authentication used in the LifeLink backend.', category: 'Backend Development', projects: ['lifelink'] },
      { name: 'Authentication & Authorization', mark: 'Auth', description: 'Authentication and role-based authorization, as used in LifeLink.', category: 'Backend Development', projects: ['lifelink'] }
    ]
  },
  {
    id: 'database',
    label: 'Databases',
    items: [
      { name: 'MongoDB', mark: 'DB', description: 'The database used by the LifeLink MERN application.', category: 'Databases', projects: ['lifelink'] },
      { name: 'PostgreSQL', mark: 'PG', description: 'Open-source relational database.', category: 'Databases', projects: [] }
    ]
  },
  {
    id: 'tools',
    label: 'Tools & Development',
    items: [
      { name: 'Git', mark: 'Git', description: 'Version control for tracking and reviewing code changes.', category: 'Tools & Development', projects: [] },
      { name: 'GitHub', mark: 'GH', description: 'Code hosting and collaboration platform built around Git.', category: 'Tools & Development', projects: [] },
      { name: 'VS Code', mark: 'VS', description: 'Extensible code editor.', category: 'Tools & Development', projects: [] },
      { name: 'Postman', mark: 'P', description: 'Tool for building and testing API requests.', category: 'Tools & Development', projects: [] },
      { name: 'Appwrite', mark: 'Aw', description: 'Backend-as-a-service platform with auth, databases and storage.', category: 'Tools & Development', projects: [] }
    ]
  },
  {
    id: 'cloud',
    label: 'Cloud & DevOps',
    items: [
      { name: 'AWS', mark: 'AWS', description: 'Cloud platform; covered by my AWS Data Engineering & DevOps industrial-training certificate.', category: 'Cloud & DevOps', projects: [] },
      { name: 'Cloud fundamentals', mark: '☁', description: 'Core cloud concepts: compute, storage, networking and managed services.', category: 'Cloud & DevOps', projects: [] },
      { name: 'DevOps fundamentals', mark: '∞', description: 'Core DevOps concepts: version control, CI/CD and deployment workflows.', category: 'Cloud & DevOps', projects: [] }
    ]
  }
];
