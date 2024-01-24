import BN from './bn.bundle.js';
window.BN = BN

async function loadHighlightJs() {
    const hljs = await import('https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js');
    await import('https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/languages/javascript.min.js');
    hljs.highlightAll();
}

loadHighlightJs();
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

    connectedCallback() {
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

        hljs.highlightElement(codeElement);
    }
}
customElements.define('code-highlighter', CodeHighlighter);

export { CodeHighlighter, BN }