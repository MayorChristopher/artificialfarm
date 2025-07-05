import React from "react";
import { motion } from "framer-motion";
import { Settings, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const DashboardHeader = ({ user, notifications, onNotificationClick }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="mb-8"
    >
      <div className="relative overflow-hidden rounded-2xl p-0 md:p-6 bg-gradient-to-br from-green-900/60 via-yellow-900/40 to-blue-900/60 shadow-2xl">
        {/* Decorative blurred background accent */}
        <div className="absolute -top-16 -left-16 w-56 h-56 bg-yellow-400/20 rounded-full blur-3xl z-0 animate-pulse-slow" />
        <div className="absolute -bottom-16 -right-16 w-56 h-56 bg-blue-400/20 rounded-full blur-3xl z-0 animate-pulse-slow" />
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 p-4 md:p-0">
          {/* Avatar and user info */}
          <div className="flex flex-col items-center w-full lg:flex-row lg:items-center lg:w-auto lg:justify-start gap-4">
            <div className="flex justify-center w-full lg:w-auto">
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.7, type: "spring" }}
                className="relative"
              >
                <img
                  src={
                    user.avatar ||
                    "https://ui-avatars.com/api/?name=" +
                      encodeURIComponent(user.name || "User") +
                      "&background=FACC15&color=14532D"
                  }
                  alt={user.name}
                  className="w-24 h-24 lg:w-20 lg:h-20 rounded-full border-4 border-yellow-400 shadow-xl bg-white object-cover mx-auto lg:mx-0 animate-profile-avatar"
                />
                {/* Animated ring */}
                <span className="absolute inset-0 rounded-full border-2 border-yellow-400/40 animate-spin-slow pointer-events-none" />
              </motion.div>
            </div>
            <div className="flex flex-col items-center lg:items-start text-center lg:text-left w-full lg:w-auto mt-3 lg:mt-0">
              <h1 className="text-2xl md:text-3xl font-extrabold text-white flex items-center gap-2 drop-shadow-lg">
                Welcome back, {user.name}!
              </h1>
              <p className="text-white/80 max-w-xs lg:max-w-none text-base md:text-lg mt-1">
                Continue your agricultural learning journey
              </p>
              <div className="flex flex-wrap gap-2 mt-3 justify-center lg:justify-start">
                <span className="px-3 py-1 rounded-full bg-green-500/30 text-green-100 text-xs font-bold shadow">
                  Student
                </span>
                <span className="px-3 py-1 rounded-full bg-blue-500/30 text-blue-100 text-xs font-bold shadow">
                  Level: Beginner
                </span>
                {/* Progress badge, dynamic */}
                {typeof user.progress === "number" && (
                  <span className="px-3 py-1 rounded-full bg-yellow-500/30 text-yellow-100 text-xs font-bold shadow">
                    Progress: {user.progress}%
                  </span>
                )}
              </div>
            </div>
          </div>
          {/* All navigation/actions are now in the sidebar for a smarter UX. */}
        </div>
        {/* <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gradient-to-r from-green-400/30 to-blue-400/30 rounded-xl p-5 flex items-center gap-4 shadow-lg">
            <span className="text-3xl md:text-4xl">🎯</span>
            <div className="flex-1">
              <div className="text-white font-bold text-base md:text-lg">Set Your Weekly Goal</div>
              <div className="text-white/80 text-sm md:text-base">Stay motivated by setting a learning target!</div>
            </div>
            <Button size="sm" className="ml-auto btn-primary whitespace-nowrap">Set Goal</Button>
          </div>
          <div className="bg-gradient-to-r from-yellow-400/30 to-pink-400/30 rounded-xl p-5 flex items-center gap-4 shadow-lg">
            <span className="text-3xl md:text-4xl">🎁</span>
            <div className="flex-1">
              <div className="text-white font-bold text-base md:text-lg">Claim Your Daily Reward</div>
              <div className="text-white/80 text-sm md:text-base">Log in daily to earn bonus points!</div>
            </div>
            <Button size="sm" className="ml-auto btn-secondary whitespace-nowrap">Claim</Button>
          </div>
        </div> */}
        {/* Custom animation keyframes for slow pulse/spin and avatar bounce */}
        <style>{`
          @keyframes pulse-slow { 0%, 100% { opacity: 0.7; } 50% { opacity: 1; } }
          .animate-pulse-slow { animation: pulse-slow 4s ease-in-out infinite; }
          @keyframes spin-slow { 100% { transform: rotate(360deg); } }
          .animate-spin-slow { animation: spin-slow 8s linear infinite; }
          @keyframes profile-avatar-bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
          .animate-profile-avatar { animation: profile-avatar-bounce 2.5s cubic-bezier(.68,-0.55,.27,1.55) infinite; }
        `}</style>
      </div>
    </motion.div>
  );
};

export default DashboardHeader;
