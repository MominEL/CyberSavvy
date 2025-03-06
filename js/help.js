document.addEventListener("DOMContentLoaded", () => {
    // -----------------------
    // 1. FAQ Expand/Collapse
    // -----------------------
    const faqItems = document.querySelectorAll(".faq-item");
  
    faqItems.forEach((item) => {
      const question = item.querySelector(".faq-question");
  
      question.addEventListener("click", () => {
        const isOpen = item.classList.contains("open");
  
        // Optionally close all other items:
        faqItems.forEach((other) => {
          other.classList.remove("open");
        });
  
        // Toggle the clicked FAQ item
        if (!isOpen) {
          item.classList.add("open");
        } else {
          item.classList.remove("open");
        }
      });
    });
  
    // -----------------------
    // 2. Contact Us Popup
    // -----------------------
    const openChatBtn = document.getElementById("openChatBtn");
    const closeChatBtnX = document.getElementById("closeChatBtnX");
    const popupOverlay = document.getElementById("popupOverlay");
  
    // Ensure the popup is hidden by default
    popupOverlay.classList.add("hidden");
  
    // Open the popup when "Contact Us" is clicked
    openChatBtn.addEventListener("click", () => {
      popupOverlay.classList.remove("hidden");
    });
  
    // Close the popup when the "X" button is clicked
    closeChatBtnX.addEventListener("click", () => {
      popupOverlay.classList.add("hidden");
    });
  
    // -----------------------
    // 3. Handle Form Submission
    // -----------------------
    const form = popupOverlay.querySelector("form");
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      alert("Thank you for contacting us! We'll be in touch soon.");
      popupOverlay.classList.add("hidden");
    });
  
    // -----------------------
    // 4. Scroll Animations with GSAP ScrollTrigger
    // -----------------------
    gsap.registerPlugin(ScrollTrigger);
  
    // Animate FAQ items as they scroll into view
    gsap.utils.toArray(".faq-item").forEach(item => {
      gsap.from(item, {
        scrollTrigger: {
          trigger: item,
          start: "top 80%",
          toggleActions: "play none none reverse"
        },
        opacity: 0,
        y: 50,
        duration: 0.8,
        ease: "power2.out"
      });
    });
  
    // Animate the "Need More Help" section on scroll
    gsap.from(".need-help-container", {
      scrollTrigger: {
        trigger: ".need-help-container",
        start: "top 80%",
        toggleActions: "play none none reverse"
      },
      opacity: 0,
      y: 50,
      duration: 0.8,
      ease: "power2.out"
    });
  });
  