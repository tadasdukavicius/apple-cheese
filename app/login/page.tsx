export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black pb-40">
      <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-semibold text-black dark:text-zinc-50 mb-6">
          Login
        </h1>
        <form className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 text-black dark:text-zinc-50"
              placeholder="Enter your email"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 text-black dark:text-zinc-50"
              placeholder="Enter your password"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-black dark:bg-zinc-50 text-white dark:text-black py-2 rounded-lg font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 transition"
          >
            Sign In
          </button>
        </form>
        <p className="text-center text-zinc-600 dark:text-zinc-400 mt-4">
          Don't have an account?{" "}
          <a href="#" className="text-black dark:text-zinc-50 font-medium">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}
