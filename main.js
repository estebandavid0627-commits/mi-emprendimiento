// Esperar a que el DOM esté completamente cargado
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
        // Mostrar u ocultar el botón según la posición del scroll
        window.addEventListener("scroll", () => {
            if (window.scrollY > 300) {
                btnVolverArriba.style.display = "block";
            } else {
                btnVolverArriba.style.display = "none";
            }
        });

        // Acción al hacer clic en el botón
        btnVolverArriba.addEventListener("click", () => {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        });
    }

});

// 3. Función para ver el detalle de los servicios en el Catálogo
function verDetalle(titulo, descripcion) {
    alert(`📌 DETALLE DEL SERVICIO:\n\n• Servicio: ${titulo}\n• Incluye: ${descripcion}`);
}