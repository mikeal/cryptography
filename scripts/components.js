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

export { CodeHighlighter, BN }