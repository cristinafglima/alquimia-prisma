// Alquimia Prisma — gera a página de cada cliente a partir de clientes/<slug>.json
// Uso (na raiz do repositório):  node _modelo/build.mjs keila      → keila/index.html
//                                 node _modelo/build.mjs            → todas as clientes
import { readFileSync, writeFileSync, mkdirSync, readdirSync } from "node:fs";

const WHATSAPP = "5511991340654";
const FRIENDS_MSG = "Olá! Conheci o Alquimia Friends através do meu Alquimia Prisma e quero saber mais sobre a comunidade.";

const esc = (s = "") => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const ytId = (v = "") => (String(v).match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([\w-]{11})/) || [, /^[\w-]{11}$/.test(v) ? v : ""])[1];
const secs = (t) => t.split(":").reduce((a, x) => a * 60 + Number(x), 0);
const pad = (n) => String(n).padStart(2, "0");

function page(c) {
  const id = ytId(c.youtube);
  const first = c.nome;
  const full = c.nomeCompleto || c.nome;
  const sections = [
    ["inicio", "Boas-vindas"],
    ["video", "Sua análise"],
    ["descobertas", "Descobertas"],
    ...(c.destaque ? [["destaque", c.destaque.navLabel]] : []),
    ["orientacoes", "Orientações"],
    ["friends", "Alquimia Friends"],
  ];
  const order = ["video", "descobertas", ...(c.destaque ? ["destaque"] : []), "orientacoes"];
  const label = (eyebrow, sec) => `${pad(order.indexOf(sec) + 1)} / ${eyebrow}`;

  const nav = sections.map(([h, t], i) => `<a href="#${h}"><span>${pad(i + 1)}</span> ${esc(t)}</a>`).join("");
  const opts = sections.map(([h, t], i) => `<option value="${h}">${i ? esc(t) : "Início"}</option>`).join("");

  const video = id
    ? `<iframe id="player" src="https://www.youtube-nocookie.com/embed/${id}?rel=0&modestbranding=1" title="Análise de visagismo de ${esc(full)}" loading="lazy" referrerpolicy="strict-origin-when-cross-origin" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>`
    : `<div class="video-pending"><div class="serif">Seu vídeo chega em breve.</div><p>Assim que estiver pronto, ele aparece aqui.</p></div>`;
  const chapters = id && c.capitulos?.length
    ? `<div class="eyebrow chapters-title">Ir direto para</div><div class="chapters">${c.capitulos.map((k) =>
        `<button type="button" data-t="${secs(k.t)}"><time>${esc(k.t)}</time>${esc(k.titulo)}</button>`).join("")}</div>`
    : "";

  const cards = c.descobertas.cards.map((k) => {
    const media = k.foto
      ? `<img src="../assets/fotos/${k.foto}" alt="" loading="lazy">`
      : `<span class="card-art${k.escuro ? " dark" : ""}" aria-hidden="true"><span>${k.arte}</span></span>`;
    return `<a class="image-card" href="#${k.link || "orientacoes"}">${media}<span class="image-card-copy"><span class="image-card-title">${esc(k.titulo)}</span><span class="image-card-desc">${esc(k.texto)}</span><span class="image-card-arrow" aria-hidden="true">↗</span></span></a>`;
  }).join("");

  const d = c.destaque;
  const destaque = d ? `<section class="section" id="destaque"><div class="eyebrow gold">${label(d.eyebrow, "destaque")}</div><div class="sectionhead"><h2>${d.titulo}</h2><p>${esc(d.intro)}</p></div>${d.itens.map((it, i) =>
    `<div class="feature${i % 2 ? " reverse" : ""}"><div class="feature-art${it.escuro ? " dark" : ""}"><div class="arttext">${it.arte}</div></div><div class="feature-copy"><div class="eyebrow gold">${esc(it.eyebrow)}</div><h3>${esc(it.titulo)}</h3><div class="divider"></div>${(it.paragrafos || []).map((p) => `<p>${p}</p>`).join("")}${it.lista ? `<ul>${it.lista.map((l) => `<li>${l}</li>`).join("")}</ul>` : ""}</div></div>`).join("")}</section>` : "";

  const acc = c.orientacoes.itens.map((it, i) =>
    `<details${i ? "" : " open"}><summary>${pad(i + 1)}. ${esc(it.titulo)}</summary><div class="detailbody">${it.html}</div></details>`).join("");

  return `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex,nofollow"><meta name="theme-color" content="#3c0c12">
<meta name="description" content="Alquimia Prisma — análise personalizada de visagismo de ${esc(full)}">
<title>${esc(full)} | Alquimia Prisma</title>
<meta property="og:title" content="${esc(first)}, sua análise Alquimia Prisma"><meta property="og:description" content="Seu espaço exclusivo de visagismo: vídeo, descobertas e orientações.">
<link rel="icon" href="../assets/logo-prisma.png">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,400&family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="../assets/prisma.css"></head><body>
<div class="mobilebar"><img class="logo-mobile" src="../assets/logo-prisma.png" alt="Alquimia Prisma"><select aria-label="Navegar pelas seções" onchange="document.getElementById(this.value)?.scrollIntoView({behavior:'smooth'})">${opts}</select></div>
<div class="shell"><aside class="sidebar"><div class="brandmark"><img class="logo-transparent" src="../assets/logo-prisma.png" alt="Alquimia Prisma"></div><nav class="nav">${nav}</nav><div class="sidefoot">Uma experiência individual de visagismo.<br>Preparada especialmente para ${esc(full)}.</div></aside>
<main class="main"><header class="hero" id="inicio"><div class="hero-inner"><div class="eyebrow">ALQUIMIA PRISMA · CONSULTORIA INDIVIDUAL</div><h1>Olá,<br><i>${esc(first)}.</i></h1><div class="hero-line"></div><p>${esc(c.hero)}</p><div class="hero-actions"><a class="btn" href="#video">Assistir à minha análise <span>↗</span></a><a class="btn outline" href="#descobertas">Explorar descobertas ↓</a></div></div></header>
<div class="wrap">
<section class="section" id="video"><div class="sectionhead"><div><div class="eyebrow gold">${label("SUA CONSULTORIA", "video")}</div><h2>Um olhar só seu.</h2></div><p>${esc(c.videoTexto || "Assista à sua análise completa e retorne a ela sempre que quiser. Logo abaixo, você encontra as principais descobertas e orientações para colocar em prática.")}</p></div><div class="video-frame">${video}</div>${id ? `<p class="videofallback">Se o vídeo não carregar neste navegador, <a href="https://youtu.be/${id}" target="_blank" rel="noopener noreferrer">assista diretamente no YouTube ↗</a>.</p>` : ""}${chapters}</section>
<section class="section" id="descobertas"><div class="eyebrow gold">${label("SUA ESSÊNCIA EM DETALHES", "descobertas")}</div><div class="sectionhead"><h2>Suas principais<br><i>descobertas.</i></h2><p>${esc(c.descobertas.intro)}</p></div><div class="image-cards">${cards}</div></section>
<div class="statement">${c.frase}</div>
${destaque}
<section class="section" id="orientacoes"><div class="sectionhead"><div><div class="eyebrow gold">${label("PARA CONSULTAR SEMPRE", "orientacoes")}</div><h2>Suas orientações<br><i>personalizadas.</i></h2></div><p>Abra cada tópico para rever as recomendações que foram construídas durante a sua consultoria.</p></div><div class="accordion">${acc}</div><div class="note">${esc(c.orientacoes.nota || "Este material resume as recomendações da sua consultoria. Para compreender todas as nuances das escolhas propostas, reveja também o vídeo completo.")}</div></section>
</div>
<section class="friends" id="friends"><div class="friends-inner"><div><div class="eyebrow">CONTINUE ESSA JORNADA</div><h2>ALQUIMIA<br><i>FRIENDS.</i></h2><p>Um espaço para continuar descobrindo novas possibilidades de beleza, estilo e imagem pessoal, com orientações para fazer escolhas cada vez mais conscientes.</p><a class="btn" href="https://wa.me/${WHATSAPP}?text=${encodeURIComponent(FRIENDS_MSG)}" target="_blank" rel="noopener noreferrer">Quero fazer parte ↗</a></div><div><div class="eyebrow">UMA COMUNIDADE DE BELEZA</div><ul><li>Direcionamentos de imagem pessoal</li><li>Dicas de beleza, cabelo e maquiagem</li><li>Conteúdos e inspirações para o dia a dia</li><li>Um espaço para explorar seu próprio estilo</li></ul></div></div></section>
<footer class="footer">ALQUIMIA PRISMA · OUTRO OLHAR SOBRE VOCÊ · CONSULTORIA PERSONALIZADA PARA ${esc(full.toUpperCase())}</footer></main></div>
<script>
// capítulos: reinicia o vídeo no ponto escolhido
document.querySelectorAll('.chapters button').forEach(b=>b.addEventListener('click',()=>{const p=document.getElementById('player');if(!p)return;
  const u=new URL(p.src);u.searchParams.set('start',b.dataset.t);u.searchParams.set('autoplay','1');p.src=u.toString();
  document.getElementById('video').scrollIntoView({behavior:'smooth'});}));
// menu lateral: marca a seção visível
const links=[...document.querySelectorAll('.nav a')];const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)links.forEach(a=>a.classList.toggle('active',a.getAttribute('href')==='#'+e.target.id));}),{rootMargin:'-45% 0px -50% 0px'});
document.querySelectorAll('main [id]').forEach(s=>io.observe(s));
</script></body></html>
`;
}

const want = process.argv[2];
const files = readdirSync("clientes").filter((f) => f.endsWith(".json") && (!want || f === `${want}.json`));
if (!files.length) { console.error(`nenhum arquivo clientes/${want || "*"}.json`); process.exit(1); }
for (const f of files) {
  const c = JSON.parse(readFileSync(`clientes/${f}`, "utf8"));
  const slug = f.replace(/\.json$/, "");
  mkdirSync(slug, { recursive: true });
  writeFileSync(`${slug}/index.html`, page(c));
  console.log(`${slug}/index.html  ${ytId(c.youtube) ? "vídeo ok" : "SEM VÍDEO (falta o link do YouTube)"}`);
}
