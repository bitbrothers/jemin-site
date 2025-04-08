// Retro Gaming Portfolio - JavaScript

// Global audio context and sound state
let audioContext;
let soundEnabled = false;

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Add retro startup animation
    playRetroStartup();

    // Add sound toggle button to the page
    addSoundToggleButton();

    // Handle navigation click events
    setupNavigation();

    // Setup scroll animations
    setupScrollAnimations();

    // Initialize typewriter effect
    initTypewriterEffect();

    // Setup parallax effect on scroll
    setupParallaxEffect();

    // Add retro sound effects
    setupSoundEffects();

    // Setup glitch effects
    setupGlitchEffects();

    // Setup game loading animation
    setupLoadingAnimation();
    
    // Handle scroll for fixed header
    handleFixedHeaderScroll();
    
    // Setup retro console interactivity
    setupConsoleInteractivity();

    // Setup project cards
    setupProjectCards();
    
    // Setup quest log tabs and interactivity
    setupQuestLog();
    
    // Setup character info section interactivity
    setupCharacterInfo();
    
    // Fix hero buttons to ensure they're clickable
    fixHeroButtons();
    
    // Create scanlines effect for quest log screen
    const questLogScreen = document.querySelector('.quest-log-screen');
    if (questLogScreen) {
        const scanlines = document.createElement('div');
        scanlines.classList.add('screen-scanlines');
        questLogScreen.appendChild(scanlines);
    }
    
    // Set up a series of XP progress bar initializations with increasing delays
    // This helps ensure it's properly initialized even if the DOM is slow to render
    setTimeout(updateXpProgress, 200);
    setTimeout(updateXpProgress, 500);
    setTimeout(updateXpProgress, 1000);
    setTimeout(updateXpProgress, 2000);
    
    // Also initialize when user interacts with the page
    document.addEventListener('click', function() {
        setTimeout(updateXpProgress, 100);
    }, { once: true });
    
    // Setup refresh XP button interactivity
    setupRefreshButton();
});

// Add sound toggle button
function addSoundToggleButton() {
    const soundButton = document.createElement('button');
    soundButton.classList.add('sound-toggle');
    soundButton.innerHTML = '🔇'; // Muted by default
    soundButton.title = 'Enable Sound';
    soundButton.style.position = 'fixed';
    soundButton.style.bottom = '20px';
    soundButton.style.right = '20px';
    soundButton.style.zIndex = '9999';
    soundButton.style.background = 'rgba(0, 0, 0, 0.7)';
    soundButton.style.color = 'var(--accent)';
    soundButton.style.border = '2px solid var(--accent)';
    soundButton.style.borderRadius = '4px';
    soundButton.style.padding = '8px 12px';
    soundButton.style.fontFamily = "'Press Start 2P', cursive";
    soundButton.style.fontSize = '14px';
    soundButton.style.cursor = 'pointer';
    soundButton.style.transition = 'all 0.3s ease';
    
    soundButton.addEventListener('mouseover', function() {
        soundButton.style.transform = 'scale(1.1)';
    });
    
    soundButton.addEventListener('mouseout', function() {
        soundButton.style.transform = 'scale(1)';
    });
    
    soundButton.addEventListener('click', function() {
        toggleSound(soundButton);
    });
    
    document.body.appendChild(soundButton);
}

// Initialize audio context on first user interaction
function initAudioContext() {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    return audioContext;
}

// Toggle sound on/off
function toggleSound(button) {
    soundEnabled = !soundEnabled;
    
    if (soundEnabled) {
        button.innerHTML = '🔊';
        button.title = 'Disable Sound';
        
        // Initialize audio context when enabled
        initAudioContext();
        
        // Play a sound to confirm it's working
        createSynthesizedSound('click');
    } else {
        button.innerHTML = '🔇';
        button.title = 'Enable Sound';
    }
}

// Modified playSound function to check if sound is enabled
function playSound(type) {
    // If sound is not enabled, don't play anything
    if (!soundEnabled) return;
    
    try {
        // Initialize audio context if needed
        initAudioContext();
        
        // First try to use the audio files
        let soundFile;
        let volume = 0.3;
        
        switch(type) {
            case 'hover':
                soundFile = 'assets/sounds/hover.wav';
                volume = 0.2;
                break;
            case 'click':
                soundFile = 'assets/sounds/click.wav';
                volume = 0.3;
                break;
            default:
                // For other sound types, fall back to synthesized sounds
                createSynthesizedSound(type);
                return;
        }
        
        // Play the audio file
        const sound = new Audio(soundFile);
        sound.volume = volume;
        sound.play().catch(error => {
            console.log('Error playing sound:', error);
            // Fallback to synthesized sounds
            createSynthesizedSound(type);
        });
    } catch (error) {
        console.log('Error playing sound:', error);
        // Fallback to synthesized sounds
        createSynthesizedSound(type);
    }
}

// Create synthesized sounds using Web Audio API
function createSynthesizedSound(type) {
    // If sound is not enabled, don't play anything
    if (!soundEnabled) return;
    
    // Make sure audio context is initialized
    const ctx = initAudioContext();
    
    // Resume audio context if it's suspended (browser requirement)
    if (ctx.state === 'suspended') {
        ctx.resume();
    }
    
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    // Configure sound based on type
    switch(type) {
        case 'hover':
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(220, ctx.currentTime);
            gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
            oscillator.start();
            oscillator.stop(ctx.currentTime + 0.1);
            break;
        case 'click':
            oscillator.type = 'square';
            oscillator.frequency.setValueAtTime(330, ctx.currentTime);
            gainNode.gain.setValueAtTime(0.2, ctx.currentTime);
            oscillator.start();
            oscillator.stop(ctx.currentTime + 0.15);
            break;
        case 'power':
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(440, ctx.currentTime);
            gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
            oscillator.frequency.linearRampToValueAtTime(880, ctx.currentTime + 0.2);
            oscillator.start();
            oscillator.stop(ctx.currentTime + 0.3);
            break;
        case 'jump':
            oscillator.type = 'triangle';
            oscillator.frequency.setValueAtTime(150, ctx.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(500, ctx.currentTime + 0.15);
            gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
            oscillator.start();
            oscillator.stop(ctx.currentTime + 0.3);
            break;
    }
}

// Setup interactive elements for the retro console
function setupConsoleInteractivity() {
    // Power button functionality
    const powerButton = document.querySelector('.power-button');
    const screenContent = document.querySelector('.screen-content');
    
    if (powerButton && screenContent) {
        powerButton.addEventListener('click', () => {
            // Play power sound
            playSound('power');
            
            // Toggle screen on/off effect
            screenContent.classList.toggle('screen-off');
            
            if (screenContent.classList.contains('screen-off')) {
                setTimeout(() => {
                    screenContent.classList.remove('screen-off');
                    
                    // Restart typewriter effect
                    const heroSubtitle = document.querySelector('.hero-subtitle');
                    if (heroSubtitle) {
                        heroSubtitle.textContent = '';
                        initTypewriterEffect(true);
                    }
                }, 1500);
            }
        });
    }
    
    // Make D-pad and buttons interactive
    const dPadButtons = document.querySelectorAll('.d-up, .d-right, .d-down, .d-left');
    const actionButtons = document.querySelectorAll('.btn-a, .btn-b');
    
    dPadButtons.forEach(button => {
        button.addEventListener('mousedown', () => {
            button.classList.add('pressed');
            playSound('click');
        });
        
        button.addEventListener('mouseup', () => {
            button.classList.remove('pressed');
        });
        
        button.addEventListener('mouseleave', () => {
            button.classList.remove('pressed');
        });
    });
    
    actionButtons.forEach(button => {
        button.addEventListener('mousedown', () => {
            button.classList.add('pressed');
            playSound('click');
        });
        
        button.addEventListener('mouseup', () => {
            button.classList.remove('pressed');
        });
        
        button.addEventListener('mouseleave', () => {
            button.classList.remove('pressed');
        });
    });
    
    // Add game character animation
    const pixelAvatar = document.querySelector('.pixel-avatar');
    if (pixelAvatar) {
        pixelAvatar.addEventListener('click', () => {
            pixelAvatar.classList.add('jump');
            playSound('jump');
            
            setTimeout(() => {
                pixelAvatar.classList.remove('jump');
            }, 500);
        });
    }
}

// Handle fixed header appearance on scroll
function handleFixedHeaderScroll() {
    const header = document.getElementById('header');
    const heroSection = document.getElementById('hero');
    
    window.addEventListener('scroll', () => {
        const scrollPosition = window.scrollY;
        const heroHeight = heroSection.offsetHeight;
        
        // Change header appearance after scrolling past hero
        if (scrollPosition > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Update active navigation link based on scroll position
        updateActiveNavOnScroll(scrollPosition);
    });
}

// Update active navigation link on scroll
function updateActiveNavOnScroll(scrollPosition) {
    const sections = document.querySelectorAll('section[id]');
    const headerHeight = document.getElementById('header').offsetHeight;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - headerHeight - 20;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            document.querySelectorAll('.nav-links a').forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

// Retro startup animation
function playRetroStartup() {
    const body = document.body;
    const startupOverlay = document.createElement('div');
    
    startupOverlay.style.position = 'fixed';
    startupOverlay.style.top = '0';
    startupOverlay.style.left = '0';
    startupOverlay.style.width = '100%';
    startupOverlay.style.height = '100%';
    startupOverlay.style.backgroundColor = '#000';
    startupOverlay.style.zIndex = '9999';
    startupOverlay.style.display = 'flex';
    startupOverlay.style.flexDirection = 'column';
    startupOverlay.style.justifyContent = 'center';
    startupOverlay.style.alignItems = 'center';
    startupOverlay.style.color = '#fff';
    startupOverlay.style.fontFamily = "'VT323', monospace";
    startupOverlay.style.fontSize = '2rem';
    startupOverlay.style.transition = 'opacity 1s ease';
    
    const logoText = document.createElement('div');
    logoText.textContent = 'JEMIN JOSEPH';
    logoText.style.marginBottom = '2rem';
    logoText.style.fontFamily = "'Press Start 2P', cursive";
    logoText.style.fontSize = '1.5rem';
    logoText.style.color = '#ff6b6b';
    logoText.style.textShadow = '0 0 5px #ff6b6b';
    
    const loadingBar = document.createElement('div');
    loadingBar.style.width = '60%';
    loadingBar.style.height = '20px';
    loadingBar.style.border = '2px solid #ff6b6b';
    loadingBar.style.position = 'relative';
    loadingBar.style.overflow = 'hidden';
    
    const loadingFill = document.createElement('div');
    loadingFill.style.height = '100%';
    loadingFill.style.width = '0%';
    loadingFill.style.backgroundColor = '#ff6b6b';
    loadingFill.style.transition = 'width 2s cubic-bezier(0.1, 0.5, 0.1, 1)';
    
    const statusText = document.createElement('div');
    statusText.style.marginTop = '1rem';
    statusText.textContent = 'LOADING...';
    statusText.style.color = '#4ecdc4';
    
    loadingBar.appendChild(loadingFill);
    startupOverlay.appendChild(logoText);
    startupOverlay.appendChild(loadingBar);
    startupOverlay.appendChild(statusText);
    
    body.appendChild(startupOverlay);
    body.style.overflow = 'hidden';
    
    // Simulate loading process
    setTimeout(() => {
        loadingFill.style.width = '30%';
        statusText.textContent = 'LOADING ASSETS...';
    }, 500);
    
    setTimeout(() => {
        loadingFill.style.width = '60%';
        statusText.textContent = 'INITIALIZING MODULES...';
    }, 1500);
    
    setTimeout(() => {
        loadingFill.style.width = '85%';
        statusText.textContent = 'PREPARING GAME DATA...';
    }, 2500);
    
    setTimeout(() => {
        loadingFill.style.width = '100%';
        statusText.textContent = 'READY TO PLAY!';
    }, 3500);
    
    setTimeout(() => {
        startupOverlay.style.opacity = '0';
        body.style.overflow = '';
    }, 4000);
    
    setTimeout(() => {
        startupOverlay.remove();
    }, 5000);
}

// Setup navigation
function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-links a');
    const headerHeight = document.getElementById('header').offsetHeight;
    
    // Add hover effects to all nav items
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            playSound('hover');
        });
    });
    
    // Handle click navigation and sounds
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Play retro click sound
            playSound('click');
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                // Account for fixed header when scrolling
                const targetPosition = targetSection.offsetTop - headerHeight;
            
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Update active class
                navLinks.forEach(link => link.classList.remove('active'));
                this.classList.add('active');
            }
        });
    });
}

// Setup scroll animations
function setupScrollAnimations() {
    const sections = document.querySelectorAll('.section');
    const headerHeight = document.getElementById('header').offsetHeight;
    
    // Intersection Observer for sections
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                
                // Update navigation is handled separately by updateActiveNavOnScroll
            }
        });
    }, { 
        threshold: 0.2,
        rootMargin: `-${headerHeight}px 0px 0px 0px` // Account for header height
    });
    
    // Observe each section
    sections.forEach(section => {
        observer.observe(section);
    });
    
    // Project card animations
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach((card, index) => {
        card.style.transition = 'transform 0.3s ease, opacity 0.5s ease';
        card.style.opacity = '0';
        card.style.transform = 'translateY(50px)';
        
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 300 + (index * 200));
    });
}

// Initialize typewriter effect
function initTypewriterEffect(immediate = false) {
    const textElement = document.querySelector('.hero-subtitle');
    if (!textElement) return;
    
    const text = "PLAYER 1 - PRESS START";
    textElement.textContent = '';
    
    let i = 0;
    const typeWriter = () => {
        if (i < text.length) {
            textElement.textContent += text.charAt(i);
            i++;
            setTimeout(typeWriter, 100);
        }
    };
    
    if (immediate) {
        typeWriter();
    } else {
    setTimeout(typeWriter, 5000); // Start after startup animation
    }
}

// Setup parallax effect
function setupParallaxEffect() {
    window.addEventListener('scroll', () => {
        const scrollPosition = window.scrollY;
        
        // Move hero elements
        const heroTitle = document.querySelector('.hero-title');
        const heroSubtitle = document.querySelector('.hero-subtitle');
        const pixelDecorations = document.querySelectorAll('.pixel-decoration');
        
        if (heroTitle && heroSubtitle) {
            heroTitle.style.transform = `translateY(${scrollPosition * 0.1}px)`;
            heroSubtitle.style.transform = `translateY(${scrollPosition * 0.05}px)`;
        }
        
        // Move pixel decorations for additional parallax effect
        pixelDecorations.forEach((decoration, index) => {
            const speed = 0.05 + (index * 0.02);
            decoration.style.transform = `translateY(${scrollPosition * speed}px) rotate(${index * 5}deg) scale(${0.7 + (index * 0.1)})`;
        });
    });
}

// Setup sound effects
function setupSoundEffects() {
    const buttons = document.querySelectorAll('.btn, .btn-mini');
    
    buttons.forEach(button => {
        button.addEventListener('mouseenter', () => {
            playSound('hover');
        });
        
        button.addEventListener('click', () => {
            playSound('click');
        });
    });
}

// Setup glitch effects
function setupGlitchEffects() {
    const glitchElements = document.querySelectorAll('.glitch');
    
    glitchElements.forEach(element => {
        setInterval(() => {
            element.classList.add('glitching');
            setTimeout(() => {
                element.classList.remove('glitching');
            }, 200);
        }, 5000 + Math.random() * 10000); // Random interval between 5-15 seconds
    });
    
    // Random CRT flicker
    const crtOverlay = document.querySelector('.crt-overlay');
    
    setInterval(() => {
        crtOverlay.style.opacity = '0.5';
        setTimeout(() => {
            crtOverlay.style.opacity = '0.3';
        }, 100);
    }, 7000 + Math.random() * 15000); // Random interval
}

// Setup loading animation for project cards
function setupLoadingAnimation() {
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            // Play hover sound
            playSound('hover');
            
            // Add loading animation
            const img = card.querySelector('.project-img img');
            if (img) {
                img.style.opacity = '0.7';
                
                // Create loading text
                const loadingText = document.createElement('div');
                loadingText.textContent = 'LOADING...';
                loadingText.style.position = 'absolute';
                loadingText.style.top = '50%';
                loadingText.style.left = '50%';
                loadingText.style.transform = 'translate(-50%, -50%)';
                loadingText.style.color = '#ffe66d';
                loadingText.style.fontFamily = "'Press Start 2P', cursive";
                loadingText.style.fontSize = '0.8rem';
                loadingText.style.zIndex = '2';
                loadingText.classList.add('loading-text');
                
                const imgContainer = card.querySelector('.project-img');
                
                // Only add if it doesn't exist yet
                if (!imgContainer.querySelector('.loading-text')) {
                    imgContainer.appendChild(loadingText);
                }
            }
        });
        
        card.addEventListener('mouseleave', () => {
            // Reset loading animation
            const img = card.querySelector('.project-img img');
            if (img) {
                img.style.opacity = '1';
                
                // Remove loading text if it exists
                const loadingText = card.querySelector('.loading-text');
                if (loadingText) {
                    loadingText.remove();
                }
            }
        });
    });
}

// Setup quest log interactions
function setupQuestLog() {
    const questTabs = document.querySelectorAll('.quest-tab');
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    // Set first tab as active by default
    if (questTabs.length > 0) {
        questTabs[0].classList.add('active');
    }
    
    // Initialize XP progress bar
    updateXpProgress();
    
    // Add click event listeners to tabs
    questTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Play sound effect
            playSound('click');
            
            // Remove active class from all tabs
            questTabs.forEach(t => t.classList.remove('active'));
            
            // Add active class to clicked tab
            tab.classList.add('active');
            
            // Get the year from the tab
            const year = tab.getAttribute('data-year');
            
            // Show/hide timeline items based on selected year
            timelineItems.forEach(item => {
                if (year === 'all' || item.getAttribute('data-year') === year) {
                    // Show the item with animation
                    item.style.display = 'flex';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'translateX(0)';
                    }, 50);
                } else {
                    // Hide the item with animation
                    item.style.opacity = '0';
                    item.style.transform = 'translateX(-20px)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
            
            // Update XP progress after filtering
            updateXpProgress();
        });
        
        // Add hover sound effect
        tab.addEventListener('mouseenter', () => {
            playSound('hover');
        });
    });
    
    // Add hover effects to timeline items with hover sound
    timelineItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            playSound('hover');
            
            // Highlight the timeline dot
            const dot = item.querySelector('.timeline-dot');
            if (dot) {
                dot.style.transform = 'translateX(-50%) scale(1.3)';
                dot.style.boxShadow = '0 0 25px var(--accent)';
            }
        });
        
        item.addEventListener('mouseleave', () => {
            // Reset the timeline dot
            const dot = item.querySelector('.timeline-dot');
            if (dot) {
                dot.style.transform = 'translateX(-50%) scale(1)';
                dot.style.boxShadow = '0 0 15px var(--accent)';
            }
        });
    });
    
    // Add parallax effect to quest items
    document.addEventListener('mousemove', (e) => {
        const questCards = document.querySelectorAll('.timeline-content');
        const mouseX = e.clientX / window.innerWidth - 0.5;
        const mouseY = e.clientY / window.innerHeight - 0.5;
        
        questCards.forEach(card => {
            if (isElementInViewport(card)) {
                const rect = card.getBoundingClientRect();
                const cardCenterX = rect.left + rect.width / 2;
                const cardCenterY = rect.top + rect.height / 2;
                
                // Calculate distance from mouse to card center
                const distX = (e.clientX - cardCenterX) / rect.width;
                const distY = (e.clientY - cardCenterY) / rect.height;
                
                // Apply rotation based on mouse position relative to card
                card.style.transform = `perspective(1000px) rotateY(${distX * 5}deg) rotateX(${-distY * 5}deg)`;
            }
        });
    });
    
    // Reset card transformations when mouse leaves the window
    document.addEventListener('mouseleave', () => {
        const questCards = document.querySelectorAll('.timeline-content');
        questCards.forEach(card => {
            card.style.transform = '';
        });
    });
}

// Calculate and update XP progress
function updateXpProgress() {
    const visibleItems = document.querySelectorAll('.timeline-item[style*="display: flex"], .timeline-item:not([style*="display: none"])');
    const progressFill = document.querySelector('.xp-fill');
    const xpLabel = document.querySelector('.xp-label');
    const playerLevel = document.querySelector('.player-level');
    const xpProgress = document.querySelector('.xp-progress');
    
    if (progressFill && xpLabel && playerLevel && xpProgress) {
        let totalXP = 0;
        
        visibleItems.forEach(item => {
            const xpValue = parseInt(item.getAttribute('data-xp') || '0');
            totalXP += xpValue;
        });
        
        // Store the current level for comparison
        const currentLevel = parseInt(playerLevel.getAttribute('data-level') || '1');
        
        // Calculate level (1 level per 1000 XP)
        const level = Math.floor(totalXP / 1000) + 1;
        const nextLevelXP = level * 1000;
        const prevLevelXP = (level - 1) * 1000;
        const levelProgress = ((totalXP - prevLevelXP) / (nextLevelXP - prevLevelXP)) * 100;
        
        // Force a reflow by accessing offsetHeight
        progressFill.style.width = '0%';
        console.log('Forcing reflow:', progressFill.offsetHeight);
        
        // Use requestAnimationFrame to ensure the browser applies the style change
        requestAnimationFrame(() => {
            // Update UI elements with more specific styling to ensure it works
            console.log('Setting XP progress width to:', levelProgress + '%');
            
            // Force the fill to be visible with multiple style properties
            progressFill.style.cssText = `
                width: ${levelProgress}% !important; 
                display: block !important;
                visibility: visible !important;
                background: linear-gradient(to right, var(--secondary), var(--accent));
            `;
            
            xpLabel.textContent = `XP: ${totalXP} / ${nextLevelXP}`;
            playerLevel.textContent = `LEVEL ${level} - SOFTWARE DEVELOPER`;
            
            // Store the current level as a data attribute
            playerLevel.setAttribute('data-level', level.toString());
            
            // Add shine animation to XP progress
            xpProgress.classList.add('xp-shine');
            
            // Remove animation class after animation completes
            setTimeout(() => {
                xpProgress.classList.remove('xp-shine');
            }, 1500);
            
            // Check if player leveled up
            if (level > currentLevel) {
                console.log('Level up! From level', currentLevel, 'to', level);
                
                // Play level up sound
                playLevelUpSound();
                
                // Add level up animation
                playerLevel.classList.add('level-up');
                
                // Create and append level up notification
                const levelUpNotification = document.createElement('div');
                levelUpNotification.className = 'level-up-notification';
                levelUpNotification.textContent = `LEVEL UP! → ${level}`;
                document.querySelector('.progress-bar-container').appendChild(levelUpNotification);
                
                // Remove notification and animation class after animation completes
                setTimeout(() => {
                    levelUpNotification.remove();
                    playerLevel.classList.remove('level-up');
                }, 3000);
            }
        });
    } else {
        console.error('XP progress elements not found!');
    }
}

// Function to play a synthesized level up sound
function playLevelUpSound() {
    // If sound is not enabled, don't play anything
    if (!soundEnabled) return;
    
    // Make sure audio context is initialized
    const ctx = initAudioContext();
    
    // Resume audio context if it's suspended
    if (ctx.state === 'suspended') {
        ctx.resume();
    }
    
    // Create oscillator for base tone
    const oscillator1 = ctx.createOscillator();
    oscillator1.type = 'sine';
    oscillator1.frequency.setValueAtTime(440, ctx.currentTime); // A4
    oscillator1.frequency.linearRampToValueAtTime(880, ctx.currentTime + 0.1); // A5
    
    // Create oscillator for harmony
    const oscillator2 = ctx.createOscillator();
    oscillator2.type = 'triangle';
    oscillator2.frequency.setValueAtTime(554, ctx.currentTime + 0.1); // C#5
    oscillator2.frequency.linearRampToValueAtTime(1108, ctx.currentTime + 0.2); // C#6
    
    // Create oscillator for fanfare
    const oscillator3 = ctx.createOscillator();
    oscillator3.type = 'square';
    oscillator3.frequency.setValueAtTime(659, ctx.currentTime + 0.2); // E5
    oscillator3.frequency.setValueAtTime(880, ctx.currentTime + 0.3); // A5
    
    // Create gain node for volume control
    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.8);
    
    // Connect nodes
    oscillator1.connect(gainNode);
    oscillator2.connect(gainNode);
    oscillator3.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    // Start and stop oscillators
    oscillator1.start(ctx.currentTime);
    oscillator1.stop(ctx.currentTime + 0.2);
    
    oscillator2.start(ctx.currentTime + 0.1);
    oscillator2.stop(ctx.currentTime + 0.4);
    
    oscillator3.start(ctx.currentTime + 0.2);
    oscillator3.stop(ctx.currentTime + 0.8);
}

// Add window resize handler to recalculate XP progress
let resizeTimer;
window.addEventListener('resize', function() {
    // Debounce to avoid excessive recalculations
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
        console.log('Window resized, recalculating XP progress...');
        updateXpProgress();
    }, 200);
});

// Helper function to check if element is in viewport
function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// Add scroll animation for timeline items
window.addEventListener('scroll', () => {
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    timelineItems.forEach(item => {
        const rect = item.getBoundingClientRect();
        const isVisible = (rect.top <= window.innerHeight * 0.8);
        
        if (isVisible) {
            item.classList.add('fade-in');
            
            // Stagger the appearance of list items
            const listItems = item.querySelectorAll('.quest-list li');
            listItems.forEach((li, index) => {
                setTimeout(() => {
                    li.style.opacity = '1';
                    li.style.transform = 'translateX(0)';
                }, 300 + (index * 100));
            });
        }
    });
});

// Setup project cards
function setupProjectCards() {
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach((card, index) => {
        // Add staggered animation effect
        card.style.animationDelay = `${index * 0.2}s`;
        
        // Add hover effects
        card.addEventListener('mouseenter', () => {
            try {
                const hoverSound = new Audio('assets/sounds/hover.wav');
                hoverSound.volume = 0.2;
                hoverSound.play();
            } catch (error) {
                console.log('Hover sound could not be played:', error);
                // Fallback to synthesized sound
                playSound('hover');
            }
        });
        
        // Add click effects
        card.addEventListener('click', () => {
            try {
                const selectSound = new Audio('assets/sounds/select.wav');
                selectSound.volume = 0.3;
                selectSound.play();
            } catch (error) {
                console.log('Click sound could not be played:', error);
                // Fallback to synthesized sound
                playSound('click');
            }
        });
    });
}

// Setup refresh XP button interactivity
function setupRefreshButton() {
    const refreshButton = document.getElementById('refresh-xp');
    if (refreshButton) {
        refreshButton.addEventListener('mouseenter', () => {
            playSound('hover');
        });
        
        refreshButton.addEventListener('click', () => {
            // Play sound effect
            playSound('click');
            
            // Add a flash animation
            refreshButton.classList.add('flash-animation');
            setTimeout(() => {
                refreshButton.classList.remove('flash-animation');
            }, 500);
            
            // Update XP progress
            updateXpProgress();
            
            // Return false to prevent default button behavior
            return false;
        });
    }
}

// Setup character info section interactivity
function setupCharacterInfo() {
    // Handle backstory toggle
    const backstoryToggle = document.querySelector('.backstory-toggle');
    const backstoryContent = document.querySelector('.character-backstory');
    
    if (backstoryToggle && backstoryContent) {
        backstoryToggle.addEventListener('click', () => {
            // Play click sound
            playSound('click');
            
            // Toggle backstory visibility
            backstoryContent.classList.toggle('expanded');
            backstoryToggle.classList.toggle('active');
        });
        
        // Add hover sound
        backstoryToggle.addEventListener('mouseenter', () => {
            playSound('hover');
        });
    }
    
    // Add hover effects and sounds to skill tags
    const skillTags = document.querySelectorAll('.skill-tag');
    skillTags.forEach(tag => {
        tag.addEventListener('mouseenter', () => {
            playSound('hover');
        });
    });
    
    // Add 3D hover effect to character card
    const characterCard = document.querySelector('.character-card');
    if (characterCard) {
        characterCard.addEventListener('mousemove', (e) => {
            const rect = characterCard.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateY = ((x - centerX) / centerX) * 5;
            const rotateX = ((centerY - y) / centerY) * 5;
            
            characterCard.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.03, 1.03, 1.03)`;
        });
        
        characterCard.addEventListener('mouseleave', () => {
            characterCard.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
        });
    }
    
    // Add stat fill animation on scroll
    const characterStats = document.querySelector('.character-stats');
    if (characterStats) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const statFills = characterStats.querySelectorAll('.stat-fill');
                    statFills.forEach((fill, index) => {
                        // Store the original width value before resetting
                        const originalWidth = fill.getAttribute('data-width') || 
                                            fill.style.width || 
                                            getComputedStyle(fill).width;
                        
                        // Convert to percentage if needed
                        let targetWidth;
                        if (originalWidth.includes('%')) {
                            targetWidth = originalWidth;
                        } else if (originalWidth.includes('px')) {
                            // Convert px to percentage if needed
                            const barWidth = fill.parentElement.offsetWidth;
                            const fillWidth = parseFloat(originalWidth);
                            targetWidth = (fillWidth / barWidth * 100) + '%';
                        } else {
                            // Fallback to the inline style from HTML
                            const inlineStyle = fill.getAttribute('style');
                            if (inlineStyle && inlineStyle.includes('width:')) {
                                targetWidth = inlineStyle.split('width:')[1].trim().split(';')[0];
                            } else {
                                // Last resort fallback
                                targetWidth = '90%';
                            }
                        }
                        
                        // Store the width as a data attribute for future reference
                        fill.setAttribute('data-width', targetWidth);
                        
                        // Reset width to 0 first
                        fill.style.width = '0%';
                        
                        // Animate to full width with delay based on index
                        setTimeout(() => {
                            fill.style.transition = 'width 1s cubic-bezier(0.17, 0.67, 0.83, 0.67)';
                            fill.style.width = targetWidth;
                        }, 300 + (index * 150));
                    });
                    
                    // Stop observing after animation
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(characterStats);
    }
    
    // Add contact item interactions
    setupContactItemInteractions();
}

// Setup contact info item interactions
function setupContactItemInteractions() {
    const contactItems = document.querySelectorAll('.contact-item');
    
    contactItems.forEach(item => {
        // Add hover sound effect
        item.addEventListener('mouseenter', () => {
            playSound('hover');
            
            // Create animated glow effect for icon
            const icon = item.querySelector('.contact-icon');
            if (icon) {
                icon.style.boxShadow = '0 0 15px var(--accent)';
                icon.style.transform = 'scale(1.1)';
            }
        });
        
        item.addEventListener('mouseleave', () => {
            // Reset icon styling
            const icon = item.querySelector('.contact-icon');
            if (icon) {
                icon.style.boxShadow = '';
                icon.style.transform = '';
            }
        });
        
        // Add click effect
        item.addEventListener('click', () => {
            playSound('click');
            
            // Create flash animation
            item.style.backgroundColor = 'rgba(78, 205, 196, 0.2)';
            setTimeout(() => {
                item.style.backgroundColor = '';
            }, 200);
            
            // Copy text to clipboard if possible
            const valueText = item.querySelector('.contact-value');
            if (valueText && navigator.clipboard) {
                // Get the actual text content, not the displayed text
                const textToCopy = valueText.textContent.trim();
                
                navigator.clipboard.writeText(textToCopy)
                    .then(() => {
                        // Show copied feedback
                        const originalText = valueText.textContent;
                        const originalFontSize = window.getComputedStyle(valueText).fontSize;
                        
                        // Set copied text with proper styling
                        valueText.textContent = 'COPIED!';
                        valueText.style.fontSize = '0.7rem'; // Make "COPIED!" text larger
                        valueText.style.color = 'var(--accent)';
                        
                        setTimeout(() => {
                            // Restore original text and styling
                            valueText.textContent = originalText;
                            valueText.style.fontSize = originalFontSize;
                            valueText.style.color = '';
                        }, 1000);
                    })
                    .catch(err => {
                        console.error('Could not copy text: ', err);
                    });
            }
        });
    });
    
    // Animate power meter on load
    const powerFill = document.querySelector('.power-fill');
    if (powerFill) {
        powerFill.style.width = '0%';
        
        setTimeout(() => {
            powerFill.style.transition = 'width 1.5s cubic-bezier(0.17, 0.67, 0.83, 0.67)';
            const targetWidth = powerFill.style.width.split('%')[0] || '85';
            powerFill.style.width = targetWidth + '%';
        }, 500);
    }
}

// Fix hero buttons to ensure they're clickable
function fixHeroButtons() {
    const viewGamesButton = document.querySelector('.button-container .btn-primary');
    const contactButton = document.querySelector('.button-container .btn-outline');
    
    if (viewGamesButton) {
        viewGamesButton.addEventListener('click', (e) => {
            // Prevent default to manually handle navigation
            e.preventDefault();
            
            // Play click sound
            playSound('click');
            
            // Scroll to projects section
            const projectsSection = document.getElementById('projects');
            if (projectsSection) {
                projectsSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
    
    if (contactButton) {
        contactButton.addEventListener('click', (e) => {
            // Prevent default to manually handle navigation
            e.preventDefault();
            
            // Play click sound
            playSound('click');
            
            // Scroll to contact section
            const contactSection = document.getElementById('contact');
            if (contactSection) {
                contactSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
}