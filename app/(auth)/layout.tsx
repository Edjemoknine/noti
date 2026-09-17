import Link from "next/link";

export default function AuthLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <main className="auth-shell flex min-h-screen items-center justify-center px-5 py-10 sm:px-8">
      <div className="auth-frame w-full max-w-[430px]">
        <div className="auth-header mb-8 flex items-center justify-between">
          <Link className="auth-brand" href="/" aria-label="Noti home">
            <span className="auth-brand-mark">n</span>
            <span>noti</span>
          </Link>
          <Link className="auth-back-link" href="/">Back home <span aria-hidden="true">↗</span></Link>
        </div>
        {children}
        <p className="auth-footer mt-6 text-center">A little more clarity, every day.</p>
      </div>
    </main>
  );
}
