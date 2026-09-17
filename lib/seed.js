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
    slug: "liderazgo-consciente",
    title: "Liderazgo Consciente",
    category: "Liderazgo",
    speaker: "Por definir",
    speakerBio:
      "Facilitador con experiencia en desarrollo de líderes y dinámicas de foro.",
    summary:
      "Cómo liderar desde la consciencia: presencia, escucha y toma de decisiones bajo presión.",
    description:
      "Un taller práctico sobre liderazgo consciente. Trabajaremos herramientas de autoconocimiento, comunicación de alto impacto y manejo de la energía del equipo. Ideal para foros que quieren elevar la calidad de sus conversaciones y decisiones.",
    durationMin: 90,
    imageUrl: "",
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
