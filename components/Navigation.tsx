export default function Navigation() {
  return (
    <nav className="bg-white dark:bg-zinc-900 shadow-md">
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        <a href="/" className="text-xl font-semibold text-black dark:text-zinc-50">
          Apple & Cheese
        </a>
        <div className="flex gap-6">
          <a
            href="/"
            className="text-black dark:text-zinc-50 hover:text-zinc-600 dark:hover:text-zinc-400 transition"
          >
            Home
          </a>
          <a
            href="/products"
            className="text-black dark:text-zinc-50 hover:text-zinc-600 dark:hover:text-zinc-400 transition"
          >
            Products
          </a>
          <a
            href="/about"
            className="text-black dark:text-zinc-50 hover:text-zinc-600 dark:hover:text-zinc-400 transition"
          >
            About
          </a>
          <a
            href="/contact"
            className="text-black dark:text-zinc-50 hover:text-zinc-600 dark:hover:text-zinc-400 transition"
          >
            Contact
          </a>
          <a
            href="/cart"
            className="text-black dark:text-zinc-50 hover:text-zinc-600 dark:hover:text-zinc-400 transition"
          >
            Cart
          </a>
          <a
            href="/login"
            className="text-black dark:text-zinc-50 hover:text-zinc-600 dark:hover:text-zinc-400 transition"
          >
            Login
          </a>
        </div>
      </div>
    </nav>
  );
}