// Edit the content here. Keep URLs as placeholders until you have verified destinations.
export const profile = {
  name: 'Aditya Kumar',
  role: 'Full-stack developer in the making.',
  positioning: 'I turn practical problems into thoughtful web experiences.',
  intro: 'Computer Science and Engineering student at Silicon University, exploring the space between a clean interface and a dependable backend.',
  email: 'official.adityakumar4005@gmail.com',
  phone: '+91 9262660345',
  githubLabel: 'Aditya-Kumar-Official',
  githubUrl: 'https://github.com/Aditya-Kumar-Official',
  linkedinUrl: 'https://www.linkedin.com/in/aditya-kumar-a8915034a',
  target: 'MERN / full-stack internships'
};

export const projects = [
  {
    id: 'satquery',
    number: '01',
    name: 'SatQuery AI',
    status: 'ONGOING',
    year: 'Ongoing',
    category: 'Geospatial intelligence',
    summary: 'A natural-language interface for asking questions about satellite imagery.',
    problem: 'Satellite imagery can be difficult to explore without knowing which analysis workflow or model to use.',
    role: 'Backend engineer',
    contribution: [
      'Built FastAPI endpoints for satellite-image uploads, natural-language queries, and retrieval of analysis results.',
      'Integrated backend interfaces with an agent-routing layer that directs queries to satellite-image analysis modules.',
      'Collaborated on REST API integration between the React frontend, FastAPI backend, and AI analysis pipeline.'
    ],
    stack: ['Python', 'FastAPI', 'REST APIs', 'React', 'Vite'],
    architecture: ['React + Vite', 'FastAPI REST API', 'Agent routing', 'Analysis modules', 'Results API'],
    features: ['Image upload endpoints', 'Natural-language query endpoint', 'Result retrieval endpoint', 'Agent-to-module routing interface'],
    liveUrl: '[LIVE_URL]',
    githubUrl: '[GITHUB_URL]',
    screenshots: '[SCREENSHOTS]'
  },
  {
    id: 'lifelink',
    number: '02',
    name: 'LifeLink',
    status: 'PROJECT',
    year: '2026',
    category: 'Health & community',
    summary: 'A MERN application connecting blood donors, recipients, and hospitals.',
    problem: 'Donor coordination, blood requests, and hospital workflows need a shared digital interface.',
    role: 'Full-stack project',
    contribution: [
      'Developed REST API functionality and JWT-based authentication.',
      'Worked with role-based features and MongoDB data models.',
      'Built React interfaces for donor registration, blood requests, hospital management, and admin modules.'
    ],
    stack: ['MongoDB', 'Express.js', 'React', 'Node.js', 'JWT'],
    architecture: ['React UI', 'Express REST API', 'JWT + role checks', 'MongoDB models'],
    features: ['Donor registration UI', 'Blood request workflows', 'Hospital management modules', 'Admin interfaces'],
    liveUrl: '[LIVE_URL]',
    githubUrl: '[GITHUB_URL]',
    screenshots: '[SCREENSHOTS]'
  }
];

export const skillGroups = [
  {
    id: 'languages',
    label: 'Programming Languages',
    items: [
      { name: 'C', mark: 'C', description: 'A programming language listed in the portfolio toolkit.', category: 'Programming Languages', projects: [] },
      { name: 'Python', mark: 'Py', description: 'Used for the SatQuery AI backend and its satellite-analysis API layer.', category: 'Programming Languages', projects: ['satquery'] },
      { name: 'Java', mark: 'Ja', description: 'A programming language listed in the portfolio toolkit.', category: 'Programming Languages', projects: [] },
      { name: 'JavaScript', mark: 'JS', description: 'The language used across the React frontend and Node.js application stack.', category: 'Programming Languages', projects: ['satquery', 'lifelink'] },
      { name: 'SQL', mark: 'SQL', description: 'A database query language listed in the existing toolkit.', category: 'Programming Languages', projects: [] }
    ]
  },
  {
    id: 'frontend',
    label: 'Frontend Development',
    items: [
      { name: 'React', mark: '⚛', description: 'Builds the component-based user interfaces for the portfolio projects.', category: 'Frontend Development', projects: ['satquery', 'lifelink'] },
      { name: 'HTML', mark: '5', description: 'Provides semantic structure for web interfaces.', category: 'Frontend Development', projects: [] },
      { name: 'CSS', mark: 'CSS', description: 'Styles responsive layouts, typography, and interaction states.', category: 'Frontend Development', projects: [] },
      { name: 'Tailwind CSS', mark: 'Tw', description: 'A utility-first CSS framework listed in the existing toolkit.', category: 'Frontend Development', projects: [] },
      { name: 'Redux Toolkit', mark: 'RT', description: 'A state-management toolkit listed in the existing portfolio skills.', category: 'Frontend Development', projects: [] }
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
      { name: 'JWT', mark: 'JWT', description: 'Token-based authentication is part of the LifeLink backend stack.', category: 'Backend Development', projects: ['lifelink'] },
      { name: 'Authentication & Authorization', mark: 'Auth', description: 'Authentication and role-based authorization are listed in the LifeLink project details.', category: 'Backend Development', projects: ['lifelink'] }
    ]
  },
  {
    id: 'database',
    label: 'Databases',
    items: [
      { name: 'MongoDB', mark: 'DB', description: 'The database used by the LifeLink MERN application.', category: 'Databases', projects: ['lifelink'] },
      { name: 'PostgreSQL', mark: 'PG', description: 'A database listed in the existing portfolio toolkit.', category: 'Databases', projects: [] }
    ]
  },
  {
    id: 'tools',
    label: 'Tools & Development',
    items: [
      { name: 'Git', mark: 'Git', description: 'Version control tool listed in the portfolio toolkit.', category: 'Tools & Development', projects: [] },
      { name: 'GitHub', mark: 'GH', description: 'Code hosting and collaboration platform listed in the portfolio toolkit.', category: 'Tools & Development', projects: [] },
      { name: 'VS Code', mark: 'VS', description: 'Code editor listed in the portfolio toolkit.', category: 'Tools & Development', projects: [] },
      { name: 'Postman', mark: 'P', description: 'API testing tool listed in the portfolio toolkit.', category: 'Tools & Development', projects: [] },
      { name: 'Appwrite', mark: 'Aw', description: 'A development platform listed in the existing portfolio toolkit.', category: 'Tools & Development', projects: [] }
    ]
  },
  {
    id: 'cloud',
    label: 'Cloud & DevOps',
    items: [
      { name: 'AWS', mark: 'AWS', description: 'Listed in the toolkit and covered by the supplied AWS Data Engineering & DevOps industrial-training certificate.', category: 'Cloud & DevOps', projects: [] },
      { name: 'Cloud fundamentals', mark: '☁', description: 'Cloud fundamentals are listed in the existing portfolio toolkit.', category: 'Cloud & DevOps', projects: [] },
      { name: 'DevOps fundamentals', mark: '∞', description: 'DevOps fundamentals are listed in the existing portfolio toolkit.', category: 'Cloud & DevOps', projects: [] }
    ]
  }
];

