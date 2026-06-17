import React, { useState } from 'react';
import { X, CheckCircle, Calendar, ShieldCheck, Mail, Phone, MapPin, Sparkles } from 'lucide-react';

interface LeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitSuccess: (clientName: string, projectName: string, type: string, area: number, location: string, phone: string, email: string) => void;
}

export default function LeadModal({ isOpen, onClose, onSubmitSuccess }: LeadModalProps) {
  const [formData, setFormData] = useState({
    nombres: '',
    apellidos: '',
    cedula: '',
    telefono: '',
    correo: '',
    tipoProyecto: 'Plano Arquitectónico o Estructural',
    area: '120',
    ubicacion: '',
    detalles: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate real API storage and validation
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      
      // Propagate down to the simulated database to dynamically populate the Excel sheet!
      onSubmitSuccess(
        formData.nombres,
        formData.apellidos,
        formData.tipoProyecto,
        parseFloat(formData.area) || 100,
        formData.ubicacion || 'Por definir',
        formData.telefono,
        formData.correo
      );
      
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
        // Reset
        setFormData({
          nombres: '',
          apellidos: '',
          cedula: '',
          telefono: '',
          correo: '',
          tipoProyecto: 'Plano Arquitectónico o Estructural',
          area: '120',
          ubicacion: '',
          detalles: ''
        });
      }, 3500);

    }, 1500);
  };

  return (
    <div id="booking-modal-overlay" className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div 
        id="booking-modal-container"
        className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full overflow-hidden shadow-dark-premium text-slate-100 flex flex-col max-h-[90vh] animate-fadeIn"
      >
        {/* Header */}
        <div className="bg-slate-950 p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-base md:text-lg text-white">Solicitar Consulta Gratuita</h3>
          </div>
          <button 
            id="btn-close-modal"
            onClick={onClose} 
            className="text-slate-400 hover:text-white transition p-1.5 rounded-lg hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content body */}
        <div className="overflow-y-auto p-6">
          {isSuccess ? (
            <div id="modal-success-screen" className="text-center py-8 px-4 flex flex-col items-center">
              <div className="bg-emerald-500/10 text-emerald-400 p-4 rounded-full border border-emerald-500/30 mb-4 animate-scaleUp">
                <CheckCircle className="w-12 h-12" />
              </div>
              <h4 className="text-xl font-bold text-white mb-2">¡Tu solicitud fue enviada con éxito!</h4>
              <p className="text-sm text-slate-400 leading-relaxed max-w-sm mx-auto mb-4">
                La <span className="text-white font-bold">Arq. Ana Villarreal</span> se pondrá en contacto contigo en las próximas 24 horas laborables en el número o correo provisto.
              </p>
              <div className="bg-slate-950/60 border border-slate-800 px-4 py-2.5 rounded-xl text-xs font-mono text-emerald-400">
                Se ha generado un registro automático en tus Hojas de Gestión
              </div>
            </div>
          ) : (
            <form id="lead_registration_form" onSubmit={handleSubmit} className="space-y-4">
              <div className="bg-amber-500/10 border border-amber-500/20 p-3.5 rounded-xl flex items-start gap-3">
                <Calendar className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div className="text-xs">
                  <span className="font-bold text-amber-300 block mb-0.5">Cupos semanales muy limitados</span>
                  <span className="text-slate-350 leading-relaxed">
                    Las consultas se asignan por estricto orden de llegada. Completa tu información técnica para reservar un análisis personalizado de tu terreno sin costo.
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Tu Nombre</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="Ej. Margarita"
                    value={formData.nombres}
                    onChange={(e) => setFormData({...formData, nombres: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-slate-200 focus:outline-none focus:border-amber-500 transition"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Tus Apellidos</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="Ej. Gutiérrez"
                    value={formData.apellidos}
                    onChange={(e) => setFormData({...formData, apellidos: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-slate-200 focus:outline-none focus:border-amber-500 transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Cédula o ID (Requerido para el Plano)</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="Ej. 1718293848"
                    value={formData.cedula}
                    onChange={(e) => setFormData({...formData, cedula: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-slate-200 focus:outline-none focus:border-amber-500 transition"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Servicio de Interés</label>
                  <select 
                    value={formData.tipoProyecto}
                    onChange={(e) => setFormData({...formData, tipoProyecto: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-slate-200 focus:outline-none focus:border-amber-500 transition"
                  >
                    <option value="Plano Arquitectónico o Estructural">Plano Arquitectónico o Estructural</option>
                    <option value="Levantamiento Topográfico">Levantamiento Topográfico</option>
                    <option value="Avalúos de Bienes Muebles/Inmuebles">Avalúos de Bienes Muebles/Inmuebles</option>
                    <option value="Peritaje Técnico de Edificaciones">Peritaje Técnico de Edificaciones</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">WhatsApp / Celular</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-550">
                      <Phone className="w-4 h-4" />
                    </span>
                    <input 
                      type="tel" 
                      required 
                      placeholder="0998765432"
                      value={formData.telefono}
                      onChange={(e) => setFormData({...formData, telefono: e.target.value})}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 p-3 text-sm text-slate-200 focus:outline-none focus:border-amber-500 transition"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Correo Electrónico</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-550">
                      <Mail className="w-4 h-4" />
                    </span>
                    <input 
                      type="email" 
                      required 
                      placeholder="ejemplo@gmail.com"
                      value={formData.correo}
                      onChange={(e) => setFormData({...formData, correo: e.target.value})}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 p-3 text-sm text-slate-200 focus:outline-none focus:border-amber-500 transition"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Área Estimada del Terreno / Construcción (m²)</label>
                  <input 
                    type="number" 
                    required 
                    placeholder="Ej. 120"
                    value={formData.area}
                    onChange={(e) => setFormData({...formData, area: e.target.value})}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-slate-200 focus:outline-none focus:border-amber-500 transition"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Ubicación del Terreno / Ciudad</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-550">
                      <MapPin className="w-4 h-4" />
                    </span>
                    <input 
                      type="text" 
                      required 
                      placeholder="Ej. Tumbaco, Quito"
                      value={formData.ubicacion}
                      onChange={(e) => setFormData({...formData, ubicacion: e.target.value})}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 p-3 text-sm text-slate-200 focus:outline-none focus:border-amber-500 transition"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Cuéntanos más sobre el espacio que sueñas</label>
                <textarea 
                  rows={2}
                  placeholder="Ej. Deseo planos de una casa de dos pisos con cocina abierta sobre un lote inclinado..."
                  value={formData.detalles}
                  onChange={(e) => setFormData({...formData, detalles: e.target.value})}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-sm text-slate-200 focus:outline-none focus:border-amber-500 transition placeholder:text-slate-600 resize-none"
                ></textarea>
              </div>

              <button 
                id="btn-submit-lead"
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-slate-950 font-bold p-3.5 rounded-xl text-center text-xs sm:text-sm uppercase tracking-widest cursor-pointer shadow-lg shadow-amber-950/20 transition duration-150 mt-2"
              >
                {isSubmitting ? 'Procesando tu Reserva...' : 'Agendar mi Consulta Gratuita'}
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-450 pt-2 text-center">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>Tus datos están protegidos por secreto profesional y firma técnica colegiada.</span>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
