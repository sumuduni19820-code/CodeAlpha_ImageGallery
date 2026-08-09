// --- DOM Elements ---
const galleryGrid = document.getElementById('galleryGrid');
const filterBtns = document.querySelectorAll('.filter-btn');
const imageUploader = document.getElementById('imageUploader');

// Lightbox Elements
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightboxImg');
const closeBtn = document.getElementById('closeBtn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const caption = document.getElementById('lightboxCaption');

// App State
let visibleItems = [];
let currentIndex = 0;

// --- Initialize visible items & attach click handlers ---
function initApp() {
    updateVisibleItemsList();
    addGalleryItemClickHandlers();
}

// Update the list of currently visible gallery items (needed for navigation)
function updateVisibleItemsList() {
    visibleItems = Array.from(document.querySelectorAll('.gallery-item'))
        .filter(item => getComputedStyle(item).display !== 'none');
}

// Add click listeners directly to each current gallery item
function addGalleryItemClickHandlers() {
    document.querySelectorAll('.gallery-item').forEach((item) => {
        if (!item.dataset.hasHandler) {
            item.addEventListener('click', (e) => {
                const currentListIndex = visibleItems.indexOf(item);
                if (currentListIndex !== -1) openLightbox(currentListIndex);
            });
            item.dataset.hasHandler = "true";
        }
    });
}

// --- Lightbox Functions ---
function openLightbox(index) {
    if (visibleItems.length === 0) return;
    
    currentIndex = index;
    const item = visibleItems[currentIndex];
    const imgSrc = item.querySelector('img').src;
    const tagText = item.querySelector('.tag').innerText;

    lightboxImg.src = imgSrc;
    caption.innerText = `Category: ${tagText}`;
    lightbox.classList.add('show');
    
    document.body.style.overflow = 'hidden'; // Prevents scrolling background
}

function closeLightbox() {
    lightbox.classList.remove('show');
    document.body.style.overflow = '';
}

function showNextImage() {
    if (visibleItems.length <= 1) return;
    currentIndex = (currentIndex + 1) % visibleItems.length;
    updateLightboxContent();
}

function showPrevImage() {
    if (visibleItems.length <= 1) return;
    currentIndex = (currentIndex - 1 + visibleItems.length) % visibleItems.length;
    updateLightboxContent();
}

function updateLightboxContent() {
    lightboxImg.style.opacity = '0';
    setTimeout(() => {
        const item = visibleItems[currentIndex];
        lightboxImg.src = item.querySelector('img').src;
        caption.innerText = `Category: ${item.querySelector('.tag').innerText}`;
        lightboxImg.style.opacity = '1';
    }, 150);
}

// Helper function to switch active tab visually & logically
function filterGallery(category) {
    // Update active class on buttons
    filterBtns.forEach(b => {
        if (b.dataset.category === category) {
            b.classList.add('active');
        } else {
            b.classList.remove('active');
        }
    });

    const allItems = document.querySelectorAll('.gallery-item');
    allItems.forEach(item => {
        if (category === 'all' || item.dataset.category === category) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });

    updateVisibleItemsList();
}

// --- Filter Logic ---
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterGallery(btn.dataset.category);
    });
});

// --- User Upload Feature ---
imageUploader.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        
        reader.onload = function(event) {
            // Create new item structure
            const newItem = document.createElement('div');
            newItem.classList.add('gallery-item');
            newItem.setAttribute('data-category', 'uploaded'); // Matches HTML data-category

            newItem.innerHTML = `
                <img src="${event.target.result}" alt="User Upload">
                <div class="item-overlay">
                    <span class="tag">Uploaded Images</span>
                    <button class="view-btn" title="Expand image"><i class="fas fa-expand"></i></button>
                </div>
            `;

            galleryGrid.prepend(newItem); // Prepend to top
            
            // Auto-switch filter to "Uploaded Images" tab to show new image
            filterGallery('uploaded');
            addGalleryItemClickHandlers();
            
            // Clear input so same image can be re-uploaded if needed
            imageUploader.value = '';
        };
        
        reader.readAsDataURL(file);
    } else {
        alert("Please upload a valid image file.");
    }
});

// --- Event Listeners ---
closeBtn.addEventListener('click', closeLightbox);
nextBtn.addEventListener('click', showNextImage);
prevBtn.addEventListener('click', showPrevImage);

lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
});

// Keyboard Controls
document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('show')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') showNextImage();
    if (e.key === 'ArrowLeft') showPrevImage();
});

// Start the app
initApp();