import { ArrowLeft, Phone, MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Help() {
  const navigate = useNavigate();

  const callSupport = () => {
    window.location.href = "tel:1800123456";
  };

  const openWhatsApp = () => {
    window.open("https://wa.me/919000000000");
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="flex items-center gap-3 p-4 border-b">
        <ArrowLeft onClick={() => navigate(-1)} />
        <h1 className="text-3xl font-bold">Help Center</h1>
      </div>

      <div className="p-4 space-y-4">
        <button onClick={callSupport} className="w-full bg-green-100 p-4 rounded-xl flex items-center gap-3">
          <Phone /> Call Support
        </button>

        <button onClick={openWhatsApp} className="w-full bg-emerald-100 p-4 rounded-xl flex items-center gap-3">
          <MessageCircle /> WhatsApp Help
        </button>
      </div>
    </div>
  );
}

