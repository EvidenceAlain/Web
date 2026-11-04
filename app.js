/**
 * ENEKO HERNÁNDEZ - CARPINTERÍA & EBANISTERÍA
 * Lógica interactiva principal (app.js)
 */

document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       1. INYECCIÓN DE ESTILOS DINÁMICOS PARA ANIMACIONES JS Y VISOR (LIGHTBOX)
       ========================================================================== */
    const injectDynamicStyles = () => {
        const style = document.createElement('style');
        style.textContent = `
            /* Efecto de aparición al hacer scroll */
            .reveal-item {
                opacity: 0;
                transform: translateY(28px);
                transition: opacity 0.65s ease, transform 0.65s cubic-bezier(0.25, 0.8, 0.25, 1);
            }
            .reveal-item.revealed {
                opacity: 1;
                transform: translateY(0);
            }

            /* Transición del panel de maderas */
            #wood-display {
                transition: opacity 0.25s ease, transform 0.25s ease;
            }
            #wood-display.switching {
                opacity: 0;
                transform: translateY(8px);
            }

            /* Transición de filtrado de proyectos */
            .portfolio-item {
                transition: opacity 0.35s ease, transform 0.35s ease;
            }
            .portfolio-item.hidden-item {
                opacity: 0;
                transform: scale(0.92);
                pointer-events: none;
                position: absolute;
                visibility: hidden;
            }

            /* Header compacto al hacer scroll */
            .header.scrolled {
                background: rgba(18, 14, 11, 0.96);
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.35);
            }

            /* Animación del botón hamburguesa */
            #mobile-menu-btn.active .hamburger-line:nth-child(1) {
                transform: translateY(7px) rotate(45deg);
            }
            #mobile-menu-btn.active .hamburger-line:nth-child(2) {
                opacity: 0;
            }
            #mobile-menu-btn.active .hamburger-line:nth-child(3) {
                transform: translateY(-7px) rotate(-45deg);
            }

            /* Modal / Lightbox para ver proyectos en grande */
            .lightbox-modal {
                position: fixed;
                inset: 0;
                z-index: 2000;
                background: rgba(18, 14, 11, 0.92);
                backdrop-filter: blur(10px);
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 1.5rem;
                opacity: 0;
                pointer-events: none;
                transition: opacity 0.3s ease;
            }
            .lightbox-modal.open {
                opacity: 1;
                pointer-events: auto;
            }
            .lightbox-card {
                background: #221D19;
                color: #F5F2EB;
                max-width: 780px;
                width: 100%;
                border-radius: 14px;
                overflow: hidden;
                border: 1px solid rgba(255,255,255,0.12);
                box-shadow: 0 25px 50px rgba(0,0,0,0.5);
                transform: translateY(20px);
                transition: transform 0.3s ease;
            }
            .lightbox-modal.open .lightbox-card {
                transform: translateY(0);
            }
            .lightbox-img {
                height: 360px;
                background-size: cover;
                background-position: center;
            }
            .lightbox-body {
                padding: 2rem;
            }
            .lightbox-body h3 {
                font-family: var(--font-heading);
                font-size: 2rem;
                color: var(--accent-oak);
                margin-bottom: 0.4rem;
            }
            .lightbox-body p {
                color: #B8AFA6;
                margin-bottom: 1.5rem;
            }
            .lightbox-close {
                display: inline-block;
                padding: 0.7rem 1.4rem;
                background: var(--accent-oak);
                color: #fff;
                border-radius: 6px;
                font-weight: 600;
                cursor: pointer;
            }
        `;
        document.head.appendChild(style);
    };
    injectDynamicStyles();


    /* ==========================================================================
       2. MENÚ MÓVIL Y EFECTO SCROLL EN CABECERA
       ========================================================================== */
    const header = document.getElementById('main-header');
    const mobileBtn = document.getElementById('mobile-menu-btn');
    const mainNav = document.getElementById('main-nav');
    const navLinks = document.querySelectorAll('.nav-link');

    // Cambiar estilo del header al bajar
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Abrir / cerrar menú en móvil
    if (mobileBtn && mainNav) {
        mobileBtn.addEventListener('click', () => {
            const isOpen = mainNav.classList.toggle('open');
            mobileBtn.classList.toggle('active', isOpen);
            mobileBtn.setAttribute('aria-expanded', isOpen);
        });

        // Cerrar menú al pulsar cualquier enlace
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                mainNav.classList.remove('open');
                mobileBtn.classList.remove('active');
                mobileBtn.setAttribute('aria-expanded', 'false');
            });
        });
    }


    /* ==========================================================================
       3. CONTADORES ANIMADOS EN PORTADA (HERO STATS)
       ========================================================================== */
    const statNumbers = document.querySelectorAll('.stat-number');

    const animateCounter = (el) => {
        const target = parseInt(el.getAttribute('data-target'), 10);
        const isPercentage = el.textContent.includes('%');
        const hasPlus = el.textContent.includes('+');
        const duration = 1800; // ms
        const startTime = performance.now();

        const updateCount = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Función de suavizado (easeOutQuart)
            const eased = 1 - Math.pow(1 - progress, 4);
            const currentVal = Math.floor(eased * target);

            el.textContent = `${hasPlus ? '+' : ''}${currentVal}${isPercentage ? '%' : ''}`;

            if (progress < 1) {
                requestAnimationFrame(updateCount);
            } else {
                el.textContent = `${hasPlus ? '+' : ''}${target}${isPercentage ? '%' : ''}`;
            }
        };

        requestAnimationFrame(updateCount);
    };

    const statsObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(stat => statsObserver.observe(stat));


    /* ==========================================================================
       4. SELECTOR INTERACTIVO DE MADERAS NOBLES
       ========================================================================== */
    const woodData = {
        roble: {
            name: 'Roble Europeo',
            desc: 'Dureza excepcional y veta marcada. Ideal para mesas principales, suelos, escaleras y muebles que buscan carácter y máxima durabilidad frente al uso diario.',
            hardness: 'Muy alta (Semipesada - Dura)',
            tone: 'Dorado medio a tostado cálido',
            use: 'Mesas macizas, suelos, puertas de paso y peldaños'
        },
        nogal: {
            name: 'Nogal Americano',
            desc: 'La joya de la ebanistería fina. Su color chocolate profundo con vetas suaves aporta una elegancia inigualable y un tacto sedoso tras el barnizado o aceitado.',
            hardness: 'Alta (Estable y compacta)',
            tone: 'Marrón oscuro a púrpura suave',
            use: 'Mobiliario de autor, cabeceros, vestidores y despachos'
        },
        castano: {
            name: 'Castaño Tradicional',
            desc: 'Madera noble con gran resistencia natural a la humedad y a los cambios de temperatura. Muy apreciada en carpintería tradicional y estructuras vistas.',
            hardness: 'Media - Alta (Gran elasticidad)',
            tone: 'Marrón claro dorado con veta viva',
            use: 'Vigas, porches exteriores, puertas rústicas y frisos'
        },
        haya: {
            name: 'Haya Vaporizada',
            desc: 'Textura uniforme, limpia y luminosa. El proceso de vaporizado le otorga un tono cálido muy acogedor y una excelente trabajabilidad para interiores modernos.',
            hardness: 'Alta (Muy resistente al desgaste)',
            tone: 'Crema rosado / Arena suave',
            use: 'Armarios a medida, estanterías, cocinas e interiores'
        }
    };

    const woodTabs = document.querySelectorAll('.wood-tab');
    const woodDisplay = document.getElementById('wood-display');
    const woodName = document.getElementById('wood-name');
    const woodDesc = document.getElementById('wood-desc');
    const woodSpecs = document.querySelector('.wood-specs');

    woodTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const key = tab.getAttribute('data-wood');
            const selected = woodData[key];
            if (!selected) return;

            // Actualizar estado activo de las pestañas
            woodTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            // Transición suave del panel
            woodDisplay.classList.add('switching');

            setTimeout(() => {
                woodName.textContent = selected.name;
                woodDesc.textContent = selected.desc;
                woodSpecs.innerHTML = `
                    <li><strong>Dureza:</strong> ${selected.hardness}</li>
                    <li><strong>Tono:</strong> ${selected.tone}</li>
                    <li><strong>Uso ideal:</strong> ${selected.use}</li>
                `;
                woodDisplay.classList.remove('switching');
            }, 220);
        });
    });


    /* ==========================================================================
       5. FILTRO DE GALERÍA DE PROYECTOS Y VISOR AMPLIADO (LIGHTBOX)
       ========================================================================== */
    const filterBtns = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.getAttribute('data-filter');

            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            portfolioItems.forEach(item => {
                const category = item.getAttribute('data-category');
                if (filter === 'todos' || category === filter) {
                    item.classList.remove('hidden-item');
                } else {
                    item.classList.add('hidden-item');
                }
            });
        });
    });

    // Crear visor modal (Lightbox) para ver detalles al hacer clic en un proyecto
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox-modal';
    lightbox.innerHTML = `
        <div class="lightbox-card">
            <div class="lightbox-img" id="lb-img"></div>
            <div class="lightbox-body">
                <h3 id="lb-title"></h3>
                <p id="lb-desc"></p>
                <button class="lightbox-close" id="lb-close">Cerrar vista</button>
            </div>
        </div>
    `;
    document.body.appendChild(lightbox);

    const lbImg = document.getElementById('lb-img');
    const lbTitle = document.getElementById('lb-title');
    const lbDesc = document.getElementById('lb-desc');
    const lbClose = document.getElementById('lb-close');

    portfolioItems.forEach(item => {
        item.addEventListener('click', () => {
            const imgEl = item.querySelector('.portfolio-img-placeholder');
            const bgImage = window.getComputedStyle(imgEl).backgroundImage;
            const title = item.querySelector('h3').textContent;
            const subtitle = item.querySelector('p').textContent;

            lbImg.style.backgroundImage = bgImage;
            lbTitle.textContent = title;
            lbDesc.textContent = `${subtitle} · Trabajo realizado a medida en el taller de Eneko Hernández con ajuste e instalación en domicilio.`;
            lightbox.classList.add('open');
        });
    });

    const closeLightbox = () => lightbox.classList.remove('open');
    lbClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });


    /* ==========================================================================
       6. ANIMACIÓN DE APARICIÓN AL HACER SCROLL (SCROLL REVEAL)
       ========================================================================== */
    const revealElements = document.querySelectorAll(
        '.service-card, .portfolio-item, .step-item, .wood-interactive-wrapper, .contact-info, .contact-form'
    );

    revealElements.forEach((el, index) => {
        el.classList.add('reveal-item');
        el.style.transitionDelay = `${(index % 4) * 80}ms`;
    });

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });

    revealElements.forEach(el => revealObserver.observe(el));


    /* ==========================================================================
       7. GESTIÓN DEL FORMULARIO DE PRESUPUESTO
       ========================================================================== */
    const budgetForm = document.getElementById('budget-form');
    const feedback = document.getElementById('form-feedback');

    if (budgetForm) {
        budgetForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const nombre = document.getElementById('nombre').value.trim();
            const telefono = document.getElementById('telefono').value.trim();
            const tipoSelect = document.getElementById('tipo-proyecto');
            const tipoTexto = tipoSelect.options[tipoSelect.selectedIndex]?.text || 'Proyecto a medida';
            const submitBtn = budgetForm.querySelector('button[type="submit"]');

            // Simulación de envío
            submitBtn.disabled = true;
            submitBtn.textContent = 'Enviando solicitud al taller...';
            feedback.style.color = '#665E57';
            feedback.textContent = 'Procesando los datos de tu proyecto...';

            setTimeout(() => {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Solicitud enviada correctamente';
                feedback.style.color = '#2E7D32';
                feedback.textContent = `¡Gracias, ${nombre}! Eneko ha recibido tu consulta sobre "${tipoTexto}" y te llamará al ${telefono} muy pronto.`;
                budgetForm.reset();

                setTimeout(() => {
                    submitBtn.textContent = 'Enviar solicitud a Eneko';
                }, 4000);
            }, 1200);
        });
    }


    /* ==========================================================================
       8. AÑO AUTOMÁTICO EN EL FOOTER
       ========================================================================== */
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
});