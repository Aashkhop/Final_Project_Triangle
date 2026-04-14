// client/src/pages/FreelancerPage.jsx

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaMoneyBillWave, FaCode, FaTag, FaCalendarAlt, FaPaperclip } from 'react-icons/fa'; // Optional: For better UI

const FreelancerPage = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/projects");
        const data = await res.json();
        setProjects(data);
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Helper to format the budget
  const formatBudget = (budget) => {
    if (isNaN(budget)) return budget;
    return `₹${Number(budget).toLocaleString('en-IN')}`;
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 py-10 px-6 flex flex-col items-center">
      <h1 className="text-4xl font-bold text-center text-teal-400 mb-2">
        🚀 Available Projects
      </h1>
      <p className="text-center text-gray-400 text-lg mb-10">
        Browse and send proposals to clients who need your skills.
      </p>

      {loading ? (
        <p className="text-center text-gray-400 text-lg">Loading projects...</p>
      ) : projects.length === 0 ? (
        <p className="text-center text-gray-400 text-lg italic mt-8">
          No projects available at the moment.
        </p>
      ) : (
        <div className="w-full max-w-7xl grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {projects.map((project) => (
            <div
              key={project.id}
              className="bg-gray-800 border border-teal-600/30 rounded-2xl shadow-md 
                         hover:shadow-teal-600/50 transition duration-300 
                         transform hover:-translate-y-1 flex flex-col p-6 text-white"
            >
              {/* Card Header */}
              <h2 className="text-lg font-semibold text-white mb-2 line-clamp-2">
                {project.title}
              </h2>
              <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                {project.description}
              </p>

              {/* Card Body with Details */}
              <div className="space-y-3 text-sm mb-4">
                <div className="flex items-center gap-2">
                  <FaMoneyBillWave className="text-teal-400" />
                  <span className="font-bold text-teal-400">
                    {formatBudget(project.budget)}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <FaCode className="text-sky-400" />
                  <strong>Tech Need:</strong>
                  <span className="text-gray-300">{project.skills}</span>
                </div>
                 <div className="flex items-center gap-2">
                  <FaTag className="text-yellow-400" />
                  <strong>Category:</strong>
                  <span className="text-gray-300">{project.category}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaCalendarAlt className="text-rose-400" />
                  <strong>Deadline:</strong>
                  <span className="text-gray-300">{new Date(project.deadline).toLocaleDateString()}</span>
                </div>
                {project.fileUrl && (
                  <a
                    href={`http://localhost:5000${project.fileUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-teal-400 hover:text-teal-300 underline transition-colors"
                  >
                    <FaPaperclip /> View Attachment
                  </a>
                )}
              </div>
              
              {/* Card Footer */}
              <div className="mt-auto pt-4">
                <Link to={`/proposal/${project.id}`} className="w-full block">
                  <button className="w-full bg-teal-500 hover:bg-teal-600 text-white font-semibold py-2 px-4 rounded-lg transition">
                    Send Proposal
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FreelancerPage;