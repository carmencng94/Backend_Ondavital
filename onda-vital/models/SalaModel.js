// Model: SalaModel.js
// Propósito: Gestionar el catálogo de salas disponibles como fuente de verdad.

const salas = [
  {
    id: "jardin",
    nombre: "Sala Jardín",
    dimensiones: "8.5×4.5 m (32 m²)",
    capacidad: "10 esterillas / 25 sentados",
    descripcionLarga: "Un espacio amplio y luminoso que conecta directamente con nuestro jardín exterior. Ideal para clases de yoga, meditación, talleres grupales o conferencias pequeñas. Su suelo de madera y la luz natural crean una atmósfera de paz inigualable.",
    equipamiento: ["Proyector HD", "Sistema de Sonido Bluetooth", "15 Esterillas", "25 Sillas", "Luz Natural", "Acceso a Jardín"],
    imagenes: [
      "/assets/images/sala-jardin.png",
      "https://images.unsplash.com/photo-1545208393-596371ad56ee?w=800",
      "https://images.unsplash.com/photo-1593062096033-9a26b09daec4?w=800"
    ],
    tarifas: { 
      hora: "20€/h", 
      dia: "120€/día", 
      bono: "150€ (10h)",
      mensual: "Desde 40€/h"
    }
  },
  {
    id: "azul",
    nombre: "Sala Azul",
    dimensiones: "6.5×5 m (32 m²)",
    capacidad: "10 camillas / 30 sentados",
    descripcionLarga: "Nuestra Sala Azul ofrece un entorno profesional y acogedor. Con vistas al jardín y una moqueta de alta calidad, es perfecta para formaciones que requieran camillas o para charlas dinámicas.",
    equipamiento: ["Aire Acondicionado", "Moqueta Premium", "Proyector/Sonido", "Vistas al Jardín", "8 Camillas disponibles"],
    imagenes: [
      "/assets/images/sala-azul.png",
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800",
      "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800"
    ],
    tarifas: { 
      hora: "20€/h", 
      dia: "120€/día", 
      bono: "150€ (10h)",
      mensual: "Desde 40€/h"
    }
  },
  {
    id: "despacho-plus",
    nombre: "Despacho+",
    dimensiones: "4.1×3.2 m (13 m²)",
    capacidad: "8 personas",
    descripcionLarga: "El Despacho+ es la joya de la corona para terapeutas que buscan privacidad y exclusividad. Un espacio íntimo, con aire acondicionado y vistas relajantes, diseñado para sesiones de psicología, nutrición o masajes.",
    equipamiento: ["Privacidad Total", "Aire Acondicionado", "Mesa de Reunión", "2 Sillones Premium", "Camilla disponible"],
    imagenes: [
      "/assets/images/despacho-plus.png",
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800"
    ],
    tarifas: { 
      hora: "16€/h", 
      dia: "90€/día", 
      bono: "140€ (10h)",
      mensual: "Desde 35€/h"
    }
  },
  {
    id: "terapia-a",
    nombre: "Sala Terapia A",
    dimensiones: "3×2.5 m (7.5 m²)",
    capacidad: "1-3 personas",
    descripcionLarga: "Especialmente diseñada para consultas individuales de corta o larga duración. Equipada con todo lo necesario para el profesional de la salud: escritorio, camilla y lavabo.",
    equipamiento: ["Mesa escritorio", "Camilla de examen", "Lavabo funcional", "Internet Fibra"],
    imagenes: [
      "/assets/images/sala-terapia-a.png",
      "https://images.unsplash.com/photo-1576091160550-2173bdd9962a?w=800"
    ],
    tarifas: { 
      hora: "12€/h", 
      dia: "70€/día", 
      bono: "110€ (10h)",
      mensual: "Desde 30€/h"
    }
  },
  {
    id: "terapia-b",
    nombre: "Sala Terapia B",
    dimensiones: "3×2.5 m (7.5 m²)",
    capacidad: "1-3 personas",
    descripcionLarga: "Un espacio funcional y tranquilo, optimizado para sesiones individuales de fisioterapia o masajes específicos en un ambiente relajado.",
    equipamiento: ["Mesa escritorio", "Camilla plegable", "Internet Fibra", "Ambiente Climatizado"],
    imagenes: [
      "/assets/images/sala-terapia-b.png",
      "https://images.unsplash.com/photo-1629909613654-28a3a7c4d409?w=800"
    ],
    tarifas: { 
      hora: "12€/h", 
      dia: "70€/día", 
      bono: "110€ (10h)",
      mensual: "Desde 30€/h"
    }
  },
  {
    id: "comunitaria",
    nombre: "Sala Comunitaria",
    dimensiones: "Área común con terraza",
    capacidad: "Descanso y networking",
    descripcionLarga: "Nuestra sala comunitaria es el corazón social de Onda Vital. Aquí los profesionales y alumnos pueden relajarse entre sesiones, tomar un té o intercambiar ideas en un ambiente distendido.",
    equipamiento: ["Cocina Equipada", "Microondas/Nevera", "Cafetera/Tetera", "Vajilla completa", "Terraza exterior"],
    imagenes: [
      "/assets/images/sala-comunitaria.png",
      "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800"
    ],
    tarifas: { 
      hora: "Incluido", 
      dia: "N/A", 
      bono: "N/A", 
      mensual: "N/A" 
    }
  }
];

class SalaModel {
  static obtenerTodas() {
    return salas;
  }
}

module.exports = SalaModel;
