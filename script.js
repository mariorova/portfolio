// Caricamento automatico progetti da GitHub con anteprime video/GIF
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

            let previewHTML = '';

            // Controlla se il repository è SN4M e inserisce il video dalla cartella assets
            if (repo.name === 'SN4M') {
                previewHTML = `<div class="project-preview"><video src="assets/SN4M_test.mp4" autoplay loop muted playsinline></video></div>`;
            }
            // Se in futuro aggiungi un video per un altro progetto, puoi fare così:
            // else if (repo.name === 'iBuy') {
            //     previewHTML = `<div class="project-preview"><video src="assets/ibuy-demo.mp4" autoplay loop muted playsinline></video></div>`;
            // }

            card.innerHTML = `
                ${previewHTML}
                <div class="project-info">
                    <span class="tag">${repo.language || 'Software'}</span>
                    <h3>${repo.name}</h3>
                    <p>${repo.description || 'Nessuna descrizione disponibile per questo repository.'}</p>
                    <a href="${repo.html_url}" target="_blank" class="link-arrow">Esplora Repository &rarr;</a>
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

// Gestione delle animazioni di dezoom e zoom allo scroll
function initScrollAnimations() {
    const imageBox = document.getElementById('zoom-image-box');
    const magicTitle = document.querySelector('.magic-title');
    const cards = document.querySelectorAll('.project-card');

    function handleScroll() {
        if (imageBox) {
            const rect = imageBox.getBoundingClientRect();
            const windowHeight = window.innerHeight;

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

        cards.forEach(card => {
            const rect = card.getBoundingClientRect();
            const windowHeight = window.innerHeight;

            if (rect.top < windowHeight && rect.bottom > 0) {
                let progress = (windowHeight - rect.top) / windowHeight;
                progress = Math.min(Math.max(progress, 0), 1);

                let scale = 0.85 + (progress * 0.15);
                let opacity = progress;

                card.style.transform = `scale(${scale})`;
                card.style.opacity = opacity;
            }
        });
    }

    window.addEventListener('scroll', handleScroll);
    handleScroll();
}

fetchGitHubProjects();