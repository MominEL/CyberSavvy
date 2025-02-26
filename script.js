// Wait for the DOM to fully load before running any scripts
document.addEventListener("DOMContentLoaded", function () {

    // ✅ GSAP Animations for Smooth Appearance
    gsap.from(".cyber-title", { opacity: 0, y: -50, duration: 1 });
    gsap.from(".subtitle", { opacity: 0, delay: 0.5, duration: 1 });
    gsap.from(".faq", { opacity: 0, stagger: 0.3, duration: 1 });
    gsap.from(".contact-form", { opacity: 0, y: 50, duration: 1 });
    gsap.from(".floating-icon", { opacity: 0, stagger: 0.5, y: 20, duration: 2 });

    // ✅ Check if "playGame" button exists before adding event listener
    let playGameBtn = document.getElementById("playGame");
    if (playGameBtn) {
        playGameBtn.addEventListener("click", function () {
            window.location.href = "levels.html";
        });
    }

    let learnMoreBtn = document.getElementById("learnMore");
    if (learnMoreBtn) {
        learnMoreBtn.addEventListener("click", function () {
            window.location.href = "learn.html";
        });
    }

    // ✅ Dropdown Menu Toggle
    let menuIcon = document.querySelector(".menu-icon");
    let menu = document.querySelector(".dropdown-menu");

    if (menuIcon && menu) {
        menuIcon.addEventListener("click", function () {
            if (menu.style.display === "block") {
                gsap.to(menu, { opacity: 0, duration: 0.5, onComplete: () => menu.style.display = "none" });
            } else {
                menu.style.display = "block";
                gsap.from(menu, { opacity: 0, duration: 0.5 });
            }
        });
    }

    // ✅ Smooth Navigation for All Pages
    const links = document.querySelectorAll("nav a");
    links.forEach(link => {
        link.addEventListener("click", function (e) {
            e.preventDefault();
            gsap.to("body", { opacity: 0, duration: 0.5, onComplete: () => {
                window.location.href = this.href;
            }});
        });
    });

    // ✅ Expand/Collapse FAQ Answers with Smooth Animation
    let faqQuestions = document.querySelectorAll('.faq-question');
    if (faqQuestions.length > 0) {
        faqQuestions.forEach(item => {
            item.addEventListener('click', function () {
                let parentFaq = this.parentElement;
                let answer = parentFaq.querySelector('.faq-answer');
                let icon = this.querySelector('.toggle-icon');

                if (parentFaq.classList.contains('open')) {
                    gsap.to(answer, { height: 0, opacity: 0, duration: 0.5, onComplete: () => answer.style.display = "none" });
                    parentFaq.classList.remove('open');
                    icon.textContent = '+';
                } else {
                    answer.style.display = "block"; // Ensure it's visible before animating
                    gsap.from(answer, { height: 0, opacity: 0, duration: 0.5 });
                    parentFaq.classList.add('open');
                    icon.textContent = '-';
                }
            });
        });
    }

    // ✅ Submit Question Form Validation
    let submitBtn = document.getElementById("submitQuestion");
    if (submitBtn) {
        submitBtn.addEventListener("click", function() {
            let input = document.getElementById("questionInput");
            let message = document.getElementById("formMessage");

            if (input.value.trim() === "") {
                message.textContent = "⚠️ Please enter a question!";
                message.style.color = "red";
                message.classList.remove("hidden");
                gsap.from(message, { opacity: 0, y: -10, duration: 0.5 });
            } else {
                message.textContent = "✅ Your question has been submitted!";
                message.style.color = "limegreen";
                message.classList.remove("hidden");
                gsap.from(message, { opacity: 0, y: -10, duration: 0.5 });

                setTimeout(() => {
                    input.value = "";
                    gsap.to(message, { opacity: 0, duration: 1, onComplete: () => {
                        message.classList.add("hidden");
                    }});
                }, 2000);
            }
        });
    }


});
