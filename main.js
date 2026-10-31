document.addEventListener("DOMContentLoaded", () => {
  
  const serviciosContainer = document.getElementById("serviciosContainer");
  const filterButtons = document.querySelectorAll(".filter-btn");
  const searchInput = document.getElementById("searchInput");
  const toastContainer = document.getElementById("toastContainer");
  let serviciosData = [];
  let categoriaActual = "Todos";

  // NOTIFICACIONES TOAST
  function mostrarToast(mensaje, tipo = "success") {
    if (!toastContainer) return;
    const toast = document.createElement("div");
    toast.className = `toast-notification ${tipo}`;
    toast.innerHTML = `<i data-lucide="${tipo === 'success' ? 'check-circle' : 'info'}"></i> <span>${mensaje}</span>`;
    
    toastContainer.appendChild(toast);
    if (window.lucide) lucide.createIcons();

    setTimeout(() => toast.classList.add("show"), 50);

    setTimeout(() => {
      toast.classList.remove("show");
      setTimeout(() => toast.remove(), 400);
    }, 3500);
  }

  // 1. CARGA DE SERVICIOS (Con respaldo directo en memoria)
  async function cargarServicios() {
    const serviciosPorDefecto = [
      {
        id: 1,
        titulo: "Desarrollo Web & Software a Medida (React)",
        categoria: "Desarrollo",
        icono: "code-2",
        imagen: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1000&q=80",
        descripcion: "Aplicaciones web de alto rendimiento construidas con React, JSX y componentes modulares altamente escalables.",
        detalles: ["SPA con navegación fluida", "Optimización de estado", "Diseño responsivo avanzado"],
        tiempoEstimado: "4 - 6 Semanas",
        casosUso: "Startups, plataformas SaaS y portales corporativos.",
        entregables: ["Código fuente en repositorio Git", "Documentación de componentes", "Despliegue inicial"]
      },
      {
        id: 2,
        titulo: "Desarrollo Backend con Node.js & Express",
        categoria: "Desarrollo",
        icono: "server",
        imagen: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1000&q=80",
        descripcion: "Construcción de APIs RESTful seguras, enrutamiento eficiente y lógica de negocio orientada a microservicios.",
        detalles: ["Controladores y rutas modulares", "Autenticación segura", "Middleware personalizado"],
        tiempoEstimado: "3 - 5 Semanas",
        casosUso: "Sistemas con alto flujo de solicitudes concurrentes.",
        entregables: ["API REST documentada", "Pruebas de endpoints", "Configuración de entorno"]
      },
      {
        id: 3,
        titulo: "Bases de Datos & Persistencia MongoDB",
        categoria: "Desarrollo",
        icono: "database",
        imagen: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&w=1000&q=80",
        descripcion: "Modelado de bases de datos NoSQL, esquemas con Mongoose y operaciones CRUD optimizadas para baja latencia.",
        detalles: ["Esquemas tipados", "Consultas agregadas", "Índices de alto rendimiento"],
        tiempoEstimado: "2 - 4 Semanas",
        casosUso: "Gestión masiva de datos y registros en tiempo real.",
        entregables: ["Estructura de base de datos", "Scripts de migración", "Optimización de consultas"]
      },
      {
        id: 4,
        titulo: "Optimización de Procesos & Robots RPA",
        categoria: "Automatización",
        icono: "cpu",
        imagen: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1000&q=80",
        descripcion: "Automatización inteligente de tareas repetitivas mediante bots y scripts orientados a la eficiencia operativa.",
        detalles: ["Reducción de errores manuales", "Integración con software legacy", "Reportes automáticos"],
        tiempoEstimado: "3 - 5 Semanas",
        casosUso: "Empresas con procesos administrativos y logísticos densos.",
        entregables: ["Bots configurados", "Manual de operación", "Monitoreo de ejecución"]
      },
      {
        id: 5,
        titulo: "Ciberarquitectura & Defensa Zero-Trust",
        categoria: "Seguridad",
        icono: "shield-check",
        imagen: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1000&q=80",
        descripcion: "Auditorías de seguridad, protección de endpoints y diseño de políticas de acceso bajo el principio de desconfianza cero.",
        detalles: ["Control de accesos estrictos", "Mitigación de vulnerabilidades", "Cifrado de datos"],
        tiempoEstimado: "2 - 4 Semanas",
        casosUso: "Entornos corporativos con alta sensibilidad de datos.",
        entregables: ["Informe de auditoría", "Políticas implementadas", "Certificación de blindaje"]
      },
      {
        id: 6,
        titulo: "Agentes de IA & Modelos LLM Empresariales",
        categoria: "Estrategia",
        icono: "layers",
        imagen: "https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&w=1000&q=80",
        descripcion: "Integración de inteligencia artificial conversacional y asistentes automatizados adaptados al conocimiento de tu negocio.",
        detalles: ["Prompts estructurados", "Conexión con APIs de IA", "Respuestas contextuales"],
        tiempoEstimado: "3 - 5 Semanas",
        casosUso: "Atención al cliente y optimización de flujos de trabajo.",
        entregables: ["Asistente configurado", "Base de conocimiento conectada", "Capacitación de uso"]
      }
    ];

    const localData = localStorage.getItem("orion_servicios");
    
    if (localData) {
      serviciosData = JSON.parse(localData);
      filtrarYRenderizar();
    } else {
      serviciosData = serviciosPorDefecto;
      guardarEnLocalStorage(serviciosData);
      filtrarYRenderizar();
    }
  }

  function guardarEnLocalStorage(data) {
    localStorage.setItem("orion_servicios", JSON.stringify(data));
  }

  function filtrarYRenderizar() {
    const query = searchInput ? searchInput.value.toLowerCase().trim() : "";

    const resultados = serviciosData.filter(servicio => {
      const coincideCategoria = (categoriaActual === "Todos") || (servicio.categoria === categoriaActual);
      
      const enTitulo = servicio.titulo.toLowerCase().includes(query);
      const enDesc = servicio.descripcion.toLowerCase().includes(query);
      const enStack = servicio.stackTecnologico ? servicio.stackTecnologico.some(s => s.toLowerCase().includes(query)) : false;

      const coincideBusqueda = query === "" || enTitulo || enDesc || enStack;

      return coincideCategoria && coincideBusqueda;
    });

    renderizarServicios(resultados);
  }

  function renderizarServicios(servicios) {
    if (!serviciosContainer) return;
    serviciosContainer.innerHTML = "";

    if (servicios.length === 0) {
      serviciosContainer.innerHTML = `<p class="form-status-msg">No se encontraron soluciones que coincidan con la búsqueda.</p>`;
      return;
    }

    servicios.forEach(servicio => {
      const card = document.createElement("div");
      card.className = "glass-card";

      const imagenHTML = servicio.imagen 
        ? `<img src="${servicio.imagen}" alt="${servicio.titulo}" class="card-banner-img" loading="lazy">` 
        : `<img src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1000&q=80" class="card-banner-img">`;

      const detallesHTML = (servicio.detalles && servicio.detalles.length > 0)
        ? `<ul class="service-details-list">${servicio.detalles.slice(0, 3).map(d => `<li>${d}</li>`).join('')}</ul>` 
        : '';

      card.innerHTML = `
        ${imagenHTML}
        <div class="card-body-content">
          <div class="icon-wrapper"><i data-lucide="${servicio.icono || 'code-2'}"></i></div>
          <h3>${servicio.titulo}</h3>
          <p>${servicio.descripcion}</p>
          ${detallesHTML}
          <button class="card-footer-link btn-open-detail" data-id="${servicio.id}">
            Ver alcance completo <i data-lucide="chevron-right"></i>
          </button>
        </div>
      `;

      serviciosContainer.appendChild(card);
    });

    if (window.lucide) lucide.createIcons();
    asignarEventosDetalle();
    renderizarListaAdmin();
  }

  if (searchInput) {
    searchInput.addEventListener("input", filtrarYRenderizar);
  }

  filterButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      if (btn.id === "tabServiciosBtn" || btn.id === "tabLeadsBtn") return;
      filterButtons.forEach(b => {
        if (b.id !== "tabServiciosBtn" && b.id !== "tabLeadsBtn") b.classList.remove("active");
      });
      btn.classList.add("active");
      categoriaActual = btn.getAttribute("data-category");
      filtrarYRenderizar();
    });
  });

  // 2. COTIZADOR INTERACTIVO
  const calcTipo = document.getElementById("calcTipo");
  const calcComplejidad = document.getElementById("calcComplejidad");
  const calcUrgencia = document.getElementById("calcUrgencia");
  const calcTotal = document.getElementById("calcTotal");
  const calcTiempo = document.getElementById("calcTiempo");
  const btnLlevarAlFormulario = document.getElementById("btnLlevarAlFormulario");

  function calcularPresupuesto() {
    if (!calcTipo || !calcComplejidad || !calcUrgencia) return;

    const base = Number(calcTipo.value);
    const complejidad = Number(calcComplejidad.value);
    const urgencia = Number(calcUrgencia.value);

    const total = Math.round(base * complejidad * urgencia);
    calcTotal.innerHTML = `$${total.toLocaleString()} USD`;

    let semanas = "4 - 8 Semanas";
    if (urgencia > 1) semanas = "2 - 4 Semanas (Prioritaria)";
    else if (urgencia < 1) semanas = "8 - 12 Semanas";
    calcTiempo.innerHTML = semanas;
  }

  if (calcTipo && calcComplejidad && calcUrgencia) {
    calcTipo.addEventListener("change", calcularPresupuesto);
    calcComplejidad.addEventListener("change", calcularPresupuesto);
    calcUrgencia.addEventListener("change", calcularPresupuesto);
    calcularPresupuesto();
  }

  if (btnLlevarAlFormulario) {
    btnLlevarAlFormulario.addEventListener("click", () => {
      const selectEl = document.getElementById("formServicioSelect");
      const mensajeEl = document.getElementById("formMensaje");
      
      if (selectEl) selectEl.value = "Cotizador Interactivo Web";
      if (mensajeEl) {
        mensajeEl.value = `Hola, realicé una estimación en el cotizador interactivo de la web con un valor aproximado de ${calcTotal.textContent} y un plazo de ${calcTiempo.textContent}. Me gustaría agendar una reunión técnica para avanzar.`;
      }

      mostrarToast("¡Estimación cargada en el formulario de contacto!", "info");
      const contactoSec = document.getElementById("contacto");
      if (contactoSec) contactoSec.scrollIntoView({ behavior: 'smooth' });
    });
  }

  // 3. FAQ ACORDEÓN
  const faqQuestions = document.querySelectorAll(".faq-question");
  faqQuestions.forEach(btn => {
    btn.addEventListener("click", () => {
      const item = btn.parentElement;
      const isAlreadyActive = item.classList.contains("active");

      document.querySelectorAll(".faq-item").forEach(i => i.classList.remove("active"));

      if (!isAlreadyActive) {
        item.classList.add("active");
      }
    });
  });

  // 4. MODAL DETALLE
  const serviceDetailModal = document.getElementById("serviceDetailModal");
  const closeDetailBtn = document.getElementById("closeDetailBtn");
  const serviceDetailContent = document.getElementById("serviceDetailContent");

  function asignarEventosDetalle() {
    document.querySelectorAll(".btn-open-detail").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const targetBtn = e.target.closest(".btn-open-detail");
        const id = Number(targetBtn.getAttribute("data-id"));
        const servicio = serviciosData.find(s => s.id === id);

        if (servicio && serviceDetailModal && serviceDetailContent) {
          const entregablesHTML = servicio.entregables 
            ? `<ul class="service-details-list">${servicio.entregables.map(item => `<li>${item}</li>`).join('')}</ul>`
            : '<p class="form-status-msg">Consulte los entregables específicos en la propuesta comercial.</p>';

          const stackHTML = servicio.stackTecnologico
            ? `<div style="display:flex; gap:0.5rem; flex-wrap:wrap; margin-top:0.5rem;">
                ${servicio.stackTecnologico.map(st => `<span style="background:rgba(37,99,235,0.2); border:1px solid rgba(96,165,250,0.3); color:#93C5FD; padding:0.2rem 0.6rem; border-radius:6px; font-size:0.8rem; font-weight:600;">${st}</span>`).join('')}
               </div>`
            : '';

          serviceDetailContent.innerHTML = `
            <img src="${servicio.imagen || 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1000&q=80'}" class="modal-detail-banner" alt="${servicio.titulo}">
            <span class="sub-title">${servicio.categoria}</span>
            <h2>${servicio.titulo}</h2>
            <p style="color: var(--text-secondary); margin-top: 0.5rem; font-size: 0.95rem;">${servicio.descripcion}</p>

            <div class="detail-meta-grid">
              <div class="detail-meta-item">
                <strong>Tiempo Estimado</strong>
                <span>${servicio.tiempoEstimado || '3 - 6 Semanas'}</span>
              </div>
              <div class="detail-meta-item">
                <strong>Casos de Uso</strong>
                <span>${servicio.casosUso || 'Empresas en escalabilidad y transformación digital.'}</span>
              </div>
            </div>

            ${servicio.retornoInversion ? `
              <div style="background:rgba(52,211,153,0.08); border:1px solid rgba(52,211,153,0.2); padding:0.9rem; border-radius:10px; margin-bottom:1.2rem;">
                <strong style="color:#34D399; font-size:0.82rem; display:block; text-transform:uppercase; letter-spacing:1px;">Impacto & Retorno de Inversión (ROI)</strong>
                <p style="color:#D1FAE5; font-size:0.9rem; margin-top:0.2rem;">${servicio.retornoInversion}</p>
              </div>
            ` : ''}

            <h4 class="detail-section-title">Entregables Clave</h4>
            ${entregablesHTML}

            ${servicio.stackTecnologico ? `
              <h4 class="detail-section-title">Stack Tecnológico Especializado</h4>
              ${stackHTML