/* Berlin Reveal — Scroll-triggered animation system
   Intersection Observer + staggered reveals */

(function () {
  'use strict';

  var REVEAL_CLASS = 'bm-reveal';
  var ACTIVE_CLASS = 'bm-revealed';
  var STAGGER_CLASS = 'bm-stagger';

  function init() {
    if (!('IntersectionObserver' in window)) {
      document.querySelectorAll('.' + REVEAL_CLASS).forEach(function (el) {
        el.classList.add(ACTIVE_CLASS);
      });
      return;
    }

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var el = entry.target;
            el.classList.add(ACTIVE_CLASS);

            // Stagger children if parent has stagger class
            if (el.classList.contains(STAGGER_CLASS)) {
              var children = el.querySelectorAll('.' + REVEAL_CLASS);
              children.forEach(function (child, i) {
                child.style.transitionDelay = (i * 0.12) + 's';
                child.classList.add(ACTIVE_CLASS);
              });
            }

            observer.unobserve(el);
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: '0px 0px -40px 0px'
      }
    );

    document.querySelectorAll('.' + REVEAL_CLASS + ', .' + STAGGER_CLASS).forEach(function (el) {
      observer.observe(el);
    });
  }

  // Smooth scroll indicator click
  var scrollIndicator = document.querySelector('[data-scroll-indicator]');
  if (scrollIndicator) {
    scrollIndicator.addEventListener('click', function () {
      var hero = document.querySelector('.video-hero');
      if (hero) {
        var nextSection = hero.nextElementSibling;
        if (nextSection) {
          nextSection.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  }

  // Parallax-lite for hero on scroll
  var heroContent = document.querySelector('.video-hero__content');
  if (heroContent && window.matchMedia('(min-width: 750px)').matches) {
    var ticking = false;
    window.addEventListener('scroll', function () {
      if (!ticking) {
        window.requestAnimationFrame(function () {
          var scrollY = window.pageYOffset;
          if (scrollY < window.innerHeight) {
            heroContent.style.transform = 'translateY(' + (scrollY * 0.25) + 'px)';
            heroContent.style.opacity = 1 - (scrollY / (window.innerHeight * 0.8));
          }
          ticking = false;
        });
        ticking = true;
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
