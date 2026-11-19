// =============================================================================
// Authentication Controller (Google Sign-In & Email/Password)
// =============================================================================

import { 
    auth, 
    googleProvider, 
    signInWithPopup, 
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    updateProfile,
    onAuthStateChanged 
} from "./firebase-config.js";

// DOM Elements
const btnGoogle = document.getElementById("btn-google-login");
const tabLogin = document.getElementById("tab-login");
const tabSignup = document.getElementById("tab-signup");
const authForm = document.getElementById("auth-form");
const groupName = document.getElementById("group-name");
const nameInput = document.getElementById("name-input");
const emailInput = document.getElementById("email-input");
const passwordInput = document.getElementById("password-input");
const btnSubmit = document.getElementById("btn-submit");
const errorBanner = document.getElementById("error-banner");
const formTitle = document.getElementById("form-title");
const formSubtitle = document.getElementById("form-subtitle");

let isSignUpMode = false;

// Helper: Redirect to the ChatGPT Cloud interface (home.html)
async function redirectToMainPage(user) {
    if (!user) return;
    try {
        const displayName = user.displayName || user.email.split("@")[0];
        localStorage.setItem("userDisplayName", displayName);
        localStorage.setItem("userEmail", user.email);
        if (user.photoURL) {
            localStorage.setItem("userPhotoURL", user.photoURL);
        }
    } catch (e) {
        console.warn("Could not cache user credentials in localStorage:", e);
    }
    window.location.href = "home.html";
}

// Ensure user stays on the Google Authentication page when opening the app.
// Do not auto-redirect on page load so the first screen is always the login page.


// Tab Switcher
tabLogin.addEventListener("click", () => switchTab(false));
tabSignup.addEventListener("click", () => switchTab(true));

function switchTab(toSignUp) {
    isSignUpMode = toSignUp;
    hideError();

    if (isSignUpMode) {
        tabSignup.classList.add("active");
        tabLogin.classList.remove("active");
        groupName.style.display = "block";
        nameInput.required = true;
        btnSubmit.textContent = "Create Account";
        formTitle.textContent = "Create an Account";
        formSubtitle.textContent = "Get started with your free account";
    } else {
        tabLogin.classList.add("active");
        tabSignup.classList.remove("active");
        groupName.style.display = "none";
        nameInput.required = false;
        btnSubmit.textContent = "Sign In";
        formTitle.textContent = "Welcome Back";
        formSubtitle.textContent = "Sign in to your account to continue";
    }
}

// -----------------------------------------------------------------------------
// 1. Google Sign-In with Popup
// -----------------------------------------------------------------------------
btnGoogle.addEventListener("click", async () => {
    hideError();
    setGoogleLoading(true);

    try {
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;
        console.log("Google Sign-In successful:", user.email);
        await redirectToMainPage(user);
    } catch (error) {
        console.error("Google Auth Error:", error);
        showError(mapFirebaseError(error));
    } finally {
        setGoogleLoading(false);
    }
});

// -----------------------------------------------------------------------------
// 2. Email & Password Submission (Sign In or Sign Up)
// -----------------------------------------------------------------------------
authForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    hideError();

    const email = emailInput.value.trim();
    const password = passwordInput.value;
    const name = nameInput.value.trim();

    setFormLoading(true);

    try {
        if (isSignUpMode) {
            // Sign Up Mode
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Save display name
            if (name) {
                await updateProfile(user, { displayName: name });
            }

            console.log("Account created:", user.email);
            await redirectToMainPage(user);
        } else {
            // Sign In Mode
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            console.log("Signed in:", userCredential.user.email);
            await redirectToMainPage(userCredential.user);
        }
    } catch (error) {
        console.error("Email Auth Error:", error);
        showError(mapFirebaseError(error));
    } finally {
        setFormLoading(false);
    }
});

// -----------------------------------------------------------------------------
// Helpers & Error Mapping
// -----------------------------------------------------------------------------
function showError(message) {
    errorBanner.textContent = message;
    errorBanner.style.display = "block";
}

function hideError() {
    errorBanner.style.display = "none";
    errorBanner.textContent = "";
}

function setGoogleLoading(isLoading) {
    if (isLoading) {
        btnGoogle.disabled = true;
        btnGoogle.innerHTML = `<span class="spinner"></span> Connecting to Google...`;
    } else {
        btnGoogle.disabled = false;
        btnGoogle.innerHTML = `
            <svg viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
            Continue with Google
        `;
    }
}

function setFormLoading(isLoading) {
    if (isLoading) {
        btnSubmit.disabled = true;
        btnSubmit.innerHTML = `<span class="spinner"></span> Please wait...`;
    } else {
        btnSubmit.disabled = false;
        btnSubmit.textContent = isSignUpMode ? "Create Account" : "Sign In";
    }
}

function mapFirebaseError(error) {
    const code = error.code;
    switch (code) {
        case "auth/popup-closed-by-user":
            return "Google sign-in popup was closed before completing.";
        case "auth/cancelled-popup-request":
            return "Multiple popup requests detected. Please try once.";
        case "auth/popup-blocked":
            return "Popup was blocked by your browser. Please allow popups for this site.";
        case "auth/unauthorized-domain":
            return "This domain is not authorized in Firebase Console (Go to Authentication -> Settings -> Authorized Domains).";
        case "auth/operation-not-allowed":
            return "Google Sign-In is not enabled yet in your Firebase Console.";
        case "auth/email-already-in-use":
            return "An account already exists with this email address.";
        case "auth/invalid-email":
            return "Please enter a valid email address.";
        case "auth/user-not-found":
            return "No user found with this email address.";
        case "auth/wrong-password":
        case "auth/invalid-credential":
            return "Incorrect email or password. Please verify your credentials.";
        case "auth/weak-password":
            return "Password should be at least 6 characters long.";
        case "auth/network-request-failed":
            return "Network connection error. Check your internet connection.";
        default:
            return error.message || "An unexpected error occurred. Please try again.";
    }
}

