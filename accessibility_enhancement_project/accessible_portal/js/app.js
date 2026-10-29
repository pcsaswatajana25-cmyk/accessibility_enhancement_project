/**
 * TechForward Insights - Production Accessible Application Logic
 * Adheres strictly to W3C WAI-ARIA Authoring Practices (APG) and WCAG 2.1/2.2 AA.
 */

document.addEventListener('DOMContentLoaded', () => {
    initDisplayToolbar();
    initMobileNav();
    initSearchAndFilter();
    initAccordion();
    initShareModal();
    initNewsletterValidation();
});

/* ==========================================================================
   1. Accessibility & Display Preferences Toolbar
   ========================================================================== */
function initDisplayToolbar() {
    const themeToggle = document.getElementById('theme-toggle');
    const contrastToggle = document.getElementById('contrast-toggle');
    const textSizeToggle = document.getElementById('text-size-toggle');
    const announcer = document.getElementById('toolbar-announcer');

    function announce(message) {
        if (!announcer) return;
        announcer.textContent = '';
        setTimeout(() => {
            announcer.textContent = message;
        }, 50);
    }

    // Dark Theme Toggle
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const isDark = document.body.classList.toggle('dark-mode');
            themeToggle.setAttribute('aria-pressed', String(isDark));
            const btnText = themeToggle.querySelector('.btn-text');
            if (btnText) btnText.textContent = `Dark Mode: ${isDark ? 'On' : 'Off'}`;
            announce(`Dark mode ${isDark ? 'enabled' : 'disabled'}`);
        });
    }

    // High Contrast Mode Toggle
    if (contrastToggle) {
        contrastToggle.addEventListener('click', () => {
            const isHighContrast = document.body.classList.toggle('high-contrast');
            contrastToggle.setAttribute('aria-pressed', String(isHighContrast));
            const btnText = contrastToggle.querySelector('.btn-text');
            if (btnText) btnText.textContent = `High Contrast: ${isHighContrast ? 'On' : 'Off'}`;
            announce(`High contrast mode ${isHighContrast ? 'activated' : 'deactivated'}`);
        });
    }

    // Text Size Toggle
    if (textSizeToggle) {
        textSizeToggle.addEventListener('click', () => {
            const isLarge = document.body.classList.toggle('large-text-mode');
            textSizeToggle.setAttribute('aria-pressed', String(isLarge));
            const btnText = textSizeToggle.querySelector('.btn-text');
            if (btnText) btnText.textContent = `Text Size: ${isLarge ? 'Large (120%)' : 'Normal'}`;
            announce(`Text sizing set to ${isLarge ? 'large' : 'standard'}`);
        });
    }
}

/* ==========================================================================
   2. Accessible Mobile Navigation
   ========================================================================== */
function initMobileNav() {
    const toggleBtn = document.getElementById('mobile-nav-toggle');
    const primaryNav = document.getElementById('primary-nav');

    if (!toggleBtn || !primaryNav) return;

    toggleBtn.addEventListener('click', () => {
        const isOpen = primaryNav.classList.toggle('is-open');
        toggleBtn.setAttribute('aria-expanded', String(isOpen));
        const label = toggleBtn.querySelector('.menu-label');
        if (label) label.textContent = isOpen ? 'Close' : 'Menu';
    });

    // Close on Escape key
    primaryNav.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && primaryNav.classList.contains('is-open')) {
            primaryNav.classList.remove('is-open');
            toggleBtn.setAttribute('aria-expanded', 'false');
            toggleBtn.focus();
        }
    });
}

/* ==========================================================================
   3. Dynamic Search & Category Filtering with ARIA Live Announcements
   ========================================================================== */
function initSearchAndFilter() {
    const searchInput = document.getElementById('search-input');
    const clearBtn = document.getElementById('clear-search-btn');
    const filterChips = document.querySelectorAll('.filter-chip');
    const articleCards = document.querySelectorAll('.article-card');
    const noArticlesMsg = document.getElementById('no-articles-message');
    const resetFilterBtn = document.getElementById('reset-filter-btn');
    const statusLiveRegion = document.getElementById('search-results-status');

    let currentCategory = 'all';
    let searchQuery = '';

    function announceResults(count, query, category) {
        if (!statusLiveRegion) return;
        let message = '';
        if (count === 0) {
            message = `No articles found matching "${query || category}". Use reset filters to display all content.`;
        } else {
            const queryPart = query ? ` for search term "${query}"` : '';
            const catPart = category !== 'all' ? ` in topic "${category}"` : '';
            message = `Showing ${count} article${count === 1 ? '' : 's'}${queryPart}${catPart}.`;
        }
        statusLiveRegion.textContent = '';
        setTimeout(() => {
            statusLiveRegion.textContent = message;
        }, 100);
    }

    function applyFilters() {
        let visibleCount = 0;
        const normalizedQuery = searchQuery.trim().toLowerCase();

        articleCards.forEach(card => {
            const cardCategory = card.getAttribute('data-category');
            const cardTitle = card.querySelector('.card-title')?.textContent.toLowerCase() || '';
            const cardDesc = card.querySelector('.card-description')?.textContent.toLowerCase() || '';

            const matchesCategory = (currentCategory === 'all' || cardCategory === currentCategory);
            const matchesQuery = !normalizedQuery || cardTitle.includes(normalizedQuery) || cardDesc.includes(normalizedQuery);

            if (matchesCategory && matchesQuery) {
                card.hidden = false;
                visibleCount++;
            } else {
                card.hidden = true;
            }
        });

        if (noArticlesMsg) {
            noArticlesMsg.hidden = (visibleCount > 0);
        }

        announceResults(visibleCount, searchQuery, currentCategory);
    }

    // Search Input Event
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            searchQuery = e.target.value;
            if (clearBtn) clearBtn.hidden = !searchQuery;
            applyFilters();
        });
    }

    // Clear Button
    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            if (searchInput) {
                searchInput.value = '';
                searchQuery = '';
                clearBtn.hidden = true;
                searchInput.focus();
                applyFilters();
            }
        });
    }

    // Category Chips Toggle
    filterChips.forEach(chip => {
        chip.addEventListener('click', () => {
            filterChips.forEach(c => {
                c.classList.remove('active');
                c.setAttribute('aria-pressed', 'false');
            });
            chip.classList.add('active');
            chip.setAttribute('aria-pressed', 'true');
            currentCategory = chip.getAttribute('data-category') || 'all';
            applyFilters();
        });
    });

    // Reset Button in Empty State
    if (resetFilterBtn) {
        resetFilterBtn.addEventListener('click', () => {
            if (searchInput) {
                searchInput.value = '';
                searchQuery = '';
                if (clearBtn) clearBtn.hidden = true;
            }
            currentCategory = 'all';
            filterChips.forEach(c => {
                const isAll = c.getAttribute('data-category') === 'all';
                c.classList.toggle('active', isAll);
                c.setAttribute('aria-pressed', String(isAll));
            });
            applyFilters();
            if (searchInput) searchInput.focus();
        });
    }
}

/* ==========================================================================
   4. WAI-ARIA Compliant Accordion (APG Disclosure/Accordion Pattern)
   ========================================================================== */
function initAccordion() {
    const accordionTriggers = document.querySelectorAll('.accordion-trigger');

    accordionTriggers.forEach((trigger, index) => {
        trigger.addEventListener('click', () => {
            const isExpanded = trigger.getAttribute('aria-expanded') === 'true';
            const panelId = trigger.getAttribute('aria-controls');
            const panel = document.getElementById(panelId);

            trigger.setAttribute('aria-expanded', String(!isExpanded));
            if (panel) {
                panel.hidden = isExpanded;
            }
        });

        // Keyboard arrow navigation between accordion triggers
        trigger.addEventListener('keydown', (e) => {
            let targetIndex = null;
            if (e.key === 'ArrowDown') {
                targetIndex = (index + 1) % accordionTriggers.length;
            } else if (e.key === 'ArrowUp') {
                targetIndex = (index - 1 + accordionTriggers.length) % accordionTriggers.length;
            } else if (e.key === 'Home') {
                targetIndex = 0;
            } else if (e.key === 'End') {
                targetIndex = accordionTriggers.length - 1;
            }

            if (targetIndex !== null) {
                e.preventDefault();
                accordionTriggers[targetIndex].focus();
            }
        });
    });
}

/* ==========================================================================
   5. Accessible Modal Dialog with Focus Trap & Focus Restoration
   ========================================================================== */
function initShareModal() {
    const openBtn = document.getElementById('open-share-dialog-btn');
    const modal = document.getElementById('share-dialog');
    const closeBtn = document.getElementById('close-share-dialog-btn');
    const dismissBtn = document.getElementById('dismiss-share-dialog-btn');
    const copyBtn = document.getElementById('copy-link-btn');
    const copyInput = document.getElementById('share-permalink');
    const copyStatus = document.getElementById('copy-status');

    let previousActiveElement = null;

    if (!modal || !openBtn) return;

    function getFocusableElements() {
        return modal.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
    }

    function openModal() {
        previousActiveElement = document.activeElement;
        modal.hidden = false;

        const focusables = getFocusableElements();
        if (focusables.length > 0) {
            focusables[0].focus();
        }

        document.addEventListener('keydown', trapFocus);
    }

    function closeModal() {
        modal.hidden = true;
        document.removeEventListener('keydown', trapFocus);
        if (previousActiveElement && typeof previousActiveElement.focus === 'function') {
            previousActiveElement.focus();
        }
    }

    function trapFocus(e) {
        if (e.key === 'Escape') {
            closeModal();
            return;
        }

        if (e.key === 'Tab') {
            const focusables = Array.from(getFocusableElements());
            if (focusables.length === 0) return;

            const firstElement = focusables[0];
            const lastElement = focusables[focusables.length - 1];

            if (e.shiftKey) {
                // Shift + Tab
                if (document.activeElement === firstElement) {
                    e.preventDefault();
                    lastElement.focus();
                }
            } else {
                // Tab
                if (document.activeElement === lastElement) {
                    e.preventDefault();
                    firstElement.focus();
                }
            }
        }
    }

    openBtn.addEventListener('click', openModal);
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (dismissBtn) dismissBtn.addEventListener('click', closeModal);

    // Close on clicking backdrop outside container
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Copy URL Action
    if (copyBtn && copyInput) {
        copyBtn.addEventListener('click', async () => {
            try {
                if (navigator.clipboard && navigator.clipboard.writeText) {
                    await navigator.clipboard.writeText(copyInput.value);
                } else {
                    copyInput.select();
                    document.execCommand('copy');
                }
                if (copyStatus) {
                    copyStatus.textContent = '';
                    setTimeout(() => {
                        copyStatus.textContent = 'Article URL copied to clipboard.';
                    }, 50);
                }
                copyBtn.textContent = 'Copied!';
                setTimeout(() => {
                    copyBtn.innerHTML = '<span class="icon" aria-hidden="true">📋</span> Copy';
                }, 2000);
            } catch (err) {
                if (copyStatus) copyStatus.textContent = 'Failed to copy URL automatically. Please copy manually.';
            }
        });
    }
}

/* ==========================================================================
   6. Accessible Form Validation (WCAG 3.3.1, 3.3.2, 3.3.3)
   ========================================================================== */
function initNewsletterValidation() {
    const form = document.getElementById('newsletter-form');
    if (!form) return;

    const nameInput = document.getElementById('subscriber-name');
    const emailInput = document.getElementById('subscriber-email');
    const consentInput = document.getElementById('subscriber-consent');
    const feedback = document.getElementById('newsletter-feedback');

    const nameError = document.getElementById('name-error');
    const emailError = document.getElementById('email-error');
    const consentError = document.getElementById('consent-error');

    function validateField(input, errorElement, condition, errorMessage) {
        if (!condition) {
            input.setAttribute('aria-invalid', 'true');
            if (errorElement) {
                errorElement.textContent = errorMessage;
                errorElement.hidden = false;
            }
            return false;
        } else {
            input.setAttribute('aria-invalid', 'false');
            if (errorElement) {
                errorElement.textContent = '';
                errorElement.hidden = true;
            }
            return true;
        }
    }

    // Real-time blur validation
    if (nameInput) {
        nameInput.addEventListener('blur', () => {
            validateField(nameInput, nameError, nameInput.value.trim().length >= 2, 'Please enter your full name (minimum 2 characters).');
        });
    }

    if (emailInput) {
        emailInput.addEventListener('blur', () => {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            validateField(emailInput, emailError, emailRegex.test(emailInput.value.trim()), 'Please enter a valid work email address (e.g. name@company.com).');
        });
    }

    if (consentInput) {
        consentInput.addEventListener('change', () => {
            validateField(consentInput, consentError, consentInput.checked, 'You must accept the terms and privacy policy to subscribe.');
        });
    }

    // Form Submission
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const isNameValid = validateField(
            nameInput,
            nameError,
            nameInput && nameInput.value.trim().length >= 2,
            'Please enter your full name (minimum 2 characters).'
        );

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const isEmailValid = validateField(
            emailInput,
            emailError,
            emailInput && emailRegex.test(emailInput.value.trim()),
            'Please enter a valid work email address (e.g. name@company.com).'
        );

        const isConsentValid = validateField(
            consentInput,
            consentError,
            consentInput && consentInput.checked,
            'You must accept the terms and privacy policy to subscribe.'
        );

        const isValid = isNameValid && isEmailValid && isConsentValid;

        if (!isValid) {
            if (feedback) {
                feedback.className = 'form-feedback-alert error';
                feedback.textContent = 'Please correct the highlighted errors before submitting.';
                feedback.hidden = false;
            }
            // Move focus to first invalid element
            if (!isNameValid && nameInput) {
                nameInput.focus();
            } else if (!isEmailValid && emailInput) {
                emailInput.focus();
            } else if (!isConsentValid && consentInput) {
                consentInput.focus();
            }
        } else {
            if (feedback) {
                feedback.className = 'form-feedback-alert success';
                feedback.textContent = 'Thank you for subscribing! A confirmation briefing has been sent to your inbox.';
                feedback.hidden = false;
            }
            form.reset();
            // Reset validation states
            [nameInput, emailInput, consentInput].forEach(inp => {
                if (inp) inp.setAttribute('aria-invalid', 'false');
            });
            // Focus feedback message so screen reader user receives immediate confirmation
            feedback.setAttribute('tabindex', '-1');
            feedback.focus();
        }
    });
}
