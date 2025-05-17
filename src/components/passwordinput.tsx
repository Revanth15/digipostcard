"use client";
import React, { useState, useEffect, ReactNode } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { db, getOrCreateAnonymousUser } from '@/lib/firebase';
import { doc, getDoc, setDoc, updateDoc, Timestamp } from 'firebase/firestore';
import Confetti from 'react-confetti';
import { Loader2 } from 'lucide-react';

interface PasswordModalProps {
  children: ReactNode;
}

const PasswordModal: React.FC<PasswordModalProps> = ({ children }) => {
  const [open, setOpen] = useState<boolean>(true);
  const [passwordAttempt, setPasswordAttempt] = useState<string>("");
  const [attemptsRemaining, setAttemptsRemaining] = useState<number>(0);
  const [error, setError] = useState<string>("");
  const [userId, setUserId] = useState<string | null>(null);
  const [correctPassword, setCorrectPassword] = useState<string>("");
  const [maxAttempts, setMaxAttempts] = useState<number>(0);
  const [passwordCorrect, setPasswordCorrect] = useState<boolean>(false);
  const [showConfetti, setShowConfetti] = useState<boolean>(false);
  const [hint, setHint] = useState<string>("");
  const [loadingUser, setLoadingUser] = useState<boolean>(true); 
  const [submitting, setSubmitting] = useState<boolean>(false); 

  const hints = {
    5: "Hint: Total number of minutes ends with a 2",
    10: "Hint: The call duration was between 9-12 hours. Total minutes is 3 digits.",
    15: "Hint: It was 2024 Q1"
  };

  useEffect(() => {
    const initialize = async () => {
      setLoadingUser(true);
      const uid = await getOrCreateAnonymousUser();
      if (uid) {
        setUserId(uid);
        const settingsRef = doc(db, 'settings', 'config');
        const settingsSnap = await getDoc(settingsRef);

        if (settingsSnap.exists()) {
          const settingsData = settingsSnap.data();
          setCorrectPassword(settingsData.password);
          setMaxAttempts(settingsData.maxAttempts);
        } else {
          console.error("Settings document does not exist");
          setCorrectPassword("password");
          setMaxAttempts(20);
        }

        const userRef = doc(db, 'users', uid);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
          await setDoc(userRef, {
            attempts: 0,
            passwordAttempts: [],
            passwordCorrect: false,
          });
          setAttemptsRemaining(maxAttempts);
        } else {
          const userData = userSnap.data();
          setAttemptsRemaining(maxAttempts - userData.attempts);
          setPasswordCorrect(userData.passwordCorrect);
          if (userData.passwordCorrect) {
            setOpen(false);
          }
        }
      }
      setLoadingUser(false);
    };
    initialize();
  }, [maxAttempts]);


  const handlePasswordSubmit = async () => {
    if (!userId || submitting) {
      return;
    }

    setSubmitting(true);
    setError(""); // Clear previous error

    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      console.error("User document does not exist.");
      setSubmitting(false);
      return;
    }
    const userData = userSnap.data();
    const currentAttempts = userData.attempts;

    if (currentAttempts >= maxAttempts) {
      setError("Too many attempts. Access denied.");
      setSubmitting(false);
      return;
    }

    if (passwordAttempt === correctPassword) {
      setOpen(false);
      setPasswordCorrect(true);
      setShowConfetti(true);
      await updateDoc(userRef, {
        attempts: currentAttempts + 1,
        passwordAttempts: [
          ...userData.passwordAttempts,
          { attempt: passwordAttempt, timestamp: Timestamp.now() },
        ],
        passwordCorrect: true,
      });
      setSubmitting(false);
    } else {
      const newAttempts = currentAttempts + 1;
      setAttemptsRemaining(maxAttempts - newAttempts);
      setError(`Incorrect password. ${maxAttempts - newAttempts} attempts remaining.`);
      setPasswordAttempt("");
      await updateDoc(userRef, {
        attempts: newAttempts,
        passwordAttempts: [
          ...userData.passwordAttempts,
          { attempt: passwordAttempt, timestamp: Timestamp.now() },
        ],
      });

      const remainingAttempts = maxAttempts - newAttempts;
      let foundHint = false;
      for (const attempts in hints) {
        if (parseInt(attempts) === remainingAttempts) {
          setHint(hints[parseInt(attempts) as keyof typeof hints]);
          foundHint = true;
          break;
        }
      }
      setSubmitting(false);
    }
  };

  if (loadingUser) {
    return (
      <Dialog open={open} onOpenChange={() => { }}>
        <DialogContent className="sm:max-w-[425px] flex items-center justify-center h-48">
            <DialogTitle></DialogTitle>
          <Loader2 className="animate-spin h-10 w-10" />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={() => { }}>
      {showConfetti && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={false}
          numberOfPieces={1000}
        />
      )}
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Hello there birthday girl!</DialogTitle>
          <DialogDescription>
            <p>If life was soo easy, id be a billionaire. Go on and guess the password. You have {maxAttempts} tries, good luck!</p>
            <br />
            <p>Hint: Its a number (longest we ever called in 1 day + the date (ddmmyy))</p>
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="">
            <Input
              id="password"
              type="text"
              value={passwordAttempt}
              onChange={(e) => setPasswordAttempt(e.target.value)}
              className="col-span-3"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handlePasswordSubmit();
                }
              }}
            />
          </div>
          {error && <p className="text-red-500">{error}</p>}
          {hint && <p className="text-blue-500">{hint}</p>}
          {attemptsRemaining > 0 && (
            <p>Attempts Remaining: {attemptsRemaining}</p>
          )}
        </div>
        <DialogFooter>
          <Button type="button" onClick={handlePasswordSubmit} disabled={submitting}>
            {submitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Guessing...
              </>
            ) : (
              "Guess"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
      {!open && children}
    </Dialog>
  );
};

export default PasswordModal;