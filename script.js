// Registramos el plugin ScrollTrigger de GSAP
gsap.registerPlugin(ScrollTrigger);

const canvas = document.getElementById("juice-canvas");
const context = canvas.getContext("2d");

// Configuramos la cantidad de fotogramas y el índice inicial
// Basado en las imágenes disponibles: de 00022.jpg a 00192.jpg (171 fotogramas)
const frameCount = 171;
const startFrame = 22;

// Función para obtener la ruta correcta de cada imagen
const currentFrame = index => (
    `imagenes/${(index + startFrame).toString().padStart(5, '0')}.jpg`
);

const images = [];
const juice = {
    frame: 0
};

// 1. Precargar las imágenes
for (let i = 0; i < frameCount; i++) {
    const img = new Image();
    img.src = currentFrame(i);
    images.push(img);
}

// 2. Función para dibujar en el canvas asegurando que cubra toda la pantalla sin deformarse (object-fit: cover)
function render() {
    if(!images[juice.frame]) return;
    const img = images[juice.frame];
    
    // Solo dibujar si la imagen ha cargado completamente
    if (img.complete) {
        // Calcular la escala para cubrir todo el canvas (efecto cover)
        const scale = Math.max(canvas.width / img.width, canvas.height / img.height);
        
        // Calcular las coordenadas para centrar la imagen
        const x = (canvas.width / 2) - (img.width / 2) * scale;
        const y = (canvas.height / 2) - (img.height / 2) * scale;
        
        // Limpiar el canvas y dibujar
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(img, x, y, img.width * scale, img.height * scale);
    }
}

// 3. Ajustar el tamaño del canvas cuando se redimensiona la ventana
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    render();
}

window.addEventListener("resize", resizeCanvas);

// 4. Iniciar dibujando el primer frame cuando cargue
images[0].onload = () => {
    resizeCanvas(); // Configura el tamaño y renderiza
};

// 5. Configurar GSAP ScrollTrigger para animar la secuencia de imágenes al hacer scroll
gsap.to(juice, {
    frame: frameCount - 1, // Animar hasta el último frame
    snap: "frame", // Asegurarse de que el valor siempre sea un entero (frame exacto)
    ease: "none",
    scrollTrigger: {
        scrub: 0.5, // Suaviza la transición (0.5 segundos para "alcanzar" al scroll)
        start: "top top", // Comienza cuando la parte superior de la página llega a la parte superior de la ventana
        // end: "bottom bottom", // Termina al final de la página
        end: "+=3500", // La animación durará 3500 pixeles de scroll
    },
    onUpdate: render // Llama a la función render() cada vez que el frame cambia
});

// 6. Animaciones de entrada para las tarjetas de texto (Glassmorphism)
const glassCards = document.querySelectorAll('.glass-card');
glassCards.forEach(card => {
    gsap.to(card, {
        scrollTrigger: {
            trigger: card,
            start: "top 85%", // Disparar cuando la tarjeta esté al 85% del viewport
            toggleClass: "visible",
            once: false // Se puede repetir al subir/bajar (poner a true si solo quieres que pase una vez)
        }
    });
});
