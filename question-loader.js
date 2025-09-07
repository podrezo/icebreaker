class QuestionLoader {
    constructor() {
        this.questions = [];
        this.currentIndex = 0;
        this.init();
    }

    async init() {
        try {
            await this.loadQuestions();
            this.setupEventListeners();
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
        const questionElement = document.getElementById('qotd');
        const questionNumberElement = document.getElementById('question-number');

        if (!questionElement) {
            console.error('Element with ID "qotd" not found');
            return;
        }

        if (!questionNumberElement) {
            console.error('Element with ID "question-number" not found');
            return;
        }

        if (this.questions.length === 0) {
            questionElement.textContent = "No questions available";
            questionNumberElement.textContent = '? of ?';
            return;
        }

        const question = this.questions[this.currentIndex];
        questionElement.textContent = question.q;

        // Set question number (index + 1 for 1-based numbering)
        questionNumberElement.textContent = `${this.currentIndex + 1} of ${this.questions.length}`;
    }

    setupEventListeners() {
        const prevBtn = document.getElementById('prev-btn');
        const nextBtn = document.getElementById('next-btn');
        const randomBtn = document.getElementById('random-btn');

        if (prevBtn) {
            prevBtn.addEventListener('click', () => this.previousQuestion());
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => this.nextQuestion());
        }

        if (randomBtn) {
            randomBtn.addEventListener('click', () => this.randomQuestion());
        }
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
        const questionElement = document.getElementById('qotd');
        if (questionElement) {
            questionElement.textContent = "Failed to load question. Please try refreshing the page.";
        }
    }
}

// Initialize the question loader when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new QuestionLoader();
});
