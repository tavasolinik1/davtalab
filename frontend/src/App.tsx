import { Link } from 'react-router-dom';

export default function App() {
  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">VolunteerHub</h1>
      <nav className="flex gap-4 mb-6">
        <Link className="text-sky-600" to="/signup">Volunteer Signup</Link>
        <Link className="text-sky-600" to="/admin">NGO Admin</Link>
        <Link className="text-sky-600" to="/analytics">Analytics</Link>
      </nav>
      <p className="text-sm text-slate-600 dark:text-slate-300">Multi-tenant volunteer platform MVP.</p>
    </div>
  );
}