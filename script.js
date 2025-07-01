document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const book = document.getElementById('book');
    const pages = document.querySelectorAll('.page');
    const prevButton = document.getElementById('prevButton');
    const nextButton = document.getElementById('nextButton');
    const menuButton = document.getElementById('menuButton');
    const navigationMenu = document.getElementById('navigationMenu');
    const closeMenu = document.getElementById('closeMenu');
    const menuContent = document.getElementById('menuContent');
    const pageFlipSound = document.getElementById('pageFlipSound');
    
    // State variables
    let currentPage = 0;
    let totalPages = pages.length;
    let isAnimating = false;
    
    // Chapter titles and their starting page indices for the navigation menu
    const chapterStartPages = [
        { title: "Cover Page", page: 0 },
        { title: "Table of Contents", page: 1 },
        { title: "Preface", page: 2 },
        { title: "Chapter 1: Strategic Vision and School Culture", page: 3 }, // Intro page for Chapter 1
        { title: "Chapter 2: Leadership and Governance", page: 10 }, // Intro page for Chapter 2
        { title: "Chapter 3: Curriculum and Academic Quality", page: 14 }, // Intro page for Chapter 3
        { title: "Chapter 4: Teacher Recruitment, Training, and Retention", page: 21 }, // Intro page for Chapter 4
        { title: "Chapter 5: Student Engagement and Well-Being", page: 26 }, // Intro page for Chapter 5
        { title: "Chapter 6: Infrastructure and Facilities", page: 31 }, // Intro page for Chapter 6
        { title: "Chapter 7: Technology and Innovation", page: 34 }, // Intro page for Chapter 7
        { title: "Chapter 8: Admissions, Marketing, and Community Partnerships", page: 38 }, // Intro page for Chapter 8
        { title: "Chapter 9: Financial Management and Sustainability", page: 44 }, // Intro page for Chapter 9
        { title: "Chapter 10: Accountability, Evaluation, and Continuous Improvement", page: 48 }, // Intro page for Chapter 10
        { title: "Chapter 11: Case Studies and Best Practices", page: 50 }, // Intro page for Chapter 11
        { title: "Chapter 12: The Ultimate Way for Indian Private Schools", page: 56 } // Intro page for Chapter 12
    ];

    // Initialize the book
    function initBook() {
        // Show the cover page initially
        pages[0].classList.add('visible');
        
        // Hide prev button on first page
        prevButton.style.visibility = 'hidden';
        
        // Generate menu content
        generateMenuContent();
        
        // Set chapter intro backgrounds (can be customized further in styles.css)
        const chapterIntros = document.querySelectorAll('.chapter-intro');
        const backgroundImages = [
            'linear-gradient(135deg, #3498db 0%, #2c3e50 100%)', // Chapter 1
            'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)', // Chapter 2
            'linear-gradient(135deg, #27ae60 0%, #2ecc71 100%)', // Chapter 3
            'linear-gradient(135deg, #f39c12 0%, #e67e22 100%)', // Chapter 4
            'linear-gradient(135deg, #9b59b6 0%, #8e44ad 100%)', // Chapter 5
            'linear-gradient(135deg, #1abc9c 0%, #16a085 100%)', // Chapter 6
            'linear-gradient(135deg, #d35400 0%, #e67e22 100%)', // Chapter 7
            'linear-gradient(135deg, #34495e 0%, #2c3e50 100%)', // Chapter 8
            'linear-gradient(135deg, #7f8c8d 0%, #95a5a6 100%)', // Chapter 9
            'linear-gradient(135deg, #c0392b 0%, #e74c3c 100%)', // Chapter 10
            'linear-gradient(135deg, #2980b9 0%, #3498db 100%)', // Chapter 11
            'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)'  // Chapter 12
        ];
        
        chapterIntros.forEach((intro, index) => {
            const bgIndex = index % backgroundImages.length;
            intro.style.backgroundImage = backgroundImages[bgIndex];
        });
    }
    
    // Generate menu content
    function generateMenuContent() {
        menuContent.innerHTML = ''; // Clear existing menu content
        const tocList = document.querySelector('.toc-page .toc-list');
        tocList.innerHTML = ''; // Clear existing TOC list

        chapterStartPages.forEach((chapter, index) => {
            // Create menu item for navigation menu
            const menuItem = document.createElement('div');
            menuItem.className = 'menu-page-item';
            menuItem.innerHTML = `
                <div class="menu-page-number">${chapter.page + 1}</div>
                <div class="menu-page-title">${chapter.title}</div>
            `;
            
            menuItem.addEventListener('click', () => {
                goToPage(chapter.page);
                closeNavigationMenu();
            });
            menuContent.appendChild(menuItem);

            // Create TOC list item for the Table of Contents page
            if (index > 0) { // Skip "Cover Page" for TOC
                const tocListItem = document.createElement('li');
                const tocLink = document.createElement('a');
                tocLink.href = `#`; // Use # for internal navigation
                tocLink.textContent = chapter.title;
                tocLink.setAttribute('data-goto', chapter.page);
                tocLink.addEventListener('click', (e) => {
                    e.preventDefault();
                    goToPage(parseInt(e.target.getAttribute('data-goto')));
                    closeNavigationMenu(); // Close menu after selection
                });
                tocListItem.appendChild(tocLink);
                tocList.appendChild(tocListItem);
            }
        });
    }
    
    // Navigate to a specific page
    function goToPage(pageIndex) {
        if (isAnimating || pageIndex === currentPage || pageIndex < 0 || pageIndex >= totalPages) {
            return;
        }
        
        isAnimating = true;
        
        // Play page flip sound
        playPageFlipSound();
        
        // Determine direction for animation
        const direction = pageIndex > currentPage ? 'forward' : 'backward';
        
        // Current page animation
        const currentPageElement = pages[currentPage];
        currentPageElement.classList.add(direction === 'forward' ? 'page-flip-out' : 'page-flip-out-reverse');
        
        setTimeout(() => {
            currentPageElement.classList.remove('visible');
            currentPageElement.classList.remove('page-flip-out');
            currentPageElement.classList.remove('page-flip-out-reverse');
            
            // New page animation
            const newPageElement = pages[pageIndex];
            newPageElement.classList.add('visible');
            newPageElement.classList.add(direction === 'forward' ? 'page-flip-in' : 'page-flip-in-reverse');
            
            setTimeout(() => {
                newPageElement.classList.remove('page-flip-in');
                newPageElement.classList.remove('page-flip-in-reverse');
                
                // Update current page
                currentPage = pageIndex;
                
                // Update navigation buttons
                updateNavigationButtons();
                
                isAnimating = false;
            }, 600); // Match animation duration
        }, 600); // Match animation duration
    }
    
    // Update navigation buttons visibility
    function updateNavigationButtons() {
        prevButton.style.visibility = currentPage === 0 ? 'hidden' : 'visible';
        nextButton.style.visibility = currentPage === totalPages - 1 ? 'hidden' : 'visible';
    }
    
    // Play page flip sound
    function playPageFlipSound() {
        if (pageFlipSound) {
            pageFlipSound.currentTime = 0;
            pageFlipSound.play().catch(error => {
                console.log('Audio play failed:', error);
            });
        }
    }
    
    // Open navigation menu
    function openNavigationMenu() {
        navigationMenu.classList.add('active');
        menuButton.style.visibility = 'hidden'; // Hide menu button when menu is open
    }
    
    // Close navigation menu
    function closeNavigationMenu() {
        navigationMenu.classList.remove('active');
        menuButton.style.visibility = 'visible'; // Show menu button when menu is closed
    }
    
    // Event Listeners
    prevButton.addEventListener('click', () => {
        goToPage(currentPage - 1);
    });
    
    nextButton.addEventListener('click', () => {
        goToPage(currentPage + 1);
    });
    
    menuButton.addEventListener('click', openNavigationMenu);
    closeMenu.addEventListener('click', closeNavigationMenu);
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            goToPage(currentPage - 1);
        } else if (e.key === 'ArrowRight') {
            goToPage(currentPage + 1);
        }
    });

    // Check for mobile view and adjust styles (from original script)
    function checkMobileView() {
        if (window.innerWidth <= 576) {
            document.body.style.height = '100%';
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.height = ''; // Reset for desktop
            document.body.style.overflow = 'auto'; // Allow scrolling for desktop
        }
    }
    
    // Initialize the book
    initBook();
    updateNavigationButtons(); // Ensure buttons are correct on init
    checkMobileView(); // Run on load
    window.addEventListener('resize', checkMobileView); // Run on resize
});
