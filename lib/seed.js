// Contenido por defecto. El admin puede editar todo esto desde el panel.
// Los colores se aplican como variables CSS, así que cambiar la marca es trivial.

export const defaultSettings = {
  orgName: "EO Panamá",
  tagline: "Entrenamientos y conferencias para los foros",
  heroTitle: "Trainings para los Foros del Capítulo de Panamá",
  heroSubtitle:
    "Sesiones de aprendizaje diseñadas exclusivamente para los foros de EO: temas de liderazgo, negocios y crecimiento personal, impartidos por facilitadores expertos.",
  aboutTitle: "¿Qué es esto?",
  aboutText:
    "Esta plataforma reúne los entrenamientos y conferencias disponibles para los foros del capítulo de EO Panamá. Cada foro puede explorar los temas, conocer al facilitador y reservar la sesión que mejor se ajuste a su agenda. Una vez enviada la solicitud, el administrador la revisa y confirma la fecha.",
  // Marca EO — el admin puede sobreescribir estos valores en /admin/ajustes
  brandPrimary: "#3D46F2",
  brandAccent: "#FF346E",
  brandBg: "#FFFFFF",
  logoUrl: "/eo-mark.png",
  contactEmail: "johann.palma@btgroup.co",
  footerText: "EO Panamá · Comité de Educación de Foros",
};

export const defaultTopics = [
  {
    id: "t1",
    slug: "autoconocimiento-transformacion-personal",
    title: "Autoconocimiento para la Transformación Personal",
    category: "Transformación Personal",
    speaker: "Laura Arciniega",
    speakerBio:
      "Psicóloga, coach ontológica y en liderazgo generativo, consultora de innovación y cambio con 19 años de experiencia. Especialista en procesos de autoconocimiento y transformación personal para individuos y equipos.",
    summary:
      "Un viaje de autoconocimiento para transformarte a ti mismo y potenciar tu capacidad de liderazgo e impacto.",
    description:
      "En esta sesión, Laura te guiará a través de un proceso de autoconocimiento profundo. Aprenderás herramientas prácticas para reconectarte contigo mismo, desarrollar conciencia de tu impacto, y descubrir tu propósito transformador. Diseñado para ayudarte a navegar los cambios con mayor claridad y alcanzar los resultados que realmente deseas. Ideado para personas y equipos que buscan crecer emocionalmente y transformarse para lograr sus objetivos.",
    durationMin: 90,
    imageUrl: "https://img.youtube.com/vi/R0ZYX3xhANs/maxresdefault.jpg",
    videoUrl: "https://www.youtube.com/shorts/R0ZYX3xhANs",
    active: true,
  },
  {
    id: "t2",
    slug: "finanzas-para-fundadores",
    title: "Finanzas para Fundadores",
    category: "Negocios",
    speaker: "Por definir",
    speakerBio: "Especialista en finanzas para emprendedores en etapa temprana.",
    summary:
      "Lectura de estados financieros, flujo de caja y métricas que de verdad importan.",
    description:
      "Sesión enfocada en darle a los miembros del foro un marco simple para entender la salud financiera de su negocio: márgenes, runway, unit economics y las decisiones que mueven la aguja. Sin jerga innecesaria.",
    durationMin: 120,
    imageUrl: "",
    active: true,
  },
  {
    id: "t3",
    slug: "conversaciones-dificiles",
    title: "Conversaciones Difíciles",
    category: "Comunicación",
    speaker: "Por definir",
    speakerBio: "Coach especializado en comunicación y resolución de conflictos.",
    summary:
      "Marco para abordar las conversaciones que evitamos, dentro y fuera del foro.",
    description:
      "Las mejores decisiones a veces dependen de la conversación más incómoda. En este training practicamos un marco para preparar y sostener conversaciones difíciles con claridad y respeto, manteniendo la relación intacta.",
    durationMin: 90,
    imageUrl: "",
    active: true,
  },
];
