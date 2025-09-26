# Gmail OAuth Flow Implementation - Next.js Frontend

## 🔄 Complete OAuth Flow Analysis

Based on the analysis of `frontend_old`, here's the exact OAuth flow implementation for the Next.js frontend:

---

## 📋 **OAuth Flow Steps**

### **1. OAuth Initiation**
```typescript
// User clicks "Sign in with Gmail"
const handleGmailConnect = () => {
  // Store identity ID for callback (same as frontend_old)
  localStorage.setItem('gmail_identity_id', identity.id);
  
  // Direct redirect to backend OAuth endpoint (same as frontend_old)
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:7001';
  window.location.href = `${apiBaseUrl}/pub/v1/identities/auth?identity_id=${identity.id}`;
};
```

### **2. Backend OAuth Processing**
```typescript
// Backend: GET /pub/v1/identities/auth
const goToGoogle = catchAsync(async (req, res) => {
  const { identity_id } = req.query;
  const dynamicRedirectUri = `${process.env.REDIRECT_URI}`; // http://localhost:3000/identities
  const oauth2Client = createOAuthClient(dynamicRedirectUri);

  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    scope: [
      'https://www.googleapis.com/auth/gmail.modify',
      'https://www.googleapis.com/auth/gmail.labels',
      'https://www.googleapis.com/auth/userinfo.email',
    ],
  });

  res.redirect(url); // Redirect to Google OAuth
});
```

### **3. Google OAuth Process**
- User authenticates with Google
- User grants Gmail permissions
- Google redirects back to: `http://localhost:3000/identities?code=4%2F0AVGzR...&scope=...`

### **4. Frontend Callback Handling**
```typescript
// Frontend: Handle OAuth callback
useEffect(() => {
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get('code');
  const identityId = localStorage.getItem('gmail_identity_id');

  if (!code || !identityId) return;
  if (localStorage.getItem('isApiCalled') === 'true') return;

  localStorage.setItem('isApiCalled', 'true');

  const runOAuthFlow = async () => {
    try {
      // Call OAuth API with code and identity_id
      await identityService.googleOAuth({ code, identity_id: identityId });

      // Clean URL and refresh
      window.history.replaceState({}, document.title, '/identities');
      await loadIdentities();
      window.location.reload();
    } catch (error) {
      console.error('Google OAuth error:', error);
    } finally {
      localStorage.removeItem('gmail_identity_id');
    }
  };

  runOAuthFlow();
}, [loadIdentities]);
```

### **5. Backend Token Exchange**
```typescript
// Backend: POST /pub/v1/identities/oauth2callback
const authenticateTokenallBack = async (req: Request, res: Response) => {
  const { identity_id, code } = req.body;
  
  // Exchange code for tokens
  const tokenResponse = await oauth2Client.getToken(code);
  const tokens = tokenResponse.tokens;
  
  // Get user info
  const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client });
  const { data } = await oauth2.userinfo.get();
  const email = data.email;
  
  // Save to database
  await prisma.identity_connection_request.upsert({
    where: { identity_id_type: { identity_id, type: "gmail" } },
    update: {
      connection_status: "loggedin",
      connection_data: JSON.stringify({ data, tokens }),
    },
    create: {
      connection_status: "loggedin",
      type: "gmail",
      identity_id: identity_id,
      connection_data: JSON.stringify({ data, tokens }),
    },
  });
  
  res.json({ success: true, message: 'Gmail connected successfully' });
};
```

---

## 🔧 **Configuration Required**

### **Backend Environment (.env)**
```bash
# Google OAuth Configuration
GOOGLE_OUATH_CLIENT_ID=your_google_oauth_client_id
GOOGLE_OUATH_CLIENT_SECRET=your_google_oauth_client_secret
REDIRECT_URI=http://localhost:3000/identities
```

### **Frontend Environment (.env.local)**
```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:7001
```

### **Google Cloud Console Setup**
1. Create Google Cloud Project
2. Enable Gmail API
3. Create OAuth2 credentials
4. Set authorized redirect URI: `http://localhost:3000/identities`
5. Configure OAuth consent screen

---

## 🧪 **Testing the Flow**

### **Test URL Example:**
```
http://localhost:3000/identities?code=4%2F0AVGzR1DVMVcPvOoP1REWt2kKZ_YvoLzqM3sSVoFYziNSybEoQH0GVZy4E9vv7NJPNlDA8Q&scope=email+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fgmail.labels+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fgmail.modify+https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fuserinfo.email+openid&authuser=0&prompt=consent
```

### **Expected Behavior:**
1. Frontend detects `code` parameter
2. Extracts `identityId` from localStorage
3. Calls backend OAuth callback API
4. Backend exchanges code for tokens
5. Backend saves connection to database
6. Frontend refreshes and shows connected status

---

## 🐛 **Debug Information**

### **Console Logs Added:**
- OAuth initiation details
- Callback URL parameters
- API response data
- Error handling

### **Key Points:**
- Uses same localStorage key: `gmail_identity_id`
- Same duplicate call prevention: `isApiCalled`
- Same URL cleaning and reload pattern
- Identical error handling and cleanup

---

## ✅ **Implementation Status**

- ✅ OAuth initiation with redirect
- ✅ Callback handling with code parameter
- ✅ Backend token exchange
- ✅ Database storage
- ✅ UI state updates
- ✅ Error handling
- ✅ Debug logging

The implementation now **exactly matches** the `frontend_old` OAuth flow! 🚀



