const themeButton = document.querySelector('.theme-toggle');
const themeLabel = document.querySelector('.theme-label');
const systemTheme = window.matchMedia('(prefers-color-scheme: dark)');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

function updateThemeButton() {
  const theme = document.documentElement.dataset.theme;
  const isDark = theme ? theme === 'dark' : systemTheme.matches;
  const label = isDark ? 'Switch to light mode' : 'Switch to dark mode';
  themeButton.setAttribute('aria-label', label);
  themeButton.setAttribute('title', label);
  themeLabel.textContent = label;
}

themeButton.hidden = false;
updateThemeButton();

themeButton.addEventListener('click', () => {
  const currentTheme = document.documentElement.dataset.theme;
  const isDark = currentTheme ? currentTheme === 'dark' : systemTheme.matches;
  const nextTheme = isDark ? 'light' : 'dark';
  document.documentElement.dataset.theme = nextTheme;
  try {
    localStorage.setItem('theme', nextTheme);
  } catch (error) { /* Theme switching still works without persistent storage. */ }
  updateThemeButton();
});

systemTheme.addEventListener('change', updateThemeButton);

if ('IntersectionObserver' in window && !reducedMotion.matches) {
  const sections = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.remove('is-pending');
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });

  sections.forEach((section) => {
    section.classList.add('is-pending');
    observer.observe(section);
  });

  reducedMotion.addEventListener('change', (event) => {
    if (event.matches) {
      observer.disconnect();
      sections.forEach((section) => section.classList.remove('is-pending'));
    }
  });
}
