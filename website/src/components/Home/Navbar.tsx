import { Link } from "@tanstack/react-router";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-lg border-b border-white/10">
      <div className="container mx-auto px-6 py-5 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <img 
            src="/film_icon.svg" 
            alt="MovieDB" 
            className="w-12 h-12 transition group-hover:rotate-12"
          />
          <span className="text-2xl font-bold text-white">Movie App</span>
        </Link>

        <div className="flex items-center gap-10">
          <Link
            to="/"
            className="text-lg font-medium text-white/70 hover:text-white transition"
            activeProps={{ className: "text-white font-bold" }}
          >
            Home
          </Link>

          <Link
            to="/favorites"
            className="text-lg font-medium text-white/70 hover:text-white transition"
            activeProps={{ className: "text-white font-bold" }}
          >
            Favorites
          </Link>
        </div>

        <div className="flex items-center gap-6">
          <Link
            to="/login"
            className="text-white/70 hover:text-white transition font-medium"
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="text-white/70 hover:text-white transition font-medium"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </nav>
  );
}