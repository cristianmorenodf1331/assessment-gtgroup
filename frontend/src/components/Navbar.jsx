import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';

export default function Navbar() {
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);

  const links = [
    { to: '/',          label: 'Inicio' },
    { to: '/evaluacion', label: 'Nueva Evaluación' },
    { to: '/historial',  label: 'Historial' },
  ];

  return (
    <nav className="bg-gtblue-900 border-b border-gtblue-700 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gtblue-600 rounded-lg flex items-center justify-center text-lg">
              🔐
            </div>
            <div>
              <div className="font-bold text-white text-sm leading-tight">GTGroup</div>
              <div className="text-gtblue-200 text-xs leading-tight">Cybersecurity Assessment</div>
            </div>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-1">
            {links.map(l => (
              <Link
                key={l.to}
                to={l.to}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  pathname === l.to
                    ? 'bg-gtblue-600 text-white'
                    : 'text-gtblue-200 hover:bg-gtblue-800 hover:text-white'
                }`}
              >
                {l.label}
              </Link>
            ))}
          </div>

          {/* NIST badge */}
          <div className="hidden md:flex items-center gap-2">
            <span className="text-xs text-gtblue-200 border border-gtblue-600 px-2 py-1 rounded-full">
              NIST CSF 2.0
            </span>
            <span className="text-xs text-gtblue-200 border border-gtblue-600 px-2 py-1 rounded-full">
              ISO 27001
            </span>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden text-gtblue-200 hover:text-white"
            onClick={() => setOpen(!open)}
          >
            {open ? '✕' : '☰'}
          </button>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="md:hidden py-3 border-t border-gtblue-700">
            {links.map(l => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className={`block px-4 py-2 text-sm rounded-lg mb-1 ${
                  pathname === l.to
                    ? 'bg-gtblue-600 text-white'
                    : 'text-gtblue-200 hover:bg-gtblue-800'
                }`}
              >
                {l.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
