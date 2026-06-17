import { useState } from 'react';
import { 
  ArrowUpRight, 
  ChevronRight, 
  Sparkles, 
  CheckCircle2, 
  Layers, 
  ShieldCheck, 
  HelpCircle, 
  Award, 
  PhoneCall, 
  FileSpreadsheet, 
  MapPin, 
  Check, 
  User, 
  ChevronDown, 
  Maximize2,
  Calendar,
  Layers3,
  TrendingUp,
  FileCheck2,
  Users
} from 'lucide-react';
import { Cliente, Proyecto, LevantamientoTopografico, PlanoArquitectonico, Avaluo, Peritaje } from './types';
import { initialClientes, initialProyectos, initialLevantamientos, initialPlanos, initialAvaluos, initialPeritajes } from './data';
import LeadModal from './components/LeadModal';
import SpreadsheetSystem from './components/SpreadsheetSystem';

export default function App() {
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeFAQ, setActiveFAQ] = useState<number | null>(null);

  // Database States (lifted up for bidirectional synchronization)
  const [clientes, setClientes] = useState<Cliente[]>(initialClientes);
  const [proyectos, setProyectos] = useState<Proyecto[]>(initialProyectos);
  const [levantamientos, setLevantamientos] = useState<LevantamientoTopografico[]>(initialLevantamientos);
  const [planos, setPlanos] = useState<PlanoArquitectonico[]>(initialPlanos);
  const [avaluos, setAvaluos] = useState<Avaluo[]>(initialAvaluos);
  const [peritajes, setPeritajes] = useState<Peritaje[]>(initialPeritajes);

  // Success toast/message state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Callback when a user books a free consultation in the form.
  // Inserts a synchronized record dynamically in our mock Excel database!
  const handleNewLeadSubmitted = (
    nombres: string,
    apellidos: string,
    tipoProyecto: string,
    area: number,
    ubicacion: string,
    telefono: string,
    correo: string
  ) => {
    // 1. Add Cliente
    const nextClienteId = clientes.length > 0 ? Math.max(...clientes.map(c => c.id_cliente)) + 1 : 1;
    const newCli: Cliente = {
      id_cliente: nextClienteId,
      nombres,
      apellidos,
      cedula: "170" + Math.floor(1000000 + Math.random() * 9000000), // Mock cedula
      telefono,
      correo,
      direccion: ubicacion
    };
    
    // 2. Add Proyecto
    const nextProyectoId = proyectos.length > 0 ? Math.max(...proyectos.map(p => p.id_proyecto)) + 1 : 101;
    const cleanTipo = tipoProyecto.includes("Topográfico") ? "Topografía" : 
                      tipoProyecto.includes("Plano") ? "Residencial" :
                      tipoProyecto.includes("Avalúo") ? "Avalúo" : "Peritaje";
    const newProj: Proyecto = {
      id_proyecto: nextProyectoId,
      id_cliente: nextClienteId,
      nombre_proyecto: `Proyecto de ${nombres} (${cleanTipo})`,
      tipo_proyecto: cleanTipo,
      ubicacion,
      fecha_inicio: new Date().toISOString().split('T')[0],
      presupuesto: cleanTipo === 'Topografía' ? 2400 : cleanTipo === 'Residencial' ? 45000 : cleanTipo === 'Avalúo' ? 1200 : 2500,
      estado: "En Diagnóstico"
    };

    setClientes(prev => [...prev, newCli]);
    setProyectos(prev => [...prev, newProj]);

    // 3. Add technical sub-sheet rows depending on type
    if (cleanTipo === 'Topografía') {
      const nextId = levantamientos.length > 0 ? Math.max(...levantamientos.map(l => l.id_levantamiento)) + 1 : 201;
      const newLev: LevantamientoTopografico = {
        id_levantamiento: nextId,
        id_proyecto: nextProyectoId,
        fecha_levantamiento: new Date().toISOString().split('T')[0],
        area_terreno: area,
        coordenadas: "UTM-S Zone 17S (78" + Math.floor(1000 + Math.random() * 8999) + "m E)",
        observaciones: "Entrada automática de consulta web. Terreno con área estimada de " + area + "m² en " + ubicacion + "."
      };
      setLevantamientos(prev => [...prev, newLev]);
    } else if (cleanTipo === 'Residencial') {
      const nextId = planos.length > 0 ? Math.max(...planos.map(p => p.id_plano)) + 1 : 301;
      const newPla: PlanoArquitectonico = {
        id_plano: nextId,
        id_proyecto: nextProyectoId,
        tipo_plano: "Arquitectónico",
        fecha_elaboracion: new Date().toISOString().split('T')[0],
        version: "v1.0 (Preliminar)",
        descripcion: "Layout arquitectónico de base diseñado automáticamente para la consulta gratuita de m² estimulados."
      };
      setPlanos(prev => [...prev, newPla]);
    } else if (cleanTipo === 'Avalúo') {
      const nextId = avaluos.length > 0 ? Math.max(...avaluos.map(a => a.id_avaluo)) + 1 : 401;
      const newVal: Avaluo = {
        id_avaluo: nextId,
        id_proyecto: nextProyectoId,
        fecha_avaluo: new Date().toISOString().split('T')[0],
        valor_comercial: area * 650, // mock calculation
        observaciones: "Solicitud de avalúo vía landing page. Ubicación del predio aportada: " + ubicacion + "."
      };
      setAvaluos(prev => [...prev, newVal]);
    } else {
      const nextId = peritajes.length > 0 ? Math.max(...peritajes.map(p => p.id_peritaje)) + 1 : 501;
      const newPer: Peritaje = {
        id_peritaje: nextId,
        id_proyecto: nextProyectoId,
        fecha_peritaje: new Date().toISOString().split('T')[0],
        tipo_peritaje: "Patología Estructural",
        resultado: "Pendiente Inspección",
        observaciones: "Peritaje solicitado por directiva de tráfico directo. Requiere visita de la Arq. Ana para determinar origen del daño."
      };
      setPeritajes(prev => [...prev, newPer]);
    }

    triggerToast(`🎉 ¡Enhorabuena, ${nombres}! Tus datos reales se han sincronizado con éxito. Revisa el Sistema de Base de Datos al final de la página.`);
  };

  const faqs = [
    {
      q: "¿Puedo contratar solo el diseño sin la construcción?",
      a: "Sí, absolutamente. Nuestros servicios son modulares. Puedes contratar únicamente el levantamiento topográfico, solo el diseño arquitectónico, solo el avalúo, o cualquier combinación. No estás obligado a contratar la obra completa para acceder al diseño profesional. Muchos clientes nos contratan para el diseño y luego construyen con su propio contratista de confianza, llevando nuestros planos como guía técnica."
    },
    {
      q: "¿Cuánto tiempo tarda el diseño de planos?",
      a: "Depende de la complejidad y el plan contratado. Un proyecto residencial de escala media (entre 80 y 200 m²) tiene generalmente un tiempo de diseño de 3 a 6 semanas desde la aprobación del levantamiento topográfico. Proyectos más complejos o con múltiples plantas pueden requerir más tiempo. Al inicio del proyecto, te entregamos un cronograma claro con fechas estimadas de cada entrega."
    },
    {
      q: "¿Los planos son válidos para trámites municipales?",
      a: "Sí. Todos nuestros planos llevan firma y sello de profesional habilitado, lo que los hace válidos para aprobación municipal, obtención de permisos de construcción, trámites de crédito hipotecario y otros procesos legales o institucionales que requieran documentación técnica certificada."
    },
    {
      q: "¿Trabajan en todo el país o solo en una ciudad?",
      a: "Atendemos proyectos a nivel nacional. Para proyectos en otras ciudades, coordinamos el levantamiento topográfico con profesionales locales de confianza y el diseño se desarrolla de forma remota con reuniones virtuales periódicas. Los planos y documentación se entregan en formato digital y, si se requiere, en formato impreso con servicio de mensajería."
    },
    {
      q: "¿Puedo hacer cambios al diseño después de que empiece el proceso?",
      a: "Dentro del alcance contratado, sí — para eso está la fase de revisión con visualización 3D, precisamente para que puedas celebrar y ajustar antes de que el diseño sea definitivo. Cambios sustanciales que impliquen un nuevo desarrollo del proyecto se cotizan como adición al alcance original. Siempre te informamos antes de hacer algo que genere un costo adicional."
    },
    {
      q: "¿Qué necesito tener listo para empezar?",
      a: "El mínimo para iniciar es: título de propiedad del terreno o escritura del inmueble, acceso al sitio para el levantamiento topográfico (si aplica) y claridad básica sobre el tipo de proyecto (nueva construcción, remodelación, ampliación). No necesitas tener todo definido desde el inicio — para eso está nuestra consulta inicial, donde te orientamos sobre lo que necesitas según tu situación específica."
    },
    {
      q: "¿Qué pasa si el proyecto no resulta como esperaba?",
      a: "Nuestra garantía de calidad cubre revisiones y ajustes dentro del alcance contratado. Si el diseño entregado no cumple los requerimientos documentados al inicio del proyecto, hacemos las correcciones sin costo adicional. Trabajamos con un proceso de aprobaciones por etapas precisamente para evitar llegar al final con sorpresas: tú apruebas en cada hito antes de continuar al siguiente."
    }
  ];

  return (
    <div className="bg-slate-950 font-sans min-h-screen text-slate-200 antialiased selection:bg-amber-400 selection:text-slate-900">
      
      {/* Dynamic Nav Header */}
      <header className="fixed top-0 inset-x-0 bg-slate-950/80 backdrop-blur-md z-40 border-b border-slate-900/60 transition-all duration-350">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-tr from-amber-500 to-amber-600 rounded-lg flex items-center justify-center font-bold text-slate-950 shadow-md shadow-amber-500/10">
              AV
            </div>
            <div>
              <span className="text-sm font-bold text-white tracking-widest uppercase block">Ana Villarreal</span>
              <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider block">Estudio de Arquitectura</span>
            </div>
          </div>
          
          <nav className="hidden lg:flex items-center gap-8">
            <a href="#problema-seccion" className="text-xs font-semibold text-slate-400 hover:text-white transition duration-200">El Problema</a>
            <a href="#solucion-seccion" className="text-xs font-semibold text-slate-400 hover:text-white transition duration-200">Nuestros Servicios</a>
            <a href="#beneficios-seccion" className="text-xs font-semibold text-slate-400 hover:text-white transition duration-200">Beneficios</a>
            <a href="#proceso-seccion" className="text-xs font-semibold text-slate-400 hover:text-white transition duration-200">Cómo Funciona</a>
            <a href="#precios-seccion" className="text-xs font-semibold text-slate-400 hover:text-white transition duration-200">Inversión</a>
            <a href="#workbook-section" className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition duration-200 flex items-center gap-1.5 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
              <FileSpreadsheet className="w-3.5 h-3.5" />
              Ver Base de Datos
            </a>
          </nav>

          <div>
            <a 
              id="nav-cta-button"
              href="https://wa.me/593982609956?text=Hola%20Ana%20Villarreal,%20me%20gustar%C3%ADa%20agendar%20una%20Consulta%20Gratuita%20para%20mi%20proyecto."
              target="_blank"
              rel="noopener noreferrer"
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs px-5 py-3 rounded-xl tracking-wider hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer shadow-lg shadow-amber-950/20 inline-block text-center animate-pulse-scale-mobile"
            >
              Consulta Gratuita
            </a>
          </div>
        </div>
      </header>

      {/* Main Page Content */}
      <main className="pt-20">

        {/* SECTION 1: HERO SECTION - DARK THEME BACKGROUND */}
        <section id="hero-seccion" className="relative bg-slate-950 pt-20 pb-28 md:py-36 overflow-hidden flex items-center">
          
          {/* Subtle architectural overlay background */}
          <div className="absolute inset-0 z-0">
            <img 
              src="/src/assets/images/modern_house_hero_1781677771635.jpg" 
              alt="Casa Moderna Diseñada por Ana Villarreal" 
              className="w-full h-full object-cover object-center opacity-25 filter grayscale brightness-50"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/90 to-transparent"></div>
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(245,158,11,0.05)_0%,transparent_70%)]"></div>
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            
            {/* Elegant upper flag */}
            <div className="inline-flex items-center gap-2 bg-slate-900/90 border border-slate-850 px-4 py-2 rounded-full mb-6 animate-fadeIn">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-slate-200">
                Arq. Ana Villarreal | Diseño Arquitectónico Profesional
              </span>
            </div>

            {/* Headline Principal */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight max-w-5xl mx-auto tracking-tight select-none">
              Tu Casa Soñada Ya Existe... <br />
              <span className="text-gradient font-bold">Solo Falta Llevarla al Papel</span> y Luego a la Realidad
            </h1>

            {/* Subheadline Layout */}
            <p className="mt-8 text-sm sm:text-lg text-slate-450 leading-relaxed max-w-3xl mx-auto font-light">
              Diseñamos, planificamos y construimos el espacio que siempre imaginaste — con planos profesionales, materiales que duran décadas y un acompañamiento completo de principio a fin. Desde el primer boceto hasta el día en que cruzas la puerta de tu nuevo hogar.
            </p>

            {/* Primary Action Zone */}
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                id="hero-primary-cta"
                onClick={() => setIsModalOpen(true)}
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm uppercase tracking-widest px-8 py-4.5 rounded-2xl w-full sm:w-auto shadow-xl shadow-amber-950/30 transition-all duration-200 hover:scale-[1.03] active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2"
              >
                Agendar Consulta Gratuita
                <ArrowUpRight className="w-5 h-5 font-bold" />
              </button>

              <a
                href="#solucion-seccion"
                className="text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-white px-8 py-3.5 border border-slate-800 hover:border-slate-700 rounded-2xl w-full sm:w-auto transition-all text-center"
              >
                Explorar Servicios
              </a>
            </div>

            {/* Features trust badges snippet */}
            <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto border-t border-slate-900 pt-8 text-left">
              <div>
                <span className="text-xs font-semibold text-slate-500 block">Levantamiento</span>
                <span className="text-sm font-bold text-white block">100% Topográfico Real</span>
              </div>
              <div>
                <span className="text-xs font-semibold text-slate-500 block">Planos Certificados</span>
                <span className="text-sm font-bold text-white block">Aprobación Municipal Garantizada</span>
              </div>
              <div>
                <span className="text-xs font-semibold text-slate-500 block">Visualización</span>
                <span className="text-sm font-bold text-white block">Interacciones 3D Reales</span>
              </div>
              <div>
                <span className="text-xs font-semibold text-slate-500 block">Tasación y Peritaje</span>
                <span className="text-sm font-bold text-white block">Avalado Firmado Colegiado</span>
              </div>
            </div>

          </div>
        </section>


        {/* SECTION 2: THE PROBLEM (INDUCCIÓN - EL PROBLEMA) - LIGHT THEME BACKGROUND FOR TRANSITION */}
        <section id="problema-seccion" className="bg-slate-50 py-24 text-slate-900 border-y border-slate-200 transition-colors duration-300">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            
            <div className="text-center mb-12">
              <span className="text-[10px] font-bold uppercase tracking-widest text-amber-600 block mb-2">Diagnóstico Inmobiliario</span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-950 tracking-tight">
                ¿Te reconoces en alguna de estas situaciones?
              </h2>
            </div>

            {/* Editorial styled text wrapper */}
            <div className="prose prose-slate max-w-none text-slate-720 text-sm sm:text-base leading-relaxed space-y-6 font-medium">
              <p>
                Llevas meses — quizás años — con esa imagen en la cabeza. La sala amplia con luz natural. La cocina abierta donde reunirte con tu familia. El estudio tranquilo que siempre quisiste. El jardín que tus hijos puedan disfrutar.
              </p>
              
              <p className="font-semibold text-slate-900 italic border-l-4 border-amber-500 pl-4">
                Pero cada vez que intentas dar el primer paso, aparece el mismo muro:
              </p>

              <div className="space-y-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-premium">
                <div className="flex gap-3">
                  <span className="text-amber-500 font-bold shrink-0">✕</span>
                  <p className="m-0 text-slate-800">
                    <strong>No sabes por dónde empezar.</strong> Los precios que te dan parecen salidos de la nada, sin explicación técnica objetiva.
                  </p>
                </div>
                <div className="flex gap-3">
                  <span className="text-amber-500 font-bold shrink-0">✕</span>
                  <p className="m-0 text-slate-800">
                    El arquitecto que contactaste tardó semanas en responderte, y cuando lo hizo, el presupuesto no incluía ni la mitad de lo que realmente necesitabas para construir de verdad.
                  </p>
                </div>
                <div className="flex gap-3">
                  <span className="text-amber-500 font-bold shrink-0">✕</span>
                  <p className="m-0 text-slate-800">
                    El contratista te prometió el cielo, pero entregó algo completamente diferente a lo acordado en los planos originales.
                  </p>
                </div>
              </div>

              <p>
                Y lo peor: sientes que cada persona que contratas trabaja en su propio mundo de forma fragmentada. El diseñador no habla con el ingeniero estructural. El ingeniero no coordinó con el topógrafo. Nadie tiene una visión de conjunto coherente... y tú terminas pagando de tu bolsillo los costosos errores de esa descoordinación técnica.
              </p>

              {/* The Resulting impact block */}
              <div className="bg-red-500/[0.04] rounded-2xl border border-red-500/10 p-6">
                <span className="text-red-700 font-bold text-xs uppercase tracking-widest block mb-2">Consecuencias críticas del desorden</span>
                <p className="text-slate-800 font-semibold text-base mb-2">¿El resultado final?</p>
                <p className="text-slate-720 text-sm">
                  Proyectos que se extienden el doble del tiempo estimado. Presupuestos que se inflan de forma descontrolada un 30%, 40% o más. Planos que no se adaptan a la realidad del terreno. Y la amarga frustración de ver que tu sueño se convierte, lentamente, en una tormentosa fuente de estrés, conflictos de obra y gastos imprevistos.
                </p>
              </div>

              <p className="text-slate-900 font-bold text-center mt-10">
                No es tu culpa. El sector de la construcción y el diseño está lleno de procesos fragmentados, falta de comunicación y propuestas genéricas que no contemplan tus necesidades. Pero eso cambia hoy.
              </p>
            </div>

          </div>
        </section>


        {/* SECTION 3: STORY SECTION (HISTORIA Y CONEXIÓN EMOCIONAL) - WARM MID-DARK THEME */}
        <section className="bg-slate-900 py-24 text-slate-100 border-b border-slate-850">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-500 block mb-2">Una historia real de cambio</span>
            <h2 className="text-2xl sm:text-3.5xl font-extrabold text-white tracking-tight leading-tight mb-8">
              Una historia que quizás ya conoces de cerca...
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-1 gap-8 text-slate-300 text-sm sm:text-base leading-relaxed space-y-4">
              <p>
                Margarita tenía todo perfectamente planeado. Había ahorrado rigurosamente durante seis años. Había recortado imágenes inspiradoras de revistas especializadas. Tenía carpetas enteras en su teléfono con ideas minuciosas de cada habitación. Y cuando finalmente contrató a alguien para que le hiciera &quot;los planos rápidos de obra&quot;, creyó de buena fe que estaba a solo unas semanas de empezar su nueva vida.
              </p>
              <p>
                Lo que nadie le advirtió de antemano es que esos planos exprés no estaban adaptados en absoluto a las medidas reales de su terreno. Que la distribución de las habitaciones no aprovechaba la orientación bioclimática del sol. Que las paredes calculadas no tenían el refuerzo estructural correcto requerido para las características de suelo de su linde.
              </p>
              <p className="font-semibold text-amber-400">
                El proyecto entero tuvo que rehacerse drásticamente desde cero — con otro profesional técnico, otro costo duplicado y otros seis largos meses de penoso retraso.
              </p>
              <p>
                Cuando Margarita llegó por primera vez a nuestra consulta en el estudio, estaba al borde del agotamiento emocional y financiero. No quería escuchar más promesas vacías corporativas. Solo quería que alguien le dijera, con absoluta honestidad técnica y con respaldo real, si su casa era físicamente posible.
              </p>
              <p className="text-white font-bold text-lg border-l-4 border-amber-500 pl-4 py-1">
                Y lo era.
              </p>
              <p>
                Esa historia no es un caso aislado. La escuchamos de boca de nuestros clientes cada semana. Y fue precisamente por historias de desamparo técnico como esa que la Arq. Ana Villarreal decidió fundar un estudio integrado donde la visión técnica estricta y la sensibilidad humana van de la mano — porque detrás de cada metro cuadrado calculado hay una familia, un esfuerzo y años de ahorro constructivo que merecen un profundo respeto.
              </p>
            </div>
          </div>
        </section>


        {/* SECTION 4: THE SOLUTION - SLATE TEAL HIGH CONTRAST DARK BACKGROUND */}
        <section id="solucion-seccion" className="bg-slate-950 py-24 text-slate-100 relative">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(245,158,11,0.03)_0%,transparent_50%)]"></div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-xs font-bold uppercase tracking-widest text-amber-500 block mb-2">Presentamos el Servicio Integral</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Estudio Profesional de la Arq. Ana Villarreal
              </h2>
              <p className="mt-4 text-slate-450 text-sm sm:text-base leading-relaxed">
                Levantamientos Topográficos · Diseño de Planos Arquitectónicos y Estructurales · Peritajes y Avalúos de Bienes Muebles e Inmuebles
              </p>
            </div>

            {/* Holistic Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-16">
              <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl">
                <span className="text-emerald-400 font-mono text-xs uppercase tracking-widest block mb-2">Unificación técnica</span>
                <h4 className="text-xl font-bold text-white mb-3">Sin Coordinaciones Fragmentadas</h4>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Un ecosistema completo de servicios profesionales de ingeniería y arquitectura integrado bajo un mismo sello, diseñado meticulosamente para que no tengas que coordinar a diez personas distintas, negociar retrasos entre gremios o descubrir catastróficos errores de compatibilidad cuando ya hay cemento vertido en la obra.
                </p>
              </div>

              <div className="bg-slate-900 border border-slate-800 p-8 rounded-2xl">
                <span className="text-emerald-400 font-mono text-xs uppercase tracking-widest block mb-2">Eje de control</span>
                <h4 className="text-xl font-bold text-white mb-3">Punto de Contacto Único</h4>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Con nosotros, tienes un solo arquitecto de cabecera técnico de principio a fin, una sola visión estructurada y un equipo de topógrafos, ingenieros calculistas e inspectores trabajando de forma coordinada desde el día uno sobre la misma base de datos.
                </p>
              </div>
            </div>

            <div className="text-center max-w-2xl mx-auto bg-slate-900/60 border border-slate-850 p-6 rounded-2xl">
              <p className="text-slate-200 text-sm sm:text-base font-bold italic">
                &quot;No vendemos planos de plantilla. Diseñamos con rigor el espacio exacto donde vivirás el resto de tu vida.&quot;
              </p>
              <p className="text-xs text-slate-500 mt-2 font-mono">
                — Arq. Ana Villarreal, Fundadora del Estudio Técnico
              </p>
            </div>

          </div>
        </section>


        {/* SECTION 5: BENEFICIOS CLAVE (8 POINTS) - LIGHT BACKGROUND */}
        <section id="beneficios-seccion" className="bg-white py-24 text-slate-900 border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-xs font-bold uppercase tracking-widest text-amber-600 block mb-2">Ventajas Técnicas Tangibles</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight">
                ¿Qué cambia realmente cuando trabajas con nosotros?
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
              
              {/* Benefit 1 */}
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200/80 shadow-premium flex gap-4">
                <div className="bg-amber-100 text-amber-700 w-10 h-10 rounded-xl shrink-0 flex items-center justify-center font-bold text-sm">
                  1
                </div>
                <div>
                  <h4 className="font-bold text-slate-950 text-base mb-1.5">Tomas decisiones con absoluta certeza, no con dudosas suposiciones.</h4>
                  <p className="text-slate-650 text-xs sm:text-sm leading-relaxed">
                    Antes de gastar un solo dólar en materiales o mano de obra constructiva, tienes sobre la mesa una propuesta técnica completa con presupuestos desglosados y firmas municipales hábiles. Sin sorpresas. Sin costos inflados.
                  </p>
                </div>
              </div>

              {/* Benefit 2 */}
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200/80 shadow-premium flex gap-4">
                <div className="bg-amber-100 text-amber-700 w-10 h-10 rounded-xl shrink-0 flex items-center justify-center font-bold text-sm">
                  2
                </div>
                <div>
                  <h4 className="font-bold text-slate-950 text-base mb-1.5">Tu obra nace sobre un terreno real levantado, no sobre hipótesis.</h4>
                  <p className="text-slate-650 text-xs sm:text-sm leading-relaxed">
                    El levantamiento topográfico profesional de precisión milimétrica garantiza que todo el diseño que elaboremos esté 100% alineado con desniveles, servidumbres y características reales de tu suelo. Lo que va al papel se edifica con éxito en la realidad.
                  </p>
                </div>
              </div>

              {/* Benefit 3 */}
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200/80 shadow-premium flex gap-4">
                <div className="bg-amber-100 text-amber-700 w-10 h-10 rounded-xl shrink-0 flex items-center justify-center font-bold text-sm">
                  3
                </div>
                <div>
                  <h4 className="font-bold text-slate-950 text-base mb-1.5">Optimizamos cada metro cuadrado para que rinda al máximo de su capacidad.</h4>
                  <p className="text-slate-650 text-xs sm:text-sm leading-relaxed">
                    Diseñamos con inteligencia espacial vanguardista. Que la cocina fluya hacia las áreas sociales, que las habitaciones tengan absoluta privacidad acústica y que la ventilación reduzca humedades nativas.
                  </p>
                </div>
              </div>

              {/* Benefit 4 */}
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200/80 shadow-premium flex gap-4">
                <div className="bg-amber-100 text-amber-700 w-10 h-10 rounded-xl shrink-0 flex items-center justify-center font-bold text-sm">
                  4
                </div>
                <div>
                  <h4 className="font-bold text-slate-950 text-base mb-1.5">Tu valioso patrimonio constructivo está protegido por ley desde el inicio.</h4>
                  <p className="text-slate-650 text-xs sm:text-sm leading-relaxed">
                    Planos estructurales con firma habilitada, peritajes firmados y avalúos de rigor legal que te amparan ante entidades bancarias, respaldos de préstamos hipotecarios del BIESS / bancos y herencias familiares.
                  </p>
                </div>
              </div>

              {/* Benefit 5 */}
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200/80 shadow-premium flex gap-4">
                <div className="bg-amber-100 text-amber-700 w-10 h-10 rounded-xl shrink-0 flex items-center justify-center font-bold text-sm">
                  5
                </div>
                <div>
                  <h4 className="font-bold text-slate-950 text-base mb-1.5">Construyes con materiales y acabados que durarán generaciones de familias.</h4>
                  <p className="text-slate-650 text-xs sm:text-sm leading-relaxed">
                    Elegimos materiales durables y de bajo mantenimiento, aptos para el clima donde vas a vivir, evitando acabados cosméticos baratos que se arruinan a los pocos años.
                  </p>
                </div>
              </div>

              {/* Benefit 6 */}
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200/80 shadow-premium flex gap-4">
                <div className="bg-amber-100 text-amber-700 w-10 h-10 rounded-xl shrink-0 flex items-center justify-center font-bold text-sm">
                  6
                </div>
                <div>
                  <h4 className="font-bold text-slate-950 text-base mb-1.5">Diseño sostenible que reduce significativamente el consumo a largo plazo.</h4>
                  <p className="text-slate-650 text-xs sm:text-sm leading-relaxed">
                    Priorizamos arquitectura bioclimática pasiva que maximiza luz solar, reduce necesidad de climatizaciones eléctricas artificiales caras y cuida la salud respiratoria familiar.
                  </p>
                </div>
              </div>

              {/* Benefit 7 */}
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200/80 shadow-premium flex gap-4">
                <div className="bg-amber-100 text-amber-700 w-10 h-10 rounded-xl shrink-0 flex items-center justify-center font-bold text-sm">
                  7
                </div>
                <div>
                  <h4 className="font-bold text-slate-950 text-base mb-1.5">Ves, recorres virtualmente y apruebas tu casa en 3D antes de edificarla.</h4>
                  <p className="text-slate-650 text-xs sm:text-sm leading-relaxed">
                    Incluimos renders en alta definición que te permiten ajustar la materialidad de la fachada, el color y dimensiones de vanos antes de iniciar obra. Cero sorpresas de diseño.
                  </p>
                </div>
              </div>

              {/* Benefit 8 */}
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200/80 shadow-premium flex gap-4">
                <div className="bg-amber-100 text-amber-700 w-10 h-10 rounded-xl shrink-0 flex items-center justify-center font-bold text-sm">
                  8
                </div>
                <div>
                  <h4 className="font-bold text-slate-950 text-base mb-1.5">Cuentas con acompañamiento profesional técnico durante el proceso.</h4>
                  <p className="text-slate-650 text-xs sm:text-sm leading-relaxed">
                    La Arq. Ana Villarreal y su equipo de ingeniería están siempre de tu lado, listos para resolver dudas técnicas críticas del constructor para que se cumpla lo proyectado.
                  </p>
                </div>
              </div>

            </div>

          </div>
        </section>


        {/* SECTION 6: CARACTERÍSTICAS PRINCIPALES DE LOS SERVICIOS - DARK BLUE SLATE THEME (DIFF BACKGROUND) */}
        <section className="bg-slate-900 py-24 text-slate-100 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 font-mono block mb-2">Desglose Físico Documental</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                ¿Qué incluye específicamente cada servicio?
              </h2>
              <p className="text-slate-400 text-sm mt-3">
                Entregables técnicos firmados y timbrados listos para su radicación municipal legal.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              
              {/* Item 1 */}
              <div className="bg-slate-950 border border-slate-800 p-6 rounded-2xl shadow-premium">
                <div className="text-xs font-mono text-amber-500 font-bold mb-2 uppercase">Ingeniería Topográfica</div>
                <h4 className="text-lg font-bold text-white mb-3">Levantamiento Topográfico Profesional</h4>
                <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                  Medición precisa del terreno con teodolito y GPS diferencial certificado, elaboración de planos topográficos con curvas de nivel, linderos exactos, servidumbres y generación de informes de catastro.
                </p>
              </div>

              {/* Item 2 */}
              <div className="bg-slate-950 border border-slate-800 p-6 rounded-2xl shadow-premium">
                <div className="text-xs font-mono text-amber-500 font-bold mb-2 uppercase">Diseño Estético y Espacial</div>
                <h4 className="text-lg font-bold text-white mb-3">Diseño de Planos Arquitectónicos</h4>
                <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                  Planta arquitectónica completa, fachadas detalladas, cortes transversales y longitudinales de obra, plantas de techos, especificaciones técnicas de acabados y memoria descriptiva del proyecto.
                </p>
              </div>

              {/* Item 3 */}
              <div className="bg-slate-950 border border-slate-800 p-6 rounded-2xl shadow-premium">
                <div className="text-xs font-mono text-amber-500 font-bold mb-2 uppercase">Seguridad ante Todo</div>
                <h4 className="text-lg font-bold text-white mb-3">Diseño de Planos Estructurales</h4>
                <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                  Cálculo definitivo de cimentación, vigas, columnas, dosificaciones de hormigón y armados de acero de acuerdo con la norma sismorresistente del país con memoria técnica de cálculo.
                </p>
              </div>

              {/* Item 4 */}
              <div className="bg-slate-950 border border-slate-800 p-6 rounded-2xl shadow-premium">
                <div className="text-xs font-mono text-amber-500 font-bold mb-2 uppercase">Riesgo e Intervención</div>
                <h4 className="text-lg font-bold text-white mb-3">Peritajes Técnicos de Edificios</h4>
                <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                  Inspección ocular calificada del estado físico de una edificación existente, identificación de fisuraciones, informes patológicos y dictamen con valor legal o para reclamos de seguros.
                </p>
              </div>

              {/* Item 5 */}
              <div className="bg-slate-950 border border-slate-800 p-6 rounded-2xl shadow-premium">
                <div className="text-xs font-mono text-amber-500 font-bold mb-2 uppercase">Tasación y Bienes</div>
                <h4 className="text-lg font-bold text-white mb-3">Avalúos de Bienes Muebles e Inmuebles</h4>
                <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                  Tasación comercial y catastral con estudio comparativo de mercado inmobiliario local, informe analítico firmado y timbrado para uso crediticio, bancario, corporativo o hereditario.
                </p>
              </div>

              {/* Item 6 */}
              <div className="bg-emerald-950/40 border border-emerald-500/20 p-6 rounded-2xl shadow-premium relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-emerald-500 text-slate-950 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-bl">
                  ¡Gratis en el Diseño!
                </div>
                <div className="text-xs font-mono text-emerald-400 font-bold mb-2 uppercase">Bono Exclusivo Incluido</div>
                <h4 className="text-lg font-bold text-white mb-3">Visualización 3D Fotorrealista</h4>
                <p className="text-slate-350 text-xs sm:text-sm leading-relaxed">
                  Renders de alta fidelidad interior y exterior de tu inmueble. Camina virtualmente por tu sala, cocina y fachada antes de verter un solo metro de cemento, evitando cambios imprevistos costosos.
                </p>
              </div>

            </div>

          </div>
        </section>


        {/* SECTION 7: CÓMO FUNCIONA - INTERACTIVE TIMELINE / STEPS - STEP-BY-STEP (LIGHT WARM GRAY) */}
        <section id="proceso-seccion" className="bg-slate-50 py-24 text-slate-900 border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-xs font-bold uppercase tracking-widest text-amber-600 block mb-2">Metodología Clara</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight">
                El camino de tu idea a tu espacio real, en 5 pasos claros
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 max-w-6xl mx-auto">
              
              {/* Step 1 */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-premium relative">
                <span className="absolute -top-4 left-6 bg-slate-950 text-white w-8 h-8 rounded-full flex items-center justify-center font-mono text-xs font-bold border border-slate-800">
                  01
                </span>
                <h4 className="font-bold text-slate-950 text-sm mb-2 mt-2">Diagnóstico inicial</h4>
                <p className="text-slate-650 text-xs leading-relaxed">
                  Presencial o virtual sin costo. Exploramos tus necesidades espaciales, linderos del lote, presupuesto y plazos.
                </p>
              </div>

              {/* Step 2 */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-premium relative">
                <span className="absolute -top-4 left-6 bg-slate-950 text-white w-8 h-8 rounded-full flex items-center justify-center font-mono text-xs font-bold border border-slate-800">
                  02
                </span>
                <h4 className="font-bold text-slate-950 text-sm mb-2 mt-2">Análisis del terreno</h4>
                <p className="text-slate-650 text-xs leading-relaxed">
                  Realizamos el levantamiento topográfico in situ. Esta medición real del suelo es la base técnica segura de todo el diseño.
                </p>
              </div>

              {/* Step 3 */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-premium relative">
                <span className="absolute -top-4 left-6 bg-slate-950 text-white w-8 h-8 rounded-full flex items-center justify-center font-mono text-xs font-bold border border-slate-800">
                  03
                </span>
                <h4 className="font-bold text-slate-950 text-sm mb-2 mt-2">Diseño y renders 3D</h4>
                <p className="text-slate-650 text-xs leading-relaxed">
                  Elaboramos propuestas. Revisas los planos de planta y el modelado 3D fotorrealista para ajustar materiales y colores.
                </p>
              </div>

              {/* Step 4 */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-premium relative">
                <span className="absolute -top-4 left-6 bg-slate-950 text-white w-8 h-8 rounded-full flex items-center justify-center font-mono text-xs font-bold border border-slate-800">
                  04
                </span>
                <h4 className="font-bold text-slate-950 text-sm mb-2 mt-2">Planos de Ingeniería</h4>
                <p className="text-slate-650 text-xs leading-relaxed">
                  Desarrollamos los rigurosos planos estructurales sismorresistentes y memorias justificativas listas para la aprobación vial.
                </p>
              </div>

              {/* Step 5 */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-premium relative">
                <span className="absolute -top-4 left-6 bg-slate-950 text-white w-8 h-8 rounded-full flex items-center justify-center font-mono text-xs font-bold border border-slate-800">
                  05
                </span>
                <h4 className="font-bold text-slate-950 text-sm mb-2 mt-2">Entrega y Firma</h4>
                <p className="text-slate-650 text-xs leading-relaxed">
                  Entrega impresa y digital de planos visados por profesional colegiado. Listos para verter cimiento y comprar materiales.
                </p>
              </div>

            </div>

          </div>
        </section>


        {/* SECTION 8: LA TRANSFORMACIÓN (ANTES VS DESPUÉS) - CONTRAST SECTION GRID */}
        <section className="bg-slate-900 py-24 text-slate-100">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-xs font-bold uppercase tracking-widest text-amber-500 block mb-2">Transformación de Obra</span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                La diferencia entre el &quot;Antes&quot; y el &quot;Después&quot;
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-slate-955 border border-slate-800 rounded-3xl overflow-hidden p-6 sm:p-10">
              
              {/* Antes card */}
              <div className="bg-slate-950/40 p-6 rounded-2xl border border-red-500/10">
                <div className="flex items-center gap-2 text-rose-500 font-bold uppercase text-xs tracking-wider mb-4 font-mono">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                  Antes de Trabajar con Nosotros
                </div>
                <ul className="space-y-4 text-xs sm:text-sm text-slate-400 leading-relaxed">
                  <li className="flex items-start gap-2.5">
                    <span className="text-rose-500 font-bold">✕</span>
                    Llegabas a reuniones con constructores sin planos unificados, aceptando cualquier presupuesto arbitrario sin entender qué pagabas.
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-rose-500 font-bold">✕</span>
                    Mirabas tu lote baldío y veías un espacio vacío repleto de dudas técnicas, riesgo municipal de multas y desniveles problemáticos.
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-rose-500 font-bold">✕</span>
                    La construcción de tu casa era una pesadilla constante de ansiedad que te consumía los fines de semana, con reclamos al maestro de obra.
                  </li>
                </ul>
              </div>

              {/* Después card */}
              <div className="bg-emerald-950/[0.05] p-6 rounded-2xl border border-emerald-500/20">
                <div className="flex items-center gap-2 text-emerald-400 font-bold uppercase text-xs tracking-wider mb-4 font-mono">
                  <span className="w-2.5 h-2.5 lg:w-3 lg:h-3 rounded-full bg-emerald-500 animate-pulse"></span>
                  Después de Trabajar con Nosotros
                </div>
                <ul className="space-y-4 text-xs sm:text-sm text-slate-350 leading-relaxed">
                  <li className="flex items-start gap-2.5">
                    <span className="text-emerald-400 font-bold">✓</span>
                    Llegas con planos unificados firmados y detallados, especificaciones exactas que obligan legalmente al constructor.
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-emerald-400 font-bold">✓</span>
                    Ves el diseño de tu hogar en 3D superpuesto con el levantamiento topográfico real de precisión, todo encajando perfectamente.
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-emerald-400 font-bold">✓</span>
                    La construcción es un proceso estimulante de ver materializarse algo que ya has vivido virtualmente, con el respaldo técnico resuelto en papel.
                  </li>
                </ul>
              </div>

            </div>

            <div className="text-center mt-12 bg-amber-500/5 p-6 rounded-2xl border border-amber-500/10 max-w-3xl mx-auto">
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Tu casa no es un proyecto de ingeniería civil frío e impersonal. Es el lugar idílico donde tus hijos darán sus primeros pasos. Donde celebrarás las cenas familiares navideñas. Donde albergarás tu futuro. <strong>Merece el mejor punto de partida profesional posible.</strong>
              </p>
            </div>

          </div>
        </section>


        {/* SECTION 9: TESTIMOMIALS */}
        <section id="testimonias-seccion" className="bg-slate-50 py-24 text-slate-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-xs font-bold uppercase tracking-widest text-amber-600 block mb-2">Historias de Éxito</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight">
                Lo que dicen quienes ya construyeron con nosotros
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              
              {/* Testimonial 1 */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-premium flex flex-col justify-between">
                <div>
                  <div className="text-amber-500 text-lg font-bold mb-3">★★★★★</div>
                  <p className="text-slate-650 text-xs sm:text-sm leading-relaxed italic mb-6">
                    &quot;Llevaba dos años con el terreno y sin saber cómo arrancar. Contraté a la Arq. Ana para el levantamiento topográfico y el diseño, y desde el primer día sentí que alguien por fin entendía lo que quería. Los planos estructurales nos ahorraron un problema enorme: el suelo tenía características especiales que el primer 'arquitecto' que contacté nunca hubiera detectado. Hoy tengo mi casa construida, exactamente como la vi en los renders. No cambiaría nada.&quot;
                  </p>
                </div>
                <div className="border-t border-slate-100 pt-4 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center font-bold text-xs text-slate-800">
                    CM
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-900 text-xs">Carlos Mendoza</h5>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Propietario Residencial, Quito</span>
                  </div>
                </div>
              </div>

              {/* Testimonial 2 */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-premium flex flex-col justify-between">
                <div>
                  <div className="text-amber-500 text-lg font-bold mb-3">★★★★★</div>
                  <p className="text-slate-650 text-xs sm:text-sm leading-relaxed italic mb-6">
                    &quot;Necesitaba un avalúo para un proceso hipotecario y en otros estudios me daban informes que el banco devolvía por errores formales. El informe de la Arq. Villarreal fue aprobado de inmediato en la primera revisión. Profesionalismo real, no solo palabras.&quot;
                  </p>
                </div>
                <div className="border-t border-slate-100 pt-4 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center font-bold text-xs text-slate-800">
                    PS
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-900 text-xs">Patricia Sánchez</h5>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Cliente de Avalúo, Guayaquil</span>
                  </div>
                </div>
              </div>

              {/* Testimonial 3 */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-premium flex flex-col justify-between">
                <div>
                  <div className="text-amber-500 text-lg font-bold mb-3">★★★★★</div>
                  <p className="text-slate-650 text-xs sm:text-sm leading-relaxed italic mb-6">
                    &quot;Lo que más me sorprendió fue la visualización 3D. Cuando vi los renders, cambié la posición de dos habitaciones y el diseño de la fachada. Cambios que en papel habrían sido difíciles de imaginar. Si no hubiera visto eso antes de construir, habría pasado años arrepintiéndome. El servicio vale por ese solo detalle.&quot;
                  </p>
                </div>
                <div className="border-t border-slate-100 pt-4 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center font-bold text-xs text-slate-800">
                    RA
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-900 text-xs">Roberto Alvarado y familia</h5>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Propietario Residencial, Cuenca</span>
                  </div>
                </div>
              </div>

              {/* Testimonial 4 */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-premium flex flex-col justify-between md:col-span-1">
                <div>
                  <div className="text-amber-500 text-lg font-bold mb-3">★★★★★</div>
                  <p className="text-slate-650 text-xs sm:text-sm leading-relaxed italic mb-6">
                    &quot;Contratamos el plan Profesional para la remodelación de nuestra casa. El equipo fue impecable en los tiempos, claro en las explicaciones y muy honesto cuando algo del diseño original no era viable. Esa honestidad nos ahorró dinero. No vinieron a decir que sí a todo — vinieron a hacer lo correcto.&quot;
                  </p>
                </div>
                <div className="border-t border-slate-100 pt-4 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center font-bold text-xs text-slate-800">
                    LT
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-900 text-xs">Lucía Terán</h5>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Remodelación, Ambato</span>
                  </div>
                </div>
              </div>

              {/* Testimonial 5 */}
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-premium flex flex-col justify-between md:col-span-2">
                <div>
                  <div className="text-amber-500 text-lg font-bold mb-3">★★★★★</div>
                  <p className="text-slate-650 text-xs sm:text-sm leading-relaxed italic mb-6">
                    &quot;Soy inversionista inmobiliario y necesitaba peritajes confiables para tres propiedades en simultáneo. Los informes estuvieron listos en los tiempos acordados, con nivel de detalle que ningún otro perito me había dado. Ahora trabajo exclusivamente con este estudio para todo lo que requiere criterio técnico.&quot;
                  </p>
                </div>
                <div className="border-t border-slate-100 pt-4 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center font-bold text-xs text-slate-800">
                    ME
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-900 text-xs">Ing. Mauricio Espinoza</h5>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Inversionista Inmobiliario, Quito</span>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </section>


        {/* SECTION 10: BONUSES & RISK-FREE WARRANTY - CONTRAST BLACK & EMERALD BLOCKS */}
        <section className="bg-slate-950 py-24 text-slate-100 relative">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-stretch">
              
              {/* Bonus Block */}
              <div className="bg-emerald-950/20 border border-emerald-500/20 p-8 rounded-3xl flex flex-col justify-between shadow-dark-premium relative">
                <div>
                  <span className="bg-emerald-500 text-slate-950 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full inline-block mb-4">
                    Bono Incluido en tu Proyecto
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-white mb-4">
                    Visualización 3D Fotorrealista de tu Futuro Hogar
                  </h3>
                  <div className="aspect-video w-full rounded-xl overflow-hidden mb-6 bg-slate-900">
                    <img 
                      src="/src/assets/images/architectural_plans_1781677830310.jpg" 
                      alt="Planos en alta definición por Ana Villarreal" 
                      className="w-full h-full object-cover grayscale opacity-60 hover:opacity-100 transition duration-300"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-4">
                    Antes de que comience cualquier obra, recibirás renders fotorrealistas de alta definición de tu obra. Este servicio integral de renders y modelados virtuales tiene un valor independiente de mercado que supera fácilmente los <span className="text-emerald-400 font-bold">USD $400 - $800</span>, y aquí lo recibes 100% incorporado sin costo. No cimentes a ciegas.
                  </p>
                </div>
                <div className="bg-emerald-500/10 px-4 py-2.5 rounded-lg text-xs font-mono text-emerald-400 text-center border border-emerald-500/10">
                  Ahorro Inmediato: USD $600
                </div>
              </div>

              {/* Warranty Block */}
              <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl flex flex-col justify-between shadow-dark-premium">
                <div>
                  <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full inline-block mb-4">
                    Compromiso Técnico de Calidad
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-white mb-4">
                    Garantía Sin Riesgo Respaldada por Firma Técnica
                  </h3>
                  <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-4">
                    Garantizamos por escrito la calidad y exactitud técnica del alcance de todos nuestros diseños arquitectónicos y planos estructurales de acuerdo con las normativas municipales vigentes. Esto significa que si el entregable no superara los dictámenes de las comisiones revisadas del municipio o del banco, realizamos de inmediato todas las revisiones y correcciones solicitadas por la entidad supervisora sin ningún tipo de costo o tarifa adicional para ti.
                  </p>
                  <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                    Nuestra trayectoria profesional, firma técnica visada y colegiatura oficial avalan cada plano y peritaje que emitimos en el territorio nacional. No estás pagando a un aficionado; cuentas con el respaldo civil firmado de un arquitecto calificado.
                  </p>
                </div>
                <div className="border-t border-slate-800 pt-4 mt-6 text-xs text-slate-500 font-mono text-center">
                  Garantía de Aprobación Municipal Válida por Contrato
                </div>
              </div>

            </div>

          </div>
        </section>


        {/* SECTION 11: PRICING - THREE PREMIUM PLANS */}
        <section id="precios-seccion" className="bg-white py-24 text-slate-950 border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-xs font-bold uppercase tracking-widest text-amber-600 block mb-2">Presupuestos Transparentes</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight">
                Una inversión proporcional al valor de tu patrimonio
              </h2>
              <p className="text-slate-500 text-sm mt-3">
                Sin sorpresas ni cargos adicionales imprevistos al final.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto items-stretch mb-16">
              
              {/* Plan 1 */}
              <div className="bg-slate-50 border border-slate-200 p-8 rounded-3xl flex flex-col justify-between shadow-premium hover:border-slate-350 transition-all">
                <div>
                  <h4 className="text-slate-500 font-bold text-xs uppercase tracking-wider mb-2 font-mono">Plan 01</h4>
                  <h3 className="text-xl font-bold text-slate-950 mb-1">Plan Básico</h3>
                  <p className="text-slate-500 text-xs mb-6">Esencial para trámites gubernamentales y permisos rápidos de edificación básica.</p>
                  <div className="bg-slate-200/50 p-4 rounded-2xl mb-6 text-center">
                    <span className="text-[10px] text-slate-500 uppercase font-mono block">Diseño desde</span>
                    <span className="text-2xl font-black text-slate-950">USD $15 / m²</span>
                  </div>
                  <ul className="space-y-3 text-xs text-slate-700 leading-relaxed">
                    <li className="flex items-start gap-2">
                      <span className="text-amber-500 font-bold">&#10003;</span>
                      Planos arquitectónicos de plantas de m² básico.
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-500 font-bold">&#10003;</span>
                      Cuadro de áreas y especificaciones descriptivas.
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-500 font-bold">&#10003;</span>
                      Firma calificada habilitada.
                    </li>
                  </ul>
                </div>
                <button onClick={() => setIsModalOpen(true)} className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold p-3 rounded-xl text-xs uppercase tracking-wider cursor-pointer transition mt-8 text-center">
                  Cotizar Plan Básico
                </button>
              </div>

              {/* Plan 2 */}
              <div className="bg-slate-950 border-2 border-amber-500 p-8 rounded-3xl flex flex-col justify-between shadow-premium relative text-white">
                <div className="absolute -top-4 right-6 bg-amber-500 text-slate-950 text-[9px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-full">
                  Más Recomendado
                </div>
                <div>
                  <h4 className="text-amber-400 font-bold text-xs uppercase tracking-wider mb-2 font-mono">Plan 02</h4>
                  <h3 className="text-xl font-bold text-white mb-1">Plan Profesional</h3>
                  <p className="text-slate-450 text-xs mb-6 font-light">Diseño arquitectónico y cálculo estructural completo sismorresistente integrado.</p>
                  <div className="bg-slate-900 p-4 rounded-2xl mb-6 text-center">
                    <span className="text-[10px] text-amber-500 uppercase font-mono block font-bold">Diseño completo</span>
                    <span className="text-2xl font-black text-white">USD $25 / m²</span>
                  </div>
                  <ul className="space-y-3 text-xs text-slate-350 leading-relaxed">
                    <li className="flex items-start gap-2">
                      <span className="text-amber-400 font-bold">&#10003;</span>
                      Plantas arquitectónicas, fachadas y cortes mecánicos.
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-400 font-bold">&#10003;</span>
                      Planos de estructuras de hormigón sismorresistente.
                    </li>
                    <li className="flex items-start gap-2 text-emerald-400 font-semibold">
                      <span className="text-emerald-400 font-bold">&#10003;</span>
                      Bono: Renders e integraciones en 3D del predio.
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-amber-400 font-bold">&#10003;</span>
                      Pre-planificación de materiales y acompañamiento.
                    </li>
                  </ul>
                </div>
                <button onClick={() => setIsModalOpen(true)} className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold p-3.5 rounded-xl text-xs uppercase tracking-widest cursor-pointer transition mt-8 text-center shadow-lg shadow-amber-550/20">
                  Adquirir Plan Profesional
                </button>
              </div>

              {/* Plan 3 */}
              <div className="bg-slate-50 border border-slate-200 p-8 rounded-3xl flex flex-col justify-between shadow-premium hover:border-slate-350 transition-all">
                <div>
                  <h4 className="text-slate-500 font-bold text-xs uppercase tracking-wider mb-2 font-mono">Plan 03</h4>
                  <h3 className="text-xl font-bold text-slate-950 mb-1">Plan Premium</h3>
                  <p className="text-slate-500 text-xs mb-6">Acompañamiento absoluto de dirección técnica, detalles ejecutivos e informes catastrales.</p>
                  <div className="bg-slate-200/50 p-4 rounded-2xl mb-6 text-center">
                    <span className="text-[10px] text-slate-500 uppercase font-mono block">Diseño ejecutivo</span>
                    <span className="text-2xl font-black text-slate-950">USD $38 / m²</span>
                  </div>
                  <ul className="space-y-3 text-xs text-slate-700 leading-relaxed">
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-500 font-bold">&#10003;</span>
                      Planos de instalaciones adicionales completas (sanitario/eléctrico).
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-500 font-bold">&#10003;</span>
                      Asesoría y firma de peritajes preliminares.
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-500 font-bold">&#10003;</span>
                      Supervisión periódica de la cimentación de la casa.
                    </li>
                    <li className="flex items-start gap-2 font-semibold text-emerald-600">
                      <span className="text-emerald-500 font-bold">&#10003;</span>
                      Resolución en altísima resolución 3D del proyecto.
                    </li>
                  </ul>
                </div>
                <button onClick={() => setIsModalOpen(true)} className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold p-3 rounded-xl text-xs uppercase tracking-wider cursor-pointer transition mt-8 text-center">
                  Consultar Plan Premium
                </button>
              </div>

            </div>

            <div className="max-w-3xl mx-auto bg-slate-50 border border-slate-200/90 rounded-2xl p-6 text-slate-700 space-y-3 text-xs leading-relaxed">
              <p>
                <strong>Nota general sobre costos del m² de obra construida:</strong>
                <br />
                Acabados estándar se presupuestan desde los <span className="font-bold text-slate-900">USD $350 por m²</span>, mientras que acabados superiores premium o estructuras bioclimáticas avanzadas de hormigón visto/metálicas se proyectan hasta los <span className="font-bold text-slate-900">USD $700 por m²</span>.
              </p>
              <p>
                Para un proyecto promedio de 100 m² de construcción, el diseño de ingeniería y arquitectura completo visado representa una inversión de alrededor de USD $2.500. Frente a un costo total de ejecución estimado de entre USD $35.000 y USD $70.000, <strong>el diseño profesional representa apenas el 3% al 7% del total, y es el seguro civil que previene imprevistos de miles de dólares en la cimentación real.</strong>
              </p>
            </div>

          </div>
        </section>


        {/* SECTION 12: ESCASEZ Y URGENCIA - HIGH VISUAL CONTRAST SECTION COLOR */}
        <section className="bg-amber-500 py-16 text-slate-950 font-sans">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-900 block mb-2 font-mono">Últimos cupos técnicos de temporada</span>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-slate-950 mb-4">
              ¿Por qué es importante iniciar con nosotros HOY?
            </h2>
            <p className="text-slate-900 text-xs sm:text-base leading-relaxed max-w-3xl mx-auto font-medium">
              La Arq. Ana Villarreal limita la admisión de diseños para garantizar la dirección técnica de obra y el rigor del catálogo de cálculos. Cada trimestre que pospones el inicio técnico, se incrementan los plazos de tramitación municipal frente al advenimiento de la temporada lluviosa y de licencias locales.
            </p>
            <div className="mt-8">
              <button 
                id="btn-scarcity-cta"
                onClick={() => setIsModalOpen(true)}
                className="bg-slate-950 hover:bg-slate-900 active:bg-black text-white font-bold text-xs uppercase tracking-wider px-8 py-4 rounded-xl cursor-pointer shadow-lg shadow-slate-950/20 transition-all inline-block hover:scale-[1.02]"
              >
                Asegurar Cupo Gratuito de Consulta
              </button>
            </div>
            <p className="text-[10px] text-slate-800 font-mono mt-3">
              Asignación inmediata por estricto orden de solicitud.
            </p>
          </div>
        </section>


        {/* SECTION 13: FAQS ACCORDION - LIGHT BACKGROUND */}
        <section className="bg-slate-50 py-24 text-slate-950 border-b border-slate-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-xs font-bold uppercase tracking-widest text-amber-600 block mb-2">Despeja tus inquietudes</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight">
                Preguntas Frecuentes
              </h2>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, idx) => {
                const isOpen = activeFAQ === idx;
                return (
                  <div key={idx} className="bg-white rounded-2xl border border-slate-200 shadow-premium overflow-hidden transition-all duration-300">
                    <button
                      id={`faq-btn-${idx}`}
                      onClick={() => setActiveFAQ(isOpen ? null : idx)}
                      className="w-full flex items-center justify-between p-5 text-left text-slate-900 hover:text-slate-950 font-bold text-sm sm:text-base cursor-pointer focus:outline-none select-none bg-white transition"
                    >
                      <span>{faq.q}</span>
                      <ChevronDown className={`w-5 h-5 text-slate-500 transition-transform duration-300 shrink-0 ml-3 ${isOpen ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {isOpen && (
                      <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-650 leading-relaxed border-t border-slate-100 animate-slideDown">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

          </div>
        </section>


        {/* SECTION 14: SOBRE LA CREADORA - PROFESSIONAL ARCHITECT PROFILE WITH GRAPHICS */}
        <section className="bg-slate-950 py-24 text-slate-300 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(245,158,11,0.04)_0%,transparent_50%)]"></div>

          <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              
              <div className="relative">
                {/* Decorative frames representing precision and blueprints */}
                <div className="absolute -top-4 -left-4 w-12 h-12 border-t-2 border-l-2 border-amber-500"></div>
                <div className="absolute -bottom-4 -right-4 w-12 h-12 border-b-2 border-r-2 border-amber-500"></div>
                
                <div className="rounded-3xl overflow-hidden shadow-dark-premium border border-slate-800 bg-slate-900 aspect-[3/4]">
                  <img 
                    src="/src/assets/images/architect_portrait_1781677815421.jpg" 
                    alt="Portarretrato de la Arq. Ana Villarreal" 
                    className="w-full h-full object-cover object-center scale-[1.02] hover:scale-[1.05] transition duration-500"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>

              <div>
                <span className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-widest block mb-2">Trayectoria Profesional</span>
                <span className="text-xs font-semibold text-slate-500 block uppercase font-mono tracking-wider">Presentación Oficial</span>
                <h2 className="text-3xl font-extrabold text-white mt-1 mb-6">
                  Arq. Ana Villarreal
                </h2>

                <div className="space-y-4 text-xs sm:text-sm leading-relaxed text-slate-400">
                  <p>
                    La <span className="text-white font-bold">Arq. Ana Villarreal</span> es arquitecta graduada y colegiada, especializada en el desarrollo integrado de diseño arquitectónico residencial de alta eficiencia y edificaciones comerciales funcionales, con formación profunda complementaria en estructuras, urbanismo catastral y tasación.
                  </p>
                  <p>
                    Su amplia trayectoria técnico-profesional abarca el codiseño y firma de múltiples viviendas en conjuntos residenciales, levantamientos y resoluciones catastrales de alta complejidad legal ante comisiones municipales, y peritajes estructurales urgentes de habitabilidad.
                  </p>
                  <p className="border-l-2 border-amber-500 pl-4 py-1 italic font-medium text-slate-350">
                    &quot;Cada plano, cálculo estructural y avalúo catastral que emito lleva mi propia firma corporativa y colegiatura con sello técnico oficial. No es un papel impreso al azar: es mi responsabilidad civil, técnica e histórica con tu familia y tus ahorros.&quot;
                  </p>
                  <p>
                    El estudio opera bajo una dirección multidisciplinaria que integra ingenieros calculistas, topógrafos mecánicos e inspectores inmobiliarios para ofrecerte un servicio de primer nivel con absoluta garantía legal.
                  </p>
                </div>
              </div>

            </div>

          </div>
        </section>


        {/* INTERACTIVE COMPONENT TAB: CLIENTS AND PROJECT MANAGEMENT SYSTEM DEMO (WORKBOOK) */}
        <section className="bg-slate-900 py-24 text-slate-100 border-t border-slate-800 border-b border-slate-950 relative">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.02)_0%,transparent_50%)]"></div>
          
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-10 select-none">
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 font-mono block mb-2">Simulador Interactivo de Ingeniería</span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                Tu Panel Técnico de Control y Relación de Datos
              </h2>
              <p className="text-slate-400 text-xs sm:text-sm mt-3 leading-relaxed">
                Prueba en vivo la estructura relacional de datos descrita en Excel por la Arq. Ana Villarreal para la gestión de proyectos. Cuando reservas tu <strong>Consulta Gratuita</strong> arriba, tus datos ingresan automáticamente en HOJA_CLIENTES e inician un PROYECTO en diagnóstico. ¡Prueba agregando filas tú mismo!
              </p>
            </div>

            {/* LIVE SPREADSHEET */}
            <SpreadsheetSystem 
              clientes={clientes}
              setClientes={setClientes}
              proyectos={proyectos}
              setProyectos={setProyectos}
              levantamientos={levantamientos}
              setLevantamientos={setLevantamientos}
              planos={planos}
              setPlanos={setPlanos}
              avaluos={avaluos}
              setAvaluos={setAvaluos}
              peritajes={peritajes}
              setPeritajes={setPeritajes}
            />

          </div>
        </section>


        {/* FINAL CALL TO ACTION (CTA) - IMMERSIVE DARK BANNER */}
        <section id="cta-final-seccion" className="bg-slate-950 py-24 text-slate-100 relative overflow-hidden text-center border-t border-slate-900">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(245,158,11,0.06)_0%,transparent_60%)]"></div>

          <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400 block mb-3 font-mono">Llamado a la Acción Final</span>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-white leading-tight tracking-tight mb-6 select-none">
              Tu Casa No Puede Esperar Más. <br className="hidden sm:inline" />
              <span className="text-gradient">Nosotros Tampoco.</span>
            </h2>

            <p className="text-slate-405 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto mb-10 font-light">
              Has llegado hasta aquí porque algo en ti sabe con certeza que es el momento. Que ya es hora de pasar de las ideas desordenadas en el cajón de recuerdos a los planos profesionales de ingeniería sobre la mesa. De las estimaciones vagas a los m² reales.
            </p>

            <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl mb-10 text-left max-w-2xl mx-auto">
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-0">
                <strong>¿No sabes por dónde comenzar?</strong> No te preocupes, no necesitas tener todo resuelto de antemano. Para orientarte con criterio de ingeniería y diseño espacial estamos nosotros. Lo único que necesitas es dar el primer paso hoy.
              </p>
            </div>

            <div>
              <a
                id="final-action-button"
                href="https://wa.me/593982609956?text=Hola%20Ana%20Villarreal,%20me%20gustar%C3%ADa%20agendar%20una%20Consulta%20Gratuita%20para%20mi%20proyecto."
                target="_blank"
                rel="noopener noreferrer"
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm uppercase tracking-widest px-10 py-5 rounded-2xl inline-block shadow-2xl shadow-amber-950/20 hover:scale-[1.03] active:scale-[0.98] transition-all cursor-pointer text-center animate-pulse-scale-mobile"
              >
                Booking Form: Agendar mi Consulta Gratuita
              </a>
            </div>

            <p className="text-[10px] text-slate-500 font-mono mt-4">
              *Cupos de análisis topográfico limitados por orden de registro semanal.
            </p>

          </div>
        </section>

      </main>

      {/* Modern Compact Footer */}
      <footer className="bg-slate-950 border-t border-slate-900 py-12 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-amber-500 rounded flex items-center justify-center font-bold text-[10px] text-slate-950">
              AV
            </div>
            <span className="font-bold text-slate-300 tracking-wider">Arq. Ana Villarreal — Estudio Técnico</span>
          </div>

          <div className="text-[10px] space-y-1">
            <p>Diseño que respeta tu presupuesto. Planos que aseguran tu inversión. Espacios que transforman tu vida.</p>
            <p>© 2026 Arq. Ana Villarreal. Todos los derechos reservados. Registro Oficial N° COG-3942-A.</p>
          </div>

          <div className="flex gap-4">
            <a href="#hero-seccion" className="hover:text-white transition">Inicio</a>
            <a href="#solucion-seccion" className="hover:text-white transition">Estudios</a>
            <a href="#workbook-section" className="hover:text-white transition">Control Interno</a>
          </div>
        </div>
      </footer>

      {/* Booking Dialog Modal Form */}
      <LeadModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmitSuccess={handleNewLeadSubmitted}
      />

      {/* Toast Notification Banner */}
      {toastMessage && (
        <div id="app-global-toast" className="fixed bottom-6 left-6 bg-slate-900 text-white p-4.5 rounded-2xl border border-amber-500/30 shadow-2xl max-w-md flex items-start gap-3 animate-fadeIn z-50 text-xs sm:text-sm font-sans font-medium">
          <PartyEmoji />
          <div>
            <p className="text-white font-bold block mb-1">¡Sincronización de Consulta!</p>
            <p className="text-slate-400 font-normal leading-relaxed text-xs">{toastMessage}</p>
          </div>
        </div>
      )}

    </div>
  );
}

// Helpers
function PartyEmoji() {
  return (
    <div className="bg-amber-500/10 text-amber-400 p-1.5 rounded-lg border border-amber-500/20 shrink-0">
      <Sparkles className="w-5 h-5" />
    </div>
  );
}
