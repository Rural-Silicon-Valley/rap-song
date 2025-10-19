<script setup lang="ts">
import { gsap } from 'gsap';
import { computed, defineComponent, nextTick, onMounted, onUnmounted, ref, watch, type PropType } from 'vue';

interface BentoCardProps {
  color?: string;
  title?: string;
  description?: string;
  label?: string;
  textAutoHide?: boolean;
  disableAnimations?: boolean;
}

interface BentoProps {
  cards?: BentoCardProps[];
  textAutoHide?: boolean;
  enableStars?: boolean;
  enableSpotlight?: boolean;
  enableBorderGlow?: boolean;
  disableAnimations?: boolean;
  spotlightRadius?: number;
  particleCount?: number;
  enableTilt?: boolean;
  glowColor?: string;
  clickEffect?: boolean;
  enableMagnetism?: boolean;
}

const DEFAULT_PARTICLE_COUNT = 12;
const DEFAULT_SPOTLIGHT_RADIUS = 300;
const DEFAULT_GLOW_COLOR = '0, 200, 83';
const MOBILE_BREAKPOINT = 768;

const createParticleElement = (x: number, y: number, color: string = DEFAULT_GLOW_COLOR): HTMLDivElement => {
  const el = document.createElement('div');
  el.className = 'particle';
  
  // 随机粒子大小,创造层次感
  const size = 3 + Math.random() * 3;
  
  el.style.cssText = `
    position: absolute;
    width: ${size}px;
    height: ${size}px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(${color}, 1) 0%, rgba(${color}, 0.6) 50%, transparent 100%);
    box-shadow: 
      0 0 ${size * 2}px rgba(${color}, 0.8),
      0 0 ${size * 4}px rgba(${color}, 0.4),
      inset 0 0 ${size}px rgba(255, 255, 255, 0.5);
    pointer-events: none;
    z-index: 100;
    left: ${x}px;
    top: ${y}px;
    filter: blur(0.5px);
    mix-blend-mode: screen;
  `;
  return el;
};

const calculateSpotlightValues = (radius: number) => ({
  proximity: radius * 0.5,
  fadeDistance: radius * 0.75
});

const updateCardGlowProperties = (card: HTMLElement, mouseX: number, mouseY: number, glow: number, radius: number) => {
  const rect = card.getBoundingClientRect();
  const relativeX = ((mouseX - rect.left) / rect.width) * 100;
  const relativeY = ((mouseY - rect.top) / rect.height) * 100;

  card.style.setProperty('--glow-x', `${relativeX}%`);
  card.style.setProperty('--glow-y', `${relativeY}%`);
  card.style.setProperty('--glow-intensity', glow.toString());
  card.style.setProperty('--glow-radius', `${radius}px`);
};

const ParticleCard = defineComponent({
  name: 'ParticleCard',
  props: {
    disableAnimations: { type: Boolean, default: false },
    particleCount: { type: Number, default: DEFAULT_PARTICLE_COUNT },
    glowColor: { type: String, default: DEFAULT_GLOW_COLOR },
    enableTilt: { type: Boolean, default: true },
    clickEffect: { type: Boolean, default: false },
    enableMagnetism: { type: Boolean, default: false }
  },
  setup(props) {
    const cardRef = ref<HTMLDivElement | null>(null);
    const particlesRef = ref<HTMLDivElement[]>([]);
    const timeoutsRef = ref<number[]>([]);
    const isHoveredRef = ref(false);
    const memoizedParticles = ref<HTMLDivElement[]>([]);
    const particlesInitialized = ref(false);
    const magnetismAnimationRef = ref<gsap.core.Tween | null>(null);

    const initializeParticles = () => {
      if (particlesInitialized.value || !cardRef.value) return;

      const { width, height } = cardRef.value.getBoundingClientRect();
      memoizedParticles.value = Array.from({ length: props.particleCount }, () =>
        createParticleElement(Math.random() * width, Math.random() * height, props.glowColor)
      );
      particlesInitialized.value = true;
    };

    const clearAllParticles = () => {
      // 清理所有定时器
      timeoutsRef.value.forEach(clearTimeout);
      timeoutsRef.value = [];
      
      // 杀死磁力动画
      magnetismAnimationRef.value?.kill();

      // 清理粒子 - 添加更平滑的消失动画
      particlesRef.value.forEach(particle => {
        gsap.killTweensOf(particle); // 先杀死所有相关动画,防止重复
        gsap.to(particle, {
          scale: 0,
          opacity: 0,
          duration: 0.2,
          ease: 'power2.in',
          onComplete: () => {
            if (particle.parentNode) {
              particle.parentNode.removeChild(particle);
            }
          }
        });
      });
      particlesRef.value = [];
    };

    const animateParticles = () => {
      if (!cardRef.value || !isHoveredRef.value) return;

      // 防止重复初始化
      if (!particlesInitialized.value) {
        initializeParticles();
      }

      // 清理之前可能存在的粒子,避免重复
      if (particlesRef.value.length > 0) {
        return;
      }

      memoizedParticles.value.forEach((particle, index) => {
        const timeoutId = setTimeout(() => {
          if (!isHoveredRef.value || !cardRef.value) return;

          const clone = particle.cloneNode(true) as HTMLDivElement;
          cardRef.value.appendChild(clone);
          particlesRef.value.push(clone);

          // 入场动画 - 从中心向外扩散
          gsap.fromTo(clone, 
            { 
              scale: 0, 
              opacity: 0,
              x: 0,
              y: 0
            }, 
            { 
              scale: 1, 
              opacity: 1, 
              duration: 0.4, 
              ease: 'back.out(2)' 
            }
          );

          // 漂浮动画 - 更优雅的轨迹
          const angle = (index / memoizedParticles.value.length) * Math.PI * 2;
          const radius = 40 + Math.random() * 30;
          
          gsap.to(clone, {
            x: Math.cos(angle) * radius + (Math.random() - 0.5) * 20,
            y: Math.sin(angle) * radius + (Math.random() - 0.5) * 20,
            rotation: Math.random() * 360,
            duration: 3 + Math.random() * 2,
            ease: 'sine.inOut',
            repeat: -1,
            yoyo: true
          });

          // 呼吸闪烁效果
          gsap.to(clone, {
            opacity: 0.4 + Math.random() * 0.3,
            duration: 1 + Math.random() * 0.5,
            ease: 'sine.inOut',
            repeat: -1,
            yoyo: true
          });
        }, index * 60); // 减少延迟,更快出现

        timeoutsRef.value.push(timeoutId);
      });
    };

    let cleanupEventListeners: (() => void) | null = null;
    const setupEventListeners = () => {
      if (props.disableAnimations || !cardRef.value) return;

      const element = cardRef.value;
      let isAnimating = false; // 防止动画重复触发

      const handleMouseEnter = () => {
        if (isAnimating) return;
        isAnimating = true;
        isHoveredRef.value = true;
        
        // 清理可能存在的旧粒子
        clearAllParticles();
        
        // 启动粒子动画
        animateParticles();

        // 悬浮上升效果 - 更明显
        gsap.to(element, { 
          y: -8, 
          scale: 1.02,
          duration: 0.4, 
          ease: 'power2.out' 
        });

        // 形状变化 - 添加圆角动画
        gsap.to(element, {
          borderRadius: '32px',
          duration: 0.4,
          ease: 'power2.out'
        });

        if (props.enableTilt) {
          gsap.to(element, {
            rotateX: 2,
            rotateY: 2,
            duration: 0.4,
            ease: 'power2.out',
            transformPerspective: 1000
          });
        }

        setTimeout(() => {
          isAnimating = false;
        }, 100);
      };

      const handleMouseLeave = () => {
        isHoveredRef.value = false;
        clearAllParticles();

        // 恢复原状 - 平滑过渡
        gsap.to(element, {
          y: 0,
          scale: 1,
          borderRadius: '20px', // 恢复原始圆角
          duration: 0.4,
          ease: 'power2.out'
        });

        if (props.enableTilt) {
          gsap.to(element, {
            rotateX: 0,
            rotateY: 0,
            duration: 0.4,
            ease: 'power2.out'
          });
        }

        if (props.enableMagnetism) {
          gsap.to(element, {
            x: 0,
            y: 0,
            duration: 0.4,
            ease: 'power2.out'
          });
        }
      };

      const handleMouseMove = (e: MouseEvent) => {
        if (!props.enableTilt && !props.enableMagnetism) return;

        const rect = element.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        if (props.enableTilt) {
          const rotateX = ((y - centerY) / centerY) * -8; // 增加倾斜角度
          const rotateY = ((x - centerX) / centerX) * 8;

          gsap.to(element, {
            rotateX,
            rotateY,
            duration: 0.2,
            ease: 'power2.out',
            transformPerspective: 1000
          });
        }

        if (props.enableMagnetism) {
          const magnetX = (x - centerX) * 0.08; // 增强磁力效果
          const magnetY = (y - centerY) * 0.08;

          if (magnetismAnimationRef.value) {
            magnetismAnimationRef.value.kill();
          }
          
          magnetismAnimationRef.value = gsap.to(element, {
            x: magnetX,
            y: magnetY - 8, // 保持悬浮状态
            duration: 0.3,
            ease: 'power2.out'
          });
        }
      };

      const handleClick = (e: MouseEvent) => {
        if (!props.clickEffect) return;

        const rect = element.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // 脉冲缩放效果
        gsap.to(element, {
          scale: 0.95,
          duration: 0.1,
          ease: 'power2.out',
          onComplete: () => {
            gsap.to(element, {
              scale: 1.02,
              duration: 0.3,
              ease: 'elastic.out(1, 0.5)'
            });
          }
        });

        const maxDistance = Math.max(
          Math.hypot(x, y),
          Math.hypot(x - rect.width, y),
          Math.hypot(x, y - rect.height),
          Math.hypot(x - rect.width, y - rect.height)
        );

        // 创建多层涟漪效果
        for (let i = 0; i < 3; i++) {
          setTimeout(() => {
            const ripple = document.createElement('div');
            ripple.style.cssText = `
              position: absolute;
              width: ${maxDistance * 2}px;
              height: ${maxDistance * 2}px;
              border-radius: 50%;
              background: radial-gradient(circle, rgba(${props.glowColor}, ${0.5 - i * 0.15}) 0%, rgba(${props.glowColor}, ${0.25 - i * 0.1}) 20%, transparent 60%);
              left: ${x - maxDistance}px;
              top: ${y - maxDistance}px;
              pointer-events: none;
              z-index: 1000;
              mix-blend-mode: screen;
            `;

            element.appendChild(ripple);

            gsap.fromTo(
              ripple,
              {
                scale: 0,
                opacity: 1
              },
              {
                scale: 1,
                opacity: 0,
                duration: 1 + i * 0.2,
                ease: 'power2.out',
                onComplete: () => ripple.remove()
              }
            );
          }, i * 100);
        }
      };

      element.addEventListener('mouseenter', handleMouseEnter);
      element.addEventListener('mouseleave', handleMouseLeave);
      element.addEventListener('mousemove', handleMouseMove);
      element.addEventListener('click', handleClick);

      cleanupEventListeners = () => {
        isHoveredRef.value = false;
        element.removeEventListener('mouseenter', handleMouseEnter);
        element.removeEventListener('mouseleave', handleMouseLeave);
        element.removeEventListener('mousemove', handleMouseMove);
        element.removeEventListener('click', handleClick);
        clearAllParticles();
      };
    };

    onMounted(() => {
      nextTick(() => {
        setupEventListeners();
      });
    });

    onUnmounted(() => {
      cleanupEventListeners?.();
    });

    watch(
      () => [
        animateParticles,
        clearAllParticles,
        props.disableAnimations,
        props.enableTilt,
        props.enableMagnetism,
        props.clickEffect,
        props.glowColor
      ],
      () => {
        cleanupEventListeners?.();
        setupEventListeners();
      },
      { deep: true }
    );

    return {
      cardRef
    };
  },
  template: `
    <div
      ref="cardRef"
      class="relative overflow-hidden"
      :style="{ position: 'relative', overflow: 'hidden' }"
    >
      <slot />
    </div>
  `
});

const GlobalSpotlight = defineComponent({
  name: 'GlobalSpotlight',
  props: {
    gridRef: { type: [Object, null] as PropType<HTMLDivElement | null>, required: true },
    disableAnimations: { type: Boolean, default: false },
    enabled: { type: Boolean, default: true },
    spotlightRadius: { type: Number, default: DEFAULT_SPOTLIGHT_RADIUS },
    glowColor: { type: String, default: DEFAULT_GLOW_COLOR }
  },
  setup(props) {
    const spotlightRef = ref<HTMLDivElement | null>(null);
    const isInsideSection = ref(false);

    let cleanupEventListeners: (() => void) | null = null;
    const setupEventListeners = () => {
      if (props.disableAnimations || !props.gridRef || !props.enabled) return;

      const spotlight = document.createElement('div');
      spotlight.className = 'global-spotlight';
      spotlight.style.cssText = `
        position: fixed;
        width: 800px;
        height: 800px;
        border-radius: 50%;
        pointer-events: none;
        background: radial-gradient(circle,
          rgba(${props.glowColor}, 0.15) 0%,
          rgba(${props.glowColor}, 0.08) 15%,
          rgba(${props.glowColor}, 0.04) 25%,
          rgba(${props.glowColor}, 0.02) 40%,
          rgba(${props.glowColor}, 0.01) 65%,
          transparent 70%
        );
        z-index: 200;
        opacity: 0;
        transform: translate(-50%, -50%);
        mix-blend-mode: screen;
      `;
      document.body.appendChild(spotlight);
      spotlightRef.value = spotlight;

      const handleMouseMove = (e: MouseEvent) => {
        if (!spotlightRef.value || !props.gridRef) return;

        const section = props.gridRef.closest('.bento-section');
        const rect = section?.getBoundingClientRect();
        const mouseInside =
          rect &&
          e.clientX >= rect.left &&
          e.clientX <= rect.right &&
          e.clientY >= rect.top &&
          e.clientY <= rect.bottom;

        isInsideSection.value = mouseInside || false;
        const cards = props.gridRef.querySelectorAll('.card') as NodeListOf<HTMLDivElement>;

        if (!mouseInside) {
          gsap.to(spotlightRef.value, {
            opacity: 0,
            duration: 0.3,
            ease: 'power2.out'
          });
          cards.forEach(card => {
            card.style.setProperty('--glow-intensity', '0');
          });
          return;
        }

        const { proximity, fadeDistance } = calculateSpotlightValues(props.spotlightRadius);
        let minDistance = Infinity;

        cards.forEach(card => {
          const cardRect = card.getBoundingClientRect();
          const centerX = cardRect.left + cardRect.width / 2;
          const centerY = cardRect.top + cardRect.height / 2;
          const distance =
            Math.hypot(e.clientX - centerX, e.clientY - centerY) - Math.max(cardRect.width, cardRect.height) / 2;
          const effectiveDistance = Math.max(0, distance);

          minDistance = Math.min(minDistance, effectiveDistance);

          let glowIntensity = 0;
          if (effectiveDistance <= proximity) {
            glowIntensity = 1;
          } else if (effectiveDistance <= fadeDistance) {
            glowIntensity = (fadeDistance - effectiveDistance) / (fadeDistance - proximity);
          }

          updateCardGlowProperties(card, e.clientX, e.clientY, glowIntensity, props.spotlightRadius);
        });

        gsap.to(spotlightRef.value, {
          left: e.clientX,
          top: e.clientY,
          duration: 0.1,
          ease: 'power2.out'
        });

        const targetOpacity =
          minDistance <= proximity
            ? 0.8
            : minDistance <= fadeDistance
              ? ((fadeDistance - minDistance) / (fadeDistance - proximity)) * 0.8
              : 0;

        gsap.to(spotlightRef.value, {
          opacity: targetOpacity,
          duration: targetOpacity > 0 ? 0.2 : 0.5,
          ease: 'power2.out'
        });
      };

      const handleMouseLeave = () => {
        isInsideSection.value = false;
        (props.gridRef?.querySelectorAll('.card') as NodeListOf<HTMLDivElement>).forEach(card => {
          card.style.setProperty('--glow-intensity', '0');
        });
        if (spotlightRef.value) {
          gsap.to(spotlightRef.value, {
            opacity: 0,
            duration: 0.3,
            ease: 'power2.out'
          });
        }
      };

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseleave', handleMouseLeave);

      cleanupEventListeners = () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseleave', handleMouseLeave);
        spotlightRef.value?.parentNode?.removeChild(spotlightRef.value);
      };
    };

    onMounted(() => {
      nextTick(() => {
        setupEventListeners();
      });
    });

    onUnmounted(() => {
      cleanupEventListeners?.();
      cleanupEventListeners = null;
    });

    watch(
      () => props,
      () => {
        if (props.gridRef) {
          cleanupEventListeners?.();
          setupEventListeners();
        }
      },
      { deep: true }
    );
  },
  template: `<div></div>`
});

const BentoCardGrid = defineComponent({
  name: 'BentoCardGrid',
  props: {
    gridRef: {
      type: Function as PropType<(el: HTMLDivElement | null) => void>,
      required: true
    }
  },
  template: `
    <div
      class="relative gap-2 grid p-3 select-none bento-section"
      :style="{ fontSize: 'clamp(1rem, 0.9rem + 0.5vw, 1.5rem)' }"
      :ref="gridRef"
    >
      <slot />
    </div>
  `
});

const useMobileDetection = () => {
  const isMobile = ref(false);

  const checkMobile = () => {
    isMobile.value = window.innerWidth <= MOBILE_BREAKPOINT;
  };

  onMounted(() => {
    checkMobile();
    window.addEventListener('resize', checkMobile);

    onUnmounted(() => {
      window.removeEventListener('resize', checkMobile);
    });
  });

  return isMobile;
};

const props = withDefaults(defineProps<BentoProps>(), {
  cards: () => [],
  textAutoHide: true,
  enableStars: true,
  enableSpotlight: true,
  enableBorderGlow: true,
  disableAnimations: false,
  spotlightRadius: DEFAULT_SPOTLIGHT_RADIUS,
  particleCount: DEFAULT_PARTICLE_COUNT,
  enableTilt: false,
  glowColor: DEFAULT_GLOW_COLOR,
  clickEffect: true,
  enableMagnetism: true
});

const gridRef = ref<HTMLDivElement | null>(null);
const isMobile = useMobileDetection();
const cardElements = ref<HTMLDivElement[]>([]);

const shouldDisableAnimations = computed(() => props.disableAnimations || isMobile.value);
const baseClassName = computed(() => {
  return `card flex flex-col justify-between relative aspect-[4/3] min-h-[200px] w-full max-w-full p-5 rounded-[20px] border-2 border-solid font-light overflow-hidden transition-all duration-500 ease-out ${
    props.enableBorderGlow ? 'card--border-glow card--advanced' : ''
  }`;
});
const getCardStyle = (card: BentoCardProps) => ({
  backgroundColor: card.color || 'var(--background-dark)',
  borderColor: 'rgba(132, 0, 255, 0.3)',
  color: 'var(--white)',
  '--glow-x': '50%',
  '--glow-y': '50%',
  '--glow-intensity': '0',
  '--glow-radius': '200px',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
  backdropFilter: 'blur(10px)'
});

const setupCardRef = (el: HTMLDivElement | null, index: number) => {
  if (!el) return;
  cardElements.value[index] = el;
  
  let isAnimating = false;

  const handleMouseEnter = () => {
    if (shouldDisableAnimations.value || isAnimating) return;
    isAnimating = true;
    
    // 高级悬浮效果
    gsap.to(el, { 
      y: -8, 
      scale: 1.02,
      borderRadius: '32px',
      boxShadow: '0 12px 40px rgba(132, 0, 255, 0.4), 0 0 80px rgba(132, 0, 255, 0.2)',
      duration: 0.4, 
      ease: 'power2.out',
      onComplete: () => {
        isAnimating = false;
      }
    });
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (shouldDisableAnimations.value) return;

    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    if (props.enableTilt) {
      const rotateX = ((y - centerY) / centerY) * -8;
      const rotateY = ((x - centerX) / centerX) * 8;

      gsap.to(el, {
        rotateX,
        rotateY,
        duration: 0.2,
        ease: 'power2.out',
        transformPerspective: 1000
      });
    }

    if (props.enableMagnetism) {
      const magnetX = (x - centerX) * 0.08;
      const magnetY = (y - centerY) * 0.08;

      gsap.to(el, {
        x: magnetX,
        y: magnetY - 8,
        duration: 0.3,
        ease: 'power2.out'
      });
    }
  };

  const handleMouseLeave = () => {
    if (shouldDisableAnimations.value) return;

    // 恢复原状
    gsap.to(el, {
      y: 0,
      x: 0,
      scale: 1,
      borderRadius: '20px',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
      duration: 0.4,
      ease: 'power2.out'
    });

    if (props.enableTilt) {
      gsap.to(el, {
        rotateX: 0,
        rotateY: 0,
        duration: 0.4,
        ease: 'power2.out'
      });
    }
  };

  const handleClick = (e: MouseEvent) => {
    if (!props.clickEffect || shouldDisableAnimations.value) return;

    // 点击脉冲效果
    gsap.to(el, {
      scale: 0.95,
      duration: 0.1,
      ease: 'power2.out',
      onComplete: () => {
        gsap.to(el, {
          scale: 1.02,
          duration: 0.3,
          ease: 'elastic.out(1, 0.5)'
        });
      }
    });

    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const maxDistance = Math.max(
      Math.hypot(x, y),
      Math.hypot(x - rect.width, y),
      Math.hypot(x, y - rect.height),
      Math.hypot(x - rect.width, y - rect.height)
    );

    // 多层涟漪
    for (let i = 0; i < 2; i++) {
      setTimeout(() => {
        const ripple = document.createElement('div');
        ripple.style.cssText = `
          position: absolute;
          width: ${maxDistance * 2}px;
          height: ${maxDistance * 2}px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(${props.glowColor}, ${0.4 - i * 0.15}) 0%, rgba(${props.glowColor}, ${0.2 - i * 0.1}) 20%, transparent 60%);
          left: ${x - maxDistance}px;
          top: ${y - maxDistance}px;
          pointer-events: none;
          z-index: 1000;
          mix-blend-mode: screen;
        `;

        el.appendChild(ripple);

        gsap.fromTo(
          ripple,
          { scale: 0, opacity: 1 },
          {
            scale: 1,
            opacity: 0,
            duration: 0.8 + i * 0.2,
            ease: 'power2.out',
            onComplete: () => ripple.remove()
          }
        );
      }, i * 80);
    }
  };

  el.addEventListener('mouseenter', handleMouseEnter);
  el.addEventListener('mousemove', handleMouseMove);
  el.addEventListener('mouseleave', handleMouseLeave);
  el.addEventListener('click', handleClick);
};
</script>

<template>
  <GlobalSpotlight
    v-if="enableSpotlight"
    :grid-ref="gridRef"
    :disable-animations="shouldDisableAnimations"
    :enabled="enableSpotlight"
    :spotlight-radius="spotlightRadius"
    :glow-color="glowColor"
  />

  <BentoCardGrid
    :grid-ref="
      (el: HTMLDivElement | null) => {
        gridRef = el;
      }
    "
  >
    <div class="gap-2 grid card-responsive">
      <template v-for="(card, index) in cards" :key="index">
        <ParticleCard
          v-if="enableStars"
          :class="baseClassName"
          :style="getCardStyle(card)"
          :disable-animations="shouldDisableAnimations"
          :particle-count="particleCount"
          :glow-color="glowColor"
          :enable-tilt="enableTilt"
          :click-effect="clickEffect"
          :enable-magnetism="enableMagnetism"
        >
          <div class="relative flex justify-between gap-3 text-white card__header">
            <span class="text-base card__label">{{ card.label }}</span>
          </div>
          <div class="relative flex flex-col text-white card__content">
            <h3 :class="`card__title font-normal text-base m-0 mb-1 ${textAutoHide ? 'text-clamp-1' : ''}`">
              {{ card.title }}
            </h3>
            <p :class="`card__description text-xs leading-5 opacity-90 ${textAutoHide ? 'text-clamp-2' : ''}`">
              {{ card.description }}
            </p>
          </div>
        </ParticleCard>

        <div
          v-else
          :class="baseClassName"
          :style="getCardStyle(card)"
          :ref="el => setupCardRef(el as HTMLDivElement, index)"
        >
          <div class="relative flex justify-between gap-3 text-white card__header">
            <span class="text-base card__label">{{ card.label }}</span>
          </div>
          <div class="relative flex flex-col text-white card__content">
            <h3 :class="`card__title font-normal text-base m-0 mb-1 ${textAutoHide ? 'text-clamp-1' : ''}`">
              {{ card.title }}
            </h3>
            <p :class="`card__description text-xs leading-5 opacity-90 ${textAutoHide ? 'text-clamp-2' : ''}`">
              {{ card.description }}
            </p>
          </div>
        </div>
      </template>
    </div>
  </BentoCardGrid>
</template>

<style>
.bento-section {
  --glow-x: 50%;
  --glow-y: 50%;
  --glow-intensity: 0;
  --glow-radius: 200px;
  --glow-color: v-bind(glowColor);
  --border-color: rgba(132, 0, 255, 0.3);
  --background-dark: #060010;
  --white: hsl(0, 0%, 100%);
}

.card-responsive {
  grid-template-columns: 1fr;
  width: 90%;
  margin: 0 auto;
  padding: 0.5rem;
}

@media (min-width: 600px) {
  .card-responsive {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .card-responsive {
    grid-template-columns: repeat(4, 1fr);
  }

  .card-responsive .card:nth-child(3) {
    grid-column: span 2;
    grid-row: span 2;
  }

  .card-responsive .card:nth-child(4) {
    grid-column: 1 / span 2;
    grid-row: 2 / span 2;
  }

  .card-responsive .card:nth-child(6) {
    grid-column: 4;
    grid-row: 3;
  }
}

/* 高级卡片效果 */
.card--advanced {
  position: relative;
  background: linear-gradient(135deg, rgba(6, 0, 16, 0.95) 0%, rgba(12, 0, 24, 0.9) 100%);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  transform-style: preserve-3d;
  will-change: transform, box-shadow, border-radius;
}

/* 卡片内部光晕 */
.card--advanced::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: radial-gradient(
    circle at var(--glow-x) var(--glow-y),
    rgba(132, 0, 255, 0.15) 0%,
    transparent 60%
  );
  opacity: 0;
  transition: opacity 0.4s ease;
  pointer-events: none;
  z-index: 0;
}

.card--advanced:hover::before {
  opacity: 1;
}

/* 边框发光 - 增强版 */
.card--border-glow::after {
  content: '';
  position: absolute;
  inset: -2px;
  padding: 2px;
  background: radial-gradient(
    var(--glow-radius) circle at var(--glow-x) var(--glow-y),
    rgba(v-bind(glowColor), calc(var(--glow-intensity) * 1)) 0%,
    rgba(v-bind(glowColor), calc(var(--glow-intensity) * 0.6)) 20%,
    rgba(v-bind(glowColor), calc(var(--glow-intensity) * 0.3)) 40%,
    transparent 70%
  );
  border-radius: inherit;
  mask:
    linear-gradient(#fff 0 0) content-box,
    linear-gradient(#fff 0 0);
  mask-composite: subtract;
  -webkit-mask:
    linear-gradient(#fff 0 0) content-box,
    linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  pointer-events: none;
  transition: opacity 0.4s ease;
  z-index: 2;
  filter: blur(1px);
}

.card--border-glow:hover::after {
  opacity: 1;
}

/* 悬浮时的高级阴影 */
.card--advanced:hover {
  box-shadow:
    0 12px 40px rgba(132, 0, 255, 0.4),
    0 0 80px rgba(132, 0, 255, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
}

/* 粒子增强效果 */
.particle {
  animation: particle-pulse 2s ease-in-out infinite;
}

@keyframes particle-pulse {
  0%, 100% {
    transform: scale(1);
    filter: blur(0.5px);
  }
  50% {
    transform: scale(1.2);
    filter: blur(0.8px);
  }
}

.particle::before {
  content: '';
  position: absolute;
  top: -4px;
  left: -4px;
  right: -4px;
  bottom: -4px;
  background: radial-gradient(circle, rgba(v-bind(glowColor), 0.3) 0%, transparent 70%);
  border-radius: 50%;
  z-index: -1;
  animation: particle-glow 1.5s ease-in-out infinite alternate;
}

@keyframes particle-glow {
  from {
    opacity: 0.5;
    transform: scale(1);
  }
  to {
    opacity: 1;
    transform: scale(1.3);
  }
}

/* 卡片标签美化 */
.card__label {
  background: linear-gradient(135deg, rgba(132, 0, 255, 0.2) 0%, rgba(132, 0, 255, 0.1) 100%);
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  border: 1px solid rgba(132, 0, 255, 0.3);
  font-weight: 500;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  font-size: 0.7rem;
  backdrop-filter: blur(5px);
  transition: all 0.3s ease;
}

.card:hover .card__label {
  background: linear-gradient(135deg, rgba(132, 0, 255, 0.4) 0%, rgba(132, 0, 255, 0.2) 100%);
  border-color: rgba(132, 0, 255, 0.6);
  box-shadow: 0 0 20px rgba(132, 0, 255, 0.4);
}

/* 卡片标题增强 */
.card__title {
  text-shadow: 0 2px 10px rgba(132, 0, 255, 0.3);
  transition: text-shadow 0.3s ease;
}

.card:hover .card__title {
  text-shadow: 0 2px 20px rgba(132, 0, 255, 0.6);
}

/* 文本省略 */
.text-clamp-1 {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  line-clamp: 1;
  overflow: hidden;
  text-overflow: ellipsis;
}

.text-clamp-2 {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 移动端优化 */
@media (max-width: 599px) {
  .card-responsive {
    grid-template-columns: 1fr;
    width: 90%;
    margin: 0 auto;
    padding: 0.5rem;
  }

  .card-responsive .card {
    width: 100%;
    min-height: 180px;
  }
  
  .card--advanced {
    backdrop-filter: blur(5px);
  }
}
</style>
