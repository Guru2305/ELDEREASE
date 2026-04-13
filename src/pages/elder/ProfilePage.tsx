import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  HelpCircle,
  CreditCard,
  Clock,
  ShieldCheck,
  Gift,
  Star,
  Ticket,
  ChevronLeft,
  ChevronRight,
  HeartPulse,
  PhoneCall,
} from "lucide-react";

export default function ProfilePage() {
  const navigate = useNavigate();

  // MENU
  const menuItems = [
    { icon: <User className="w-6 h-6" />, label: "Family Support", to: "/elder/family-support" },
    { icon: <HelpCircle className="w-6 h-6" />, label: "Help Center", to: "/elder/help" },
    { icon: <CreditCard className="w-6 h-6" />, label: "Payments", to: "/elder/payment" },
    { icon: <Clock className="w-6 h-6" />, label: "My Bookings", to: "/elder/bookings" },
    { icon: <ShieldCheck className="w-6 h-6" />, label: "Safety Toolkit", to: "/elder/safety" },
    { icon: <Gift className="w-6 h-6" />, label: "Refer & Earn", to: "/elder/refer" },
    { icon: <Star className="w-6 h-6" />, label: "My Rewards", to: "/elder/rewards" },
    { icon: <Ticket className="w-6 h-6" />, label: "Membership", to: "/elder/membership" },
  ];

  // USER STATE
  const [user, setUser] = useState({
    name: "Prakash Raj",
    phone: "7904259488",
    bloodGroup: "O+",
    familyContact: "9876543210",
  });

  // EDIT STATES
  const [isEditing, setIsEditing] = useState(false);
  const [tempUser, setTempUser] = useState(user);
  const [savedMsg, setSavedMsg] = useState(false);

  const onMenuClick = (path: string) => navigate(path);

  const handleSave = () => {
    setUser(tempUser);
    setIsEditing(false);
    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 2000);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-slate-100 p-4">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            aria-label="Back"
            className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <h1 className="text-3xl font-bold">Profile</h1>
        </div>

        <button
          onClick={() => {
            setTempUser(user);
            setIsEditing(true);
          }}
          className="bg-emerald-600 text-white px-4 py-2 rounded-xl font-medium hover:bg-emerald-700"
        >
          Edit Profile
        </button>
      </div>

      {/* SUCCESS MESSAGE */}
      {savedMsg && (
        <div className="mb-3 text-center text-emerald-600 font-medium">
          ✅ Profile updated successfully
        </div>
      )}

      {/* PROFILE CARD */}
      <div className="bg-white rounded-2xl p-5 mb-4 shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-14 h-14 rounded-full bg-[#e6f0ff] flex items-center justify-center mr-4">
              <User className="w-7 h-7 text-[#2c5282]" />
            </div>

            <div>
              <div className="text-xl font-semibold">{user.name}</div>
              <div className="text-sm text-slate-600">{user.phone}</div>
            </div>
          </div>

         
        </div>

        {/* MEDICAL INFO */}
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="bg-red-50 rounded-xl p-3 flex items-center gap-2">
            <HeartPulse className="w-5 h-5 text-red-500" />
            <div className="text-sm">
              <div className="text-slate-500">Blood Group</div>
              <div className="font-semibold">{user.bloodGroup}</div>
            </div>
          </div>

          <div className="bg-blue-50 rounded-xl p-3 flex items-center gap-2">
            <PhoneCall className="w-5 h-5 text-blue-500" />
            <div className="text-sm">
              <div className="text-slate-500">Family Contact</div>
              <div className="font-semibold">{user.familyContact}</div>
            </div>
          </div>
        </div>
      </div>

      {/* MENU LIST */}
      <div className="bg-white rounded-2xl shadow-sm divide-y">
        {menuItems.map((item, idx) => (
          <button
            key={idx}
            onClick={() => onMenuClick(item.to)}
            className="w-full flex items-center justify-between px-5 py-5 hover:bg-slate-50 active:bg-slate-100"
            type="button"
          >
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 bg-slate-100 rounded-xl flex items-center justify-center">
                {item.icon}
              </div>
              <span className="text-lg font-medium">{item.label}</span>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-400" />
          </button>
        ))}
      </div>

      {/* EDIT MODAL */}
      {isEditing && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6">

            <h2 className="text-2xl font-bold mb-4">Edit Profile</h2>

            <div className="space-y-4">
              <div className="space-y-4">
                <input
                  className="w-full p-4 rounded-xl border"
                  placeholder="Enter your full name"
                  value={tempUser.name}
                  onChange={(e) =>
                    setTempUser({ ...tempUser, name: e.target.value })
                  }
                />

                <input
                  className="w-full p-4 rounded-xl border"
                  placeholder="Enter your phone number"
                  value={tempUser.phone}
                  onChange={(e) =>
                    setTempUser({ ...tempUser, phone: e.target.value })
                  }
                />

                <input
                  className="w-full p-4 rounded-xl border"
                  placeholder="Enter your blood group"
                  value={tempUser.bloodGroup}
                  onChange={(e) =>
                    setTempUser({ ...tempUser, bloodGroup: e.target.value })
                  }
                />

                <input
                  className="w-full p-4 rounded-xl border"
                  placeholder="Enter family contact number"
                  value={tempUser.familyContact}
                  onChange={(e) =>
                    setTempUser({
                      ...tempUser,
                      familyContact: e.target.value,
                    })
                  }
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleCancel}
                  className="flex-1 bg-gray-200 py-3 rounded-xl font-semibold"
                >
                  Cancel
                </button>

                <button
                  onClick={handleSave}
                  className="flex-1 bg-emerald-600 text-white py-3 rounded-xl font-semibold"
                >
                  Save
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}