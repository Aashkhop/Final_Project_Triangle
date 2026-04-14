// ✨ 1. IMPORT LINK FROM REACT-ROUTER-DOM
import { Link } from "react-router-dom";
import React from "react";
import { useProjectUpload } from "../context/ProjectUploadContext";
import {
  FaReact,
  FaNodeJs,
  FaUserAlt,
  FaCode,
} from "react-icons/fa";
import {
  SiMysql,
  SiTailwindcss,
  SiExpress,
  SiMongodb,
} from "react-icons/si";
import { Tooltip } from "react-tooltip";

// ✅ Centralized tech icon map with tooltips
const techIcons = {
  react: { icon: <FaReact className="text-sky-400 text-3xl" />, label: "React" },
  mysql: { icon: <SiMysql className="text-yellow-400 text-3xl" />, label: "MySQL" },
  tailwind: { icon: <SiTailwindcss className="text-cyan-400 text-3xl" />, label: "Tailwind CSS" },
  nodejs: { icon: <FaNodeJs className="text-green-400 text-3xl" />, label: "Node.js" },
  express: { icon: <SiExpress className="text-gray-300 text-3xl" />, label: "Express.js" },
  mongodb: { icon: <SiMongodb className="text-green-500 text-3xl" />, label: "MongoDB" },
  mern: { icon: <FaCode className="text-indigo-400 text-3xl" />, label: "MERN Stack" },
};

// ✅ Default placeholder for projects without a cover image
const placeholderImage =
  "https://via.placeholder.com/400x200/1f2937/9ca3af?text=No+Image";

const ExploreProjects = () => {
  const { projects, loading, error } = useProjectUpload();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 py-10 px-6">
      <h2 className="text-4xl font-bold text-center text-teal-400 mb-10">
        Explore Uploaded Projects
      </h2>

      {loading ? (
        <p className="text-center text-gray-400 text-lg">Loading projects...</p>
      ) : error ? (
        <p className="text-center text-red-400 text-lg">
          Failed to load projects: {error}
        </p>
      ) : projects.length === 0 ? (
        <p className="text-center text-gray-400 text-lg">
          No projects uploaded yet.
        </p>
      ) : (
        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {projects.map((project) => {
            let techStack = [];
            let tags = [];

            try {
              techStack = project.tech_stack
                ? JSON.parse(project.tech_stack)
                : [];
            } catch {
              techStack = [];
            }

            try {
              tags = project.tags ? JSON.parse(project.tags) : [];
            } catch {
              tags = [];
            }

            return (
              <div
                key={project.id || project.project_id}
                className="bg-gray-800 border border-teal-600/30 rounded-2xl shadow-md 
                           hover:shadow-teal-600/50 transition duration-300 
                           transform hover:-translate-y-1 flex flex-col overflow-hidden"
              >
                {/* Image Section with placeholder */}
                <div className="relative">
                  <img
                    src={
                      project.cover_image
                        ? `http://localhost:5000/${project.cover_image}` // ✅ Corrected: Added backticks
                        : placeholderImage
                    }
                    alt={project.title}
                    className="w-full h-44 object-cover"
                  />
                  {/* Category Overlay */}
                  {project.category && (
                    <span className="absolute top-2 right-2 bg-teal-600 text-white text-xs px-3 py-1 rounded-full shadow">
                      {project.category}
                    </span>
                  )}
                  {/* Seller Info Overlay */}
                  <div className="absolute bottom-2 left-2 bg-gray-900/80 text-white px-3 py-1 rounded-full text-sm flex items-center gap-2 shadow">
                    <div className="w-7 h-7 rounded-full bg-gray-700 flex items-center justify-center text-sm font-bold overflow-hidden">
                      {project.seller ? (
                        project.seller[0].toUpperCase()
                      ) : (
                        <FaUserAlt className="text-gray-400 text-xs" />
                      )}
                    </div>
                    <span className="text-xs sm:text-sm">
                      {project.seller || "Unknown"}
                    </span>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-5 flex flex-col flex-grow gap-y-4">
                  {/* Title */}
                  <h3 className="text-lg font-semibold text-white line-clamp-2 leading-tight">
                    {project.title}
                  </h3>

                  {/* Tags */}
                  {tags.length > 0 && (
                    <div className="flex gap-2 flex-wrap">
                      {tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="bg-teal-600/30 text-teal-300 text-xs px-3 py-1 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Tech Stack with tooltips + fallback */}
                  {techStack.length > 0 && (
                    <div className="flex items-center gap-4 flex-wrap">
                      {techStack.map((tech, idx) => {
                        const techKey = tech.toLowerCase();
                        const techItem = techIcons[techKey];
                        const tooltipId = `tooltip-${project.id || project.project_id}-${idx}`; // Ensure unique ID

                        return (
                          <span
                            key={idx}
                            data-tooltip-id={tooltipId} // ✅ Corrected: Used variable
                            className="cursor-pointer"
                          >
                            {techItem ? techItem.icon : (
                              <FaCode className="text-gray-400 text-2xl" />
                            )}
                            <Tooltip
                              id={tooltipId} // ✅ Corrected: Used variable
                              place="top"
                              style={{ fontSize: "12px", padding: "4px 6px" }}
                            >
                              {techItem ? techItem.label : tech}
                            </Tooltip>
                          </span>
                        );
                      })}
                    </div>
                  )}

                  {/* Footer */}
                  <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-700">
                    <span className="text-lg font-bold text-teal-400">
                      ₹{project.price}
                    </span>
                    <div className="flex gap-3 items-center">
                      {/* Buy Now Button */}
                      <Link
                        to={`/buy/${project.id}`}
                        state={{ project: project }}
                        className="bg-teal-500 hover:bg-teal-600 text-white font-medium py-2 px-4 rounded-lg transition"
                      >
                        Buy Now
                      </Link>

                      {/* View Details Button */}
                      <Link
                        to={`/projects/${project.id}`}
                        className="border border-teal-400 text-teal-400 hover:bg-teal-600/20 font-medium py-2 px-4 rounded-lg text-sm transition"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ExploreProjects;