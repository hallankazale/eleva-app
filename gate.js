const STORAGE_KEY = 'eleva-state-v2';

function loadSchedule() {
  try {
    const state = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    return {
      morning: state.morning || '07:00',
      night: state.night || '21:30',
    };
  } catch {
    return { morning: '07:00', night: '21:30' };
  }
}

function toMinutes(time) {
  const [hour, minute] = String(time || '00:00').split(':').map(Number);
  return (hour * 60) + minute;
}

function currentMinutes() {
  const now = new Date();
  return (now.getHours() * 60) + now.getMinutes();
}

function getAccessState() {
  const { morning, night } = loadSchedule();
  const now = currentMinutes();
  const morningMinutes = toMinutes(morning);
  const nightMinutes = toMinutes(night);

  if (now < morningMinutes) {
    return {
      locked: true,
      nextLabel: 'momento da manhã',
      nextTime: morning,
      icon: '☀️',
    };
  }

  if (now < nightMinutes) {
    return {
      locked: false,
      active: 'morning',
      nextLabel: 'momento da noite',
      nextTime: night,
      icon: '🌙',
    };
  }

  return {
    locked: false,
    active: 'night',
    nextLabel: 'momento da manhã de amanhã',
    nextTime: morning,
    icon: '☀️',
  };
}

function buildLockCard(access) {
  const card = document.createElement('section');
  card.id = 'eleva-time-lock';
  card.setAttribute('aria-live', 'polite');
  card.style.cssText = [
    'padding:28px 24px',
    'border-radius:30px',
    'background:linear-gradient(145deg,rgba(139,124,255,.22),rgba(50,41,120,.18))',
    'border:1px solid rgba(255,255,255,.14)',
    'box-shadow:0 20px 50px rgba(0,0,0,.24)',
    'text-align:center',
    'position:relative',
    'overflow:hidden'
  ].join(';');

  card.innerHTML = `
    <div style="font-size:42px;margin-bottom:12px">${access.icon}</div>
    <span class="eyebrow">Conteúdo bloqueado</span>
    <h2 style="margin:10px 0 8px;font-size:25px">Seu próximo momento ainda não chegou.</h2>
    <p style="margin:0;color:var(--muted);line-height:1.55">A afirmação será liberada às <strong style="color:var(--text)">${access.nextTime}</strong>. Antes desse horário, a frase e o áudio ficam ocultos.</p>
    <div style="margin-top:18px;padding:12px 14px;border-radius:16px;background:rgba(255,255,255,.07);color:var(--accent);font-weight:700">🔒 Aguarde o ${access.nextLabel}</div>
  `;

  return card;
}

function enforceTimeGate() {
  const home = document.querySelector('.home-header')?.closest('main');
  if (!home) return;

  const access = getAccessState();
  const affirmation = home.querySelector('.affirmation-card');
  const sectionTitles = [...home.querySelectorAll('.section-title')];
  const actionCard = home.querySelector('.action-card');
  let lockCard = home.querySelector('#eleva-time-lock');

  if (access.locked) {
    if (affirmation) affirmation.style.display = 'none';
    if (actionCard) actionCard.style.display = 'none';
    if (sectionTitles[0]) sectionTitles[0].style.display = 'none';

    if (!lockCard && affirmation) {
      lockCard = buildLockCard(access);
      affirmation.insertAdjacentElement('afterend', lockCard);
    }
  } else {
    if (affirmation) affirmation.style.display = '';
    if (actionCard) actionCard.style.display = '';
    if (sectionTitles[0]) sectionTitles[0].style.display = '';
    lockCard?.remove();
  }
}

const observer = new MutationObserver(enforceTimeGate);
observer.observe(document.documentElement, { childList: true, subtree: true });

setInterval(enforceTimeGate, 30_000);
window.addEventListener('focus', enforceTimeGate);
document.addEventListener('visibilitychange', () => {
  if (!document.hidden) enforceTimeGate();
});

enforceTimeGate();
