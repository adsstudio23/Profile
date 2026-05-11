import { initializeApp } from "https://www.gstatic.com/firebasejs/12.13.0/firebase-app.js";
import { getFirestore, doc, getDoc, collection, getDocs } from "https://www.gstatic.com/firebasejs/12.13.0/firebase-firestore.js";

// Konfigurasi Firebase
const firebaseConfig = {
    apiKey: "AIzaSyCq0WEAENl8nxhDXNihysZtZprqtc_L82U",
    authDomain: "adsstudio-c7d24.firebaseapp.com",
    projectId: "adsstudio-c7d24",
    storageBucket: "adsstudio-c7d24.firebasestorage.app",
    messagingSenderId: "707529787206",
    appId: "1:707529787206:web:0745367d9d609c48740747",
    measurementId: "G-4LWNZRFY0H"
};

let db;
try {
    const app = initializeApp(firebaseConfig);
    db = getFirestore(app);
} catch (e) { console.warn("Firebase init error:", e.message); db = null; }

const defaultData = {
    name: "Adrieza Rizky Samudra",
    tagline: "Full-Stack Developer",
    description: "Front-end designer berpengalaman 10 tahun. Menguasai JavaScript, HTML/CSS, PHP, Ruby. Membangun website dinamis maupun statis yang cepat dan interaktif.",
    photoURL: "", logoURL: "",
    aboutText: "<p>Saya Adrieza, seorang full-stack developer dengan keunggulan di bidang front-end design. Saya telah mendesain dan mengembangkan website selama lebih dari satu dekade.</p><p>Saya percaya bahwa website yang baik bukan hanya soal kode, tapi juga bagaimana pengalaman pengguna terasa mulus dan menyenangkan. Dari HTML/CSS hingga React, dari PHP hingga Ruby, saya siap mewujudkan ide digital Anda.</p>",
    skills: ["HTML/CSS", "JavaScript", "React", "PHP", "Ruby"],
    whatsapp: "6285785202302",
    instagram: "https://www.instagram.com/adsstud1o?igsh=MWNueThpdGQwYmVkbA==",
    email: "adsstudio60@gmail.com",
    experience: [
        { role: "Freelance Designer", company: "Qiara Media", date: "2020-2021", desc: "Membuat cover atau sampul buku." },
        { role: "Designer", company: "Makmur Digital Printing", date: "2023-2024", desc: "Design banner promosi, sticker, logo, dll." },
        { role: "Freelancer Designer/Full-Stack Developer", company: "Freelance", date: "2024-sekarang", desc: "Membangun website dan desain untuk berbagai klien." }
    ],
    projects: [
        { id: "proj1", name: "Kopi Lereng", desc: "Website ini mengintegrasikan Google Maps dan WhatsApp...", tech: ["HTML/CSS", "JavaScript"], link: "https://adsstudio23.github.io/Portofolio-coffe/", image: "" },
        { id: "proj2", name: "Rent Cost", desc: "Membantu pemilik bisnis rental baju cosplay...", tech: ["HTML/CSS", "JavaScript", "React"], link: "https://adsstudio23.github.io/Cosplay/", image: "" },
        { id: "proj3", name: "Monster Hunter Ultimate Set", desc: "Mempermudah player MH3rd portable...", tech: ["HTML/CSS", "JavaScript", "React"], link: "https://mh3rdultimate.github.io/Mh3rdmixset/", image: "" }
    ]
};

// Placeholder gambar
function placeholderImage(text) {
    return "data:image/svg+xml," + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="400" height="250"><rect width="400" height="250" fill="#f5efe8"/><text x="200" y="130" text-anchor="middle" fill="#999" font-size="18">${text}</text></svg>`);
}

async function loadData() {
    if (!db) return defaultData;
    let data = { ...defaultData };
    try {
        const docSnap = await getDoc(doc(db, "content", "profile"));
        if (docSnap.exists()) {
            const fb = docSnap.data();
            data = { ...data, ...fb };
            if (typeof data.skills === 'string') data.skills = data.skills.split(',').map(s => s.trim());
        }
        const projSnap = await getDocs(collection(db, "content", "profile", "projects"));
        if (!projSnap.empty) {
            data.projects = [];
            projSnap.forEach(doc => data.projects.push({ id: doc.id, ...doc.data() }));
        }
    } catch (e) { console.warn("Gagal ambil data:", e.message); }
    return data;
}

function renderPage(data) {
    document.getElementById("nameDisplay").textContent = data.name;
    document.getElementById("taglineDisplay").textContent = data.tagline;
    document.getElementById("descriptionDisplay").textContent = data.description;
    document.getElementById("profilePhotoDisplay").src = data.photoURL || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Crect width='200' height='200' fill='%23f0e6d3'/%3E%3Ctext x='100' y='110' text-anchor='middle' fill='%23999'%3EFoto%3C/text%3E%3C/svg%3E";
    document.getElementById("logoDisplay").src = data.logoURL || "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40'%3E%3Crect width='40' height='40' fill='%23e0b1b1' rx='5'/%3E%3C/svg%3E";
    document.getElementById("aboutText").innerHTML = data.aboutText;
    document.getElementById("skillsContainer").innerHTML = data.skills.map(s => `<span class="skill-tag">${s}</span>`).join('');
    document.getElementById("projectsGrid").innerHTML = data.projects.map(p => `
        <div class="project-card reveal">
            <img src="${p.image || placeholderImage(p.name)}" alt="${p.name}">
            <div class="project-card-content">
                <h3>${p.name}</h3><p>${p.desc}</p>
                <div class="tech-tags">${p.tech.map(t => `<span class="tech-tag">${t}</span>`).join('')}</div>
                <a href="${p.link}" target="_blank" class="project-link">Lihat Proyek →</a>
            </div>
        </div>
    `).join('');
    document.getElementById("timelineContainer").innerHTML = data.experience.map(e => `
        <div class="timeline-item reveal">
            <h4>${e.role} – ${e.company}</h4>
            <div class="date">${e.date}</div>
            <p>${e.desc}</p>
        </div>
    `).join('');
    document.getElementById("whatsappLink").href = `https://wa.me/${data.whatsapp}`;
    document.getElementById("instagramLink").href = data.instagram;
    document.getElementById("emailLink").href = `mailto:${data.email}`;

    // Why me statis
    document.getElementById("whyMeGrid").innerHTML = [
        { icon: "🎨", title: "Desainer Sekaligus Programmer", desc: "10 tahun pengalaman design memberikan kepekaan estetika tinggi dipadukan logika pemrograman solid." },
        { icon: "⚡", title: "Cepat, Ringan, Interaktif", desc: "Website tidak hanya responsif, tapi ringan dengan animasi halus." },
        { icon: "🔧", title: "Full-Stack, Spesialis Front-End", desc: "Menguasai HTML/CSS, JS, React, PHP, Ruby." },
        { icon: "📱", title: "Mobile-First, Semua Perangkat", desc: "Tampilan optimal dari ponsel hingga desktop." },
        { icon: "🤝", title: "Komunikatif & Tepat Sasaran", desc: "Mendengarkan kebutuhan dan memberikan solusi sesuai." }
    ].map(c => `<div class="why-card reveal"><div class="why-icon">${c.icon}</div><h3>${c.title}</h3><p>${c.desc}</p></div>`).join('');
}

// Preloader
function hidePreloader() {
    document.querySelector('.preloader')?.classList.add('hidden');
}

// Typing effect
function typeEffect(element, text, speed = 80) {
    let i = 0;
    element.textContent = '';
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    type();
}

// Partikel ringan
function createParticles() {
    const container = document.getElementById('particles');
    for (let i = 0; i < 15; i++) {
        const p = document.createElement('div');
        p.className = 'particle';
        const size = Math.random() * 8 + 4;
        p.style.width = size + 'px';
        p.style.height = size + 'px';
        p.style.left = Math.random() * 100 + '%';
        p.style.animationDuration = (Math.random() * 6 + 6) + 's';
        p.style.animationDelay = Math.random() * 5 + 's';
        container.appendChild(p);
    }
}

// Parallax mouse pada hero image
document.addEventListener('mousemove', (e) => {
    const img = document.querySelector('.hero-image');
    if (!img) return;
    const x = (window.innerWidth / 2 - e.clientX) / 30;
    const y = (window.innerHeight / 2 - e.clientY) / 30;
    img.style.transform = `translate(${x}px, ${y}px)`;
});

// Navbar scroll
window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    // Reveal
    document.querySelectorAll('.reveal').forEach(el => {
        const top = el.getBoundingClientRect().top;
        if (top < window.innerHeight - 100) el.classList.add('active');
    });

    // Active nav item
    const sections = document.querySelectorAll('section');
    const navItems = document.querySelectorAll('.nav-item');
    let current = '';
    sections.forEach(sec => {
        if (scrollY >= sec.offsetTop - 100) current = sec.getAttribute('id');
    });
    navItems.forEach(a => {
        a.classList.remove('active');
        if (a.getAttribute('href') === `#${current}`) a.classList.add('active');
    });
});

// Mobile nav
document.querySelector('.nav-toggle')?.addEventListener('click', () => {
    document.querySelector('.nav-links')?.classList.toggle('active');
});

// Theme toggle
document.querySelector('.theme-toggle')?.addEventListener('click', () => {
    const body = document.body;
    body.setAttribute('data-theme', body.getAttribute('data-theme') === 'light' ? 'dark' : 'light');
});

// Ripple effect
document.querySelectorAll('.ripple').forEach(btn => {
    btn.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        ripple.classList.add('ripple-effect');
        this.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
    });
});

// Init
(async () => {
    createParticles();
    const data = await loadData();
    renderPage(data);
    // Typing tagline
    const taglineEl = document.getElementById('taglineDisplay');
    if (taglineEl && data.tagline) typeEffect(taglineEl, data.tagline);
    hidePreloader();
    // Trigger reveal awal
    window.dispatchEvent(new Event('scroll'));
})();