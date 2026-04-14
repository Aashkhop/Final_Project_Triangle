// src/pages/ProfilePage.js
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { useUser } from "../context/UserContext";

const ProfilePage = () => {
  const { id } = useParams(); // Get the user ID from the URL
  const { user: currentUser } = useUser(); // Get the currently logged-in user
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`/api/profiles/${id}`);
        setProfile(res.data);
        setError("");
      } catch (err) {
        setError(err.response?.data?.error || "Failed to fetch profile.");
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [id]); // Re-run this effect if the ID in the URL changes

  if (loading) {
    return <div className="text-center mt-20 text-white">Loading profile...</div>;
  }

  if (error) {
    return <div className="text-center mt-20 text-red-400">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-[#0a192f] text-gray-200 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto bg-gray-900/80 rounded-2xl shadow-lg border border-emerald-500/20 p-8">
        <div className="flex flex-col sm:flex-row items-center gap-8">
          {/* Avatar */}
          <img
            src={profile.avatar_url || `https://api.dicebear.com/8.x/initials/svg?seed=${profile.name}`}
            alt={`${profile.name}'s avatar`}
            className="w-32 h-32 rounded-full border-4 border-emerald-400 object-cover"
          />
          {/* Profile Header */}
          <div className="text-center sm:text-left">
            <h1 className="text-4xl font-bold text-white">{profile.name}</h1>
            <p className="text-lg text-emerald-400 capitalize">{profile.role}</p>
            {/* Show Edit Profile button ONLY if this is the logged-in user's profile */}
            {currentUser && currentUser.id === profile.id && (
              <Link
                to="/profile/edit"
                className="mt-4 inline-block bg-emerald-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-emerald-600 transition"
              >
                Edit Profile
              </Link>
            )}
          </div>
        </div>

        {/* Profile Details Section */}
        <div className="mt-10 border-t border-gray-700 pt-6 space-y-6">
          <div>
            <h3 className="text-xl font-semibold text-emerald-400 mb-2">About Me</h3>
            <p className="text-gray-300 whitespace-pre-wrap">{profile.bio || "No biography provided."}</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-emerald-400 mb-2">Skills</h3>
            <div className="flex flex-wrap gap-2">
              {profile.skills ? (
                profile.skills.split(",").map((skill) => (
                  <span key={skill.trim()} className="bg-gray-700 text-emerald-300 px-3 py-1 rounded-full text-sm">
                    {skill.trim()}
                  </span>
                ))
              ) : (
                <p className="text-gray-400">No skills listed.</p>
              )}
            </div>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-emerald-400 mb-2">Contact & Links</h3>
            <ul className="text-gray-300">
              {profile.website_url && (
                <li>
                  <strong>Website:</strong>{" "}
                  <a href={profile.website_url} target="_blank" rel="noopener noreferrer" className="text-teal-300 hover:underline">
                    {profile.website_url}
                  </a>
                </li>
              )}
               {profile.location && (
                <li>
                  <strong>Location:</strong> {profile.location}
                </li>
              )}
               <li>
                  <strong>Member Since:</strong> {new Date(profile.created_at).toLocaleDateString()}
                </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;