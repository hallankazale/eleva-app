const STORAGE_KEY = 'eleva-state-v1';

const defaultState = {
  onboarded: false,
  onboardingStep: 0,
  goals: ['prosperidade'],
  morning: '07:00',
  night: '21:30',
  favorite: false,
  actionDone: false,
  streak: 1,
  completedDays: 1,
  activeTab: 'home',
};

const affirmations = {
  prosperidade: {
    label: 'Prosperidade',
    text: 'Eu desenvolvo sabedoria para reconhecer oportunidades e transformar boas ideias em ações consistentes.',
    action: 'Revise hoje uma pequena despesa e escolha uma melhoria financeira possível para esta semana.'
  },
  saude: {
    label: 'Saúde e bem-estar',
    text: 'Eu escolho cuidar do meu corpo com respeito, equilíbrio e constância, um passo de cada vez.',
    action: 'Faça hoje uma escolha simples a favor do seu bem-estar: água, movimento, descanso ou alimentação equilibrada.'
  },
  confianca: {
    label: 'Autoconfiança',
    text: 'Eu posso aprender, ajustar o caminho e continuar avançando mesmo quando algo não sai perfeito.',
    action: 'Anote uma decisão que você vem adiando e dê o menor primeiro passo possível hoje.'
  },
  motivacao: {
    label: 'Motivação',
    text: 'Eu não preciso esperar o momento perfeito para começar; progresso nasce de ações pequenas e repetidas.',
    action: 'Escolha uma tarefa de até 10 minutos e conclua antes de começar outra.'
  },
  gratidao: {
    label: 'Gratidão',
    text: 'Eu reconheço o que já existe de bom sem deixar de construir o que ainda quero viver.',
    action: 'Registre três coisas simples que foram boas hoje.'
  },
  fe: {
    label: 'Fé',
    text: 'Eu entrego minhas preocupações a Deus e sigo com fé, sabedoria e coragem para fazer minha parte.',
    action: 'Separe alguns minutos para oração, silêncio e uma decisão prática coerente com aquilo que você acredita.'
  },
};

const goalOptions = [
  ['prosperidade', '💰', 'Prosperidade', 'Foco, disciplina e decisões financeiras melhores'],
  ['saude', '🌿', 'Saúde e bem-estar', 'Autocuidado, equilíbrio e constância'],
  ['confianca', '⚡', 'Autoconfiança', 'Mais segurança para agir e se posicionar'],
  ['motivacao', '🎯', 'Motivação', 'Ação, foco e continuidade'],
  ['gratidao', '✨', 'Gratidão', 'Presença e percepção do que já funciona'],
  ['fe', '🙏', 'Fé', 'Reflexões espirituais com linguagem cristã'],
];

function loadState() {
  try {
    return { ...defaultState, ...JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}') };
  } catch {
    return { ...defaultState };
  }
}

let state = loadState();
const app = document.querySelector('#app');

function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function setState(patch) {
  state = { ...state, ...patch };
  save();
  render();
}

function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, (char) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#039;', '"': '&quot;'
  }[char]));
}

function dateLabel() {
  return new Intl.DateTimeFormat('pt-BR', {
    weekday: 'long', day: '2-digit', month: 'long'
  }).format(new Date());
}

function greeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Bom dia';
  if (hour < 18) return 'Boa tarde';
  return 'Boa noite';
}

function speak(text) {
  if (!('speechSynthesis' in window)) {
    alert('A leitura em voz alta não está disponível neste navegador.');
    return;
  }
  speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'pt-BR';
  utterance.rate = 0.92;
  utterance.pitch = 1;
  speechSynthesis.speak(utterance);
}

function splash() {
  app.innerHTML = `
    <main class="screen splash fade-in">
      <div class="splash-inner">
        <div class="logo-mark">✦</div>
        <h1 class="brand">Eleva</h1>
        <p class="tagline">Fortaleça sua mente.<br>Transforme seu dia.</p>
        <div class="loading-dots" aria-label="Carregando"><span></span><span></span><span></span></div>
      </div>
    </main>`;

  setTimeout(() => {
    if (state.onboarded) {
      render();
    } else {
      state.onboardingStep = 0;
      renderOnboarding();
    }
  }, 1900);
}

const onboarding = [
  { icon: '✨', eyebrow: 'Bem-vindo', title: 'Comece por dentro.', text: 'Pensamentos mais conscientes podem apoiar hábitos, escolhas e decisões melhores no dia a dia.' },
  { icon: '🎧', eyebrow: 'Ouça e respire', title: 'Um momento só seu.', text: 'Escute afirmações narradas pela manhã e à noite, com uma experiência simples e tranquila.' },
  { icon: '✓', eyebrow: 'Palavra + ação', title: 'Não fique apenas na frase.', text: 'Cada momento pode trazer uma pequena ação prática para transformar intenção em comportamento.' },
];

function renderOnboarding() {
  const step = onboarding[state.onboardingStep] || onboarding[0];
  app.innerHTML = `
    <main class="screen fade-in">
      <div class="top-actions">
        <span class="eyebrow">Eleva</span>
        ${state.onboardingStep > 0 ? '<button class="icon-btn" id="backOnboarding" aria-label="Voltar">←</button>' : '<span></span>'}
      </div>
      <section class="slide-up">
        <div class="hero-visual"><span class="hero-icon">${step.icon}</span></div>
        <span class="eyebrow">${step.eyebrow}</span>
        <h1>${step.title}</h1>
        <p class="lead">${step.text}</p>
        <div class="dots">${onboarding.map((_, i) => `<span class="${i === state.onboardingStep ? 'active' : ''}"></span>`).join('')}</div>
        <button class="primary-btn" id="nextOnboarding">${state.onboardingStep === onboarding.length - 1 ? 'COMEÇAR' : 'CONTINUAR'}</button>
      </section>
    </main>`;

  document.querySelector('#nextOnboarding').onclick = () => {
    if (state.onboardingStep < onboarding.length - 1) {
      state.onboardingStep += 1;
      save();
      renderOnboarding();
    } else {
      renderGoals();
    }
  };
  document.querySelector('#backOnboarding')?.addEventListener('click', () => {
    state.onboardingStep = Math.max(0, state.onboardingStep - 1);
    save();
    renderOnboarding();
  });
}

function renderGoals() {
  app.innerHTML = `
    <main class="screen fade-in">
      <span class="eyebrow">Personalização</span>
      <h1>O que você quer fortalecer?</h1>
      <p class="lead">Escolha quantas áreas quiser. Você poderá alterar isso depois.</p>
      <div class="goal-grid">
        ${goalOptions.map(([id, icon, title, subtitle]) => `
          <button class="goal-card ${state.goals.includes(id) ? 'selected' : ''}" data-goal="${id}">
            <span class="goal-icon">${icon}</span>
            <span class="goal-copy"><strong>${title}</strong><small>${subtitle}</small></span>
            <span class="goal-check">✓</span>
          </button>`).join('')}
      </div>
      <div style="height:20px"></div>
      <button class="primary-btn" id="goRoutine" ${state.goals.length ? '' : 'disabled'}>CONTINUAR</button>
    </main>`;

  document.querySelectorAll('[data-goal]').forEach((button) => {
    button.onclick = () => {
      const id = button.dataset.goal;
      const exists = state.goals.includes(id);
      const goals = exists ? state.goals.filter((goal) => goal !== id) : [...state.goals, id];
      if (!goals.length) return;
      setState({ goals });
      renderGoals();
    };
  });
  document.querySelector('#goRoutine').onclick = renderRoutine;
}

function renderRoutine() {
  app.innerHTML = `
    <main class="screen fade-in">
      <span class="eyebrow">Sua rotina</span>
      <h1>Crie seus momentos do dia.</h1>
      <p class="lead">Escolha horários que façam sentido para você. No APK, esses horários serão usados para notificações nativas.</p>

      <div class="time-card">
        <span class="symbol">☀️</span>
        <div><strong>Manhã</strong><div class="date">Comece o dia com intenção.</div></div>
        <input id="morningTime" type="time" value="${escapeHtml(state.morning)}" aria-label="Horário da manhã">
      </div>
      <div class="time-card">
        <span class="symbol">🌙</span>
        <div><strong>Noite</strong><div class="date">Encerre o dia com calma.</div></div>
        <input id="nightTime" type="time" value="${escapeHtml(state.night)}" aria-label="Horário da noite">
      </div>

      <div style="height:18px"></div>
      <button class="primary-btn" id="finishSetup">ENTRAR NO ELEVA</button>
      <p class="notice">As afirmações apoiam foco, bem-estar e hábitos. Elas não substituem cuidados médicos, tratamento profissional nem garantem resultados financeiros.</p>
    </main>`;

  document.querySelector('#finishSetup').onclick = () => {
    setState({
      morning: document.querySelector('#morningTime').value || '07:00',
      night: document.querySelector('#nightTime').value || '21:30',
      onboarded: true,
      activeTab: 'home',
    });
  };
}

function nav(active) {
  return `
    <nav class="bottom-nav" aria-label="Navegação principal">
      <button class="nav-btn ${active === 'home' ? 'active' : ''}" data-tab="home"><span>⌂</span><span>Início</span></button>
      <button class="nav-btn ${active === 'journey' ? 'active' : ''}" data-tab="journey"><span>✦</span><span>Jornada</span></button>
      <button class="nav-btn ${active === 'favorites' ? 'active' : ''}" data-tab="favorites"><span>♡</span><span>Favoritos</span></button>
      <button class="nav-btn ${active === 'profile' ? 'active' : ''}" data-tab="profile"><span>◉</span><span>Perfil</span></button>
    </nav>`;
}

function bindNav() {
  document.querySelectorAll('[data-tab]').forEach((button) => {
    button.onclick = () => setState({ activeTab: button.dataset.tab });
  });
}

function currentAffirmation() {
  const goal = state.goals[0] || 'prosperidade';
  return affirmations[goal] || affirmations.prosperidade;
}

function renderHome() {
  const affirmation = currentAffirmation();
  const progress = Math.min(100, Math.round((state.completedDays / 21) * 100));
  app.innerHTML = `
    <main class="screen fade-in">
      <header class="home-header">
        <div>
          <span class="eyebrow">Seu momento</span>
          <h1>${greeting()} 👋</h1>
          <div class="date">${dateLabel()}</div>
        </div>
        <div class="streak"><strong>🔥 ${state.streak}</strong><small>dias</small></div>
      </header>

      <section class="affirmation-card slide-up">
        <span class="category-pill">${affirmation.label}</span>
        <p class="quote">“${affirmation.text}”</p>
        <div class="card-actions">
          <button class="listen-btn" id="listen">▶ Ouvir</button>
          <button class="round-btn ${state.favorite ? 'active' : ''}" id="favorite" aria-label="Favoritar">${state.favorite ? '♥' : '♡'}</button>
        </div>
      </section>

      <div class="section-title"><h2>Transforme em ação</h2><span class="date">hoje</span></div>
      <section class="action-card ${state.actionDone ? 'completed' : ''}">
        <span class="action-icon">🎯</span>
        <div class="action-copy"><strong>Ação de hoje</strong><p>${affirmation.action}</p></div>
        <button class="check-btn" id="completeAction" aria-label="Concluir ação">${state.actionDone ? '✓' : '○'}</button>
      </section>

      <div class="section-title"><h2>Sua jornada</h2><span class="date">${state.completedDays}/21 dias</span></div>
      <section class="progress-card">
        <div class="progress-row"><span>Jornada de consistência</span><span>${progress}%</span></div>
        <div class="progress-bar"><span style="width:${progress}%"></span></div>
      </section>
      ${nav('home')}
    </main>`;

  document.querySelector('#listen').onclick = () => speak(affirmation.text);
  document.querySelector('#favorite').onclick = () => setState({ favorite: !state.favorite });
  document.querySelector('#completeAction').onclick = () => {
    if (state.actionDone) return setState({ actionDone: false });
    setState({ actionDone: true, completedDays: Math.min(21, state.completedDays + 1), streak: state.streak + 1 });
  };
  bindNav();
}

function renderJourney() {
  const progress = Math.min(100, Math.round((state.completedDays / 21) * 100));
  app.innerHTML = `
    <main class="screen fade-in">
      <span class="eyebrow">Jornada</span>
      <h1>21 dias de consistência.</h1>
      <p class="lead">Uma experiência curta para conectar pensamentos mais úteis com pequenas ações diárias.</p>
      <section class="affirmation-card">
        <span class="category-pill">Progresso</span>
        <p class="quote">Dia ${state.completedDays} de 21</p>
        <div class="progress-bar"><span style="width:${progress}%"></span></div>
      </section>
      <div class="section-title"><h2>Próximos passos</h2></div>
      <div class="list-card"><h3>✓ Afirmação</h3><p>Ouça com atenção e sem pressa.</p></div>
      <div class="list-card"><h3>${state.actionDone ? '✓' : '○'} Ação prática</h3><p>Transforme a frase em uma decisão observável no seu dia.</p></div>
      <div class="list-card"><h3>○ Reflexão noturna</h3><p>Registre mentalmente o que funcionou e o que você quer ajustar amanhã.</p></div>
      ${nav('journey')}
    </main>`;
  bindNav();
}

function renderFavorites() {
  const affirmation = currentAffirmation();
  app.innerHTML = `
    <main class="screen fade-in">
      <span class="eyebrow">Biblioteca</span>
      <h1>Seus favoritos.</h1>
      <p class="lead">Salve frases importantes para ouvir novamente quando quiser.</p>
      ${state.favorite ? `<div class="list-card"><h3>♥ ${affirmation.label}</h3><p>“${affirmation.text}”</p><div style="height:14px"></div><button class="mini-btn" id="playFav">▶ Ouvir</button></div>` : '<div class="list-card"><h3>Nenhuma frase salva ainda</h3><p>Toque no coração da tela inicial para adicionar sua primeira favorita.</p></div>'}
      ${nav('favorites')}
    </main>`;
  document.querySelector('#playFav')?.addEventListener('click', () => speak(affirmation.text));
  bindNav();
}

function renderProfile() {
  app.innerHTML = `
    <main class="screen fade-in">
      <span class="eyebrow">Configurações</span>
      <h1>Seu Eleva.</h1>
      <p class="lead">Ajuste sua experiência sem perder o progresso.</p>
      <section class="list-card">
        <div class="settings-row"><div><strong>☀️ Manhã</strong><div class="date">Momento diário</div></div><span>${escapeHtml(state.morning)}</span></div>
        <div class="settings-row"><div><strong>🌙 Noite</strong><div class="date">Momento diário</div></div><span>${escapeHtml(state.night)}</span></div>
        <div class="settings-row"><div><strong>🎯 Objetivos</strong><div class="date">${state.goals.length} selecionados</div></div><button class="mini-btn" id="editGoals">Editar</button></div>
        <div class="settings-row"><div><strong>↻ Reiniciar introdução</strong><div class="date">Testar splash e onboarding novamente</div></div><button class="mini-btn" id="resetOnboarding">Reiniciar</button></div>
      </section>
      <p class="notice">Versão web inicial. Notificações confiáveis em segundo plano serão implementadas na etapa APK com recursos nativos do Android.</p>
      ${nav('profile')}
    </main>`;
  document.querySelector('#editGoals').onclick = renderGoals;
  document.querySelector('#resetOnboarding').onclick = () => {
    state = { ...defaultState };
    save();
    splash();
  };
  bindNav();
}

function render() {
  if (!state.onboarded) return renderOnboarding();
  if (state.activeTab === 'journey') return renderJourney();
  if (state.activeTab === 'favorites') return renderFavorites();
  if (state.activeTab === 'profile') return renderProfile();
  return renderHome();
}

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => navigator.serviceWorker.register('./sw.js').catch(() => {}));
}

splash();
