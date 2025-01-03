document.addEventListener('DOMContentLoaded', function () {
  //Script barra de navegación
  NavScript();
  ScrollToTopScript();
  // AnimationCards();
  // callModal();

  // Select the checkbox for change body
  const checkbox = document.querySelector('.input');
  const body = document.body;

  // Escuchar el evento "change" del checkbox
  checkbox.addEventListener('change', () => {
    if (checkbox.checked) {
      // Activar modo oscuro
      body.classList.add('dark-mode');
    } else {
      // Desactivar modo oscuro
      body.classList.remove('dark-mode');
    }
  });
});

//Info for projects
const projectData = {
  1: {
    img: './src/assets/letsbesec_img.png',
    category: 'Let’s Be Encrypt',
    heading: 'Encriptamiento de contraseñas Online',
    resume: 'Proyecto enfocado en encriptar contraseñas de manera segura.',
    autor: 'ALEROC FEB 2024',
    url: './views/letsBeSecure.html',
  },
};

//functions

function NavScript() {
  const menu = document.querySelector('.nav__menu');
  const menuList = document.querySelector('.nav__list');
  const links = document.querySelectorAll('.nav__link');
  const body = document.body;

  // Detecta si estás en index.html o en otra vista
  const isIndex =
    window.location.pathname.endsWith('index.html') ||
    window.location.pathname === '/';

  // Define rutas según la ubicación actual
  const menuOpenImage = isIndex
    ? './src/assets/iconClose.png'
    : '../src/assets/iconClose.png';
  const menuCloseImage = isIndex
    ? './src/icons/menu.svg'
    : '../src/icons/menu.svg';

  menu.addEventListener('click', function () {
    // Alternar el menú desplegable
    menuList.classList.toggle('nav__list--show');
    body.classList.toggle('no-scroll');

    // Cambiar la imagen según el estado
    if (menuList.classList.contains('nav__list--show')) {
      menu.src = menuOpenImage; // Cambiar a la imagen de "menú abierto"
    } else {
      menu.src = menuCloseImage; // Cambiar a la imagen de "menú cerrado"
    }
  });

  links.forEach(function (link) {
    link.addEventListener('click', function () {
      menuList.classList.remove('nav__list--show');
      body.classList.remove('no-scroll');
      menu.src = menuCloseImage; // Asegurar que vuelve a la imagen de "menú cerrado"
    });
  });
}

function ScrollToTopScript() {
  const scrollToTopButton = document.getElementById('scrollToTop');

  // Mostrar/ocultar el botón según el scroll
  window.addEventListener('scroll', function () {
    if (window.scrollY > 300) {
      scrollToTopButton.classList.add('visible'); // Agrega la clase para mostrar el botón
    } else {
      scrollToTopButton.classList.remove('visible'); // Remueve la clase para ocultarlo
    }
  });

  // Acción al hacer clic en el botón
  scrollToTopButton.addEventListener('click', function () {
    window.scrollTo({
      top: 0,
      behavior: 'smooth', // Desplazamiento suave
    });
  });
}

// Función para cargar información en el modal
function LoadInfoModal(projectId) {
  const data = projectData[projectId];

  if (!data) return; // Si no hay datos para el proyecto, no hace nada

  // Seleccionar elementos del modal
  const modalImage = document.getElementById('modal-image');
  const modalCategory = document.getElementById('modal-category');
  const modalHeading = document.getElementById('modal-heading');
  const modalResume = document.getElementById('modal-resume');
  const modalAutor = document.getElementById('modal-autor');
  const modalButton = document.getElementById('modal-button');

  // Actualizar el contenido del modal
  if (modalImage) modalImage.src = data.img || 'default-image.jpg';
  if (modalCategory)
    modalCategory.textContent = data.category || 'Sin categoría';
  if (modalHeading) modalHeading.textContent = data.heading || 'Sin título';
  if (modalResume) modalResume.textContent = data.resume || 'Sin resumen';
  if (modalAutor) modalAutor.textContent = data.autor || 'Autor desconocido';
  if (modalButton) {
    modalButton.textContent = 'Ir a la página';
    modalButton.onclick = function () {
      location.href = data.url || '#';
    };
  }
}

// Escuchar clics en las tarjetas de proyectos
document.querySelectorAll('.proyect-card').forEach((card) => {
  card.addEventListener('click', () => {
    const projectId = card.getAttribute('data-value');
    LoadInfoModal(projectId); // Llama la función con el ID del proyecto
  });
});

function callModal() {
  document.getElementById('loadModalTrigger').addEventListener('click', () => {
    // Carga el modal desde otro archivo
    fetch('./app/components/modal.html') // Ruta del archivo HTML que contiene el modal
      .then((response) => response.text())
      .then((data) => {
        // Inserta el contenido del modal en el contenedor
        document.getElementById('modalContainer').innerHTML = data;

        // Inicializa y muestra el modal
        const modal = new bootstrap.Modal(
          document.getElementById('proyectModal')
        );
        modal.show();
      })
      .catch((error) => console.error('Error al cargar el modal:', error));
  });
}

// function AnimationCards(){
//   // Card hover animation following the pointer
//   const cards = document.querySelectorAll('#projects .card');
//   cards.forEach(card => {
//       card.addEventListener('mousemove', function(e) {
//           const rect = card.getBoundingClientRect();
//           const x = e.clientX - rect.left;
//           const y = e.clientY - rect.top;
//           card.style.transform = `perspective(1000px) rotateY(${(x - rect.width / 2) / 20}deg) rotateX(${-(y - rect.height / 2) / 20}deg)`;
//       });
//       card.addEventListener('mouseleave', function() {
//           card.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg)';
//       });
//   });
// }
