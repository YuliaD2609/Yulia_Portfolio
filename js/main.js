
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
    initUrgentBanner();
    initLogoFont();
    initVisitorCounter();

    // Check which projects container exists
    if (document.getElementById('github-projects')) {
        // Home page: show only specific featured repos (fetched fresh every page load)
        const featuredRepos = ['FarFromHome', 'SecureNotes', 'Clock'];
        initGithubProjects(3, 'github-projects', true, false, featuredRepos);
    }
    if (document.getElementById('university-projects-container') && document.getElementById('personal-projects-container')) {
        // Progetti page: fetch ALL repos fresh, divide them into university and personal
        initSplitGithubProjects();
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
    // Non contare automaticamente le visite se si visualizza il sito sul PC in locale (es. file:// o localhost)
    const isLocal = window.location.hostname === 'localhost' ||
        window.location.hostname === '127.0.0.1' ||
        window.location.hostname === '';

    // Permette di ignorare manualmente aggiungendo ?ignoreme (per quando visiti il sito live)
    if (window.location.search.includes('ignoreme')) {
        localStorage.setItem('yulia_ignore_visit', 'true');
        alert("Perfetto! Le tue visite dal sito live su questo browser non verranno più contate.");
    }

    const shouldIgnore = localStorage.getItem('yulia_ignore_visit') === 'true';

    // URL specifico per il sito (diviso da eventuali contatori su GitHub)
    const COUNTER_URL = 'https://hits.sh/yuliad2609.github.io/website.svg?style=flat&color=8a6a4b&label=Visitatori';
    const SESSION_KEY = 'yulia_visit_counted';

    // Only increment the counter once per browser session, and ONLY if not local and not ignored.
    if (!isLocal && !shouldIgnore && !sessionStorage.getItem(SESSION_KEY)) {
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
        rootMargin: '50px 0px',
        threshold: 0
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
 * Caches the results in sessionStorage for 1 hour to improve navigation speed.
 * Returns a flat array of all repo objects.
 */
async function fetchAllGithubRepos(username) {
    const CACHE_KEY = `github_repos_${username}`;
    const CACHE_TIME_KEY = `github_repos_time_${username}`;
    const CACHE_EXPIRY_MS = 60 * 60 * 1000; // 1 hour

    // Check cache first
    const cachedRepos = sessionStorage.getItem(CACHE_KEY);
    const cacheTime = sessionStorage.getItem(CACHE_TIME_KEY);

    if (cachedRepos && cacheTime) {
        const age = Date.now() - parseInt(cacheTime, 10);
        if (age < CACHE_EXPIRY_MS) {
            return JSON.parse(cachedRepos);
        }
    }

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

    // Save to cache
    sessionStorage.setItem(CACHE_KEY, JSON.stringify(allRepos));
    sessionStorage.setItem(CACHE_TIME_KEY, Date.now().toString());

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

async function initSplitGithubProjects() {
    const uniContainer = document.getElementById('university-projects-container');
    const persContainer = document.getElementById('personal-projects-container');
    if (!uniContainer || !persContainer) return;

    const username = 'YuliaD2609';

    // Map of uni projects to their banner labels
    const uniProjectsMap = {
        'farfromhome': 'Mobile Programming',
        'moodle2.0': 'Tecnologie Software per il Web',
        'justintime': 'Ingegneria del Software',
        'securenotes': 'Sicurezza dei Dati',
        'world_happiness_report': 'Statistica e Analisi dei Dati',
        'citizenship_analysis': 'Machine Learning'
    };

    try {
        const allRepos = await fetchAllGithubRepos(username);

        uniContainer.innerHTML = '';
        persContainer.innerHTML = '';

        if (allRepos.length === 0) {
            uniContainer.innerHTML = '<p>Nessun progetto trovato.</p>';
            persContainer.innerHTML = '<p>Nessun progetto trovato.</p>';
            return;
        }

        let uniCount = 0;
        let persCount = 0;

        allRepos.forEach(repo => {
            // Filter out portfolio/site repos
            if (repo.name.toLowerCase().includes('portfolio') || repo.name.toLowerCase().includes('yulia.github.io')) return;

            const repoNameLower = repo.name.toLowerCase();
            const isUniProject = uniProjectsMap.hasOwnProperty(repoNameLower);
            const bannerLabel = isUniProject ? uniProjectsMap[repoNameLower] : '';

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

            // Special layout for title + banner if it's a uni project
            let titleHTML = `<h3 style="margin:0 0 0.5rem;">${repo.name}</h3>`;
            if (isUniProject && bannerLabel) {
                // Incorporating the gallery-badge style directly or reusing the class
                titleHTML = `
                <div style="display:flex; align-items:center; gap: 10px; margin:0 0 0.5rem; flex-wrap: wrap;">
                    <h3 style="margin:0;">${repo.name}</h3>
                    <span class="gallery-badge" style="position: relative; top: auto; right: auto; bottom: auto; display: inline-block;">${bannerLabel}</span>
                </div>`;
            }

            card.innerHTML = `
                ${titleHTML}
                <p style="flex:1;margin:0 0 1rem;">${repo.description || 'Nessuna descrizione disponibile.'}</p>
                <div style="display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:8px;margin-top:auto;">
                    <div style="display:flex;align-items:center;gap:10px;">
                        ${langBadge}
                        ${starCount}
                    </div>
                    <a href="${repo.html_url}" target="_blank" style="color:var(--color-primary);font-weight:bold;white-space:nowrap;">Visualizza &rarr;</a>
                </div>
            `;

            if (isUniProject) {
                uniContainer.appendChild(card);
                uniCount++;
            } else {
                persContainer.appendChild(card);
                persCount++;
            }
        });

        if (uniCount === 0) uniContainer.innerHTML = '<p>Nessun progetto trovato.</p>';
        if (persCount === 0) persContainer.innerHTML = '<p>Nessun progetto trovato.</p>';

    } catch (error) {
        console.error('Error fetching GitHub repos:', error);
        uniContainer.innerHTML = '<p>Impossibile caricare i progetti in questo momento.</p>';
        persContainer.innerHTML = '<p>Impossibile caricare i progetti in questo momento.</p>';
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

/* =========================================
   12. URGENT BANNER LOGIC
   ========================================= */
function initUrgentBanner() {
    const banner = document.getElementById('urgent-banner');
    const closeBtn = document.getElementById('close-urgent-banner');

    if (!banner || !closeBtn) return;

    // Restrict the urgent banner to specific sections
    const path = window.location.pathname.toLowerCase();
    const isAllowedPage = path.includes('eventi') || path.includes('arte') || path.includes('fotografia');
    if (!isAllowedPage) return;

    const bannerText = banner.querySelector('p');
    let isDismissed = sessionStorage.getItem('urgent_banner_dismissed') === 'true';

    function checkBanner() {
        if (isDismissed) return;

        const screenWidth = window.screen.width;
        const windowWidth = window.innerWidth;

        if (screenWidth <= 768) {
            if (bannerText) {
                bannerText.innerHTML = "<strong>Attenzione!</strong> Per una visione ottimale è suggerito l'uso di un pc oppure di attivare la modalità desktop.";
            }
            banner.classList.remove('hidden');
        } else {
            if (bannerText) {
                bannerText.innerHTML = "<strong>Attenzione!</strong> Allarga la finestra per una visuale migliore!";
            }

            if (windowWidth < 1200) {
                banner.classList.remove('hidden');
            } else {
                banner.classList.add('hidden');
            }
        }
    }

    // Initial check
    setTimeout(() => {
        checkBanner();
    }, 800);

    // Update on window resize
    window.addEventListener('resize', checkBanner);

    closeBtn.addEventListener('click', () => {
        banner.classList.add('hidden');
        isDismissed = true;
        sessionStorage.setItem('urgent_banner_dismissed', 'true');
    });
}
