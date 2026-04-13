import { Link, Outlet, useLocation } from "react-router-dom";
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
    <div className="min-h-screen bg-slate-900 text-slate-100 md:flex">
      <aside className="md:w-72 border-b md:border-b-0 md:border-r border-slate-700 p-4">
        <h1 className="text-xl font-bold text-indigo-400">SmartPrep Portal</h1>
        <p className="text-sm mt-2 text-slate-300">{user?.name}</p>
        <nav className="mt-6 space-y-2">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`block rounded-lg px-3 py-2 ${
                pathname === link.to ? "bg-indigo-600 text-white" : "hover:bg-slate-800"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <button
          onClick={toggleTheme}
          className="mt-4 w-full rounded-lg border border-slate-600 px-4 py-2 hover:bg-slate-800"
        >
          Switch to {theme === "dark" ? "Light" : "Dark"} Mode
        </button>
        <button
          onClick={logout}
          className="mt-3 w-full rounded-lg bg-slate-800 px-4 py-2 hover:bg-slate-700"
        >
          Logout
        </button>
      </aside>
      <main className="flex-1 p-4 md:p-8">
        <div key={pathname} className="page-enter">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default SidebarLayout;
