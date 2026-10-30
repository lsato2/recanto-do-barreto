// ===== Configuração =====
// Número do WhatsApp com DDI + DDD, só dígitos (ex.: 5543999998888)
const WHATSAPP = '5544988313070'; // TESTE: número correto é 5544998731002

const FOTOS = [
  { arquivo: 'IMG_7170', cat: 'piscina', legenda: 'Piscina com deck de pedra', grande: true },
  { arquivo: 'IMG_7184', cat: 'gourmet', legenda: 'Churrasqueira com forno' },
  { arquivo: 'IMG_7176', cat: 'salao', legenda: 'Salão com mesa de sinuca' },
  { arquivo: 'IMG_7161', cat: 'quartos', legenda: 'Quarto de casal' },
  { arquivo: 'IMG_7150', cat: 'gourmet', legenda: 'Bancada da churrasqueira', grande: true },
  { arquivo: 'IMG_7172', cat: 'piscina', legenda: 'Piscina e área coberta' },
  { arquivo: 'IMG_7159', cat: 'externa', legenda: 'Gramado amplo' },
  { arquivo: 'IMG_7182', cat: 'salao', legenda: 'Mesão de madeira' },
  { arquivo: 'IMG_7162', cat: 'quartos', legenda: 'Banheiro do quarto de casal' },
  { arquivo: 'IMG_7168', cat: 'piscina', legenda: 'Vista da piscina pela área coberta' },
  { arquivo: 'IMG_7153', cat: 'gourmet', legenda: 'Pia comprida da área gourmet' },
  { arquivo: 'IMG_7146', cat: 'salao', legenda: 'Área coberta com mesas', grande: true },
  { arquivo: 'IMG_7160', cat: 'quartos', legenda: 'Casa dos quartos com varanda: 4 quartos, até 29 pessoas' },
  { arquivo: 'IMG_7157', cat: 'externa', legenda: 'Espaço exclusivo do costelão de chão', grande: true },
  { arquivo: 'IMG_7183', cat: 'gourmet', legenda: 'Cooktop de 4 bocas e churrasqueira' },
  { arquivo: 'IMG_7186', cat: 'gourmet', legenda: 'Fogão a lenha e fogão industrial de 2 bocas' },
  { arquivo: 'IMG_7175', cat: 'piscina', legenda: 'Piscina' },
  { arquivo: 'IMG_7163', cat: 'quartos', legenda: 'Varanda dos quartos' },
  { arquivo: 'IMG_7147', cat: 'salao', legenda: 'Salão coberto com mesas e sinuca' },
  { arquivo: 'IMG_7164', cat: 'externa', legenda: 'Área verde' },
  { arquivo: 'IMG_7180', cat: 'gourmet', legenda: 'Área gourmet' },
  { arquivo: 'IMG_7173', cat: 'piscina', legenda: 'Vista para a piscina' },
  { arquivo: 'IMG_7156', cat: 'externa', legenda: 'Entrada e estacionamento' },
];

const linkWhats = (texto) =>
  `https://wa.me/${WHATSAPP}${texto ? `?text=${encodeURIComponent(texto)}` : ''}`;

// ===== Topo e menu =====
const topo = document.getElementById('topo');
const menu = document.getElementById('menu');
const menuToggle = document.getElementById('menuToggle');

const atualizarTopo = () => topo.classList.toggle('rolado', window.scrollY > 40);
window.addEventListener('scroll', atualizarTopo, { passive: true });
atualizarTopo();

const fecharMenu = () => {
  menu.classList.remove('aberto');
  topo.classList.remove('menu-aberto');
  menuToggle.setAttribute('aria-expanded', 'false');
};
menuToggle.addEventListener('click', () => {
  const aberto = menu.classList.toggle('aberto');
  topo.classList.toggle('menu-aberto', aberto);
  menuToggle.setAttribute('aria-expanded', String(aberto));
});
menu.querySelectorAll('a').forEach((a) => a.addEventListener('click', fecharMenu));

// ===== Galeria =====
const grid = document.getElementById('galeriaGrid');
let visiveis = [];

function renderGaleria(filtro) {
  visiveis = FOTOS.filter((f) => filtro === 'todos' || f.cat === filtro);
  grid.innerHTML = visiveis
    .map((f, i) => `
      <button type="button" class="${filtro === 'todos' && f.grande ? 'grande' : ''}" data-i="${i}" aria-label="Ampliar: ${f.legenda}">
        <img src="img/thumbs/${f.arquivo}.jpg" alt="${f.legenda}" loading="lazy">
      </button>`)
    .join('');
}

document.querySelectorAll('.filtro').forEach((btn) =>
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filtro').forEach((b) => b.classList.remove('ativo'));
    btn.classList.add('ativo');
    renderGaleria(btn.dataset.filtro);
  })
);
renderGaleria('todos');

// ===== Lightbox =====
const lb = document.getElementById('lightbox');
const lbImg = document.getElementById('lbImg');
const lbLegenda = document.getElementById('lbLegenda');
let atual = 0;

function abrirFoto(i) {
  atual = (i + visiveis.length) % visiveis.length;
  const f = visiveis[atual];
  lbImg.src = `img/${f.arquivo}.jpg`;
  lbImg.alt = f.legenda;
  lbLegenda.textContent = `${f.legenda} · ${atual + 1}/${visiveis.length}`;
  lb.hidden = false;
  document.body.style.overflow = 'hidden';
}
function fecharFoto() {
  lb.hidden = true;
  document.body.style.overflow = '';
}

grid.addEventListener('click', (e) => {
  const btn = e.target.closest('button[data-i]');
  if (btn) abrirFoto(Number(btn.dataset.i));
});
document.getElementById('lbFechar').addEventListener('click', fecharFoto);
document.getElementById('lbAnt').addEventListener('click', () => abrirFoto(atual - 1));
document.getElementById('lbProx').addEventListener('click', () => abrirFoto(atual + 1));
lb.addEventListener('click', (e) => { if (e.target === lb) fecharFoto(); });
document.addEventListener('keydown', (e) => {
  if (lb.hidden) return;
  if (e.key === 'Escape') fecharFoto();
  if (e.key === 'ArrowLeft') abrirFoto(atual - 1);
  if (e.key === 'ArrowRight') abrirFoto(atual + 1);
});

// ===== Formulário de reserva =====
const form = document.getElementById('formReserva');
const erro = document.getElementById('formErro');
const entrada = document.getElementById('entrada');
const saida = document.getElementById('saida');

const hoje = new Date();
hoje.setMinutes(hoje.getMinutes() - hoje.getTimezoneOffset());
entrada.min = hoje.toISOString().slice(0, 10);
// O calendário do celular abre na data atual do campo; sem valor, abre em hoje.
// Por isso a saída acompanha a entrada sempre que estiver vazia ou antes dela.
const sincronizarSaida = () => {
  saida.min = entrada.value;
  if (entrada.value && (!saida.value || saida.value < entrada.value)) saida.value = entrada.value;
};
entrada.addEventListener('change', sincronizarSaida);
entrada.addEventListener('input', sincronizarSaida);

const DIAS_SEMANA = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];
const paraData = (iso) => { const [a, m, d] = iso.split('-').map(Number); return new Date(a, m - 1, d); };
const dataBR = (iso) => `${DIAS_SEMANA[paraData(iso).getDay()]}, ${iso.split('-').reverse().join('/')}`;
const totalDias = (ini, fim) => Math.round((paraData(fim) - paraData(ini)) / 86400000) + 1;

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const d = Object.fromEntries(new FormData(form));

  const faltando = [];
  if (!d.nome.trim()) faltando.push('seu nome');
  if (!d.entrada) faltando.push('a data de entrada');
  if (!d.saida) faltando.push('a data de saída');
  if (!d.pessoas || Number(d.pessoas) < 1) faltando.push('o número de pessoas');
  if (faltando.length) {
    erro.textContent = `Preencha ${faltando.join(', ')}.`;
    erro.hidden = false;
    return;
  }
  if (d.saida < d.entrada) {
    erro.textContent = 'A data de saída não pode ser antes da entrada.';
    erro.hidden = false;
    return;
  }
  erro.hidden = true;

  const dias = totalDias(d.entrada, d.saida);
  const periodo = d.saida !== d.entrada
    ? `${dataBR(d.entrada)} até ${dataBR(d.saida)}`
    : dataBR(d.entrada);

  const linhas = [
    `*PEDIDO DE ORÇAMENTO - Recanto do Barreto*`,
    ``,
    `👤 *Nome:* ${d.nome.trim()}`,
    `📅 *Data:* ${periodo}`,
    `🗓️ *Total:* ${dias} ${dias === 1 ? 'dia' : 'dias'}`,
    `👥 *Pessoas:* ${d.pessoas}`,
    `🎉 *Evento:* ${d.tipo}`,
    `🛏️ *Pernoite:* ${d.pernoite ? 'Sim, vamos usar os quartos' : 'Não'}`,
  ];
  if (d.mensagem.trim()) linhas.push(`📝 *Obs.:* ${d.mensagem.trim()}`);
  linhas.push(``, `Pode me passar o valor e a disponibilidade? Obrigado(a)!`);

  window.open(linkWhats(linhas.join('\n')), '_blank', 'noopener');
});

// ===== WhatsApp flutuante =====
document.getElementById('whatsFlutuante').href =
  linkWhats('Olá! Vim pelo site e gostaria de informações sobre o Recanto do Barreto.');

// ===== Animações de entrada =====
const alvos = document.querySelectorAll('.destaque, .ambiente, .evento, .secao__cabeca, .reserva > *, .local > *');
alvos.forEach((el) => el.classList.add('revelar'));
const obs = new IntersectionObserver((entradas) => {
  entradas.forEach((en) => {
    if (en.isIntersecting) {
      en.target.classList.add('visivel');
      obs.unobserve(en.target);
    }
  });
}, { threshold: 0.12 });
alvos.forEach((el) => obs.observe(el));

document.getElementById('ano').textContent = new Date().getFullYear();
