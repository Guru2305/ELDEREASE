import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Users, Phone, Plus, ChevronLeft } from "lucide-react";

export default function FamilySupport() {
  const navigate = useNavigate();

  const [family] = useState([
    { name: "reenish Kumar", relation: "Son", phone: "9876543211" },
    { name: "Lakshmi", relation: "Daughter", phone: "9876543212" },
  ]);

  return (
    <div className="min-h-screen bg-slate-100 p-4">

      <div className="flex items-center gap-3 mb-4">
        <button
          onClick={() => navigate(-1)}
          aria-label="Back"
          className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h1 className="text-3xl font-bold">Family Support</h1>
      </div>

      <div className="bg-white rounded-2xl shadow-md">

        {family.map((member, index) => (
          <div
            key={index}
            className="flex items-center justify-between px-5 py-4 border-b"
          >
            <div className="flex items-center gap-3">
              <Users className="w-6 h-6 text-blue-500" />

              <div>
                <div className="font-semibold">{member.name}</div>
                <div className="text-sm text-gray-500">
                  {member.relation}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Phone className="w-5 h-5 text-green-500" />
              <span>{member.phone}</span>
            </div>
          </div>
        ))}

      </div>

      <button className="mt-4 w-full bg-emerald-600 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2">
        <Plus className="w-5 h-5" />
        Add Family Member
      </button>

    </div>
  );
}