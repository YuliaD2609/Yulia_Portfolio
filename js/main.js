
// Gallery Filter Logic
function filterGallery(category) {
    const items = document.querySelectorAll('[data-category]');
    const buttons = document.querySelectorAll('.filter-btn');

    // Update buttons
    buttons.forEach(btn => {
        if (btn.innerText.toLowerCase().includes(category === 'bnw' ? 'bianco' : category === 'unconventional' ? 'media' : category === 'painting' ? 'pittura' : 'tutti')) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
        // Simpler check based on click event usually better, but here we use the category arg
        // Just resetting all and setting active based on the clicked element would be passed in, but I'm passing string.
        // Let's rely on the onclick updating the UI? No, I need to do it here.
        // I will fix the active class logic to be simpler: clear all, set matching text or attribute?
        // Actually, I'll pass `this` in the HTML usually. But for now let's just match roughly or simpler:
        btn.classList.remove('active');
        if (category === 'all' && btn.innerText === 'Tutti') btn.classList.add('active');
        if (category === 'painting' && btn.innerText === 'Pittura') btn.classList.add('active');
        if (category === 'bnw' && btn.innerText === 'Bianco e Nero') btn.classList.add('active');
        if (category === 'unconventional' && btn.innerText === 'Media Non Convenzionali') btn.classList.add('active');
        if (category === 'disegno' && btn.innerText === 'Disegno') btn.classList.add('active');
    });

    // Filter items
    items.forEach(item => {
        const itemCategory = item.getAttribute('data-category');
        if (category === 'all' || itemCategory === category) {
            item.classList.remove('gallery-hidden');
            // Re-trigger animation if possible, or just show
        } else {
            item.classList.add('gallery-hidden');
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    initScrollAnimations();
    initDynamicAge();
    initBirthdayBanner();
    initLogoFont();
    initVisitorCounter();

    // Check which projects container exists
    if (document.getElementById('github-projects')) {
        // Home page: show only specific featured repos (fetched fresh every page load)
        const featuredRepos = ['FarFromHome', 'SecureNotes', 'Clock'];
        initGithubProjects(3, 'github-projects', true, false, featuredRepos);
    }
    if (document.getElementById('all-projects-container')) {
        // Progetti page: fetch ALL repos fresh, no limit, exclude portfolio repos
        initGithubProjects(0, 'all-projects-container', true, true);
    }

    // Initialize Instagram (functions internally checks for container existence)
    if (typeof initInstagramFeed === 'function') {
        initInstagramFeed();
    }

    updateCopyrightYear();
});

/* =========================================
   VISITOR COUNTER (secret – only visible with ?stats in URL)
   ========================================= */
function initVisitorCounter() {
    const COUNTER_URL = 'https://hits.sh/YuliaD2609.github.io.svg?style=flat&color=8a6a4b&label=Visitatori';
    const SESSION_KEY = 'yulia_visit_counted';

    // Only increment the counter once per browser session.
    // If the user navigates between pages, sessionStorage still has the flag
    // and we skip the tracking call — they aren't counted twice.
    if (!sessionStorage.getItem(SESSION_KEY)) {
        const tracker = new Image();
        tracker.src = COUNTER_URL;
        tracker.style.display = 'none';
        document.body.appendChild(tracker);
        sessionStorage.setItem(SESSION_KEY, '1');
    }

    // Show the badge only when ?stats is in the URL
    if (!window.location.search.includes('stats')) return;

    const badge = document.createElement('div');
    badge.style.cssText = `
        position: fixed;
        bottom: 24px;
        right: 24px;
        background: rgba(255,255,255,0.92);
        backdrop-filter: blur(8px);
        border: 1px solid rgba(138,106,75,0.3);
        border-radius: 20px;
        padding: 8px 14px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.12);
        z-index: 99999;
        display: flex;
        align-items: center;
        gap: 8px;
        font-family: var(--font-main);
        font-size: 0.82rem;
        color: var(--color-text);
    `;

    const img = document.createElement('img');
    img.src = COUNTER_URL;
    img.alt = 'Visitor count';
    img.style.cssText = 'height: 20px; display: block;';

    badge.appendChild(img);
    document.body.appendChild(badge);
}

/* =========================================
   LOGO FONT REVEAL
   ========================================= */
function initLogoFont() {
    const logoLinks = document.querySelectorAll('.logo a');
    if (!logoLinks.length) return;

    const revealLogo = () => {
        logoLinks.forEach(el => el.classList.add('font-loaded'));
    };

    // Use the CSS Font Loading API to wait for Sacramento to be ready
    if (document.fonts && document.fonts.load) {
        // A fallback timeout in case the font never loads (e.g. offline)
        const fallback = setTimeout(revealLogo, 3000);

        document.fonts.load('1em Sacramento').then(() => {
            clearTimeout(fallback);
            revealLogo();
        }).catch(() => {
            clearTimeout(fallback);
            revealLogo();
        });
    } else {
        // Browser doesn't support Font Loading API – reveal immediately
        revealLogo();
    }
}

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

// Language color map for badges
const LANG_COLORS = {
    'JavaScript': '#f1e05a',
    'TypeScript': '#3178c6',
    'Python': '#3572A5',
    'Java': '#b07219',
    'HTML': '#e34c26',
    'CSS': '#563d7c',
    'R': '#198CE7',
    'C': '#555555',
    'C++': '#f34b7d',
    'C#': '#178600',
    'Shell': '#89e051',
    'default': '#8b949e'
};

/**
 * Fetches ALL repos for a user, handling GitHub API pagination automatically.
 * Returns a flat array of all repo objects.
 */
async function fetchAllGithubRepos(username) {
    const allRepos = [];
    let page = 1;
    const perPage = 100; // GitHub's maximum per page

    while (true) {
        const url = `https://api.github.com/users/${username}/repos?sort=updated&per_page=${perPage}&page=${page}`;
        const response = await fetch(url);
        if (!response.ok) throw new Error(`GitHub API Error: ${response.status}`);

        const repos = await response.json();
        allRepos.push(...repos);

        // If we got fewer results than the page size, we've reached the last page
        if (repos.length < perPage) break;
        page++;
    }

    return allRepos;
}

async function initGithubProjects(limit = 4, containerId = 'github-projects', hidePortfolio = true, includeForks = false, specificRepos = []) {
    const projectsContainer = document.getElementById(containerId);
    if (!projectsContainer) return;

    const username = 'YuliaD2609';

    try {
        // Fetch ALL repos using pagination (auto-runs every time the page loads)
        const allRepos = await fetchAllGithubRepos(username);

        // Clear loading state
        projectsContainer.innerHTML = '';

        if (allRepos.length === 0) {
            projectsContainer.innerHTML = '<p>Nessun progetto trovato.</p>';
            return;
        }

        let displayed = 0;

        allRepos.forEach(repo => {
            // Skip forks unless requested
            if (repo.fork && !includeForks) return;

            // Filter out portfolio/site repos if requested
            if (hidePortfolio && (
                repo.name.toLowerCase().includes('portfolio') ||
                repo.name.toLowerCase().includes('yulia.github.io')
            )) return;

            // If a specific list is given, only show those repos
            if (specificRepos.length > 0) {
                const isFeatured = specificRepos.some(name => name.toLowerCase() === repo.name.toLowerCase());
                if (!isFeatured) return;
            }

            // Respect the limit (0 = no limit)
            if (limit > 0 && displayed >= limit) return;

            const langColor = LANG_COLORS[repo.language] || LANG_COLORS['default'];
            const langBadge = repo.language
                ? `<span style="display:inline-flex;align-items:center;gap:5px;font-size:0.78rem;color:var(--color-text-light);">
                       <span style="width:10px;height:10px;border-radius:50%;background:${langColor};display:inline-block;flex-shrink:0;"></span>
                       ${repo.language}
                   </span>`
                : '';



            const starCount = repo.stargazers_count > 0
                ? `<span style="font-size:0.78rem;color:var(--color-text-light);">⭐ ${repo.stargazers_count}</span>`
                : '';

            const card = document.createElement('div');
            card.className = 'project-card fade-in visible';
            card.style.cssText = 'display:flex;flex-direction:column;';

            card.innerHTML = `
                <h3 style="margin:0 0 0.5rem;">${repo.name}</h3>
                <p style="flex:1;margin:0 0 1rem;">${repo.description || 'Nessuna descrizione disponibile.'}</p>
                <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px;margin-top:auto;">
                    <div style="display:flex;align-items:center;gap:10px;">
                        ${langBadge}
                        ${starCount}
                    </div>
                    <a href="${repo.html_url}" target="_blank" style="color:var(--color-primary);font-weight:bold;white-space:nowrap;">Visualizza &rarr;</a>
                </div>
            `;

            projectsContainer.appendChild(card);
            displayed++;
        });

        if (displayed === 0) {
            projectsContainer.innerHTML = '<p>Nessun progetto trovato.</p>';
        }

    } catch (error) {
        console.error('Error fetching GitHub repos:', error);
        projectsContainer.innerHTML = '<p>Impossibile caricare i progetti in questo momento.</p>';
    }
}

function updateCopyrightYear() {
    const yearSpan = document.getElementById('year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
}

/* =========================================
   11. BIRTHDAY BANNER LOGIC
   ========================================= */
function initBirthdayBanner() {
    const banner = document.getElementById('birthday-banner');
    const modal = document.getElementById('birthday-modal');
    const openBtn = document.getElementById('open-wish-modal');
    const closeBtn = document.getElementById('close-modal');

    // Safety check
    if (!banner || !modal || !openBtn || !closeBtn) return;

    // Date check: September 26th
    const today = new Date();
    // September is month index 8 (0-11)
    const isBirthday = (today.getMonth() === 8 && today.getDate() === 26);

    // DEBUG: Uncomment to force show styling
    // const isBirthday = true; 

    if (isBirthday) {
        // Show banner after a slight delay
        setTimeout(() => {
            banner.classList.remove('hidden');
        }, 1000);
    }

    // Modal Events
    openBtn.addEventListener('click', (e) => {
        // Prevent default if it's an anchor, though it's a span usually
        e.preventDefault();
        modal.classList.remove('hidden');
    });


    // Close on X click
    closeBtn.addEventListener('click', () => {
        modal.classList.add('hidden');
    });

    // Close on click outside modal content
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.add('hidden');
        }
    });
}
