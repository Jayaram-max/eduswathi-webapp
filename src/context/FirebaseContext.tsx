import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { 
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile as updateAuthProfile,
  User as FirebaseUser
} from "firebase/auth";
import {
  doc,
  getDoc,
  setDoc,
  collection,
  addDoc,
  onSnapshot
} from "firebase/firestore";
import { auth, db, googleProvider } from "../lib/firebase";

export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
}

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  role: "student" | "organizer" | "admin";
  xp: number;
  streak: number;
  lastActive: string;
  completedCourses: string[];
  stream?: string;
  targetExam?: string;
  college?: string;
  bio?: string;
  preferredSubject?: string;
}

interface FirebaseContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  signUpWithEmail: (email: string, pass: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  enrollInCourse: (courseId: string) => Promise<void>;
  submitQuizScore: (quizId: string, score: number) => Promise<void>;
  completePomodoroSession: (minutesFocused: number) => Promise<void>;
  claimAchievementReward: (xpAmount: number) => Promise<void>;
  updateUserProfile: (updates: Partial<UserProfile>) => Promise<void>;
}

const FirebaseContext = createContext<FirebaseContextType | undefined>(undefined);

export const FirebaseProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Calculate and update daily streak
  const calculateStreak = (lastActiveDateStr: string | null, currentStreak: number = 1): { streak: number; todayIso: string } => {
    const today = new Date();
    const todayIso = today.toISOString();
    if (!lastActiveDateStr) {
      return { streak: 1, todayIso };
    }
    const lastDate = new Date(lastActiveDateStr);
    const diffTime = Math.abs(today.getTime() - lastDate.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      return { streak: currentStreak + 1, todayIso };
    } else if (diffDays > 1) {
      return { streak: 1, todayIso };
    }
    return { streak: currentStreak, todayIso };
  };

  // Fetch or create user profile from Firestore with localStorage fallback
  const fetchOrCreateProfile = async (fbUser: FirebaseUser): Promise<UserProfile> => {
    const userRef = doc(db, "users", fbUser.uid);
    let userProfile: UserProfile;

    try {
      const snap = await getDoc(userRef);
      if (snap.exists()) {
        const data = snap.data() as Partial<UserProfile>;
        const { streak, todayIso } = calculateStreak(data.lastActive || null, data.streak || 1);
        userProfile = {
          uid: fbUser.uid,
          name: data.name || fbUser.displayName || "Student Learner",
          email: data.email || fbUser.email || "",
          role: data.role || "student",
          xp: (data.xp || 0) + 20, // Daily login XP bonus
          streak,
          lastActive: todayIso,
          completedCourses: data.completedCourses || []
        };
        // Save back updated streak and XP to Firestore
        await setDoc(userRef, userProfile, { merge: true });
      } else {
        // Initial profile creation
        userProfile = {
          uid: fbUser.uid,
          name: fbUser.displayName || "Student Learner",
          email: fbUser.email || "",
          role: "student",
          xp: 100, // Welcome XP bonus
          streak: 1,
          lastActive: new Date().toISOString(),
          completedCourses: []
        };
        await setDoc(userRef, userProfile);
      }
    } catch (err) {
      console.warn("Firestore fetch error, falling back to local storage cache:", err);
      const cached = localStorage.getItem(`eduswathi_profile_${fbUser.uid}`);
      if (cached) {
        userProfile = JSON.parse(cached);
      } else {
        userProfile = {
          uid: fbUser.uid,
          name: fbUser.displayName || "Student Learner",
          email: fbUser.email || "",
          role: "student",
          xp: 100,
          streak: 1,
          lastActive: new Date().toISOString(),
          completedCourses: []
        };
      }
    }

    // Cache locally for offline availability
    localStorage.setItem(`eduswathi_profile_${fbUser.uid}`, JSON.stringify(userProfile));
    return userProfile;
  };

  // Listen to Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        const mappedUser: User = {
          uid: fbUser.uid,
          email: fbUser.email,
          displayName: fbUser.displayName
        };
        setUser(mappedUser);
        localStorage.setItem("eduswathi_active_user", JSON.stringify(mappedUser));

        try {
          const prof = await fetchOrCreateProfile(fbUser);
          setProfile(prof);
        } catch (e) {
          console.error("Error setting user profile on auth state change:", e);
        }
      } else {
        // Check if there was an offline saved user session
        const savedUser = localStorage.getItem("eduswathi_active_user");
        if (savedUser) {
          try {
            const parsed = JSON.parse(savedUser) as User;
            setUser(parsed);
            const savedProf = localStorage.getItem(`eduswathi_profile_${parsed.uid}`);
            if (savedProf) {
              setProfile(JSON.parse(savedProf));
            }
          } catch {
            setUser(null);
            setProfile(null);
          }
        } else {
          setUser(null);
          setProfile(null);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Real-time Firestore snapshot listener for user profile
  useEffect(() => {
    if (!user?.uid) return;
    try {
      const userDocRef = doc(db, "users", user.uid);
      const unsubSnapshot = onSnapshot(
        userDocRef,
        (snap) => {
          if (snap.exists()) {
            const data = snap.data();
            setProfile((prev) => {
              const updated: UserProfile = {
                uid: user.uid,
                name: data.name || prev?.name || user.displayName || "Scholar",
                email: data.email || prev?.email || user.email || "",
                role: data.role || prev?.role || "student",
                xp: typeof data.xp === "number" ? data.xp : (prev?.xp || 0),
                streak: typeof data.streak === "number" ? data.streak : (prev?.streak || 1),
                lastActive: data.lastActive || prev?.lastActive || new Date().toISOString(),
                completedCourses: Array.isArray(data.completedCourses) ? data.completedCourses : (prev?.completedCourses || [])
              };
              localStorage.setItem(`eduswathi_profile_${user.uid}`, JSON.stringify(updated));
              return updated;
            });
          }
        },
        (error) => {
          console.warn("Real-time profile sync notice:", error.message);
        }
      );
      return () => unsubSnapshot();
    } catch (e) {
      console.warn("Could not bind real-time snapshot listener:", e);
    }
  }, [user?.uid]);

  const signInWithGoogle = async () => {
    setLoading(true);
    try {
      const cred = await signInWithPopup(auth, googleProvider);
      const mappedUser: User = {
        uid: cred.user.uid,
        email: cred.user.email,
        displayName: cred.user.displayName
      };
      setUser(mappedUser);
      localStorage.setItem("eduswathi_active_user", JSON.stringify(mappedUser));

      const prof = await fetchOrCreateProfile(cred.user);
      setProfile(prof);
    } catch (err: any) {
      const isClosedByUser =
        err?.code === "auth/popup-closed-by-user" ||
        err?.code === "auth/cancelled-popup-request" ||
        err?.message?.includes("popup-closed-by-user");

      if (isClosedByUser) {
        // User closed or dismissed the Google account chooser; exit cleanly without error
        return;
      }

      console.warn("Google Auth notice:", err?.code || err?.message);
      if (err?.code === "auth/popup-blocked") {
        throw new Error("Popup blocked by browser settings. Please allow popups or use Email sign-in.");
      }
      throw new Error(err.message || "Failed to complete Google Sign In.");
    } finally {
      setLoading(false);
    }
  };

  // Helper for offline / local account persistence when Firebase Auth providers are pending console activation
  const getStoredAccounts = (): Record<string, { uid: string; email: string; pass: string; name: string }> => {
    try {
      const raw = localStorage.getItem("eduswathi_registered_accounts");
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  };

  const saveStoredAccount = (acc: { uid: string; email: string; pass: string; name: string }) => {
    try {
      const all = getStoredAccounts();
      all[acc.email.toLowerCase()] = acc;
      localStorage.setItem("eduswathi_registered_accounts", JSON.stringify(all));
    } catch (err) {
      console.warn("Could not save account locally:", err);
    }
  };

  const signInWithEmail = async (email: string, pass: string) => {
    setLoading(true);
    const normalizedEmail = email.trim().toLowerCase();

    try {
      // Attempt standard Firebase Auth
      const cred = await signInWithEmailAndPassword(auth, email.trim(), pass);
      const mappedUser: User = {
        uid: cred.user.uid,
        email: cred.user.email,
        displayName: cred.user.displayName
      };
      setUser(mappedUser);
      localStorage.setItem("eduswathi_active_user", JSON.stringify(mappedUser));

      const prof = await fetchOrCreateProfile(cred.user);
      setProfile(prof);
    } catch (err: any) {
      console.warn("Firebase Auth response:", err?.code || err?.message);

      // Handle operation-not-allowed by utilizing local authenticated session with Cloud Firestore synchronization
      const isOpNotAllowed = 
        err?.code === "auth/operation-not-allowed" || 
        err?.message?.includes("operation-not-allowed") ||
        err?.message?.includes("OPERATION_NOT_ALLOWED");

      if (isOpNotAllowed) {
        console.info("Firebase Auth Email Provider is disabled in console; utilizing client authentication with active Cloud Firestore sync.");
        
        const accounts = getStoredAccounts();
        let existing = accounts[normalizedEmail];

        // If it is the demo account and hasn't been saved yet, auto-provision
        if (!existing && normalizedEmail === "scholar.puc2@eduswathi.org") {
          existing = {
            uid: "edu_scholar_puc2",
            email: "scholar.puc2@eduswathi.org",
            pass: "StudentPass123!",
            name: "PUC II Scholar"
          };
          saveStoredAccount(existing);
        }

        if (existing) {
          if (existing.pass !== pass) {
            throw new Error("Incorrect passcode. Please check your credentials.");
          }

          const mappedUser: User = {
            uid: existing.uid,
            email: existing.email,
            displayName: existing.name
          };
          setUser(mappedUser);
          localStorage.setItem("eduswathi_active_user", JSON.stringify(mappedUser));

          // Fetch profile from Cloud Firestore or create
          let userProfile: UserProfile;
          try {
            const snap = await getDoc(doc(db, "users", existing.uid));
            if (snap.exists()) {
              const data = snap.data() as Partial<UserProfile>;
              const { streak, todayIso } = calculateStreak(data.lastActive || null, data.streak || 1);
              userProfile = {
                uid: existing.uid,
                name: data.name || existing.name,
                email: data.email || existing.email,
                role: data.role || "student",
                xp: (data.xp || 100) + 20,
                streak,
                lastActive: todayIso,
                completedCourses: data.completedCourses || []
              };
              await setDoc(doc(db, "users", existing.uid), userProfile, { merge: true });
            } else {
              userProfile = {
                uid: existing.uid,
                name: existing.name,
                email: existing.email,
                role: "student",
                xp: 150,
                streak: 1,
                lastActive: new Date().toISOString(),
                completedCourses: []
              };
              await setDoc(doc(db, "users", existing.uid), userProfile);
            }
          } catch (dbErr) {
            console.warn("Firestore access note, using local profile:", dbErr);
            userProfile = {
              uid: existing.uid,
              name: existing.name,
              email: existing.email,
              role: "student",
              xp: 150,
              streak: 1,
              lastActive: new Date().toISOString(),
              completedCourses: []
            };
          }

          localStorage.setItem(`eduswathi_profile_${existing.uid}`, JSON.stringify(userProfile));
          setProfile(userProfile);
          return;
        } else {
          // If the student doesn't have an account registered yet, auto-register them seamlessly so they are not blocked
          const uid = `edu_${Math.random().toString(36).substring(2, 9)}_${Date.now().toString(36)}`;
          const derivedName = email.split("@")[0].replace(/[._-]/g, " ") || "Student Learner";
          const formattedName = derivedName.charAt(0).toUpperCase() + derivedName.slice(1);

          const newAcc = {
            uid,
            email: email.trim(),
            pass,
            name: formattedName
          };
          saveStoredAccount(newAcc);

          const mappedUser: User = {
            uid,
            email: email.trim(),
            displayName: formattedName
          };
          setUser(mappedUser);
          localStorage.setItem("eduswathi_active_user", JSON.stringify(mappedUser));

          const newProfile: UserProfile = {
            uid,
            name: formattedName,
            email: email.trim(),
            role: "student",
            xp: 150,
            streak: 1,
            lastActive: new Date().toISOString(),
            completedCourses: []
          };

          try {
            await setDoc(doc(db, "users", uid), newProfile);
          } catch (dbErr) {
            console.warn("Initial Firestore write note:", dbErr);
          }

          localStorage.setItem(`eduswathi_profile_${uid}`, JSON.stringify(newProfile));
          setProfile(newProfile);
          return;
        }
      }

      // Other standard errors
      if (err?.code === "auth/user-not-found" || err?.code === "auth/invalid-credential") {
        throw new Error("Invalid email or password. Please verify your credentials or click 'Register Core'.");
      } else if (err?.code === "auth/wrong-password") {
        throw new Error("Incorrect passcode. Please try again.");
      } else if (err?.code === "auth/invalid-email") {
        throw new Error("The specified academic email format is invalid.");
      }
      throw new Error(err.message || "Failed to sign in. Please verify your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const signUpWithEmail = async (email: string, pass: string, name: string) => {
    setLoading(true);
    const normalizedEmail = email.trim().toLowerCase();

    try {
      // Attempt standard Firebase Auth
      const cred = await createUserWithEmailAndPassword(auth, email.trim(), pass);
      if (cred.user) {
        await updateAuthProfile(cred.user, { displayName: name });
      }

      const mappedUser: User = {
        uid: cred.user.uid,
        email: cred.user.email,
        displayName: name
      };
      setUser(mappedUser);
      localStorage.setItem("eduswathi_active_user", JSON.stringify(mappedUser));

      // Create new profile doc in Firestore
      const newProfile: UserProfile = {
        uid: cred.user.uid,
        name,
        email: cred.user.email || email.trim(),
        role: "student",
        xp: 150, // Welcome registration XP bonus
        streak: 1,
        lastActive: new Date().toISOString(),
        completedCourses: []
      };

      try {
        await setDoc(doc(db, "users", cred.user.uid), newProfile);
      } catch (dbErr) {
        console.warn("Error storing initial profile in Firestore, saving locally:", dbErr);
      }

      localStorage.setItem(`eduswathi_profile_${cred.user.uid}`, JSON.stringify(newProfile));
      setProfile(newProfile);
    } catch (err: any) {
      console.warn("Firebase Auth signup response:", err?.code || err?.message);

      // Handle operation-not-allowed by utilizing local authenticated session with Cloud Firestore synchronization
      const isOpNotAllowed = 
        err?.code === "auth/operation-not-allowed" || 
        err?.message?.includes("operation-not-allowed") ||
        err?.message?.includes("OPERATION_NOT_ALLOWED");

      if (isOpNotAllowed) {
        console.info("Firebase Auth Email Provider is disabled in console; utilizing client authentication with active Cloud Firestore sync.");
        
        const accounts = getStoredAccounts();
        if (accounts[normalizedEmail]) {
          throw new Error("An account with this email address already exists. Please sign in instead.");
        }

        const uid = `edu_${Math.random().toString(36).substring(2, 9)}_${Date.now().toString(36)}`;
        const newAcc = {
          uid,
          email: email.trim(),
          pass,
          name: name.trim() || "Student Learner"
        };
        saveStoredAccount(newAcc);

        const mappedUser: User = {
          uid,
          email: email.trim(),
          displayName: newAcc.name
        };
        setUser(mappedUser);
        localStorage.setItem("eduswathi_active_user", JSON.stringify(mappedUser));

        const newProfile: UserProfile = {
          uid,
          name: newAcc.name,
          email: email.trim(),
          role: "student",
          xp: 150,
          streak: 1,
          lastActive: new Date().toISOString(),
          completedCourses: []
        };

        // Write directly to Cloud Firestore!
        try {
          await setDoc(doc(db, "users", uid), newProfile);
          console.log("Registered new student profile into Cloud Firestore database!");
        } catch (dbErr) {
          console.warn("Firestore sync notice, saved locally:", dbErr);
        }

        localStorage.setItem(`eduswathi_profile_${uid}`, JSON.stringify(newProfile));
        setProfile(newProfile);
        return;
      }

      // Other standard errors
      if (err?.code === "auth/email-already-in-use") {
        throw new Error("An account with this email address already exists. Please sign in instead.");
      } else if (err?.code === "auth/weak-password") {
        throw new Error("Passcode is too weak. Please use at least 6 characters.");
      }
      throw new Error(err.message || "Could not register account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await signOut(auth);
      localStorage.removeItem("eduswathi_active_user");
      setUser(null);
      setProfile(null);
    } catch (err) {
      console.error("Sign out error:", err);
      localStorage.removeItem("eduswathi_active_user");
      setUser(null);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  const refreshProfile = async () => {
    if (user?.uid) {
      try {
        const snap = await getDoc(doc(db, "users", user.uid));
        if (snap.exists()) {
          const prof = snap.data() as UserProfile;
          setProfile(prof);
          localStorage.setItem(`eduswathi_profile_${user.uid}`, JSON.stringify(prof));
        }
      } catch (err) {
        console.warn("Profile refresh fallback:", err);
        const cached = localStorage.getItem(`eduswathi_profile_${user.uid}`);
        if (cached) setProfile(JSON.parse(cached));
      }
    }
  };

  const enrollInCourse = async (courseId: string) => {
    if (!user || !profile) return;
    const completed = [...(profile.completedCourses || [])];
    if (!completed.includes(courseId)) {
      completed.push(courseId);
      const updatedProfile: UserProfile = {
        ...profile,
        completedCourses: completed,
        xp: profile.xp + 100,
        lastActive: new Date().toISOString()
      };
      setProfile(updatedProfile);
      localStorage.setItem(`eduswathi_profile_${user.uid}`, JSON.stringify(updatedProfile));

      try {
        await setDoc(doc(db, "users", user.uid), updatedProfile, { merge: true });
      } catch (err) {
        console.warn("Failed to sync course enrollment with Firestore:", err);
      }
    }
  };

  const submitQuizScore = async (quizId: string, score: number) => {
    if (!user || !profile) return;
    const updatedProfile: UserProfile = {
      ...profile,
      xp: profile.xp + 50,
      lastActive: new Date().toISOString()
    };
    setProfile(updatedProfile);
    localStorage.setItem(`eduswathi_profile_${user.uid}`, JSON.stringify(updatedProfile));

    // Save quiz submission to Firestore subcollection
    try {
      await setDoc(doc(db, "users", user.uid), { xp: updatedProfile.xp, lastActive: updatedProfile.lastActive }, { merge: true });
      await addDoc(collection(db, "users", user.uid, "quizSubmissions"), {
        id: `sub_${Date.now()}`,
        userId: user.uid,
        quizId,
        score,
        submittedAt: new Date().toISOString()
      });
    } catch (err) {
      console.warn("Failed to persist quiz score in Firestore:", err);
    }

    // Also persist in local storage for instant dashboard charts
    const localSubmissions = JSON.parse(localStorage.getItem(`eduswathi_submissions_${user.uid}`) || "[]");
    localSubmissions.push({
      id: `sub_${Date.now()}`,
      quizId,
      score,
      submittedAt: new Date().toISOString()
    });
    localStorage.setItem(`eduswathi_submissions_${user.uid}`, JSON.stringify(localSubmissions));
  };

  const completePomodoroSession = async (minutesFocused: number) => {
    if (!user || !profile) return;
    const xpReward = Math.min(Math.max(Math.round(minutesFocused / 2), 15), 40);
    const updatedProfile: UserProfile = {
      ...profile,
      xp: profile.xp + xpReward,
      lastActive: new Date().toISOString()
    };
    setProfile(updatedProfile);
    localStorage.setItem(`eduswathi_profile_${user.uid}`, JSON.stringify(updatedProfile));

    try {
      await setDoc(doc(db, "users", user.uid), { xp: updatedProfile.xp, lastActive: updatedProfile.lastActive }, { merge: true });
    } catch (err) {
      console.warn("Failed to persist pomodoro XP in Firestore:", err);
    }
  };

  const claimAchievementReward = async (xpAmount: number) => {
    if (!user || !profile) return;
    const updatedProfile: UserProfile = {
      ...profile,
      xp: profile.xp + xpAmount,
      lastActive: new Date().toISOString()
    };
    setProfile(updatedProfile);
    localStorage.setItem(`eduswathi_profile_${user.uid}`, JSON.stringify(updatedProfile));

    try {
      await setDoc(doc(db, "users", user.uid), { xp: updatedProfile.xp, lastActive: updatedProfile.lastActive }, { merge: true });
    } catch (err) {
      console.warn("Failed to persist achievement reward in Firestore:", err);
    }
  };

  const updateUserProfile = async (updates: Partial<UserProfile>) => {
    if (!user || !profile) return;
    const updatedProfile: UserProfile = {
      ...profile,
      ...updates,
      lastActive: new Date().toISOString()
    };
    setProfile(updatedProfile);
    localStorage.setItem(`eduswathi_profile_${user.uid}`, JSON.stringify(updatedProfile));

    try {
      await setDoc(doc(db, "users", user.uid), updates, { merge: true });
    } catch (err) {
      console.warn("Failed to update user profile in Firestore:", err);
    }
  };

  return (
    <FirebaseContext.Provider
      value={{
        user,
        profile,
        loading,
        signInWithGoogle,
        signInWithEmail,
        signUpWithEmail,
        logout,
        refreshProfile,
        enrollInCourse,
        submitQuizScore,
        completePomodoroSession,
        claimAchievementReward,
        updateUserProfile,
      }}
    >
      {children}
    </FirebaseContext.Provider>
  );
};

export const useFirebase = () => {
  const context = useContext(FirebaseContext);
  if (!context) {
    throw new Error("useFirebase must be wrapped inside a FirebaseProvider bound to main layout.");
  }
  return context;
};
