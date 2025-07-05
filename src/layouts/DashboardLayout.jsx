import React from "react";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import { AnimatePresence } from "framer-motion";
import { Outlet } from "react-router-dom";
import { Wrench } from "lucide-react";

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  React.useEffect(() => {
    const openSidebar = () => setSidebarOpen(true);
    window.addEventListener("dashboard:openSidebar", openSidebar);
    return () =>
      window.removeEventListener("dashboard:openSidebar", openSidebar);
  }, []);

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-green-900/80 via-yellow-900/40 to-blue-900/60 font-satoshi">
      <AnimatePresence>
        <div className=" md:block md:w-64">
          <DashboardSidebar
            open={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
            motionProps={{
              initial: { x: -300, opacity: 0 },
              animate: {
                x: 0,
                opacity: 1,
                transition: { type: "spring", stiffness: 300, damping: 30 },
              },
              exit: { x: -300, opacity: 0, transition: { duration: 0.2 } },
            }}
          />
        </div>
      </AnimatePresence>
      <div className="flex-1 min-h-screen md:ml-6 flex flex-col wrap">
        <div className="px-2 sm:px-4 md:px-8 py-4 flex-1 flex flex-col">
          {/* Floating Tools Button for mobile/tablet */}
          <div className="md:hidden fixed left-4 top-20 z-40">
            <button
              className="p-3 rounded-full bg-green-900/90 text-yellow-400 shadow-lg border-2 border-yellow-400 hover:bg-green-800/90 transition-colors"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open tools sidebar"
            >
              <Wrench className="w-7 h-7" />
            </button>
          </div>
          <div className="glass-effect rounded-2xl w-full max-w-full p-4 sm:p-6 md:p-8 bg-white/10 backdrop-blur-md border border-white/10 mx-auto">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
