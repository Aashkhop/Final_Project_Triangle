import React from "react";
import ProjectCard from "./ProjectCard";
import { StarIcon } from "@heroicons/react/24/solid";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const TopRatedProjects = () => {
  const projects = [
    {
      id: 1,
      title: "E-commerce Website",
      description:
        "A full-stack MERN e-commerce application with Stripe integration.",
      price: 15000,
      rating: 4.9,
      image:
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80",
      techStack: [
        { name: "React", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" },
        { name: "Node.js", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" },
        { name: "MongoDB", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg" },
        { name: "Tailwind CSS", icon: "https://www.vectorlogo.zone/logos/tailwindcss/tailwindcss-icon.svg" },
      ],
    },
    {
      id: 2,
      title: "AI Chatbot",
      description:
        "A customer support chatbot powered by NLP and machine learning.",
      price: 12000,
      rating: 4.8,
      image:
        "https://images.unsplash.com/photo-1591696331115-ef6013c79e2d?auto=format&fit=crop&w=800&q=80",
      techStack: [
        { name: "Python", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" },
        { name: "TensorFlow", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tensorflow/tensorflow-original.svg" },
      ],
    },
    {
      id: 3,
      title: "Portfolio Website",
      description:
        "A modern, responsive portfolio website for developers/designers.",
      price: 5000,
      rating: 4.7,
      image:
        "https://images.unsplash.com/photo-1559027615-ce3a3c47a63b?auto=format&fit=crop&w=800&q=80",
      techStack: [
        { name: "React", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" },
        { name: "Tailwind CSS", icon: "https://www.vectorlogo.zone/logos/tailwindcss/tailwindcss-icon.svg" },
      ],
    },
  ];

  return (
    <section
      className="relative py-20 md:py-24 text-white overflow-hidden"
      style={{
        backgroundColor: "#0B1221",
        backgroundImage: `
          linear-gradient(to bottom, #0C3B3B 0%, #0a192f 40%, #0f223a 100%)
        `,
      }}
    >
      {/* Hero-to-Section Gradient Bridge */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-36 z-0"
        style={{
          background:
            "linear-gradient(to bottom, #0C3B3B 0%, rgba(12,59,59,0.35) 50%, transparent 100%)",
        }}
      />

      {/* Emerald Divider */}
      <motion.div
        aria-hidden="true"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        viewport={{ once: true }}
        className="pointer-events-none absolute top-36 left-0 right-0 h-px z-0 
                   bg-gradient-to-r from-emerald-400/40 via-teal-400/60 to-emerald-400/40"
        style={{
          animation: "pulseGlow 6s ease-in-out infinite",
        }}
      />

      {/* Content */}
      <div className="relative z-[1] max-w-7xl mx-auto px-6">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="flex items-center justify-between mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold flex items-center gap-3">
            <motion.span
              whileHover={{ scale: 1.15, rotate: 10 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <StarIcon className="w-9 h-9 text-emerald-400 drop-shadow-[0_0_12px_rgba(16,185,129,0.6)]" />
            </motion.span>
            <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
              Top Rated Projects
            </span>
          </h2>

          <Link
            to="/explore"
            className="relative inline-block font-medium group overflow-hidden rounded-md"
          >
            {/* Sliding background */}
            <span
              className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 
              transform -translate-x-full group-hover:translate-x-0 
              transition-transform duration-500 ease-out"
            />
            {/* Text */}
            <span
              className="relative z-10 block px-3 py-1 text-emerald-400 
              transition-colors duration-500 group-hover:text-white"
            >
              View All →
            </span>
          </Link>
        </motion.div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, idx) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.15 }}
              viewport={{ once: true }}
              whileHover={{ rotateX: 2, rotateY: -2 }}
            >
              <ProjectCard {...project} />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Glow Animation */}
      <style>
        {`
          @keyframes pulseGlow {
            0%, 100% { opacity: 0.6; }
            50% { opacity: 1; }
          }
        `}
      </style>
    </section>
  );
};

export default TopRatedProjects;
