import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Safety() {
  const navigate = useNavigate();
  const [liveShare, setLiveShare] = useState(true);

  const triggerSOS = () => {
    alert("🚨 SOS Alert Sent to Emergency Contacts");
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="flex items-center gap-3 p-4 bg-white">
        <ArrowLeft onClick={() => navigate(-1)} />
        <h1 className="text-3xl font-bold">Safety Toolkit</h1>
      </div>

      <div className="p-4 space-y-4">
        {/* Trusted contacts */}
        <div className="bg-white p-5 rounded-xl shadow-sm">
          <h2 className="text-lg font-semibold">Trusted Contacts</h2>
          <p className="text-slate-500">Family will receive alerts</p>
        </div>

        {/* Live location */}
        <div className="bg-white p-5 rounded-xl flex justify-between">
          <span className="text-lg">Live Location Sharing</span>
          <input
            type="checkbox"
            checked={liveShare}
            onChange={() => setLiveShare(!liveShare)}
          />
        </div>

        {/* SOS */}
        <button
          onClick={triggerSOS}
          className="w-full bg-red-500 text-white p-5 rounded-xl text-xl font-bold"
        >
          🚨 Send SOS
        </button>
      </div>
    </div>
  );
}
