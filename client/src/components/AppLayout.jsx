import React, { useEffect, useState } from "react";
import {
  NavLink,
  Outlet,
  useNavigate,
  useLocation,
  Link,
} from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { socket } from "../services/socket";
import {
  Home,
  Briefcase,
  MessageSquare,
  Bell,
  Search,
  Menu,
  X,
  BriefcaseBusiness,
} from "lucide-react";
import { toast } from "react-toastify";
import {
  getUnreadNotificationCount,
  markNotificationsAsRead,
} from "../services/api";
import { AnimatePresence, motion } from "framer-motion";

const AppLayout = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [notificationCount, setNotificationCount] = useState(0);
  const [messageCount, setMessageCount] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!user) {
      if (socket.connected) socket.disconnect();
      return;
    }
    socket.connect();
    socket.on("connect", () => socket.emit("authenticate", user._id));

    const fetchInitialCounts = async () => {
      try {
        const { count } = await getUnreadNotificationCount();
        setNotificationCount(count);
      } catch (error) {
        console.error("Could not fetch notification count:", error);
      }
    };
    fetchInitialCounts();

    const handleNewNotification = (notification) => {
      setNotificationCount((prev) => prev + 1);
      toast.info(notification.message || "You have a new notification!");
    };

    const handleNewMessage = () => {
      if (!location.pathname.startsWith("/messages")) {
        setMessageCount((prev) => prev + 1);
      }
    };

    socket.on("newNotification", handleNewNotification);
    socket.on("newMessageNotification", handleNewMessage);

    return () => {
      if (socket.connected) socket.disconnect();
      socket.off("connect");
      socket.off("newNotification", handleNewNotification);
      socket.off("newMessageNotification", handleNewMessage);
    };
  }, [user, location.pathname]);

  useEffect(() => {
    const clearBadgesOnVisit = async () => {
      if (
        location.pathname.startsWith("/notifications") &&
        notificationCount > 0
      ) {
        try {
          await markNotificationsAsRead();
          setNotificationCount(0);
        } catch (error) {
          console.error("Could not mark notifications as read:", error);
        }
      }
      if (location.pathname.startsWith("/messages")) {
        setMessageCount(0);
      }
    };
    clearBadgesOnVisit();
  }, [location.pathname, notificationCount]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${searchTerm.trim()}`);
    }
  };

  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
      isActive
        ? "bg-blue-50 text-blue-600"
        : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
    }`;

  if (!user) {
    return <div className="min-h-screen bg-gray-50" />;
  }

  const isFreelancer = user?.role === "freelancer";

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <header className="bg-white shadow-sm sticky top-0 z-30">
        <nav className="w-full px-4 sm:px-6 lg:px-8">
          <div className="hidden md:flex items-center justify-between h-16 w-full">
            <Link
              to="/home"
              className="flex-shrink-0 font-bold text-2xl text-blue-600"
            >
              WorkLoom
            </Link>

            <form
              onSubmit={handleSearchSubmit}
              className="relative flex-1 max-w-lg mx-6 hidden lg:block"
            >
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-gray-100 border-transparent rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
              />
            </form>

            <div className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-lg border border-gray-200">
              <NavLink to="/home" className={navLinkClass} end title="Home">
                <Home size={20} />
                <span className="hidden lg:inline">Home</span>
              </NavLink>

              {isFreelancer && (
                <NavLink
                  to="/find-work"
                  className={navLinkClass}
                  title="Find Work"
                >
                  <BriefcaseBusiness size={20} />
                  <span className="hidden lg:inline">Find Work</span>
                </NavLink>
              )}

              <NavLink
                to={
                  user?.role === "client"
                    ? "/client"
                    : user?.role === "freelancer"
                    ? "/freelancer"
                    : "/dashboard"
                }
                className={({ isActive }) =>
                  isActive ||
                  location.pathname.startsWith("/dashboard") ||
                  location.pathname.startsWith("/client") ||
                  location.pathname.startsWith("/freelancer")
                    ? navLinkClass({ isActive: true })
                    : navLinkClass({ isActive })
                }
                title="Projects"
              >
                <Briefcase size={20} />
                <span className="hidden lg:inline">Projects</span>
              </NavLink>

              <NavLink to="/messages" className={navLinkClass} title="Messages">
                <div className="relative">
                  <MessageSquare size={20} />
                  {messageCount > 0 && (
                    <span className="absolute -top-1 -right-2 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center">
                      {messageCount}
                    </span>
                  )}
                </div>
                <span className="hidden lg:inline">Messages</span>
              </NavLink>

              <NavLink
                to="/notifications"
                className={navLinkClass}
                title="Notifications"
              >
                <div className="relative">
                  <Bell size={20} />
                  {notificationCount > 0 && (
                    <span className="absolute -top-1 -right-2 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center">
                      {notificationCount}
                    </span>
                  )}
                </div>
                <span className="hidden lg:inline">Notify</span>
              </NavLink>
            </div>

            <div className="flex-shrink-0 flex items-center gap-2 ml-4">
              <Link
                to={`/profile/${user._id}`}
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100"
              >
                {user.profilePictureUrl ? (
                  <img
                    src={user.profilePictureUrl}
                    alt={user.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-600">
                    {user.name.charAt(0)}
                  </div>
                )}
                <span className="font-semibold text-gray-700 text-sm truncate max-w-[120px]">
                  {user.name}
                </span>
              </Link>
            </div>
          </div>

          <div className="md:hidden flex items-center justify-between h-16">
            <div className="w-10">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-md text-gray-500 hover:bg-gray-100"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
            <div className="flex-grow text-center">
              <Link to="/home" className="font-bold text-xl text-blue-600">
                FreelancerHub
              </Link>
            </div>
            <div className="w-10 flex justify-end">
              <Link to={`/profile/${user._id}`} className="block">
                {user.profilePictureUrl ? (
                  <img
                    src={user.profilePictureUrl}
                    alt={user.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-600">
                    {user.name.charAt(0)}
                  </div>
                )}
              </Link>
            </div>
          </div>
        </nav>

        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white border-t border-gray-200 overflow-hidden"
            >
              <div className="px-4 pt-4 pb-6 space-y-2">
                <NavLink to="/home" className={navLinkClass} end>
                  <Home size={20} />
                  <span>Home</span>
                </NavLink>

                {isFreelancer && (
                  <NavLink to="/find-work" className={navLinkClass}>
                    <BriefcaseBusiness size={20} />
                    <span>Find Work</span>
                  </NavLink>
                )}

                <NavLink
                  to="/dashboard"
                  className={({ isActive }) =>
                    location.pathname.startsWith("/dashboard")
                      ? navLinkClass({ isActive: true })
                      : navLinkClass({ isActive })
                  }
                >
                  <Briefcase size={20} />
                  <span>Projects</span>
                </NavLink>

                <NavLink to="/messages" className={navLinkClass}>
                  <MessageSquare size={20} />
                  <span>Messages</span>
                  {messageCount > 0 && (
                    <span className="ml-auto w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {messageCount}
                    </span>
                  )}
                </NavLink>

                <NavLink to="/notifications" className={navLinkClass}>
                  <Bell size={20} />
                  <span>Notifications</span>
                  {notificationCount > 0 && (
                    <span className="ml-auto w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {notificationCount}
                    </span>
                  )}
                </NavLink>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <main className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;
