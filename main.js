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

  // 1. CARGA DE SERVICIOS DIRECTOS
  function cargarServicios() {
    serviciosData = [
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

    guardarEnLocalStorage(serviciosData);
    filtrarYRenderizar();
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

            <h4 class="detail-section-title">Entregables Clave</h4>
            ${entregablesHTML}

            <div style="margin-top: 2rem;">
              <button class="btn-primary btn-block btn-solicitar-modal" data-title="${servicio.titulo}">
                Solicitar Cotización de este Servicio <i data-lucide="arrow-right"></i>
              </button>
            </div>
          `;

          if (window.lucide) lucide.createIcons();
          serviceDetailModal.classList.add("active");

          document.querySelector(".btn-solicitar-modal").addEventListener("click", (evt) => {
            const serviceTitle = evt.target.closest("button").getAttribute("data-title");
            serviceDetailModal.classList.remove("active");

            const selectEl = document.getElementById("formServicioSelect");
            if (selectEl) {
              for (let i = 0; i < selectEl.options.length; i++) {
                if (selectEl.options[i].value.toLowerCase().includes(serviceTitle.toLowerCase().slice(0, 10))) {
                  selectEl.selectedIndex = i;
                  break;
                }
              }
            }

            mostrarToast("¡Servicio seleccionado para cotización!", "info");
            const contactoSec = document.getElementById("contacto");
            if (contactoSec) contactoSec.scrollIntoView({ behavior: 'smooth' });
          });
        }
      });
    });
  }

  if (closeDetailBtn && serviceDetailModal) {
    closeDetailBtn.addEventListener("click", () => serviceDetailModal.classList.remove("active"));
    serviceDetailModal.addEventListener("click", (e) => {
      if (e.target === serviceDetailModal) serviceDetailModal.classList.remove("active");
    });
  }

  cargarServicios();

  // 5. FORMULARIO CONTACTO
  const form = document.getElementById("formularioContacto");
  const status = document.getElementById("form-status");
  const btnEnviar = document.getElementById("btnEnviar");

  if (form) {
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      if (btnEnviar) btnEnviar.disabled = true;
      status.className = "form-status-msg";
      status.innerHTML = "Enviando tu solicitud...";

      try {
        const response = await fetch(form.action, {
          method: "POST",
          body: new FormData(form),
          headers: { 'Accept': 'application/json' }
        });

        if (response.ok) {
          status.className = "form-status-msg success";
          status.innerHTML = "¡Excelente! Un consultor de Orion Digital Partners te contactará a la brevedad.";
          mostrarToast("¡Mensaje enviado con éxito!", "success");
          form.reset();
        } else {
          status.className = "form-status-msg error";
          status.innerHTML = "No se pudo procesar la solicitud en este momento.";
        }
      } catch (error) {
        status.className = "form-status-msg error";
        status.innerHTML = "Error de conexión. Verifica tu acceso a internet.";
      } finally {
        if (btnEnviar) btnEnviar.disabled = false;
      }
    });
  }

  // 6. DASHBOARD ADMIN
  const openLoginBtn = document.getElementById("openLoginBtn");
  const closeLoginBtn = document.getElementById("closeLoginBtn");
  const loginModal = document.getElementById("loginModal");
  const loginForm = document.getElementById("loginForm");
  const loginStatus = document.getElementById("loginStatus");
  const adminLoginFormView = document.getElementById("adminLoginFormView");
  const adminDashboardView = document.getElementById("adminDashboardView");
  const logoutBtn = document.getElementById("logoutBtn");
  const addServiceForm = document.getElementById("addServiceForm");
  const adminServicesContainer = document.getElementById("adminServicesContainer");
  
  const tabServiciosBtn = document.getElementById("tabServiciosBtn");
  const tabLeadsBtn = document.getElementById("tabLeadsBtn");
  const panelServiciosContent = document.getElementById("panelServiciosContent");
  const panelLeadsContent = document.getElementById("panelLeadsContent");
  const statCountServices = document.getElementById("statCountServices");

  if (openLoginBtn && loginModal && closeLoginBtn) {
    openLoginBtn.addEventListener("click", (e) => {
      e.preventDefault();
      loginModal.classList.add("active");
    });
    closeLoginBtn.addEventListener("click", () => loginModal.classList.remove("active"));
  }

  if (tabServiciosBtn && tabLeadsBtn) {
    tabServiciosBtn.addEventListener("click", () => {
      tabServiciosBtn.classList.add("active");
      tabLeadsBtn.classList.remove("active");
      panelServiciosContent.style.display = "block";
      panelLeadsContent.style.display = "none";
    });

    tabLeadsBtn.addEventListener("click", () => {
      tabLeadsBtn.classList.add("active");
      tabServiciosBtn.classList.remove("active");
      panelServiciosContent.style.display = "none";
      panelLeadsContent.style.display = "block";
    });
  }

  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const user = document.getElementById("adminUser").value;
      const pass = document.getElementById("adminPass").value;

      if (user === "admin@orion.com" && pass === "orion2026") {
        loginStatus.className = "form-status-msg success";
        loginStatus.innerHTML = "Sesión iniciada correctamente.";
        setTimeout(() => {
          loginForm.reset();
          loginStatus.innerHTML = "";
          adminLoginFormView.style.display = "none";
          adminDashboardView.style.display = "block";
          mostrarToast("¡Bienvenido al Panel Admin!", "success");
          renderizarListaAdmin();
        }, 800);
      } else {
        loginStatus.className = "form-status-msg error";
        loginStatus.innerHTML = "Credenciales inválidas. Usa admin@orion.com / orion2026";
      }
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      adminDashboardView.style.display = "none";
      adminLoginFormView.style.display = "block";
      mostrarToast("Sesión cerrada correctamente", "info");
    });
  }

  if (addServiceForm) {
    addServiceForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const titulo = document.getElementById("newTitle").value.trim();
      const categoria = document.getElementById("newCategory").value;
      const icono = document.getElementById("newIcon").value;
      const descripcion = document.getElementById("newDesc").value.trim();
      const detallesRaw = document.getElementById("newDetails").value.trim();
      const imagen = document.getElementById("newImg").value.trim();

      const detalles = detallesRaw ? detallesRaw.split(",").map(d => d.trim()) : [];

      const nuevoServicio = {
        id: Date.now(),
        titulo,
        categoria,
        icono,
        imagen: imagen || "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1000&q=80",
        descripcion,
        detalles,
        tiempoEstimado: "2 - 4 Semanas",
        casosUso: "Solución corporativa personalizada.",
        entregables: ["Desarrollo e integración completa", "Documentación técnica"]
      };

      serviciosData.push(nuevoServicio);
      guardarEnLocalStorage(serviciosData);
      filtrarYRenderizar();

      addServiceForm.reset();
      mostrarToast("¡Servicio publicado en el catálogo con éxito!", "success");
    });
  }

  function renderizarListaAdmin() {
    if (!adminServicesContainer) return;
    adminServicesContainer.innerHTML = "";
    if (statCountServices) statCountServices.textContent = `${serviciosData.length} Soluciones`;

    serviciosData.forEach(servicio => {
      const row = document.createElement("div");
      row.className = "admin-item-row";
      row.innerHTML = `
        <span><strong>${servicio.titulo}</strong> (${servicio.categoria})</span>
        <button class="btn-delete" data-id="${servicio.id}">Eliminar</button>
      `;
      adminServicesContainer.appendChild(row);
    });

    document.querySelectorAll(".btn-delete").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const idToDelete = Number(e.target.getAttribute("data-id"));
        serviciosData = serviciosData.filter(s => s.id !== idToDelete);
        guardarEnLocalStorage(serviciosData);
        filtrarYRenderizar();
        mostrarToast("Servicio eliminado del catálogo", "info");
      });
    });
  }

  // 7. MOTOR DE IA PRO
  const chatbotToggleBtn = document.getElementById("chatbotToggleBtn");
  const chatbotCloseBtn = document.getElementById("chatbotCloseBtn");
  const chatbotBox = document.getElementById("chatbotBox");
  const chatbotForm = document.getElementById("chatbotForm");
  const chatbotInput = document.getElementById("chatbotInput");
  const chatbotMessages = document.getElementById("chatbotMessages");

  if (chatbotToggleBtn && chatbotBox && chatbotCloseBtn) {
    chatbotToggleBtn.addEventListener("click", () => chatbotBox.classList.toggle("active"));
    chatbotCloseBtn.addEventListener("click", () => chatbotBox.classList.remove("active"));
  }

  document.querySelectorAll(".chip-btn").forEach(chip => {
    chip.addEventListener("click", () => {
      const query = chip.getAttribute("data-query");
      procesarEntradaChat(query);
    });
  });

  if (chatbotForm) {
    chatbotForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const userText = chatbotInput.value.trim();
      if (!userText) return;
      procesarEntradaChat(userText);
      chatbotInput.value = "";
    });
  }

  function procesarEntradaChat(texto) {
    appendMessage(texto, "user-msg");
    
    const typingId = "typing_" + Date.now();
    appendMessage("Pensando respuesta técnica...", "bot-msg", typingId);

    setTimeout(() => {
      const typingEl = document.getElementById(typingId);
      if (typingEl) typingEl.remove();
      
      const respuestaIA = generarRespuestaIAPro(texto);
      appendMessage(respuestaIA, "bot-msg");
    }, 800);
  }

  function appendMessage(text, className, customId = "") {
    const msgDiv = document.createElement("div");
    msgDiv.className = `chat-msg ${className}`;
    if (customId) msgDiv.id = customId;
    msgDiv.innerHTML = `<p>${text}</p>`;
    chatbotMessages.appendChild(msgDiv);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
  }

  function generarRespuestaIAPro(consulta) {
    const q = consulta.toLowerCase();

    if (q.includes("api") || q.includes("fetch") || q.includes("axios")) {
      return `Para consumir **APIs RESTful en React** de forma óptima, utilizamos el Hook <code>useEffect</code> junto con <code>async/await</code> dentro de <code>fetch</code> o Axios:
      <pre><code>useEffect(() => {
  const fetchData = async () => {
    try {
      const res = await fetch('https://api.ejemplo.com/data');
      const data = await res.json();
      setData(data);
    } catch (error) {
      console.error("Error al consumir API", error);
    }
  };
  fetchData();
}, []);</code></pre>`;
    } 
    else if (q.includes("node") || q.includes("express") || q.includes("backend")) {
      return `En el backend desarrollamos servidores robustos con **Node.js y Express**. Estructuramos rutas y controladores limpios:
      <pre><code>const express = require('express');
const app = express();
app.use(express.json());

app.get('/api/servicios', (req, res) => {
  res.json({ status: 'success', data: [] });
});

app.listen(5000, () => console.log('Servidor corriendo en puerto 5000'));</code></pre>`;
    } 
    else if (q.includes("mongo") || q.includes("base de datos") || q.includes("crud")) {
      return `Para la persistencia con **MongoDB y Mongoose**, definimos esquemas tipados y ejecutamos operaciones CRUD asíncronas de alto rendimiento:
      <pre><code>const ServiceSchema = new mongoose.Schema({
  titulo: { type: String, required: true },
  categoria: String,
  activo: { type: Boolean, default: true }
});
const Service = mongoose.model('Service', ServiceSchema);</code></pre>`;
    } 
    else if (q.includes("hook") || q.includes("usestate") || q.includes("useeffect")) {
      return `Los **React Hooks** permiten gestionar estado y ciclos de vida sin clases. El <code>useState</code> controla el estado reactivo y <code>useEffect</code> maneja efectos secundarios como llamadas a APIs o suscripciones.`;
    } 
    else {
      return `En **Orion Digital Partners** diseñamos arquitecturas MERN completas (MongoDB, Express, React, Node.js). ¿Te gustaría profundizar en algún componente de Frontend, integración de APIs o seguridad Backend?`;
    }
  }

});