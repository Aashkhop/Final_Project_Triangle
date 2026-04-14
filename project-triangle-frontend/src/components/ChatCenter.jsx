import React, { useState } from "react";
import { MessageSquare, X } from "lucide-react";
import { Link } from "react-router-dom";

const ChatCenter = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Floating Chat Button */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-emerald-500 to-teal-500 text-white p-4 rounded-full shadow-lg hover:scale-105 transition-transform z-50"
      >
        <MessageSquare size={22} />
      </button>

      {/* Popup Panel */}
      {open && (
        <div className="fixed bottom-20 right-6 bg-gray-900 border border-gray-700 rounded-2xl w-80 shadow-2xl overflow-hidden z-50 animate-fadeIn">
          <div className="flex justify-between items-center px-4 py-3 border-b border-gray-700">
            <h3 className="text-emerald-400 font-medium text-sm">Chat Center</h3>
            <button onClick={() => setOpen(false)}>
              <X size={18} className="text-gray-400 hover:text-red-400" />
            </button>
          </div>

          <div className="p-4 text-gray-300 text-sm space-y-2 max-h-64 overflow-y-auto">
            <p>No recent messages yet.</p>
            <Link
              to="/messages"
              className="block text-emerald-400 hover:underline text-center mt-3"
              onClick={() => setOpen(false)}
            >
              Go to Messages
            </Link>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatCenter;
