// ============================================================
//  MOCK DATA  — complete fake dataset for offline testing
// ============================================================

export const MOCK_USERS = {
  "freelancer@test.com": {
    _id: "mock_freelancer_001",
    name: "Alex Turner",
    email: "freelancer@test.com",
    password: "Test@1234",
    role: "freelancer",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
    bio: "Full-stack developer with 5 years of experience in React & Node.js",
    skills: ["React", "Node.js", "MongoDB", "Tailwind CSS"],
    hourlyRate: 45,
    location: "Hyderabad, India",
    rating: 4.8,
    totalReviews: 23,
    createdAt: "2023-01-15T10:00:00Z",
  },
  "client@test.com": {
    _id: "mock_client_001",
    name: "Sara Mitchell",
    email: "client@test.com",
    password: "Test@1234",
    role: "client",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sara",
    bio: "Tech startup founder looking for talented developers",
    company: "Nexora Labs",
    location: "Bangalore, India",
    rating: 4.6,
    totalReviews: 11,
    createdAt: "2023-03-20T10:00:00Z",
  },
};

export const MOCK_PROJECTS = [
  {
    _id: "proj_001",
    title: "E-commerce Website Development",
    description: "Build a full-stack e-commerce platform with React and Node.js. Must include product listings, cart, payment gateway, and admin panel.",
    budget: 2500,
    deadline: "2025-07-01T00:00:00Z",
    status: "open",
    skills: ["React", "Node.js", "MongoDB", "Stripe"],
    client: { _id: "mock_client_001", name: "Sara Mitchell", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sara" },
    proposals: [],
    createdAt: "2025-05-01T10:00:00Z",
  },
  {
    _id: "proj_002",
    title: "Mobile App UI Design",
    description: "Design a modern UI/UX for a fitness tracking mobile app. Deliverables include Figma files and a working prototype.",
    budget: 1200,
    deadline: "2025-06-15T00:00:00Z",
    status: "open",
    skills: ["Figma", "UI/UX", "Prototyping"],
    client: { _id: "mock_client_001", name: "Sara Mitchell", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sara" },
    proposals: [],
    createdAt: "2025-05-03T10:00:00Z",
  },
  {
    _id: "proj_003",
    title: "REST API Development for SaaS Platform",
    description: "Develop scalable REST APIs for a B2B SaaS product. Include authentication, rate limiting, and full documentation.",
    budget: 3000,
    deadline: "2025-08-01T00:00:00Z",
    status: "in_progress",
    skills: ["Node.js", "Express", "PostgreSQL", "JWT"],
    client: { _id: "mock_client_001", name: "Sara Mitchell", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sara" },
    freelancer: { _id: "mock_freelancer_001", name: "Alex Turner" },
    proposals: [],
    createdAt: "2025-04-10T10:00:00Z",
  },
];

export const MOCK_POSTS = [
  {
    _id: "post_001",
    author: { _id: "mock_freelancer_001", name: "Alex Turner", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex", role: "freelancer" },
    content: "Just completed a major React performance optimization — reduced load time by 60%! Key tricks: lazy loading, memoization, and code splitting. Happy to share tips. 🚀",
    likes: ["mock_client_001"],
    comments: [
      { _id: "c1", author: { name: "Sara Mitchell" }, content: "Amazing work Alex! Would love to hear more.", createdAt: "2025-05-08T12:00:00Z" }
    ],
    createdAt: "2025-05-08T10:00:00Z",
  },
  {
    _id: "post_002",
    author: { _id: "mock_client_001", name: "Sara Mitchell", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sara", role: "client" },
    content: "Looking for a talented React developer for our next product launch! DM me if interested. Budget is flexible for the right fit. 💼",
    likes: [],
    comments: [],
    createdAt: "2025-05-09T08:00:00Z",
  },
];

export const MOCK_NOTIFICATIONS = [
  { _id: "n1", message: "Sara Mitchell sent you a connection request", read: false, createdAt: "2025-05-09T09:00:00Z", type: "connection" },
  { _id: "n2", message: "Your proposal for 'E-commerce Website' was viewed", read: false, createdAt: "2025-05-08T14:00:00Z", type: "proposal" },
  { _id: "n3", message: "New project matching your skills posted", read: true, createdAt: "2025-05-07T11:00:00Z", type: "project" },
];

export const MOCK_TASKS = {
  proj_003: [
    { _id: "t1", title: "Set up Express server", status: "done", projectId: "proj_003" },
    { _id: "t2", title: "Implement JWT authentication", status: "in_progress", projectId: "proj_003" },
    { _id: "t3", title: "Create user CRUD endpoints", status: "todo", projectId: "proj_003" },
    { _id: "t4", title: "Write API documentation", status: "todo", projectId: "proj_003" },
  ],
};

export const MOCK_CONVERSATIONS = [
  {
    _id: "conv_001",
    participants: [
      { _id: "mock_freelancer_001", name: "Alex Turner", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex" },
      { _id: "mock_client_001", name: "Sara Mitchell", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sara" },
    ],
    lastMessage: { content: "Let's discuss the project scope", createdAt: "2025-05-09T10:00:00Z" },
  },
];

export const MOCK_MESSAGES = {
  conv_001: [
    { _id: "m1", sender: { _id: "mock_client_001", name: "Sara Mitchell" }, content: "Hi Alex! I saw your profile and I'm impressed.", createdAt: "2025-05-09T09:00:00Z" },
    { _id: "m2", sender: { _id: "mock_freelancer_001", name: "Alex Turner" }, content: "Thank you Sara! I'd love to work on your project.", createdAt: "2025-05-09T09:05:00Z" },
    { _id: "m3", sender: { _id: "mock_client_001", name: "Sara Mitchell" }, content: "Let's discuss the project scope", createdAt: "2025-05-09T10:00:00Z" },
  ],
};

export const MOCK_PROPOSALS = [
  {
    _id: "prop_001",
    project: { _id: "proj_001", title: "E-commerce Website Development" },
    freelancer: { _id: "mock_freelancer_001", name: "Alex Turner" },
    coverLetter: "I have extensive experience building e-commerce platforms. I can deliver this in 6 weeks.",
    bidAmount: 2200,
    estimatedDays: 42,
    status: "pending",
    createdAt: "2025-05-05T10:00:00Z",
  },
];

export const MOCK_REVIEWS = [
  {
    _id: "rev_001",
    reviewer: { name: "Sara Mitchell", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sara" },
    rating: 5,
    comment: "Alex is an exceptional developer. Delivered on time and exceeded expectations!",
    createdAt: "2025-04-20T10:00:00Z",
  },
  {
    _id: "rev_002",
    reviewer: { name: "John Doe", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John" },
    rating: 4,
    comment: "Great communication and solid technical skills. Would hire again.",
    createdAt: "2025-03-15T10:00:00Z",
  },
];

export const MOCK_EXPERIENCE = [
  { _id: "exp_001", title: "Senior Frontend Developer", company: "TechCorp", from: "2021-01", to: "2023-12", description: "Led React development team of 5 engineers." },
  { _id: "exp_002", title: "Full Stack Developer", company: "StartupXYZ", from: "2019-06", to: "2021-01", description: "Built scalable MERN stack applications." },
];

export const MOCK_EDUCATION = [
  { _id: "edu_001", degree: "B.Tech Computer Science", school: "IIT Hyderabad", from: "2015", to: "2019" },
];
