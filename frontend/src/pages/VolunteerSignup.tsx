import { useEffect, useState } from 'react';
import api from '../api/client';

type Ngo = { id: string; name: string };

export default function VolunteerSignup() {
  const [ngos, setNgos] = useState<Ngo[]>([]);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [ngoId, setNgoId] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => {
    api.get<Ngo[]>('/ngos').then((r) => setNgos(r.data));
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const payload = { fullName, email, phone, ngoId };
    try {
      await api.post('/volunteers', payload);
      setStatus('Submitted');
    } catch (err) {
      // offline queue stub
      const queue = JSON.parse(localStorage.getItem('offline_queue') || '[]');
      queue.push({ url: '/volunteers', method: 'POST', payload });
      localStorage.setItem('offline_queue', JSON.stringify(queue));
      setStatus('Saved offline, will retry');
    }
  }

  useEffect(() => {
    function retryQueue() {
      const raw = localStorage.getItem('offline_queue');
      if (!raw) return;
      const queue = JSON.parse(raw);
      Promise.all(
        queue.map((item: any) => api.post(item.url, item.payload).catch(() => null)),
      ).then(() => localStorage.removeItem('offline_queue'));
    }
    window.addEventListener('online', retryQueue);
    return () => window.removeEventListener('online', retryQueue);
  }, []);

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-xl font-semibold mb-4">Volunteer Signup</h2>
      <form className="space-y-3" onSubmit={submit}>
        <input className="w-full border p-2 rounded" placeholder="Full name" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
        <input className="w-full border p-2 rounded" placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input className="w-full border p-2 rounded" placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
        <select className="w-full border p-2 rounded" value={ngoId} onChange={(e) => setNgoId(e.target.value)} required>
          <option value="">Select NGO</option>
          {ngos.map((n) => (
            <option key={n.id} value={n.id}>{n.name}</option>
          ))}
        </select>
        <button className="bg-sky-600 text-white px-4 py-2 rounded" type="submit">Submit</button>
      </form>
      {status && <p className="mt-3 text-sm">{status}</p>}
    </div>
  );
}