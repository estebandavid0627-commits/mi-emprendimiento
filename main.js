document.addEventListener('DOMContentLoaded', () => {
    // Validación del formulario
    const formulario = document.querySelector('.formulario');
    if (formulario) {
        formulario.addEventListener('submit', (event) => {
            event.preventDefault();
            alert('¡Gracias por tu mensaje! Nos pondremos en contacto contigo pronto.');
            formulario.reset();
        });
    }

    // Botón Volver Arriba
    const btnVolverArriba = document.getElementById('btnVolverArriba');
    if (btnVolverArriba) {
        btnVolverArriba.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
});