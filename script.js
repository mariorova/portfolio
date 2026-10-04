// Caricamento automatico progetti da GitHub con pulsante per l'anteprima video
async function fetchGitHubProjects() {
    const username = 'mariorova';
    const container = document.getElementById('github-projects-container');

    try {
        const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated`);
        const repos = await response.json();

        container.innerHTML = '';
        const filteredRepos = repos.filter(repo => repo.name !== 'portfolio' && !repo.fork);

        if (filteredRepos.length === 0) {
            container.innerHTML = '<p>Nessun progetto trovato.</p>';
            return;
        }

        filteredRepos.forEach(repo => {
            const card = document.createElement('div');
            card.className = 'project-card';

            let previewSectionHTML = '';
            let previewButtonHTML = '';

            const repoNameUpper = repo.name.toUpperCase();
            const repoDesc = (repo.description || '').toUpperCase();

            if (repoNameUpper.includes('SN4M') || repoDesc.includes('SN4M')) {
                previewSectionHTML = `
                    <div class="project-preview hidden-preview" id="preview-${repo.name}">
                        <video src="assets/SN4M_test.mp4" autoplay loop muted playsinline></video>
                    </div>
                `;
                previewButtonHTML = `
                    <button class="preview-btn" onclick="togglePreview('${repo.name}')">Visualizza Anteprima</button>
                `;
            }

            card.innerHTML = `
                ${previewSectionHTML}
                <div class="project-info">
                    <span class="tag">${repo.language || 'Software'}</span>
                    <h3>${repo.name}</h3>
                    <p>${repo.description || 'Nessuna descrizione disponibile per questo repository.'}</p>
                    <div class="project-links">
                        <a href="${repo.html_url}" target="_blank" class="link-arrow">Esplora Repository &rarr;</a>
                        ${previewButtonHTML}
                    </div>
                </div>
            `;
            container.appendChild(card);
        });

        initScrollAnimations();

    } catch (error) {
        console.error("Errore nel recupero dei progetti:", error);
        container.innerHTML = '<p style="color: #ff3333;">Impossibile caricare i progetti in questo momento.</p>';
    }
}

// Funzione per mostrare o nascondere l'anteprima video al click del pulsante
function togglePreview(repoName) {
    const previewBox = document.getElementById(`preview-${repoName}`);
    if (previewBox) {
        previewBox.classList.toggle('hidden-preview');
    }
}

// Gestione delle animazioni di dezoom e zoom allo scroll
function initScrollAnimations() {
    const imageBox = document.getElementById('zoom-image-box');
    const magicTitle = document.querySelector('.magic-title');
    const cards = document.querySelectorAll('.project-card');

    function handleScroll() {
        const scrollY = window.scrollY;
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;

        // 1. Effetto Dezoom dell'immagine e comparsa/zoom della scritta magica
        if (imageBox) {
            const rect = imageBox.getBoundingClientRect();

            if (rect.top <= windowHeight && rect.bottom >= 0) {
                let progress = (windowHeight - rect.top) / (windowHeight + rect.height);
                progress = Math.min(Math.max(progress, 0), 1);

                let imgScale = 1.2 - (progress * 0.2);
                imageBox.style.transform = `scale(${imgScale})`;

                let titleScale = 0.8 + (progress * 0.3);
                let titleOpacity = progress * 1.5;
                if (magicTitle) {
                    magicTitle.style.transform = `scale(${titleScale})`;
                    magicTitle.style.opacity = titleOpacity;
                }
            }
        }

        // Se l'utente è arrivato fino in fondo alla pagina, forziamo l'ultimo progetto ad essere perfettamente visibile
        const isAtBottom = (window.innerHeight + window.scrollY) >= documentHeight - 20;

        // 2. Effetto Zoom progressivo per le card dei progetti
        cards.forEach((card, index) => {
            const rect = card.getBoundingClientRect();

            if (isAtBottom && index === cards.length - 1) {
                // Se siamo in fondo, forza l'ultimo progetto al 100%
                card.style.transform = `scale(1)`;
                card.style.opacity = '1';
            } else {
                if (rect.top < windowHeight && rect.bottom > 0) {
                    let progress = (windowHeight - rect.top) / windowHeight;
                    progress = Math.min(Math.max(progress, 0), 1);

                    let scale = 0.85 + (progress * 0.15);
                    let opacity = progress;

                    card.style.transform = `scale(${scale})`;
                    card.style.opacity = opacity;
                }
            }
        });
    }

    window.addEventListener('scroll', handleScroll);
    handleScroll();
}

// Gestione del menu a tendina con ritardo di sicurezza per evitare la chiusura accidentale
const menuBtn = document.getElementById('menu-btn');
const dropdownMenu = document.getElementById('dropdown-menu');
const menuContainer = document.getElementById('menu-container');

let closeTimeout;

if (menuBtn && dropdownMenu && menuContainer) {
    menuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        dropdownMenu.classList.toggle('show');
    });

    // Quando il mouse esce, avvia un timer di 350ms prima di chiudere
    menuContainer.addEventListener('mouseleave', () => {
        closeTimeout = setTimeout(() => {
            dropdownMenu.classList.remove('show');
        }, 350);
    });

    dropdownMenu.addEventListener('mouseleave', () => {
        closeTimeout = setTimeout(() => {
            dropdownMenu.classList.remove('show');
        }, 350);
    });

    // Se il mouse rientra nel menu o nel container, annulla la chiusura
    menuContainer.addEventListener('mouseenter', () => {
        clearTimeout(closeTimeout);
    });

    dropdownMenu.addEventListener('mouseenter', () => {
        clearTimeout(closeTimeout);
    });

    window.addEventListener('click', () => {
        if (dropdownMenu.classList.contains('show')) {
            dropdownMenu.classList.remove('show');
        }
    });
}

// Funzione richiamata quando si clicca su una voce per chiudere il menu
function closeMenu() {
    const dropdownMenu = document.getElementById('dropdown-menu');
    if (dropdownMenu) {
        dropdownMenu.classList.remove('show');
    }
}

// Avvia il caricamento dei progetti all'avvio
fetchGitHubProjects();