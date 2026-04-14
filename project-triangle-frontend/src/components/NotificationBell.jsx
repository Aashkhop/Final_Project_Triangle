import React, { useEffect, useState, useRef, useCallback } from "react";
import { Bell, Check } from "lucide-react";
import axios from "axios";
import { Link } from "react-router-dom";

// Helper to format time since the notification was created
const timeSince = (date) => {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + "y ago";
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + "mo ago";
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + "d ago";
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + "h ago";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + "m ago";
  return Math.floor(seconds) + "s ago";
};

const NotificationBell = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef(null);

  // Fetch notifications from the backend
  const fetchNotifications = useCallback(async () => {
    try {
      // The backend now identifies the user via token, not a URL param
      const res = await axios.get("/api/notifications");
      setNotifications(res.data.notifications);
      setUnreadCount(res.data.unreadCount);
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    }
  }, []);

  // Initial fetch and polling setup
  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 20000); // Poll every 20 seconds
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Handle marking all notifications as read
  const handleMarkAsRead = async () => {
    try {
      await axios.post("/api/notifications/mark-as-read");
      // Optimistically update the UI for instant feedback
      setUnreadCount(0);
      setNotifications(
        notifications.map((n) => ({ ...n, is_read: true }))
      );
    } catch (err) {
      console.error("Failed to mark notifications as read:", err);
    }
  };

 const handleNotificationClick = async (notification) => {
    // Close the dropdown immediately
    setIsOpen(false);

    // If it's already read, do nothing extra
    if (notification.is_read) return;

    // Optimistically update the UI for instant feedback
    setNotifications(currentNotifications =>
      currentNotifications.map(n =>
        n.id === notification.id ? { ...n, is_read: true } : n
      )
    );
    setUnreadCount(currentCount => Math.max(0, currentCount - 1));

    // Make the API call in the background
    try {
      await axios.put(`/api/notifications/${notification.id}/read`);
    } catch (err) {
      console.error("Failed to mark notification as read:", err);
      // Optional: Revert optimistic update on error
      fetchNotifications(); 
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-full hover:bg-emerald-500/10 transition"
      >
        <Bell className="w-5 h-5 text-gray-300 hover:text-emerald-400" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 bg-red-500 text-xs text-white font-bold rounded-full w-4 h-4 flex items-center justify-center animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      <div
        className={`absolute right-0 mt-3 w-80 bg-gray-900 border border-gray-700 rounded-xl shadow-lg transform transition-all duration-200 ease-out origin-top z-50 ${
          isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0 pointer-events-none"
        }`}
      >
        <div className="p-3 flex justify-between items-center border-b border-gray-700">
          <p className="text-sm text-gray-200 font-semibold">Notifications</p>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAsRead}
              className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1"
            >
              <Check size={14} /> Mark all as read
            </button>
          )}
        </div>

        <div className="max-h-80 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="text-gray-500 text-center py-10 text-sm">
              You have no notifications.
            </div>
          ) : (
            notifications.map((n) => (
              <Link
                key={n.id}
                to={n.link || "#"}
                // --- ✨ UPDATED onClick and className ---
                onClick={() => handleNotificationClick(n)}
                className={`flex items-start gap-3 p-3 text-sm hover:bg-emerald-500/10 border-b border-gray-800 last:border-none transition-colors ${
                  !n.is_read ? 'bg-emerald-900/20' : ''
                }`}
              >
                <div className="flex-shrink-0 mt-1.5">
                  {!n.is_read && (
                    <span className="block w-2 h-2 bg-emerald-400 rounded-full"></span>
                  )}
                </div>
                <div className="flex-grow">
                  <p className={!n.is_read ? 'text-gray-200' : 'text-gray-400'}>{n.message}</p>
                  <p className="text-gray-500 text-xs mt-1">
                    {timeSince(n.created_at)}
                  </p>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationBell;