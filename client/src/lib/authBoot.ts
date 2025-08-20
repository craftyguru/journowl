// authBoot.ts - Safe authentication boot for first-time visitors
export async function bootNavigate(navigate: (path: string) => void) {
  try {
    const res = await fetch("/api/auth/me", { 
      credentials: "include",
      cache: "no-cache"
    });
    const data = await res.json();
    
    if (data?.loggedIn) {
      navigate("/dashboard");     // logged-in home
    } else {
      navigate("/");              // landing/login page for new users
    }
  } catch (error) {
    console.error('Boot navigation failed:', error);
    navigate("/");                // fail-safe for first load
  }
}

// Alternative boot function that returns auth status instead of navigating
export async function checkAuthStatus(): Promise<{loggedIn: boolean, user?: any}> {
  try {
    const res = await fetch("/api/auth/me", { 
      credentials: "include",
      cache: "no-cache"
    });
    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Auth status check failed:', error);
    return { loggedIn: false };
  }
}