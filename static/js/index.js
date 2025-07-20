// Mobile menu toggle
const mobileMenuButton = document.querySelector('.mobile-menu-button');
const mobileMenu = document.querySelector('.mobile-menu');

mobileMenuButton.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
});

// Close mobile menu when clicking on a link
const mobileMenuLinks = document.querySelectorAll('.mobile-menu a');
mobileMenuLinks.forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
    });
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);

        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// Animation for skills bars when they come into view
const skillBars = document.querySelectorAll('.skill-progress');

const animateSkillBars = () => {
    skillBars.forEach(bar => {
        const width = bar.style.width;
        bar.style.width = '0';

        setTimeout(() => {
            bar.style.width = width;
        }, 100);
    });
};

// Intersection Observer for skills section
const skillsSection = document.querySelector('#skills');
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateSkillBars();
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });

if (skillsSection) {
    observer.observe(skillsSection);
}

// Form submission handling
function sendToWhatsapp() {
    // 1. Mengambil nilai dari setiap input form
    const nama = document.getElementById('name').value;
    const know = document.getElementById('know').value;
    const subjek = document.getElementById('subject').value;
    const pesan = document.getElementById('message').value;

    // 2. Nomor tujuan WhatsApp
    const nomorWhatsapp = '6282337130026';

    // 3. Membuat format pesan sesuai permintaan
    const formatPesan = `Halo, Lazuardi 👋\nKenalin aku, ${nama}\nAku tahu kamu dari ${know}\n\n${subjek}\n\n${pesan}`;

    // 4. Mengecek jika ada field yang kosong
    if (!nama || !know || !subjek || !pesan) {
        alert("Harap isi semua kolom sebelum mengirim pesan.");
        return;
    }

    // 5. Membuat URL WhatsApp
    // encodeURIComponent digunakan agar karakter spesial (seperti spasi dan baris baru) bisa terbaca di URL
    const urlWhatsapp = `https://api.whatsapp.com/send?phone=${nomorWhatsapp}&text=${encodeURIComponent(formatPesan)}`;

    // 6. Membuka WhatsApp di tab baru
    window.open(urlWhatsapp, '_blank');
}

// Function button kanan kiri
document.addEventListener('DOMContentLoaded', function () {
    const sliderContainer = document.getElementById('slider-container');
    const prevButton = document.getElementById('prev-button');
    const nextButton = document.getElementById('next-button');
    const card = sliderContainer.querySelector('.project-card');

    // Cek jika elemen ditemukan sebelum melanjutkan
    if (!sliderContainer || !prevButton || !nextButton || !card) {
        console.error("Slider elements not found!");
        return;
    }

    // Hitung jarak scroll berdasarkan lebar kartu + gap
    const cardStyle = window.getComputedStyle(card);
    const sliderStyle = window.getComputedStyle(sliderContainer.querySelector('.slidere'));
    const cardMargin = parseInt(cardStyle.marginRight) + parseInt(cardStyle.marginLeft);
    const cardGap = parseInt(sliderStyle.gap);
    const scrollAmount = card.offsetWidth + cardMargin + cardGap;

    // Fungsi untuk menggeser ke kanan
    nextButton.addEventListener('click', () => {
        sliderContainer.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    });

    // Fungsi untuk menggeser ke kiri
    prevButton.addEventListener('click', () => {
        sliderContainer.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    });
});

// Project Details
document.addEventListener('DOMContentLoaded', function () {
    const modal = document.getElementById('project-modal');
    const modalPanel = document.getElementById('modal-panel');
    const closeBtn = document.getElementById('modal-close-btn');
    const viewProjectBtns = document.querySelectorAll('.view-project-btn');

    // Modal elements to populate
    const modalImg = document.getElementById('modal-img');
    const modalTitle = document.getElementById('modal-title');
    const modalDescription = document.getElementById('modal-description');
    const modalTechContainer = document.getElementById('modal-tech-container');
    const modalLink = document.getElementById('modal-link');

    modalLink.addEventListener('click', function (event) {
        // Mencegah perilaku default link yang mungkin terganggu
        event.preventDefault();

        // Ambil URL dari atribut href tombol itu sendiri
        const url = this.href;

        // Buka URL di tab baru secara manual jika link valid
        if (url && url.trim() !== '' && !url.endsWith('#')) {
            window.open(url, '_blank');
        }
    });

    // --- Function to open the modal with animation ---
    const openModal = (card) => {
        const title = card.dataset.title;
        const imgSrc = card.dataset.img;
        const description = card.dataset.description;
        const tech = JSON.parse(card.dataset.tech);
        const link = card.dataset.link;

        // Populate modal with data
        modalTitle.textContent = title;
        modalImg.src = imgSrc;
        modalImg.alt = title;
        modalDescription.textContent = description;
        modalLink.href = link;

        modalTechContainer.innerHTML = '';
        tech.forEach(techName => {
            const techTag = document.createElement('span');
            techTag.className = 'px-3 py-1 bg-gray-700 text-gray-200 rounded-full text-sm';
            techTag.textContent = techName;
            modalTechContainer.appendChild(techTag);
        });

        // Show the modal by triggering the animation
        document.body.style.overflow = 'hidden';
        modal.classList.remove('pointer-events-none');
        modal.classList.remove('opacity-0');
        modalPanel.classList.remove('scale-95');
        modalPanel.classList.remove('opacity-0');
    };

    // --- Function to close the modal with animation ---
    const closeModal = () => {
        // Start the closing animation
        modal.classList.add('opacity-0');
        modalPanel.classList.add('scale-95');
        modalPanel.classList.add('opacity-0');

        // After the animation finishes, disable pointer events and restore body scroll
        setTimeout(() => {
            modal.classList.add('pointer-events-none');
            document.body.style.overflow = '';
        }, 300); // Must match the duration in Tailwind classes (e.g., duration-300)
    };

    // --- Event Listeners ---
    viewProjectBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const card = btn.closest('.project-card');
            openModal(card);
        });
    });

    closeBtn.addEventListener('click', closeModal);

    modal.addEventListener('click', (event) => {
        // Close modal if the outer background is clicked, not the panel itself
        if (event.target === modal) {
            closeModal();
        }
    });

    document.addEventListener('keydown', (event) => {
        // Close modal with the "Escape" key if it's currently open
        if (event.key === 'Escape' && !modal.classList.contains('pointer-events-none')) {
            closeModal();
        }
    });
});