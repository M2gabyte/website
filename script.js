// Jungian Interpreter - Local LLM powered dream and reflection analysis
// Uses WebLLM for in-browser AI (no server needed)

// Import WebLLM (using CDN for simplicity)
import * as webllm from "https://esm.run/@mlc-ai/web-llm";

let engine = null;
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

// Initialize WebLLM
async function initializeModel() {
    try {
        statusText.textContent = 'Loading model (first time will download ~1-2GB)...';

        engine = await webllm.CreateMLCEngine(
            "Llama-3.1-8B-Instruct-q4f32_1-MLC",
            {
                initProgressCallback: (progress) => {
                    statusText.textContent = `Loading: ${Math.round(progress.progress * 100)}%`;
                }
            }
        );

        statusText.textContent = 'Model ready';
        statusEl.classList.add('ready');
        interpretBtn.disabled = false;
        modelNameSpan.textContent = 'Llama 3.1 8B (Local)';

    } catch (error) {
        console.error('Failed to initialize model:', error);
        statusText.textContent = 'Error loading model. Check console.';
    }
}

// Build Jungian prompt based on options
function buildPrompt(text) {
    let systemPrompt = `You are a Jungian analyst. Provide thoughtful interpretation of dreams and reflections through the lens of Jungian psychology.`;

    let focusAreas = [];
    if (focusArchetypes.checked) focusAreas.push('archetypal patterns');
    if (focusShadow.checked) focusAreas.push('shadow aspects');
    if (focusSymbols.checked) focusAreas.push('symbolic meanings');

    if (focusAreas.length > 0) {
        systemPrompt += ` Focus particularly on ${focusAreas.join(', ')}.`;
    }

    systemPrompt += ` Be specific, insightful, and avoid generic interpretations. Limit response to 200-300 words.`;

    return [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Please analyze this dream/reflection from a Jungian perspective:\n\n${text}` }
    ];
}

// Interpret button handler
interpretBtn.addEventListener('click', async () => {
    const text = entryTextarea.value.trim();

    if (!text) {
        alert('Please enter a dream or reflection to interpret.');
        return;
    }

    if (!engine) {
        alert('Model not ready yet. Please wait.');
        return;
    }

    // Disable button and show loading
    interpretBtn.disabled = true;
    interpretBtn.textContent = 'Interpreting...';
    interpretationDiv.textContent = '';
    outputSection.style.display = 'block';

    try {
        currentEntry = text;
        const messages = buildPrompt(text);

        // Stream response
        let fullResponse = '';

        const completion = await engine.chat.completions.create({
            messages: messages,
            stream: true,
            temperature: 0.7,
            max_tokens: 400
        });

        for await (const chunk of completion) {
            const content = chunk.choices[0]?.delta?.content || '';
            fullResponse += content;
            interpretationDiv.textContent = fullResponse;

            // Auto scroll
            interpretationDiv.scrollTop = interpretationDiv.scrollHeight;
        }

        currentInterpretation = fullResponse;

    } catch (error) {
        console.error('Interpretation error:', error);
        interpretationDiv.textContent = 'Error generating interpretation. Please try again.';
    } finally {
        interpretBtn.disabled = false;
        interpretBtn.textContent = 'Interpret';
    }
});

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
