'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Briefcase, Users as UsersIcon, BarChart2, CheckSquare,
  Target, GitBranch, PhoneCall, Inbox, Database, Contact, UserCheck,
  Building, ChevronLeft, ChevronRight, PlusCircle, Calendar, ChevronDown
} from 'lucide-react';
import AlphaGrowthLogo from '../../common/AlphaGrowthLogo';

interface MainLayoutProps {
  children: React.ReactNode;
  title?: string;
  headerActions?: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  title = 'Dashboard',
  headerActions,
}) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const pathname = usePathname();

  // Auto-collapse sidebar for campaign workflow pages
  useEffect(() => {
    const isCampaignWorkflowPage = pathname.includes('/campaigns/') && pathname.includes('/new/workflow');
    if (isCampaignWorkflowPage) {
      setIsSidebarCollapsed(true);
    }
  }, [pathname]);

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard', badge: 1 },
    { icon: Briefcase, label: 'Campaigns', href: '/campaigns', badge: '+5' },
    { icon: Inbox, label: 'Inbox', href: '/inbox', badge: 2 },
    { icon: UsersIcon, label: 'Identities', href: '/identities' },
    { icon: CheckSquare, label: 'My Tasks', href: '/tasks' },
    { icon: Target, label: 'ICPs', href: '/icp' },
    { icon: GitBranch, label: 'GTM Goals', href: '/gtm-goals' },
    { icon: PhoneCall, label: 'Calls', href: '/calls' },
    { icon: BarChart2, label: 'Reports', href: '/reports', badge: 3 },
  ];

  const prosItems = [
    { icon: Database, label: 'People Database', href: '/people-database' },
    { icon: Contact, label: 'Contacts', href: '/contacts' },
    { icon: UserCheck, label: 'Audiences', href: '/audiences' },
    { icon: Building, label: 'Companies', href: '/companies' },
  ];

  const NavItem = ({ icon: Icon, label, href, badge, isCollapsed }: any) => {
    const isActive = pathname === href;
    
    return (
      <Link 
        href={href} 
        className={`flex items-center w-full px-3 py-2.5 text-sm rounded-lg transition-colors relative ${
          isActive ? 'bg-orange-50 text-[#FF6B2C] font-semibold' : 'text-gray-600 hover:bg-gray-100'
        }`}
      >
        {isActive && (
          <motion.div
            layoutId="active-nav-indicator"
            className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#FF6B2C] to-[#3AA3FF] rounded-r-full"
          />
        )}
        <Icon size={18} className={isCollapsed ? 'mx-auto' : 'mr-3'} />
        {!isCollapsed && <span className="flex-1">{label}</span>}
        {!isCollapsed && badge && (
          <span className={`w-5 h-5 text-xs flex items-center justify-center rounded-full ${
            isActive ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-700 font-medium'
          }`}>
            {badge}
          </span>
        )}
      </Link>
    );
  };

  const defaultHeaderActions = (
    <div className="flex items-center gap-2">
      <button className="h-10 px-4 flex items-center gap-2 bg-white border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50">
        GTM: All <ChevronDown size={16} />
      </button>
      <button className="h-10 px-4 flex items-center gap-2 bg-white border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50">
        Campaign: All <ChevronDown size={16} />
      </button>
      <button className="h-10 px-4 flex items-center gap-2 bg-white border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50">
        <Calendar size={14}/> Last 30 Days <ChevronDown size={16} />
      </button>
      <button className="h-10 px-6 flex items-center gap-2 bg-gradient-to-r from-[#FF6B2C] to-[#3AA3FF] text-white font-semibold rounded-lg shadow-md hover:opacity-90">
        <PlusCircle size={16} /> Create Campaign
      </button>
    </div>
  );

  return (
    <div className="h-screen bg-[#F5F5F5] font-sans flex overflow-hidden relative">
      {/* Floating Sidebar Toggle Button */}
      <button
        onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
        className="fixed top-4 left-4 z-50 p-2 bg-white border border-gray-200 rounded-full shadow-lg text-gray-600 hover:bg-gray-50 hover:shadow-xl transition-all duration-200 md:hidden"
        title="Toggle sidebar"
      >
        {isMobileSidebarOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
      </button>


      {/* Mobile Sidebar Overlay */}
      {isMobileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <motion.aside
        className="fixed top-0 left-0 h-full bg-white z-50 shadow-xl md:hidden"
        initial={{ x: -280 }}
        animate={{ x: isMobileSidebarOpen ? 0 : -280 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      >
        <div className="flex items-center justify-between p-4 h-16 border-b border-gray-200">
          <AlphaGrowthLogo />
          <button
            onClick={() => setIsMobileSidebarOpen(false)}
            className="p-1.5 rounded-full text-gray-500 hover:bg-gray-100"
          >
            <ChevronLeft size={16} />
          </button>
        </div>

        <nav className="flex-grow p-4 space-y-4 overflow-y-auto">
          <div>
            <h3 className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
              Menu
            </h3>
            <div className="space-y-1">
              {menuItems.map(item => (
                <NavItem key={item.label} {...item} isCollapsed={false} />
              ))}
            </div>
          </div>
          <div>
            <h3 className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mt-6 mb-2">
              Pros
            </h3>
            <div className="space-y-1">
              {prosItems.map(item => (
                <NavItem key={item.label} {...item} isCollapsed={false} />
              ))}
            </div>
          </div>
        </nav>

        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-3">
            <img
              src="https://placehold.co/40x40/3AA3FF/FFFFFF?text=A"
              alt="User Avatar"
              className="w-10 h-10 rounded-full"
            />
            <div className="flex-1">
              <p className="font-semibold text-sm text-[#1E1E1E]">Admin</p>
              <p className="text-xs text-gray-500">Workspace Owner</p>
            </div>
          </div>
        </div>
      </motion.aside>

      {/* Sidebar */}
      <motion.aside
        className="bg-white flex-shrink-0 flex-col h-screen text-gray-800 border-r border-gray-200 hidden md:flex"
        animate={{ width: isSidebarCollapsed ? 80 : 280 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      >
        <div className={`flex items-center p-4 h-16 border-b border-gray-200 ${
          isSidebarCollapsed ? 'justify-center' : 'justify-between'
        }`}>
          <AlphaGrowthLogo isCollapsed={isSidebarCollapsed} />
          {!isSidebarCollapsed ? (
            <button
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="p-1.5 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-500 hover:text-gray-700 transition-all duration-200"
              title="Collapse sidebar"
            >
              <ChevronLeft size={16} />
            </button>
          ) : (
            <button
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="p-1.5 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-500 hover:text-gray-700 transition-all duration-200"
              title="Expand sidebar"
            >
              <ChevronRight size={16} />
            </button>
          )}
        </div>

        <nav className="flex-grow p-4 space-y-4 overflow-y-auto">
          <div>
            {!isSidebarCollapsed && (
              <h3 className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Menu
              </h3>
            )}
            <div className="space-y-1">
              {menuItems.map(item => (
                <NavItem key={item.label} {...item} isCollapsed={isSidebarCollapsed} />
              ))}
            </div>
          </div>
          <div>
            {!isSidebarCollapsed && (
              <h3 className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mt-6 mb-2">
                Pros
              </h3>
            )}
            <div className="space-y-1">
              {prosItems.map(item => (
                <NavItem key={item.label} {...item} isCollapsed={isSidebarCollapsed} />
              ))}
            </div>
          </div>
        </nav>

        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-3">
            <img
              src="https://placehold.co/40x40/3AA3FF/FFFFFF?text=A"
              alt="User Avatar"
              className="w-10 h-10 rounded-full"
            />
            {!isSidebarCollapsed && (
              <div className="flex-1">
                <p className="font-semibold text-sm text-[#1E1E1E]">Admin</p>
                <p className="text-xs text-gray-500">Workspace Owner</p>
              </div>
            )}
          </div>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <header className="bg-white flex-shrink-0 flex justify-between items-center p-4 border-b border-gray-200 h-16">
          <h1 className="text-xl font-bold text-[#1E1E1E]">{title}</h1>
          {headerActions || defaultHeaderActions}
        </header>
        <main className="flex-1 p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
