import { cvData } from './data.js';

// Populate basic info
const nombreEl = document.getElementById('nombre');
const tituloEl = document.getElementById('titulo');
const resumenEl = document.getElementById('resumen');
const yearEl = document.getElementById('year');
const footerNameEl = document.getElementById('footer-name');

// visit counter
const visitEl = document.getElementById('visit-count');
const visits = Number(localStorage.getItem('visits') || 0) + 1;
localStorage.setItem('visits', visits);
if (visitEl) visitEl.textContent = visits;

nombreEl.textContent = cvData.nombre;
tituloEl.textContent = cvData.experiencia[0]?.rol || '';
resumenEl.textContent = cvData.resumen;
yearEl.textContent = new Date().getFullYear();
footerNameEl.textContent = cvData.nombre;

// Hero links
const emailLink = document.getElementById('email-link');
const phoneLink = document.getElementById('phone-link');
const emailCopy = document.getElementById('email-copy');
const phoneCopy = document.getElementById('phone-copy');
const linkedinLink = document.getElementById('linkedin-link');
const menuToggle = document.getElementById('menu-toggle');
const menu = document.getElementById('menu');

emailLink.href = `mailto:${cvData.contacto.email}`;
phoneLink.href = `tel:${cvData.contacto.telefono}`;
emailLink.textContent = cvData.contacto.email;
phoneLink.textContent = cvData.contacto.telefono;
emailCopy.textContent = 'Copiar email';
phoneCopy.textContent = 'Copiar tel';
linkedinLink.href = cvData.contacto.linkedin;

menuToggle.addEventListener('click', () => menu.classList.toggle('open'));

// Copy to clipboard
themesInit();
function copy(text) {
  navigator.clipboard.writeText(text).then(() => {
    showToast('Copiado al portapapeles');
  });
}
emailCopy.addEventListener('click', () => copy(cvData.contacto.email));
phoneCopy.addEventListener('click', () => copy(cvData.contacto.telefono));

// Experience timeline
const expList = document.getElementById('experience-list');
cvData.experiencia.forEach((exp, idx) => {
  const li = document.createElement('li');
  const btn = document.createElement('button');
  btn.className = 'exp-item';
  btn.setAttribute('aria-expanded', 'false');
  btn.innerHTML = `<span>${exp.empresa} - ${exp.rol}</span> <time>${exp.inicio} - ${exp.fin}</time>`;
  const details = document.createElement('div');
  details.className = 'exp-details';
  details.hidden = true;
  const respList = document.createElement('ul');
  exp.responsabilidades.forEach(r => {
    const rli = document.createElement('li');
    rli.textContent = r;
    respList.appendChild(rli);
  });
  const chips = document.createElement('div');
  chips.className = 'chips';
  exp.tecnologias.forEach(t => {
    const chip = document.createElement('span');
    chip.textContent = t;
    chips.appendChild(chip);
  });
  details.appendChild(respList);
  details.appendChild(chips);
  li.appendChild(btn);
  li.appendChild(details);
  expList.appendChild(li);
  const toggle = () => {
    const expanded = btn.getAttribute('aria-expanded') === 'true';
    btn.setAttribute('aria-expanded', String(!expanded));
    details.hidden = expanded;
  };
  btn.addEventListener('click', toggle);
  btn.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggle();
    }
  });
});

// Education
const eduList = document.getElementById('education-list');
cvData.educacion.forEach(edu => {
  const card = document.createElement('article');
  card.innerHTML = `<h3>${edu.institucion}</h3><p>${edu.titulo} (${edu.estado})</p><p>${edu.inicio} - ${edu.fin}</p>`;
  eduList.appendChild(card);
});

// Skills with filters
const skillSearch = document.getElementById('skill-search');
const skillFilters = document.querySelectorAll('#skill-filters button');
const skillList = document.getElementById('skill-list');
const allSkills = [];
Object.entries(cvData.habilidades).forEach(([group, items]) => {
  items.forEach(name => allSkills.push({ group, name }));
});
let currentGroup = 'all';
function renderSkills() {
  const term = skillSearch.value.toLowerCase();
  skillList.innerHTML = '';
  allSkills.filter(s => (currentGroup === 'all' || s.group === currentGroup) && s.name.toLowerCase().includes(term))
    .forEach(s => {
      const li = document.createElement('li');
      li.textContent = s.name;
      skillList.appendChild(li);
    });
}
skillSearch.addEventListener('input', renderSkills);
skillFilters.forEach(btn => {
  btn.addEventListener('click', () => {
    currentGroup = btn.dataset.group;
    skillFilters.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderSkills();
  });
});
renderSkills();

// Languages
const langList = document.getElementById('language-list');
cvData.idiomas.forEach(lang => {
  const li = document.createElement('li');
  li.innerHTML = `<span>${lang.idioma} (${lang.nivel})</span><div class="language-bar"><span style="width:${nivelToPercent(lang.nivel)}%"></span></div><small>${lang.detalle}</small>`;
  langList.appendChild(li);
});
function nivelToPercent(nivel) {
  const map = { A1:20, A2:30, B1:40, B2:60, C1:80, C2:100 };
  return map[nivel] || 50;
}

// Projects
const projectGrid = document.getElementById('project-grid');
cvData.proyectos.forEach(p => {
  const card = document.createElement('article');
  card.className = 'project-card card';
  card.innerHTML = `
    <img src="${p.imagen}" alt="${p.titulo}" loading="lazy" />
    <div class="card-content">
      <h3>${p.titulo}</h3>
      <p>${p.descripcion}</p>
      <a href="${p.url}" target="_blank" rel="noopener">Ver proyecto</a>
    </div>`;
  projectGrid.appendChild(card);
});

// Testimonials
const testimonialList = document.getElementById('testimonial-list');
cvData.testimonios.forEach(t => {
  const fig = document.createElement('figure');
  fig.className = 'testimonial card';
  fig.innerHTML = `<blockquote>“${t.comentario}”</blockquote><cite>${t.nombre} - ${t.rol}</cite>`;
  testimonialList.appendChild(fig);
});

// Achievements
const achievementList = document.getElementById('achievement-list');
cvData.certificaciones.forEach(c => {
  const li = document.createElement('li');
  li.className = 'card';
  li.innerHTML = `<strong>${c.titulo}</strong><br><small>${c.entidad} - ${c.anio}</small>`;
  achievementList.appendChild(li);
});

// Interests
const interestList = document.getElementById('interest-list');
cvData.intereses.forEach(i => {
  const li = document.createElement('li');
  li.textContent = i;
  interestList.appendChild(li);
});

// Contact form
const form = document.getElementById('contact-form');
form.addEventListener('submit', e => {
  e.preventDefault();
  showToast('Mensaje enviado');
  form.reset();
});

// Theme and accent toggles
function themesInit() {
  const themeToggle = document.getElementById('theme-toggle');
  const accentToggle = document.getElementById('accent-toggle');
  const storedTheme = localStorage.getItem('theme') || 'light';
  const storedAccent = localStorage.getItem('accent') || 'teal';
  document.documentElement.setAttribute('data-theme', storedTheme);
  document.documentElement.setAttribute('data-accent', storedAccent);
  themeToggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
  });
  const accents = ['teal', 'orange', 'blue'];
  accentToggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-accent');
    const idx = accents.indexOf(current);
    const next = accents[(idx + 1) % accents.length];
    document.documentElement.setAttribute('data-accent', next);
    localStorage.setItem('accent', next);
  });
}

// Intersection Observer animations
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      observer.unobserve(entry.target);
    }
  });
});
document.querySelectorAll('section').forEach(sec => observer.observe(sec));

// Download PDF
const downloadBtn = document.getElementById('download-btn');
downloadBtn.addEventListener('click', () => window.print());

// Toast helper
function showToast(text) {
  const toast = document.getElementById('toast');
  toast.textContent = text;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2000);
}

// Service worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js');
  });
}

// JSON-LD
const ld = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: cvData.nombre,
  email: cvData.contacto.email,
  telephone: cvData.contacto.telefono,
  sameAs: [cvData.contacto.linkedin],
  jobTitle: cvData.experiencia[0]?.rol,
  worksFor: {
    '@type': 'Organization',
    name: cvData.experiencia[0]?.empresa
  }
};
const ldScript = document.createElement('script');
ldScript.type = 'application/ld+json';
ldScript.textContent = JSON.stringify(ld);
document.head.appendChild(ldScript);

