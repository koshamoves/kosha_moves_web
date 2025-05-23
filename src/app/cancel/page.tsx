export default function CancelPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-red-50">
      <div className="max-w-md text-center space-y-4">
        <h1 className="text-4xl font-bold text-red-700">Payment Canceled</h1>
        <p className="text-gray-700">
          It looks like the payment process was canceled. You can try again at any time.
        </p>
        <a
          href="/gift-card"
          className="inline-block mt-6 px-6 py-3 bg-red-700 text-gray-50 rounded-md hover:bg-red-800 transition"
        >
          Return Home
        </a>
      </div>
    </div>
  );
}
