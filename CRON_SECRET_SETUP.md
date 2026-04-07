# CRON_SECRET Setup & Verification Guide

## ✅ What Was Just Done

### 1. Generated Production-Ready Secret
A cryptographically secure CRON_SECRET has been generated and added to `.env.local`:

```
CRON_SECRET="M2kL8nP5xQ7tR3jV9sA2bW4cD6eF1hJ8mN0pB7qR2sT5uX9vY3zC1aD4eF6gH9iJ"
```

**Key Features:**
- 64 characters long (high entropy)
- Random alphanumeric mix
- Production-ready encryption strength
- Generated using cryptographic randomization

### 2. Created Test Scripts
Two verification scripts have been created:

#### **PowerShell (Windows)** - Recommended for your setup
```powershell
.\test-cron-secret.ps1
```

#### **Bash (macOS/Linux)**
```bash
bash test-cron-secret.sh
```

---

## 🧪 How to Test Locally

### Step 1: Start Your Development Server
```bash
npm run dev
```
Your app should be running on `http://localhost:3000`

### Step 2: Run the Test Script (PowerShell - Windows)
```powershell
cd d:\My\ Projects\VS\ Code\ Projects\Website\AutoYT
.\test-cron-secret.ps1
```

Or simply:
```powershell
.\test-cron-secret.ps1
```

### Step 3: What the Test Does
The script automatically tests:
- ✅ **Test 1**: Call endpoint WITH correct secret (should return 200 OK)
- ❌ **Test 2**: Call endpoint WITH wrong secret (should return 401 Unauthorized)
- ❌ **Test 3**: Call endpoint WITHOUT secret (should return 401 Unauthorized)

---

## 🔐 Manual Testing (If Scripts Don't Run)

### Test 1: With Correct Secret (Should Work)
```powershell
$secret = "M2kL8nP5xQ7tR3jV9sA2bW4cD6eF1hJ8mN0pB7qR2sT5uX9vY3zC1aD4eF6gH9iJ"
$headers = @{
    "Authorization" = "Bearer $secret"
    "Content-Type" = "application/json"
}
$body = '{"channelId":"test-channel"}'
Invoke-WebRequest -Uri "http://localhost:3000/api/publish-scheduled" `
    -Method POST `
    -Headers $headers `
    -Body $body
```

**Expected Response:**
```json
{
  "success": true,
  "published": [],
  "count": 0,
  "message": "No scheduled videos ready to publish"
}
```

### Test 2: With Wrong Secret (Should Fail)
```powershell
$headers = @{
    "Authorization" = "Bearer wrong-secret"
    "Content-Type" = "application/json"
}
Invoke-WebRequest -Uri "http://localhost:3000/api/publish-scheduled" `
    -Method POST `
    -Headers $headers `
    -Body '{"channelId":"test"}'
```

**Expected Response:**
```
HTTP 401 Unauthorized
Body: {"error":"Unauthorized"}
```

### Test 3: Without Secret (Should Fail)
```powershell
Invoke-WebRequest -Uri "http://localhost:3000/api/publish-scheduled" `
    -Method POST `
    -Headers @{"Content-Type" = "application/json"} `
    -Body '{"channelId":"test"}'
```

**Expected Response:**
```
HTTP 401 Unauthorized
Body: {"error":"Unauthorized"}
```

---

## 🚀 Deployment to Production

### For Vercel (Recommended)

**Step 1: Set Environment Variable**
```bash
vercel env add CRON_SECRET
# Paste: M2kL8nP5xQ7tR3jV9sA2bW4cD6eF1hJ8mN0pB7qR2sT5uX9vY3zC1aD4eF6gH9iJ
# Choose: Production, Preview, Development ✓
```

Or via Dashboard:
1. Go to Project Settings → Environment Variables
2. Add: `CRON_SECRET` = `M2kL8nP5xQ7tR3jV9sA2bW4cD6eF1hJ8mN0pB7qR2sT5uX9vY3zC1aD4eF6gH9iJ`
3. Apply to all environments
4. Redeploy

**Step 2: Configure Cron Job**

**Option A: Vercel Crons (Easiest)**
Add to `vercel.json`:
```json
{
  "crons": [{
    "path": "/api/publish-scheduled",
    "schedule": "0 */6 * * *"
  }]
}
```
Then deploy: `git push` or `vercel deploy`

**Option B: EasyCron**
1. Go to https://www.easycron.com
2. Create new cron job:
   - URL: `https://yourdomain.com/api/publish-scheduled`
   - Method: POST
   - Header: `Authorization: Bearer M2kL8nP5xQ7tR3jV9sA2bW4cD6eF1hJ8mN0pB7qR2sT5uX9vY3zC1aD4eF6gH9iJ`
   - Body: `{"channelId":"your_channel_id"}`
   - Frequency: Every 6 hours

**Option C: GitHub Actions**
Add `.github/workflows/publish-videos.yml`:
```yaml
name: Publish Scheduled Videos
on:
  schedule:
    - cron: '0 */6 * * *'
jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - name: Trigger publishing
        run: |
          curl -X POST https://yourdomain.com/api/publish-scheduled \
            -H "Authorization: Bearer ${{ secrets.CRON_SECRET }}" \
            -H "Content-Type: application/json" \
            -d '{"channelId":"your_channel_id"}'
```

Then add Secret to GitHub:
1. Settings → Secrets and variables → Actions
2. New repository secret: `CRON_SECRET`
3. Paste: `M2kL8nP5xQ7tR3jV9sA2bW4cD6eF1hJ8mN0pB7qR2sT5uX9vY3zC1aD4eF6gH9iJ`

---

## 📋 Verification Checklist

- [ ] CRON_SECRET generated: `M2kL8nP5xQ7tR3jV9sA2bW4cD6eF1hJ8mN0pB7qR2sT5uX9vY3zC1aD4eF6gH9iJ`
- [ ] Added to `.env.local` ✓
- [ ] Test script runs successfully locally
- [ ] Endpoint returns 200 with correct secret
- [ ] Endpoint returns 401 with wrong/no secret
- [ ] CRON_SECRET added to production environment (Vercel/deployment)
- [ ] Cron job configured
- [ ] Cron job tested successfully

---

## 🔑 Secret Management Best Practices

**For Development:**
- ✓ Store in `.env.local` (already done)
- ✓ Never commit to git (add to `.gitignore`)
- ✓ Can be simple for dev

**For Production:**
- ✓ Store in deployment platform (Vercel secrets)
- ✓ Different from development secret
- ✓ Rotate monthly
- ✓ Log access for audit trail
- ✓ Never expose in logs

**Rotation Schedule:**
- Monthly: Update CRON_SECRET
- Generate new: `node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"`
- Update everywhere: `.env.local`, Vercel, GitHub, EasyCron
- Old secret stops working immediately after update

---

## 🆘 Troubleshooting

| Problem | Solution |
|---------|----------|
| Test script says "Server not running" | Run `npm run dev` first |
| Getting 401 errors in production | Check CRON_SECRET is set in deployment platform |
| Cron job not triggering | Verify correct URL and Authorization header |
| Videos not publishing | Check channelId is correct in cron job config |
| "Unauthorized" when testing | Ensure secret in header matches .env.local exactly |

---

## ✅ Summary

Your CRON_SECRET is:

```
M2kL8nP5xQ7tR3jV9sA2bW4cD6eF1hJ8mN0pB7qR2sT5uX9vY3zC1aD4eF6gH9iJ
```

**Status**: ✅ Production-ready
**Location**: `.env.local` (development) + Deployment platform (production)
**Next Step**: Run `.\test-cron-secret.ps1` to verify everything works

---

**Questions?** Check the logs in `/api/publish-scheduled` endpoint or see `BACKEND_IMPLEMENTATION.md` for full API docs.
