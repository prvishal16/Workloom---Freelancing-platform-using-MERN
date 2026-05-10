// ============================================================
//  MOCK INTERCEPTOR  — intercepts all axios calls when
//  VITE_MOCK_MODE=true  (or backend is unreachable)
// ============================================================
import axios from "axios";
import {
  MOCK_USERS, MOCK_PROJECTS, MOCK_POSTS, MOCK_NOTIFICATIONS,
  MOCK_TASKS, MOCK_CONVERSATIONS, MOCK_MESSAGES, MOCK_PROPOSALS,
  MOCK_REVIEWS, MOCK_EXPERIENCE, MOCK_EDUCATION,
} from "./mockData";

// Simple in-memory state so changes persist within the session
let _users = { ...MOCK_USERS };
let _projects = [...MOCK_PROJECTS];
let _posts = [...MOCK_POSTS];
let _notifications = [...MOCK_NOTIFICATIONS];
let _tasks = { ...MOCK_TASKS };
let _conversations = [...MOCK_CONVERSATIONS];
let _messages = { ...MOCK_MESSAGES };
let _proposals = [...MOCK_PROPOSALS];

const delay = (ms = 300) => new Promise((r) => setTimeout(r, ms));

const mockResolve = (data) => ({ data, status: 200, statusText: "OK", headers: {}, config: {} });
const mockToken = (userId) => `mock_jwt_token_${userId}_${Date.now()}`;

// ── Route Dispatcher ──────────────────────────────────────────────────────────
async function dispatch(config) {
  const { method, url, data: rawData } = config;
  const body = rawData ? (typeof rawData === "string" ? JSON.parse(rawData) : rawData) : {};
  const m = method.toLowerCase();

  await delay();

  // ── AUTH ──────────────────────────────────────────────────────────────────
  if (url.includes("/api/auth/register")) {
    const existing = Object.values(_users).find((u) => u.email === body.email);
    if (existing) throw { response: { data: { message: "Email already registered" } } };
    const newUser = {
      _id: `mock_user_${Date.now()}`,
      name: body.name,
      email: body.email,
      password: body.password,
      role: body.role || "freelancer",
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(body.name)}`,
      bio: "",
      skills: [],
      createdAt: new Date().toISOString(),
    };
    _users[body.email] = newUser;
    return mockResolve({ token: mockToken(newUser._id), user: newUser });
  }

  if (url.includes("/api/auth/login")) {
    const user = Object.values(_users).find((u) => u.email === body.email);
    if (!user || user.password !== body.password)
      throw { response: { data: { message: "Invalid email or password" } } };
    return mockResolve({ token: mockToken(user._id), user });
  }

  if (url.includes("/api/auth/me")) {
    const stored = localStorage.getItem("user");
    if (stored) return mockResolve(JSON.parse(stored));
    throw { response: { status: 401, data: { message: "Not authenticated" } } };
  }

  // ── USERS / PROFILE ───────────────────────────────────────────────────────
  if (url.match(/\/api\/users\/me$/) && m === "patch") {
    const stored = JSON.parse(localStorage.getItem("user") || "{}");
    const updated = { ...stored, ...body };
    localStorage.setItem("user", JSON.stringify(updated));
    return mockResolve(updated);
  }
  if (url.includes("/api/users/me/change-password")) return mockResolve({ message: "Password changed" });
  if (url.includes("/api/users/me/avatar")) return mockResolve({ avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=updated" });
  if (url.includes("/api/users/me") && m === "delete") return mockResolve({ message: "Account deleted" });
  if (url.match(/\/api\/users\/([^/]+)\/connection-status/)) return mockResolve({ status: "none" });
  if (url.match(/\/api\/users\/([^/]+)\/connect/)) return mockResolve({ message: "Request sent" });
  if (url.match(/\/api\/users\/([^/]+)\/reviews/)) return mockResolve(MOCK_REVIEWS);
  if (url.match(/\/api\/users\/([^/]+)$/)) {
    const id = url.split("/").pop();
    const user = Object.values(_users).find((u) => u._id === id) || Object.values(_users)[0];
    return mockResolve(user);
  }

  // ── PROJECTS ──────────────────────────────────────────────────────────────
  if (url.includes("/api/projects/my")) {
    const me = JSON.parse(localStorage.getItem("user") || "{}");
    const mine = _projects.filter((p) => p.client?._id === me._id || p.freelancer?._id === me._id);
    return mockResolve(mine);
  }
  if (url.match(/\/api\/projects\/([^/]+)\/proposals$/) && m === "post") {
    const newProp = { _id: `prop_${Date.now()}`, ...body, status: "pending", createdAt: new Date().toISOString() };
    _proposals.push(newProp);
    return mockResolve(newProp);
  }
  if (url.match(/\/api\/projects\/([^/]+)\/proposals$/)) {
    return mockResolve(_proposals);
  }
  if (url.match(/\/api\/projects\/([^/]+)\/tasks$/) && m === "post") {
    const pId = url.split("/")[3];
    const t = { _id: `t_${Date.now()}`, ...body, status: "todo", projectId: pId };
    _tasks[pId] = [...(_tasks[pId] || []), t];
    return mockResolve(t);
  }
  if (url.match(/\/api\/projects\/([^/]+)\/tasks\/([^/]+)/)) {
    const pId = url.split("/")[3];
    const tId = url.split("/")[5];
    _tasks[pId] = (_tasks[pId] || []).map((t) => t._id === tId ? { ...t, ...body } : t);
    return mockResolve(_tasks[pId].find((t) => t._id === tId));
  }
  if (url.match(/\/api\/projects\/([^/]+)\/tasks$/)) {
    const pId = url.split("/")[3];
    return mockResolve(_tasks[pId] || []);
  }
  if (url.match(/\/api\/projects\/([^/]+)\/deliverables$/) && m === "post") {
    return mockResolve({ _id: `del_${Date.now()}`, fileUrl: "#", createdAt: new Date().toISOString() });
  }
  if (url.match(/\/api\/projects\/([^/]+)\/deliverables$/)) return mockResolve([]);
  if (url.match(/\/api\/projects\/([^/]+)\/project-messages$/)) return mockResolve([]);
  if (url.match(/\/api\/projects\/([^/]+)\/messages$/)) return mockResolve([]);
  if (url.match(/\/api\/projects\/([^/]+)\/reviews\/me/)) return mockResolve(null);
  if (url.match(/\/api\/projects\/([^/]+)\/reviews$/) && m === "post") {
    return mockResolve({ _id: `rev_${Date.now()}`, ...body, createdAt: new Date().toISOString() });
  }
  if (url.match(/\/api\/projects\/([^/]+)\/reviews$/)) return mockResolve(MOCK_REVIEWS);
  if (url.match(/\/api\/projects\/([^/]+)\/invoices$/) && m === "post") {
    return mockResolve({ _id: `inv_${Date.now()}`, ...body, status: "pending", createdAt: new Date().toISOString() });
  }
  if (url.match(/\/api\/projects\/([^/]+)\/invoices$/)) return mockResolve([]);
  if (url.match(/\/api\/projects\/([^/]+)$/) && m === "get") {
    const id = url.split("/").pop();
    const proj = _projects.find((p) => p._id === id) || _projects[0];
    return mockResolve(proj);
  }
  if (url === "/api/projects" && m === "post") {
    const me = JSON.parse(localStorage.getItem("user") || "{}");
    const newProj = { _id: `proj_${Date.now()}`, ...body, status: "open", client: me, proposals: [], createdAt: new Date().toISOString() };
    _projects.unshift(newProj);
    return mockResolve(newProj);
  }
  if (url === "/api/projects" && m === "get") return mockResolve(_projects);

  // ── PROPOSALS ─────────────────────────────────────────────────────────────
  if (url === "/api/proposals/my") return mockResolve(_proposals);
  if (url.match(/\/api\/proposals\/([^/]+)$/) && m === "patch") {
    const id = url.split("/").pop();
    _proposals = _proposals.map((p) => p._id === id ? { ...p, ...body } : p);
    return mockResolve(_proposals.find((p) => p._id === id));
  }

  // ── POSTS / FEED ──────────────────────────────────────────────────────────
  if (url === "/api/posts" && m === "post") {
    const me = JSON.parse(localStorage.getItem("user") || "{}");
    const newPost = { _id: `post_${Date.now()}`, author: me, content: body.content, likes: [], comments: [], createdAt: new Date().toISOString() };
    _posts.unshift(newPost);
    return mockResolve(newPost);
  }
  if (url === "/api/posts") return mockResolve(_posts);
  if (url.match(/\/api\/posts\/([^/]+)\/like/)) {
    const id = url.split("/")[3];
    const me = JSON.parse(localStorage.getItem("user") || "{}");
    _posts = _posts.map((p) => {
      if (p._id !== id) return p;
      const liked = p.likes.includes(me._id);
      return { ...p, likes: liked ? p.likes.filter((l) => l !== me._id) : [...p.likes, me._id] };
    });
    return mockResolve(_posts.find((p) => p._id === id));
  }
  if (url.match(/\/api\/posts\/([^/]+)\/comment/)) {
    const id = url.split("/")[3];
    const me = JSON.parse(localStorage.getItem("user") || "{}");
    const comment = { _id: `c_${Date.now()}`, author: me, content: body.content, createdAt: new Date().toISOString() };
    _posts = _posts.map((p) => p._id === id ? { ...p, comments: [...p.comments, comment] } : p);
    return mockResolve(comment);
  }

  // ── NOTIFICATIONS ─────────────────────────────────────────────────────────
  if (url === "/api/notifications/unread-count") return mockResolve({ count: _notifications.filter((n) => !n.read).length });
  if (url.includes("/api/notifications/read")) { _notifications = _notifications.map((n) => ({ ...n, read: true })); return mockResolve({ message: "ok" }); }
  if (url === "/api/notifications") return mockResolve(_notifications);

  // ── CONVERSATIONS / MESSAGES ───────────────────────────────────────────────
  if (url === "/api/conversations" && m === "post") {
    const newConv = { _id: `conv_${Date.now()}`, participants: [], lastMessage: null };
    _conversations.push(newConv);
    return mockResolve(newConv);
  }
  if (url === "/api/conversations") return mockResolve(_conversations);
  if (url.match(/\/api\/conversations\/([^/]+)\/messages$/) && m === "post") {
    const convId = url.split("/")[3];
    const me = JSON.parse(localStorage.getItem("user") || "{}");
    const msg = { _id: `m_${Date.now()}`, sender: me, content: body.content, createdAt: new Date().toISOString() };
    _messages[convId] = [...(_messages[convId] || []), msg];
    return mockResolve(msg);
  }
  if (url.match(/\/api\/conversations\/([^/]+)\/messages$/)) {
    const convId = url.split("/")[3];
    return mockResolve(_messages[convId] || []);
  }

  // ── CONNECTIONS ───────────────────────────────────────────────────────────
  if (url === "/api/connections/pending") return mockResolve([]);
  if (url === "/api/connections") return mockResolve([]);
  if (url.match(/\/api\/connections\/([^/]+)$/)) return mockResolve({ message: "ok" });

  // ── SEARCH ────────────────────────────────────────────────────────────────
  if (url.includes("/api/search")) return mockResolve({ users: Object.values(_users), projects: _projects });

  // ── EXPERIENCE / EDUCATION ────────────────────────────────────────────────
  if (url.match(/\/api\/experience\/user\//) && m === "get") return mockResolve(MOCK_EXPERIENCE);
  if (url === "/api/experience" && m === "post") return mockResolve({ _id: `exp_${Date.now()}`, ...body });
  if (url.match(/\/api\/experience\//) && m === "delete") return mockResolve({ message: "deleted" });
  if (url.match(/\/api\/education\/user\//) && m === "get") return mockResolve(MOCK_EDUCATION);
  if (url === "/api/education" && m === "post") return mockResolve({ _id: `edu_${Date.now()}`, ...body });
  if (url.match(/\/api\/education\//) && m === "delete") return mockResolve({ message: "deleted" });

  // ── PAYMENTS ──────────────────────────────────────────────────────────────
  if (url.includes("/api/payments/create-payment-intent")) return mockResolve({ clientSecret: "mock_secret_123" });
  if (url.includes("/api/payments/verify")) return mockResolve({ message: "Payment verified" });

  // ── FALLBACK ──────────────────────────────────────────────────────────────
  console.warn("[MOCK] Unhandled route:", m.toUpperCase(), url);
  return mockResolve({});
}

// ── Install interceptor ───────────────────────────────────────────────────────
let interceptorInstalled = false;

export function installMockInterceptor() {
  if (interceptorInstalled) return;
  interceptorInstalled = true;

  axios.interceptors.request.use(async (config) => {
    // Mark request so response interceptor can handle it
    config._mock = true;
    return config;
  });

  axios.interceptors.response.use(
    (response) => response,
    async (error) => {
      const config = error.config;
      if (!config) return Promise.reject(error);

      // If backend unreachable (network error) OR mock mode enabled, use mock
      const isMockMode = import.meta.env.VITE_MOCK_MODE === "true";
      const isNetworkError = !error.response;

      if (isMockMode || isNetworkError) {
        try {
          const mockResponse = await dispatch(config);
          return mockResponse;
        } catch (mockError) {
          return Promise.reject(mockError);
        }
      }

      return Promise.reject(error);
    }
  );

  console.log("%c[WORKLOOM] 🧪 Mock interceptor active — no backend needed!", "color: #22c55e; font-weight: bold; font-size: 13px;");
}
