// Configuration
const correctPassword = '0708'; // Change this to your special date
const photoSources = [
    'putri/putri1.jpeg',
    'putri/putri2.jpeg',
    'putri/putri3.jpeg'
];

// State
let enteredPassword = '';
let currentPhotoIndex = 0;

// Elements
const passwordDisplay = document.querySelector('.password-display');
const digitPlaceholders = document.querySelectorAll('.digit-placeholder');
const errorMessage = document.getElementById('error-message');
const passwordPage = document.getElementById('password-page');
const loadingPage = document.getElementById('loading-page');
const letterPage = document.getElementById('letter-page');
const keys = document.querySelectorAll('.key[data-value]');
const clearBtn = document.getElementById('clear');
const backspaceBtn = document.getElementById('backspace');
const unlockBtn = document.getElementById('unlock-btn');
const viewAllBtn = document.getElementById('view-all-photos');
const photoCards = document.querySelectorAll('.photo-card');
const galleryModal = document.getElementById('gallery-modal');
const modalImage = document.getElementById('modal-image');
const closeModal = document.getElementById('close-modal');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const photoCounter = document.getElementById('photo-counter');
const floatingHearts = document.querySelector('.floating-hearts');
const audioPlayer = document.getElementById('love-song');

// Initialize
function init() {
    createFloatingHearts();
    setupEventListeners();
    setupAudioPlayer();
}

// Create floating hearts in background
function createFloatingHearts() {
    const hearts = ['❤️', '💖', '💕', '💗', '💓', '💞'];
    for (let i = 0; i < 15; i++) {
        const heart = document.createElement('div');
        heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
        heart.style.cssText = `
            position: fixed;
            font-size: ${Math.random() * 20 + 15}px;
            opacity: ${Math.random() * 0.3 + 0.1};
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation: float ${Math.random() * 15 + 10}s linear infinite;
            animation-delay: -${Math.random() * 10}s;
            pointer-events: none;
            z-index: -1;
        `;
        floatingHearts.appendChild(heart);
    }
}

// Setup all event listeners
function setupEventListeners() {
    // Number keys
    keys.forEach(key => {
        key.addEventListener('click', () => {
            if (enteredPassword.length < correctPassword.length) {
                enteredPassword += key.dataset.value;
                updatePasswordDisplay();
            }
        });
    });

    // Clear button
    clearBtn.addEventListener('click', () => {
        enteredPassword = '';
        updatePasswordDisplay();
        hideError();
    });

    // Backspace button
    backspaceBtn.addEventListener('click', () => {
        enteredPassword = enteredPassword.slice(0, -1);
        updatePasswordDisplay();
        hideError();
    });

    // Unlock button
    unlockBtn.addEventListener('click', checkPassword);

    // Photo cards click
    photoCards.forEach(card => {
        card.addEventListener('click', () => {
            const index = parseInt(card.dataset.index);
            openGallery(index);
        });
    });

    // View all photos button
    viewAllBtn.addEventListener('click', () => openGallery(0));

    // Gallery navigation
    prevBtn.addEventListener('click', () => navigateGallery(-1));
    nextBtn.addEventListener('click', () => navigateGallery(1));

    // Close modal
    closeModal.addEventListener('click', closeGallery);
    galleryModal.addEventListener('click', (e) => {
        if (e.target === galleryModal) closeGallery();
    });

    // Keyboard support
    document.addEventListener('keydown', handleKeyPress);
}

// Setup audio player
function setupAudioPlayer() {
    if (audioPlayer) {
        audioPlayer.volume = 0.3;
        audioPlayer.addEventListener('play', () => {
            // Add visual feedback when music plays
            document.body.style.animation = 'gradientFlow 10s ease infinite';
        });
    }
}

// Handle keyboard input
function handleKeyPress(e) {
    if (passwordPage.classList.contains('active')) {
        if (e.key >= '0' && e.key <= '9') {
            if (enteredPassword.length < correctPassword.length) {
                enteredPassword += e.key;
                updatePasswordDisplay();
            }
        } else if (e.key === 'Backspace') {
            enteredPassword = enteredPassword.slice(0, -1);
            updatePasswordDisplay();
            hideError();
        } else if (e.key === 'Enter') {
            checkPassword();
        } else if (e.key === 'Escape') {
            enteredPassword = '';
            updatePasswordDisplay();
            hideError();
        }
    } else if (galleryModal.classList.contains('hidden') === false) {
        if (e.key === 'ArrowLeft') navigateGallery(-1);
        else if (e.key === 'ArrowRight') navigateGallery(1);
        else if (e.key === 'Escape') closeGallery();
    }
}

// Update password display with animation
function updatePasswordDisplay() {
    digitPlaceholders.forEach((placeholder, index) => {
        if (index < enteredPassword.length) {
            placeholder.textContent = '❤️';
            placeholder.classList.add('filled');
        } else {
            placeholder.textContent = '_';
            placeholder.classList.remove('filled');
        }
    });

    // Add typing animation
    if (enteredPassword.length > 0) {
        const lastIndex = enteredPassword.length - 1;
        digitPlaceholders[lastIndex].style.animation = 'none';
        setTimeout(() => {
            digitPlaceholders[lastIndex].style.animation = 'popIn 0.3s ease';
        }, 10);
    }
}

// Hide error message
function hideError() {
    errorMessage.classList.remove('show');
}

// Check password
function checkPassword() {
    if (enteredPassword.length !== correctPassword.length) {
        showError();
        return;
    }

    if (enteredPassword === correctPassword) {
        // Correct password
        unlockHeart();
    } else {
        // Wrong password
        showError();
    }
}

// Show error with animation
function showError() {
    errorMessage.classList.add('show');
    
    // Shake animation for password display
    passwordDisplay.style.animation = 'shake 0.5s ease';
    setTimeout(() => {
        passwordDisplay.style.animation = '';
    }, 500);

    // Clear password after delay
    setTimeout(() => {
        enteredPassword = '';
        updatePasswordDisplay();
        errorMessage.classList.remove('show');
    }, 1500);
}

// Unlock heart animation
function unlockHeart() {
    // Disable input
    keys.forEach(key => key.disabled = true);
    unlockBtn.disabled = true;

    // Heart unlock animation
    const heartIcon = document.querySelector('.heart-icon');
    heartIcon.style.animation = 'heartbeat 0.5s ease 3';

    // Transition to loading page
    setTimeout(() => {
        passwordPage.classList.remove('active');
        passwordPage.classList.add('hidden');
        loadingPage.classList.remove('hidden');
        loadingPage.classList.add('active');

        // Simulate loading progress
        simulateLoading();
    }, 1000);
}

// Simulate loading progress
function simulateLoading() {
    const progressFill = document.querySelector('.progress-fill');
    const loadingText = document.querySelector('.loading-text');
    const texts = [
        "Finding our special moments...",
        "Opening the love letter...",
        "Warming up my heart...",
        "Almost there, my love..."
    ];

    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.random() * 10 + 5;
        if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
            
            // Switch text
            let textIndex = 0;
            const textInterval = setInterval(() => {
                loadingText.textContent = texts[textIndex];
                textIndex++;
                if (textIndex >= texts.length) {
                    clearInterval(textInterval);
                    showLetterPage();
                }
            }, 400);
        }
        progressFill.style.width = `${progress}%`;
    }, 100);
}

// Show letter page with effects
function showLetterPage() {
    loadingPage.classList.remove('active');
    loadingPage.classList.add('hidden');
    letterPage.classList.remove('hidden');
    letterPage.classList.add('active');

    // Create confetti celebration
    createConfetti();

    // Auto-play music gently
    setTimeout(() => {
        if (audioPlayer) {
            audioPlayer.play().catch(e => {
                console.log("Autoplay prevented. User can play manually.");
            });
        }
    }, 1000);
}

// Create confetti effect
function createConfetti() {
    const colors = ['#ff6b9d', '#ffd166', '#06d6a0', '#118ab2', '#ef476f'];
    
    for (let i = 0; i < 50; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.setProperty('--color', colors[Math.floor(Math.random() * colors.length)]);
            confetti.style.left = `${Math.random() * 100}%`;
            confetti.style.width = `${Math.random() * 15 + 5}px`;
            confetti.style.height = confetti.style.width;
            confetti.style.animationDuration = `${Math.random() * 2 + 2}s`;
            confetti.style.animationDelay = `${Math.random() * 0.5}s`;
            
            document.body.appendChild(confetti);
            
            // Remove confetti after animation
            setTimeout(() => {
                confetti.remove();
            }, 3000);
        }, i * 30);
    }
}

// Open gallery modal
function openGallery(index) {
    currentPhotoIndex = index;
    updateGalleryImage();
    galleryModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

// Close gallery modal
function closeGallery() {
    galleryModal.classList.add('hidden');
    document.body.style.overflow = '';
}

// Navigate gallery
function navigateGallery(direction) {
    currentPhotoIndex += direction;
    
    // Loop around
    if (currentPhotoIndex < 0) {
        currentPhotoIndex = photoSources.length - 1;
    } else if (currentPhotoIndex >= photoSources.length) {
        currentPhotoIndex = 0;
    }
    
    updateGalleryImage();
}

// Update gallery image with transition
function updateGalleryImage() {
    modalImage.style.opacity = '0';
    
    setTimeout(() => {
        modalImage.src = photoSources[currentPhotoIndex];
        modalImage.alt = `Memory ${currentPhotoIndex + 1}`;
        photoCounter.textContent = `${currentPhotoIndex + 1} / ${photoSources.length}`;
        
        modalImage.style.opacity = '1';
    }, 200);
}

// Initialize the application
document.addEventListener('DOMContentLoaded', init);