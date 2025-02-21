document.addEventListener('DOMContentLoaded', () => {
    const representingCountrySelect = document.getElementById('representing-country-select');
    const countrySelect = document.getElementById('country-select');
    const countryCrossoutSelect = document.getElementById('country-crossout-select');
    const addSpeakerButton = document.getElementById('add-speaker');
    const crossoutSpeakerButton = document.getElementById('crossout-speaker');
    const crossoutNextSpeakerButton = document.getElementById('crossout-next-speaker');
    const resetSpeakerListButton = document.getElementById('reset-speaker-list');
    const speakerList = document.getElementById('speaker-list');
    const sendNoteButton = document.getElementById('send-note');
    const noteInput = document.getElementById('note-input');
    const notesList = document.getElementById('notes-list');
    const clearNotesButton = document.getElementById('clear-notes');

    // Load speaker list from localStorage
    const loadSpeakers = () => {
        const speakers = JSON.parse(localStorage.getItem('speakers')) || [];
        speakerList.innerHTML = '';
        speakers.forEach(speaker => {
            const listItem = document.createElement('li');
            listItem.textContent = speaker.country;
            listItem.setAttribute('data-country', speaker.country);
            if (speaker.crossedOut) {
                listItem.classList.add('crossed-out');
                listItem.style.textDecoration = 'line-through';
            }
            speakerList.appendChild(listItem);
        });
    };

    // Save speaker list to localStorage
    const saveSpeakers = () => {
        const speakers = [];
        speakerList.querySelectorAll('li').forEach(item => {
            speakers.push({
                country: item.getAttribute('data-country'),
                crossedOut: item.classList.contains('crossed-out')
            });
        });
        localStorage.setItem('speakers', JSON.stringify(speakers));
    };

    // Load notes from localStorage
    const loadNotes = () => {
        const notes = JSON.parse(localStorage.getItem('notes')) || [];
        notesList.innerHTML = '';
        notes.forEach(note => {
            const listItem = document.createElement('li');
            listItem.textContent = `${note.country}: ${note.text}`;
            notesList.appendChild(listItem);
        });
    };

    // Save notes to localStorage
    const saveNotes = (note) => {
        const notes = JSON.parse(localStorage.getItem('notes')) || [];
        notes.push(note);
        localStorage.setItem('notes', JSON.stringify(notes));
    };

    // Update country selects based on representing country selection
    if (representingCountrySelect) {
        representingCountrySelect.addEventListener('change', () => {
            const selectedCountry = representingCountrySelect.value;
            if (countrySelect) countrySelect.value = selectedCountry;
            if (countryCrossoutSelect) countryCrossoutSelect.value = selectedCountry;
        });
    }

    if (addSpeakerButton) {
        addSpeakerButton.addEventListener('click', () => {
            const selectedCountry = representingCountrySelect.value;
            const existingSpeakers = document.querySelectorAll(`#speaker-list li[data-country="${selectedCountry}"]`);
            const crossedOutSpeakers = Array.from(existingSpeakers).filter(speaker => speaker.classList.contains('crossed-out'));

            if (existingSpeakers.length === 0 || (crossedOutSpeakers.length > 0 && existingSpeakers.length === crossedOutSpeakers.length)) {
                const listItem = document.createElement('li');
                listItem.textContent = selectedCountry;
                listItem.setAttribute('data-country', selectedCountry);
                speakerList.appendChild(listItem);
                saveSpeakers();
            } else {
                alert('This country is already in the speaker list.');
            }
        });
    }

    if (crossoutSpeakerButton) {
        crossoutSpeakerButton.addEventListener('click', () => {
            const selectedCountry = countryCrossoutSelect.value;
            const existingSpeaker = document.querySelector(`#speaker-list li[data-country="${selectedCountry}"]`);

            if (existingSpeaker) {
                existingSpeaker.classList.add('crossed-out');
                existingSpeaker.style.textDecoration = 'line-through';
                saveSpeakers();
            } else {
                alert('This country is not in the speaker list.');
            }
        });
    }

    if (crossoutNextSpeakerButton) {
        crossoutNextSpeakerButton.addEventListener('click', () => {
            const nextSpeaker = speakerList.querySelector('li:not(.crossed-out)');
            if (nextSpeaker) {
                nextSpeaker.classList.add('crossed-out');
                nextSpeaker.style.textDecoration = 'line-through';
                saveSpeakers();
            } else {
                alert('All speakers are already crossed out.');
            }
        });
    }

    if (resetSpeakerListButton) {
        resetSpeakerListButton.addEventListener('click', () => {
            if (confirm('Are you sure you want to reset the speaker list?')) {
                localStorage.removeItem('speakers');
                speakerList.innerHTML = '';
                window.dispatchEvent(new Event('storage')); // Trigger storage event to sync across tabs
            }
        });
    }

    if (sendNoteButton) {
        sendNoteButton.addEventListener('click', () => {
            const noteText = noteInput.value.trim();
            const selectedCountry = representingCountrySelect.value;
            if (noteText) {
                const note = { country: selectedCountry, text: noteText };
                saveNotes(note);
                noteInput.value = '';
                window.dispatchEvent(new Event('storage')); // Trigger storage event to sync across tabs
            } else {
                alert('Please enter a note.');
            }
        });
    }

    if (clearNotesButton) {
        clearNotesButton.addEventListener('click', () => {
            if (confirm('Are you sure you want to clear all notes?')) {
                localStorage.removeItem('notes');
                notesList.innerHTML = '';
                window.dispatchEvent(new Event('storage')); // Trigger storage event to sync across tabs
            }
        });
    }

    // Listen for storage events to sync across tabs
    window.addEventListener('storage', (event) => {
        if (event.key === 'speakers') {
            loadSpeakers();
        } else if (event.key === 'notes') {
            loadNotes();
        }
    });

    // Load speakers and notes on page load
    loadSpeakers();
    loadNotes();
});