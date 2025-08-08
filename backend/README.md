# VolunteerHub Backend

Paths (prefixed with /api):
- POST /ngos (SUPER_ADMIN)
- GET /ngos
- POST /volunteers (public)
- GET /volunteers (requires `X-Tenant-ID` header)
- POST /opportunities (NGO_ADMIN, requires `X-Tenant-ID`)
- GET /opportunities (requires `X-Tenant-ID`)
- POST /opportunities/:id/apply (VOLUNTEER, requires `X-Tenant-ID`)

Swagger: /api/docs
Metrics: /metrics