export default function ContactPage() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black py-12 px-4 pt-20">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-semibold text-black dark:text-zinc-50 mb-12 text-center">
          Contact Us
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-semibold text-black dark:text-zinc-50 mb-6">
              Send us a Message
            </h2>
            <form className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  className="w-full px-4 py-3 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 text-black dark:text-zinc-50"
                  placeholder="Enter your full name"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full px-4 py-3 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 text-black dark:text-zinc-50"
                  placeholder="Enter your email address"
                />
              </div>
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  className="w-full px-4 py-3 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 text-black dark:text-zinc-50"
                  placeholder="What's this about?"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  rows={5}
                  className="w-full px-4 py-3 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 text-black dark:text-zinc-50 resize-none"
                  placeholder="Tell us how we can help you..."
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full bg-black dark:bg-zinc-50 text-white dark:text-black py-3 rounded-lg font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 transition"
              >
                Send Message
              </button>
            </form>
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-semibold text-black dark:text-zinc-50 mb-6">
                Get in Touch
              </h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-black dark:text-zinc-50">Phone</h3>
                  <p className="text-zinc-600 dark:text-zinc-400">+370 666 66666</p>
                </div>
                <div>
                  <h3 className="font-semibold text-black dark:text-zinc-50">Email</h3>
                  <p className="text-zinc-600 dark:text-zinc-400">contacts@applecheese.com</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}