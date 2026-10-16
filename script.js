document.addEventListener('DOMContentLoaded', () => {
    // --- TAB SYSTEM ---
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            btn.classList.add('active');
            document.getElementById(btn.dataset.tab).classList.add('active');
        });
    });

    // --- MODULE 1: PREDICTOR LOGIC ---
    const predictBtn = document.getElementById('predict-btn');
    const resultBox = document.getElementById('prediction-result');

    predictBtn.addEventListener('click', () => {
        const substrate = document.getElementById('substrate').value;
        const nuc = document.getElementById('nucleophile').value;
        const solvent = document.getElementById('solvent').value;
        const temp = document.getElementById('temp').value;

        let major = "", minor = "", rate = "", stereochem = "", rationale = "";

        if (substrate === 'methyl') {
            if (nuc === 'weak_base_weak_nuc') {
                major = "No Reaction"; minor = "None";
                rate = "N/A"; stereochem = "None";
                rationale = "Methyl halides do not undergo SN1/E1 (unstable carbocation) and weak nucleophiles are too slow for SN2.";
            } else {
                major = "SN2"; minor = "None";
                rate = "Rate = k[R-X][Nuc]"; stereochem = "Inversion of Configuration (Walden Inversion)";
                rationale = "Unhindered methyl substrate allows fast backside attack by nucleophile.";
            }
        } else if (substrate === 'primary') {
            if (nuc === 'strong_base_bulky') {
                major = "E2"; minor = "SN2";
                rate = "Rate = k[R-X][Base]"; stereochem = "Anti-periplanar geometry required";
                rationale = "Bulky strong base (like t-BuO-) cannot access substrate for substitution, favoring E2 elimination.";
            } else if (nuc === 'strong_base_strong_nuc') {
                major = "SN2"; minor = "E2";
                rate = "Rate = k[R-X][Nuc]"; stereochem = "Inversion";
                rationale = "Primary halide favors SN2 backside attack over E2.";
            } else if (nuc === 'weak_base_strong_nuc') {
                major = "SN2"; minor = "None";
                rate = "Rate = k[R-X][Nuc]"; stereochem = "Inversion";
                rationale = "Good nucleophile with poor base leads exclusively to SN2.";
            } else {
                major = "No Reaction"; minor = "None";
                rate = "N/A"; stereochem = "None";
                rationale = "Primary carbocation is too unstable for SN1/E1.";
            }
        } else if (substrate === 'secondary') {
            if (nuc === 'strong_base_strong_nuc' || nuc === 'strong_base_bulky') {
                major = "E2"; minor = "SN2";
                rate = "Rate = k[R-X][Base]"; stereochem = "Anti-periplanar (Zaitsev/Hofmann Product)";
                rationale = "Strong base promotes E2 elimination on secondary substrate due to steric hindrance.";
            } else if (nuc === 'weak_base_strong_nuc') {
                major = "SN2"; minor = "SN1";
                rate = "Rate = k[R-X][Nuc]"; stereochem = "Inversion of configuration";
                rationale = "Good nucleophile with weak base promotes SN2, especially in polar aprotic solvents.";
            } else {
                major = temp === 'heat' ? "E1" : "SN1";
                minor = temp === 'heat' ? "SN1" : "E1";
                rate = "Rate = k[R-X]"; stereochem = "Racemization (Retention + Inversion)";
                rationale = "Weak nucleophile/base allows carbocation formation (SN1/E1). High temperature favors E1.";
            }
        } else if (substrate === 'tertiary') {
            if (nuc.includes('strong_base')) {
                major = "E2"; minor = "None";
                rate = "Rate = k[R-X][Base]"; stereochem = "Anti-periplanar";
                rationale = "Steric hindrance prevents SN2 completely; strong base triggers E2.";
            } else {
                major = temp === 'heat' ? "E1" : "SN1";
                minor = temp === 'heat' ? "SN1" : "E1";
                rate = "Rate = k[R-X]"; stereochem = "Racemization";
                rationale = "Stable tertiary carbocation intermediate forms via solvolysis.";
            }
        }

        document.getElementById('major-path').textContent = major;
        document.getElementById('minor-path').textContent = minor;
        document.getElementById('rate-law').textContent = rate;
        document.getElementById('stereochem').textContent = stereochem;
        document.getElementById('rationale').textContent = rationale;

        resultBox.classList.remove('hidden');
    });

    // --- MODULE 2: VISUALIZER LOGIC ---
    const mechData = {
        SN2: [
            { title: "Backside Attack & Transition State", desc: "The nucleophile approaches the substrate from the opposite side of the leaving group (180°). A concerted transition state is formed where bond-making and bond-breaking happen simultaneously.", svg: `<svg width="250" height="120" viewBox="0 0 250 120"><text x="10" y="60" fill="#06b6d4" font-size="16">Nu⁻ ↷</text><text x="70" y="60" fill="#fff" font-size="18">C — Br</text><text x="160" y="60" fill="#ef4444" font-size="16">⤻ Br⁻</text></svg>` },
            { title: "Inversion of Configuration", desc: "The leaving group leaves, resulting in complete inversion of stereochemistry at the chiral center (Walden Inversion).", svg: `<svg width="250" height="120" viewBox="0 0 250 120"><text x="60" y="60" fill="#10b981" font-size="18">Nu — C</text><text x="160" y="60" fill="#ef4444" font-size="16">+ Br⁻</text></svg>` }
        ],
        SN1: [
            { title: "Leaving Group Departure (Rate-Determining)", desc: "The C-X bond cleaves heterolytically to form a planar carbocation intermediate.", svg: `<svg width="250" height="120" viewBox="0 0 250 120"><text x="40" y="60" fill="#fff" font-size="18">R₃C—Br</text><text x="130" y="40" fill="#f59e0b" font-size="14">slow</text><text x="160" y="60" fill="#ef4444" font-size="16">⟶ Br⁻</text></svg>` },
            { title: "Nucleophilic Attack (Racemization)", desc: "The nucleophile can attack the planar carbocation from top or bottom face, giving a racemic mixture.", svg: `<svg width="250" height="120" viewBox="0 0 250 120"><text x="70" y="60" fill="#10b981" font-size="18">[R₃C⁺]</text><text x="150" y="60" fill="#06b6d4" font-size="16">← Nu⁻</text></svg>` }
        ],
        E2: [
            { title: "Concerted Proton Abstraction", desc: "Base abstracts beta-hydrogen anti-periplanar to the leaving group while double bond forms and leaving group departs.", svg: `<svg width="250" height="120" viewBox="0 0 250 120"><text x="20" y="40" fill="#06b6d4">B⁻ ↷ H</text><text x="80" y="60" fill="#fff">C — C — Br</text></svg>` },
            { title: "Alkene Formation", desc: "The product is a C=C double bond (Zaitsev or Hofmann alkene).", svg: `<svg width="250" height="120" viewBox="0 0 250 120"><text x="80" y="60" fill="#10b981" font-size="20">C = C</text></svg>` }
        ],
        E1: [
            { title: "Carbocation Intermediate Formation", desc: "Leaving group leaves to form carbocation in the slow rate-determining step.", svg: `<svg width="250" height="120" viewBox="0 0 250 120"><text x="50" y="60" fill="#fff">R₂CH—C⁺R₂</text></svg>` },
            { title: "Base Deprotonation", desc: "Weak base removes a proton from adjacent carbon to yield alkene.", svg: `<svg width="250" height="120" viewBox="0 0 250 120"><text x="80" y="60" fill="#10b981" font-size="20">R₂C = CR₂</text></svg>` }
        ]
    };

    let currentMech = "SN2";
    let currentStep = 0;

    const mechBtns = document.querySelectorAll('.mech-btn');
    const prevStepBtn = document.getElementById('prev-step-btn');
    const nextStepBtn = document.getElementById('next-step-btn');

    function updateVisualizer() {
        const steps = mechData[currentMech];
        const step = steps[currentStep];

        document.getElementById('step-title').textContent = step.title;
        document.getElementById('step-desc').textContent = step.desc;
        document.getElementById('svg-canvas').innerHTML = step.svg;
        document.getElementById('step-indicator').textContent = `Step ${currentStep + 1} of ${steps.length}`;

        prevStepBtn.disabled = currentStep === 0;
        nextStepBtn.disabled = currentStep === steps.length - 1;
    }

    mechBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            mechBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentMech = btn.dataset.mech;
            currentStep = 0;
            updateVisualizer();
        });
    });

    prevStepBtn.addEventListener('click', () => { if (currentStep > 0) { currentStep--; updateVisualizer(); } });
    nextStepBtn.addEventListener('click', () => { if (currentStep < mechData[currentMech].length - 1) { currentStep++; updateVisualizer(); } });

    updateVisualizer();

    // --- MODULE 3: QUIZ LOGIC ---
    const quizQuestions = [
        { q: "What is the major mechanism for: 2° Alkyl Halide + NaOEt (Strong Base/Strong Nuc) + Heat?", opts: ["SN1", "SN2", "E1", "E2"], ans: 3, exp: "Strong base with secondary substrate promotes E2 elimination." },
        { q: "Which reaction results in inversion of stereochemistry (Walden Inversion)?", opts: ["SN1", "SN2", "E1", "E2"], ans: 1, exp: "SN2 proceeds via backside attack, causing inversion." },
        { q: "What is the major product pathway for: 3° Alkyl Halide + H2O (Room Temp)?", opts: ["SN1", "SN2", "E1", "E2"], ans: 0, exp: "3° substrate with weak nucleophile/base undergoes SN1 solvolysis." }
    ];

    let quizIdx = 0, score = 0;

    function loadQuestion() {
        const q = quizQuestions[quizIdx];
        document.getElementById('quiz-question').textContent = q.q;
        const optsContainer = document.getElementById('quiz-options');
        optsContainer.innerHTML = '';
        document.getElementById('quiz-feedback').classList.add('hidden');
        document.getElementById('next-quiz-btn').classList.add('hidden');

        q.opts.forEach((opt, idx) => {
            const btn = document.createElement('button');
            btn.classList.add('quiz-option');
            btn.textContent = opt;
            btn.addEventListener('click', () => selectAnswer(idx));
            optsContainer.appendChild(btn);
        });

        document.getElementById('total-val').textContent = quizQuestions.length;
    }

    function selectAnswer(selectedIdx) {
        const q = quizQuestions[quizIdx];
        const buttons = document.querySelectorAll('.quiz-option');
        buttons.forEach(b => b.style.pointerEvents = 'none');

        const feedback = document.getElementById('quiz-feedback');
        if (selectedIdx === q.ans) {
            score++;
            buttons[selectedIdx].classList.add('correct');
            feedback.textContent = `Correct! 🎉 ${q.exp}`;
        } else {
            buttons[selectedIdx].classList.add('incorrect');
            buttons[q.ans].classList.add('correct');
            feedback.textContent = `Incorrect! ❌ ${q.exp}`;
        }

        document.getElementById('score-val').textContent = score;
        feedback.classList.remove('hidden');
        document.getElementById('next-quiz-btn').classList.remove('hidden');
    }

    document.getElementById('next-quiz-btn').addEventListener('click', () => {
        quizIdx = (quizIdx + 1) % quizQuestions.length;
        loadQuestion();
    });

    loadQuestion();
});
