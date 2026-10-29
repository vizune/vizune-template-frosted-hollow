// Small progressive enhancements. Everything renders and works without JS;
// these add the hero chapter pan, gallery carousel, mobile menu and form feedback.

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- Header: solid background once scrolled ---------- */
const header = document.querySelector<HTMLElement>('[data-header]');
if (header) {
  const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 24);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
}

/* ---------- Mobile navigation ---------- */
const toggle = document.querySelector<HTMLButtonElement>('[data-nav-toggle]');
const nav = document.querySelector<HTMLElement>('[data-nav]');
if (toggle && nav) {
  const setOpen = (open: boolean) => {
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    document.body.classList.toggle('nav-open', open);
  };
  toggle.addEventListener('click', () => setOpen(toggle.getAttribute('aria-expanded') !== 'true'));
  nav.addEventListener('click', (e) => {
    if ((e.target as HTMLElement).closest('a')) setOpen(false);
  });
  window.addEventListener('keydown', (e) => e.key === 'Escape' && setOpen(false));
}

/* ---------- Hero chapters: swap the copy ---------- */
const hero = document.querySelector<HTMLElement>('[data-hero]');
if (hero) {
  const eyebrow = hero.querySelector<HTMLElement>('[data-hero-eyebrow]');
  const body = hero.querySelector<HTMLElement>('[data-hero-body]');
  const buttons = [...hero.querySelectorAll<HTMLButtonElement>('[data-chapter]')];
  let current = 0;
  let timer: number | undefined;

  const show = (i: number) => {
    current = i;
    const b = buttons[i];
    buttons.forEach((btn, j) => btn.setAttribute('aria-pressed', String(j === i)));
    [eyebrow, body].forEach((el) => el?.classList.add('is-swapping'));
    window.setTimeout(() => {
      if (eyebrow) eyebrow.textContent = b.dataset.eyebrow ?? '';
      if (body) body.textContent = b.dataset.body ?? '';
      [eyebrow, body].forEach((el) => el?.classList.remove('is-swapping'));
    }, reduceMotion ? 0 : 260);
  };

  const schedule = () => {
    if (reduceMotion) return;
    window.clearInterval(timer);
    timer = window.setInterval(() => show((current + 1) % buttons.length), 9000);
  };

  buttons.forEach((btn, i) =>
    btn.addEventListener('click', () => {
      show(i);
      schedule();
    }),
  );
  schedule();
}

/* ---------- Header search ---------- */
type SearchItem = {
  type: string;
  title: string;
  text: string;
  href: string;
  image?: string;
  slide?: number;
  action?: string;
};

const search = document.querySelector<HTMLElement>('[data-search]');
const searchToggle = document.querySelector<HTMLButtonElement>('[data-search-open]');
if (search && searchToggle) {
  const input = search.querySelector<HTMLInputElement>('[data-search-input]')!;
  const results = search.querySelector<HTMLElement>('[data-search-results]')!;
  const suggest = search.querySelector<HTMLElement>('[data-search-suggest]')!;
  const empty = search.querySelector<HTMLElement>('[data-search-empty]')!;
  const term = search.querySelector<HTMLElement>('[data-search-term]')!;
  const scrim = document.querySelector<HTMLElement>('[data-search-scrim]');
  const items: SearchItem[] = JSON.parse(search.dataset.index ?? '[]');
  const groupOrder = ['News', 'Lore', 'Artwork', 'Pages'];
  let active = -1;

  const isOpen = () => search.classList.contains('is-open');

  const openSearch = () => {
    if (isOpen()) return;
    document.body.classList.remove('nav-open');
    document.querySelector('[data-nav-toggle]')?.setAttribute('aria-expanded', 'false');
    search.classList.add('is-open');
    document.body.classList.add('search-open');
    searchToggle.setAttribute('aria-expanded', 'true');
    searchToggle.setAttribute('aria-label', 'Close search');
    input.focus({ preventScroll: true });
    input.select();
  };

  const closeSearch = (restoreFocus = true) => {
    if (!isOpen()) return;
    search.classList.remove('is-open');
    document.body.classList.remove('search-open');
    searchToggle.setAttribute('aria-expanded', 'false');
    searchToggle.setAttribute('aria-label', 'Search (press /)');
    if (restoreFocus && search.contains(document.activeElement)) searchToggle.focus({ preventScroll: true });
  };

  const escapeHtml = (s: string) =>
    s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

  const highlight = (text: string, words: string[]) => {
    const pattern = words.map((w) => escapeHtml(w).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
    return escapeHtml(text).replace(new RegExp(`(${pattern})`, 'gi'), '<mark>$1</mark>');
  };

  const options = () => [...results.querySelectorAll<HTMLAnchorElement>('[role="option"]')];

  const setActive = (i: number) => {
    const opts = options();
    if (!opts.length) return;
    active = (i + opts.length) % opts.length;
    opts.forEach((o, j) => o.setAttribute('aria-selected', String(j === active)));
    input.setAttribute('aria-activedescendant', opts[active].id);
    opts[active].scrollIntoView({ block: 'nearest' });
  };

  const render = () => {
    const q = input.value.trim().toLowerCase();
    const words = q.split(/\s+/).filter(Boolean);
    active = -1;
    input.removeAttribute('aria-activedescendant');
    suggest.hidden = words.length > 0;
    if (!words.length) {
      results.innerHTML = '';
      empty.hidden = true;
      input.setAttribute('aria-expanded', 'false');
      return;
    }

    const scored = items
      .map((item, i) => {
        const title = item.title.toLowerCase();
        const hay = `${title} ${item.text.toLowerCase()} ${item.type.toLowerCase()}`;
        if (!words.every((w) => hay.includes(w))) return null;
        const score = words.reduce((s, w) => s + (title.startsWith(w) ? 4 : title.includes(w) ? 2 : 1), 0);
        return { item, i, score };
      })
      .filter((r): r is { item: SearchItem; i: number; score: number } => r !== null);

    empty.hidden = scored.length > 0;
    term.textContent = input.value.trim();
    input.setAttribute('aria-expanded', String(scored.length > 0));

    let n = 0;
    results.innerHTML = groupOrder
      .map((group) => {
        const hits = scored.filter((r) => r.item.type === group).sort((a, b) => b.score - a.score);
        if (!hits.length) return '';
        return `<div class="search__group" role="group" aria-label="${group}">
          <p class="search__label">${group}</p>
          ${hits
            .map(({ item, i }) => {
              const thumb = item.image
                ? `<img src="${item.image}" alt="" loading="lazy" />`
                : '<span class="search__thumb-mark"></span>';
              return `<a class="search__result" role="option" id="search-opt-${n++}" aria-selected="false"
                  href="${item.href}" data-i="${i}">
                <span class="search__thumb">${thumb}</span>
                <span class="search__text">
                  <span class="search__title">${highlight(item.title, words)}</span>
                  <span class="search__snippet">${highlight(item.text, words)}</span>
                </span>
                <svg class="search__go" viewBox="0 0 16 10" width="14" height="9" aria-hidden="true"><path d="M0 5h14M10 1l4 4-4 4" fill="none" stroke="currentColor" stroke-width="1.4"/></svg>
              </a>`;
            })
            .join('')}
        </div>`;
      })
      .join('');
  };

  // Follow a result or quick link: close the panel, then run its action.
  const follow = (el: HTMLAnchorElement) => {
    const item = el.dataset.i !== undefined ? items[Number(el.dataset.i)] : undefined;
    const action = item?.action ?? el.dataset.action;
    closeSearch(false);
    if (action === 'trailer') {
      document.querySelector<HTMLElement>('[data-trailer-open]')?.click();
      return true;
    }
    if (item?.slide !== undefined) {
      document.dispatchEvent(new CustomEvent('gallery:show', { detail: item.slide }));
    }
    return false;
  };

  search.addEventListener('click', (e) => {
    const link = (e.target as HTMLElement).closest<HTMLAnchorElement>('a[href]');
    if (link && follow(link)) e.preventDefault();
  });

  searchToggle.addEventListener('click', () => (isOpen() ? closeSearch() : openSearch()));
  search.querySelector('[data-search-close]')?.addEventListener('click', () => closeSearch());
  scrim?.addEventListener('click', () => closeSearch());
  search.querySelector('[data-search-form]')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const opt = options()[Math.max(active, 0)];
    if (opt && !follow(opt)) window.location.hash = opt.getAttribute('href') ?? '';
  });
  input.addEventListener('input', render);
  input.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive(active + 1);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive(active - 1);
    }
  });

  document.addEventListener('keydown', (e) => {
    const t = e.target as HTMLElement;
    const typing = t.closest('input, textarea, select, [contenteditable="true"]');
    if (e.key === '/' && !typing && !document.querySelector('dialog[open]')) {
      e.preventDefault();
      openSearch();
    } else if (e.key === 'Escape' && isOpen()) {
      closeSearch();
    }
  });
}

/* ---------- Trailer modal ---------- */
const dialog = document.querySelector<HTMLDialogElement>('[data-trailer]');
const video = dialog?.querySelector<HTMLElement>('[data-trailer-video]');
if (dialog && video && typeof dialog.showModal === 'function') {
  let opener: HTMLElement | null = null;

  const open = (e: Event) => {
    e.preventDefault();
    opener = e.currentTarget as HTMLElement;
    const iframe = document.createElement('iframe');
    iframe.src = video.dataset.src ?? '';
    iframe.title = video.dataset.title ?? 'Trailer';
    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
    iframe.allowFullscreen = true;
    iframe.referrerPolicy = 'strict-origin-when-cross-origin';
    iframe.addEventListener('load', () => video.classList.add('is-loaded'), { once: true });
    video.appendChild(iframe);
    dialog.showModal();
    document.documentElement.classList.add('modal-open');
  };

  const close = () => {
    if (!dialog.open || dialog.classList.contains('is-closing')) return;
    dialog.classList.add('is-closing');
    window.setTimeout(() => {
      dialog.classList.remove('is-closing');
      dialog.close();
    }, reduceMotion ? 0 : 220);
  };

  // Tidy up however the dialog closes: remove the player so playback stops.
  dialog.addEventListener('close', () => {
    video.querySelector('iframe')?.remove();
    video.classList.remove('is-loaded');
    document.documentElement.classList.remove('modal-open');
    opener?.focus();
  });

  // Escape: animate out instead of closing instantly.
  dialog.addEventListener('cancel', (e) => {
    e.preventDefault();
    close();
  });

  // Clicking the dimmed backdrop (the dialog element itself) closes it.
  dialog.addEventListener('click', (e) => {
    if (e.target === dialog) close();
  });

  dialog.querySelector('[data-trailer-close]')?.addEventListener('click', close);
  document.querySelectorAll<HTMLElement>('[data-trailer-open]').forEach((el) => el.addEventListener('click', open));
}

/* ---------- Gallery carousel ---------- */
document.querySelectorAll<HTMLElement>('[data-gallery]').forEach((gallery) => {
  const slides = [...gallery.querySelectorAll<HTMLImageElement>('[data-slide]')];
  const thumbs = [...gallery.querySelectorAll<HTMLButtonElement>('[data-thumb]')];
  const dotsWrap = gallery.querySelector<HTMLElement>('[data-dots]');
  const track = gallery.querySelector<HTMLElement>('.gallery__thumbs');
  let index = 0;

  const dots = slides.map(() => {
    const d = document.createElement('span');
    dotsWrap?.appendChild(d);
    return d;
  });

  const go = (i: number) => {
    index = (i + slides.length) % slides.length;
    slides.forEach((s, j) => s.classList.toggle('is-active', j === index));
    thumbs.forEach((t, j) => t.setAttribute('aria-current', String(j === index)));
    dots.forEach((d, j) => d.classList.toggle('is-active', j === index));
    // Keep the active thumbnail in view without scrolling the page itself.
    const t = thumbs[index]?.parentElement;
    if (t && track) {
      const left = t.offsetLeft - (track.clientWidth - t.clientWidth) / 2;
      track.scrollTo({ left, behavior: reduceMotion ? 'auto' : 'smooth' });
    }
  };

  thumbs.forEach((t, i) => t.addEventListener('click', () => go(i)));
  document.addEventListener('gallery:show', (e) => go((e as CustomEvent<number>).detail));
  gallery.querySelector('[data-prev]')?.addEventListener('click', () => go(index - 1));
  gallery.querySelector('[data-next]')?.addEventListener('click', () => go(index + 1));
  gallery.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') go(index - 1);
    if (e.key === 'ArrowRight') go(index + 1);
  });
  go(0);
});

/* ---------- Newsletter (front-end only — wire to your provider) ---------- */
const form = document.querySelector<HTMLFormElement>('[data-newsletter]');
form?.addEventListener('submit', (e) => {
  e.preventDefault();
  const status = form.querySelector<HTMLElement>('[data-newsletter-status]');
  if (status) status.textContent = 'Thank you, traveller. Watch your inbox.';
  form.reset();
});
