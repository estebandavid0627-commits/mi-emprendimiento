document.addEventListener("DOMContentLoaded", () => {
  
  const serviciosContainer = document.getElementById("serviciosContainer");
  const filterButtons = document.querySelectorAll(".filter-btn");
  let serviciosData = [];

  // 1. CARGA Y RENDERIZADO DE SERVICIOS
  async function cargarServicios() {
    const localData = localStorage.getItem("orion_servicios");
    
    if (localData) {
      serviciosData = JSON.parse(localData);
      renderizarServicios(serviciosData);
    } else {
      try {
        let response = await fetch("config.json");
        if (!response.ok) response = await fetch("servicios.json");
        if (!response.ok) throw new Error("No se pudo cargar el archivo JSON");
        
        serviciosData = await response.json();
        guardarEnLocalStorage(serviciosData);
        renderizarServicios(serviciosData);
      } catch (error) {
        console.error("Error cargando los servicios:", error);
        if (serviciosContainer) {
          serviciosContainer.innerHTML = `<p class="form-status-msg error">Error al cargar el catálogo de servicios.</p>`;
        }
      }
    }
  }

  function guardarEnLocalStorage(data) {
    localStorage.setItem("orion_servicios", JSON.stringify(data));
  }

  function renderizarServicios(servicios) {
    if (!serviciosContainer) return;
    serviciosContainer.innerHTML = "";

    if (servicios.length === 0) {
      serviciosContainer.innerHTML = `<p class="form-status-msg">No hay soluciones disponibles en esta categoría.</p>`;
      return;
    }

    servicios.forEach(servicio => {
      const card = document.createElement("div");
      card.className = "glass-card";

      const imagenHTML = servicio.imagen 
        ? `<img src="${servicio.imagen}" alt="${servicio.titulo}" class="card-banner-img" loading="lazy">` 
        : `<img src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80" class="card-banner-img">`;

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

  // 2. MODAL DE DETALLE COMPLETO DEL SERVICIO
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

          serviceDetailContent.innerHTML = `
            <img src="${servicio.imagen || 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80'}" class="modal-detail-banner" alt="${servicio.titulo}">
            <span class="sub-title">${servicio.categoria}</span>
            <h2>${servicio.titulo}</h2>
            <p style="color: var(--text-secondary); margin-top: 0.5rem;">${servicio.descripcion}</p>

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

          // Botón dentro del modal para seleccionar directo en el formulario
          document.querySelector(".btn-solicitar-modal").addEventListener("click", (evt) => {
            const serviceTitle = evt.target.closest("button").getAttribute("data-title");
            serviceDetailModal.classList.remove("active");

            const selectEl = document.getElementById("formServicioSelect");
            if (selectEl) {
              for (let i = 0; i < selectEl.options.length; i++) {
                if (selectEl.options[i].value === serviceTitle) {
                  selectEl.selectedIndex = i;
                  break;
                }
              }
            }

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

  // Filtrado de Categorías
  filterButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      filterButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      const categoria = btn.getAttribute("data-category");
      if (categoria === "Todos") {
        renderizarServicios(serviciosData);
      } else {
        const filtrados = serviciosData.filter(s => s.categoria === categoria);
        renderizarServicios(filtrados);
      }
    });
  });

  cargarServicios();

  // 3. FORMULARIO DE CONTACTO
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

  // 4. PANEL ADMINISTRATIVO (CRUD + LOCALSTORAGE)
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

  if (openLoginBtn && loginModal && closeLoginBtn) {
    openLoginBtn.addEventListener("click", (e) => {
      e.preventDefault();
      loginModal.classList.add("active");
    });
    closeLoginBtn.addEventListener("click", () => loginModal.classList.remove("active"));
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
        imagen: imagen || "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80",
        descripcion,
        detalles,
        tiempoEstimado: "2 - 4 Semanas",
        casosUso: "Solución corporativa personalizada.",
        entregables: ["Desarrollo e integración completa", "Documentación técnica"]
      };

      serviciosData.push(nuevoServicio);
      guardarEnLocalStorage(serviciosData);
      renderizarServicios(serviciosData);

      addServiceForm.reset();
      alert("¡Servicio publicado y guardado en catálogo!");
    });
  }

  function renderizarListaAdmin() {
    if (!adminServicesContainer) return;
    adminServicesContainer.innerHTML = "";

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
        renderizarServicios(serviciosData);
      });
    });
  }

  // 5. CHATBOT CON IA POTENCIADO Y CHIPS DE PREGUNTAS RÁPIDAS
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

  // Evento para chips de preguntas rápidas
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
    setTimeout(() => {
      appendMessage(procesarConsultaIA(texto), "bot-msg");
    }, 500);
  }

  function appendMessage(text, className) {
    const msgDiv = document.createElement("div");
    msgDiv.className = `chat-msg ${className}`;
    msgDiv.innerHTML = `<p>${text}</p>`;
    chatbotMessages.appendChild(msgDiv);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
  }

  function procesarConsultaIA(consulta) {
    const texto = consulta.toLowerCase();

    if (texto.includes("pwa") || texto.includes("web") || texto.includes("software")) {
      return "En **Desarrollo Web & Software** construimos PWAs de alto rendimiento y arquitecturas Cloud. Tiempo promedio: 4-8 semanas. ¿Deseas solicitar una cotización inicial?";
    } else if (texto.includes("ia") || texto.includes("llm") || texto.includes("asistente")) {
      return "Con nuestra solución de **Integración de IA & LLMs**, desarrollamos agentes conversacionales conectados a tus documentos internos (RAG) e integración con OpenAI / Gemini.";
    } else if (texto.includes("ciberseguridad") || texto.includes("pentesting") || texto.includes("seguridad")) {
      return "Ofrecemos **Pentesting & Cumplimiento Normativo** para auditar vulnerabilidades bajo OWASP Top 10 e implementar políticas Zero-Trust.";
    } else if (texto.includes("dato") || texto.includes("bi") || texto.includes("dashboard")) {
      return "Desarrollamos **Executive Dashboards** y modelos de datos para juntas directivas y análisis financiero predictivo.";
    } else if (texto.includes("hola") || texto.includes("buenos") || texto.includes("saludos")) {
      return "¡Hola! Bienvenido a Orion Digital Partners. Puedes usar las sugerencias rápidas abajo o preguntarme sobre cualquier servicio o tiempo de desarrollo.";
    } else if (texto.includes("precio") || texto.includes("costo") || texto.includes("cotiz")) {
      return "Cada proyecto se evalúa según su alcance técnico. Puedes seleccionar el servicio de tu interés en la sección **Contacto** para recibir un desglose detallado.";
    } else {
      return "Contamos con 8 áreas clave de soluciones: Desarrollo Web, Estrategia de Datos, RPA, Ciberseguridad, DevOps, BI, Integración de IA y Pentesting. ¿Sobre cuál te gustaría profundizar?";
    }
  }

});