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
      {/* Desktop Sidebar - Full Height */}
      <div className="hidden md:block w-64 flex-shrink-0 min-h-screen">
        <DashboardSidebar
          open={true}
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

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <div className="md:hidden fixed inset-0 z-50">
            <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
            <div className="absolute left-0 top-0 h-full w-64">
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
          </div>
        )}
      </AnimatePresence>

      {/* Main Content Area - Fixed Navbar Overlap */}
      <div className="flex-1 flex flex-col min-h-screen">
        <div className="px-4 sm:px-6 lg:px-8 pt-24 pb-6 flex-1 flex flex-col overflow-auto">
          {/* Floating Tools Button for mobile/tablet */}
          <div className="md:hidden fixed left-4 top-24 z-40">
            <button
              className="p-3 rounded-full bg-green-900/90 text-yellow-400 shadow-lg border-2 border-yellow-400 hover:bg-green-800/90 transition-colors"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open tools sidebar"
            >
              <Wrench className="w-7 h-7" />
            </button>
          </div>
          <div className="w-full h-full">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
