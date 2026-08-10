async function startEleva() {
  const response = await fetch('./app.js?period-fix=v3', { cache: 'no-store' });
  if (!response.ok) throw new Error(`Falha ao carregar o Eleva: ${response.status}`);

  let source = await response.text();

  const oldPeriodLogic = "function currentPeriod(){const n=new Date(),now=n.getHours()*60+n.getMinutes(),morning=minutesOf(state.morning),night=minutesOf(state.night),mid=morning<night?Math.round((morning+night)/2):900;return now<mid?'morning':'night'}";
  const newPeriodLogic = "function currentPeriod(){const n=new Date(),now=n.getHours()*60+n.getMinutes(),night=minutesOf(state.night);return now<night?'morning':'night'}";

  if (!source.includes(oldPeriodLogic)) {
    console.warn('Eleva: lógica de período já foi alterada ou não corresponde à versão esperada.');
  } else {
    source = source.replace(oldPeriodLogic, newPeriodLogic);
  }

  const blob = new Blob([source], { type: 'text/javascript' });
  const moduleUrl = URL.createObjectURL(blob);

  try {
    await import(moduleUrl);
  } finally {
    URL.revokeObjectURL(moduleUrl);
  }
}

startEleva().catch((error) => {
  console.error(error);
  const app = document.querySelector('#app');
  if (app) {
    app.innerHTML = '<main class="screen"><section class="list-card"><h1>Não foi possível iniciar o Eleva.</h1><p>Atualize a página e tente novamente.</p></section></main>';
  }
});
