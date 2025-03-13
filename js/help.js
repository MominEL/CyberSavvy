document.addEventListener("DOMContentLoaded", () => {

    const faqItems = document.querySelectorAll(".faq-item");
  
    faqItems.forEach((item) => {
      const question = item.querySelector(".faq-question");
  
      question.addEventListener("click", () => {
        const isOpen = item.classList.contains("open");
  

        faqItems.forEach((other) => {
          other.classList.remove("open");
        });
  

        if (!isOpen) {
          item.classList.add("open");
        } else {
          item.classList.remove("open");
        }
      });
    });
  

    const openChatBtn = document.getElementById("openChatBtn");
    const closeChatBtnX = document.getElementById("closeChatBtnX");
    const popupOverlay = document.getElementById("popupOverlay");
  

    popupOverlay.classList.add("hidden");
  
  
    openChatBtn.addEventListener("click", () => {
      popupOverlay.classList.remove("hidden");
    });
 
    closeChatBtnX.addEventListener("click", () => {
      popupOverlay.classList.add("hidden");
    });
  

    const form = popupOverlay.querySelector("form");
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      alert("Thank you for contacting us! We'll be in touch soon.");
      popupOverlay.classList.add("hidden");
    });
  

    gsap.registerPlugin(ScrollTrigger);
  

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


  document.addEventListener("DOMContentLoaded", function () {

    gsap.utils.toArray(".bubble").forEach((bubble) => {
      gsap.to(bubble, {
        y: 5,                        
        duration: 2 + Math.random(), 
        yoyo: true,
        repeat: -1,
        ease: "power1.inOut",
        delay: Math.random()         
      });
    });
  
  
    const bubbles = document.querySelectorAll(".bubble");
    bubbles.forEach((bubble) => {
      bubble.addEventListener("click", function (e) {
        if (!bubble.classList.contains("expanded")) {
          e.preventDefault();
       
          bubbles.forEach(b => b.classList.remove("expanded"));
          bubble.classList.add("expanded");
        }

      });
    });
  });
  
  