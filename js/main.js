(function () {
  'use strict';

  // 스크롤 등장 애니메이션 (fade + slide-up, 그룹별 stagger) — 모바일은 끔(버벅임 방지)
  (function () {
    if (!('IntersectionObserver' in window)) return;
    if (window.matchMedia('(max-width:1024px)').matches) return;
    var groups = [
      ['.hero-content > *', 130],
      ['.loc3-box', 0],
      ['.loc3-list li', 80],
      ['.am-slider-sec .eyebrow, .am-slider-sec .section-title', 110],
      ['.am-slider', 0],
      ['.product .unit-head > *', 100],
      ['.product .floor-viewer', 0],
      ['.bk-head > div, .bk-head .bk-desc', 120],
      ['.point-card', 70],
      ['.contact-left > *', 110],
      ['.hcontact-form', 0]
    ];
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    groups.forEach(function (g) {
      [].slice.call(document.querySelectorAll(g[0])).forEach(function (el, i) {
        el.classList.add('reveal');
        if (g[1]) el.style.transitionDelay = (i * g[1]) + 'ms';
        io.observe(el);
      });
    });
  })();

  // 헤더 스크롤 효과
  var header = document.getElementById('header');
  window.addEventListener('scroll', function () {
    if (window.scrollY > 40) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  });

  // 모바일 메뉴 토글
  var hamburger = document.getElementById('hamburger');
  var mobileMenu = document.getElementById('mobileMenu');
  function toggleMenu() {
    var open = mobileMenu.classList.toggle('open');
    document.body.classList.toggle('menu-open', open);
  }
  function closeMenu() {
    mobileMenu.classList.remove('open');
    document.body.classList.remove('menu-open');
  }
  var headerMenu = document.getElementById('headerMenu');
  if (headerMenu) headerMenu.addEventListener('click', toggleMenu);
  if (hamburger) hamburger.addEventListener('click', toggleMenu);
  if (mobileMenu) {
    mobileMenu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', closeMenu);
    });
  }

  // FAQ 아코디언
  document.querySelectorAll('.faq-item').forEach(function (item) {
    var q = item.querySelector('.faq-q');
    var a = item.querySelector('.faq-a');
    q.addEventListener('click', function () {
      var isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(function (other) {
        other.classList.remove('open');
        other.querySelector('.faq-a').style.maxHeight = null;
      });
      if (!isOpen) {
        item.classList.add('open');
        a.style.maxHeight = a.scrollHeight + 'px';
      }
    });
  });

  // 모달
  var modal = document.getElementById('thanksModal');
  var modalClose = document.getElementById('modalClose');
  function openModal() { modal.classList.add('open'); }
  function closeModal() { modal.classList.remove('open'); }
  if (modalClose) modalClose.addEventListener('click', closeModal);
  if (modal) modal.addEventListener('click', function (e) { if (e.target === modal) closeModal(); });

  // 입지 프리미엄 슬라이더
  var slider = document.getElementById('plocSlider');
  if (slider) {
    var track = slider.querySelector('.ploc-track');
    var slides = slider.querySelectorAll('.ploc-slide');
    var dots = slider.querySelectorAll('.ploc-dots button');
    var total = slides.length;
    var cur = 0;
    function goTo(i) {
      cur = (i + total) % total;
      track.style.transform = 'translateX(-' + (cur * 100) + '%)';
      dots.forEach(function (d, n) { d.classList.toggle('active', n === cur); });
    }
    slider.querySelector('.prev').addEventListener('click', function () { goTo(cur - 1); });
    slider.querySelector('.next').addEventListener('click', function () { goTo(cur + 1); });
    dots.forEach(function (d, n) { d.addEventListener('click', function () { goTo(n); }); });
  }

  // 평면도 타입 탭
  var floorViewer = document.getElementById('floorplan');
  if (floorViewer) {
    floorViewer.addEventListener('click', function (e) {
      var tab = e.target.closest('.ftab');
      if (!tab || !floorViewer.contains(tab)) return;
      var type = tab.getAttribute('data-type');
      floorViewer.querySelectorAll('.ftab').forEach(function (t) {
        t.classList.toggle('active', t.getAttribute('data-type') === type);
      });
      floorViewer.querySelectorAll('.floor-panel').forEach(function (p) {
        p.classList.toggle('active', p.getAttribute('data-type') === type);
      });
    });
  }

  // AMENITY 슬라이더 (여러 개 지원)
  document.querySelectorAll('.am-slider').forEach(function (amSlider) {
    var amSlides = amSlider.querySelectorAll('.am-slide');
    if (!amSlides.length) return;
    var amN = amSlides.length, amIdx = 0;
    function amShow(i) {
      amIdx = (i + amN) % amN;
      amSlides.forEach(function (s, k) { s.classList.toggle('active', k === amIdx); });
    }
    var amTimer;
    function amStart() { amTimer = setInterval(function () { amShow(amIdx + 1); }, 2800); }
    function amReset() { clearInterval(amTimer); amStart(); }
    amSlider.addEventListener('click', function (e) {
      if (e.target.closest('.am-prev')) { amShow(amIdx - 1); amReset(); }
      else if (e.target.closest('.am-next')) { amShow(amIdx + 1); amReset(); }
    });
    amSlider.addEventListener('mouseenter', function () { clearInterval(amTimer); });
    amSlider.addEventListener('mouseleave', amStart);
    // 모바일 터치 스와이프
    var tStartX = null, tStartY = null;
    amSlider.addEventListener('touchstart', function (e) {
      tStartX = e.changedTouches[0].clientX; tStartY = e.changedTouches[0].clientY;
      clearInterval(amTimer);
    }, { passive: true });
    amSlider.addEventListener('touchend', function (e) {
      if (tStartX === null) return;
      var dx = e.changedTouches[0].clientX - tStartX;
      var dy = e.changedTouches[0].clientY - tStartY;
      if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) {
        if (dx < 0) amShow(amIdx + 1); else amShow(amIdx - 1);
      }
      tStartX = null; amReset();
    }, { passive: true });
    amStart();
  });

  // TOP 버튼
  var topBtn = document.getElementById('topBtn');
  if (topBtn) {
    topBtn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // 폼 제출 처리
  // ※ 실제 DB 연동: 아래 sendLead() 안에서 서버 API / 구글시트 / 메일 전송으로 교체하세요.
  // 구글 시트 연동: 아래 URL을 본인 Apps Script 웹앱 주소로 교체하세요.
  var LEAD_ENDPOINT = 'https://script.google.com/macros/s/AKfycbyo-GKEic81CJ9ybo5vnZVrxA5n2MeEUQasdVphPf2xfMnzW7_JChssM3a9sZV_lBFF/exec';

  function sendLead(data) {
    console.log('[관심고객 DB]', data);
    if (!LEAD_ENDPOINT || LEAD_ENDPOINT.indexOf('http') !== 0) {
      return Promise.resolve(); // 엔드포인트 미설정 시 통과(개발용)
    }
    return fetch(LEAD_ENDPOINT, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
      body: new URLSearchParams(data).toString()
    }).then(function () {}).catch(function () {});
  }

  document.querySelectorAll('form[data-form]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = form.querySelector('[name="name"]');
      var phone = form.querySelector('[name="phone"]');
      var agree = form.querySelector('[name="agree"]');

      if (!name.value.trim()) { alert('성함을 입력해 주세요.'); name.focus(); return; }
      var digits = phone.value.replace(/[^0-9]/g, '');
      if (digits.length < 10) { alert('연락처를 정확히 입력해 주세요.'); phone.focus(); return; }
      if (agree && !agree.checked) { alert('개인정보 수집·이용에 동의해 주세요.'); return; }

      var data = {
        source: form.getAttribute('data-form'),
        name: name.value.trim(),
        phone: digits,
        type: (form.querySelector('[name="type"]') || {}).value || '',
        message: (form.querySelector('[name="message"]') || {}).value || '',
        time: new Date().toISOString()
      };

      sendLead(data).then(function () {
        form.reset();
        openModal();
      });
    });
  });

  // 연락처 숫자만 입력
  document.querySelectorAll('input[name="phone"]').forEach(function (input) {
    input.addEventListener('input', function () {
      this.value = this.value.replace(/[^0-9]/g, '');
    });
  });
})();
