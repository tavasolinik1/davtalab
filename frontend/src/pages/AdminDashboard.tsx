import { useEffect, useState } from 'react';
import api, { setTenantId } from '../api/client';

type Ngo = { id: string; name: string };

type Volunteer = { id: string; fullName: string; email: string };

type Opportunity = { id: string; title: string; description: string };

export default function AdminDashboard() {
  const [ngos, setNgos] = useState<Ngo[]>([]);
  const [tenant, setTenant] = useState('');
  const [vols, setVols] = useState<Volunteer[]>([]);
  const [opps, setOpps] = useState<Opportunity[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    api.get<Ngo[]>('/ngos').then((r) => setNgos(r.data));
  }, []);

  useEffect(() => {
    if (!tenant) return;
    setTenantId(tenant);
    api.get<Volunteer[]>('/volunteers').then((r) => setVols(r.data));
    api.get<Opportunity[]>('/opportunities').then((r) => setOpps(r.data));
  }, [tenant]);

  async function createOpp(e: React.FormEvent) {
    e.preventDefault();
    if (!tenant) return;
    await api.post('/opportunities', { title, description }).catch(() => {});
    const res = await api.get<Opportunity[]>('/opportunities');
    setOpps(res.data);
    setTitle('');
    setDescription('');
  }

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">NGO Admin</h2>
      <div className="mb-4">
        <label className="mr-2">Select NGO:</label>
        <select className="border p-2 rounded" value={tenant} onChange={(e) => setTenant(e.target.value)}>
          <option value="">Choose</option>
          {ngos.map((n) => (
            <option key={n.id} value={n.id}>{n.name}</option>
          ))}
        </select>
      </div>

      {tenant && (
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold mb-2">Volunteers</h3>
            <ul className="space-y-1 text-sm">
              {vols.map((v) => (
                <li key={v.id} className="border p-2 rounded">
                  <div className="font-medium">{v.fullName}</div>
                  <div className="text-slate-500">{v.email}</div>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Opportunities</h3>
            <ul className="space-y-1 text-sm mb-3">
              {opps.map((o) => (
                <li key={o.id} className="border p-2 rounded">
                  <div className="font-medium">{o.title}</div>
                  <div className="text-slate-500">{o.description}</div>
                </li>
              ))}
            </ul>
            <form className="space-y-2" onSubmit={createOpp}>
              <input className="w-full border p-2 rounded" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
              <textarea className="w-full border p-2 rounded" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} required />
              <button className="bg-sky-600 text-white px-4 py-2 rounded" type="submit">Create Opportunity</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}