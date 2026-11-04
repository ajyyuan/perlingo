import {retryReason,retryMessage} from './answer-attempt.js';
import {buildUsagePreview} from './usage-preview-library.js';
import {openVerbGuide} from './verb-guide-view.js';
import {esc} from './html.js';
import {normalize} from './assessment.js';
import {createLemmaVoice} from './pronunciation.js';

const root = document.querySelector('#preview');
const dialog = document.querySelector('#similar');
const voice = createLemmaVoice();
const [deck, notes, contexts, content] = await Promise.all(['deck', 'notes', 'context', 'day1-usage'].map(async name => {
  const response = await fetch(`/lemmas/data/${name}.json`);
  if (!response.ok) throw new Error(`Could not load ${name}`);
  return response.json();
}));
const {cards: previewWords, groups, retryForms} = buildUsagePreview(deck, notes, contexts, content);
let retry = null;
let draft = '';
let selected = previewWords.findIndex(card => card.word === 'saber');
let query = '';
let roundWords = [];
let activeGroup;
const searchText = text => text.toLocaleLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
function filteredWords() {
  const terms = searchText(query).split(',').map(term => term.trim()).filter(Boolean);
  return previewWords.filter(card => !terms.length || terms.some(term => searchText(`${card.word} ${card.meaning}`).includes(term)));
}
function wordButtons() {
  return filteredWords().map(item => {
    const index = previewWords.indexOf(item);
    return `<button data-word="${index}" aria-current="${index === selected}" lang="es">${esc(item.word)}<small>${esc(item.type)}</small></button>`;
  }).join('') || '<p class="counter">No words found</p>';
}
let mode = 'study';
let question = 0;
let results = [];
let dialogAnchor;

function example(sentence, translation) {
  return `<div class="example"><button class="speak" data-speak="${esc(sentence)}" lang="es" aria-label="Listen to ${esc(sentence)}">${esc(sentence)}</button><p class="translation">${esc(translation)}</p></div>`;
}

function studyMarkup() {
  const card = previewWords[selected];
  return `<div class="study-layout">
    <aside class="word-browser"><label class="sr-only" for="word-search">Find a word</label><input id="word-search" type="search" placeholder="Find a word" value="${esc(query)}" autocomplete="off"><nav class="word-list" aria-label="Day 1 words">${wordButtons()}</nav></aside>
    <article class="word-card" aria-label="${esc(card.word)} teaching card">
      <h1><button class="speak" data-speak="${esc(card.word)}" lang="es" aria-label="Listen to ${esc(card.word)}">${esc(card.word)}</button></h1>
      <p class="word-type">${esc(card.type)}</p>
      <p class="meaning">${esc(card.meaning)}</p>
      <section class="usage" aria-label="Usage"><h2>Usage</h2>${card.uses.map(([description, sentence, translation]) => `<div class="usage-item">${description ? `<p>${esc(description)}</p>` : ''}${example(sentence, translation)}</div>`).join('')}</section>
      <div class="card-footer"><button class="plain" data-similar>${card.groups.some(key => groups.get(key).members.length > 1) ? 'Compare & explore' : 'Usage details'} ↗</button>${card.type === 'verb' ? '<button class="plain" data-verb-guide aria-haspopup="dialog">Verb guide ↗</button>' : ''}<div class="steps"><button class="plain" data-step="-1" aria-label="Previous word" ${selected === 0 ? 'disabled' : ''}>←</button><span class="counter">${selected + 1} / ${previewWords.length}</span><button class="plain" data-step="1" aria-label="Next word" ${selected === previewWords.length - 1 ? 'disabled' : ''}>→</button></div></div>
    </article>
  </div>`;
}

function recallMarkup() {
  if (question === roundWords.length) {
    const count = results.filter(result => result.correct).length;
    return `<section class="recall"><p class="counter">Recall complete</p><h1>${count} of ${roundWords.length} correct</h1><div class="recall-actions"><button class="plain" data-study>Review the words</button><button class="primary" data-restart>Try again →</button></div></section>`;
  }
  const card = roundWords[question];
  const result = results[question];
  const instruction = card.blank || card.cue?.includes('___') ? 'One word to fit the blank' : card.type === 'verb' ? 'Spanish infinitive' : 'Spanish dictionary form';
  const feedbackTitle = result?.correct ? 'Correct' : `Answer · ${card.word}`;
  return `<section class="recall"><p class="counter">${question + 1} / ${roundWords.length}</p><h1>${esc(card.prompt)}</h1>${card.cue ? `<p class="cue">${esc(card.cue)}</p>` : ''}${card.blank ? `<p class="blank" lang="es">${esc(card.blank)}</p>` : ''}
    <form id="recall-form"><label class="answer-label" for="answer">${instruction}</label><input id="answer" name="answer" autocomplete="off" autocapitalize="none" spellcheck="false" aria-describedby="retry-hint" required ${result ? 'readonly' : ''} value="${esc(result?.answer ?? draft)}">
    <p id="retry-hint" class="counter" role="status">${retry ? esc(retryMessage(retry,card.type)) : ''}</p>
    ${result ? `<div class="feedback ${result.correct ? 'correct' : ''}" role="status"><p>${esc(feedbackTitle)}</p>${card.answers.length > 1 ? `<p>Accepted here · ${card.answers.map(esc).join(' / ')}</p>` : ''}${result.correct && normalize(result.answer) !== normalize(card.word) ? `<p>This card teaches <span lang="es">${esc(card.word)}</span>.</p>` : ''}</div><div class="recall-actions"><button type="button" class="plain" data-similar>Compare words ↗</button><button class="primary">${question === roundWords.length - 1 ? 'Finish' : 'Next'} →</button></div>` : '<div class="recall-actions"><button type="button" class="plain" data-reveal>Show answer</button><button class="primary">Check →</button></div>'}
    </form></section>`;
}

function render() {
  voice.stop();
  root.innerHTML = mode === 'study' ? studyMarkup() : recallMarkup();
  root.querySelector('[aria-current="true"]')?.scrollIntoView({block: 'nearest'});
  document.querySelector('#study').setAttribute('aria-pressed', String(mode === 'study'));
  document.querySelector('#test').setAttribute('aria-pressed', String(mode === 'recall'));
}

function comparisonDetails(key) {
  const sections = groups.get(key)?.sections || [];
  return sections.map(section => `<section class="comparison-detail">
    <h3>${esc(section.title)}</h3>
    <p>${esc(section.text)}</p>
    ${section.examples.map(([sentence, translation]) => example(sentence, translation)).join('')}
    ${section.note ? `<p>${esc(section.note)}</p>` : ''}
    <p class="comparison-sources">${section.sources.map(([label, url]) => `<a href="${esc(url)}" target="_blank" rel="noopener">${esc(label)} ↗</a>`).join(' · ')}</p>
  </section>`).join('');
}

function renderSimilar() {
  const card = mode === 'study' ? previewWords[selected] : roundWords[question];
  const group = groups.get(activeGroup);
  const links = group.members.filter(id => id !== card.id).map(id => {
    const index = previewWords.findIndex(item => item.id === id);
    const item = previewWords[index];
    if (!item) return '';
    return mode === 'study' ? `<button class="plain related-link" data-word="${index}" lang="es">${esc(item.word)} ↗</button>` : `<span lang="es">${esc(item.word)}</span>`;
  }).join('');
  document.querySelector('#similar-content').innerHTML = `<h2 id="similar-title">${esc(card.word)}</h2>
    ${card.groups.length > 1 ? `<nav class="group-tabs" aria-label="Comparisons">${card.groups.map(key => `<button class="plain" data-group="${esc(key)}" aria-pressed="${activeGroup === key}">${esc(groups.get(key).title)}</button>`).join('')}</nav>` : ''}
    ${links ? `<div class="related-links">${links}</div>` : ''}
    ${comparisonDetails(activeGroup)}`;
  document.querySelector('#similar-content').scrollTop = 0;
}
function openSimilar() {
  const card = mode === 'study' ? previewWords[selected] : roundWords[question];
  if (mode === 'recall' && !results[question]) return;
  dialogAnchor = document.activeElement;
  activeGroup = card.groups[0];
  renderSimilar();
  dialog.showModal();
  document.querySelector('#similar-content').scrollTop = 0;
}

root.addEventListener('input', event => {
  if (event.target.id === 'answer') draft = event.target.value;
  if (event.target.id !== 'word-search') return;
  query = event.target.value;
  root.querySelector('.word-list').innerHTML = wordButtons();
});

document.addEventListener('click', event => {
  const button = event.target.closest('button');
  if (!button) return;
  if (button.hasAttribute('data-verb-guide')) {
    voice.stop();
    openVerbGuide(previewWords[selected]);
    return;
  }
  if (button.dataset.speak) {
    voice.speak(button.dataset.speak, 'es-ES', 'Spanish');
    return;
  }
  if (button.hasAttribute('data-reveal')) {
    results.push({answer: draft, correct: false});
    retry = null;
    render();
    root.querySelector('.primary').focus();
  } else if (button.dataset.group) {
    activeGroup = button.dataset.group;
    renderSimilar();
    dialog.querySelector(`[data-group="${activeGroup}"]`).focus();
  } else if (button.hasAttribute('data-word')) {
    selected = Number(button.dataset.word);
    if (!filteredWords().includes(previewWords[selected])) query = '';
    if (dialog.open) dialog.close();
    render();
    root.querySelector(`[data-word="${selected}"]`).focus();
  } else if (button.dataset.step) {
    selected = Math.max(0, Math.min(previewWords.length - 1, selected + Number(button.dataset.step)));
    if (!filteredWords().includes(previewWords[selected])) query = '';
    render();
    root.querySelector(`[data-word="${selected}"]`).focus();
  } else if (button.hasAttribute('data-similar')) {
    openSimilar();
  } else if (button.id === 'study' || button.hasAttribute('data-study')) {
    mode = 'study';
    render();
  } else if (button.id === 'test' || button.hasAttribute('data-restart')) {
    const available = filteredWords();
    if (!available.length) return;
    const start = Math.max(0, available.indexOf(previewWords[selected]));
    roundWords = [...available.slice(start), ...available.slice(0, start)];
    mode = 'recall';
    question = 0;
    results = [];
    retry = null;
    draft = '';
    render();
    root.querySelector('#answer').focus();
  }
});

root.addEventListener('submit', event => {
  if (event.target.id !== 'recall-form') return;
  event.preventDefault();
  if (results[question]) {
    question += 1;
    draft = '';
    retry = null;
  } else {
    const answer = new FormData(event.target).get('answer').trim();
    if (!answer) return;
    const card = roundWords[question];
    const correct = card.answers.map(normalize).includes(normalize(answer));
    retry = correct ? null : retryReason(answer, card.answers, retryForms(card.id, card.answers), Boolean(card.blank || card.cue?.includes('___')));
    draft = answer;
    if (!retry) results.push({answer, correct});
  }
  render();
  const target = results[question] ? root.querySelector('.primary') : root.querySelector('#answer');
  target?.focus();
});

dialog.querySelector('.close').addEventListener('click', () => dialog.close());
dialog.addEventListener('close', () => {
  voice.stop();
  if (dialogAnchor?.isConnected) dialogAnchor.focus();
});
dialog.addEventListener('click', event => {
  if (event.target !== dialog) return;
  const bounds = dialog.getBoundingClientRect();
  if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
});
render();
