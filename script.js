(() => {
  const d = document, N = '5522998641962';
  const still = matchMedia('(prefers-reduced-motion: reduce)').matches, hover = matchMedia('(hover: hover)').matches;
  const wa = t => `https://wa.me/${N}?text=${encodeURIComponent(t)}`;

  // Links dos sites no ar: preencha para mostrar o botão "Ver site" em cada trabalho.
  const SITES = { 'lava-jato': '', 'luan': '', 'lyli': '', 'jhony': '', 'navalha': '' };
  d.querySelectorAll('[data-site]').forEach(a => { const u = SITES[a.dataset.site]; if (u) { a.href = u; a.hidden = false; } });

  // WhatsApp: a mensagem já diz de qual trabalho o cliente veio
  d.querySelectorAll('[data-wa]').forEach(a => {
    const t = a.dataset.wa;
    a.href = wa(t ? `Olá! Vi o trabalho "${t}" no pagesagends e quero um orçamento parecido.` : 'Olá! Vim pelo pagesagends e quero fazer um orçamento.');
  });

  // Agenda de demonstração
  const days = d.getElementById('days'), times = d.getElementById('times'), ok = d.getElementById('confirm');
  const HORAS = ['09:00', '10:30', '13:00', '14:30', '16:00', '17:30'];
  const st = { day: null, time: null };
  const hoje = new Date();
  const lista = [];
  for (let i = 0; lista.length < 6; i++) { const x = new Date(hoje); x.setDate(hoje.getDate() + i); if (x.getDay() !== 0) lista.push(x); }
  const ocupado = (di, hi) => (di * 3 + hi * 5) % 4 === 0; // horários "já reservados" só para o efeito
  lista.forEach((x, di) => {
    const b = d.createElement('button'); b.type = 'button';
    b.innerHTML = `${x.getDate()}<small>${x.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', '')}</small>`;
    b.onclick = () => { st.day = di; st.time = null; draw(); };
    days.appendChild(b);
  });
  function draw() {
    [...days.children].forEach((b, i) => b.classList.toggle('sel', i === st.day));
    times.innerHTML = '';
    HORAS.forEach((h, hi) => {
      const b = d.createElement('button'); b.type = 'button'; b.textContent = h;
      b.disabled = st.day === null || ocupado(st.day, hi);
      b.classList.toggle('sel', st.time === hi);
      b.onclick = () => { st.time = hi; draw(); };
      times.appendChild(b);
    });
    ok.disabled = st.day === null || st.time === null;
    ok.textContent = st.day === null ? 'Escolha dia e horário' : st.time === null ? 'Agora escolha o horário' : 'Confirmar pelo WhatsApp';
  }
  ok.onclick = () => {
    const x = lista[st.day], q = x.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });
    open(wa(`Olá! Testei a agenda do pagesagends (${q}, às ${HORAS[st.time]}) e quero uma agenda assim no meu negócio.`), '_blank', 'noopener');
  };
  draw();

  // imagens dos trabalhos aparecem uma vez, ao entrar na tela
  const shots = [...d.querySelectorAll('.shot')];
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .2 });
    shots.forEach(s => io.observe(s));
  } else shots.forEach(s => s.classList.add('in'));

  // botões magnéticos
  if (still || !hover) return;
  d.querySelectorAll('.mag').forEach(m => {
    m.addEventListener('pointermove', e => {
      const b = m.getBoundingClientRect();
      m.style.transform = `translate(${(e.clientX - b.left - b.width / 2) * .22}px,${(e.clientY - b.top - b.height / 2) * .35}px)`;
    });
    m.addEventListener('pointerleave', () => { m.style.transform = ''; });
  });
})();
