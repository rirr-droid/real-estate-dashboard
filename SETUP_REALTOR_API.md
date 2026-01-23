# Setting Up Real Property Listings with Realtor.com API

This guide will help you integrate REAL property listings into Deal Hunter using the Realtor.com API via RapidAPI.

---

## Step 1: Get Your RapidAPI Key (5 minutes)

1. **Go to RapidAPI**: https://rapidapi.com/apidojo/api/realtor/

2. **Sign up or Log in**:
   - Click "Sign Up" in the top right
   - Use Google/GitHub or email to create account (FREE)

3. **Subscribe to the API**:
   - On the Realtor API page, click "**Pricing**" tab
   - Choose a plan:
     - **FREE**: 500 requests/month (good for testing)
     - **Basic ($10/month)**: 10,000 requests/month (recommended)
     - **Pro ($50/month)**: 100,000 requests/month

4. **Get Your API Key**:
   - After subscribing, click "**Code Snippets**" or "**Endpoints**"
   - You'll see `X-RapidAPI-Key: xxxxxxxxxxxxx`
   - **Copy this key** - you'll need it in the next step

---

## Step 2: Configure Your Environment (2 minutes)

1. **Create `.env.local` file**:
   ```bash
   cd C:\Users\robir\real-estate-dashboard
   copy .env.local.example .env.local
   ```

2. **Add your API key**:
   Open `.env.local` and paste your key:
   ```env
   NEXT_PUBLIC_RAPIDAPI_KEY=your_actual_key_here
   ```

3. **Save the file**

---

## Step 3: Update Deal Hunter to Use Real Data (Next Steps)

I'll now update the Deal Hunter code to:
- Fetch REAL listings from Realtor.com
- Replace fake data with live property data
- Show actual addresses, photos, and listing links
- Keep the deal scoring algorithm for real properties

---

## API Details

### What You Get:
- ✅ **Real MLS listings** from across the US
- ✅ **Actual addresses** with coordinates
- ✅ **Real photos** of properties
- ✅ **Current prices** and property details
- ✅ **Days on market** (when available)
- ✅ **Direct links** to Realtor.com listings

### Request Limits:
- **Free**: 500 requests/month = ~10 searches/day
- **Basic**: 10,000 requests/month = ~333 searches/day
- **Pro**: 100,000 requests/month = ~3,333 searches/day

### One Search Returns:
- Up to 50 properties per request
- Can paginate for more results
- Filter by city, price, beds, baths, sqft, type

---

## Cost Estimate

### Typical Usage:
- User searches Seattle, $800K-$1M, 3+ beds
- = **1 API request** = 50 real properties
- User clicks through 5 different searches
- = **5 requests per session**

### Monthly Cost:
- **FREE tier**: 100 user sessions (500 requests)
- **Basic ($10)**: 2,000 user sessions (10,000 requests)
- **Pro ($50)**: 20,000 user sessions (100,000 requests)

---

## Important Notes

1. **Add `.env.local` to `.gitignore`** (already done)
   - Never commit API keys to GitHub!

2. **Monitor Usage**:
   - Check dashboard: https://rapidapi.com/developer/dashboard
   - Get email alerts if approaching limit

3. **Caching** (Optional):
   - Consider caching search results for 15-30 minutes
   - Reduces API calls for same searches
   - Saves money and improves speed

---

## Ready?

Once you've completed Steps 1 & 2 above, let me know and I'll:
1. Update Deal Hunter to fetch real listings
2. Add proper error handling
3. Show real property photos
4. Test with actual Seattle listings

**Do you have your API key ready?** If yes, just paste it in `.env.local` and tell me when you're ready for me to update the code!
