export default function CartPage() {
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
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-semibold text-black dark:text-zinc-50 mb-8">
          Shopping Cart
        </h1>
        
        {/* Cart Items */}
        <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-md p-8 mb-8">
          {cartItems.length > 0 ? (
            <div className="space-y-6">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between border-b border-zinc-200 dark:border-zinc-700 pb-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-zinc-200 dark:bg-zinc-800 rounded-lg flex items-center justify-center">
                      <span className="text-xs text-zinc-500 dark:text-zinc-400">IMG</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-black dark:text-zinc-50">{item.name}</h3>
                      <p className="text-zinc-600 dark:text-zinc-400">${item.price.toFixed(2)} each</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <button className="w-8 h-8 rounded-full border border-zinc-300 dark:border-zinc-600 flex items-center justify-center">
                        -
                      </button>
                      <span className="text-black dark:text-zinc-50">{item.quantity}</span>
                      <button className="w-8 h-8 rounded-full border border-zinc-300 dark:border-zinc-600 flex items-center justify-center">
                        +
                      </button>
                    </div>
                    <span className="font-semibold text-black dark:text-zinc-50 w-20 text-right">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-zinc-600 dark:text-zinc-400 text-center py-12">
              Your cart is empty
            </p>
          )}
          
          {cartItems.length > 0 && (
            <div className="flex justify-center mt-8">
              <a
                href="/products"
                className="text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-zinc-50 transition"
              >
                Continue Shopping
              </a>
            </div>
          )}
        </div>
        {/* Order Summary */}
        <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-md p-8">
          <h2 className="text-xl font-semibold text-black dark:text-zinc-50 mb-4">
            Order Summary
          </h2>
          <div className="flex justify-between mb-2">
            <span className="text-zinc-700 dark:text-zinc-300">Subtotal:</span>
            <span className="text-black dark:text-zinc-50">${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-zinc-700 dark:text-zinc-300">Shipping:</span>
            <span className="text-black dark:text-zinc-50">${shipping.toFixed(2)}</span>
          </div>
          <div className="flex justify-between mb-4 border-b border-zinc-200 dark:border-zinc-700 pb-4">
            <span className="text-zinc-700 dark:text-zinc-300">Tax:</span>
            <span className="text-black dark:text-zinc-50">${tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-lg font-semibold">
            <span className="text-black dark:text-zinc-50">Total:</span>
            <span className="text-black dark:text-zinc-50">${total.toFixed(2)}</span>
          </div>
          <a
            href="/checkout"
            className="w-full mt-6 bg-black dark:bg-zinc-50 text-white dark:text-black py-2 rounded-lg font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 transition inline-block text-center"
          >
            Proceed to Checkout
          </a>
        </div>
      </div>
    </div>
  );
}
