gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

// Hero intro timeline for first meaningful paint.
const introTl = gsap.timeline({ defaults: { ease: "power3.out" } });

introTl
	.from(".avatar-wrap", { y: 22, opacity: 0, duration: 0.65 })
	.from(".eyebrow", { y: 16, opacity: 0, duration: 0.45 }, "-=0.25")
	.from("h1", { y: 28, opacity: 0, duration: 0.55 }, "-=0.2")
	.from(".summary", { y: 18, opacity: 0, duration: 0.45 }, "-=0.15")
	.from(".cta", { scale: 0.92, opacity: 0, duration: 0.4 }, "-=0.2");

// Reveal sections and cards on scroll.
gsap.utils.toArray(".reveal").forEach((element, i) => {
	gsap.to(element, {
		opacity: 1,
		y: 0,
		duration: 0.7,
		ease: "power2.out",
		delay: (i % 4) * 0.03,
		scrollTrigger: {
			trigger: element,
			start: "top 84%"
		}
	});
});

// Smooth scroll for all in-page navigation links.
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
	anchor.addEventListener("click", (event) => {
		const targetId = anchor.getAttribute("href");
		if (!targetId || targetId === "#") {
			return;
		}

		const target = document.querySelector(targetId);
		if (!target) {
			return;
		}

		event.preventDefault();
		gsap.to(window, {
			duration: 1,
			ease: "power2.out",
			scrollTo: {
				y: target,
				offsetY: 60
			}
		});
	});
});

// Subtle floating gradient motion for visual depth.
gsap.to(".gradient-a", {
	x: 80,
	y: 45,
	duration: 8,
	repeat: -1,
	yoyo: true,
	ease: "sine.inOut"
});

gsap.to(".gradient-b", {
	x: -70,
	y: -35,
	duration: 9,
	repeat: -1,
	yoyo: true,
	ease: "sine.inOut"
});

// Project galleries: show one large image and auto-cycle through the rest.
gsap.utils.toArray(".project-gallery").forEach((gallery) => {
	const slides = Array.from(gallery.querySelectorAll("img"));
	if (slides.length === 0) {
		return;
	}

	let current = 0;
	let timer = null;

	slides.forEach((slide, index) => {
		gsap.set(slide, {
			autoAlpha: index === 0 ? 1 : 0,
			x: index === 0 ? 0 : 500
		});
	});

	const showSlide = (next) => {
		// Always slide from right to left
		const direction = 500; // current slide moves left
		const enterDirection = 500; // new slide comes from right

		gsap.timeline()
			.to(slides[current], {
				autoAlpha: 0,
				x: -direction,
				duration: 0.5,
				ease: "power2.out"
			})
			.fromTo(
				slides[next],
				{ autoAlpha: 0, x: enterDirection },
				{
					autoAlpha: 1,
					x: 0,
					duration: 0.5,
					ease: "power2.out"
				},
				"<"
			);

		current = next;
	};

	const nextSlide = () => {
		const next = (current + 1) % slides.length;
		showSlide(next);
	};

	const prevSlide = () => {
		const next = (current - 1 + slides.length) % slides.length;
		showSlide(next);
	};

	// Auto-cycle
	if (slides.length > 1) {
		timer = window.setInterval(nextSlide, 3200);

		gallery.addEventListener("mouseenter", () => {
			if (timer) {
				window.clearInterval(timer);
				timer = null;
			}
		});

		gallery.addEventListener("mouseleave", () => {
			if (!timer) {
				timer = window.setInterval(nextSlide, 3200);
			}
		});
	}

	// Manual controls
	const prevBtn = gallery.querySelector(".gallery-prev");
	const nextBtn = gallery.querySelector(".gallery-next");

	if (prevBtn) {
		prevBtn.addEventListener("click", () => {
			if (timer) {
				window.clearInterval(timer);
				timer = null;
			}
			prevSlide();
			if (slides.length > 1) {
				timer = window.setInterval(nextSlide, 3200);
			}
		});
	}

	if (nextBtn) {
		nextBtn.addEventListener("click", () => {
			if (timer) {
				window.clearInterval(timer);
				timer = null;
			}
			nextSlide();
			if (slides.length > 1) {
				timer = window.setInterval(nextSlide, 3200);
			}
		});
	}
});

// Project card click: expand/collapse card to show/hide detail (no popup)
function isMobileDevice() {
    return window.innerWidth <= 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

document.querySelectorAll('.project-card').forEach(card => {
	if (isMobileDevice()) {
		// Trên mobile: không cho click vào project-card
		card.style.pointerEvents = 'none';
	} else {
		// Hover: show detail (CSS handles this)
		// Click: toggle expanded
		card.addEventListener('click', function (e) {
			// Prevent nested links from triggering expand
			if (e.target.tagName === 'A') return;
			const expanded = card.classList.contains('expanded');
			document.querySelectorAll('.project-card.expanded').forEach(c => c.classList.remove('expanded'));
			if (!expanded) {
				card.classList.add('expanded');
				setTimeout(() => card.scrollIntoView({behavior:'smooth',block:'center'}), 180);
			}
		});
	}
});

// Mobile hamburger menu toggle.
const menuToggle = document.querySelector(".menu-toggle");
const topbarNav = document.querySelector(".topbar-nav");
const menuClose = document.querySelector(".menu-close");
const navLinks = document.querySelectorAll(".topbar-nav a");

if (menuToggle && topbarNav) {
	menuToggle.addEventListener("click", () => {
		topbarNav.classList.toggle("active");
	});

	// Close menu when link is clicked.
	topbarNav.querySelectorAll("a").forEach((link) => {
		link.addEventListener("click", () => {
			topbarNav.classList.remove("active");
		});
	});

	// Close menu when close button is clicked.
	if (menuClose) {
		menuClose.addEventListener("click", () => {
			topbarNav.classList.remove("active");
		});
	}
}

// Active link on scroll - highlight which section user is viewing.
function updateActiveLink() {
	let current = "page1"; // Default to page1 (Info)
	const sections = document.querySelectorAll("section.page");

	sections.forEach((section) => {
		const sectionTop = section.offsetTop;
		const sectionHeight = section.clientHeight;
		const scrollPos = window.pageYOffset + 100; // Offset for navbar height
		
		if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
			current = section.getAttribute("id");
		}
	});

	navLinks.forEach((link) => {
		link.classList.remove("active");
		if (link.getAttribute("href") === `#${current}`) {
			link.classList.add("active");
		}
	});
}

window.addEventListener("scroll", updateActiveLink);
updateActiveLink();
