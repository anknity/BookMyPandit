import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '@/config/api';
import { Puja } from '@/types';

export function AdminServices() {
  const navigate = useNavigate();
  const [services, setServices] = useState<Puja[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      // ?all=true bypasses the is_active filter so admin sees inactive services too
      const { data } = await api.get('/pujas?all=true');
      setServices(data.pujas || []);
    } catch (error) {
      console.error('Error fetching services:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 min-w-0 pb-10 px-4 md:px-8 pt-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Service Management</h2>
          <p className="text-slate-500 text-sm mt-1">{services.length} active services</p>
        </div>
        <button
          onClick={() => navigate('/admin/services/new')}
          className="bg-primary hover:bg-primary-dark text-white px-4 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-primary/20 transition-all"
        >
          <span className="material-symbols-outlined">add</span>
          Add New Puja
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="h-64 bg-slate-100 rounded-2xl animate-pulse"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {services.map((service) => (
            <div key={service.id} className="glass-panel rounded-2xl overflow-hidden group hover:shadow-xl transition-all duration-300 border border-slate-100 bg-white flex flex-col h-full">
              <div className="h-48 overflow-hidden relative bg-slate-100 shrink-0">
                {service.image_url ? (
                  <img src={service.image_url} alt={service.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-300 bg-slate-50">
                    <span className="material-symbols-outlined text-5xl">temple_hindu</span>
                  </div>
                )}
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-bold shadow-sm text-slate-700">
                  {service.category}
                </div>
                {!service.is_active && (
                  <div className="absolute inset-0 bg-slate-900/50 flex items-center justify-center">
                    <span className="bg-slate-800 text-white text-xs font-bold px-3 py-1 rounded-full">INACTIVE</span>
                  </div>
                )}
              </div>

              <div className="p-5 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-bold text-slate-800 line-clamp-1" title={service.name}>{service.name}</h3>
                  <span className="text-primary font-bold whitespace-nowrap">₹{service.base_price.toLocaleString('en-IN')}</span>
                </div>

                {service.name_hi && (
                  <p className="text-xs text-slate-400 mb-3 font-medium">{service.name_hi}</p>
                )}

                <div className="flex items-center gap-4 text-xs text-slate-500 mb-4 mt-auto">
                  <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">schedule</span>
                    {service.duration}
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">group</span>
                    {service.pandits_required} Pandits
                  </div>
                </div>

                <div className="flex gap-2 mt-4 pt-4 border-t border-slate-50">
                  <button
                    onClick={() => navigate(`/admin/services/${service.id}`)}
                    className="flex-1 py-2 rounded-lg border border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-50 hover:border-slate-300 transition-colors flex items-center justify-center gap-1"
                  >
                    <span className="material-symbols-outlined text-sm">edit</span>
                    Edit
                  </button>
                  <button
                    onClick={() => window.open(`/pujas/${service.id}`, '_blank')}
                    className="flex-1 py-2 rounded-lg bg-primary/10 text-primary font-semibold text-sm hover:bg-primary/20 transition-colors flex items-center justify-center gap-1"
                  >
                    <span className="material-symbols-outlined text-sm">visibility</span>
                    View
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
