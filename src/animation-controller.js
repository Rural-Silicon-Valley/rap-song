const MOTION_SELECTORS = '[data-animate], [data-animate-item]'
let observerInstance = null

const clamp = (value, min, max) => Math.min(Math.max(value, min), max)

const applyTilt = (element, { x, y }) => {
  const intensity = element.dataset.tiltIntensity ? parseFloat(element.dataset.tiltIntensity) : 12
  const rotateX = clamp(y * intensity, -intensity, intensity)
  const rotateY = clamp(x * -intensity, -intensity, intensity)

  element.style.setProperty('--tilt-rotate-x', `${rotateX}deg`)
  element.style.setProperty('--tilt-rotate-y', `${rotateY}deg`)
  element.style.setProperty('--tilt-translate-z', `${Math.abs(x + y) * 6}px`)
}

const resetTilt = (element) => {
  element.style.setProperty('--tilt-rotate-x', '0deg')
  element.style.setProperty('--tilt-rotate-y', '0deg')
  element.style.setProperty('--tilt-translate-z', '0px')
}

const initTilt = () => {
  const tiltElements = document.querySelectorAll('[data-tilt]')
  tiltElements.forEach((element) => {
    element.addEventListener('pointermove', (event) => {
      const rect = element.getBoundingClientRect()
      const offsetX = (event.clientX - rect.left) / rect.width - 0.5
      const offsetY = (event.clientY - rect.top) / rect.height - 0.5
      applyTilt(element, { x: offsetX, y: offsetY })
    })

    element.addEventListener('pointerleave', () => {
      resetTilt(element)
    })

    element.addEventListener('keydown', (event) => {
      if (event.key === 'Tab') {
        resetTilt(element)
      }
    })
  })
}

const initScrollAnimations = () => {
  if (observerInstance) {
    observerInstance.disconnect()
  }

  observerInstance = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const target = entry.target
          const delay = target.dataset.delay ? parseInt(target.dataset.delay, 10) : 0

          if (target.dataset.animate === 'stagger') {
            const items = target.querySelectorAll('[data-animate-item]')
            items.forEach((item, index) => {
              const itemDelay = delay + index * 90
              requestAnimationFrame(() => {
                setTimeout(() => {
                  item.classList.add('is-animated')
                }, itemDelay)
              })
            })
          }

          requestAnimationFrame(() => {
            setTimeout(() => {
              target.classList.add('is-animated')
            }, delay)
          })

          observerInstance?.unobserve(target)
        }
      })
    },
    {
      threshold: 0.22,
      rootMargin: '0px 0px -12% 0px'
    }
  )

  document.querySelectorAll(MOTION_SELECTORS).forEach((element) => {
    observerInstance?.observe(element)
  })
}

export const initializeAnimations = () => {
  if (typeof window === 'undefined') return

  const run = () => {
    initScrollAnimations()
    initTilt()
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run, { once: true })
  } else {
    requestAnimationFrame(run)
  }
}