(function() {
  const THEME_KEY = 'grand_theme';
  const html = document.documentElement;
  const savedTheme = localStorage.getItem(THEME_KEY) || 'dark';
  html.setAttribute('data-theme', savedTheme);

  // Function to toggle theme
  function toggleTheme() {
    const current = html.getAttribute('data-theme');
    const newTheme = current === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem(THEME_KEY, newTheme);
  }

  // Add toggle button to header if not exists
  const header = document.querySelector('.site-header') || document.querySelector('header');
  if (header && !document.getElementById('theme-toggle')) {
    const button = document.createElement('button');
    button.id = 'theme-toggle';
    button.className = 'btn btn-action';
    button.innerHTML = '<i class="ti ti-moon"></i>';
    button.title = 'Toggle Theme';
    button.style.marginLeft = '12px';
    button.addEventListener('click', toggleTheme);
    header.querySelector('.nav')?.appendChild(button) || header.appendChild(button);
  }
})();