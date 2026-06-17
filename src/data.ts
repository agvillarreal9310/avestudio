import { Cliente, Proyecto, LevantamientoTopografico, PlanoArquitectonico, Avaluo, Peritaje } from './types';

export const initialClientes: Cliente[] = [
  {
    id_cliente: 1,
    nombres: "Margarita",
    apellidos: "Gutiérrez Vega",
    cedula: "1718293848",
    telefono: "0998765432",
    correo: "margarita.gutierrez@gmail.com",
    direccion: "Av. de los Granados, Edificio Solar, Dpto 4B, Quito"
  },
  {
    id_cliente: 2,
    nombres: "Carlos Alberto",
    apellidos: "Mendoza Ortiz",
    cedula: "0918273645",
    telefono: "0987654321",
    correo: "carlos.mendoza@outlook.com",
    direccion: "Urb. El Condado, Calle Principal N45, Quito"
  },
  {
    id_cliente: 3,
    nombres: "Patricia María",
    apellidos: "Sánchez Noboa",
    cedula: "0923456789",
    telefono: "0954321987",
    correo: "patty_sanchez@hotmail.com",
    direccion: "Via a la Costa, Km 14, Urb. Olimpo Villa 12, Guayaquil"
  },
  {
    id_cliente: 4,
    nombres: "Roberto Javier",
    apellidos: "Alvarado Pesántez",
    cedula: "0102938475",
    telefono: "0992345611",
    correo: "robertoalvarado@uazuay.edu.ec",
    direccion: "Sector Challuabamba, Calle Las Orquídeas, Cuenca"
  },
  {
    id_cliente: 5,
    nombres: "Lucía Fernanda",
    apellidos: "Terán Cevallos",
    cedula: "1804938271",
    telefono: "0981122334",
    correo: "lucia.teranc@yahoo.com",
    direccion: "Av. Cevallos, Edificio Central, Ambato"
  },
  {
    id_cliente: 6,
    nombres: "Mauricio Andrés",
    apellidos: "Espinoza Rivadeneira",
    cedula: "1709483726",
    telefono: "0990088776",
    correo: "admin@espinozainversiones.com",
    direccion: "Av. República de El Salvador 320, Quito"
  }
];

export const initialProyectos: Proyecto[] = [
  {
    id_proyecto: 101,
    id_cliente: 1,
    nombre_proyecto: "Residencia Gutiérrez - Rediseño Correctivo",
    tipo_proyecto: "Remodelación",
    ubicacion: "Tumbaco, Calle Los Álamos Lt. 4",
    fecha_inicio: "2026-02-15",
    presupuesto: 28500,
    estado: "En Diseño"
  },
  {
    id_proyecto: 102,
    id_cliente: 2,
    nombre_proyecto: "Casa de Campo Mendoza",
    tipo_proyecto: "Residencial",
    ubicacion: "Valle de Los Chillos, Sector El Ejido",
    fecha_inicio: "2025-08-10",
    presupuesto: 85000,
    estado: "Construcción"
  },
  {
    id_proyecto: 103,
    id_cliente: 3,
    nombre_proyecto: "Avalúo Comercial Terreno Urbano",
    tipo_proyecto: "Avalúo",
    ubicacion: "Km 4.5 Av. Juan Tanca Marengo, Guayaquil",
    fecha_inicio: "2026-05-11",
    presupuesto: 1800,
    estado: "Completado"
  },
  {
    id_proyecto: 104,
    id_cliente: 4,
    nombre_proyecto: "Residencia Alvarado - Diseño Moderno Bioclimático",
    tipo_proyecto: "Residencial",
    ubicacion: "Challuabamba Loma Alta, Cuenca",
    fecha_inicio: "2026-01-20",
    presupuesto: 125000,
    estado: "Aprobación Municipal"
  },
  {
    id_proyecto: 105,
    id_cliente: 5,
    nombre_proyecto: "Remodelación Integral Terán",
    tipo_proyecto: "Remodelación",
    ubicacion: "Atsupamba, Ambato",
    fecha_inicio: "2025-11-05",
    presupuesto: 42000,
    estado: "Completado"
  },
  {
    id_proyecto: 106,
    id_cliente: 6,
    nombre_proyecto: "Peritaje Técnico de Patologías Estructurales",
    tipo_proyecto: "Peritaje",
    ubicacion: "Sector La Carolina, Calle Suecia, Quito",
    fecha_inicio: "2026-04-03",
    presupuesto: 3500,
    estado: "Completado"
  }
];

export const initialLevantamientos: LevantamientoTopografico[] = [
  {
    id_levantamiento: 201,
    id_proyecto: 101,
    fecha_levantamiento: "2026-02-18",
    area_terreno: 450.50,
    coordenadas: "UTM-S Zone 17S (785000m E, 9976000m N)",
    observaciones: "Terreno con pendiente media del 15% hacia el occidente. Presencia de muros de contención rústicos preexistentes que requieren demolición parcial."
  },
  {
    id_levantamiento: 202,
    id_proyecto: 102,
    fecha_levantamiento: "2025-08-14",
    area_terreno: 1200.00,
    coordenadas: "UTM-S Zone 17S (789210m E, 9969120m N)",
    observaciones: "Suelo de alta plasticidad. Nivel freático detectado a 1.20 metros de profundidad. Exclusiva vegetación de eucalipto en la linde sur."
  },
  {
    id_levantamiento: 203,
    id_proyecto: 104,
    fecha_levantamiento: "2026-01-28",
    area_terreno: 980.00,
    coordenadas: "UTM-S Zone 17S (721400m E, 9681100m N)",
    observaciones: "Topografía irregular con talud pronunciado de 40 grados. Requiere aterrazamiento con gaviones para el desplante seguro de la cimentación principal."
  }
];

export const initialPlanos: PlanoArquitectonico[] = [
  {
    id_plano: 301,
    id_proyecto: 101,
    tipo_plano: "Arquitectónico",
    fecha_elaboracion: "2026-03-01",
    version: "v2.1",
    descripcion: "Distribución corregida de planta baja y alta integrando la cocina abierta con acceso directo a terraza bioclimática posterior."
  },
  {
    id_plano: 302,
    id_proyecto: 101,
    tipo_plano: "Estructural",
    fecha_elaboracion: "2026-03-10",
    version: "v1.0",
    descripcion: "Detalles de zapata aislada y vigas de amarre reforzadas para soportar la ampliación del segundo nivel sobre suelo arcilloso."
  },
  {
    id_plano: 303,
    id_proyecto: 102,
    tipo_plano: "Arquitectónico",
    fecha_elaboracion: "2025-09-02",
    version: "v1.2",
    descripcion: "Planos definitivos de acabados, fachadas rústico-modernas, cortes constructivos y detalles de cubiertas invertidas."
  },
  {
    id_plano: 304,
    id_proyecto: 102,
    tipo_plano: "Estructural",
    fecha_elaboracion: "2025-09-15",
    version: "v1.0",
    descripcion: "Cimentación por losa de cimentación con doble malla de refuerzo dadas las condiciones freáticas del terreno topográfico."
  },
  {
    id_plano: 305,
    id_proyecto: 104,
    tipo_plano: "Arquitectónico",
    fecha_elaboracion: "2026-02-20",
    version: "v1.0",
    descripcion: "Estrategias de arquitectura solar pasiva: orientación de fachadas acristaladas al norte para maximizar temperatura natural invernal en Cuenca."
  }
];

export const initialAvaluos: Avaluo[] = [
  {
    id_avaluo: 401,
    id_proyecto: 103,
    fecha_avaluo: "2026-05-18",
    valor_comercial: 145000.00,
    observaciones: "Método de comparación de mercado. Tres muestras de lotes colindantes. Factor de forma regular y excelente frente comercial sobre vía principal."
  }
];

export const initialPeritajes: Peritaje[] = [
  {
    id_peritaje: 501,
    id_proyecto: 106,
    fecha_peritaje: "2026-04-10",
    tipo_peritaje: "Daño Estructural",
    resultado: "Fallas severas por asentamieto diferencial.",
    observaciones: "Se identificaron grietas a 45 grados en muros portantes de segundo piso. Origen en infiltración subterránea no canalizada. Requiere calzadura urgente y micropilotes."
  }
];
