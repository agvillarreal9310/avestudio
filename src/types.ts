export interface Cliente {
  id_cliente: number;
  nombres: string;
  apellidos: string;
  cedula: string;
  telefono: string;
  correo: string;
  direccion: string;
}

export interface Proyecto {
  id_proyecto: number;
  id_cliente: number;
  nombre_proyecto: string;
  tipo_proyecto: string; // 'Residencial' | 'Comercial' | 'Remodelación' | 'Topografía' | 'Avalúo' | 'Peritaje'
  ubicacion: string;
  fecha_inicio: string;
  presupuesto: number;
  estado: 'En Diagnóstico' | 'Levantamiento' | 'En Diseño' | 'Aprobación Municipal' | 'Construcción' | 'Completado';
}

export interface LevantamientoTopografico {
  id_levantamiento: number;
  id_proyecto: number;
  fecha_levantamiento: string;
  area_terreno: number; // m²
  coordenadas: string;
  observaciones: string;
}

export interface PlanoArquitectonico {
  id_plano: number;
  id_proyecto: number;
  tipo_plano: string; // 'Arquitectónico' | 'Estructural' | 'Sanitario' | 'Eléctrico'
  fecha_elaboracion: string;
  version: string; // e.g. 'v1.0'
  descripcion: string;
}

export interface Avaluo {
  id_avaluo: number;
  id_proyecto: number;
  fecha_avaluo: string;
  valor_comercial: number;
  observaciones: string;
}

export interface Peritaje {
  id_peritaje: number;
  id_proyecto: number;
  fecha_peritaje: string;
  tipo_peritaje: string; // 'Daño Estructural' | 'Reclamación de Seguro' | 'Inspección Sanitaria'
  resultado: string;
  observaciones: string;
}
