class QuestionLoader {
    constructor() {
        this.questions = [];
        this.currentIndex = 0;
        this.init();
    }

    async init() {
        try {
            await this.loadQuestions();
            this.displayRandomQuestion();
        } catch (error) {
            console.error('Error initializing QuestionLoader:', error);
            this.displayError();
        }
    }

    async loadQuestions() {
        try {
            const response = await fetch('./questions.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            this.questions = data.questions || [];
        } catch (error) {
            console.error('Error loading questions:', error);
            throw error;
        }
    }

    getRandomQuestion() {
        if (this.questions.length === 0) {
            return { question: { q: "No questions available" }, index: -1 };
        }
        const randomIndex = Math.floor(Math.random() * this.questions.length);
        this.currentIndex = randomIndex;
        return { question: this.questions[randomIndex], index: randomIndex };
    }

    displayRandomQuestion() {
        const { question, index } = this.getRandomQuestion();
        this.displayCurrentQuestion();
    }

    displayCurrentQuestion() {
        const $questionElement = $('#qotd');
        const $questionNumberElement = $('#question-number');

        if (!$questionElement.length) {
            console.error('Element with ID "qotd" not found');
            return;
        }

        if (!$questionNumberElement.length) {
            console.error('Element with ID "question-number" not found');
            return;
        }

        const question = this.questions[this.currentIndex];
        $questionElement.text(question.q);

        // Adjust font-size to fit without causing page scroll
        if (typeof this.adjustQuestionFont === 'function') {
            this.adjustQuestionFont();
        }

        // Set question number (index + 1 for 1-based numbering)
        $questionNumberElement.text(`#${this.currentIndex + 1}`);

        // Enable/disable prev/next buttons based on bounds
        const $prevBtn = $('#prev-btn');
        const $nextBtn = $('#next-btn');

        if ($prevBtn.length) {
            $prevBtn.prop('disabled', this.currentIndex <= 0);
        }

        if ($nextBtn.length) {
            $nextBtn.prop('disabled', this.currentIndex >= this.questions.length - 1);
        }
    }

    setupEventListeners() {
        // Method removed; listeners will be attached externally in document ready
    }

    previousQuestion() {
        if (this.questions.length === 0) return;
        // Don't wrap; if already at first question, do nothing
        if (this.currentIndex === 0) return;
        this.currentIndex = this.currentIndex - 1;
        this.displayCurrentQuestion();
    }

    nextQuestion() {
        if (this.questions.length === 0) return;
        // Don't wrap; if already at last question, do nothing
        if (this.currentIndex >= this.questions.length - 1) return;
        this.currentIndex = this.currentIndex + 1;
        this.displayCurrentQuestion();
    }

    randomQuestion() {
        if (this.questions.length === 0) return;

        this.currentIndex = Math.floor(Math.random() * this.questions.length);
        this.displayCurrentQuestion();
    }

    displayError() {
        const $questionElement = $('#qotd');
        if ($questionElement.length) {
            $questionElement.text("Failed to load question. Please try refreshing the page.");
        }
    }

    // Sets up resize/observer and exposes `adjustQuestionFont()` as a helper
    setupResizer() {
        const q = document.getElementById('qotd');
        if (!q) return;

        this._Q_MAX_REM = 3.5;
        this._Q_MIN_REM = 0.6;

        const setRem = (r) => { q.style.fontSize = r + 'rem'; };
        const fits = () => document.documentElement.scrollHeight <= window.innerHeight + 1;
        const debounce = (fn, wait) => {
            let t;
            return function() { clearTimeout(t); t = setTimeout(fn, wait); };
        };

        const findBestSize = () => {
            let low = this._Q_MIN_REM, high = this._Q_MAX_REM, best = this._Q_MIN_REM;
            const eps = 0.02;
            while (high - low > eps) {
                const mid = (low + high) / 2;
                setRem(mid);
                if (fits()) { best = mid; low = mid; } else { high = mid; }
            }
            setRem(Math.round(best * 100) / 100);
        };

        this.adjustQuestionFont = debounce(() => { requestAnimationFrame(findBestSize); }, 80);

        const mo = new MutationObserver(this.adjustQuestionFont);
        mo.observe(q, { childList: true, subtree: true, characterData: true });

        window.addEventListener('resize', this.adjustQuestionFont, { passive: true });

        // initial run
        requestAnimationFrame(this.adjustQuestionFont);
    }

}

// Initialize the question loader when the DOM is loaded
$(document).ready(() => {
    const loader = new QuestionLoader();

    const $prevBtn = $('#prev-btn');
    const $nextBtn = $('#next-btn');
    const $randomBtn = $('#random-btn');

    if ($prevBtn.length) {
        $prevBtn.on('click', () => loader.previousQuestion());
    }

    if ($nextBtn.length) {
        $nextBtn.on('click', () => loader.nextQuestion());
    }

    if ($randomBtn.length) {
        $randomBtn.on('click', () => loader.randomQuestion());
    }

    // initialize resizer helpers attached to the loader
    if (typeof loader.setupResizer === 'function') {
        loader.setupResizer();
    }
});
