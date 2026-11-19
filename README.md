# Firebase Authentication with Google Sign-In & Email

A clean, modern, and responsive authentication application built with **Firebase Web SDK v10 (Modular)**. Supports one-click **Google Sign-In**, **Email/Password Registration & Login**, persistent sessions, user profile hydration, and protected routes.

---

## 📁 File Structure

```
firebase-google-auth/
├── index.html            # Login & Sign-Up page with Google Sign-In button
├── home.html             # Protected Home/Dashboard page showing user profile & Logout
├── style.css             # Modern responsive dark-mode styling with Google SVG button
├── firebase-config.js    # Firebase app initialization & service export
├── auth.js               # Google Popup, Email login, error handling, redirect logic
└── README.md             # Setup & Firebase Console configuration guide
```

---

## 🛠️ Step-by-Step: Firebase Console Setup

To make Google Sign-In work, follow these 4 simple steps in the Firebase Console:

### 1. Create a Firebase Project
1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Click **Add project** (or **Create a project**).
3. Name your project (e.g., `my-auth-app`) and click **Continue**.
4. Disable or enable Google Analytics (optional) and click **Create project**.

### 2. Enable Google Authentication & Email/Password
1. In the left sidebar, click **Build** &rarr; **Authentication**.
2. Click **Get started**.
3. Under the **Sign-in method** tab:
   - Click **Google**:
     - Toggle the **Enable** switch to ON.
     - Choose your **Project public-facing name**.
     - Select your email in **Project support email**.
     - Click **Save**.
   - Click **Email/Password**:
     - Toggle the **Enable** switch to ON.
     - Click **Save**.

### 3. Add Authorized Domains
1. Under **Authentication** &rarr; click the **Settings** tab.
2. Click **Authorized domains**.
3. Verify that `localhost` is listed. If you deploy to a custom domain or hosting (like GitHub Pages, Vercel, or Netlify), click **Add domain** and enter your domain name.

### 4. Get Web Configuration Credentials
1. Click the **Gear icon (⚙️)** next to *Project Overview* in the left sidebar &rarr; select **Project settings**.
2. Under the **General** tab, scroll down to the **Your apps** section.
3. Click the **Web icon (</>)**.
4. Enter an App nickname (e.g., `Web Auth Client`) and click **Register app**.
5. Copy the `firebaseConfig` object and paste it into `firebase-config.js`:

```javascript
const firebaseConfig = {
    apiKey: "AIzaSy...",
    authDomain: "your-project-id.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project-id.appspot.com",
    messagingSenderId: "123456789...",
    appId: "1:123456789:web:..."
};
```

---

## 🚀 How to Run Locally

Because Firebase Authentication uses ES modules (`import / export`) and cross-origin popups, the files must be served over a local web server (not opened as `file://`).

You can run it in any of the following ways:

### Option A: Using Python (Built-in)
Open your terminal in the `firebase-google-auth` folder and run:
```bash
python -m http.server 8000
```
Then open your browser to: **http://localhost:8000**

### Option B: Using VS Code Live Server
1. Install the **Live Server** extension in VS Code.
2. Right-click on `index.html` &rarr; click **Open with Live Server**.

### Option C: Using Node.js / npx
```bash
npx serve .
```

---

## ✨ Features Included

1. **Google Sign-In**: Uses `signInWithPopup(auth, googleProvider)` with official Google branding.
2. **Auto-Redirect**: Automatically detects when a user logs in and redirects from `index.html` &rarr; `home.html`.
3. **Protected Route**: If an unauthenticated user opens `home.html`, it immediately redirects them back to `index.html`.
4. **User Profile Display**: Displays user's Google profile picture, display name, email address, unique UID, and authentication provider.
5. **Human-Friendly Error Handling**: Maps Firebase error codes (such as popup closed, invalid password, unauthorized domain) to clean error messages.
6. **Mobile Responsive**: Flexbox layout with fluid typography and touch-friendly buttons.

