(() => {
	'use strict';

	const state = {
		prefersReducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
	};

	const init = () => {
		enhanceSmoothScroll();
		enhanceInteractives();
		document.documentElement.classList.add('js-ready');
	};

	const enhanceSmoothScroll = () => {
		if (state.prefersReducedMotion) return;

		document.documentElement.style.scrollBehavior = 'smooth';

		const anchorLinks = document.querySelectorAll('a[href^="#"]');
		anchorLinks.forEach((link) => {
			link.addEventListener('click', (event) => {
				const targetId = link.getAttribute('href');
				if (!targetId || targetId === '#') return;
				const target = document.querySelector(targetId);
				if (!target) return;
				event.preventDefault();
				target.scrollIntoView({ behavior: 'smooth', block: 'start' });
				target.setAttribute('tabindex', '-1');
				target.focus({ preventScroll: true });
				target.removeAttribute('tabindex');
			});
		});
	};

	const enhanceInteractives = () => {
		const targets = document.querySelectorAll('.btn, .contact-link');
		if (!targets.length) return;

		targets.forEach((target) => {
			const computed = window.getComputedStyle(target);
			if (computed.position === 'static') {
				target.style.position = 'relative';
			}
			target.style.touchAction = 'manipulation';
			target.addEventListener('pointerdown', (event) => {
				if (event.button !== 0) return;
				animatePress(target);
			});
			target.addEventListener('keydown', (event) => {
				if (event.key === 'Enter' || event.key === ' ') {
					animatePress(target);
				}
			});
		});
	};

	const animatePress = (node) => {
		node.animate(
			[
				{ transform: 'scale(1)', filter: 'brightness(1)' },
				{ transform: 'scale(0.97)', filter: 'brightness(0.94)' },
				{ transform: 'scale(1)', filter: 'brightness(1)' },
			],
			{
				duration: 210,
				easing: 'ease-out',
			}
		);
	};

	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', init);
	} else {
		init();
	}
})();
