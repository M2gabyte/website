// CBT Worry Helper - Lightweight local AI for cognitive reframing
// Uses transformers.js with small model (~200MB)

import { pipeline, env } from 'https://cdn.jsdelivr.net/npm/@xenova/transformers@2.17.2';

env.allowLocalModels = false;

let generator = null;
let currentWorry = null;
let currentResponse = null;
let currentDistortion = null;

// DOM Elements
const statusEl = document.getElementById('status');
const statusText = document.getElementById('statusText');
const worryTextarea = document.getElementById('worry');
const analyzeBtn = document.getElementById('analyzeBtn');
const outputSection = document.getElementById('outputSection');
const responseDiv = document.getElementById('response');
const distortionBadge = document.getElementById('distortionBadge');
const saveBtn = document.getElementById('saveBtn');
const journalList = document.getElementById('journalList');

// Initialize model
async function initializeModel() {
    try {
        statusText.textContent = 'Loading (first time downloads ~200MB)...';

        generator = await pipeline('text2text-generation', 'Xenova/LaMini-Flan-T5-248M');

        statusText.textContent = 'Ready when you are';
        statusEl.classList.add('ready');
        analyzeBtn.disabled = false;

    } catch (error) {
        console.error('Failed to load:', error);
        statusText.textContent = 'Error loading. Please refresh.';
    }
}

// Common cognitive distortions
const distortions = [
    'Catastrophizing',
    'All-or-Nothing Thinking',
    'Overgeneralization',
    'Mind Reading',
    'Fortune Telling',
    'Emotional Reasoning',
    'Should Statements',
    'Labeling',
    'Personalization'
];

// Build CBT prompt
function buildPrompt(worry) {
    const prompt = `You are a kind CBT therapist. A person shares this worry: "${worry}"

Your task:
1. Identify the main cognitive distortion (catastrophizing, all-or-nothing thinking, overgeneralization, mind reading, fortune telling, emotional reasoning, should statements, labeling, or personalization)
2. Gently challenge the thought
3. Offer a balanced, realistic reframe

Format your response as:
Distortion: [name]
Reframe: [2-3 compassionate sentences offering a balanced perspective]

Response:`;

    return prompt;
}

// Analyze button
analyzeBtn.addEventListener('click', async () => {
    const worry = worryTextarea.value.trim();

    if (!worry) {
        alert('Please share what\'s worrying you');
        return;
    }

    if (!generator) {
        alert('Model not ready. Please wait a moment.');
        return;
    }

    analyzeBtn.disabled = true;
    analyzeBtn.textContent = 'Thinking...';
    responseDiv.textContent = '';
    outputSection.style.display = 'block';
    distortionBadge.textContent = 'Analyzing...';

    try {
        currentWorry = worry;
        const prompt = buildPrompt(worry);

        const result = await generator(prompt, {
            max_new_tokens: 250,
            temperature: 0.7,
            do_sample: true,
            top_p: 0.9
        });

        const fullResponse = result[0].generated_text.trim();

        // Parse response
        const distortionMatch = fullResponse.match(/Distortion:\s*(.+)/i);
        const reframeMatch = fullResponse.match(/Reframe:\s*(.+)/is);

        if (distortionMatch && reframeMatch) {
            currentDistortion = distortionMatch[1].trim();
            currentResponse = reframeMatch[1].trim();
        } else {
            // Fallback if parsing fails
            currentDistortion = 'Cognitive Distortion';
            currentResponse = fullResponse;
        }

        distortionBadge.textContent = currentDistortion;

        // Type out the reframe
        await typeWriter(responseDiv, currentResponse, 15);

    } catch (error) {
        console.error('Error:', error);
        responseDiv.textContent = 'Something went wrong. Please try again.';
        distortionBadge.textContent = '';
    } finally {
        analyzeBtn.disabled = false;
        analyzeBtn.textContent = 'Help me see this clearly';
    }
});

// Typewriter effect
async function typeWriter(element, text, speed = 15) {
    element.textContent = '';
    for (let i = 0; i < text.length; i++) {
        element.textContent += text.charAt(i);
        element.scrollTop = element.scrollHeight;
        await new Promise(resolve => setTimeout(resolve, speed));
    }
}

// Save to journal
saveBtn.addEventListener('click', () => {
    if (!currentWorry || !currentResponse) {
        return;
    }

    const entry = {
        id: Date.now(),
        date: new Date().toISOString(),
        worry: currentWorry,
        distortion: currentDistortion,
        response: currentResponse
    };

    const journal = getJournal();
    journal.unshift(entry);
    localStorage.setItem('cbt-journal', JSON.stringify(journal));

    displayJournal();

    worryTextarea.value = '';
    outputSection.style.display = 'none';
    currentWorry = null;
    currentResponse = null;
    currentDistortion = null;

    // Smooth scroll to journal
    document.querySelector('.journal-section').scrollIntoView({ behavior: 'smooth' });
});

// Get journal
function getJournal() {
    const stored = localStorage.getItem('cbt-journal');
    return stored ? JSON.parse(stored) : [];
}

// Display journal
function displayJournal() {
    const journal = getJournal();

    if (journal.length === 0) {
        journalList.innerHTML = '<p class="empty-state">Your reframed thoughts will appear here</p>';
        return;
    }

    journalList.innerHTML = journal.map(entry => `
        <div class="journal-entry">
            <div class="journal-entry-header">
                <span class="journal-entry-date">${new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                <button class="journal-entry-delete" onclick="deleteEntry(${entry.id})">Delete</button>
            </div>
            <div class="journal-entry-worry">"${entry.worry}"</div>
            <div class="journal-entry-response">${entry.response}</div>
        </div>
    `).join('');
}

// Delete entry
window.deleteEntry = function(id) {
    if (!confirm('Delete this entry?')) return;

    let journal = getJournal();
    journal = journal.filter(e => e.id !== id);
    localStorage.setItem('cbt-journal', JSON.stringify(journal));
    displayJournal();
};

// Init
window.addEventListener('load', () => {
    displayJournal();
    initializeModel();
});
