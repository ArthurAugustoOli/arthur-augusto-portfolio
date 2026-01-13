
;(function initBootIntro() {
  const bootIntro = document.getElementById("bootIntro")


  if (!bootIntro) return

  const hasVisited = sessionStorage.getItem("portfolioVisited")

  if (hasVisited) {
   
    bootIntro.remove()
    document.body.classList.add("intro-done")
    return
  }

  document.body.classList.add("intro-active")

  const bootLines = document.querySelectorAll(".boot-line")
  const bootNameContainer = document.querySelector(".boot-name-container")
  const bootName = document.querySelector(".boot-name")
  const bootScan = document.querySelector(".boot-scan")
  const bootFlash = document.querySelector(".boot-flash")


  let currentLine = 0
  const lineDelay = 500 
  const typingDuration = 300 

  function showNextLine() {
    if (currentLine >= bootLines.length) {
  
      setTimeout(showBootName, 300)
      return
    }

    const line = bootLines[currentLine]
    line.classList.add("visible", "typing")

    setTimeout(() => {
      line.classList.remove("typing")
      currentLine++
      setTimeout(showNextLine, lineDelay)
    }, typingDuration)
  }

  function showBootName() {
    bootNameContainer.classList.add("visible")

   
    setTimeout(() => {
      bootName.classList.add("glitch")

      
      setTimeout(() => {
        bootName.classList.remove("glitch")
        startScan()
      }, 600)
    }, 400)
  }

  function startScan() {
    bootScan.classList.add("active")

  
    setTimeout(() => {
      bootFlash.classList.add("active")

      setTimeout(() => {
        
        bootIntro.classList.add("hidden")
        document.body.classList.remove("intro-active")
        document.body.classList.add("intro-done")

       
        sessionStorage.setItem("portfolioVisited", "true")

       
        setTimeout(() => {
          bootIntro.remove()
        }, 800)
      }, 200)
    }, 800)
  }

  
  setTimeout(showNextLine, 400)
})()


const skillsContainer = document.querySelector(".skills-container")

if (skillsContainer) {
  skillsContainer.addEventListener("mousemove", (e) => {
    const rect = skillsContainer.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const rotateX = (y / rect.height - 0.5) * -10
    const rotateY = (x / rect.width - 0.5) * 10

    skillsContainer.style.transform = `
      rotateX(${rotateX}deg)
      rotateY(${rotateY}deg)
    `
  })

  skillsContainer.addEventListener("mouseleave", () => {
    skillsContainer.style.transform = "rotateX(0deg) rotateY(0deg)"
  })


  const skillCards = document.querySelectorAll(".skill-card")

  skillCards.forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      const glow = card.querySelector(".skill-glow")
      if (glow) {
        glow.style.left = `${x - glow.offsetWidth / 2}px`
        glow.style.top = `${y - glow.offsetHeight / 2}px`
      }
    })
  })
}


let lang = "pt"
const toggle = document.getElementById("langToggle")

function setLanguage() {
  const elements = document.querySelectorAll("[data-pt]")
  elements.forEach((el) => {
    const text = el.dataset[lang]
    if (text) {
      el.innerHTML = text
    }
  })

  const langText = toggle?.querySelector(".lang-text")
  if (langText) {
    langText.textContent = lang === "pt" ? "EN" : "PT"
  }
}

if (toggle) {
  toggle.addEventListener("click", () => {
    lang = lang === "pt" ? "en" : "pt"
    setLanguage()

    toggle.style.transform = "scale(0.95)"
    setTimeout(() => {
      toggle.style.transform = "scale(1)"
    }, 100)
  })
}


setLanguage()


const observerOptions = {
  root: null,
  rootMargin: "0px",
  threshold: 0.1,
}

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible")

      
      if (entry.target.classList.contains("skills")) {
        const levelBars = entry.target.querySelectorAll(".skill-card")
        levelBars.forEach((card, index) => {
          setTimeout(() => {
            card.classList.add("visible")
          }, index * 100)
        })
      }
    }
  })
}, observerOptions)


document.querySelectorAll(".section-animate").forEach((section) => {
  sectionObserver.observe(section)
})


const aboutSlider = document.querySelector(".about-slider")

if (aboutSlider) {
  const track = aboutSlider.querySelector(".about-slider-track")
  const slides = aboutSlider.querySelectorAll(".about-slide")
  const arrowRight = aboutSlider.querySelector(".slider-arrow-right")
  const dots = aboutSlider.querySelectorAll(".slider-dot")

  let currentSlide = 0
  const totalSlides = slides.length

 
  let isDragging = false
  let startX = 0
  let currentTranslate = 0
  let prevTranslate = 0
  const animationID = 0


  function updateSlider(animate = true) {
    if (!animate) {
      track.style.transition = "none"
    } else {
      track.style.transition = "transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)"
    }

    track.style.transform = `translateX(-${currentSlide * 100}%)`

   
    dots.forEach((dot, index) => {
      dot.classList.toggle("active", index === currentSlide)
    })

    if (arrowRight) {
      if (currentSlide === totalSlides - 1) {
        arrowRight.innerHTML = '<i class="bi bi-arrow-left"></i>'
      } else {
        arrowRight.innerHTML = '<i class="bi bi-arrow-right"></i>'
      }
    }
  }


  function goToSlide(index) {
    currentSlide = Math.max(0, Math.min(index, totalSlides - 1))
    updateSlider()
  }

 
  if (arrowRight) {
    arrowRight.addEventListener("click", () => {
      if (currentSlide === totalSlides - 1) {
        goToSlide(0)
      } else {
        goToSlide(currentSlide + 1)
      }
    })
  }


  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      goToSlide(index)
    })
  })

  function getPositionX(event) {
    return event.type.includes("mouse") ? event.pageX : event.touches[0].clientX
  }

  function touchStart(event) {
    isDragging = true
    startX = getPositionX(event)
    track.style.transition = "none"
    track.style.cursor = "grabbing"
  }

  function touchMove(event) {
    if (!isDragging) return

    const currentX = getPositionX(event)
    const diff = currentX - startX
    const slideWidth = aboutSlider.offsetWidth
    currentTranslate = prevTranslate + diff

 
    const maxTranslate = 0
    const minTranslate = -(totalSlides - 1) * slideWidth
    currentTranslate = Math.max(minTranslate - 100, Math.min(maxTranslate + 100, currentTranslate))

    track.style.transform = `translateX(${currentTranslate}px)`
  }

  function touchEnd() {
    if (!isDragging) return
    isDragging = false
    track.style.cursor = "grab"

    const slideWidth = aboutSlider.offsetWidth
    const movedBy = currentTranslate - prevTranslate

 
    if (movedBy < -100 && currentSlide < totalSlides - 1) {
      currentSlide++
    } else if (movedBy > 100 && currentSlide > 0) {
      currentSlide--
    }

    prevTranslate = -currentSlide * slideWidth
    currentTranslate = prevTranslate

    updateSlider()
  }

  track.addEventListener("mousedown", touchStart)
  track.addEventListener("mousemove", touchMove)
  track.addEventListener("mouseup", touchEnd)
  track.addEventListener("mouseleave", () => {
    if (isDragging) touchEnd()
  })

  track.addEventListener("touchstart", touchStart, { passive: true })
  track.addEventListener("touchmove", touchMove, { passive: true })
  track.addEventListener("touchend", touchEnd)


  track.addEventListener("contextmenu", (e) => {
    if (isDragging) e.preventDefault()
  })

  aboutSlider.setAttribute("tabindex", "0")
  aboutSlider.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") {
      goToSlide(currentSlide + 1)
    } else if (e.key === "ArrowLeft") {
      goToSlide(currentSlide - 1)
    }
  })


  updateSlider(false)


  window.addEventListener("resize", () => {
    prevTranslate = -currentSlide * aboutSlider.offsetWidth
    currentTranslate = prevTranslate
    updateSlider(false)
  })
}


document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault()
    const target = document.querySelector(this.getAttribute("href"))

    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    }
  })
})


document.querySelectorAll(".social-top a").forEach((link) => {
  link.addEventListener("click", function (e) {
    const ripple = this.querySelector(".ripple")
    if (ripple) {
      ripple.classList.remove("animate")
      void ripple.offsetWidth // Trigger reflow
      ripple.classList.add("animate")
    }
  })
})

const bgGlow = document.querySelector(".bg-glow")

if (bgGlow) {
  window.addEventListener("scroll", () => {
    const scrolled = window.pageYOffset
    bgGlow.style.transform = `translateX(-50%) translateY(${scrolled * 0.3}px)`
  })
}


const heroSubtitle = document.querySelector(".hero-subtitle")

function typeEffect(element, text, speed = 100) {
  let i = 0
  element.textContent = ""

  function type() {
    if (i < text.length) {
      element.textContent += text.charAt(i)
      i++
      setTimeout(type, speed)
    }
  }

  type()
}

// efeito de digitação:
// if (heroSubtitle) {
//   const text = heroSubtitle.dataset[lang] || heroSubtitle.textContent;
//   setTimeout(() => typeEffect(heroSubtitle, text, 80), 1000);
// }


window.addEventListener("load", () => {
  document.body.classList.add("loaded")
})


document.querySelectorAll(".project-card").forEach((card) => {
  card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const centerX = rect.width / 2
    const centerY = rect.height / 2

    const rotateX = (y - centerY) / 20
    const rotateY = (centerX - x) / 20

    card.style.transform = `
      perspective(1000px)
      rotateX(${rotateX}deg)
      rotateY(${rotateY}deg)
      translateY(-8px)
    `
  })

  card.addEventListener("mouseleave", () => {
    card.style.transform = "perspective(1000px) rotateX(0) rotateY(0) translateY(0)"
  })
})


document.querySelectorAll(".contact-item").forEach((item) => {
  item.addEventListener("mouseenter", () => {
    item.style.setProperty("--glow-opacity", "1")
  })

  item.addEventListener("mouseleave", () => {
    item.style.setProperty("--glow-opacity", "0")
  })
})
