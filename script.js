// Jungian Interpreter - Lightweight version using transformers.js
// Uses smaller model (~200MB) that won't crash

import { pipeline, env } from 'https://cdn.jsdelivr.net/npm/@xenova/transformers@2.17.2';

// Disable local model loading
env.allowLocalModels = false;

let generator = null;
let currentEntry = null;
let currentInterpretation = null;

// DOM Elements
const statusEl = document.getElementById('status');
const statusText = document.getElementById('statusText');
const entryTextarea = document.getElementById('entry');
const interpretBtn = document.getElementById('interpretBtn');
const outputSection = document.getElementById('outputSection');
const interpretationDiv = document.getElementById('interpretation');
const saveBtn = document.getElementById('saveBtn');
const journalList = document.getElementById('journalList');
const modelNameSpan = document.getElementById('modelName');

// Focus options
const focusArchetypes = document.getElementById('focusArchetypes');
const focusShadow = document.getElementById('focusShadow');
const focusSymbols = document.getElementById('focusSymbols');

// Initialize transformers.js with lighter model
async function initializeModel() {
    try {
        statusText.textContent = 'Loading model (downloading ~200MB, first time only)...';

        // Use Flan-T5 small model - good balance of size and quality
        generator = await pipeline('text2text-generation', 'Xenova/LaMini-Flan-T5-248M');

        statusText.textContent = 'Model ready';
        statusEl.classList.add('ready');
        interpretBtn.disabled = false;
        modelNameSpan.textContent = 'LaMini-Flan-T5 248M (Local)';

    } catch (error) {
        console.error('Failed to initialize model:', error);
        statusText.textContent = 'Error loading model. Check console.';
    }
}

// Build Jungian prompt
function buildPrompt(text) {
    let prompt = `Analyze this dream or reflection using Jungian psychology. `;

    let focusAreas = [];
    if (focusArchetypes.checked) focusAreas.push('identify archetypal patterns (Hero, Shadow, Anima/Animus, Wise Old Man, etc.)');
    if (focusShadow.checked) focusAreas.push('explore shadow aspects and repressed elements');
    if (focusSymbols.checked) focusAreas.push('decode symbolic meanings from the collective unconscious');

    if (focusAreas.length > 0) {
        prompt += `Focus on: ${focusAreas.join(', ')}. `;
    }

    prompt += `Provide specific, insightful interpretation in 150-200 words.\n\nDream/Reflection: ${text}\n\nJungian Analysis:`;

    return prompt;
}

// Interpret button handler
interpretBtn.addEventListener('click', async () => {
    const text = entryTextarea.value.trim();

    if (!text) {
        alert('Please enter a dream or reflection to interpret.');
        return;
    }

    if (!generator) {
        alert('Model not ready yet. Please wait.');
        return;
    }

    // Disable button and show loading
    interpretBtn.disabled = true;
    interpretBtn.textContent = 'Interpreting...';
    interpretationDiv.textContent = 'Analyzing...';
    outputSection.style.display = 'block';

    try {
        currentEntry = text;
        const prompt = buildPrompt(text);

        // Generate interpretation
        const result = await generator(prompt, {
            max_new_tokens: 300,
            temperature: 0.7,
            do_sample: true,
            top_p: 0.9
        });

        const interpretation = result[0].generated_text.trim();
        currentInterpretation = interpretation;

        // Type out the response for nice effect
        await typeWriter(interpretationDiv, interpretation, 20);

    } catch (error) {
        console.error('Interpretation error:', error);
        interpretationDiv.textContent = 'Error generating interpretation. Please try again.';
    } finally {
        interpretBtn.disabled = false;
        interpretBtn.textContent = 'Interpret';
    }
});

// Typewriter effect
async function typeWriter(element, text, speed = 30) {
    element.textContent = '';
    for (let i = 0; i < text.length; i++) {
        element.textContent += text.charAt(i);
        element.scrollTop = element.scrollHeight;
        await new Promise(resolve => setTimeout(resolve, speed));
    }
}

// Save to journal
saveBtn.addEventListener('click', () => {
    if (!currentEntry || !currentInterpretation) {
        return;
    }

    const entry = {
        id: Date.now(),
        date: new Date().toISOString(),
        text: currentEntry,
        interpretation: currentInterpretation,
        options: {
            archetypes: focusArchetypes.checked,
            shadow: focusShadow.checked,
            symbols: focusSymbols.checked
        }
    };

    // Save to localStorage
    const journal = getJournal();
    journal.unshift(entry);
    localStorage.setItem('jungian-journal', JSON.stringify(journal));

    // Refresh display
    displayJournal();

    // Clear form
    entryTextarea.value = '';
    outputSection.style.display = 'none';
    currentEntry = null;
    currentInterpretation = null;

    alert('Entry saved to journal!');
});

// Get journal from localStorage
function getJournal() {
    const stored = localStorage.getItem('jungian-journal');
    return stored ? JSON.parse(stored) : [];
}

// Display journal entries
function displayJournal() {
    const journal = getJournal();

    if (journal.length === 0) {
        journalList.innerHTML = '<p class="empty-state">No entries yet. Your interpretations will appear here.</p>';
        return;
    }

    journalList.innerHTML = journal.map(entry => `
        <div class="journal-entry">
            <div class="journal-entry-header">
                <span class="journal-entry-date">${new Date(entry.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                <button class="journal-entry-delete" onclick="deleteEntry(${entry.id})">Delete</button>
            </div>
            <div class="journal-entry-text">"${entry.text.substring(0, 150)}${entry.text.length > 150 ? '...' : ''}"</div>
            <div class="journal-entry-interpretation">${entry.interpretation}</div>
        </div>
    `).join('');
}

// Delete entry
window.deleteEntry = function(id) {
    if (!confirm('Delete this entry?')) return;

    let journal = getJournal();
    journal = journal.filter(e => e.id !== id);
    localStorage.setItem('jungian-journal', JSON.stringify(journal));
    displayJournal();
};

// Initialize on load
window.addEventListener('load', () => {
    displayJournal();
    initializeModel();
});
