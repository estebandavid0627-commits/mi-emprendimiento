document.addEventListener("DOMContentLoaded", () => {
  
  const serviciosContainer = document.getElementById("serviciosContainer");
  const filterButtons = document.querySelectorAll(".filter-btn");
  let serviciosData = [];

  // 1. CARGA DE SERVICIOS (DESDE LOCALSTORAGE O ARCHIVO JSON)
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
          serviciosContainer.innerHTML = `<p class="form-status-msg error">Error al cargar el catálogo.</p>`;
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
      serviciosContainer.innerHTML = `<p class="form-status-msg">No hay servicios registrados en esta categoría.</p>`;
      return;
    }

    servicios.forEach(servicio => {
      const card = document.createElement("div");
      card.className = "glass-card";

      const detallesHTML = (servicio.detalles && servicio.detalles.length > 0)
        ? `<ul class="service-details-list">${servicio.detalles.map(d => `<li>${d}</li>`).join('')}</ul>` 
        : '';

      card.innerHTML = `
        <div class="icon-wrapper"><i data-lucide="${servicio.icono || 'code-2'}"></i></div>
        <h3>${servicio.titulo}</h3>
        <p>${servicio.descripcion}</p>
        ${detallesHTML}
        <div class="card-footer-link">Ver alcance <i data-lucide="chevron-right"></i></div>
      `;

      serviciosContainer.appendChild(card);
    });

    if (window.lucide) lucide.createIcons();
    renderizarListaAdmin();
  }

  // Filtrado
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

  // 2. FORMULARIO DE CONTACTO (FORMSPREE)
  const form = document.getElementById("formularioContacto");
  const status = document.getElementById("form-status");
  const btnEnviar = document.getElementById("btnEnviar");

  if (form) {
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      if (btnEnviar) btnEnviar.disabled = true;
      status.className = "form-status-msg";
      status.innerHTML = "Enviando...";

      try {
        const response = await fetch(form.action, {
          method: "POST",
          body: new FormData(form),
          headers: { 'Accept': 'application/json' }
        });

        if (response.ok) {
          status.className = "form-status-msg success";
          status.innerHTML = "¡Gracias! Consulta enviada con éxito.";
          form.reset();
        } else {
          status.className = "form-status-msg error";
          status.innerHTML = "Ocurrió un error al enviar.";
        }
      } catch (error) {
        status.className = "form-status-msg error";
        status.innerHTML = "Error de conexión.";
      } finally {
        if (btnEnviar) btnEnviar.disabled = false;
      }
    });
  }

  // 3. MODAL Y DASHBOARD ADMINISTRATIVO (CRUD)
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

    closeLoginBtn.addEventListener("click", () => {
      loginModal.classList.remove("active");
    });
  }

  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const user = document.getElementById("adminUser").value;
      const pass = document.getElementById("adminPass").value;

      if (user === "admin@orion.com" && pass === "orion2026") {
        loginStatus.className = "form-status-msg success";
        loginStatus.innerHTML = "Acceso concedido...";
        setTimeout(() => {
          loginForm.reset();
          loginStatus.innerHTML = "";
          adminLoginFormView.style.display = "none";
          adminDashboardView.style.display = "block";
          renderizarListaAdmin();
        }, 800);
      } else {
        loginStatus.className = "form-status-msg error";
        loginStatus.innerHTML = "Credenciales incorrectas (admin@orion.com / orion2026)";
      }
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      adminDashboardView.style.display = "none";
      adminLoginFormView.style.display = "block";
    });
  }

  // AGREGAR NUEVO SERVICIO (CREATE)
  if (addServiceForm) {
    addServiceForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const titulo = document.getElementById("newTitle").value.trim();
      const categoria = document.getElementById("newCategory").value;
      const icono = document.getElementById("newIcon").value;
      const descripcion = document.getElementById("newDesc").value.trim();
      const detallesRaw = document.getElementById("newDetails").value.trim();

      const detalles = detallesRaw ? detallesRaw.split(",").map(d => d.trim()) : [];

      const nuevoServicio = {
        id: Date.now(),
        titulo,
        categoria,
        icono,
        descripcion,
        detalles
      };

      serviciosData.push(nuevoServicio);
      guardarEnLocalStorage(serviciosData);
      renderizarServicios(serviciosData);

      addServiceForm.reset();
      alert("¡Servicio agregado con éxito!");
    });
  }

  // RENDERIZAR Y ELIMINAR SERVICIOS DESDE EL PANEL (DELETE)
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

    // Eventos de eliminación
    document.querySelectorAll(".btn-delete").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const idToDelete = Number(e.target.getAttribute("data-id"));
        serviciosData = serviciosData.filter(s => s.id !== idToDelete);
        guardarEnLocalStorage(serviciosData);
        renderizarServicios(serviciosData);
      });
    });
  }

  // 4. CHATBOT CON IA
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

  if (chatbotForm) {
    chatbotForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const userText = chatbotInput.value.trim();
      if (!userText) return;

      appendMessage(userText, "user-msg");
      chatbotInput.value = "";

      setTimeout(() => {
        appendMessage(procesarConsultaIA(userText), "bot-msg");
      }, 500);
    });
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
    if (texto.includes("web") || texto.includes("software") || texto.includes("página")) {
      return "En **Desarrollo Web & Software** construimos soluciones a medida con estándares modernos.";
    } else if (texto.includes("dato") || texto.includes("analitica")) {
      return "Ofrecemos tableros BI y modelos econométricos para optimizar tus decisiones de negocio.";
    } else if (texto.includes("seguridad") || texto.includes("hack")) {
      return "Implementamos arquitecturas Zero-Trust e inmutabilidad para blindar tu información.";
    } else if (texto.includes("hola") || texto.includes("buenos")) {
      return "¡Hola! ¿En qué servicio de Orion Digital Partners estás interesado hoy?";
    } else {
      return "En Orion Digital Partners ofrecemos soluciones en software, datos, ciberseguridad y automatización. ¡Agenda tu diagnóstico gratuito en el formulario de contacto!";
    }
  }

});