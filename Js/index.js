document.addEventListener('DOMContentLoaded', function() {
    // DOM elements
    const gallery = document.getElementById('gallery');
    const loadMoreBtn = document.getElementById('loadMore');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const searchInput = document.getElementById('searchInput');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxClose = document.getElementById('lightboxClose');
    const lightboxDownload = document.getElementById('lightboxDownload');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const imageInfo = document.getElementById('imageInfo');
    const currentYear = document.getElementById('currentYear');

    // Set current year in footer
    currentYear.textContent = new Date().getFullYear();

    // Image data with verified URLs
    const imageData = [
        { id: 1, title: "Sunset Over Mountains", category: "Landscapes", url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80" },
        { id: 2, title: "Tropical Beach", category: "Oceans", url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1173&q=80" },
        { id: 3, title: "Mountain Lake", category: "Mountains", url: "https://images.unsplash.com/photo-1519681393784-d120267933ba?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80" },
        { id: 4, title: "African Elephant", category: "Wildlife", url: "https://images.unsplash.com/photo-1505148230895-d9a785a555fa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80" },
        { id: 5, title: "Autumn Forest", category: "Forests", url: "https://images.unsplash.com/photo-1476231682828-37e571bc172f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80" },
        { id: 6, title: "Desert Dunes", category: "Landscapes", url: "https://images.unsplash.com/photo-1517649763962-0c623066013b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80" },
        { id: 7, title: "Ocean Waves", category: "Oceans", url: "https://images.unsplash.com/photo-1505118380757-91f5f5632de0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1226&q=80" },
        { id: 8, title: "Snowy Peaks", category: "Mountains", url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80" },
        { id: 9, title: "Lion in Savannah", category: "Wildlife", url: "https://images.unsplash.com/photo-1534188753412-3e26d0d618d6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80" },
        { id: 10, title: "Misty Forest", category: "Forests", url: "https://images.unsplash.com/photo-1448375240586-882707db888b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80" }
    ];

    // Variables
    let currentImages = [];
    let displayedImages = 12;
    let activeFilter = 'All';
    let currentSearch = '';
    let currentLightboxIndex = 0;
    let currentLightboxImage = null;

    // Initialize gallery
    function initGallery() {
        currentImages = [...imageData];
        renderGallery();
    }

    // Render gallery with download buttons
    function renderGallery() {
        gallery.innerHTML = '';
        
        const imagesToShow = currentImages
            .filter(img => activeFilter === 'All' || img.category === activeFilter)
            .filter(img => img.title.toLowerCase().includes(currentSearch.toLowerCase()))
            .slice(0, displayedImages);
        
        imagesToShow.forEach((image, index) => {
            const galleryItem = document.createElement('div');
            galleryItem.className = 'gallery-item';
            
            const imgContainer = document.createElement('div');
            imgContainer.className = 'img-container';
            
            const imgElement = document.createElement('img');
            imgElement.src = image.url;
            imgElement.alt = image.title;
            imgElement.loading = "lazy";
            
            // Add error handling for images
            imgElement.onerror = function() {
                this.src = 'https://via.placeholder.com/400x300?text=Image+Not+Available';
                this.alt = 'Failed to load image';
            };
            
            // Download button
            const downloadBtn = document.createElement('button');
            downloadBtn.className = 'download-btn';
            downloadBtn.innerHTML = '<i class="fas fa-download"></i>';
            downloadBtn.title = 'Download image';
            downloadBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                downloadImage(image.url, image.title);
            });
            
            const itemInfo = document.createElement('div');
            itemInfo.className = 'item-info';
            itemInfo.innerHTML = `
                <div class="item-title">${image.title}</div>
                <span class="item-category">${image.category}</span>
            `;
            
            imgContainer.appendChild(imgElement);
            imgContainer.appendChild(downloadBtn);
            galleryItem.appendChild(imgContainer);
            galleryItem.appendChild(itemInfo);
            
            galleryItem.addEventListener('click', () => openLightbox(index));
            gallery.appendChild(galleryItem);
        });
        
        // Show/hide load more button
        loadMoreBtn.style.display = 
            displayedImages < currentImages.length ? 'block' : 'none';
    }

    // Function to download image
    async function downloadImage(imageUrl, imageName) {
        try {
            // Fetch the image
            const response = await fetch(imageUrl);
            
            if (!response.ok) {
                throw new Error('Failed to fetch image');
            }
            
            // Convert to blob
            const blob = await response.blob();
            const blobUrl = URL.createObjectURL(blob);
            
            // Create download link
            const link = document.createElement('a');
            link.href = blobUrl;
            
            // Set the download attribute with a proper filename
            const fileName = `nature-gallery-${imageName.toLowerCase().replace(/\s+/g, '-')}.jpg`;
            link.download = fileName;
            
            // Append to the body, click and remove
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            // Revoke the blob URL
            setTimeout(() => {
                URL.revokeObjectURL(blobUrl);
            }, 100);
        } catch (error) {
            console.error('Download error:', error);
            // Fallback method
            const fallbackLink = document.createElement('a');
            fallbackLink.href = imageUrl;
            fallbackLink.target = '_blank';
            document.body.appendChild(fallbackLink);
            fallbackLink.click();
            document.body.removeChild(fallbackLink);
            
            alert('Download initiated in new tab. Please right-click and "Save image as" if download doesn\'t start automatically.');
        }
    }

    // Open lightbox
    function openLightbox(index) {
        const filteredImages = currentImages
            .filter(img => activeFilter === 'All' || img.category === activeFilter)
            .filter(img => img.title.toLowerCase().includes(currentSearch.toLowerCase()));
        
        currentLightboxIndex = index;
        currentLightboxImage = filteredImages[index];
        
        lightboxImg.onerror = function() {
            this.src = 'https://via.placeholder.com/800x600?text=Image+Not+Available';
            imageInfo.innerHTML = `
                <h3>${currentLightboxImage.title} (Image Failed to Load)</h3>
                <p>${currentLightboxImage.category}</p>
            `;
        };
        
        lightboxImg.src = currentLightboxImage.url;
        lightboxImg.alt = currentLightboxImage.title;
        imageInfo.innerHTML = `
            <h3>${currentLightboxImage.title}</h3>
            <p>${currentLightboxImage.category}</p>
        `;
        
        // Set up download button for lightbox
        lightboxDownload.onclick = (e) => {
            e.stopPropagation();
            downloadImage(currentLightboxImage.url, currentLightboxImage.title);
        };
        
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    // Close lightbox
    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Navigate lightbox
    function navigateLightbox(direction) {
        const filteredImages = currentImages
            .filter(img => activeFilter === 'All' || img.category === activeFilter)
            .filter(img => img.title.toLowerCase().includes(currentSearch.toLowerCase()));
        
        if (direction === 'prev') {
            currentLightboxIndex = (currentLightboxIndex - 1 + filteredImages.length) % filteredImages.length;
        } else {
            currentLightboxIndex = (currentLightboxIndex + 1) % filteredImages.length;
        }
        
        currentLightboxImage = filteredImages[currentLightboxIndex];
        lightboxImg.src = currentLightboxImage.url;
        lightboxImg.alt = currentLightboxImage.title;
        imageInfo.innerHTML = `
            <h3>${currentLightboxImage.title}</h3>
            <p>${currentLightboxImage.category}</p>
        `;
    }

    // Event listeners
    loadMoreBtn.addEventListener('click', () => {
        displayedImages += 12;
        renderGallery();
    });

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            activeFilter = btn.dataset.filter;
            displayedImages = 12;
            renderGallery();
        });
    });

    searchInput.addEventListener('input', (e) => {
        currentSearch = e.target.value;
        displayedImages = 12;
        renderGallery();
    });

    lightboxClose.addEventListener('click', closeLightbox);
    prevBtn.addEventListener('click', () => navigateLightbox('prev'));
    nextBtn.addEventListener('click', () => navigateLightbox('next'));

    // Close lightbox when clicking outside the image
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (lightbox.classList.contains('active')) {
            if (e.key === 'Escape') {
                closeLightbox();
            } else if (e.key === 'ArrowLeft') {
                navigateLightbox('prev');
            } else if (e.key === 'ArrowRight') {
                navigateLightbox('next');
            }
        }
    });

    // Initialize the gallery
    initGallery();
});
