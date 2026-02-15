# 🚀 Health Workers Module - Quick Start Guide

Get your health workers module up and running in 15 minutes.

---

## Prerequisites

✅ **Before you start**, make sure you have:

- Supabase project created
- `.env.local` with Supabase credentials
- `next.js` project running locally
- Node.js 18+

---

## Step 1: Run Migration (2 min)

1. Open [Supabase Dashboard](https://supabase.com/dashboard)
2. Go to **SQL Editor** → **New Query**
3. Open [`migrations/002_health_workers_tables.sql`](migrations/002_health_workers_tables.sql)
4. Copy entire contents into SQL editor
5. Click **Run**
6. ✅ Should see "5 tables created" in logs

**What it does**: Creates vaccination_records, maternal_health_records, senior_assistance_records, health_metrics, offline_queue tables

---

## Step 2: Load Sample Data (1 min) - OPTIONAL

1. Click **New Query** in Supabase SQL Editor
2. Open [`INSERT_HEALTH_WORKERS_SAMPLE_DATA.sql`](INSERT_HEALTH_WORKERS_SAMPLE_DATA.sql)
3. Copy entire contents
4. Click **Run**
5. ✅ Should see "~19 rows inserted" in logs

**What it does**: Adds test health workers, residents, facilities, and sample records

---

## Step 3: Create Test Health Worker (3 min)

1. In Supabase, go to **Authentication** → **Users**
2. Click **Add User**
3. Fill in:
   - **Email**: `hw_barangay1@test.local`
   - **Password**: `TestPassword123!`
4. Click **Create User**
5. Go to your database and update the user:
   ```sql
   UPDATE public.users
   SET
     user_role = 'workers',
     assigned_barangay = 'Barangay San Jose',
     full_name = 'Maria Santos'
   WHERE email = 'hw_barangay1@test.local'
   ```
6. Click **Run** ✅

---

## Step 4: Test Login Locally (2 min)

1. Start your dev server: `npm run dev`
2. Go to http://localhost:3000
3. Click **Login**
4. Enter credentials:
   - Email: `hw_barangay1@test.local`
   - Password: `TestPassword123!`
5. ✅ Should redirect to `/dashboard-workers`

---

## Step 5: Access Health Workers Dashboard (2 min)

You should see:

- ✅ Cards showing vaccination, maternal, senior coverage %
- ✅ Resident list for "Barangay San Jose"
- ✅ Health facilities listing
- ✅ 4 tabs: Overview, Residents, Facilities, Analytics

**Pro tip**: If you see error, check browser console (F12) for details

---

## Step 6: Test Data Entry (3 min)

1. Click **Data Entry** tab
2. Search for a resident name (sample data includes: Maria Morales, Juan Reyes)
3. Click to select
4. Fill vaccination form:
   - Vaccine: "COVID-19 (Pfizer)"
   - Dose: 1
   - Date: Today
5. Click **Submit**
6. ✅ See "Record saved" toast
7. Refresh dashboard → new record appears in metrics

---

## Step 7: Test Offline Mode (2 min)

1. In Chrome DevTools (F12) → **Network** tab
2. Check **Offline** checkbox
3. Try to submit another form
4. ✅ Form should still submit (check Network → All → see "pending" status)
5. Uncheck **Offline**
6. See "Offline data ready to sync" notification
7. Click **Sync Now**
8. ✅ Data syncs from IndexedDB to server

---

## That's It! 🎉

Your health workers module is now live and ready to use.

### What's Working:

✅ Health workers can enter vaccination records  
✅ Health workers can enter maternal health visits  
✅ Health workers can enter senior assistance records  
✅ Real-time dashboard updates  
✅ Offline data persistence  
✅ RLS ensures data isolation by barangay  
✅ Mobile-responsive interface  
✅ Works on Android/iOS as PWA

---

## 🎯 Next Steps

### For Immediate Use:

1. Add more health workers (repeat Step 3 for each)
2. Import real resident data
3. Create actual health facilities
4. Configure for your barangay names

### For Production:

1. Read [HEALTH_WORKERS_DEPLOYMENT.md](HEALTH_WORKERS_DEPLOYMENT.md)
2. Set up SSL/HTTPS (required for PWA)
3. Configure service worker caching
4. Set up error monitoring (Sentry)
5. Create database backups
6. Test with real health workers (UAT)

### For Enhancement:

1. Add photo upload for vaccination proof
2. Enable QR code scanning
3. Add GPS location tagging
4. Setup SMS notifications
5. Export reports to CSV/PDF

---

## 🐛 Troubleshooting

### Dashboard shows "Unauthorized"

- Check browser console for auth errors
- Verify user has `user_role = 'workers'` in database
- Clear cookies and login again

### Forms not submitting

- Check Network tab for API response (should be 201)
- Verify session is active (check Application → Cookies)
- Check browser console for validation errors

### Real-time not updating

- Check Supabase is connected (green indicator)
- Verify your browser doesn't have WebSocket blocked
- Try hard refresh (Ctrl+Shift+R)

### Offline data won't sync

- Check IndexedDB (DevTools → Application → IndexedDB)
- Ensure you're actually online
- Click "Sync Now" button manually
- Check Network tab for POST errors

### Sample data not appearing

- Verify SQL query ran without errors
- Try querying directly: `SELECT COUNT(*) FROM vaccination_records`
- Check if barangay name matches your assigned_barangay

---

## 📞 Quick Reference

| Task                | Where to Go                             |
| ------------------- | --------------------------------------- |
| Add health worker   | Supabase → Users → Add                  |
| View database       | Supabase → SQL Editor (or Table Editor) |
| Check logs          | Browser Console (F12)                   |
| Enable offline mode | DevTools → Network → Offline            |
| View IndexedDB data | DevTools → Application → IndexedDB      |
| Fix RLS issues      | Supabase → Dashboard → Policies         |
| Deploy changes      | `npm run build` → `vercel deploy`       |

---

## 🎓 More Resources

- [Full Module Guide](HEALTH_WORKERS_MODULE_GUIDE.md)
- [Deployment Checklist](HEALTH_WORKERS_DEPLOYMENT.md)
- [Implementation Summary](HEALTH_WORKERS_IMPLEMENTATION_SUMMARY.md)
- [Database Schema](migrations/002_health_workers_tables.sql)

---

**Status**: ✅ Ready to use  
**Module Version**: 1.0.0  
**Last Updated**: February 2024

Happy coding! 🚀
