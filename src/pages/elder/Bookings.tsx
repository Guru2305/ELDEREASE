import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Booking {
  id: number;
  service: string;
  date: string;
  status: "Completed" | "Pending" | "Cancelled";
}

export default function Bookings() {
  const navigate = useNavigate();

  // 🔹 Demo booking data (later connect API)
  const [bookings, setBookings] = useState<Booking[]>([
    {
      id: 1,
      service: "Medicine Delivery",
      date: "20 Feb 2026",
      status: "Completed",
    },
    {
      id: 2,
      service: "House Help",
      date: "18 Feb 2026",
      status: "Pending",
    },
  ]);

  const cancelBooking = (id: number) => {
    setBookings((prev) =>
      prev.map((b) =>
        b.id === id ? { ...b, status: "Cancelled" } : b
      )
    );
  };

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 bg-white border-b">
        <ArrowLeft
          className="cursor-pointer"
          onClick={() => navigate(-1)}
        />
        <h1 className="text-3xl font-bold">My Bookings</h1>
      </div>

      <div className="p-4 max-w-3xl mx-auto">
        {bookings.length === 0 ? (
          <div className="text-center text-slate-500 mt-20">
            No bookings yet
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className="bg-white rounded-2xl p-5 shadow-sm"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-semibold">
                      {booking.service}
                    </h2>
                    <p className="text-slate-500">
                      {booking.date}
                    </p>
                  </div>

                  {/* STATUS BADGE */}
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium
                      ${
                        booking.status === "Completed"
                          ? "bg-green-100 text-green-700"
                          : booking.status === "Pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }`}
                  >
                    {booking.status}
                  </span>
                </div>

                {/* Cancel button */}
                {booking.status === "Pending" && (
                  <button
                    onClick={() => cancelBooking(booking.id)}
                    className="mt-4 w-full bg-red-500 text-white py-2 rounded-xl"
                  >
                    Cancel Booking
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}