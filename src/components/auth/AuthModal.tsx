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
        className='mb-6 text-xl font-semibold text-[#1A1A1A]'
      >
        {mode === "signin" ? "Welcome back" : "Create an account"}
      </h2>

      <div className='flex flex-col gap-5'>
        <div className='flex flex-col gap-1'>
          <label
            htmlFor='auth-email'
            className='text-sm font-medium text-[#1A1A1A]'
          >
            Email
          </label>
          <input
            id='auth-email'
            type='email'
            value={email}
            onChange={e => setEmail(e.target.value)}
            autoComplete='email'
            className='rounded-md border border-[#E5E5E5] px-3 py-2 text-sm text-[#1A1A1A] outline-none focus:border-[#1A1A1A]'
          />
        </div>

        <div className='flex flex-col gap-1'>
          <label
            htmlFor='auth-password'
            className='text-sm font-medium text-[#1A1A1A]'
          >
            Password
          </label>
          <input
            id='auth-password'
            type='password'
            value={password}
            onChange={e => setPassword(e.target.value)}
            autoComplete={mode === "signin" ? "current-password" : "new-password"}
            className='rounded-md border border-[#E5E5E5] px-3 py-2 text-sm text-[#1A1A1A] outline-none focus:border-[#1A1A1A]'
          />
        </div>

        {error && (
          <p
            aria-live='polite'
            className='text-sm text-[#E85D4A]'
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

      <p className='mt-6 text-center text-sm text-[#6B6B6B]'>
        {mode === "signin" ? (
          <>
            Don't have an account?{" "}
            <button
              onClick={() => setMode("signup")}
              className='font-medium text-[#1A1A1A] underline underline-offset-2'
            >
              Sign up
            </button>
          </>
        ) : (
          <>
            Already have an account?{" "}
            <button
              onClick={() => setMode("signin")}
              className='font-medium text-[#1A1A1A] underline underline-offset-2'
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
