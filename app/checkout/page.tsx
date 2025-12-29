export default function CheckoutPage() {
  const cartItems = [
    { id: "1", name: "Premium Apple Selection", price: 29.99, quantity: 2 },
    { id: "3", name: "Apple & Cheese Gift Box", price: 49.99, quantity: 1 },
  ];

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = 5.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black py-12 px-4 pt-20">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-semibold text-black dark:text-zinc-50 mb-8">
          Checkout
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Checkout Form */}
          <div className="lg:col-span-2 space-y-8">
            {/* Contact Information */}
            <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-black dark:text-zinc-50 mb-6">
                Contact Information
              </h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="w-full px-4 py-3 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 text-black dark:text-zinc-50"
                    placeholder="Enter your email"
                  />
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="newsletter"
                    className="mr-2"
                  />
                  <label htmlFor="newsletter" className="text-sm text-zinc-600 dark:text-zinc-400">
                    Subscribe to our newsletter for updates and offers
                  </label>
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-black dark:text-zinc-50 mb-6">
                Shipping Address
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    className="w-full px-4 py-3 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 text-black dark:text-zinc-50"
                    placeholder="First name"
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    className="w-full px-4 py-3 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 text-black dark:text-zinc-50"
                    placeholder="Last name"
                  />
                </div>
                <div className="md:col-span-2">
                  <label htmlFor="address" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                    Address
                  </label>
                  <input
                    type="text"
                    id="address"
                    className="w-full px-4 py-3 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 text-black dark:text-zinc-50"
                    placeholder="Street address"
                  />
                </div>
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    id="city"
                    className="w-full px-4 py-3 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 text-black dark:text-zinc-50"
                    placeholder="City"
                  />
                </div>
                <div>
                  <label htmlFor="state" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                    State
                  </label>
                  <select
                    id="state"
                    className="w-full px-4 py-3 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 text-black dark:text-zinc-50"
                  >
                    <option value="">Select state</option>
                    <option value="CA">California</option>
                    <option value="NY">New York</option>
                    <option value="TX">Texas</option>
                    <option value="FL">Florida</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="zipCode" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                    ZIP Code
                  </label>
                  <input
                    type="text"
                    id="zipCode"
                    className="w-full px-4 py-3 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 text-black dark:text-zinc-50"
                    placeholder="ZIP code"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    className="w-full px-4 py-3 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 text-black dark:text-zinc-50"
                    placeholder="Phone number"
                  />
                </div>
              </div>
            </div>

            {/* Payment Information */}
            <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-black dark:text-zinc-50 mb-6">
                Payment Information
              </h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="cardNumber" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                    Card Number
                  </label>
                  <input
                    type="text"
                    id="cardNumber"
                    className="w-full px-4 py-3 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 text-black dark:text-zinc-50"
                    placeholder="1234 5678 9012 3456"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="expiryDate" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      id="expiryDate"
                      className="w-full px-4 py-3 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 text-black dark:text-zinc-50"
                      placeholder="MM/YY"
                    />
                  </div>
                  <div>
                    <label htmlFor="cvv" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                      CVV
                    </label>
                    <input
                      type="text"
                      id="cvv"
                      className="w-full px-4 py-3 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 text-black dark:text-zinc-50"
                      placeholder="123"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="cardName" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                    Name on Card
                  </label>
                  <input
                    type="text"
                    id="cardName"
                    className="w-full px-4 py-3 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-800 text-black dark:text-zinc-50"
                    placeholder="Full name as on card"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-md p-6 sticky top-24">
              <h2 className="text-xl font-semibold text-black dark:text-zinc-50 mb-6">
                Order Summary
              </h2>
              
              {/* Cart Items */}
              <div className="space-y-4 mb-6">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between items-center">
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-black dark:text-zinc-50">
                        {item.name}
                      </h3>
                      <p className="text-sm text-zinc-600 dark:text-zinc-400">
                        Quantity: {item.quantity}
                      </p>
                    </div>
                    <span className="text-sm font-medium text-black dark:text-zinc-50">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Order Totals */}
              <div className="border-t border-zinc-200 dark:border-zinc-700 pt-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-600 dark:text-zinc-400">Subtotal:</span>
                  <span className="text-black dark:text-zinc-50">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-600 dark:text-zinc-400">Shipping:</span>
                  <span className="text-black dark:text-zinc-50">${shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-600 dark:text-zinc-400">Tax:</span>
                  <span className="text-black dark:text-zinc-50">${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-semibold border-t border-zinc-200 dark:border-zinc-700 pt-3">
                  <span className="text-black dark:text-zinc-50">Total:</span>
                  <span className="text-black dark:text-zinc-50">${total.toFixed(2)}</span>
                </div>
              </div>

              {/* Place Order Button */}
              <button className="w-full mt-6 bg-black dark:bg-zinc-50 text-white dark:text-black py-3 rounded-lg font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 transition">
                Place Order
              </button>

              {/* Security Notice */}
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-4 text-center">
                🔒 Your payment information is secure and encrypted
              </p>
            </div>
          </div>
        </div>

        {/* Continue Shopping Link */}
        <div className="mt-8 text-center">
          <a
            href="/cart"
            className="text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-zinc-50 transition"
          >
            ← Return to Cart
          </a>
        </div>
      </div>
    </div>
  );
}