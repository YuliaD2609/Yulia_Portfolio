document.addEventListener('DOMContentLoaded', () => {
    console.log('Gallery JS loaded');
    initTabs();
    initFilters();
});

/* =========================================
   TABS (Photography)
   ========================================= */
function initTabs() {
    // Select all tab buttons and containers
    const tabButtons = document.querySelectorAll('.tab-btn');

    if (tabButtons.length === 0) {
        console.log('No tab buttons found');
        return;
    }

    console.log(`Found ${tabButtons.length} tab buttons`);

    tabButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            console.log('Tab clicked:', btn.textContent);
            // Prevent default if it were a link, though it is a button
            e.preventDefault();

            // Find the parent container to scope the search (optional, but good for multiple tab groups)
            // For this simple site, we can assume one tab group or scope to .tabs parent's sibling
            // NOTE: The HTML structure has buttons in .tabs, and content in sibling divs.
            // Let's use a more robust selection strategy.

            const targetId = btn.getAttribute('data-target');
            if (!targetId) return;

            // 1. Remove active class from all buttons in this group
            // We assume buttons are siblings in a .tabs container
            const parent = btn.parentElement;
            parent.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));

            // 2. Add active class to clicked button
            btn.classList.add('active');

            // 3. Hide all tab content sections
            // We assume tab contents are .tab-content on the page
            document.querySelectorAll('.tab-content').forEach(content => {
                content.style.display = 'none';
                content.style.opacity = 0;
                content.classList.remove('visible'); // Remove animation class if present
            });

            // 4. Show the target content
            const targetContent = document.getElementById(targetId);
            if (targetContent) {
                targetContent.style.display = 'grid';
                // Trigger reflow for transition
                void targetContent.offsetWidth;
                targetContent.style.opacity = 1;
                targetContent.classList.add('visible');
            } else {
                console.error('Target content not found:', targetId);
            }
        });
    });
}

/* =========================================
   FILTERS (Art)
   ========================================= */
function initFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    if (filterButtons.length === 0) return;

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Active state
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            galleryItems.forEach(item => {
                const itemCategory = item.getAttribute('data-category');

                // Show if filter is 'all' OR item category matches
                if (filterValue === 'all' || itemCategory === filterValue) {
                    item.style.display = 'block';
                    // Optional: Add animation
                    item.style.opacity = 0;
                    setTimeout(() => item.style.opacity = 1, 50);
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
}
