const API_URL = 'http://localhost:5000/api/medicines';

const medicineForm = document.getElementById('medicine-form');
const medicineList = document.getElementById('medicine-list');
const loadingEl = document.getElementById('loading');
const emptyStateEl = document.getElementById('empty-state');
const formMessage = document.getElementById('form-message');
const searchBox = document.getElementById('search-box');

let allMedicines = [];

// Fetch and display medicines on load
document.addEventListener('DOMContentLoaded', fetchMedicines);

async function fetchMedicines() {
    loadingEl.classList.remove('hidden');
    medicineList.innerHTML = '';
    emptyStateEl.classList.add('hidden');

    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Failed to fetch reminders');
        
        allMedicines = await response.json();
        renderMedicines(allMedicines);
    } catch (error) {
        console.error(error);
        showFormMessage('Could not connect to the backend server.', 'error');
    } finally {
        loadingEl.classList.add('hidden');
    }
}

function renderMedicines(medicines) {
    medicineList.innerHTML = '';
    if (medicines.length === 0) {
        emptyStateEl.classList.remove('hidden');
        return;
    }
    emptyStateEl.classList.add('hidden');

    medicines.forEach(med => {
        const card = document.createElement('div');
        card.className = 'med-card';
        card.innerHTML = `
            <div>
                <h3>${escapeHTML(med.name)}</h3>
                <p><strong>Dosage:</strong> ${escapeHTML(med.dosage)}</p>
                <p><strong>Time:</strong> ⏰ ${escapeHTML(med.time)}</p>
                <p><strong>Frequency:</strong> ${escapeHTML(med.frequency)}</p>
                ${med.notes ? `<p><strong>Notes:</strong> ${escapeHTML(med.notes)}</p>` : ''}
            </div>
            <button class="btn-danger" onclick="deleteMedicine(${med.id})">Delete</button>
        `;
        medicineList.appendChild(card);
    });
}

// Add Medicine Form Submit
medicineForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const newMed = {
        name: document.getElementById('name').value,
        dosage: document.getElementById('dosage').value,
        time: document.getElementById('time').value,
        frequency: document.getElementById('frequency').value,
        notes: document.getElementById('notes').value
    };

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newMed)
        });

        if (!response.ok) throw new Error('Failed to save reminder');

        medicineForm.reset();
        showFormMessage('Reminder added successfully!', 'success');
        fetchMedicines();
    } catch (error) {
        console.error(error);
        showFormMessage('Error adding reminder. Try again.', 'error');
    }
});

// Delete Medicine
async function deleteMedicine(id) {
    if (!confirm('Are you sure you want to delete this reminder?')) return;

    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });

        if (!response.ok) throw new Error('Failed to delete reminder');
        fetchMedicines();
    } catch (error) {
        console.error(error);
        alert('Error deleting reminder.');
    }
}

// Search filter
searchBox.addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    const filtered = allMedicines.filter(med => 
        med.name.toLowerCase().includes(term) || 
        med.dosage.toLowerCase().includes(term)
    );
    renderMedicines(filtered);
});

function showFormMessage(text, type) {
    formMessage.textContent = text;
    formMessage.className = `message ${type}`;
    setTimeout(() => { formMessage.textContent = ''; }, 3000);
}

function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
        tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
}