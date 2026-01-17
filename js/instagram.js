/* =========================================
   INSTAGRAM INTEGRATION (MANUAL DATA)
   ========================================= */

function initInstagramFeed() {
    const container = document.getElementById('public-favs');
    if (!container || typeof INSTAGRAM_POSTS === 'undefined') return;

    // Clear Container & Restore Profile Card
    container.innerHTML = '';

    // Add Profile Card
    const profileCard = document.createElement('div');
    profileCard.className = 'gallery-item';
    profileCard.style.cssText = 'grid-column: 1 / -1; height: auto; aspect-ratio: auto; background: none; border: none; text-align: center; padding: 2rem;';
    profileCard.innerHTML = `
        <h3>@yulia__photography</h3>
        <p style="text-align: center; margin-bottom: 1rem; color: var(--color-text-light);">
            I più amati dalla community.
        </p>
        <a href="https://www.instagram.com/yulia__photography/" target="_blank" class="cta-button">
            Visita il Profilo Instagram &rarr;
        </a>
    `;
    container.appendChild(profileCard);

    // Sort by Likes, then Comments
    const sortedPosts = [...INSTAGRAM_POSTS].sort((a, b) => {
        if (b.likes !== a.likes) {
            return b.likes - a.likes; // Primary: Likes
        }
        return b.comments - a.comments; // Secondary: Comments
    });

    // Render sorted posts
    sortedPosts.forEach(post => {
        const div = document.createElement('div');
        div.className = 'gallery-item fade-in visible';

        div.innerHTML = `
            <img src="${post.image}" loading="lazy" alt="Instagram Post">
            <div style="position: absolute; bottom: 0; left: 0; right: 0; background: rgba(0,0,0,0.7); color: white; padding: 0.8rem; font-size: 0.9rem; transform: translateY(100%); transition: transform 0.3s ease; display: flex; flex-direction: column; align-items: center; justify-content: center;">
                <div style="margin-bottom: 5px;">
                    ❤️ ${post.likes} &nbsp;&nbsp; 💬 ${post.comments}
                </div>
                <a href="${post.link}" target="_blank" style="color:var(--color-accent); font-weight:bold; font-size: 0.8rem;">Vedi su Instagram &rarr;</a>
            </div>
        `;

        // Hover effect helper
        div.onmouseenter = () => div.querySelector('div').style.transform = 'translateY(0)';
        div.onmouseleave = () => div.querySelector('div').style.transform = 'translateY(100%)';

        container.appendChild(div);
    });
}
