import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Rewards() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="flex items-center gap-3 p-4 bg-white">
        <ArrowLeft onClick={() => navigate(-1)} />
        <h1 className="text-3xl font-bold">My Rewards</h1>
      </div>

      <div className="p-4 grid grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl h-40 shadow-sm"></div>
        <div className="bg-white rounded-2xl h-40 shadow-sm"></div>
        <div className="bg-white rounded-2xl h-40 shadow-sm"></div>
      </div>
    </div>
  );
}
