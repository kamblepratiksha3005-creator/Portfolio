// Main Portfolio JS Logic - Professional & Clean tech style
import { 
    supabase,
    isConfigured
} from "./supabase-config.js";

// Local Storage Datastore key
const DB_KEY = "pratiksha_portfolio_db";

// Fallback/Demo Mock Datastore (Same defaults as admin.js for synchronization)
const defaultLocalDatastore = {
    profile: {
        name: "Pratiksha Kamble",
        designations: "Embedded Systems Engineer, Firmware Developer, IoT Specialist",
        tagline: "Designing robust hardware architectures, developing low-level real-time firmware, and building secure IoT edge integrations.",
        bio: "I am an Embedded Systems Engineer with a deep passion for designing circuits, developing real-time firmware, and building IoT solutions. With hands-on experience in microcontroller architectures (STM32, ESP32, AVR), hardware description languages, and PCB layout tools, I bridge the gap between software and hardware to create production-grade physical systems.",
        bio_2: "My design philosophy centers on power optimization, deterministic execution, and signal integrity. When I'm not routing differential pairs or debugging SPI packets with a logic analyzer, I participate in hardware hackathons and research novel firmware execution algorithms.",
        email: "pratikshakamble.embed@gmail.com",
        phone: "+91 98765 43210",
        location: "Pune, India",
        voltage: "3.3V / 5.0V",
        mcu: "ARM Cortex-M & ESP32",
        github: "https://github.com",
        linkedin: "https://linkedin.com",
        profile_photo: "https://images.unsplash.com/photo-1573164713988-8665fc963095?w=500&auto=format&fit=crop&q=60",
        resume_url: "#"
    },
    skills: [
        { id: "s1", name: "STM32 & ARM Cortex", category: "Microcontrollers", proficiency: 90, order: 0 },
        { id: "s2", name: "ESP32 / ESP-IDF", category: "Microcontrollers", proficiency: 85, order: 1 },
        { id: "s3", name: "Embedded C / C++", category: "Firmware & Tools", proficiency: 95, order: 2 },
        { id: "s4", name: "FreeRTOS", category: "Firmware & Tools", proficiency: 80, order: 3 },
        { id: "s5", name: "SPI, I2C, UART, CAN", category: "Protocols", proficiency: 92, order: 4 },
        { id: "s6", name: "MQTT & CoAP IoT", category: "Protocols", proficiency: 85, order: 5 },
        { id: "s7", name: "Altium / KiCad CAD", category: "Hardware & PCBs", proficiency: 88, order: 6 },
        { id: "s8", name: "Oscilloscope / Logic Analyzer", category: "Hardware & PCBs", proficiency: 80, order: 7 }
    ],
    projects: [
        {
            id: "p1",
            title: "Autonomous Agricultural Drone",
            category: "robotics",
            description: "An ESP32-powered quadcopter equipped with multispectral sensors to analyze crop health in real-time. Features custom flight stability algorithms and telemetry over ESP-NOW.",
            hardware: "ESP32, MPU6050, RF modules, Telemetry antenna",
            github_link: "https://github.com",
            video_url: "",
            circuit_diagram_url: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600",
            images: [
                "https://images.unsplash.com/photo-1527977966376-1c8408f9f108?w=800",
                "https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=800"
            ],
            date: "Dec 2025",
            order: 0
        },
        {
            id: "p2",
            title: "Solar IoT Weather Transceiver",
            category: "iot",
            description: "Ultra-low-power STM32-based telemetry node collecting barometric pressure, relative humidity, and temperature, transmitting data over 15km via LoRaWAN.",
            hardware: "STM32L031, SX1276 LoRa, BME280 sensor, Solar harvester PMIC",
            github_link: "https://github.com",
            video_url: "",
            circuit_diagram_url: "",
            images: [
                "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800",
                "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800"
            ],
            date: "Oct 2025",
            order: 1
        }
    ],
    hardware: [
        { id: "h1", title: "Embedded Control Board", image_url: "https://images.unsplash.com/photo-1563770660941-20978e870e26?w=600", images: [], video_url: "", order: 0 },
        { id: "h2", title: "Autonomous Prototype Platform", image_url: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=600", images: [], video_url: "", order: 1 }
    ],
    timeline: [
        { id: "t1", title: "Smart India Hackathon Hardware Winner", issuer: "Govt of India", date: "Dec 2023", desc: "Built mine safety system.", type: "hackathon", order: 0, images: [], video_url: "" },
        { id: "t2", title: "Bachelor of Engineering (ENTC)", issuer: "Pune University", date: "2020 - 2024", desc: "Graduated with Honors.", type: "education", order: 1, images: [], video_url: "" }
    ],
    certs: [
        { id: "c1", name: "Altium Designer Professional Certification", issuer: "Altium Corp", date: "May 2024", verification_link: "#", order: 0, pdf_url: "" },
        { id: "c2", name: "Real-Time Embedded Systems with FreeRTOS", issuer: "Udemy Academy", date: "Jul 2023", verification_link: "#", order: 1, pdf_url: "" }
    ]
};

// Helper: Read datastore from Local Storage
function getLocalData() {
    const raw = localStorage.getItem(DB_KEY);
    if (!raw) {
        localStorage.setItem(DB_KEY, JSON.stringify(defaultLocalDatastore));
        return defaultLocalDatastore;
    }
    return JSON.parse(raw);
}

// --- Global Application State ---
let activeModalMedia = [];
let currentCarouselIndex = 0;

// --- DOM Elements ---
document.addEventListener("DOMContentLoaded", async () => {
    // Theme setup
    initTheme();
    
    // Mobile navigation
    initNav();
    
    // Admin Session check
    await initAdminState();
    
    // Load Content
    await loadPortfolioData();
    
    // Modals Close Listener
    document.getElementById("modal-close").addEventListener("click", closeModal);
    document.getElementById("detail-modal").addEventListener("click", (e) => {
        if (e.target === document.getElementById("detail-modal")) closeModal();
    });
    
    // Carousel Nav
    document.getElementById("carousel-prev").addEventListener("click", () => navigateCarousel(-1));
    document.getElementById("carousel-next").addEventListener("click", () => navigateCarousel(1));
    
    // Contact Form
    document.getElementById("contact-form").addEventListener("submit", handleContactSubmit);
    
    // Window scrollspy
    window.addEventListener("scroll", scrollSpy);

    // Refresh portfolio content when the page regains focus or other tab updates shared data
    window.addEventListener("focus", () => loadPortfolioData());
    window.addEventListener("storage", (event) => {
        if (event.key === DB_KEY) {
            loadPortfolioData();
        }
    });
});

// --- Admin Session state manager ---
async function initAdminState() {
    // Admin console is completely decoupled and accessed directly via admin.html
}

// --- Theme Manager ---
function initTheme() {
    const savedTheme = localStorage.getItem("portfolio-theme") || "dark";
    document.documentElement.setAttribute("data-theme", savedTheme);
    
    const themeBtn = document.getElementById("theme-toggle");
    const sunIcon = document.getElementById("theme-icon-sun");
    const moonIcon = document.getElementById("theme-icon-moon");
    
    if (savedTheme === "light") {
        sunIcon.style.display = "block";
        moonIcon.style.display = "none";
    } else {
        sunIcon.style.display = "none";
        moonIcon.style.display = "block";
    }
    
    themeBtn.addEventListener("click", () => {
        const currentTheme = document.documentElement.getAttribute("data-theme");
        const newTheme = currentTheme === "dark" ? "light" : "dark";
        
        document.documentElement.setAttribute("data-theme", newTheme);
        localStorage.setItem("portfolio-theme", newTheme);
        
        if (newTheme === "light") {
            sunIcon.style.display = "block";
            moonIcon.style.display = "none";
        } else {
            sunIcon.style.display = "none";
            moonIcon.style.display = "block";
        }
    });
}

// --- Nav Menu (Hamburger) ---
function initNav() {
    const hamburger = document.getElementById("hamburger-menu");
    const navMenu = document.getElementById("nav-menu");
    const navLinks = document.querySelectorAll(".nav-link");
    
    hamburger.addEventListener("click", () => {
        hamburger.classList.toggle("active");
        navMenu.classList.toggle("active");
    });
    
    navLinks.forEach(link => {
        link.addEventListener("click", () => {
            hamburger.classList.remove("active");
            navMenu.classList.remove("active");
        });
    });
}

function setLoadingState(isLoading) {
    const loadingScreen = document.getElementById("loading-screen");
    if (loadingScreen) loadingScreen.classList.toggle("is-hidden", !isLoading);
}

// --- Load Portfolio Content ---
async function loadPortfolioData() {
    setLoadingState(true);
    try {
        await updatePortfolioData();
    } finally {
        setLoadingState(false);
    }
}

async function updatePortfolioData() {
    let localDb = getLocalData();
    let profileData = isConfigured ? {} : localDb.profile;
    let skillsData = isConfigured ? [] : localDb.skills;
    let projectsData = isConfigured ? [] : localDb.projects;
    let galleryData = isConfigured ? [] : localDb.hardware;
    let timelineData = isConfigured ? [] : localDb.timeline;
    let certsData = isConfigured ? [] : localDb.certs;
    
    if (isConfigured) {
        try {
            // 1. Fetch Profile info from Supabase
            const { data: prof, error: profErr } = await supabase
                .from("portfolio_info")
                .select("*")
                .limit(1)
                .single();
            if (!profErr && prof) profileData = prof;
            
            // 2. Fetch Skills
            const { data: skills, error: skillsErr } = await supabase
                .from("skills")
                .select("*")
                .order("order_index", { ascending: true });
            if (!skillsErr && skills) skillsData = skills;
            
            // 3. Fetch Projects
            const { data: projects, error: projErr } = await supabase
                .from("projects")
                .select("*")
                .order("order_index", { ascending: true });
            if (!projErr && projects) projectsData = projects;
            
            // 4. Fetch Hardware
            const { data: hardware, error: hardErr } = await supabase
                .from("hardware_gallery")
                .select("*")
                .order("order_index", { ascending: true });
            if (!hardErr && hardware) galleryData = hardware;
            
            // 5. Fetch Timeline (educations, achievements, hackathons)
            const { data: timeline, error: timeErr } = await supabase
                .from("timeline")
                .select("*")
                .order("order_index", { ascending: true });
            if (!timeErr && timeline) timelineData = timeline;
            
            // 6. Fetch Certs
            const { data: certs, error: certErr } = await supabase
                .from("certifications")
                .select("*")
                .order("order_index", { ascending: true });
            if (!certErr && certs) certsData = certs;
            
        } catch (e) {
            console.error("Supabase data fetching failed, loading local/cached assets.", e);
        }
    }
    
    // Bind Profile Information
    document.getElementById("hero-name").textContent = profileData.name || "";
    document.getElementById("hero-tagline").textContent = profileData.tagline || "";
    document.getElementById("hero-location").textContent = profileData.location || "";
    document.getElementById("hero-voltage").textContent = profileData.specialization || profileData.voltage || "";
    document.getElementById("hero-mcu").textContent = profileData.primary_cores || profileData.mcu || "";
    const profilePhoto = document.getElementById("profile-photo");
    if (profileData.profile_photo) profilePhoto.src = profileData.profile_photo;
    else profilePhoto.removeAttribute("src");
    
    document.getElementById("github-link").href = profileData.github || "#";
    document.getElementById("linkedin-link").href = profileData.linkedin || "#";
    document.getElementById("email-link").href = `mailto:${profileData.email}`;
    document.getElementById("download-resume-btn").href = profileData.resume_url || "#";
    
    document.getElementById("about-bio-1").textContent = profileData.bio || "";
    document.getElementById("about-bio-2").textContent = profileData.bio_2 || "";
    
    document.getElementById("contact-email").textContent = profileData.email;
    if (document.getElementById("contact-phone")) {
        document.getElementById("contact-phone").textContent = profileData.phone || "";
    }
    document.getElementById("contact-location").textContent = profileData.location;

    // Render components
    renderSkills(skillsData);
    renderProjects(projectsData);
    renderGallery(galleryData);
    renderEducation(timelineData);
    renderTimeline(timelineData);
    renderCertifications(certsData);
    
    // Auto-update Lucide icons after rendering new elements
    lucide.createIcons();
}

// --- Rendering Sub-functions ---
function renderSkills(skills) {
    const container = document.getElementById("skills-container");
    container.innerHTML = "";
    
    const categories = {};
    skills.forEach(skill => {
        if (!categories[skill.category]) {
            categories[skill.category] = [];
        }
        categories[skill.category].push(skill);
    });
    
    for (const [catName, catSkills] of Object.entries(categories)) {
        const catCard = document.createElement("div");
        catCard.className = "glass-card";
        
        let headerIcon = "cpu";
        if (catName.toLowerCase().includes("protocol")) headerIcon = "terminal";
        else if (catName.toLowerCase().includes("firmware")) headerIcon = "binary";
        else if (catName.toLowerCase().includes("pcb")) headerIcon = "layers";
        
        let skillItemsHTML = "";
        catSkills.forEach(skill => {
            skillItemsHTML += `
                <div class="skill-item">
                    <div class="skill-info">
                        <span class="skill-name">${skill.name}</span>
                        <span class="skill-percentage">${skill.proficiency}%</span>
                    </div>
                    <div class="skill-bar-outer">
                        <div class="skill-bar-inner" data-width="${skill.proficiency}%"></div>
                    </div>
                </div>
            `;
        });
        
        catCard.innerHTML = `
            <h3 class="skill-category-title">
                <i data-lucide="${headerIcon}"></i>
                <span>${catName}</span>
            </h3>
            ${skillItemsHTML}
        `;
        container.appendChild(catCard);
    }
    
    setTimeout(() => {
        document.querySelectorAll(".skill-bar-inner").forEach(bar => {
            bar.style.width = bar.getAttribute("data-width");
        });
    }, 100);
}

function renderProjects(projects) {
    const container = document.getElementById("projects-container");
    container.innerHTML = "";
    
    projects.forEach(project => {
        const card = document.createElement("div");
        card.className = "glass-card project-card";
        card.setAttribute("data-category", project.category);
        
        const thumbnail = project.images && project.images.length > 0 ? project.images[0] : "https://images.unsplash.com/photo-1518770660439-4636190af475?w=600";
        
        let chipsHTML = "";
        if (project.hardware) {
            project.hardware.split(",").forEach(item => {
                chipsHTML += `<span class="chip-tag">${item.trim()}</span>`;
            });
        }
        
        const codeLink = project.github_link ? `
            <a href="${project.github_link}" target="_blank" class="project-link">
                <i data-lucide="github"></i> Code
            </a>` : '';
            
        const previewLink = project.video_url ? `
            <a href="${project.video_url}" target="_blank" class="project-link">
                <i data-lucide="play-circle"></i> Demo
            </a>` : '';
            
        const schematicLink = project.circuit_diagram_url ? `
            <a href="${project.circuit_diagram_url}" target="_blank" class="project-link">
                <i data-lucide="file-text"></i> Schematic
            </a>` : '';

        card.innerHTML = `
            <div class="project-media">
                <img src="${thumbnail}" alt="${project.title}" class="project-thumbnail">
                <div class="project-badge">${project.category.toUpperCase()}</div>
            </div>
            <div class="project-content">
                <h3 class="project-title">${project.title}</h3>
                <p class="project-desc">${project.description}</p>
                <div class="hardware-chips">
                    ${chipsHTML}
                </div>
                <div class="project-actions">
                    <div class="project-link-group">
                        ${codeLink}
                        ${previewLink}
                        ${schematicLink}
                    </div>
                    <button class="project-details-btn" data-id="${project.id}">VIEW DETAILS &rarr;</button>
                </div>
            </div>
        `;
        
        container.appendChild(card);
    });
    
    document.querySelectorAll(".project-details-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const pId = e.target.getAttribute("data-id");
            const proj = projects.find(item => item.id === pId);
            if (proj) openProjectModal(proj);
        });
    });
    
    setupFilters();
}

function setupFilters() {
    const filters = document.querySelectorAll(".filter-btn");
    const cards = document.querySelectorAll(".project-card");
    
    filters.forEach(filter => {
        filter.addEventListener("click", () => {
            filters.forEach(btn => btn.classList.remove("active"));
            filter.classList.add("active");
            
            const category = filter.getAttribute("data-filter");
            
            cards.forEach(card => {
                const cardCat = card.getAttribute("data-category");
                if (category === "all" || cardCat === category) {
                    card.style.display = "flex";
                } else {
                    card.style.display = "none";
                }
            });
        });
    });
}

function renderGallery(items) {
    const container = document.getElementById("gallery-container");
    if (!container) {
        console.warn("Gallery container not found. Skipping hardware gallery rendering.");
        return;
    }
    container.innerHTML = "";
    
    if (!items || items.length === 0) {
        container.innerHTML = `<div class="glass-card"><p style="color: var(--text-secondary);">No hardware gallery items available.</p></div>`;
        return;
    }
    
    items.forEach(item => {
        const box = document.createElement("div");
        box.className = "gallery-item";
        
        const hasVideo = !!item.video_url;
        const thumb = item.image_url || (item.images && item.images[0]) || "";
        
        box.innerHTML = hasVideo && !thumb ? `
            <video src="${item.video_url}" muted></video>
            <div class="gallery-overlay"><i data-lucide="play-circle"></i></div>
            <div class="gallery-title">${item.title || "Hardware Prototype"}</div>
        ` : `
            <img src="${thumb}" alt="Hardware prototype media">
            ${hasVideo ? `<div class="gallery-overlay"><i data-lucide="play-circle"></i></div>` : ""}
            <div class="gallery-title">${item.title || "Hardware Prototype"}</div>
        `;
        
        box.addEventListener("click", () => {
            openHardwareDetailsModal(item);
        });
        
        container.appendChild(box);
    });
}

function renderTimeline(events) {
    const container = document.getElementById("timeline-container");
    container.innerHTML = "";
    
    events
        .filter(item => {
            const typeValue = (item.type || item.category || "").toString().trim().toLowerCase();
            return typeValue !== "education";
        })
        .forEach(item => {
            const timelineItem = document.createElement("div");
            timelineItem.className = "timeline-item";
            
            // Show VIEW DETAILS button if event contains images or video
            const hasMedia = (item.images && item.images.length > 0) || item.video_url;
            const detailsBtn = hasMedia ? `<button class="timeline-details-btn" data-id="${item.id}">VIEW DETAILS &rarr;</button>` : "";
            
            timelineItem.innerHTML = `
                <div class="timeline-node"></div>
                <div class="timeline-content">
                    <div class="timeline-date">${item.date}</div>
                    <h4 class="timeline-title">${item.title}</h4>
                    <div class="timeline-issuer">${item.issuer || item.organization || item.role || ''}</div>
                    <p class="timeline-desc">${item.desc || item.description || ''}</p>
                    ${detailsBtn}
                </div>
            `;
            container.appendChild(timelineItem);
        });

    // Bind event detail buttons
    document.querySelectorAll(".timeline-details-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const tId = e.target.getAttribute("data-id");
            const eventItem = events.find(item => item.id === tId);
            if (eventItem) openTimelineDetailsModal(eventItem);
        });
    });
}

function renderEducation(events) {
    const container = document.getElementById("education-container");
    container.innerHTML = "";
    const educationEvents = events.filter(item => {
        const typeValue = (item.type || item.category || "").toString().trim().toLowerCase();
        return typeValue === "education";
    });
    
    if (educationEvents.length === 0) {
        container.innerHTML = `<div class="glass-card"><p style="color: var(--text-secondary);">No education records are available at this time.</p></div>`;
        return;
    }
    
    // Sort sequence: btech -> hsc -> ssc
    educationEvents.sort((a, b) => {
        const getRank = (title) => {
            const t = (title || "").toLowerCase();
            if (t.includes("btech") || t.includes("b.tech") || t.includes("bachelor") || t.includes("b.e") || t.includes("engineering")) return 1;
            if (t.includes("hsc") || t.includes("12th") || t.includes("h.s.c") || t.includes("intermediate") || t.includes("xii")) return 2;
            if (t.includes("ssc") || t.includes("10th") || t.includes("s.s.c") || t.includes("matric") || t.includes("x")) return 3;
            return 4;
        };
        const rankA = getRank(a.title);
        const rankB = getRank(b.title);
        if (rankA !== rankB) return rankA - rankB;
        return (a.order_index || a.order || 0) - (b.order_index || b.order || 0);
    });
    
    educationEvents.forEach(item => {
        const card = document.createElement("div");
        card.className = "education-card";
        card.innerHTML = `
            <div>
                <h4>${item.title}</h4>
                <div class="education-institution">${item.issuer || item.organization || ''}</div>
            </div>
            <div class="education-date">${item.date}</div>
            <p class="education-desc">${item.desc || item.description || ''}</p>
        `;
        container.appendChild(card);
    });
}

function renderCertifications(certs) {
    const container = document.getElementById("certs-container");
    container.innerHTML = "";
    
    certs.forEach(cert => {
        const card = document.createElement("div");
        card.className = "glass-card cert-card";
        
        const verification = cert.verification_link ? `
            <a href="${cert.verification_link}" target="_blank" class="project-link" style="color: var(--accent-cyan);">
                <i data-lucide="external-link"></i> Verify
            </a>` : '';
            
        const pdfLink = cert.pdf_url ? `
            <a href="${cert.pdf_url}" target="_blank" class="project-link">
                <i data-lucide="file-text"></i> PDF Copy
            </a>` : '';

        card.innerHTML = `
            <div class="cert-header">
                <div class="cert-icon"><i data-lucide="award"></i></div>
                <div>
                    <h4 class="cert-title">${cert.name}</h4>
                    <span class="cert-issuer">${cert.issuer}</span>
                </div>
            </div>
            <div class="cert-date">Issued: ${cert.date}</div>
            <div class="cert-actions">
                ${verification}
                ${pdfLink}
            </div>
        `;
        container.appendChild(card);
    });
}

// --- Scrollspy Navigation ---
function scrollSpy() {
    const sections = document.querySelectorAll("section[id]");
    const scrollY = window.pageYOffset;
    
    sections.forEach(current => {
        const sectionHeight = current.offsetHeight;
        const sectionTop = current.offsetTop - 100;
        const sectionId = current.getAttribute("id");
        const navLink = document.querySelector(`.nav-menu a[href*=${sectionId}]`);
        
        if (navLink) {
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                document.querySelectorAll(".nav-link").forEach(el => el.classList.remove("active"));
                navLink.classList.add("active");
            }
        }
    });
    
    const header = document.querySelector("header");
    if (scrollY > 50) {
        header.style.boxShadow = "0 2px 10px rgba(0, 0, 0, 0.15)";
    } else {
        header.style.boxShadow = "none";
    }
}

// --- Detail Modals & Lightbox Carousels ---
function openProjectModal(project) {
    const modal = document.getElementById("detail-modal");
    const projTitleEl = document.getElementById("modal-title");
    projTitleEl.textContent = project.title;
    projTitleEl.style.display = "";
    
    // Restore description and meta grid
    document.getElementById("modal-description").style.display = "block";
    const metaGrid = document.querySelector(".modal-meta-grid");
    if (metaGrid) metaGrid.style.display = "grid";
    
    document.getElementById("modal-description").textContent = project.description;
    
    // Explicitly set metadata labels for Project items
    document.getElementById("modal-meta-label").textContent = "Hardware & Core Components";
    document.getElementById("modal-hardware").textContent = project.hardware || "N/A";
    document.getElementById("modal-date").textContent = project.date || "N/A";
    
    activeModalMedia = [];
    if (project.images && project.images.length > 0) {
        project.images.forEach(img => activeModalMedia.push({ type: "image", url: img }));
    }
    if (project.video_url) {
        activeModalMedia.push({ type: "video", url: project.video_url });
    }
    if (project.circuit_diagram_url) {
        activeModalMedia.push({ type: "image", url: project.circuit_diagram_url });
    }
    
    buildCarousel();
    
    const linkContainer = document.getElementById("modal-links");
    linkContainer.innerHTML = "";
    
    if (project.github_link) {
        linkContainer.innerHTML += `
            <a href="${project.github_link}" target="_blank" class="btn btn-secondary" style="gap: 5px; font-size: 0.8rem;">
                <i data-lucide="github" style="width:14px;"></i> View Repository
            </a>
        `;
    }
    if (project.video_url) {
        linkContainer.innerHTML += `
            <a href="${project.video_url}" target="_blank" class="btn btn-primary" style="gap: 5px; font-size: 0.8rem;">
                <i data-lucide="play" style="width: 14px;"></i> Video Demo
            </a>
        `;
    }
    
    modal.classList.add("active");
    lucide.createIcons();
}

function openTimelineDetailsModal(item) {
    const modal = document.getElementById("detail-modal");
    const timeTitleEl = document.getElementById("modal-title");
    timeTitleEl.textContent = item.title;
    timeTitleEl.style.display = "";
    
    // Restore description and meta grid
    document.getElementById("modal-description").style.display = "block";
    const metaGrid = document.querySelector(".modal-meta-grid");
    if (metaGrid) metaGrid.style.display = "grid";
    
    document.getElementById("modal-description").textContent = item.description || item.desc || "";
    
    // Set metadata label dynamically for timeline items
    document.getElementById("modal-meta-label").textContent = "Organization / Issuer / Role";
    document.getElementById("modal-hardware").textContent = item.issuer || item.organization || item.role || "N/A";
    document.getElementById("modal-date").textContent = item.date || "N/A";
    
    activeModalMedia = [];
    if (item.images && item.images.length > 0) {
        item.images.forEach(img => activeModalMedia.push({ type: "image", url: img }));
    }
    if (item.video_url) {
        activeModalMedia.push({ type: "video", url: item.video_url });
    }
    
    buildCarousel();
    
    const linkContainer = document.getElementById("modal-links");
    linkContainer.innerHTML = "";
    
    if (item.video_url) {
        linkContainer.innerHTML += `
            <a href="${item.video_url}" target="_blank" class="btn btn-primary" style="gap: 5px; font-size: 0.8rem;">
                <i data-lucide="play" style="width: 14px;"></i> Video Demo
            </a>
        `;
    }
    
    modal.classList.add("active");
    lucide.createIcons();
}

function openHardwareDetailsModal(item) {
    const modal = document.getElementById("detail-modal");
    
    // Pure media wall: hide title, description and metadata grid for hardware items
    const titleEl = document.getElementById("modal-title");
    if (titleEl) titleEl.style.display = "none";
    document.getElementById("modal-description").style.display = "none";
    const metaGrid = document.querySelector(".modal-meta-grid");
    if (metaGrid) metaGrid.style.display = "none";
    
    activeModalMedia = [];
    if (item.images && item.images.length > 0) {
        item.images.forEach(img => activeModalMedia.push({ type: "image", url: img }));
    } else if (item.image_url) {
        activeModalMedia.push({ type: "image", url: item.image_url });
    }
    if (item.video_url) {
        activeModalMedia.push({ type: "video", url: item.video_url });
    }
    
    buildCarousel();
    
    const linkContainer = document.getElementById("modal-links");
    linkContainer.innerHTML = "";
    
    if (item.video_url) {
        linkContainer.innerHTML += `
            <a href="${item.video_url}" target="_blank" class="btn btn-primary" style="gap: 5px; font-size: 0.8rem;">
                <i data-lucide="play" style="width: 14px;"></i> Video Demo
            </a>
        `;
    }
    
    modal.classList.add("active");
    lucide.createIcons();
}

function buildCarousel() {
    const carousel = document.getElementById("modal-media-carousel");
    const prevBtn = document.getElementById("carousel-prev");
    const nextBtn = document.getElementById("carousel-next");
    
    carousel.querySelectorAll(".carousel-slide").forEach(slide => slide.remove());
    
    if (activeModalMedia.length === 0) {
        carousel.style.display = "none";
    } else {
        carousel.style.display = "block";
        
        activeModalMedia.forEach((media, idx) => {
            const slide = document.createElement("div");
            slide.className = `carousel-slide ${idx === 0 ? 'active' : ''}`;
            
            if (media.type === "image") {
                slide.innerHTML = `<img src="${media.url}" alt="Media asset">`;
            } else if (media.type === "video") {
                if (media.url.includes("youtube.com") || media.url.includes("youtu.be")) {
                    const embedId = getYouTubeId(media.url);
                    slide.innerHTML = `<iframe width="100%" height="100%" src="https://www.youtube.com/embed/${embedId}" frameborder="0" allowfullscreen></iframe>`;
                } else {
                    slide.innerHTML = `<video src="${media.url}" controls></video>`;
                }
            }
            carousel.insertBefore(slide, prevBtn);
        });
        
        currentCarouselIndex = 0;
        
        if (activeModalMedia.length <= 1) {
            prevBtn.style.display = "none";
            nextBtn.style.display = "none";
        } else {
            prevBtn.style.display = "flex";
            nextBtn.style.display = "flex";
        }
    }
}

function openLightbox(imageUrl, title, description) {
    const modal = document.getElementById("detail-modal");
    document.getElementById("modal-title").textContent = title;
    document.getElementById("modal-description").textContent = description;
    document.getElementById("modal-meta-label").textContent = "Prototype Details";
    document.getElementById("modal-hardware").textContent = "Gallery Image Item";
    document.getElementById("modal-date").textContent = "N/A";
    
    const carousel = document.getElementById("modal-media-carousel");
    const prevBtn = document.getElementById("carousel-prev");
    const nextBtn = document.getElementById("carousel-next");
    
    carousel.querySelectorAll(".carousel-slide").forEach(slide => slide.remove());
    carousel.style.display = "block";
    
    const slide = document.createElement("div");
    slide.className = "carousel-slide active";
    slide.innerHTML = `<img src="${imageUrl}" alt="${title}" class="lightbox-media">`;
    carousel.insertBefore(slide, prevBtn);
    
    prevBtn.style.display = "none";
    nextBtn.style.display = "none";
    
    document.getElementById("modal-links").innerHTML = "";
    
    modal.classList.add("active");
    lucide.createIcons();
}

function closeModal() {
    const modal = document.getElementById("detail-modal");
    modal.classList.remove("active");
    
    const carousel = document.getElementById("modal-media-carousel");
    carousel.querySelectorAll(".carousel-slide").forEach(slide => {
        slide.innerHTML = "";
    });
}

function navigateCarousel(direction) {
    const slides = document.querySelectorAll(".carousel-slide");
    if (slides.length === 0) return;
    
    slides[currentCarouselIndex].classList.remove("active");
    currentCarouselIndex = (currentCarouselIndex + direction + activeModalMedia.length) % activeModalMedia.length;
    slides[currentCarouselIndex].classList.add("active");
}

function getYouTubeId(url) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
}

// --- Form Submission Handler ---
function handleContactSubmit(e) {
    e.preventDefault();
    const statusDiv = document.getElementById("contact-status");
    
    statusDiv.style.color = "var(--accent-cyan)";
    statusDiv.textContent = "Transmitting message packet...";
    
    setTimeout(() => {
        statusDiv.style.color = "var(--accent-green)";
        statusDiv.textContent = "Message sent successfully.";
        document.getElementById("contact-form").reset();
    }, 1200);
}
