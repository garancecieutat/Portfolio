let lastScrollY = window.scrollY;
let ticking = false; 

function updateLogoPosition(scrollTop) {
  const scrollLogo = document.getElementById('scroll-logo');

  if (scrollLogo) {
    if (scrollTop > lastScrollY) {
      scrollLogo.src = "img/logo_mouvement_droite.png";
    } else if (scrollTop < lastScrollY) {
      scrollLogo.src = "img/logo_mouvement_gauche.png";
    }

    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) : 0;
    const maxX = window.innerWidth - scrollLogo.offsetWidth;
    const newLeft = scrollPercent * maxX;

    scrollLogo.style.left = `${newLeft}px`;
  }
  
  lastScrollY = scrollTop;
}

window.addEventListener('scroll', function() {
  if (!ticking) {
    window.requestAnimationFrame(function() {
      updateLogoPosition(window.scrollY);
      ticking = false;
    });
    ticking = true;
  }
});


// --- 2. NOUVELLE LIGHTBOX MASONRY (AVEC MULTI-IMAGES) ---
const masonryItems = document.querySelectorAll('.masonry-item');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxTitle = document.getElementById('lightbox-title');
const lightboxTagsContainer = document.getElementById('lightbox-tags');
const closeBtn = document.getElementById('close-lightbox');

// Nouveaux éléments pour les flèches
const prevBtn = document.getElementById('prev-lb');
const nextBtn = document.getElementById('next-lb');

let lbImages = []; // Stockera la liste des images (finale + croquis)
let lbIndex = 0;   // L'image qu'on est en train de regarder

// Fonction qui met à jour l'image et affiche/cache les flèches
function updateLightbox() {
  lightboxImg.src = lbImages[lbIndex];
  
  // Si on est à la première image, on cache la flèche gauche
  prevBtn.style.display = lbIndex === 0 ? 'none' : 'flex';
  // Si on est à la dernière image, on cache la flèche droite
  nextBtn.style.display = lbIndex === lbImages.length - 1 ? 'none' : 'flex';
}

if (masonryItems.length > 0 && lightbox) {
  
  masonryItems.forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      const title = item.getAttribute('data-title') || 'Sans titre';
      const tags = item.getAttribute('data-tags');
      const dataImages = item.getAttribute('data-images');

      // 1. Est-ce qu'il y a plusieurs images (data-images existe) ?
      if (dataImages) {
        lbImages = dataImages.split(',').map(url => url.trim());
        lbIndex = 0; // On commence toujours par la première image
      } else {
        // Sinon, c'est une image unique
        lbImages = [img.src];
        lbIndex = 0;
      }

      // 2. Met à jour l'image et gère l'affichage des flèches
      updateLightbox();

      // 3. Met à jour le titre
      lightboxTitle.textContent = title;

      // 4. Crée les petits badges (tags)
      lightboxTagsContainer.innerHTML = ''; 
      if (tags) {
        const tagsArray = tags.split(','); 
        tagsArray.forEach(tag => {
          const span = document.createElement('span');
          span.className = 'tag';
          span.textContent = tag.trim(); 
          lightboxTagsContainer.appendChild(span);
        });
      }

      // 5. Ouvre la lightbox
      lightbox.style.display = 'flex';
      document.body.style.overflow = 'hidden'; 
    });
  });

  // Action Flèche Droite
  nextBtn.addEventListener('click', (e) => {
    e.stopPropagation(); // Empêche le clic de fermer la lightbox
    if (lbIndex < lbImages.length - 1) {
      lbIndex++;
      updateLightbox();
    }
  });

  // Action Flèche Gauche
  prevBtn.addEventListener('click', (e) => {
    e.stopPropagation(); // Empêche le clic de fermer la lightbox
    if (lbIndex > 0) {
      lbIndex--;
      updateLightbox();
    }
  });

  // Fermer la lightbox (croix)
  closeBtn.addEventListener('click', () => {
    lightbox.style.display = 'none';
    document.body.style.overflow = '';
  });

  // Fermer la lightbox (clic dans le vide noir)
  lightbox.addEventListener('click', (e) => {
    // Si on clique sur le fond noir ou la zone blanche, mais PAS sur les flèches
    if (e.target === lightbox || e.target.classList.contains('lightbox-content-wrapper')) {
      lightbox.style.display = 'none';
      document.body.style.overflow = '';
    }
  });

  // Contrôle au clavier (Échap, Flèches Gauche/Droite)
  document.addEventListener('keydown', (e) => {
    if (lightbox.style.display === 'flex') {
      if (e.key === 'Escape') {
        lightbox.style.display = 'none';
        document.body.style.overflow = '';
      } else if (e.key === 'ArrowRight' && lbIndex < lbImages.length - 1) {
        lbIndex++;
        updateLightbox();
      } else if (e.key === 'ArrowLeft' && lbIndex > 0) {
        lbIndex--;
        updateLightbox();
      }
    }
  });
}
