import BN from './bn.bundle.js';
window.BN = BN

async function loadHighlightJs() {
    // Import the Highlight.js library
    const hljs = await import('https://esm.run/highlight.js');

    // Import the JavaScript language module
    await import('https://esm.run/highlight.js/lib/languages/javascript.js');

    // Apply highlighting
    hljs.default.highlightAll();

    return hljs.default;
}

const hljsPromise = loadHighlightJs();
function loadHighlightJsCss() {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/arta.min.css';
    document.head.appendChild(link);
}

loadHighlightJsCss();

class CodeHighlighter extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    async connectedCallback() {
        const scriptId = this.getAttribute('script-id');
        const scriptElement = document.getElementById(scriptId);
        const code = scriptElement.textContent.trim();

        const linkElement = document.createElement('link');
        linkElement.rel = 'stylesheet';
        linkElement.href = 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/ascetic.min.css';

        const preElement = document.createElement('pre');
        const codeElement = document.createElement('code');

        codeElement.className = 'language-javascript';
        codeElement.textContent = code;

        preElement.appendChild(codeElement);
        this.shadowRoot.appendChild(linkElement);
        this.shadowRoot.appendChild(preElement);
        const hljs = await hljsPromise;
        hljs.highlightElement(codeElement);
    }
}
customElements.define('code-highlighter', CodeHighlighter);

class SlideshowButton extends HTMLElement {
    connectedCallback() {
        // Create the button
        const button = document.createElement('button');
        button.textContent = 'Start Slideshow';
        button.style.position = 'absolute';
        button.style.top = '10px';
        button.style.right = '10px';

        // Add the event listener
        button.addEventListener('click', () => {
            this.slideshowStart();
        });

        // Listen for the arrow keys and "esc" key
        document.addEventListener('keydown', (event) => {
            if (event.key === 'ArrowRight') {
                this.slideRight();
            } else if (event.key === 'ArrowLeft') {
                this.slideLeft();
            } else if (event.key === 'Escape') {
                this.slideshowStop();
            }
        });

        // Append the button to the shadow root
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.appendChild(button);
    }

    getCards() {
        return Array.from(document.getElementsByTagName('card'));
    }

    getCurrentCard() {
        return this.getCards().find(card => card.classList.contains('fullscreen'));
    }

    slideshowStart() {
        // Hide the button
        this.shadowRoot.querySelector('button').classList.add('hidden');

        // Get all card elements
        var cards = this.getCards();

        // If there are any cards, set the first one to fullscreen
        if (cards.length > 0) {
            cards[0].classList.add('fullscreen');
        }
    }

    slideshowStop() {
        // Show the button
        this.shadowRoot.querySelector('button').classList.remove('hidden');

        // Get all card elements
        var cards = this.getCards();

        // Remove the fullscreen class from all cards
        for (var i = 0; i < cards.length; i++) {
            cards[i].classList.remove('fullscreen');
        }
    }

    slideRight() {
        let currentCard = this.getCurrentCard();

        if (currentCard) {
            // Remove the fullscreen class from the current card
            currentCard.classList.remove('fullscreen');

            // Add the fullscreen class to the next card
            let nextIndex = (this.getCards().indexOf(currentCard) + 1) % this.getCards().length;
            let nextCard = this.getCards()[nextIndex];
            nextCard.classList.add('fullscreen');
        }
    }

    slideLeft() {
        let currentCard = this.getCurrentCard();

        if (currentCard) {
            // Remove the fullscreen class from the current card
            currentCard.classList.remove('fullscreen');

            // Add the fullscreen class to the previous card
            let prevIndex = (this.getCards().indexOf(currentCard) - 1 + this.getCards().length) % this.getCards().length;
            let prevCard = this.getCards()[prevIndex];
            prevCard.classList.add('fullscreen');
        }
    }
}

// Register the new element
customElements.define('slideshow-button', SlideshowButton);

export { CodeHighlighter, BN, SlideshowButton }