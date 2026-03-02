// ===============================
// Helpers
// ===============================
function qs(sel) { return document.querySelector(sel); }
function qsa(sel) { return document.querySelectorAll(sel); }

function safeText(el, value) {
  if (!el) return;
  el.textContent = value ?? "—";
}

function escapeHtml(str) {
  return String(str || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

// ===============================
// NAVBAR / MENU MOBILE
// ===============================
function toggleMenu() {
  const menu = qs("#navMenu");
  if (!menu) return;
  menu.classList.toggle("active");
}

function closeMenu() {
  const menu = qs("#navMenu");
  if (!menu) return;
  menu.classList.remove("active");
}

// Fecha menu ao clicar fora (mobile)
document.addEventListener("click", (e) => {
  const menu = qs("#navMenu");
  const toggle = qs(".menu-toggle");
  if (!menu || !toggle) return;

  const clickedInsideMenu = menu.contains(e.target);
  const clickedToggle = toggle.contains(e.target);

  if (!clickedInsideMenu && !clickedToggle) {
    menu.classList.remove("active");
  }
});

// ===============================
// NAVBAR SCROLL (só home)
// ===============================
(() => {
  const nav = qs("#mainNav");
  if (!nav) return;

  window.addEventListener("scroll", () => {
    const isHome = document.body.classList.contains("page-home");
    if (!isHome) return;

    if (window.scrollY > window.innerHeight - 100) nav.classList.add("nav-active");
    else nav.classList.remove("nav-active");
  });
})();

// ===============================
// HERO TEXT (só home)
// ===============================
(() => {
  const textElement = qs("#changing-text");
  if (!textElement) return;

  const texts = ["CONTRATE NOSSOS ARTISTAS", "DE SÃO PAULO PARA O MUNDO"];
  let textIdx = 0;

  setInterval(() => {
    textElement.classList.remove("swoosh-effect");
    void textElement.offsetWidth;
    textIdx = (textIdx + 1) % texts.length;
    textElement.innerText = texts[textIdx];
    textElement.classList.add("swoosh-effect");
  }, 3500);
})();

// ===============================
// PRELOADER (só se existir)
// ===============================
window.addEventListener("load", () => {
  const preloader = qs("#preloader");
  if (!preloader) return;

  setTimeout(() => {
    preloader.classList.add("loader-hidden");
  }, 500);
});

// ===============================
// PLAYER MODAL (YouTube)
// ===============================
const modal = qs("#video-modal");
const iframe = qs("#main-player");

function openPlayer(id, title, artist) {
  const titleEl = qs("#modal-video-title");
  const artistEl = qs("#modal-video-artist");

  safeText(titleEl, title || "Sem título");
  safeText(artistEl, artist || "");

  if (iframe) iframe.src = `https://www.youtube.com/embed/${id}?autoplay=1`;
  if (modal) {
    modal.style.display = "flex";
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }
}

function closePlayer() {
  if (modal) {
    modal.style.display = "none";
    modal.setAttribute("aria-hidden", "true");
  }
  if (iframe) iframe.src = "";
  document.body.style.overflow = "";
}

if (modal) {
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closePlayer();
  });
}

// ===============================
// SHORTS MODAL
// ===============================
const sModal = qs("#short-modal");
const sIframe = qs("#short-iframe");

// Você pode trocar IDs aqui depois, ou puxar do painel
const shortsIds = ["Payaw8HEzV0", "WU-B6DDwtgM", "ID_S3", "ID_S4"];
let sIdx = 0;

function openShortPlayer(id) {
  if (!sModal || !sIframe) return;
  sIdx = shortsIds.indexOf(id);
  if (sIdx === -1) sIdx = 0;
  updateShort();
  sModal.style.display = "flex";
  sModal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function navigateShort(dir) {
  if (!sIframe) return;
  sIdx = (sIdx + dir + shortsIds.length) % shortsIds.length;
  updateShort();
}

function updateShort() {
  if (!sIframe) return;
  sIframe.src = `https://www.youtube.com/embed/${shortsIds[sIdx]}?autoplay=1`;
}

function closeShortPlayer() {
  if (sModal) {
    sModal.style.display = "none";
    sModal.setAttribute("aria-hidden", "true");
  }
  if (sIframe) sIframe.src = "";
  document.body.style.overflow = "";
}

if (sModal) {
  sModal.addEventListener("click", (e) => {
    if (e.target === sModal) closeShortPlayer();
  });
}

// ESC fecha tudo
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closePlayer();
    closeShortPlayer();
    closeMenu();
  }
});

// ===============================
// CONTADORES (só se existir)
// ===============================
(() => {
  const counters = qsa(".counter");
  if (!counters.length) return;

  const speed = 200;

  const startCounters = (entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      const updateCount = () => {
        const target = +entry.target.getAttribute("data-target");
        const count = +entry.target.innerText;
        const inc = target / speed;

        if (count < target) {
          entry.target.innerText = Math.ceil(count + inc);
          setTimeout(updateCount, 12);
        } else {
          entry.target.innerText = target;
        }
      };

      updateCount();
      observer.unobserve(entry.target);
    });
  };

  const obs = new IntersectionObserver(startCounters, { threshold: 0.5 });
  counters.forEach((c) => obs.observe(c));
})();

// ===============================
// ARTISTAS: filtro + busca
// ===============================
function filterArtists(category, btn) {
  const cards = qsa(".artista-card");
  const buttons = qsa(".filter-btn");
  if (!cards.length || !buttons.length) return;

  buttons.forEach((b) => b.classList.remove("active"));
  if (btn) btn.classList.add("active");

  const search = qs("#artistSearch");
  if (search) search.value = "";

  cards.forEach((card) => {
    const show = category === "all" || card.classList.contains(category);
    card.style.display = show ? "block" : "none";
  });
}

function searchArtist() {
  const inputEl = qs("#artistSearch");
  const cards = qsa(".artista-card");
  if (!inputEl || !cards.length) return;

  const input = inputEl.value.toLowerCase().trim();
  cards.forEach((card) => {
    const name = (card.getAttribute("data-name") || "").toLowerCase();
    card.style.display = name.includes(input) ? "block" : "none";
  });
}

// ===============================
// JSON Helpers (Artistas)
// ===============================
async function fetchJson(url) {
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error(`Fetch falhou: ${url} (${res.status})`);
  return res.json();
}

async function fetchArtistaById(id) {
  const url = new URL(`content/artistas/${id}.json`, window.location.href);
  return fetchJson(url);
}

// ===============================
// CARREGAR ARTISTAS (PELO INDEX.JSON)
// ===============================
async function carregarArtistas() {
  const grid = document.getElementById("gridArtistas");
  if (!grid) return;

  try {
    const indexUrl = new URL("content/artistas/index.json", window.location.href);
    const indexData = await fetchJson(indexUrl);

    const ids = indexData.artistas || [];
    if (!ids.length) throw new Error("index.json está vazio (artistas: [])");

    const artistas = await Promise.all(
      ids.map(async (id) => {
        const data = await fetchArtistaById(id);
        // garante id (caso esqueça no JSON)
        data.id = data.id || id;
        return data;
      })
    );

    grid.innerHTML = artistas.map((a) => `
      <div class="artista-card ${escapeHtml(a.categoria || "all")}" data-name="${escapeHtml(a.nome || "")}">
        <a href="perfil.html?id=${encodeURIComponent(a.id)}">
          <img src="${escapeHtml(a.fotoCard || "assets/placeholder-card.jpg")}" alt="${escapeHtml(a.nome || "Artista")}">
          <h3>${escapeHtml(a.nome || "ARTISTA")}</h3>
        </a>
      </div>
    `).join("");

  } catch (err) {
    console.error("Erro ao carregar artistas:", err);
    grid.innerHTML = `<p style="color:#fff;opacity:.8">Erro ao carregar artistas. Verifique o console (F12).</p>`;
  }
}

// ===============================
// PAGE: perfil.html -> preencher perfil
// ===============================
function setFeaturedHit(featured) {
  const btn = qs("#perfil-featured-btn") || qs(".featured-card");
  const thumb = qs("#perfil-hit-thumb");
  const title = qs("#perfil-hit-title");
  const artist = qs("#perfil-hit-artist");

  if (thumb && featured.thumb) thumb.src = featured.thumb;
  safeText(title, featured.titulo || "—");
  safeText(artist, featured.artista || "—");

  if (btn) {
    btn.onclick = null;
    if (featured.id) {
      btn.addEventListener("click", () => openPlayer(featured.id, featured.titulo || "Sem título", featured.artista || ""));
    }
  }
}

function renderHitsList(hits, fallbackArtistName) {
  const hitsWrap = qs("#perfil-hits");
  if (!hitsWrap) return;

  const arr = Array.isArray(hits) ? hits : [];
  if (!arr.length) {
    hitsWrap.innerHTML = `<p class="empty-hits">Sem hits cadastrados.</p>`;
    return;
  }

  hitsWrap.innerHTML = arr.map((h) => `
    <button class="hit-item" type="button"
      onclick="openPlayer('${escapeHtml(h.id)}','${escapeHtml(h.titulo)}','${escapeHtml(h.artista || fallbackArtistName || "")}')">
      <span class="hit-title">${escapeHtml(h.titulo)}</span>
      <span class="hit-play"><i class="fas fa-play-circle"></i></span>
    </button>
  `).join("");
}

function renderSocial(social) {
  const socialWrap = qs("#perfil-social");
  if (!socialWrap) return;

  const s = social || {};
  socialWrap.innerHTML = `
    <a class="social-pill" href="${escapeHtml(s.ig || "#")}" target="_blank" rel="noopener"><i class="fab fa-instagram"></i> Instagram</a>
    <a class="social-pill" href="${escapeHtml(s.tk || "#")}" target="_blank" rel="noopener"><i class="fab fa-tiktok"></i> TikTok</a>
    <a class="social-pill" href="${escapeHtml(s.yt || "#")}" target="_blank" rel="noopener"><i class="fab fa-youtube"></i> YouTube</a>
    <a class="social-pill" href="${escapeHtml(s.sp || "#")}" target="_blank" rel="noopener"><i class="fab fa-spotify"></i> Spotify</a>
  `;
}

async function carregarPerfil() {
  if (!window.location.pathname.includes("perfil.html")) return;

  const artistaId = new URLSearchParams(window.location.search).get("id");
  if (!artistaId) return;

  try {
    const dados = await fetchArtistaById(artistaId);

    document.title = `Perfil - ${dados.nome || "Artista"}`;

    // HERO (agora com IDs pra não “vazar” imagem fixa)
    const heroName = qs("#perfil-nome") || qs(".profile-hero h1");
    const bgText = qs("#perfil-bg-text") || qs(".profile-bg-text");
    const img = qs("#perfil-foto") || qs(".artist-main-img img");
    const bioP = qs("#perfil-bio") || qs(".artist-bio p");

    safeText(heroName, dados.nome || "ARTISTA");
    safeText(bgText, dados.nome || "ARTISTA");

    if (img) {
      img.src = dados.fotoPerfil || dados.fotoCard || "assets/placeholder-perfil.jpg";
      img.alt = `Foto do ${dados.nome || "artista"}`;
    }

    if (bioP) bioP.textContent = dados.bio || "—";

    // Métricas
    safeText(qs("#perfil-seguidores"), dados.seguidores || "—");
    safeText(qs("#perfil-views"), dados.views || "—");

    // Redes
    renderSocial(dados.social);

    // Featured Hit (Hit do Momento)
    const featured = dados.featured || (Array.isArray(dados.hits) && dados.hits[0]) || null;
    if (featured) {
      setFeaturedHit({
        id: featured.id,
        titulo: featured.titulo || featured.title || "—",
        artista: featured.artista || dados.nome || "—",
        thumb: featured.thumb || featured.foto || dados.thumbFeatured || dados.fotoCard || "assets/placeholder-thumb.jpg"
      });
    } else {
      setFeaturedHit({ id: "", titulo: "—", artista: "—", thumb: "assets/placeholder-thumb.jpg" });
    }

    // Lista de hits
    renderHitsList(dados.hits, dados.nome);

  } catch (err) {
    console.error("Erro ao carregar perfil:", err);

    document.title = "Perfil - Artista não encontrado";
    safeText(qs("#perfil-nome") || qs(".profile-hero h1"), "ARTISTA NÃO ENCONTRADO");
    safeText(qs("#perfil-bg-text") || qs(".profile-bg-text"), "ERRO");
    const bioP = qs("#perfil-bio") || qs(".artist-bio p");
    if (bioP) bioP.textContent = "Não encontramos esse artista. Volte para a página de artistas e selecione um perfil válido.";
  }
}

// ===============================
// INIT POR PÁGINA
// ===============================
if (window.location.pathname.includes("artistas.html")) {
  carregarArtistas();
}

carregarPerfil();
