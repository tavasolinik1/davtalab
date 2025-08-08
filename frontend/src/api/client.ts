import axios from 'axios';

const api = axios.create({ baseURL: import.meta.env.VITE_API_BASE_URL + '/api' });

export function setTenantId(tenantId: string) {
  api.defaults.headers.common['X-Tenant-ID'] = tenantId;
}

export default api;