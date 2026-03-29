import { login } from './actions'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ message: string }>
}) {
  const { message } = await searchParams

  return (
    <main className="flex min-h-screen items-center justify-center p-8 bg-[var(--background)]">
      <section className="w-full max-w-md p-8 rounded-xl shadow-lg border border-[var(--border)] bg-[var(--card)]">
        <header className="mb-8 text-center">
          <h1 className="text-2xl font-bold mb-2 text-[var(--foreground)]">Welcome Back</h1>
          <p className="text-[var(--muted-foreground)] text-sm">Sign in to the distribution management system</p>
        </header>

        <form className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-[var(--foreground)]" htmlFor="email">
              Email Address
            </label>
            <input
              className="h-10 px-3 rounded-md border border-[var(--input)] bg-[var(--background)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
              id="email"
              name="email"
              type="email"
              placeholder="name@example.com"
              required
            />
          </div>
          
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-[var(--foreground)]" htmlFor="password">
              Password
            </label>
            <input
              className="h-10 px-3 rounded-md border border-[var(--input)] bg-[var(--background)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)]"
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            formAction={login}
            className="h-10 w-full rounded-md bg-[var(--primary)] text-[var(--primary-foreground)] font-medium hover:bg-[var(--primary-hover)] transition-colors duration-200 motion-reduce:transition-none"
          >
            Sign In
          </button>

          {message && (
            <div className="p-4 mt-2 text-sm text-center rounded-md bg-red-500/10 text-red-500 border border-red-500/20">
              {message}
            </div>
          )}
        </form>
      </section>
    </main>
  )
}
