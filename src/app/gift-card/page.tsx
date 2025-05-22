"use client";

import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import Image from "next/image";

const giftAmounts = [25, 50, 100, 150, 200];

const Page = () => {
  const [amount, setAmount] = useState(25);
  const [quantity, setQuantity] = useState(1);
  const [forSelf, setForSelf] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true); 

    const payload = {
      amount,
      quantity,
      forSelf,
      email: forSelf ? null : email,
      name: forSelf ? null : name,
      date,
      message,
    };

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        console.error("Checkout failed:", data);
        setLoading(false); 
      }
    } catch (error) {
      console.error("Error creating checkout session", error);
      setLoading(false); 
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-6">
      {/* Image */}
      <div className="md:w-6/12 flex items-start overflow-hidden">
        <div className="transition-transform duration-300 hover:scale-105">
          <Image
            src="/images/gift-card.jpg"
            alt="Gift Card"
            width={700}
            height={300}
            className="rounded-md object-cover h-auto shadow-md"
          />
        </div>
      </div>

      {/* Form */}
      <form className="md:w-6/12 space-y-6" onSubmit={handleSubmit}>
        <div>
          <h1 className="text-3xl font-semibold text-gray-900 my-6">
            eGift Card
          </h1>
          <p className="text-gray-600 mt-2 leading-relaxed">
            You can&apos;t go wrong with a gift card. Choose an amount and write a
            personalized message to make this gift your own.
          </p>
        </div>

        {/* Amount */}
        <div className="space-y-2 my-6">
          <label className="font-medium text-gray-700">Amount</label>
          <div className="flex flex-wrap gap-2">
            {giftAmounts.map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setAmount(value)}
                className={`px-4 py-2 rounded-md border transition-colors font-semibold ${
                  amount === value
                    ? "bg-[#26446D] text-gray-50 border-[#112541]"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                }`}
              >
                ${value}
              </button>
            ))}
          </div>
        </div>

        {/* Quantity */}
        <div className="space-y-2 my-6">
          <label className="font-medium text-gray-700">Quantity</label>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-8 h-8 flex items-center justify-center rounded-md border border-gray-300 hover:bg-gray-100 text-gray-700"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="px-4 text-lg font-medium">{quantity}</span>
            <button
              type="button"
              onClick={() => setQuantity(quantity + 1)}
              className="w-8 h-8 flex items-center justify-center rounded-md border border-gray-300 hover:bg-gray-100 text-gray-700"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Recipient Toggle */}
        <div className="space-y-4 my-4">
          <label className="font-medium text-gray-700">
            Who is the gift card for?
          </label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setForSelf(false)}
              className={`flex-1 py-2 rounded-md text-center font-medium cursor-pointer border transition-colors ${
                !forSelf
                  ? "bg-[#26446D] text-gray-50 border-[#112541]"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
              }`}
            >
              For someone else
            </button>
            <button
              type="button"
              onClick={() => setForSelf(true)}
              className={`flex-1 py-2 rounded-md text-center font-medium cursor-pointer border transition-colors ${
                forSelf
                  ? "bg-[#26446D] text-gray-50 border-[#112541]"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
              }`}
            >
              For myself
            </button>
          </div>
        </div>

        {/* Inputs */}
        {!forSelf && (
          <div className="flex flex-col gap-4 my-6">
            <input
              type="email"
              placeholder="Recipient email *"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-md border border-gray-300 px-3 py-2"
            />
            <input
              type="text"
              placeholder="Recipient name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2"
            />
          </div>
        )}

        {/* Date */}
        <div className="space-y-1 my-6">
          <label className="font-medium text-gray-700">Delivery date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2"
          />
        </div>

        {/* Message */}
        <div className="my-6">
          <textarea
            placeholder="Message"
            rows={3}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full rounded-md border border-gray-800 px-3 py-2 resize-none"
          />
        </div>

        {/* Submit Button */}
        <div className="w-full flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className={`flex-1 border font-semibold py-3 rounded-md transition ${
              loading
                ? "bg-gray-400 border-gray-300 text-white cursor-not-allowed"
                : "bg-[#26446D] border-[#112541] text-gray-50 hover:bg-[#1f3a59]"
            }`}
          >
            {loading ? "Redirecting to Stripe..." : "Buy Now"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Page;
