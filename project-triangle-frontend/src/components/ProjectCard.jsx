import React from "react";
import { ArrowRightIcon, StarIcon } from "@heroicons/react/24/solid";

const ProjectCard = ({ title, description, price, rating, image, techStack }) => {
  // Format price as INR with commas
  const formattedPrice = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);

  // Ensure rating is max 1 decimal place (e.g., 4.8 instead of 4.83333)
  const formattedRating = `${parseFloat(rating).toFixed(1)} / 5`;

  return (
    <div
      className="bg-[#0f223a] border border-emerald-500/20 rounded-2xl shadow-md 
      hover:shadow-[0_0_18px_rgba(16,185,129,0.25)] hover:scale-[1.01]
      transition duration-300 overflow-hidden flex flex-col"
    >
      {/* Thumbnail */}
      <div className="overflow-hidden rounded-t-2xl">
        <img
          src={image}
          alt={title}
          className="h-40 w-full object-cover transform transition-transform duration-500 hover:scale-105"
        />
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
        <p className="text-gray-200 text-sm flex-grow">{description}</p>

        {/* Tech stack icons */}
        {techStack && techStack.length > 0 && (
          <div className="flex gap-3 mt-4">
            {techStack.map((tech, i) => (
              <div
                key={i}
                className="group relative flex items-center"
              >
                <img
                  src={tech.icon}
                  alt={tech.name}
                  className="w-6 h-6 object-contain transition-transform duration-300 group-hover:scale-125"
                />
                {/* Tooltip */}
                <span
                  className="absolute -top-8 left-1/2 -translate-x-1/2 
                  bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 
                  group-hover:opacity-100 transition-opacity whitespace-nowrap"
                >
                  {tech.name}
                </span>
              </div>
            ))}
          </div>
        )}

        <div className="mt-4 flex justify-between items-center">
          {/* Price */}
          <span className="font-semibold text-emerald-400">{formattedPrice}</span>

          {/* Rating badge */}
          <span
            className="flex items-center gap-1 bg-emerald-500/10 border border-emerald-400/30 
            text-emerald-300 px-3 py-1 rounded-full text-sm font-medium"
          >
            <StarIcon className="w-5 h-5 text-yellow-400" />
            {formattedRating}
          </span>
        </div>

        {/* CTA Button */}
        <button
          className="mt-5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-5 py-2 
          rounded-lg flex items-center justify-center gap-2 font-medium
          hover:shadow-lg hover:shadow-emerald-500/30 active:scale-95 transition"
        >
          View Project <ArrowRightIcon className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default ProjectCard;
