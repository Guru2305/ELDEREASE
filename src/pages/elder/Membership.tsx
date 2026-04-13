import { useState } from "react";
import { ArrowLeft, Crown } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Membership() {
  const navigate = useNavigate();
  const [plan, setPlan] = useState("Free");

  const upgradePlan = () => {
    setPlan("Premium");
    alert("🎉 Membership upgraded to Premium");
  };

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 bg-white border-b">
        <ArrowLeft
          className="cursor-pointer"
          onClick={() => navigate(-1)}
        />
        <h1 className="text-3xl font-bold">Membership</h1>
      </div>

      <div className="p-4 max-w-3xl mx-auto space-y-4">
        {/* Current Plan */}
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <Crown className="text-yellow-500" />
            <h2 className="text-xl font-semibold">
              Current Plan: {plan}
            </h2>
          </div>

          <p className="text-slate-500 mt-2">
            Enjoy faster service and priority support.
          </p>
        </div>

        {/* Premium Card */}
        <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white rounded-2xl p-6">
          <h2 className="text-2xl font-bold">Premium Plan</h2>
          <ul className="mt-3 space-y-1 text-sm">
            <li>✅ Priority volunteer support</li>
            <li>✅ Faster service booking</li>
            <li>✅ Emergency priority</li>
          </ul>

          {plan !== "Premium" && (
            <button
              onClick={upgradePlan}
              className="mt-5 w-full bg-white text-orange-600 py-3 rounded-xl font-bold"
            >
              Upgrade Now
            </button>
          )}
        </div>
      </div>
    </div>
  );
}