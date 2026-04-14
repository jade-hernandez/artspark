import { useEffect, useState } from "react";

import { Button, Modal } from "../ui";

import { useAuthContext } from "../../contexts/AuthContext";

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

  useEffect(() => {
    if (!isOpen) {
      setMode("signin");
      setEmail("");
      setPassword("");
      setError(null);
    }
  }, [isOpen]);

  async function handleSubmit() {
    setError(null);
    setLoading(true);

    try {
      if (mode === "signin") {
        await signInWithEmail(email, password);
      } else {
        await signUpWithEmail(email, password);
      }
      onClose();
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
      <h2
        id={titleId}
        className='text-text-primary mb-6 text-xl font-semibold'
      >
        {mode === "signin" ? "Welcome back" : "Create an account"}
      </h2>

      <div className='flex flex-col gap-5'>
        <div className='flex flex-col gap-1'>
          <label
            htmlFor='auth-email'
            className='text-text-primary text-sm font-medium'
          >
            Email
          </label>
          <input
            id='auth-email'
            type='email'
            value={email}
            onChange={e => setEmail(e.target.value)}
            autoComplete='email'
            className='border-border text-text-primary focus:border-text-primary rounded-md border px-3 py-2 text-sm outline-none'
          />
        </div>

        <div className='flex flex-col gap-1'>
          <label
            htmlFor='auth-password'
            className='text-text-primary text-sm font-medium'
          >
            Password
          </label>
          <input
            id='auth-password'
            type='password'
            value={password}
            onChange={e => setPassword(e.target.value)}
            autoComplete={mode === "signin" ? "current-password" : "new-password"}
            className='border-border text-text-primary focus:border-text-primary rounded-md border px-3 py-2 text-sm outline-none'
          />
        </div>

        {error && (
          <p
            aria-live='polite'
            className='text-accent text-sm'
          >
            {error}
          </p>
        )}

        <Button
          variant='primary'
          size='lg'
          className='w-full'
          disabled={loading}
          onClick={handleSubmit}
        >
          {mode === "signin" ? "Sign in" : "Sign up"}
        </Button>
      </div>

      <p className='text-text-secondary mt-6 text-center text-sm'>
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
    </Modal>
  );
}

export { AuthModal };
