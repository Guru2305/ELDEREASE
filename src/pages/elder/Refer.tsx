import { ArrowLeft, Copy } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Refer() {
  const navigate = useNavigate();
  const code = "ELDER50";

  const copyCode = () => {
    navigator.clipboard.writeText(code);
    alert("Referral code copied!");
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="flex items-center gap-3 p-4 border-b">
        <ArrowLeft onClick={() => navigate(-1)} />
        <h1 className="text-3xl font-bold">Refer Friends</h1>
      </div>

      <div className="p-6">
        <div className="bg-blue-600 text-white rounded-2xl p-6">
          <h2 className="text-xl">Earn ₹50 per friend</h2>

          <button
            onClick={copyCode}
            className="mt-4 bg-white text-blue-600 px-6 py-3 rounded-xl flex gap-2"
          >
            <Copy /> {code}
          </button>
        </div>
      </div>
    </div>
  );
}
