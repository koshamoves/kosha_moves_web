"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function SuccessPage() {
  const [session, setSession] = useState<any>(null);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const sessionId = new URLSearchParams(window.location.search).get(
      "session_id"
    );

    if (!sessionId) {
      setError("No session ID found");
      return;
    }

    fetch(`/api/confirm?session_id=${sessionId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
        } else {
          setSession(data.session);
        }
      })
      .catch((err) => {
        setError("Error fetching session");
        console.error(err);
      });
  }, []);

  if (error) return <div className="text-red-500 p-4">Error: {error}</div>;
  if (!session) return <div className="p-4">Loading session...</div>;

  const recipientName = session.metadata?.recipientName || "Friend";
  const senderName =
    session.metadata?.forSelf === "true" ? recipientName : "Gift Sender";
  const messageMeta = session?.metadata?.message || "";
  const amount = (session.amount_total / 100).toFixed(2);

  return (
    <div className="max-w-md mx-auto mt-12 p-6 bg-white rounded-2xl shadow-lg border border-gray-200">
      <h1 className="text-2xl font-bold mb-4 text-center text-[#26446D] ">
        🎉 Gift Card Delivered!
      </h1>

      <p className="mb-4 text-gray-800">
        Hi <span className="font-semibold">{recipientName}</span>,
      </p>

      <p className="mb-4 text-gray-800">
        You just got a gift card from{" "}
        <span className="font-semibold">{senderName}</span>!
      </p>

      <div className="bg-gray-100 p-4 rounded-md mb-4">
        <p className="mb-2">
          <span className="font-medium text-gray-700">Message:</span>
          <br />
          <span className="text-base font-mono bg-white px-2 py-1 inline-block rounded mt-1">
            {messageMeta}
          </span>
        </p>

        <p className="mb-2">
          <span className="font-medium text-gray-700">Gift card amount:</span>
          <br />
          <span className="text-lg font-semibold">${amount}</span>
        </p>

        <p>
          <span className="font-medium text-gray-700">
            Gift card expiry date:
          </span>
          <br />
          <span className="text-gray-600">Never expires</span>
        </p>
      </div>

      <p className="text-gray-700 text-sm">Thank you,</p>
      <p className="text-gray-900 font-semibold mb-6">Kosha Moves</p>

      <button
        onClick={() => router.push("/gift-card")}
        className="w-full bg-[#26446D] text-gray-50 hover:bg-green-700 py-2 rounded-lg transition"
      >
        Go Back to Gift Card Page
      </button>
    </div>
  );
}
