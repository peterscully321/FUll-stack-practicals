const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const topicBtns = document.querySelectorAll('.topic-btn');
const statusContainer = document.getElementById('status-container');
const statusText = document.getElementById('status-text');
const newsGrid = document.getElementById('news-grid');

const API_URL = 'https://hn.algolia.com/api/v1/search';
let currentQuery = 'technology';

// Format date nicely
const formatDate = (dateString) => {
    if (!dateString) return 'Unknown date';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(date);
};

// Fetch news from API
async function fetchNews(query) {
    statusContainer.innerHTML = `
        <div class="loader"></div>
        <p id="status-text">Curating the latest news for "${query}"...</p>
    `;
    statusContainer.classList.remove('hidden');
    newsGrid.classList.add('hidden');
    newsGrid.innerHTML = '';

    try {
        const url = `${API_URL}?query=${encodeURIComponent(query)}&hitsPerPage=12`;
        const res = await fetch(url);
        
        if (!res.ok) throw new Error('Failed to fetch data');
        
        const data = await res.json();
        console.log("data:", data);
        
        showNews(data.hits);
    } catch (error) {
        console.error('Error fetching news:', error);
        statusContainer.innerHTML = `
            <div style="font-size: 2rem; margin-bottom: 1rem;">⚠️</div>
            <p style="color: #ef4444;">Failed to load news. Please try again later.</p>
        `;
    }
}

// Render news cards
function showNews(hits) {
    statusContainer.classList.add('hidden');
    newsGrid.classList.remove('hidden');

    // Filter out items without a valid title/link combination
    const validHits = hits.filter(hit => (hit.title || hit.story_title) && (hit.url || hit.story_url));

    if (validHits.length === 0) {
        newsGrid.innerHTML = `
            <div class="empty-state">
                <div style="font-size: 3rem; margin-bottom: 1rem;">📭</div>
                <h3>No articles found</h3>
                <p>Try searching for a different topic.</p>
            </div>
        `;
        return;
    }

    validHits.forEach(hit => {
        const title = hit.title || hit.story_title;
        const url = hit.url || hit.story_url;
        const author = hit.author || 'Anonymous';
        const points = hit.points || 0;
        const comments = hit.num_comments || 0;
        const date = formatDate(hit.created_at);

        const card = document.createElement('a');
        card.href = url;
        card.target = '_blank';
        card.rel = 'noopener noreferrer';
        card.className = 'news-card';
        
        card.innerHTML = `
            <h3 class="card-title">${title}</h3>
            <div class="card-meta">
                <div class="meta-item">
                    <span class="meta-icon">⬆️</span>
                    <span>${points} pts</span>
                </div>
                <div class="meta-item">
                    <span class="meta-icon">💬</span>
                    <span>${comments}</span>
                </div>
                <div class="meta-item">
                    <span class="meta-icon">✍️</span>
                    <span>${author}</span>
                </div>
                <div class="meta-item" style="margin-left: auto;">
                    <span>${date}</span>
                </div>
            </div>
        `;
        
        newsGrid.appendChild(card);
    });
}

// Handle topic button clicks
topicBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Update active class
        topicBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        // Clear search input
        searchInput.value = '';
        
        // Fetch new topic
        currentQuery = btn.dataset.topic;
        fetchNews(currentQuery);
    });
});

// Handle search form submission
searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const query = searchInput.value.trim();
    if (query) {
        // Deselect topic buttons
        topicBtns.forEach(b => b.classList.remove('active'));
        
        currentQuery = query;
        fetchNews(currentQuery);
    }
});

// Initial load
fetchNews(currentQuery);
