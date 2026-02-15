# Health Workers Module - Setup & Deployment Checklist

## Pre-Deployment Setup

### 1. Database Setup

```bash
# In Supabase SQL Editor, run migrations in order:

# Step 1: Run main schema migration
# File: migrations/002_health_workers_tables.sql
# This creates all health worker tables and enables RLS

# Step 2: Insert sample data (optional, for testing)
# File: INSERT_HEALTH_WORKERS_SAMPLE_DATA.sql
# This populates test data for development
```

**Verify Installation:**

```sql
-- Check tables exist
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN (
  'vaccination_records',
  'maternal_health_records',
  'senior_assistance_records',
  'health_metrics',
  'offline_queue'
);

-- Verify RLS is enabled
SELECT tablename FROM pg_tables
WHERE pg_tables.tablename IN (
  'vaccination_records',
  'maternal_health_records'
)
AND pg_catalog.col_privs_agg(pg_tables.relname) != '';
```

### 2. Environment Variables

Update `.env.local`:

```env
# Existing variables
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key

# Add health workers configuration (optional)
NEXT_PUBLIC_HEALTH_WORKERS_API_TIMEOUT=30000
NEXT_PUBLIC_OFFLINE_SYNC_INTERVAL=300000  # 5 minutes
```

### 3. Update Auth Configuration

The health workers module uses existing auth system. Verify:

```typescript
// lib/auth.ts should have these roles
// 'user', 'admin', 'staff', 'workers'

// Update if needed:
role text NOT NULL CHECK (role = ANY (ARRAY[
  'user'::text,
  'admin'::text,
  'staff'::text,
  'workers'::text
]))
```

## Installation Steps

### 1. Install Dependencies

```bash
npm install
# All required packages already in package.json:
# - @supabase/supabase-js (auth & real-time)
# - recharts (analytics charts)
# - react-hook-form (form management)
# - zod (validation)
# - lucide-react (icons)
```

### 2. Create Health Worker Test Accounts

```bash
# In Supabase dashboard:
# 1. Go to Authentication > Users
# 2. Add user with:
#    - Email: hw_test@health.local
#    - Password: StrongPassword123!
#
# 3. In public.users table, insert:
INSERT INTO public.users (
  username,
  password_hash,
  user_role,
  assigned_barangay
) VALUES (
  'hw_barangay1',
  '$2b$10$...',  -- hashed password
  'workers',
  'Barangay San Jose'
);
```

### 3. Build & Test Locally

```bash
# Development build
npm run dev

# Test health workers dashboard
# URL: http://localhost:3000/dashboard-workers
# Must be logged in as health worker user

# Test data entry
# URL: http://localhost:3000/dashboard-workers/data-entry
```

## Production Deployment

### 1. Pre-Deployment Checklist

- [ ] All migrations applied to production database
- [ ] Sample data loaded (optional)
- [ ] RLS policies verified and enabled
- [ ] Auth middleware tested
- [ ] API endpoints tested with valid auth token
- [ ] Offline sync tested on mobile (WiFi toggle)
- [ ] Real-time subscriptions working
- [ ] Service worker configured
- [ ] Environment variables set
- [ ] CORS headers configured for Supabase

### 2. Deploy to Production

```bash
# Build locally
npm run build

# Test build
npm start

# Deploy using Vercel/your hosting
vercel deploy --prod

# Or manually upload to your server
npm run build
npm start
```

### 3. Post-Deployment Verification

```bash
# Test health worker login
curl -X POST https://your-domain.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"hw_barangay1","password":"password"}'

# Test vaccination record creation
curl -X POST https://your-domain.com/api/health-workers/vaccination-records \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "resident_id":"resident-uuid",
    "vaccine_name":"COVID-19",
    "vaccine_date":"2024-01-15",
    "status":"completed"
  }'

# Verify real-time subscription
# Open browser DevTools, go to health workers dashboard
# Should see connection status = "Connected"
```

## Performance Optimization

### 1. Database Query Optimization

```sql
-- Check index usage
EXPLAIN ANALYZE
SELECT * FROM vaccination_records
WHERE resident_id = 'uuid'
ORDER BY vaccine_date DESC;

-- Results should show index usage:
-- Index Scan using idx_vaccination_resident_id
```

### 2. Client-side Caching

The module uses React hooks for caching:

```typescript
// Hooks automatically cache data
const { records } = useVaccinationRecords(residentId);
// Data only refetches on dependency change
```

### 3. Pagination (Ready for Implementation)

```typescript
// Future enhancement to queries:
const { data: residents } = await supabase
  .from("residents")
  .select("*")
  .eq("barangay", barangay)
  .range(0, 99) // Limit to 100 records
  .order("full_name");
```

## Troubleshooting

### Issue: No data in health workers dashboard

**Cause**: User not assigned to barangay or RLS blocking

**Solution**:

```sql
-- Verify user assignment
SELECT id, username, assigned_barangay FROM public.users
WHERE username = 'hw_barangay1';

-- Verify RLS policies
SELECT * FROM pg_policies
WHERE tablename = 'vaccination_records';
```

### Issue: Offline sync not working

**Cause**: IndexedDB or network error

**Solution**:

```javascript
// In browser DevTools console:
// Check IndexedDB
indexedDB.databases().then((dbs) => console.log(dbs));

// Check pending queue
db = await dbRequest.result;
const tx = db.transaction(["queue"], "readonly");
const store = tx.objectStore("queue");
store.getAll().onsuccess = (e) => console.log(e.target.result);
```

### Issue: Real-time updates not working

**Cause**: WebSocket connection failed

**Solution**:

```javascript
// In browser DevTools console:
console.log(supabase.getChannel());

// Verify Realtime is enabled in Supabase
// Dashboard > Project Settings > Realtime > Enable
```

### Issue: Forms not submitting

**Cause**: Validation error or auth token expired

**Solution**:

```typescript
// Check console for Zod validation errors
// Form will display specific field errors

// Verify auth token
const session = await getSession();
console.log(session.expires_at < Date.now()); // Should be false
```

## Monitoring & Maintenance

### 1. Monitor Database Performance

```sql
-- Check table row counts
SELECT
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size,
  (SELECT count(*) FROM information_schema.tables t2
   WHERE t2.table_name=t1.tablename) AS rows
FROM pg_tables t1
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

### 2. Monitor API Performance

```bash
# Check API response times
gcloud logging read --limit 50 \
  --format='value(httpRequest.latency)'

# Or use application insights/monitoring
```

### 3. Backup Strategy

```bash
# Supabase automatically backups daily
# Enable point-in-time recovery:
# Dashboard > Database > Backups > Point-in-time Recovery

# Manual backup:
pg_dump -U username -h host -d database > backup.sql
```

## Security Hardening

### 1. API Rate Limiting

Add to middleware for health workers routes:

```typescript
// middleware.ts
const rateLimit = new Map();

export async function middleware(request: NextRequest) {
  const ip = request.ip || "unknown";
  const count = rateLimit.get(ip) || 0;

  if (count > 100) {
    // 100 requests per minute
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
  }

  rateLimit.set(ip, count + 1);
  setTimeout(() => rateLimit.delete(ip), 60000);
}
```

### 2. Input Sanitization

All forms use Zod validation:

```typescript
// Automatically rejects malicious input
vaccinationRecordSchema.parse(userInput);
// Throws ZodError if invalid
```

### 3. SQL Injection Prevention

Using Supabase SDK automatically prevents SQL injection:

```typescript
// Safe (parameterized query)
supabase.from("residents").select("*").eq("barangay", userInput); // ✅ Safe

// Unsafe (never use)
// SELECT * FROM residents WHERE barangay = '{{ userInput }}'
```

## Scaling Considerations

### 1. Database Scaling

- **Current**: Supabase shared plan (~100 concurrent connections)
- **Scaling**: Upgrade to Dedicated plan at 500+ users
- **Backup**: Enable automated backups (7-30 days)

### 2. API Scaling

- **Current**: Vercel hobby plan (Serverless)
- **Scaling**: Vercel Pro for priority CPU time
- **Alternative**: Docker on DigitalOcean/AWS

### 3. Real-time Scaling

- **Current**: Supabase Realtime (max 100 concurrent subscriptions)
- **Scaling**: Supabase upgrades support 1000+
- **Consideration**: Use regular polling for high-latency areas

## Rollback Plan

If deployment fails:

```bash
# Revert to previous deployment
vercel rollback

# Or manually redeploying previous version
git checkout <previous-commit>
npm run build
npm start

# Database rollback
# Supabase: Restore from backup
#   Dashboard > Database > Backups > Restore
```

## Support Contacts

For issues with:

- **Supabase**: support@supabase.io
- **Vercel**: support@vercel.com
- **NagaCare**: [Your Support Contact]

## Version History

| Version | Date     | Changes                         |
| ------- | -------- | ------------------------------- |
| 1.0.0   | Jan 2024 | Initial release                 |
| 1.1.0   | Feb 2024 | Added offline sync improvements |

---

**Last Updated**: February 2024
**Module Version**: 1.0.0
**Next Review**: March 2024
