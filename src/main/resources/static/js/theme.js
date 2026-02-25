(function(){
  const STORAGE_KEY = 'theme'; // 'light' | 'dark'

  function systemPref(){
    return (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)
      ? 'dark'
      : 'light';
  }

  function getTheme(){
    const saved = localStorage.getItem(STORAGE_KEY);
    if(saved === 'light' || saved === 'dark') return saved;
    return systemPref();
  }

  function setTheme(theme){
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(STORAGE_KEY, theme);
    updateButton(theme);
  }

  function toggleTheme(){
    const current = document.documentElement.getAttribute('data-theme') || 'light';
    setTheme(current === 'dark' ? 'light' : 'dark');
  }

  function updateButton(theme){
    const btn = document.querySelector('[data-theme-toggle]');
    if(!btn) return;
    btn.setAttribute('aria-pressed', theme === 'dark' ? 'true' : 'false');
    btn.textContent = theme === 'dark' ? '🌙 Dark' : '☀️ Light';
  }

  document.addEventListener('DOMContentLoaded', () => {
    setTheme(getTheme());

    const btn = document.querySelector('[data-theme-toggle]');
    if(btn) btn.addEventListener('click', toggleTheme);
  });

  // Wenn User nichts gespeichert hat, Systemwechsel übernehmen
  const mq = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;
  if(mq){
    mq.addEventListener('change', () => {
      const saved = localStorage.getItem(STORAGE_KEY);
      if(!saved) setTheme(systemPref());
    });
  }

  window.Theme = { setTheme, toggleTheme };
})();
