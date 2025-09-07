class QuestionLoader {
    constructor() {
        this.questions = [];
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
        return { question: this.questions[randomIndex], index: randomIndex };
    }

    displayRandomQuestion() {
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

        const { question, index } = this.getRandomQuestion();
        questionElement.textContent = question.q;

        // Set question number (index + 1 for 1-based numbering)
        if (index >= 0) {
            questionNumberElement.textContent = `${index + 1} of ${this.questions.length}`;
        } else {
            questionNumberElement.textContent = '? of ?';
        }
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
