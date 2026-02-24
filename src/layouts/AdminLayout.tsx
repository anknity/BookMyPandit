import { Header } from '@/components/Header';
import { AdminSidebar } from '@/components/AdminSidebar';
import { Outlet } from 'react-router-dom';

export function AdminLayout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF7ED] via-[#F3F6FF] to-[#EAF2FF] text-slate-800 font-sans selection:bg-primary selection:text-white">
      <Header />
      <AdminSidebar />
      <main className="pt-[116px] pb-6 px-4 md:px-6 md:pl-80 w-full h-full min-h-screen">
        <Outlet />
      </main>
    </div>
  );
}
