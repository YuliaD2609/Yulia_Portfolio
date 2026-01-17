document.addEventListener('DOMContentLoaded', () => {
    initScrollAnimations();
    initDynamicAge();

    // Check which projects container exists
    if (document.getElementById('github-projects')) {
        initGithubProjects(4, 'github-projects'); // Home page: limit 4
    }
    if (document.getElementById('all-projects-container')) {
        initGithubProjects(100, 'all-projects-container'); // Progetti page: fetch all (limit 100)
    }

    updateCopyrightYear();
});

/* =========================================
   DYNAMIC AGE
   ========================================= */
function initDynamicAge() {
    const ageSpan = document.getElementById('age');
    if (!ageSpan) return;

    const birthDate = new Date('2003-09-26');
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();

    // Adjust if birthday hasn't happened yet this year
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }

    ageSpan.textContent = age;
}

/* =========================================
   SCROLL ANIMATIONS
   ========================================= */
function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1
    });

    document.querySelectorAll('.fade-in').forEach(el => {
        observer.observe(el);
    });
}

/* =========================================
   GITHUB PROJECTS
   ========================================= */
async function initGithubProjects(limit = 4, containerId = 'github-projects') {
    const projectsContainer = document.getElementById(containerId);
    if (!projectsContainer) return;

    const username = 'YuliaD2609';
    // Fetch more if needed, default to sorting by updated
    const apiUrl = `https://api.github.com/users/${username}/repos?sort=updated&per_page=${limit}`;

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error('GitHub API Error');

        const repos = await response.json();

        // Clear loading state
        projectsContainer.innerHTML = '';

        if (repos.length === 0) {
            projectsContainer.innerHTML = '<p>Nessun progetto trovato.</p>';
            return;
        }

        repos.forEach(repo => {
            // Skip forks or specific hidden repos if needed
            if (repo.fork) return;

            const card = document.createElement('div');
            card.className = 'project-card fade-in visible'; // Added visible to show immediately

            card.innerHTML = `
                <h3>${repo.name}</h3>
                <p>${repo.description || 'No description available for this cool project.'}</p>
                <div style="margin-top: 1rem;">
                    <a href="${repo.html_url}" target="_blank" style="color: var(--color-primary); font-weight: bold;">View Code &rarr;</a>
                </div>
            `;

            projectsContainer.appendChild(card);
        });

    } catch (error) {
        console.error('Error fetching repos:', error);
        projectsContainer.innerHTML = '<p>Unable to load projects at the moment.</p>';
    }
}

function updateCopyrightYear() {
    const yearSpan = document.getElementById('year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
}
