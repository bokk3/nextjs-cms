import { Suspense } from "react";
import { AuthForm } from "../../components/auth-form";
import { AuthLoading } from "../../components/auth-loading";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-md flex-col items-center justify-center py-32 px-8 bg-white dark:bg-black">
        <div className="mb-8 text-center">
          <Link href="/" className="text-2xl font-bold text-black dark:text-zinc-50 hover:opacity-80">
            Next.js Auth Template
          </Link>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-2">
            Sign in to your account
          </p>
        </div>
        
        <Suspense fallback={<AuthLoading />}>
          <AuthForm />
        </Suspense>
        
        <div className="mt-6 text-center">
          <Link 
            href="/" 
            className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
          >
            ← Back to home
          </Link>
        </div>
      </main>
    </div>
  );
}