document.addEventListener("DOMContentLoaded", () => {

    // 1. Manejo del Formulario de Contacto
    const formulario = document.getElementById("formularioContacto");

    if (formulario) {
        formulario.addEventListener("submit", (e) => {
            e.preventDefault();

            const nombre = document.getElementById("nombre").value.trim();
            const correo = document.getElementById("correo").value.trim();
            const mensaje = document.getElementById("mensaje").value.trim();

            if (nombre === "" || correo === "" || mensaje === "") {
                alert("⚠️ Por favor, completa todos los campos obligatorios antes de enviar.");
                return;
            }

            alert(`¡Gracias por contactarnos, ${nombre}! 📩\nHemos recibido tu mensaje y te responderemos pronto a ${correo}.`);
            formulario.reset();
        });
    }

    // 2. Botón Volver Arriba (Scroll to Top)
    const btnVolverArriba = document.getElementById("btnVolverArriba");

    if (btnVolverArriba) {
        window.addEventListener("scroll", () => {
            if (window.scrollY > 300) {
                btnVolverArriba.style.display = "block";
            } else {
                btnVolverArriba.style.display = "none";
            }
        });

        btnVolverArriba.addEventListener("click", () => {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        });
    }

});

// 3. Abrir Modal de Detalle de Servicio
function abrirModal(titulo, categoria, precio, descripcion) {
    document.getElementById("modalTitulo").innerText = titulo;
    document.getElementById("modalCategoria").innerText = categoria;
    document.getElementById("modalPrecio").innerText = precio;
    document.getElementById("modalDescripcion").innerText = descripcion;
    document.getElementById("modalDetalle").style.display = "flex";
}

// 4. Cerrar Modal
function cerrarModal() {
    document.getElementById("modalDetalle").style.display = "none";
}

// 5. Acción del botón interno del Modal (Redirige y llena el Formulario)
function seleccionarServicio() {
    const titulo = document.getElementById("modalTitulo").innerText;
    cerrarModal();
    const seccionContacto = document.getElementById("contacto");
    seccionContacto.scrollIntoView({ behavior: 'smooth' });
    
    const campoMensaje = document.getElementById("mensaje");
    if(campoMensaje) {
        campoMensaje.value = `Hola, estoy interesado en contratar el servicio: ${titulo}.`;
        campoMensaje.focus();
    }
}

// 6. Filtrar Servicios por Categoría
function filtrarServicios(categoria) {
    const tarjetas = document.querySelectorAll(".tarjeta");
    const botones = document.querySelectorAll(".btn-filtro");

    botones.forEach(btn => btn.classList.remove("activo"));
    if (event && event.target) {
        event.target.classList.add("activo");
    }

    tarjetas.forEach(tarjeta => {
        if (categoria === "todos" || tarjeta.getAttribute("data-categoria") === categoria) {
            tarjeta.style.display = "flex";
        } else {
            tarjeta.style.display = "none";
        }
    });
}

// 7. Cerrar Modal al hacer clic fuera del contenido flotante
window.onclick = function(event) {
    const modal = document.getElementById("modalDetalle");
    if (event.target === modal) {
        cerrarModal();
    }
}