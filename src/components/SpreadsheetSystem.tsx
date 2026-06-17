import React, { useState } from 'react';
import { 
  Table as TableIcon, 
  Database, 
  Plus, 
  Search, 
  Trash2, 
  Download, 
  ArrowRightLeft, 
  Users, 
  FolderOpen, 
  Compass, 
  FileText, 
  TrendingUp, 
  AlertTriangle, 
  Check, 
  RefreshCw,
  Info
} from 'lucide-react';
import { Cliente, Proyecto, LevantamientoTopografico, PlanoArquitectonico, Avaluo, Peritaje } from '../types';
import { initialClientes, initialProyectos, initialLevantamientos, initialPlanos, initialAvaluos, initialPeritajes } from '../data';

interface SpreadsheetSystemProps {
  clientes: Cliente[];
  setClientes: React.Dispatch<React.SetStateAction<Cliente[]>>;
  proyectos: Proyecto[];
  setProyectos: React.Dispatch<React.SetStateAction<Proyecto[]>>;
  levantamientos: LevantamientoTopografico[];
  setLevantamientos: React.Dispatch<React.SetStateAction<LevantamientoTopografico[]>>;
  planos: PlanoArquitectonico[];
  setPlanos: React.Dispatch<React.SetStateAction<PlanoArquitectonico[]>>;
  avaluos: Avaluo[];
  setAvaluos: React.Dispatch<React.SetStateAction<Avaluo[]>>;
  peritajes: Peritaje[];
  setPeritajes: React.Dispatch<React.SetStateAction<Peritaje[]>>;
}

export default function SpreadsheetSystem({
  clientes, setClientes,
  proyectos, setProyectos,
  levantamientos, setLevantamientos,
  planos, setPlanos,
  avaluos, setAvaluos,
  peritajes, setPeritajes
}: SpreadsheetSystemProps) {
  const [activeTab, setActiveTab] = useState<'CLIENTES' | 'PROYECTOS' | 'LEVANTAMIENTOS' | 'PLANOS' | 'AVALUOS' | 'PERITAJES' | 'RELACIONES'>('CLIENTES');
  
  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  
  // Success toast/message state
  const [notification, setNotification] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  // Excel simulation state
  const [isExporting, setIsExporting] = useState(false);

  // Form states for adding new records
  const [showAddForm, setShowAddForm] = useState(false);
  
  // Specific Entity Form States
  const [newCliente, setNewCliente] = useState<Omit<Cliente, 'id_cliente'>>({
    nombres: '', apellidos: '', cedula: '', telefono: '', correo: '', direccion: ''
  });
  
  const [newProyecto, setNewProyecto] = useState<Omit<Proyecto, 'id_proyecto'>>({
    id_cliente: 1, nombre_proyecto: '', tipo_proyecto: 'Residencial', ubicacion: '', fecha_inicio: new Date().toISOString().split('T')[0], presupuesto: 5000, estado: 'En Diagnóstico'
  });

  const [newLevantamiento, setNewLevantamiento] = useState<Omit<LevantamientoTopografico, 'id_levantamiento'>>({
    id_proyecto: 101, fecha_levantamiento: new Date().toISOString().split('T')[0], area_terreno: 200, coordenadas: '', observaciones: ''
  });

  const [newPlano, setNewPlano] = useState<Omit<PlanoArquitectonico, 'id_plano'>>({
    id_proyecto: 101, tipo_plano: 'Arquitectónico', fecha_elaboracion: new Date().toISOString().split('T')[0], version: 'v1.0', descripcion: ''
  });

  const [newAvaluo, setNewAvaluo] = useState<Omit<Avaluo, 'id_avaluo'>>({
    id_proyecto: 101, fecha_avaluo: new Date().toISOString().split('T')[0], valor_comercial: 50000, observaciones: ''
  });

  const [newPeritaje, setNewPeritaje] = useState<Omit<Peritaje, 'id_peritaje'>>({
    id_proyecto: 101, fecha_peritaje: new Date().toISOString().split('T')[0], tipo_peritaje: 'Daño Estructural', resultado: '', observaciones: ''
  });

  // Action: Add Row
  const handleAddRow = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeTab === 'CLIENTES') {
      const id = clientes.length > 0 ? Math.max(...clientes.map(c => c.id_cliente)) + 1 : 1;
      const created: Cliente = { id_cliente: id, ...newCliente };
      setClientes([...clientes, created]);
      setNewCliente({ nombres: '', apellidos: '', cedula: '', telefono: '', correo: '', direccion: '' });
      showToast(`Cliente "${created.nombres} ${created.apellidos}" agregado correctamente.`);
    } else if (activeTab === 'PROYECTOS') {
      const id = proyectos.length > 0 ? Math.max(...proyectos.map(p => p.id_proyecto)) + 1 : 101;
      const created: Proyecto = { id_proyecto: id, ...newProyecto };
      setProyectos([...proyectos, created]);
      setNewProyecto({ id_cliente: clientes[0]?.id_cliente || 1, nombre_proyecto: '', tipo_proyecto: 'Residencial', ubicacion: '', fecha_inicio: new Date().toISOString().split('T')[0], presupuesto: 5000, estado: 'En Diagnóstico' });
      showToast(`Proyecto "${created.nombre_proyecto}" enlazado con éxito.`);
    } else if (activeTab === 'LEVANTAMIENTOS') {
      const id = levantamientos.length > 0 ? Math.max(...levantamientos.map(l => l.id_levantamiento)) + 1 : 201;
      const created: LevantamientoTopografico = { id_levantamiento: id, ...newLevantamiento };
      setLevantamientos([...levantamientos, created]);
      setNewLevantamiento({ id_proyecto: proyectos[0]?.id_proyecto || 101, fecha_levantamiento: new Date().toISOString().split('T')[0], area_terreno: 150, coordenadas: '', observaciones: '' });
      showToast(`Levantamiento Topográfico #${id} registrado para el Proyecto.`);
    } else if (activeTab === 'PLANOS') {
      const id = planos.length > 0 ? Math.max(...planos.map(p => p.id_plano)) + 1 : 301;
      const created: PlanoArquitectonico = { id_plano: id, ...newPlano };
      setPlanos([...planos, created]);
      setNewPlano({ id_proyecto: proyectos[0]?.id_proyecto || 101, tipo_plano: 'Arquitectónico', fecha_elaboracion: new Date().toISOString().split('T')[0], version: 'v1.0', descripcion: '' });
      showToast(`Plano ${created.tipo_plano} creado en su versión ${created.version}.`);
    } else if (activeTab === 'AVALUOS') {
      const id = avaluos.length > 0 ? Math.max(...avaluos.map(a => a.id_avaluo)) + 1 : 401;
      const created: Avaluo = { id_avaluo: id, ...newAvaluo };
      setAvaluos([...avaluos, created]);
      setNewAvaluo({ id_proyecto: proyectos[0]?.id_proyecto || 101, fecha_avaluo: new Date().toISOString().split('T')[0], valor_comercial: 25000, observaciones: '' });
      showToast(`Avaluo por USD $${created.valor_comercial} registrado.`);
    } else if (activeTab === 'PERITAJES') {
      const id = peritajes.length > 0 ? Math.max(...peritajes.map(p => p.id_peritaje)) + 1 : 501;
      const created: Peritaje = { id_peritaje: id, ...newPeritaje };
      setPeritajes([...peritajes, created]);
      setNewPeritaje({ id_proyecto: proyectos[0]?.id_proyecto || 101, fecha_peritaje: new Date().toISOString().split('T')[0], tipo_peritaje: 'Daño Estructural', resultado: '', observaciones: '' });
      showToast(`Peritaje Técnico registrado.`);
    }
    setShowAddForm(false);
  };

  // Action: Delete Row
  const handleDeleteRow = (idField: string, idVal: number) => {
    if (confirm(`¿Estás seguro de que deseas eliminar este registro?`)) {
      if (activeTab === 'CLIENTES') {
        setClientes(clientes.filter(c => c.id_cliente !== idVal));
        showToast('Cliente eliminado de la base de datos.');
      } else if (activeTab === 'PROYECTOS') {
        setProyectos(proyectos.filter(p => p.id_proyecto !== idVal));
        showToast('Proyecto eliminado.');
      } else if (activeTab === 'LEVANTAMIENTOS') {
        setLevantamientos(levantamientos.filter(l => l.id_levantamiento !== idVal));
        showToast('Levantamiento topográfico eliminado.');
      } else if (activeTab === 'PLANOS') {
        setPlanos(planos.filter(p => p.id_plano !== idVal));
        showToast('Plano eliminado.');
      } else if (activeTab === 'AVALUOS') {
        setAvaluos(avaluos.filter(a => a.id_avaluo !== idVal));
        showToast('Avalúo eliminado.');
      } else if (activeTab === 'PERITAJES') {
        setPeritajes(peritajes.filter(p => p.id_peritaje !== idVal));
        showToast('Peritaje eliminado.');
      }
    }
  };

  // Helper to format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-EC', { style: 'currency', currency: 'USD' }).format(amount);
  };

  // Helper to associate tables
  const getClienteName = (id_cliente: number) => {
    const c = clientes.find(item => item.id_cliente === id_cliente);
    return c ? `${c.nombres} ${c.apellidos}` : `Desconocido (ID: ${id_cliente})`;
  };

  const getProyectoName = (id_proyecto: number) => {
    const p = proyectos.find(item => item.id_proyecto === id_proyecto);
    return p ? p.nombre_proyecto : `Desconocido (ID: ${id_proyecto})`;
  };

  // Filter lists based on search query
  const getFilteredData = () => {
    const query = searchQuery.toLowerCase();
    switch (activeTab) {
      case 'CLIENTES':
        return clientes.filter(c => 
          c.nombres.toLowerCase().includes(query) || 
          c.apellidos.toLowerCase().includes(query) || 
          c.cedula.includes(query) || 
          c.correo.toLowerCase().includes(query)
        );
      case 'PROYECTOS':
        return proyectos.filter(p => 
          p.nombre_proyecto.toLowerCase().includes(query) || 
          p.ubicacion.toLowerCase().includes(query) || 
          p.tipo_proyecto.toLowerCase().includes(query) ||
          getClienteName(p.id_cliente).toLowerCase().includes(query)
        );
      case 'LEVANTAMIENTOS':
        return levantamientos.filter(l => 
          l.coordenadas.toLowerCase().includes(query) || 
          l.observaciones.toLowerCase().includes(query) ||
          getProyectoName(l.id_proyecto).toLowerCase().includes(query)
        );
      case 'PLANOS':
        return planos.filter(p => 
          p.tipo_plano.toLowerCase().includes(query) || 
          p.version.toLowerCase().includes(query) || 
          p.descripcion.toLowerCase().includes(query) ||
          getProyectoName(p.id_proyecto).toLowerCase().includes(query)
        );
      case 'AVALUOS':
        return avaluos.filter(a => 
          a.observaciones.toLowerCase().includes(query) ||
          getProyectoName(a.id_proyecto).toLowerCase().includes(query)
        );
      case 'PERITAJES':
        return peritajes.filter(p => 
          p.tipo_peritaje.toLowerCase().includes(query) || 
          p.resultado.toLowerCase().includes(query) || 
          p.observaciones.toLowerCase().includes(query) ||
          getProyectoName(p.id_proyecto).toLowerCase().includes(query)
        );
      default:
        return [];
    }
  };

  // Simulate exporting entire multi-tab database to Excel
  const handleExportExcel = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      // Create CSV mock string
      const fileContent = "Hojas de Gestión de Proyectos Arquitectónicos - Villarreal Studio\n\n" +
        "CLIENTES:\n" + 
        "ID,Nombres,Apellidos,Cedula,Telefono,Correo,Direccion\n" + 
        clientes.map(c => `${c.id_cliente},"${c.nombres}","${c.apellidos}","${c.cedula}","${c.telefono}","${c.correo}","${c.direccion}"`).join("\n") +
        "\n\nPROYECTOS:\n" +
        "ID_Proyecto,ID_Cliente,Nombre,Tipo,Ubicacion,Fecha,Presupuesto,Estado\n" +
        proyectos.map(p => `${p.id_proyecto},${p.id_cliente},"${p.nombre_proyecto}","${p.tipo_proyecto}","${p.ubicacion}","${p.fecha_inicio}",${p.presupuesto},"${p.estado}"`).join("\n");
      
      const blob = new Blob([fileContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", "Sistema_Gestion_Ana_Villarreal.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast("¡Archivo Excel simulado (.CSV) generado y descargado con éxito!");
    }, 1500);
  };

  const currentList = getFilteredData();

  return (
    <div id="workbook-section" className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-dark-premium text-slate-100 font-sans max-w-6xl mx-auto my-12">
      {/* Title Bar & Status indicators */}
      <div className="bg-slate-950 border-b border-slate-800 p-4 md:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-emerald-600/20 text-emerald-400 p-2 rounded-lg border border-emerald-500/30">
            <Database className="w-5 h-5 md:w-6 md:h-6" />
          </div>
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-emerald-400 font-semibold">Sistema de Control Interno v1.0</span>
            <h3 className="text-lg md:text-xl font-bold tracking-tight text-white mt-0.5">Gestión de Proyectos Arquitectónicos</h3>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <button 
            id="btn-excel-export"
            onClick={handleExportExcel}
            className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white text-xs font-semibold px-4 py-2.5 rounded-lg border border-emerald-500/30 transition-all duration-200 cursor-pointer shadow-md shadow-emerald-950/20 w-full sm:w-auto"
            disabled={isExporting}
          >
            {isExporting ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Generando Excel...
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                Exportar Excel Workbook
              </>
            )}
          </button>
        </div>
      </div>

      {/* Spreadsheet Tabs (Like sheets in Excel) */}
      <div className="bg-slate-950 border-b border-slate-800 overflow-x-auto scrollbar-none flex">
        <button
          id="tab-clientes"
          onClick={() => { setActiveTab('CLIENTES'); setShowAddForm(false); }}
          className={`flex items-center gap-2 px-5 py-3.5 border-b-2 text-xs font-semibold uppercase tracking-wider whitespace-nowrap transition-all duration-150 cursor-pointer ${
            activeTab === 'CLIENTES' 
              ? 'border-emerald-500 text-emerald-400 bg-emerald-500/5' 
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
          }`}
        >
          <Users className="w-4 h-4" />
          Hoja 1: Clientes
        </button>
        <button
          id="tab-proyectos"
          onClick={() => { setActiveTab('PROYECTOS'); setShowAddForm(false); }}
          className={`flex items-center gap-2 px-5 py-3.5 border-b-2 text-xs font-semibold uppercase tracking-wider whitespace-nowrap transition-all duration-150 cursor-pointer ${
            activeTab === 'PROYECTOS' 
              ? 'border-emerald-500 text-emerald-400 bg-emerald-500/5' 
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
          }`}
        >
          <FolderOpen className="w-4 h-4" />
          Hoja 2: Proyectos
        </button>
        <button
          id="tab-levantamientos"
          onClick={() => { setActiveTab('LEVANTAMIENTOS'); setShowAddForm(false); }}
          className={`flex items-center gap-2 px-5 py-3.5 border-b-2 text-xs font-semibold uppercase tracking-wider whitespace-nowrap transition-all duration-150 cursor-pointer ${
            activeTab === 'LEVANTAMIENTOS' 
              ? 'border-emerald-500 text-emerald-400 bg-emerald-500/5' 
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
          }`}
        >
          <Compass className="w-4 h-4" />
          Hoja 3: Topografía
        </button>
        <button
          id="tab-planos"
          onClick={() => { setActiveTab('PLANOS'); setShowAddForm(false); }}
          className={`flex items-center gap-2 px-5 py-3.5 border-b-2 text-xs font-semibold uppercase tracking-wider whitespace-nowrap transition-all duration-150 cursor-pointer ${
            activeTab === 'PLANOS' 
              ? 'border-emerald-500 text-emerald-400 bg-emerald-500/5' 
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
          }`}
        >
          <FileText className="w-4 h-4" />
          Hoja 4: Planos
        </button>
        <button
          id="tab-avaluos"
          onClick={() => { setActiveTab('AVALUOS'); setShowAddForm(false); }}
          className={`flex items-center gap-2 px-5 py-3.5 border-b-2 text-xs font-semibold uppercase tracking-wider whitespace-nowrap transition-all duration-150 cursor-pointer ${
            activeTab === 'AVALUOS' 
              ? 'border-emerald-500 text-emerald-400 bg-emerald-500/5' 
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          Hoja 5: Avalúos
        </button>
        <button
          id="tab-peritajes"
          onClick={() => { setActiveTab('PERITAJES'); setShowAddForm(false); }}
          className={`flex items-center gap-2 px-5 py-3.5 border-b-2 text-xs font-semibold uppercase tracking-wider whitespace-nowrap transition-all duration-150 cursor-pointer ${
            activeTab === 'PERITAJES' 
              ? 'border-emerald-500 text-emerald-400 bg-emerald-500/5' 
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
          }`}
        >
          <AlertTriangle className="w-4 h-4" />
          Hoja 6: Peritajes
        </button>
        <button
          id="tab-relaciones"
          onClick={() => { setActiveTab('RELACIONES'); setShowAddForm(false); }}
          className={`flex items-center gap-2 px-5 py-3.5 border-b-2 text-xs font-semibold uppercase tracking-wider whitespace-nowrap transition-all duration-150 cursor-pointer ${
            activeTab === 'RELACIONES' 
              ? 'border-emerald-500 text-emerald-400 bg-emerald-500/5' 
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
          }`}
        >
          <ArrowRightLeft className="w-4 h-4" />
          Relaciones d/B
        </button>
      </div>

      {/* Main Table View Panel */}
      <div className="p-4 md:p-6 bg-slate-900 min-h-[400px]">
        {/* Navigation & Search bar inside active tab if it's a data tab */}
        {activeTab !== 'RELACIONES' && (
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-6">
            <div className="relative flex-1 max-w-md w-full">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
                <Search className="w-4 h-4" />
              </span>
              <input 
                id="tab-search"
                type="text" 
                placeholder={`Buscar en ${activeTab.toLowerCase()}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-sm rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all placeholder:text-slate-500"
              />
            </div>

            <button 
              id="btn-add-record"
              onClick={() => setShowAddForm(!showAddForm)}
              className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-750 text-slate-100 hover:text-white text-xs font-semibold px-4 py-2.5 rounded-xl border border-slate-700 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4 text-emerald-400" />
              {showAddForm ? 'Cerrar Formulario' : 'Insertar Nueva Fila'}
            </button>
          </div>
        )}

        {/* Dynamic add form */}
        {showAddForm && activeTab !== 'RELACIONES' && (
          <form id="add-record-form" onSubmit={handleAddRow} className="bg-slate-950/60 border border-slate-800 p-5 rounded-2xl mb-8 animate-fadeIn">
            <h4 className="text-sm font-semibold text-emerald-400 mb-4 flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Ingresar Nuevo Registro en HOJA_{activeTab}
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {activeTab === 'CLIENTES' && (
                <>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1.5">Nombres</label>
                    <input type="text" required value={newCliente.nombres} onChange={(e) => setNewCliente({...newCliente, nombres: e.target.value})} className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-sm text-slate-200 focus:outline-none focus:border-emerald-500" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1.5">Apellidos</label>
                    <input type="text" required value={newCliente.apellidos} onChange={(e) => setNewCliente({...newCliente, apellidos: e.target.value})} className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-sm text-slate-200 focus:outline-none focus:border-emerald-500" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1.5">Cédula</label>
                    <input type="text" required value={newCliente.cedula} onChange={(e) => setNewCliente({...newCliente, cedula: e.target.value})} className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-sm text-slate-200 focus:outline-none focus:border-emerald-500" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1.5">Teléfono</label>
                    <input type="text" required value={newCliente.telefono} onChange={(e) => setNewCliente({...newCliente, telefono: e.target.value})} className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-sm text-slate-200 focus:outline-none focus:border-emerald-500" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1.5">Correo Electrónico</label>
                    <input type="email" required value={newCliente.correo} onChange={(e) => setNewCliente({...newCliente, correo: e.target.value})} className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-sm text-slate-200 focus:outline-none focus:border-emerald-500" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1.5">Dirección de Domicilio</label>
                    <input type="text" required value={newCliente.direccion} onChange={(e) => setNewCliente({...newCliente, direccion: e.target.value})} className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-sm text-slate-200 focus:outline-none focus:border-emerald-500" />
                  </div>
                </>
              )}

              {activeTab === 'PROYECTOS' && (
                <>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1.5">Seleccionar Cliente (Relacionado)</label>
                    <select value={newProyecto.id_cliente} onChange={(e) => setNewProyecto({...newProyecto, id_cliente: parseInt(e.target.value)})} className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-sm text-slate-200 focus:outline-none focus:border-emerald-500">
                      {clientes.map(c => (
                        <option key={c.id_cliente} value={c.id_cliente}>{c.nombres} {c.apellidos}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1.5">Nombre del Proyecto</label>
                    <input type="text" required value={newProyecto.nombre_proyecto} onChange={(e) => setNewProyecto({...newProyecto, nombre_proyecto: e.target.value})} className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-sm text-slate-200 focus:outline-none focus:border-emerald-500" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1.5">Tipo de Proyecto</label>
                    <select value={newProyecto.tipo_proyecto} onChange={(e) => setNewProyecto({...newProyecto, tipo_proyecto: e.target.value})} className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-sm text-slate-200 focus:outline-none focus:border-emerald-500">
                      <option value="Residencial">Residencial</option>
                      <option value="Comercial">Comercial</option>
                      <option value="Remodelación">Remodelación</option>
                      <option value="Topografía">Topografía</option>
                      <option value="Avalúo">Avalúo</option>
                      <option value="Peritaje">Peritaje</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1.5">Ubicación física / Calle</label>
                    <input type="text" required value={newProyecto.ubicacion} onChange={(e) => setNewProyecto({...newProyecto, ubicacion: e.target.value})} className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-sm text-slate-200 focus:outline-none focus:border-emerald-500" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1.5">Presupuesto Inicial (USD)</label>
                    <input type="number" required value={newProyecto.presupuesto} onChange={(e) => setNewProyecto({...newProyecto, presupuesto: parseFloat(e.target.value)})} className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-sm text-slate-200 focus:outline-none focus:border-emerald-500" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1.5">Estado</label>
                    <select value={newProyecto.estado} onChange={(e) => setNewProyecto({...newProyecto, estado: e.target.value as any})} className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-sm text-slate-200 focus:outline-none focus:border-emerald-500">
                      <option value="En Diagnóstico">En Diagnóstico</option>
                      <option value="Levantamiento">Levantamiento</option>
                      <option value="En Diseño">En Diseño</option>
                      <option value="Aprobación Municipal">Aprobación Municipal</option>
                      <option value="Construcción">Construcción</option>
                      <option value="Completado">Completado</option>
                    </select>
                  </div>
                </>
              )}

              {activeTab === 'LEVANTAMIENTOS' && (
                <>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1.5">Seleccionar Proyecto Coherente</label>
                    <select value={newLevantamiento.id_proyecto} onChange={(e) => setNewLevantamiento({...newLevantamiento, id_proyecto: parseInt(e.target.value)})} className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-sm text-slate-200 focus:outline-none focus:border-emerald-500">
                      {proyectos.map(p => (
                        <option key={p.id_proyecto} value={p.id_proyecto}>{p.nombre_proyecto}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1.5">Área del Terreno (m²)</label>
                    <input type="number" step="0.01" required value={newLevantamiento.area_terreno} onChange={(e) => setNewLevantamiento({...newLevantamiento, area_terreno: parseFloat(e.target.value)})} className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-sm text-slate-200 focus:outline-none focus:border-emerald-500" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1.5">Coordenadas Técnicas (UTM/GPS)</label>
                    <input type="text" required placeholder="UTM-S Zone 17S..." value={newLevantamiento.coordenadas} onChange={(e) => setNewLevantamiento({...newLevantamiento, coordenadas: e.target.value})} className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-sm text-slate-200 focus:outline-none focus:border-emerald-500" />
                  </div>
                  <div className="md:col-span-3">
                    <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1.5">Observaciones de Campo</label>
                    <textarea rows={2} required value={newLevantamiento.observaciones} onChange={(e) => setNewLevantamiento({...newLevantamiento, observaciones: e.target.value})} className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-sm text-slate-200 focus:outline-none focus:border-emerald-500"></textarea>
                  </div>
                </>
              )}

              {activeTab === 'PLANOS' && (
                <>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1.5">Relacionar con Proyecto</label>
                    <select value={newPlano.id_proyecto} onChange={(e) => setNewPlano({...newPlano, id_proyecto: parseInt(e.target.value)})} className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-sm text-slate-200 focus:outline-none focus:border-emerald-500">
                      {proyectos.map(p => (
                        <option key={p.id_proyecto} value={p.id_proyecto}>{p.nombre_proyecto}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1.5">Tipo de Plano</label>
                    <select value={newPlano.tipo_plano} onChange={(e) => setNewPlano({...newPlano, tipo_plano: e.target.value})} className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-sm text-slate-200 focus:outline-none focus:border-emerald-500">
                      <option value="Arquitectónico">Arquitectónico</option>
                      <option value="Estructural">Estructural</option>
                      <option value="Sanitario">Sanitario</option>
                      <option value="Eléctrico">Eléctrico</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1.5">Versión del Plano</label>
                    <input type="text" required placeholder="v1.0" value={newPlano.version} onChange={(e) => setNewPlano({...newPlano, version: e.target.value})} className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-sm text-slate-200 focus:outline-none focus:border-emerald-500" />
                  </div>
                  <div className="md:col-span-3">
                    <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1.5">Descripción de Planos / Alcance</label>
                    <textarea rows={2} required value={newPlano.descripcion} onChange={(e) => setNewPlano({...newPlano, descripcion: e.target.value})} className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-sm text-slate-200 focus:outline-none focus:border-emerald-500"></textarea>
                  </div>
                </>
              )}

              {activeTab === 'AVALUOS' && (
                <>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1.5">Asociar a Proyecto</label>
                    <select value={newAvaluo.id_proyecto} onChange={(e) => setNewAvaluo({...newAvaluo, id_proyecto: parseInt(e.target.value)})} className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-sm text-slate-200 focus:outline-none focus:border-emerald-500">
                      {proyectos.map(p => (
                        <option key={p.id_proyecto} value={p.id_proyecto}>{p.nombre_proyecto}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1.5">Valor Comercial Asignado (USD)</label>
                    <input type="number" required value={newAvaluo.valor_comercial} onChange={(e) => setNewAvaluo({...newAvaluo, valor_comercial: parseFloat(e.target.value)})} className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-sm text-slate-200 focus:outline-none focus:border-emerald-500" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1.5">Fecha del Avalúo</label>
                    <input type="date" required value={newAvaluo.fecha_avaluo} onChange={(e) => setNewAvaluo({...newAvaluo, fecha_avaluo: e.target.value})} className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-sm text-slate-200 focus:outline-none focus:border-emerald-500" />
                  </div>
                  <div className="md:col-span-3">
                    <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1.5">Observaciones Técnicas de Tasación</label>
                    <textarea rows={2} required value={newAvaluo.observaciones} onChange={(e) => setNewAvaluo({...newAvaluo, observaciones: e.target.value})} className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-sm text-slate-200 focus:outline-none focus:border-emerald-500"></textarea>
                  </div>
                </>
              )}

              {activeTab === 'PERITAJES' && (
                <>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1.5">Asociar a Proyecto</label>
                    <select value={newPeritaje.id_proyecto} onChange={(e) => setNewPeritaje({...newPeritaje, id_proyecto: parseInt(e.target.value)})} className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-sm text-slate-200 focus:outline-none focus:border-emerald-500">
                      {proyectos.map(p => (
                        <option key={p.id_proyecto} value={p.id_proyecto}>{p.nombre_proyecto}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1.5">Tipo de Peritaje</label>
                    <input type="text" required placeholder="Fallas Estructurales, Patología..." value={newPeritaje.tipo_peritaje} onChange={(e) => setNewPeritaje({...newPeritaje, tipo_peritaje: e.target.value})} className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-sm text-slate-200 focus:outline-none focus:border-emerald-500" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1.5">Resultado Técnico</label>
                    <input type="text" required placeholder="Grave / Moderado / Conforme" value={newPeritaje.resultado} onChange={(e) => setNewPeritaje({...newPeritaje, resultado: e.target.value})} className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-sm text-slate-200 focus:outline-none focus:border-emerald-500" />
                  </div>
                  <div className="md:col-span-3">
                    <label className="block text-[10px] font-bold uppercase text-slate-400 mb-1.5">Comentarios y Recomendaciones</label>
                    <textarea rows={2} required value={newPeritaje.observaciones} onChange={(e) => setNewPeritaje({...newPeritaje, observaciones: e.target.value})} className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-sm text-slate-200 focus:outline-none focus:border-emerald-500"></textarea>
                  </div>
                </>
              )}
            </div>

            <div className="flex justify-end gap-3 mt-5 border-t border-slate-800 pt-4">
              <button 
                id="btn-cancel-add"
                type="button" 
                onClick={() => setShowAddForm(false)} 
                className="bg-slate-900 border border-slate-800 hover:bg-slate-850 text-slate-300 text-xs px-4 py-2 rounded-lg cursor-pointer"
              >
                Cancelar
              </button>
              <button 
                id="btn-submit-add"
                type="submit" 
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs px-5 py-2 rounded-lg flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                Registrar Fila
              </button>
            </div>
          </form>
        )}

        {/* Selected Data View Sheets */}
        {activeTab !== 'RELACIONES' ? (
          <div className="border border-slate-800 bg-slate-950 rounded-xl overflow-hidden shadow-inner">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-900 border-b border-slate-800 text-slate-300 uppercase tracking-widest font-mono select-none">
                    <th className="py-3.5 px-4 font-semibold border-r border-slate-800/60 text-emerald-400 w-12 text-center">#</th>
                    
                    {activeTab === 'CLIENTES' && (
                      <>
                        <th className="py-3.5 px-4 font-semibold border-r border-slate-800/60">ID</th>
                        <th className="py-3.5 px-4 font-semibold border-r border-slate-800/60">Nombres Completos</th>
                        <th className="py-3.5 px-4 font-semibold border-r border-slate-800/60">Cédula</th>
                        <th className="py-3.5 px-4 font-semibold border-r border-slate-800/60">Teléfono</th>
                        <th className="py-3.5 px-4 font-semibold border-r border-slate-800/60">Correo Electrónico</th>
                        <th className="py-3.5 px-4 font-semibold border-r border-slate-800/60">Dirección</th>
                      </>
                    )}

                    {activeTab === 'PROYECTOS' && (
                      <>
                        <th className="py-3.5 px-4 font-semibold border-r border-slate-800/60">ID Proyecto</th>
                        <th className="py-3.5 px-4 font-semibold border-r border-slate-800/60">Cliente Enlazado (FK)</th>
                        <th className="py-3.5 px-4 font-semibold border-r border-slate-800/60">Nombre del Proyecto</th>
                        <th className="py-3.5 px-4 font-semibold border-r border-slate-800/60">Tipo de Gestión</th>
                        <th className="py-3.5 px-4 font-semibold border-r border-slate-800/60">Ubicación Física</th>
                        <th className="py-3.5 px-4 font-semibold border-r border-slate-800/60">F. Inicio</th>
                        <th className="py-3.5 px-4 font-semibold border-r border-slate-800/60 text-right">Presupuesto</th>
                        <th className="py-3.5 px-4 font-semibold border-r border-slate-800/60 text-center">Estado</th>
                      </>
                    )}

                    {activeTab === 'LEVANTAMIENTOS' && (
                      <>
                        <th className="py-3.5 px-4 font-semibold border-r border-slate-800/60">ID Lev.</th>
                        <th className="py-3.5 px-4 font-semibold border-r border-slate-800/60">Proyecto Vinculado (FK)</th>
                        <th className="py-3.5 px-4 font-semibold border-r border-slate-800/60">Fecha Realización</th>
                        <th className="py-3.5 px-4 font-semibold border-r border-slate-800/60 text-right">Área Terreno (m²)</th>
                        <th className="py-3.5 px-4 font-semibold border-r border-slate-800/60">Coordenadas Técnicas</th>
                        <th className="py-3.5 px-4 font-semibold border-r border-slate-800/60">Observaciones de Campo</th>
                      </>
                    )}

                    {activeTab === 'PLANOS' && (
                      <>
                        <th className="py-3.5 px-4 font-semibold border-r border-slate-800/60">ID Plano</th>
                        <th className="py-3.5 px-4 font-semibold border-r border-slate-800/60">Proyecto Vinculado (FK)</th>
                        <th className="py-3.5 px-4 font-semibold border-r border-slate-800/60">Tipo del Plano</th>
                        <th className="py-3.5 px-4 font-semibold border-r border-slate-800/60">F. Elaboración</th>
                        <th className="py-3.5 px-4 font-semibold border-r border-slate-800/60 text-center">Versión</th>
                        <th className="py-3.5 px-4 font-semibold border-r border-slate-800/60">Descripción / Detalles</th>
                      </>
                    )}

                    {activeTab === 'AVALUOS' && (
                      <>
                        <th className="py-3.5 px-4 font-semibold border-r border-slate-800/60">ID Avalúo</th>
                        <th className="py-3.5 px-4 font-semibold border-r border-slate-800/60">Proyecto Vinculado (FK)</th>
                        <th className="py-3.5 px-4 font-semibold border-r border-slate-800/60">Fecha Tasación</th>
                        <th className="py-3.5 px-4 font-semibold border-r border-slate-800/60 text-right">Valor Comercial</th>
                        <th className="py-3.5 px-4 font-semibold border-r border-slate-800/60">Método y Observaciones</th>
                      </>
                    )}

                    {activeTab === 'PERITAJES' && (
                      <>
                        <th className="py-3.5 px-4 font-semibold border-r border-slate-800/60">ID Peritaje</th>
                        <th className="py-3.5 px-4 font-semibold border-r border-slate-800/60">Proyecto Vinculado (FK)</th>
                        <th className="py-3.5 px-4 font-semibold border-r border-slate-800/60">Fecha de Inspección</th>
                        <th className="py-3.5 px-4 font-semibold border-r border-slate-800/60">Área Pericial</th>
                        <th className="py-3.5 px-4 font-semibold border-r border-slate-800/60">Dictamen Técnico</th>
                        <th className="py-3.5 px-4 font-semibold border-r border-slate-800/60">Comentarios Detallados</th>
                      </>
                    )}

                    <th className="py-3.5 px-4 font-semibold text-center w-16">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {currentList.length === 0 ? (
                    <tr>
                      <td colSpan={10} className="text-center py-12 text-slate-500 font-mono text-sm">
                        Ningún registro coincide con los filtros de búsqueda actuales.
                      </td>
                    </tr>
                  ) : (
                    currentList.map((row, index) => {
                      const num = index + 1;
                      return (
                        <tr key={index} className="hover:bg-slate-900/40 transition-colors text-slate-300 font-mono text-[11px] md:text-xs">
                          <td className="py-3 px-4 border-r border-slate-800/60 text-center text-slate-500 bg-slate-900/10 font-bold">{num}</td>
                          
                          {activeTab === 'CLIENTES' && (
                            <>
                              <td className="py-3 px-4 border-r border-slate-800/60 text-slate-400 font-bold">{(row as Cliente).id_cliente}</td>
                              <td className="py-3 px-4 border-r border-slate-800/60 text-white font-sans font-medium">{(row as Cliente).nombres} {(row as Cliente).apellidos}</td>
                              <td className="py-3 px-4 border-r border-slate-800/60">{(row as Cliente).cedula}</td>
                              <td className="py-3 px-4 border-r border-slate-800/60 text-slate-400">{(row as Cliente).telefono}</td>
                              <td className="py-3 px-4 border-r border-slate-800/60 text-emerald-400 underline">{(row as Cliente).correo}</td>
                              <td className="py-3 px-4 border-r border-slate-800/60 text-slate-400 font-sans">{(row as Cliente).direccion}</td>
                              <td className="py-3 px-4 text-center">
                                <button onClick={() => handleDeleteRow('id_cliente', (row as Cliente).id_cliente)} className="text-rose-500 hover:text-rose-400 p-1.5 rounded transition hover:bg-rose-500/10 cursor-pointer">
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </td>
                            </>
                          )}

                          {activeTab === 'PROYECTOS' && (
                            <>
                              <td className="py-3 px-4 border-r border-slate-800/60 text-slate-400 font-bold">{(row as Proyecto).id_proyecto}</td>
                              <td className="py-3 px-4 border-r border-slate-800/60 text-slate-300 font-sans">
                                <span className="block font-semibold text-slate-100">{getClienteName((row as Proyecto).id_cliente)}</span>
                                <span className="text-[10px] text-slate-500 font-mono">FK_id_cliente: {(row as Proyecto).id_cliente}</span>
                              </td>
                              <td className="py-3 px-4 border-r border-slate-800/60 text-white font-sans font-medium">{(row as Proyecto).nombre_proyecto}</td>
                              <td className="py-3 px-4 border-r border-slate-800/60">
                                <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 border border-slate-700 text-slate-300">
                                  {(row as Proyecto).tipo_proyecto}
                                </span>
                              </td>
                              <td className="py-3 px-4 border-r border-slate-800/60 text-slate-400 font-sans">{(row as Proyecto).ubicacion}</td>
                              <td className="py-3 px-4 border-r border-slate-800/60 text-slate-400">{(row as Proyecto).fecha_inicio}</td>
                              <td className="py-3 px-4 border-r border-slate-800/60 text-right text-emerald-400 font-semibold">{formatCurrency((row as Proyecto).presupuesto)}</td>
                              <td className="py-3 px-4 border-r border-slate-800/60 text-center">
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wide ${
                                  (row as Proyecto).estado === 'Completado' ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20' :
                                  (row as Proyecto).estado === 'Construcción' ? 'bg-amber-500/15 text-amber-400 border border-amber-500/20' :
                                  (row as Proyecto).estado === 'En Diseño' ? 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/20' :
                                  'bg-slate-800 text-slate-400 border border-slate-750'
                                }`}>
                                  {(row as Proyecto).estado}
                                </span>
                              </td>
                              <td className="py-3 px-4 text-center">
                                <button onClick={() => handleDeleteRow('id_proyecto', (row as Proyecto).id_proyecto)} className="text-rose-500 hover:text-rose-400 p-1.5 rounded transition hover:bg-rose-500/10 cursor-pointer">
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </td>
                            </>
                          )}

                          {activeTab === 'LEVANTAMIENTOS' && (
                            <>
                              <td className="py-3 px-4 border-r border-slate-800/60 text-slate-400 font-bold">{(row as LevantamientoTopografico).id_levantamiento}</td>
                              <td className="py-3 px-4 border-r border-slate-800/60 font-sans">
                                <span className="block font-semibold text-slate-100">{getProyectoName((row as LevantamientoTopografico).id_proyecto)}</span>
                                <span className="text-[10px] text-slate-500 font-mono">FK_id_proyecto: {(row as LevantamientoTopografico).id_proyecto}</span>
                              </td>
                              <td className="py-3 px-4 border-r border-slate-800/60 text-slate-400">{(row as LevantamientoTopografico).fecha_levantamiento}</td>
                              <td className="py-3 px-4 border-r border-slate-800/60 text-right text-emerald-400 font-semibold">{(row as LevantamientoTopografico).area_terreno.toFixed(2)} m²</td>
                              <td className="py-3 px-4 border-r border-slate-800/60 text-purple-400">{(row as LevantamientoTopografico).coordenadas}</td>
                              <td className="py-3 px-4 border-r border-slate-800/60 text-slate-400 font-sans">{(row as LevantamientoTopografico).observaciones}</td>
                              <td className="py-3 px-4 text-center">
                                <button onClick={() => handleDeleteRow('id_levantamiento', (row as LevantamientoTopografico).id_levantamiento)} className="text-rose-500 hover:text-rose-400 p-1.5 rounded transition hover:bg-rose-500/10 cursor-pointer">
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </td>
                            </>
                          )}

                          {activeTab === 'PLANOS' && (
                            <>
                              <td className="py-3 px-4 border-r border-slate-800/60 text-slate-400 font-bold">{(row as PlanoArquitectonico).id_plano}</td>
                              <td className="py-3 px-4 border-r border-slate-800/60 font-sans">
                                <span className="block font-semibold text-slate-100">{getProyectoName((row as PlanoArquitectonico).id_proyecto)}</span>
                                <span className="text-[10px] text-slate-500 font-mono">FK_id_proyecto: {(row as PlanoArquitectonico).id_proyecto}</span>
                              </td>
                              <td className="py-3 px-4 border-r border-slate-800/60 font-semibold text-white">{(row as PlanoArquitectonico).tipo_plano}</td>
                              <td className="py-3 px-4 border-r border-slate-800/60 text-slate-400">{(row as PlanoArquitectonico).fecha_elaboracion}</td>
                              <td className="py-3 px-4 border-r border-slate-800/60 text-center text-blue-400 font-bold">{(row as PlanoArquitectonico).version}</td>
                              <td className="py-3 px-4 border-r border-slate-800/60 text-slate-400 font-sans">{(row as PlanoArquitectonico).descripcion}</td>
                              <td className="py-3 px-4 text-center">
                                <button onClick={() => handleDeleteRow('id_plano', (row as PlanoArquitectonico).id_plano)} className="text-rose-500 hover:text-rose-400 p-1.5 rounded transition hover:bg-rose-500/10 cursor-pointer">
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </td>
                            </>
                          )}

                          {activeTab === 'AVALUOS' && (
                            <>
                              <td className="py-3 px-4 border-r border-slate-800/60 text-slate-400 font-bold">{(row as Avaluo).id_avaluo}</td>
                              <td className="py-3 px-4 border-r border-slate-800/60 font-sans">
                                <span className="block font-semibold text-slate-100">{getProyectoName((row as Avaluo).id_proyecto)}</span>
                                <span className="text-[10px] text-slate-500 font-mono">FK_id_proyecto: {(row as Avaluo).id_proyecto}</span>
                              </td>
                              <td className="py-3 px-4 border-r border-slate-800/60 text-slate-400">{(row as Avaluo).fecha_avaluo}</td>
                              <td className="py-3 px-4 border-r border-slate-800/60 text-right text-emerald-400 font-bold">{formatCurrency((row as Avaluo).valor_comercial)}</td>
                              <td className="py-3 px-4 border-r border-slate-800/60 text-slate-400 font-sans">{(row as Avaluo).observaciones}</td>
                              <td className="py-3 px-4 text-center">
                                <button onClick={() => handleDeleteRow('id_avaluo', (row as Avaluo).id_avaluo)} className="text-rose-500 hover:text-rose-400 p-1.5 rounded transition hover:bg-rose-500/10 cursor-pointer">
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </td>
                            </>
                          )}

                          {activeTab === 'PERITAJES' && (
                            <>
                              <td className="py-3 px-4 border-r border-slate-800/60 text-slate-400 font-bold">{(row as Peritaje).id_peritaje}</td>
                              <td className="py-3 px-4 border-r border-slate-800/60 font-sans">
                                <span className="block font-semibold text-slate-100">{getProyectoName((row as Peritaje).id_proyecto)}</span>
                                <span className="text-[10px] text-slate-500 font-mono">FK_id_proyecto: {(row as Peritaje).id_proyecto}</span>
                              </td>
                              <td className="py-3 px-4 border-r border-slate-800/60 text-slate-400">{(row as Peritaje).fecha_peritaje}</td>
                              <td className="py-3 px-4 border-r border-slate-800/60 text-white font-sans">{(row as Peritaje).tipo_peritaje}</td>
                              <td className="py-3 px-4 border-r border-slate-800/60 text-amber-400 font-bold">{(row as Peritaje).resultado}</td>
                              <td className="py-3 px-4 border-r border-slate-800/60 text-slate-400 font-sans">{(row as Peritaje).observaciones}</td>
                              <td className="py-3 px-4 text-center">
                                <button onClick={() => handleDeleteRow('id_peritaje', (row as Peritaje).id_peritaje)} className="text-rose-500 hover:text-rose-400 p-1.5 rounded transition hover:bg-rose-500/10 cursor-pointer">
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </td>
                            </>
                          )}
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
            
            {/* Table Footer Stats counts */}
            <div className="bg-slate-900 border-t border-slate-800 px-4 py-3 text-[10px] font-mono text-slate-400 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 select-none">
              <div>
                Mostrando <span className="text-white font-bold">{currentList.length}</span> registros de un total de <span className="text-white font-bold">{
                  activeTab === 'CLIENTES' ? clientes.length :
                  activeTab === 'PROYECTOS' ? proyectos.length :
                  activeTab === 'LEVANTAMIENTOS' ? levantamientos.length :
                  activeTab === 'PLANOS' ? planos.length :
                  activeTab === 'AVALUOS' ? avaluos.length :
                  peritajes.length
                }</span> en HOJA_{activeTab}
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Base de Datos de Excel Activa y Conectada</span>
              </div>
            </div>
          </div>
        ) : (
          /* Relationships & Interactive playground */
          <div className="bg-slate-950 border border-slate-800 p-6 rounded-2xl">
            <h4 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
              <ArrowRightLeft className="w-5 h-5 text-emerald-400" />
              Arquitectura Relacional y Flujo de Datos
            </h4>
            <p className="text-sm text-slate-400 mb-6">
              El sistema de la <span className="text-white font-bold">Arq. Ana Villarreal</span> opera bajo un esquema relacional estructurado. Esto garantiza que ningún diseño nazca sin un terreno levantado, y ningún avalúo o plano exista de forma huérfana en el aire.
            </p>

            {/* Visual Relation Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <div className="bg-slate-900/40 p-4 rounded-xl border border-slate-800 hover:border-emerald-500/20 transition-all">
                <div className="font-mono text-emerald-400 text-xs font-semibold mb-2">Entidad Raíz</div>
                <h5 className="font-bold text-white text-base mb-1">CLIENTES</h5>
                <p className="text-xs text-slate-450 leading-relaxed mb-3">
                  Almacena los datos del propietario del patrimonio (cédula, domicilio, contacto).
                </p>
                <div className="bg-slate-950 px-3 py-1.5 rounded text-[10px] font-mono text-slate-500 border border-slate-850">
                  Relación primordial: <span className="text-white">1 a N</span> con PROYECTOS
                </div>
              </div>

              <div className="bg-slate-900/40 p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/[0.01]">
                <div className="font-mono text-emerald-400 text-xs font-semibold mb-2">Eje Centralizador</div>
                <h5 className="font-bold text-white text-base mb-1">PROYECTOS</h5>
                <p className="text-xs text-slate-450 leading-relaxed mb-3">
                  Consolida la información del alcance comercial, presupuesto financiero y estado de obra.
                </p>
                <div className="bg-slate-950 px-3 py-1.5 rounded text-[10px] font-mono text-slate-500 border border-slate-850">
                  Integra claves foráneas (FK_id_cliente)
                </div>
              </div>

              <div className="bg-slate-900/40 p-4 rounded-xl border border-slate-800 hover:border-emerald-500/20 transition-all">
                <div className="font-mono text-emerald-400 text-xs font-semibold mb-2">Entidades Satélite</div>
                <h5 className="font-bold text-white text-base mb-1">Hojas Técnicas</h5>
                <p className="text-xs text-slate-450 leading-relaxed mb-3">
                  Informes complementarios que validan técnicamente cada paso del proyecto.
                </p>
                <div className="bg-slate-950 px-3 py-1.5 rounded text-[10px] font-mono text-slate-500 border border-slate-850">
                  Includes: Topografía, Planos, Avalúos, Peritajes
                </div>
              </div>
            </div>

            {/* Excel Manual Simulation */}
            <div className="bg-emerald-950/20 border border-emerald-500/20 p-5 rounded-xl flex flex-col md:flex-row items-center justify-between gap-6 pointer">
              <div className="flex items-start gap-4">
                <div className="bg-emerald-500/10 text-emerald-400 p-3 rounded-lg border border-emerald-500/30 shrink-0">
                  <Info className="w-5 h-5" />
                </div>
                <div>
                  <h5 className="font-bold text-white text-sm mb-1">¿Cómo estructuramos tu proyecto en este Excel?</h5>
                  <p className="text-xs text-slate-400 leading-relaxed max-w-xl">
                    Cada vez que solicitas un servicio para tu hogar, insertamos tu ficha en <span className="text-white">CLIENTES</span>, enlazamos tu obra en <span className="text-white">PROYECTOS</span>, y registramos los planos correspondientes en <span className="text-white">PLANOS_ARQUITECTONICOS</span>. Al exportar, recibes estos datos 100% organizados y listos para los trámites gubernamentales o municipales.
                  </p>
                </div>
              </div>
              <button
                id="btn-excel-playground-download"
                onClick={handleExportExcel}
                className="bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white text-xs font-bold px-5 py-3 rounded-xl border border-emerald-500/30 transition-all whitespace-nowrap flex items-center justify-center gap-2 cursor-pointer"
                disabled={isExporting}
              >
                {isExporting ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Procesando...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    Descargar Hojas en CSV (Excel)
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Notifications Toast */}
      {notification && (
        <div id="toast-notification" className="fixed bottom-6 right-6 bg-emerald-600 text-white px-5 py-3 rounded-xl border border-emerald-500 shadow-xl flex items-center gap-2 animate-bounce z-50 text-xs sm:text-sm font-semibold font-sans">
          <Check className="w-4 h-4" />
          {notification}
        </div>
      )}
    </div>
  );
}
