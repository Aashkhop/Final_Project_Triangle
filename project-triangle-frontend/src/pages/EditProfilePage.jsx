// src/pages/EditProfilePage.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

const EditProfilePage = () => {
  const navigate = useNavigate();
  const { user, login } = useUser(); // Get login function from context
  const [formData, setFormData] = useState({
    bio: "",
    skills: "",
    website_url: "",
    location: "",
  });

  const [avatarFile, setAvatarFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    const fetchMyProfile = async () => {
      try {
        const res = await axios.get("/api/profiles/me");
        setFormData({
          bio: res.data.bio || "",
          skills: res.data.skills || "",
          website_url: res.data.website_url || "",
          location: res.data.location || "",
        });
        setPreview(res.data.avatar_url);
      } catch (err) {
        setMessage({ type: "error", text: "Could not load your profile data." });
      } finally {
        setLoading(false);
      }
    };
    if (user) {
      fetchMyProfile();
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  // ✨ MODIFIED SUBMIT FUNCTION ✨
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      // First, update the text data
      await axios.put("/api/profiles/me", formData);

      // Second, if a new avatar file was selected, upload it
      if (avatarFile) {
        const fileData = new FormData();
        fileData.append("avatar", avatarFile);
        
        const res = await axios.put("/api/profiles/avatar", fileData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        
        // Use the login function to update the global user state with the new user object from the backend
        login(res.data.user); 
      }

      setMessage({ type: "success", text: "Profile updated successfully!" });
      setTimeout(() => navigate(`/profile/${user.id}`), 1000);

    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.error || "Failed to update profile.",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
     return <div className="text-center mt-20 text-white">Loading editor...</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a192f] p-4">
      <div className="w-full max-w-2xl bg-gray-900/80 p-8 rounded-2xl shadow-lg border border-emerald-500/20">
        <h2 className="text-3xl font-bold text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
          Edit Your Profile
        </h2>

        {message.text && (
          <div className={`mb-4 p-3 rounded-lg text-center ${message.type === "success" ? "bg-emerald-500" : "bg-red-500"} text-white`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="avatar" className="block mb-2 text-sm font-medium text-emerald-300">
              Profile Picture
            </label>
            <div className="flex items-center gap-4">
              <img
                src={preview || `https://api.dicebear.com/8.x/initials/svg?seed=${user.name}`}
                alt="Avatar Preview"
                className="w-16 h-16 rounded-full object-cover border-2 border-gray-600"
              />
              <input
                type="file"
                id="avatar"
                name="avatar"
                accept="image/*"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
              />
            </div>
          </div>

          <div>
            <label htmlFor="bio" className="block mb-2 text-sm font-medium text-emerald-300">About Me</label>
            <textarea
              id="bio" name="bio" rows="4" value={formData.bio}
              onChange={handleChange} placeholder="Tell everyone a little about yourself..."
              className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-600 focus:ring-emerald-500 focus:border-emerald-500"
            ></textarea>
          </div>
          
          <div>
            <label htmlFor="skills" className="block mb-2 text-sm font-medium text-emerald-300">Skills (comma separated)</label>
            <input
              type="text" id="skills" name="skills" value={formData.skills}
              onChange={handleChange} placeholder="e.g., React, Node.js, Project Management"
              className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-600 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
          
          <div>
            <label htmlFor="website_url" className="block mb-2 text-sm font-medium text-emerald-300">Website URL</label>
            <input
              type="url" id="website_url" name="website_url" value={formData.website_url}
              onChange={handleChange} placeholder="https://your-portfolio.com"
              className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-600 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
          
          <div>
            <label htmlFor="location" className="block mb-2 text-sm font-medium text-emerald-300">Location</label>
            <input
              type="text" id="location" name="location" value={formData.location}
              onChange={handleChange} placeholder="e.g., San Francisco, CA"
              className="w-full p-3 rounded-lg bg-gray-800 text-white border border-gray-600 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-white font-semibold shadow-lg hover:scale-[1.02] transition-transform duration-200 disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProfilePage;