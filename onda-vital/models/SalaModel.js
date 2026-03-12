// Model: SalaModel.js
// Propósito: Gestionar el catálogo de salas disponibles como fuente de verdad.
// Solo retorna datos, sin lógica de negocio compleja.

const salas = [
  {
    id: "jardin",
    nombre: "Sala Jardín",
    dimensiones: "8.5×4.5 m (32 m²)",
    capacidad: "10 esterillas / 25 sentados",
    equipamiento: ["Proyector/Sonido", "Sillas/Esterillas", "Luz Natural", "Acceso a Sala Comunitaria y Terraza/Jardín"]
  },
  {
    id: "azul",
    nombre: "Sala Azul",
    dimensiones: "6.5×5 m",
    capacidad: "10 camillas / 30 sentados",
    equipamiento: ["Luz Natural (Vistas al jardín)", "Moqueta", "Proyector/Sonido", "Aire Acondicionado"]
  },
  {
    id: "despacho-plus",
    nombre: "Despacho+",
    dimensiones: "4×3.2 m",
    capacidad: "8 sillas / 2 camillas",
    equipamiento: ["Luz Natural (Vistas al jardín)", "Privacidad total", "Ideal Terapias", "Aire Acondicionado"]
  },
  {
    id: "terapia-a",
    nombre: "Sala Terapia A",
    dimensiones: "3×2.5 m",
    capacidad: "Uso individual",
    equipamiento: ["Mesa escritorio", "Camilla", "Lavabo", "Internet"]
  },
  {
    id: "terapia-b",
    nombre: "Sala Terapia B",
    dimensiones: "3×2.5 m",
    capacidad: "Uso individual",
    equipamiento: ["Mesa escritorio", "Camilla", "Internet"]
  },
  {
    id: "comunitaria",
    nombre: "Sala Comunitaria",
    dimensiones: "con terraza y jardín",
    capacidad: "Área de descanso",
    equipamiento: ["Cocina equipada", "Nevera", "Microondas", "Tetera", "Vajilla completa"]
  }
];

class SalaModel {
  /**
   * Obtiene todas las salas del catálogo.
   * Función pura que retorna el array de salas.
   */
  static obtenerTodas() {
    return salas;
  }
}

module.exports = SalaModel;
