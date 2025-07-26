import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BookOpen, Award, Clock, Bell, Settings, Home, X, Wrench } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '@/components/ui/button';

const navLinks = [
	{ name: 'Overview', to: '/dashboard', icon: Home },
	{ name: 'My Courses', to: '/dashboard/my-courses', icon: BookOpen },
	{ name: 'Progress', to: '/dashboard/progress', icon: Clock },
	{ name: 'Certificates', to: '/dashboard/certificates', icon: Award },
	{ name: 'Notifications', to: '/dashboard/notifications', icon: Bell },
	{ name: 'Settings', to: '/settings', icon: Settings }, // <-- updated path
];

const DashboardSidebar = ({ open = false, onClose, motionProps }) => {
	const location = useLocation();
	// Overlay for mobile/tablet
	return (
		<>
			{/* Desktop sidebar */}
			<motion.aside
				className="hidden md:flex flex-col w-64 h-full bg-white/5 border-r border-white/10 py-8 px-4"
				{...(motionProps && !open ? {} : motionProps || {})}
			>
				<div className="flex items-center gap-2 mb-6 text-yellow-400 font-bold text-lg">
					<Wrench className="w-6 h-6" />
					<span>Tools</span>
				</div>
				<nav className="flex flex-col gap-2 flex-1">
					{navLinks.map(link => (
						<Link
							key={link.to}
							to={link.to}
							className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors text-white/80 hover:bg-yellow-400/10 hover:text-yellow-400 ${location.pathname === link.to ? 'bg-yellow-400/10 text-yellow-400' : ''
								}`}
							onClick={onClose}
						>
							<link.icon className="w-5 h-5" />
							{link.name}
						</Link>
					))}
				</nav>
			</motion.aside>
			{/* Mobile/Tablet overlay drawer (from left) */}
			{open && (
				<motion.div
					className="fixed inset-0 z-50 flex md:hidden"
					initial={{ x: -300, opacity: 0 }}
					animate={{ x: 0, opacity: 1, transition: { type: 'spring', stiffness: 300, damping: 30 } }}
					exit={{ x: -300, opacity: 0, transition: { duration: 0.2 } }}
				>
					<aside className="md:hidden relative w-64 bg-green-900/90 border-r border-yellow-400 min-h-screen py-8 px-4 animate-slide-in-left shadow-2xl">
						<div className="flex items-center gap-2 mb-6 text-yellow-400 font-bold text-lg">
							<Wrench className="w-6 h-6" />
							<span>Tools</span>
						</div>
						<button
							className="absolute top-4 right-4 text-yellow-400 hover:text-yellow-500"
							onClick={onClose}
							aria-label="Close sidebar"
						>
							<X className="w-6 h-6" />
						</button>
						<nav className="flex flex-col gap-2 mt-8">
							{navLinks.map(link => (
								<Link
									key={link.to}
									to={link.to}
									className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors text-white hover:bg-green-800/80 hover:text-yellow-400 ${location.pathname === link.to ? 'bg-green-800/80 text-yellow-400 font-bold' : ''
										}`}
									onClick={onClose}
								>
									<link.icon className="w-5 h-5" />
									{link.name}
								</Link>
							))}
						</nav>
					</aside>
					<div className="bg-black/40 w-full h-full" onClick={onClose} />
					<style>{`
						@keyframes slide-in-left { from { transform: translateX(-100%); } to { transform: translateX(0); } }
						.animate-slide-in-left { animation: slide-in-left 0.25s cubic-bezier(.4,0,.2,1) both; }
					`}</style>
				</motion.div>
			)}
		</>
	);
};

export default DashboardSidebar;
<Button className="w-full sm:w-auto ...">Save</Button>
