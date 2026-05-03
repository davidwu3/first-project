(function () {
  var GOAL_ID = 'CONVERT_GOAL_ID_PLACEHOLDER';
  var TARGET_SELECTOR = 'CONVERT_TARGET_SELECTOR_PLACEHOLDER';

  var faqs = [
    {
      q: 'How are skin-picking and hair-pulling disorders classified diagnostically?',
      a: 'Both are classified in the DSM-5 under Obsessive-Compulsive and Related Disorders. Excoriation (skin-picking) disorder involves recurrent picking of skin causing lesions, while trichotillomania (hair-pulling disorder) involves recurrent compulsive urges to pull hair from the scalp, eyebrows, eyelashes, or other areas. Together they are often referred to as Body-Focused Repetitive Behaviors (BFRBs).'
    },
    {
      q: 'How prevalent are these disorders?',
      a: 'Excoriation disorder affects an estimated 1.4–5% of the general population, and trichotillomania affects approximately 1–2% over a lifetime. Both are likely underdiagnosed due to patient shame and limited clinician awareness. They occur across all ages but often onset in adolescence.'
    },
    {
      q: 'How do I screen for BFRBs in clinical practice?',
      a: 'A simple opening question is: "Do you find yourself repeatedly picking at your skin or pulling your hair in a way that feels hard to stop?" The Milwaukee Inventory for Subtypes of Trichotillomania (MIST) and the Skin Picking Scale-Revised (SPS-R) are validated tools for severity assessment. Many patients won\'t volunteer symptoms without being asked directly.'
    },
    {
      q: 'What are the first-line treatments?',
      a: 'Cognitive Behavioral Therapy (CBT) — specifically Habit Reversal Training (HRT) and the Comprehensive Behavioral Treatment model (ComB) — is the first-line treatment for both disorders. These approaches help patients identify triggers, increase awareness, and develop competing responses. Referral to a therapist trained in BFRBs is strongly recommended.'
    },
    {
      q: 'Are there FDA-approved medications for these disorders?',
      a: 'No medications are currently FDA-approved specifically for excoriation disorder or trichotillomania. N-Acetylcysteine (NAC) has the strongest evidence among supplements, with clinical trials showing benefit in both conditions. SSRIs show mixed results; clomipramine has some evidence for trichotillomania. Medication is generally used as an adjunct to behavioral therapy, not as a standalone treatment.'
    },
    {
      q: 'How do BFRBs differ from OCD?',
      a: 'Unlike OCD, BFRBs are not primarily driven by intrusive thoughts or fear of harm. The urge to pick or pull is often described as tension relief or sensory satisfaction rather than preventing a feared outcome. Patients may perform the behavior automatically or with focused intent. ERP used in OCD is less effective for BFRBs than HRT or ComB.'
    },
    {
      q: 'What triggers these behaviors, and how do I help patients identify them?',
      a: 'Common triggers include stress, boredom, fatigue, and sensory cues such as feeling a scab or uneven hair. Triggers can be emotional, cognitive, sensory, or situational. Ask patients to track when, where, and what they were doing when the behavior occurred. This self-monitoring is itself a core component of HRT and builds the awareness needed for intervention.'
    },
    {
      q: 'When should I refer to a specialist, and where can I find one?',
      a: 'Refer when the behavior is causing significant distress, skin infections, hair loss, or functional impairment, or when the patient has tried self-help strategies without success. The TLC Foundation for Body-Focused Repetitive Behaviors (bfrb.org) maintains a therapist directory of clinicians trained in BFRB treatment. Telehealth has significantly expanded access to BFRB-specialized therapists.'
    }
  ];

  var css = [
    '#faq-carousel-module *{box-sizing:border-box;margin:0;padding:0;}',
    '#faq-carousel-module{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;background:#f0f6fb;border:1px solid #cde0f0;border-radius:10px;padding:32px 40px 24px;max-width:760px;margin:32px auto;position:relative;}',
    '#faq-carousel-module .fcm-label{font-size:11px;font-weight:700;letter-spacing:1.2px;text-transform:uppercase;color:#5b8db8;margin-bottom:12px;}',
    '#faq-carousel-module .fcm-track{overflow:hidden;}',
    '#faq-carousel-module .fcm-slide{display:none;}',
    '#faq-carousel-module .fcm-slide.fcm-active{display:block;}',
    '#faq-carousel-module .fcm-question{font-size:17px;font-weight:700;color:#1a3a52;margin-bottom:12px;line-height:1.4;}',
    '#faq-carousel-module .fcm-answer{font-size:15px;color:#3d5a72;line-height:1.65;min-height:90px;}',
    '#faq-carousel-module .fcm-nav{display:flex;align-items:center;justify-content:space-between;margin-top:24px;}',
    '#faq-carousel-module .fcm-btn{background:#1a6faf;color:#fff;border:none;border-radius:6px;padding:8px 20px;font-size:14px;font-weight:600;cursor:pointer;transition:background 0.15s;}',
    '#faq-carousel-module .fcm-btn:hover{background:#155a8e;}',
    '#faq-carousel-module .fcm-btn:disabled{background:#b0c8de;cursor:default;}',
    '#faq-carousel-module .fcm-dots{display:flex;gap:7px;align-items:center;}',
    '#faq-carousel-module .fcm-dot{width:9px;height:9px;border-radius:50%;background:#b0c8de;border:none;cursor:pointer;padding:0;transition:background 0.15s;}',
    '#faq-carousel-module .fcm-dot.fcm-dot-active{background:#1a6faf;}',
    '#faq-carousel-module .fcm-counter{font-size:13px;color:#7a9db8;}'
  ].join('');

  var styleEl = document.createElement('style');
  styleEl.textContent = css;
  document.head.appendChild(styleEl);

  var wrapper = document.createElement('div');
  wrapper.id = 'faq-carousel-module';

  var label = document.createElement('div');
  label.className = 'fcm-label';
  label.textContent = 'Frequently Asked Questions — Skin-Picking & Hair-Pulling Disorders';
  wrapper.appendChild(label);

  var track = document.createElement('div');
  track.className = 'fcm-track';

  faqs.forEach(function (faq, i) {
    var slide = document.createElement('div');
    slide.className = 'fcm-slide' + (i === 0 ? ' fcm-active' : '');

    var q = document.createElement('p');
    q.className = 'fcm-question';
    q.textContent = faq.q;

    var a = document.createElement('p');
    a.className = 'fcm-answer';
    a.textContent = faq.a;

    slide.appendChild(q);
    slide.appendChild(a);
    track.appendChild(slide);
  });
  wrapper.appendChild(track);

  var nav = document.createElement('div');
  nav.className = 'fcm-nav';

  var prevBtn = document.createElement('button');
  prevBtn.className = 'fcm-btn';
  prevBtn.textContent = '← Prev';
  prevBtn.disabled = true;

  var dotsEl = document.createElement('div');
  dotsEl.className = 'fcm-dots';

  var dots = faqs.map(function (_, i) {
    var dot = document.createElement('button');
    dot.className = 'fcm-dot' + (i === 0 ? ' fcm-dot-active' : '');
    dot.setAttribute('aria-label', 'Go to question ' + (i + 1));
    dotsEl.appendChild(dot);
    return dot;
  });

  var counter = document.createElement('span');
  counter.className = 'fcm-counter';
  counter.textContent = '1 / ' + faqs.length;

  var nextBtn = document.createElement('button');
  nextBtn.className = 'fcm-btn';
  nextBtn.textContent = 'Next →';

  nav.appendChild(prevBtn);
  nav.appendChild(dotsEl);
  nav.appendChild(counter);
  nav.appendChild(nextBtn);
  wrapper.appendChild(nav);

  var current = 0;
  var slides = track.querySelectorAll('.fcm-slide');

  function goTo(index) {
    slides[current].classList.remove('fcm-active');
    dots[current].classList.remove('fcm-dot-active');
    current = index;
    slides[current].classList.add('fcm-active');
    dots[current].classList.add('fcm-dot-active');
    counter.textContent = (current + 1) + ' / ' + faqs.length;
    prevBtn.disabled = current === 0;
    nextBtn.disabled = current === faqs.length - 1;
    trackClick();
  }

  prevBtn.addEventListener('click', function () { if (current > 0) goTo(current - 1); });
  nextBtn.addEventListener('click', function () { if (current < faqs.length - 1) goTo(current + 1); });
  dots.forEach(function (dot, i) {
    dot.addEventListener('click', function () { if (i !== current) goTo(i); });
  });

  function trackClick() {
    try {
      window._conv_q = window._conv_q || [];
      window._conv_q.push(['triggerConversion', GOAL_ID]);
    } catch (e) {}
  }

  var target = document.querySelector(TARGET_SELECTOR);
  if (target) {
    target.insertAdjacentElement('afterend', wrapper);
  } else {
    document.body.appendChild(wrapper);
  }
})();
