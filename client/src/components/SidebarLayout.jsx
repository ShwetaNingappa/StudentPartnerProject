import { Link, Outlet, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

const links = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/quiz", label: "Aptitude Quiz" },
  { to: "/coding", label: "Coding Questions" },
  { to: "/leaderboard", label: "Leaderboard" },
  { to: "/study-plan", label: "Smart Study Plan" }
];

const SidebarLayout = () => {
  const { pathname } = useLocation();
  const { logout, user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen text-slate-100 md:flex">
      <aside className="md:w-72 border-b md:border-b-0 md:border-r border-cyan-400/20 p-4 glass-card m-3 md:m-4">
        <h1 className="text-xl font-bold text-cyan-300">SmartPrep Portal</h1>
        <p className="text-sm mt-2 text-slate-300">{user?.name}</p>
        <nav className="mt-6 space-y-2">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`interactive-item block rounded-lg px-3 py-2 ${
                pathname === link.to ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-[#0b1117]" : "hover:bg-slate-800/70"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <button
          onClick={toggleTheme}
          className="interactive-item mt-4 w-full rounded-lg border border-cyan-400/40 px-4 py-2 hover:bg-slate-800/80"
        >
          Switch to {theme === "dark" ? "Light" : "Dark"} Mode
        </button>
        <button
          onClick={logout}
          className="gold-btn mt-3 w-full rounded-lg px-4 py-2"
        >
          Logout
        </button>
      </aside>
      <main className="flex-1 p-4 md:p-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.32, ease: "easeOut" }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};

export default SidebarLayout;
