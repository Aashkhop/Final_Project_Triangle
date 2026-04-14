// src/components/Hero.jsx
import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

function Hero() {
  return (
    <section
      className="relative overflow-hidden text-white"
      style={{
        backgroundImage:
          "radial-gradient(at 50% 20%, #0C3B3B 0%, #0B1221 80%)",
      }}
    >
      {/* Decorative background grid + glow */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        {/* subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.15) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
            maskImage:
              "radial-gradient(circle at 30% 20%, black 0%, transparent 60%)",
          }}
        />
        {/* enhanced emerald glow */}
        <div
          className="absolute -top-32 -right-32 h-[32rem] w-[32rem] rounded-full blur-3xl opacity-25"
          style={{
            background:
              "radial-gradient(circle at 30% 30%, #10b981, #14b8a6 70%)",
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative py-20 md:py-28 text-center">
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-emerald-300 text-xs md:text-sm mb-5"
        >
          <span className="inline-block h-2 w-2 rounded-full bg-emerald-400"></span>
          Marketplace for Projects & Talent
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight"
        >
          Buy, Sell, or Build Projects —{" "}
          <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
            all in one place
          </span>
        </motion.h1>

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mx-auto mt-4 md:mt-6 max-w-2xl text-base sm:text-lg md:text-xl text-teal-100/90"
        >
          Discover top-quality student & freelance projects, or hire talent to
          bring yours to life — fast, transparent, and secure.
        </motion.p>

        {/* 🔍 Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-8 order-1 sm:order-none max-w-2xl mx-auto flex items-center
                     bg-white rounded-xl overflow-hidden border border-gray-200
                     shadow-lg [box-shadow:inset_0_2px_6px_rgba(0,0,0,0.08)]"
        >
          <input
            type="text"
            placeholder="Search by project name, tech stack, or keyword..."
            className="flex-grow px-4 py-3 text-gray-700 focus:outline-none text-sm sm:text-base"
          />
          <button className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-6 py-3 font-semibold hover:opacity-90 active:opacity-100 transition">
            Search
          </button>
        </motion.div>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mt-10 sm:mt-14 flex flex-col sm:flex-row sm:flex-wrap items-center justify-center gap-3 sm:gap-4"
        >
          <Link
            to="/explore"
            className="w-full sm:w-auto px-6 py-3 rounded-lg font-semibold shadow-md
                       bg-yellow-400 text-[#0B1221]
                       hover:bg-yellow-300 active:bg-yellow-400
                       transition text-center"
          >
            Explore Projects
          </Link>

          <Link
            to="/upload"
            className="w-full sm:w-auto px-6 py-3 rounded-lg font-semibold shadow-md
                       bg-gradient-to-r from-emerald-500 to-teal-500
                       text-white hover:opacity-90 active:opacity-100
                       transition text-center"
          >
            Post a Project
          </Link>

          <Link
            to="/freelance"
            className="w-full sm:w-auto px-6 py-3 rounded-lg font-semibold shadow-md
                       border-2 border-emerald-500/70
                       bg-white/0 text-white
                       hover:bg-emerald-500/10
                       transition text-center"
          >
            Freelancer Hub
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

export default Hero;
