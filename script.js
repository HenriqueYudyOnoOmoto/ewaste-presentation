/**
 * MINERAÇÃO URBANA E O LIXO ELETRÔNICO
 * Navegação Suave Scroll-Snap e Teclado
 */

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('slidesContainer');
  const sections = Array.from(document.querySelectorAll('.slide-section'));

  if (!container || sections.length === 0) return;

  let currentActiveIndex = 0;

  // 1. Rolar para slide específico
  function scrollToSlide(index) {
    if (index < 0) index = 0;
    if (index >= sections.length) index = sections.length - 1;
    sections[index].scrollIntoView({ behavior: 'smooth' });
  }

  // 2. Rastrear slide ativo via IntersectionObserver
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        currentActiveIndex = sections.indexOf(entry.target);
      }
    });
  }, {
    root: container,
    threshold: 0.55
  });

  sections.forEach(section => observer.observe(section));

  // 3. Navegação por Teclado
  document.addEventListener('keydown', (e) => {
    switch (e.key) {
      case 'ArrowDown':
      case 'ArrowRight':
      case ' ':
      case 'PageDown':
        e.preventDefault();
        scrollToSlide(currentActiveIndex + 1);
        break;

      case 'ArrowUp':
      case 'ArrowLeft':
      case 'PageUp':
        e.preventDefault();
        scrollToSlide(currentActiveIndex - 1);
        break;

      case 'Home':
        e.preventDefault();
        scrollToSlide(0);
        break;

      case 'End':
        e.preventDefault();
        scrollToSlide(sections.length - 1);
        break;

      case 'f':
      case 'F':
        e.preventDefault();
        if (!document.fullscreenElement) {
          document.documentElement.requestFullscreen().catch(() => {});
        } else {
          document.exitFullscreen();
        }
        break;
    }
  });

  // 4. Escala Baseada Exclusivamente na Proporção de Tela (16:9, 4:3, Retrato)
  // Independe da resolução (FHD, QHD, 4K têm exatamente a mesma aparência)
  function updateAspectRatioScaling() {
    const w = window.innerWidth || document.documentElement.clientWidth || 1200;
    const h = window.innerHeight || document.documentElement.clientHeight || 675;
    if (h <= 0) return;

    const ratio = w / h;

    let baseW, baseH, aspectMode;

    if (ratio >= 1.5) {
      // Proporção Widescreen (16:9, 16:10, 18:9, 21:9...)
      baseW = 1200;
      baseH = 675;
      aspectMode = '16-9';
    } else if (ratio >= 1.0) {
      // Proporção Clássica / Standard (4:3, 5:4, 3:2...)
      baseW = 1000;
      baseH = 750;
      aspectMode = '4-3';
    } else {
      // Proporção Vertical / Retrato (Celular em pé: 9:16, 9:19.5...)
      baseW = 440;
      baseH = 780;
      aspectMode = 'portrait';
    }

    document.body.setAttribute('data-aspect', aspectMode);

    // Fator de escala uniforme para enquadrar na proporção da tela
    const rawScale = Math.min((w * 0.96) / baseW, (h * 0.96) / baseH);
    const scale = Math.max(0.1, Number.isFinite(rawScale) ? rawScale : 1);

    document.documentElement.style.setProperty('--scale', scale.toFixed(4));
    document.documentElement.style.setProperty('--base-w', baseW + 'px');
    document.documentElement.style.setProperty('--base-h', baseH + 'px');
  }

  // Throttle com requestAnimationFrame para evitar recalculos repetidos de layout
  let resizePending = false;
  function onWindowResize() {
    if (!resizePending) {
      resizePending = true;
      requestAnimationFrame(() => {
        updateAspectRatioScaling();
        resizePending = false;
      });
    }
  }

  window.addEventListener('resize', onWindowResize);
  window.addEventListener('orientationchange', onWindowResize);
  updateAspectRatioScaling();
});
