import { useEffect, useState } from "react";

import { Button, Modal } from "../ui";

import { useAuthContext } from "../../contexts/AuthContext";
import { HeartIcon } from "../icons/HeartIcon";

type AuthModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const { signInWithEmail, signUpWithEmail } = useAuthContext();

  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [pendingEmail, setPendingEmail] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setMode("signin");
      setEmail("");
      setPassword("");
      setError(null);
      setPendingEmail(null);
    }
  }, [isOpen]);

  async function handleSubmit() {
    setError(null);
    setLoading(true);

    try {
      if (mode === "signin") {
        await signInWithEmail(email, password);
        onClose();
      } else {
        const { requiresConfirmation } = await signUpWithEmail(email, password);
        if (requiresConfirmation) {
          setPendingEmail(email);
        } else {
          onClose();
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  const titleId = "auth-modal-title";

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      labelledBy={titleId}
    >
      {pendingEmail ? (
        <div className='flex flex-col items-center gap-4 py-2 text-center'>
          <div className='bg-surface flex h-12 w-12 items-center justify-center rounded-full'>
            <HeartIcon className='fill-accent stroke-accent' />
          </div>
          <h2
            id={titleId}
            className='text-text-primary text-xl font-semibold'
          >
            Check your inbox
          </h2>
          <p className='text-text-secondary text-base'>
            We sent a confirmation link to
            <span className='text-text-primary font-medium'>{pendingEmail}</span>.
          </p>
          <p className='text-text-secondary text-base'>
            Click the link in the email to activate your account.
          </p>
          <p className='text-text-secondary text-sm'>Can't find it? Check your spam folder.</p>
          <Button
            variant='outline'
            size='lg'
            className='mt-2 w-full'
            onClick={onClose}
          >
            Got it
          </Button>
        </div>
      ) : (
        <>
          <h2
            id={titleId}
            className='text-text-primary mb-6 text-xl font-semibold'
          >
            {mode === "signin" ? "Welcome back" : "Create an account"}
          </h2>

          <form
            onSubmit={e => {
              e.preventDefault();
              handleSubmit();
            }}
          >
            <div className='flex flex-col gap-5'>
              <div className='flex flex-col gap-1'>
                <label
                  htmlFor='auth-email'
                  className='text-text-primary text-base font-medium'
                >
                  Email
                </label>
                <input
                  id='auth-email'
                  type='email'
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  autoComplete='email'
                  className='border-border text-text-primary focus:border-text-primary rounded-md border px-3 py-2 text-base outline-none'
                />
              </div>

              <div className='flex flex-col gap-1'>
                <label
                  htmlFor='auth-password'
                  className='text-text-primary text-base font-medium'
                >
                  Password
                </label>
                <input
                  id='auth-password'
                  type='password'
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  autoComplete={mode === "signin" ? "current-password" : "new-password"}
                  className='border-border text-text-primary focus:border-text-primary rounded-md border px-3 py-2 text-base outline-none'
                />
              </div>

              {error && (
                <p
                  aria-live='polite'
                  className='text-accent text-base'
                >
                  {error}
                </p>
              )}

              <Button
                type='submit'
                variant='primary'
                size='lg'
                className='w-full'
                disabled={loading}
              >
                {loading ? "Loading..." : mode === "signin" ? "Sign in" : "Sign up"}
              </Button>
            </div>
          </form>

          <p className='text-text-secondary mt-6 text-center text-base'>
            {mode === "signin" ? (
              <>
                Don't have an account?{" "}
                <button
                  onClick={() => setMode("signup")}
                  className='text-text-primary font-medium underline underline-offset-2'
                >
                  Sign up
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button
                  onClick={() => setMode("signin")}
                  className='text-text-primary font-medium underline underline-offset-2'
                >
                  Sign in
                </button>
              </>
            )}
          </p>
        </>
      )}
    </Modal>
  );
}

export { AuthModal };
