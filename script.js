const textarea = document.getElementById('situation');
const category = document.getElementById('category');
const unfallKoerperstellenGroup = document.getElementById('unfallKoerperstellenGroup');
const unfallKoerperstellenInput = document.getElementById('unfallKoerperstellen');
const summaryText = document.getElementById('summaryText');
const summaryCategory = document.getElementById('summaryCategory');
const charCount = document.getElementById('charCount');
const vitalEntriesContainer = document.getElementById('vitalEntries');
const summaryVitalTableBody = document.getElementById('summaryVitalTableBody');
const copySummaryButton = document.getElementById('copySummaryButton');
const resetFormButton = document.getElementById('resetFormButton');

const vitalGroups = ['atmung', 'schmerz', 'kreislauf', 'verletzung'];

const summaryFields = {
  bewusstsein: document.getElementById('summaryBewusstsein'),
  atmung: document.getElementById('summaryAtmung'),
  schmerz: document.getElementById('summarySchmerz'),
  kreislauf: document.getElementById('summaryKreislauf'),
  verletzung: document.getElementById('summaryVerletzung'),
  unfallKoerperstellen: document.getElementById('summaryUnfallKoerperstellen'),
  lagerung: document.getElementById('summaryLagerung'),
  atmungMassnahme: document.getElementById('summaryAtmungMassnahme'),
  oxygenAmount: document.getElementById('summaryOxygenAmount'),
  kreislaufMassnahme: document.getElementById('summaryKreislaufMassnahme'),
  aedEmpfehlung: document.getElementById('summaryAedEmpfehlung'),
  shockCount: document.getElementById('summaryShockCount'),
  patientState: document.getElementById('summaryPatientState'),
  einsatzbewertung: document.getElementById('summaryEinsatzbewertung'),
  besonderheiten: document.getElementById('summaryBesonderheiten')
};

const summaryRows = Object.fromEntries(
  Object.entries(summaryFields).map(([key, element]) => [key, element.closest('p')])
);

const oxygenAmountInput = document.getElementById('oxygenAmount');
const oxygenAmountGroup = document.getElementById('oxygenAmountGroup');
const shockCountInput = document.getElementById('shockCount');
const aedOptionsGroup = document.getElementById('aedOptionsGroup');
const patientStateSelect = document.getElementById('patientState');
const einsatzbewertungSelect = document.getElementById('einsatzbewertung');
const besonderheitenGroup = document.getElementById('besonderheitenGroup');
const besonderheitenText = document.getElementById('besonderheitenText');

const bewusstseinLabels = {
  orientiert: 'orientiert',
  desorientiert: 'desorientiert',
  getrübt: 'getrübt',
  bewusstlos: 'bewusstlos'
};

const vitalTemplate = () => ({
  uhrzeit: '',
  blutdruck: '',
  herzfrequenz: '',
  sauerstoff: '',
  blutzucker: '',
  temperatur: ''
});

let vitalEntries = [vitalTemplate()];

function getSelectedValue(name) {
  const selected = document.querySelector(`input[name="${name}"]:checked`);
  return selected ? selected.value : '-';
}

function updateOxygenFieldVisibility() {
  const selectedAtmungMassnahme = document.querySelector('input[name="atmungMassnahme"]:checked');
  const shouldShowOxygen = selectedAtmungMassnahme && selectedAtmungMassnahme.value === 'Sauerstoffgabe';

  if (oxygenAmountGroup) {
    oxygenAmountGroup.classList.toggle('hidden', !shouldShowOxygen);
  }

  if (!shouldShowOxygen && oxygenAmountInput) {
    oxygenAmountInput.value = '';
  }
}

function updateAedFieldVisibility() {
  const selectedKreislaufMassnahme = document.querySelector('input[name="kreislaufMassnahme"]:checked');
  const shouldShowAed = selectedKreislaufMassnahme && selectedKreislaufMassnahme.value === 'AED angeschlossen';

  if (aedOptionsGroup) {
    aedOptionsGroup.classList.toggle('hidden', !shouldShowAed);
  }

  if (!shouldShowAed) {
    const aedRecommendation = document.querySelector('input[name="aedEmpfehlung"]:checked');
    if (aedRecommendation) {
      aedRecommendation.checked = false;
    }
    if (shockCountInput) {
      shockCountInput.value = '';
    }
  }
}

function updateBesonderheitenVisibility() {
  const selectedEinsatzbewertung = einsatzbewertungSelect ? einsatzbewertungSelect.value : '';
  const shouldShowBesonderheiten = selectedEinsatzbewertung === 'Besonderheiten';

  if (besonderheitenGroup) {
    besonderheitenGroup.classList.toggle('hidden', !shouldShowBesonderheiten);
  }

  if (!shouldShowBesonderheiten && besonderheitenText) {
    besonderheitenText.value = '';
  }
}

function setSummaryValue(key, value) {
  const span = summaryFields[key];
  const row = summaryRows[key];

  if (!span || !row) return;

  const normalizedValue = value === undefined || value === null || value === '-' || value === '' ? '' : String(value);
  span.textContent = normalizedValue || '';
  row.style.display = normalizedValue ? 'block' : 'none';
}

function updateUnfallKoerperstellenVisibility() {
  const shouldShow = category && category.value === 'Unfall';

  if (unfallKoerperstellenGroup) {
    unfallKoerperstellenGroup.classList.toggle('hidden', !shouldShow);
  }

  if (!shouldShow && unfallKoerperstellenInput) {
    unfallKoerperstellenInput.value = '';
  }
}

function updateSummary() {
  const situationText = textarea.value.trim();
  summaryText.textContent = situationText || 'Noch keine Schilderung eingetragen.';
  charCount.textContent = String(textarea.value.length);

  const selectedCategory = category.value;
  summaryCategory.textContent = selectedCategory
    ? `Erstbefund: ${selectedCategory}`
    : 'Erstbefund: Noch keine Auswahl getroffen.';

  const unfallBodyParts = unfallKoerperstellenInput ? unfallKoerperstellenInput.value.trim() : '';
  setSummaryValue('unfallKoerperstellen', selectedCategory === 'Unfall' && unfallBodyParts ? unfallBodyParts : '');

  const selectedBewusstsein = document.querySelector('input[name="bewusstsein"]:checked');
  setSummaryValue('bewusstsein', selectedBewusstsein ? (bewusstseinLabels[selectedBewusstsein.value] || selectedBewusstsein.value) : '');

  vitalGroups.forEach((name) => {
    const value = getSelectedValue(name);
    const normalizedValue = value === '-' ? (name === 'verletzung' ? 'keine' : '') : value;
    setSummaryValue(name, normalizedValue);
  });

  const selectedLagerung = document.querySelector('input[name="lagerung"]:checked');
  setSummaryValue('lagerung', selectedLagerung ? selectedLagerung.value : '');

  const selectedAtmungMassnahme = document.querySelector('input[name="atmungMassnahme"]:checked');
  const oxygenAmount = oxygenAmountInput ? oxygenAmountInput.value.trim() : '';
  const selectedKreislaufMassnahme = document.querySelector('input[name="kreislaufMassnahme"]:checked');
  const selectedAedRecommendation = document.querySelector('input[name="aedEmpfehlung"]:checked');
  const shockCount = shockCountInput ? shockCountInput.value.trim() : '';

  setSummaryValue('atmungMassnahme', selectedAtmungMassnahme ? selectedAtmungMassnahme.value : '');
  setSummaryValue('oxygenAmount', selectedAtmungMassnahme && selectedAtmungMassnahme.value === 'Sauerstoffgabe' && oxygenAmount ? `${oxygenAmount} l/min` : '');

  setSummaryValue('kreislaufMassnahme', selectedKreislaufMassnahme ? selectedKreislaufMassnahme.value : '');
  setSummaryValue('aedEmpfehlung', selectedAedRecommendation ? selectedAedRecommendation.value : '');
  setSummaryValue('shockCount', selectedKreislaufMassnahme && selectedKreislaufMassnahme.value === 'AED angeschlossen' && shockCount ? `${shockCount}` : '');

  const selectedPatientState = patientStateSelect ? patientStateSelect.value : '';
  const patientStateText = selectedPatientState
    ? selectedPatientState === 'verbessert'
      ? 'Verbessert'
      : selectedPatientState === 'gleich'
        ? 'gleich'
        : 'schlechter'
    : '';
  setSummaryValue('patientState', patientStateText);

  const selectedEinsatzbewertung = einsatzbewertungSelect ? einsatzbewertungSelect.value : '';
  setSummaryValue('einsatzbewertung', selectedEinsatzbewertung || '');

  const besonderheitenValue = besonderheitenText ? besonderheitenText.value.trim() : '';
  setSummaryValue(
    'besonderheiten',
    selectedEinsatzbewertung === 'Besonderheiten' && besonderheitenValue ? besonderheitenValue : ''
  );

  updateSummaryTable();
}

function updateSummaryTable() {
  summaryVitalTableBody.innerHTML = '';

  const hasAnyEntry = vitalEntries.some((entry) => Object.values(entry).some((value) => value.trim() !== ''));

  if (!hasAnyEntry) {
    summaryVitalTableBody.innerHTML = '<tr><td colspan="6">Noch keine Messwerte erfasst.</td></tr>';
    return;
  }

  vitalEntries.forEach((entry) => {
    const row = document.createElement('tr');
    const cells = [
      entry.uhrzeit || '-',
      entry.blutdruck || '-',
      entry.herzfrequenz || '-',
      entry.sauerstoff || '-',
      entry.blutzucker || '-',
      entry.temperatur || '-'
    ];

    cells.forEach((value) => {
      const cell = document.createElement('td');
      cell.textContent = value;
      row.appendChild(cell);
    });

    summaryVitalTableBody.appendChild(row);
  });
}

function renderVitalEntries() {
  vitalEntriesContainer.innerHTML = '';

  vitalEntries.forEach((entry, index) => {
    const row = document.createElement('div');
    row.className = 'vital-entry';

    const fields = [
      { key: 'uhrzeit', label: 'Uhrzeit', type: 'time' },
      { key: 'blutdruck', label: 'Blutdruck (mmHg)', type: 'text', placeholder: 'z. B. 120/80' },
      { key: 'herzfrequenz', label: 'Herzfrequenz (1/min)', type: 'text', placeholder: 'z. B. 72' },
      { key: 'sauerstoff', label: 'Sauerstoffsättigung (%)', type: 'text', placeholder: 'z. B. 98' },
      { key: 'blutzucker', label: 'Blutzucker (mg/dl)', type: 'text', placeholder: 'z. B. 120' },
      { key: 'temperatur', label: 'Temperatur (°C)', type: 'text', placeholder: 'z. B. 36,8' }
    ];

    fields.forEach(({ key, label, type, placeholder }) => {
      const container = document.createElement('label');
      container.textContent = label;

      const input = document.createElement('input');
      input.type = type;
      input.value = entry[key] || '';
      input.placeholder = placeholder || '';
      input.setAttribute('data-index', String(index));
      input.setAttribute('data-key', key);

      input.addEventListener('input', (event) => {
        const { index: entryIndex, key: fieldKey } = event.target.dataset;
        vitalEntries[Number(entryIndex)][fieldKey] = event.target.value;
        updateSummaryTable();
      });

      container.appendChild(input);
      row.appendChild(container);
    });

    const actions = document.createElement('div');
    actions.className = 'vital-entry-actions';

    const removeButton = document.createElement('button');
    removeButton.type = 'button';
    removeButton.className = 'remove-button';
    removeButton.textContent = '×';
    removeButton.title = 'Eintrag entfernen';
    removeButton.addEventListener('click', () => {
      if (vitalEntries.length === 1) {
        vitalEntries = [vitalTemplate()];
      } else {
        vitalEntries.splice(index, 1);
      }
      renderVitalEntries();
      updateSummaryTable();
    });

    actions.appendChild(removeButton);
    row.appendChild(actions);
    vitalEntriesContainer.appendChild(row);
  });
}

textarea.addEventListener('input', updateSummary);
category.addEventListener('change', updateSummary);
document.querySelectorAll('input[name="bewusstsein"]').forEach((radio) => radio.addEventListener('change', updateSummary));
vitalGroups.forEach((name) => {
  document.querySelectorAll(`input[name="${name}"]`).forEach((radio) => radio.addEventListener('change', updateSummary));
});
document.querySelectorAll('input[name="lagerung"]').forEach((radio) => radio.addEventListener('change', updateSummary));
document.querySelectorAll('input[name="atmungMassnahme"]').forEach((radio) => radio.addEventListener('change', () => {
  updateOxygenFieldVisibility();
  updateSummary();
}));
document.querySelectorAll('input[name="kreislaufMassnahme"]').forEach((radio) => radio.addEventListener('change', () => {
  updateAedFieldVisibility();
  updateSummary();
}));
document.querySelectorAll('input[name="aedEmpfehlung"]').forEach((radio) => radio.addEventListener('change', updateSummary));

if (category) {
  category.addEventListener('change', () => {
    updateUnfallKoerperstellenVisibility();
    updateSummary();
  });
}

if (unfallKoerperstellenInput) {
  unfallKoerperstellenInput.addEventListener('input', updateSummary);
}

if (oxygenAmountInput) {
  oxygenAmountInput.addEventListener('input', updateSummary);
}

if (shockCountInput) {
  shockCountInput.addEventListener('input', updateSummary);
}

if (patientStateSelect) {
  patientStateSelect.addEventListener('change', updateSummary);
}

if (einsatzbewertungSelect) {
  einsatzbewertungSelect.addEventListener('change', () => {
    updateBesonderheitenVisibility();
    updateSummary();
  });
}

if (besonderheitenText) {
  besonderheitenText.addEventListener('input', updateSummary);
}

updateOxygenFieldVisibility();
updateAedFieldVisibility();
updateBesonderheitenVisibility();
updateUnfallKoerperstellenVisibility();

async function copySummaryToClipboard() {
  if (!copySummaryButton) return;

  const summaryLines = [];

  summaryLines.push('Schilderung der Notfall-Situation');
  summaryLines.push(summaryText.textContent.trim());
  summaryLines.push('');
  summaryLines.push('Erstbefund');
  summaryLines.push(summaryCategory.textContent.trim());
  summaryLines.push('');

  const firstBlock = [
    ['Bewusstsein', summaryFields.bewusstsein.textContent.trim()],
    ['Atmung', summaryFields.atmung.textContent.trim()],
    ['Schmerz', summaryFields.schmerz.textContent.trim()],
    ['Kreislauf', summaryFields.kreislauf.textContent.trim()],
    ['Verletzung', summaryFields.verletzung.textContent.trim()]
  ].filter(([, value]) => value && value !== '');

  if (firstBlock.length) {
    summaryLines.push('Erstbefund - Details');
    firstBlock.forEach(([label, value]) => summaryLines.push(`${label}: ${value}`));
    summaryLines.push('');
  }

  const vitalRows = Array.from(summaryVitalTableBody.querySelectorAll('tr')).map((row) => {
    return Array.from(row.querySelectorAll('td')).map((cell) => cell.textContent.trim());
  }).filter((row) => row.some((cell) => cell && cell !== '-'));

  if (vitalRows.length) {
    summaryLines.push('Vitalparameter');
    const tableHeader = ['Uhrzeit', 'Blutdruck (mmHg)', 'HF (1/min)', 'SpO₂ (%)', 'BS (mg/dl)', 'Temp. (°C)'];
    summaryLines.push(tableHeader.join('\t'));
    vitalRows.forEach((row) => summaryLines.push(row.join('\t')));
    summaryLines.push('');
  }

  const measureBlock = [
    ['Lagerung', summaryFields.lagerung.textContent.trim()],
    ['Maßnahme Atmung', summaryFields.atmungMassnahme.textContent.trim()],
    ['Sauerstoff', summaryFields.oxygenAmount.textContent.trim()],
    ['Kreislaufmaßnahme', summaryFields.kreislaufMassnahme.textContent.trim()],
    ['AED', summaryFields.aedEmpfehlung.textContent.trim()],
    ['Schocks', summaryFields.shockCount.textContent.trim()]
  ].filter(([, value]) => value && value !== '');

  if (measureBlock.length) {
    summaryLines.push('Maßnahmen');
    measureBlock.forEach(([label, value]) => summaryLines.push(`${label}: ${value}`));
    summaryLines.push('');
  }

  const handoverBlock = [
    ['Patientenzustand bei Übergabe', summaryFields.patientState.textContent.trim()],
    ['Einsatzbewertung', summaryFields.einsatzbewertung.textContent.trim()],
    ['Besonderheiten', summaryFields.besonderheiten.textContent.trim()]
  ].filter(([, value]) => value && value !== '');

  if (handoverBlock.length) {
    summaryLines.push('Übergabe');
    handoverBlock.forEach(([label, value]) => summaryLines.push(`${label}: ${value}`));
  }

  const textToCopy = summaryLines.join('\n').trim();

  if (!textToCopy) {
    return;
  }

  const fallbackCopy = async () => {
    const tempTextArea = document.createElement('textarea');
    tempTextArea.value = textToCopy;
    tempTextArea.setAttribute('readonly', '');
    tempTextArea.style.position = 'fixed';
    tempTextArea.style.top = '-9999px';
    document.body.appendChild(tempTextArea);
    tempTextArea.select();
    tempTextArea.setSelectionRange(0, textToCopy.length);
    document.execCommand('copy');
    document.body.removeChild(tempTextArea);
  };

  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(textToCopy);
    } else {
      await fallbackCopy();
    }

    const originalText = copySummaryButton.textContent;
    copySummaryButton.textContent = 'Kopiert';
    setTimeout(() => {
      copySummaryButton.textContent = originalText;
    }, 1200);
  } catch (error) {
    try {
      await fallbackCopy();
      const originalText = copySummaryButton.textContent;
      copySummaryButton.textContent = 'Kopiert';
      setTimeout(() => {
        copySummaryButton.textContent = originalText;
      }, 1200);
    } catch (fallbackError) {
      copySummaryButton.textContent = 'Fehler';
      setTimeout(() => {
        copySummaryButton.textContent = 'In die Zwischenablage';
      }, 1200);
    }
  }
}

function resetForm() {
  textarea.value = '';
  category.value = '';

  document.querySelectorAll('input[type="radio"]').forEach((radio) => {
    radio.checked = false;
  });

  if (oxygenAmountInput) {
    oxygenAmountInput.value = '';
  }

  if (unfallKoerperstellenInput) {
    unfallKoerperstellenInput.value = '';
  }

  if (shockCountInput) {
    shockCountInput.value = '';
  }

  if (patientStateSelect) {
    patientStateSelect.value = '';
  }

  if (einsatzbewertungSelect) {
    einsatzbewertungSelect.value = '';
  }

  if (besonderheitenText) {
    besonderheitenText.value = '';
  }

  vitalEntries = [vitalTemplate()];
  renderVitalEntries();
  updateOxygenFieldVisibility();
  updateAedFieldVisibility();
  updateBesonderheitenVisibility();
  updateUnfallKoerperstellenVisibility();
  updateSummary();
}

document.getElementById('addVitalEntry').addEventListener('click', () => {
  vitalEntries.push(vitalTemplate());
  renderVitalEntries();
  updateSummaryTable();
});

if (copySummaryButton) {
  copySummaryButton.addEventListener('click', copySummaryToClipboard);
}

if (resetFormButton) {
  resetFormButton.addEventListener('click', resetForm);
}

renderVitalEntries();
updateSummary();
