// src/pages/FreelancerHome.jsx
import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Briefcase, User } from "lucide-react";

const FreelancerHome = () => {
  return (
    <section
      className="relative overflow-hidden text-white min-h-[90vh] flex flex-col items-center justify-center px-6"
      style={{
        backgroundImage:
          "radial-gradient(at 50% 20%, #0C3B3B 0%, #0B1221 80%)",
      }}
    >
      {/* Background Decorations */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.12) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.12) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
            maskImage:
              "radial-gradient(circle at 30% 20%, black 0%, transparent 65%)",
          }}
        />
        <div
          className="absolute -top-32 -right-32 h-[30rem] w-[30rem] rounded-full blur-3xl opacity-25"
          style={{
            background:
              "radial-gradient(circle at 30% 30%, #10b981, #14b8a6 70%)",
          }}
        />
      </div>

      {/* Content Wrapper */}
      <div className="flex flex-col items-center justify-center max-w-5xl w-full gap-8">
        {/* Tagline */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/20 px-4 py-1 
                     text-emerald-100 text-sm font-medium shadow-sm shadow-emerald-400/20"
        >
          Freelancer Hub
        </motion.div>

        {/* Premium Divider */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="h-1 w-24 rounded-full bg-gradient-to-r from-emerald-400 to-teal-400"
        />

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-center"
        >
          Work Smarter with{" "}
          <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
            Freelance Hub
          </span>
        </motion.h1>

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="text-lg text-teal-100/90 text-center max-w-2xl leading-relaxed"
        >
          Find work or hire top talent — fast, transparent, and secure.
        </motion.p>

        {/* Options (Cards Row) */}
        <div className="flex flex-wrap gap-8 justify-center">
          {/* Client Card */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="group bg-gray-900/70 backdrop-blur-xl border border-emerald-500/40 rounded-2xl shadow-lg p-8 w-72 flex flex-col justify-between min-h-[320px] hover:border-emerald-400 hover:shadow-emerald-500/30 hover:scale-[1.04] transition duration-300"
          >
            <div className="flex flex-col items-center">
              {/* Icon with gradient circle */}
              <div className="flex items-center justify-center h-16 w-16 rounded-full 
                              bg-gradient-to-r from-emerald-400 to-teal-400 mb-4 shadow-lg 
                              ring-2 ring-emerald-400/30 group-hover:scale-110 
                              transition-transform">
                <User className="h-8 w-8 text-white drop-shadow-md" />
              </div>
              <h2 className="text-xl font-semibold mb-2">Post a Project</h2>
              <p className="text-gray-100 text-center mb-6 text-sm">
                Need something built? Post your project and connect with the right freelancer.
              </p>
            </div>
            <Link to="/freelance/client" className="w-full mt-auto">
              <button className="w-full bg-gradient-to-r from-emerald-400 to-teal-400 
                                 text-white font-semibold px-5 py-3 rounded-xl 
                                 shadow-md shadow-emerald-500/20 border border-emerald-300/20
                                 hover:opacity-95 hover:shadow-xl hover:shadow-emerald-400/40 
                                 transition">
                Post My Project
              </button>
            </Link>
          </motion.div>

          {/* Freelancer Card */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="group bg-gray-900/70 backdrop-blur-xl border border-emerald-500/40 rounded-2xl shadow-lg p-8 w-72 flex flex-col justify-between min-h-[320px] hover:border-emerald-400 hover:shadow-emerald-500/30 hover:scale-[1.04] transition duration-300"
          >
            <div className="flex flex-col items-center">
              {/* Icon with gradient circle */}
              <div className="flex items-center justify-center h-16 w-16 rounded-full 
                              bg-gradient-to-r from-emerald-400 to-teal-400 mb-4 shadow-lg 
                              ring-2 ring-emerald-400/30 group-hover:scale-110 
                              transition-transform">
                <Briefcase className="h-8 w-8 text-white drop-shadow-md" />
              </div>
              <h2 className="text-xl font-semibold mb-2">Work on a Project</h2>
              <p className="text-gray-100 text-center mb-6 text-sm">
                Browse project requests, showcase your skills, and start earning today.
              </p>
            </div>
            <Link to="/freelance/freelancer" className="w-full mt-auto">
              <button className="w-full bg-gradient-to-r from-emerald-400 to-teal-400 
                                 text-white font-semibold px-5 py-3 rounded-xl 
                                 shadow-md shadow-emerald-500/20 border border-emerald-300/20
                                 hover:opacity-95 hover:shadow-xl hover:shadow-emerald-400/40 
                                 transition">
                Find Work
              </button>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default FreelancerHome;
