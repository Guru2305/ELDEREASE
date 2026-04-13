import { useState } from "react";

interface Notification {
  id: number;
  message: string;
  type?: 'medicine' | 'booking' | 'emergency' | 'general';
}

interface NotificationBellProps {
  notifications: Notification[];
}

export default function NotificationBell({ notifications }: NotificationBellProps) {
  const [open, setOpen] = useState(false);

  const getNotificationIcon = (type?: string) => {
    switch(type) {
      case 'medicine': return '💊';
      case 'booking': return '📅';
      case 'emergency': return '🚨';
      default: return '📢';
    }
  };

  return (
    <div className="fixed bottom-8 right-8">
      <button
        onClick={() => setOpen(!open)}
        className="relative w-14 h-14 bg-white rounded-full shadow-lg flex items-center justify-center text-lg"
      >
        🔔
        {notifications.length > 0 && (
          <span className="absolute top-1 right-1 bg-red-600 text-white text-xs px-2 py-1 rounded-full">
            {notifications.length}
          </span>
        )}
      </button>

      {open && (
        <div className="mt-3 bg-white w-64 p-4 rounded-xl shadow-xl">
          <h3 className="font-bold mb-2">Notifications</h3>

          {notifications.length === 0 ? (
            <p>No new notifications</p>
          ) : (
            notifications.map((note) => (
              <div key={note.id} className="p-2 border-b flex items-start gap-2">
                <span className="text-lg">{getNotificationIcon(note.type)}</span>
                <div className="flex-1">
                  <p className="text-sm">{note.message}</p>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
