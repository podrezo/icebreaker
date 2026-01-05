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

        if (this.questions.length === 0) {
            $questionElement.text("No questions available");
            $questionNumberElement.text('? of ?');
            return;
        }

        const question = this.questions[this.currentIndex];
        $questionElement.text(question.q);

        // Set question number (index + 1 for 1-based numbering)
        $questionNumberElement.text(`${this.currentIndex + 1} of ${this.questions.length}`);
    }

    setupEventListeners() {
        // Method removed; listeners will be attached externally in document ready
    }

    previousQuestion() {
        if (this.questions.length === 0) return;

        this.currentIndex = this.currentIndex === 0
            ? this.questions.length - 1
            : this.currentIndex - 1;

        this.displayCurrentQuestion();
    }

    nextQuestion() {
        if (this.questions.length === 0) return;

        this.currentIndex = this.currentIndex === this.questions.length - 1
            ? 0
            : this.currentIndex + 1;

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
});
