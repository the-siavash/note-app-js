export default class NotesView {
  constructor(root, eventHandlers) {
    this.root = root;

    this.root.innerHTML = `
    <aside class="notes__sidebar">
      <button type="button" class="btn btn--secondary btn--block notes__sidebar-toggler">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M8.91003 19.9201L15.43 13.4001C16.2 12.6301 16.2 11.3701 15.43 10.6001L8.91003 4.08008" stroke="#292D32" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
      <button type="button" class="btn btn--primary btn--block notes__add" id="note-add">
        <span>یادداشت جدید</span>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M6 12H18" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M12 18V6" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
      <ul class="notes__list"></ul>
    </aside>
    <section class="notes__preview" id="note-preview">
      <p class="notes__placeholder">یادداشت مورد نظر خود را انتخاب و یا ایجاد نمایید...</p>
      <div class="notes__info flex-group">
        <small class="notes__info-date" id="note-date"></small>
        <div class="notes__info-actions">
          <div class="btn-rounded" id="note-change-color">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12.61 2.21C12.25 1.93 11.75 1.93 11.39 2.21C9.49004 3.66 3.88003 8.39 3.91003 13.9C3.91003 18.36 7.54004 22 12.01 22C16.48 22 20.11 18.37 20.11 13.91C20.12 8.48 14.5 3.67 12.61 2.21Z" stroke="#292D32" stroke-width="1.5" stroke-miterlimit="10"/>
            </svg>
          </div>
          <div class="btn-rounded" id="note-remove">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 5.97998C17.67 5.64998 14.32 5.47998 10.98 5.47998C9 5.47998 7.02 5.57998 5.04 5.77998L3 5.97998" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M8.5 4.97L8.72 3.66C8.88 2.71 9 2 10.69 2H13.31C15 2 15.13 2.75 15.28 3.67L15.5 4.97" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M18.85 9.14001L18.2 19.21C18.09 20.78 18 22 15.21 22H8.79002C6.00002 22 5.91002 20.78 5.80002 19.21L5.15002 9.14001" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M10.33 16.5H13.66" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M9.5 12.5H14.5" stroke="#292D32" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>                
          </div>
        </div>
      </div>
      <div class="notes__data">
        <input type="text" class="notes__title" id="note-title" placeholder="عنوان یادداشت" autocomplete="off">
        <textarea class="notes__body" id="note-content" spellcheck="false" placeholder="متن یادداشت"></textarea>
      </div>
    </section>`;

    const { onNoteAdd, onNoteSelect, onNoteEdit, onNoteDelete } = eventHandlers;
    this.onNoteAdd = onNoteAdd;
    this.onNoteSelect = onNoteSelect;
    this.onNoteEdit = onNoteEdit;
    this.onNoteDelete = onNoteDelete;

    const addNoteButton = this.root.querySelector('#note-add');
    const noteTitle = document.querySelector('#note-title');
    const noteContent = document.querySelector('#note-content');
    
    addNoteButton.addEventListener('click', () => {
      this.onNoteAdd();
      this.#handleMiniSidebarToggler();
    });

    [noteTitle, noteContent].forEach((field) => {
      field.addEventListener('input', () => {
        const editedTitle = noteTitle.value.trim();
        const editedContent = noteContent.value.trim();
        this.onNoteEdit(editedTitle, editedContent);
      });
    });

    // hide note-preview when any note is not selected
    this.updateNotePreviewVisibility(false);

    // sidebar toggler functionality
    this.#handleSidebarToggler();
  }

  #createNoteComponent({ id, title, content, updatedAt, color }) {
    const date = this.#getPersianDate(updatedAt);
    const note = document.createElement('li');
    note.dataset.id = id;
    note.classList.add('notes__list-item', `color-${color}`);
    note.innerHTML = `
      <small class="notes__small-date">${date}</small>
      <h2 class="notes__small-title">${title}</h2>
      <p class="notes__small-body">${content}</p>`;
    return note;
  }

  #getPersianDate(date, format = 'DD MMMM YYYY') {
    return new persianDate(new Date(date)).format(format);
  }

  renderNoteComponents(notes) {
    const notesList = this.root.querySelector('.notes__list');

    notesList.innerHTML = '';
    notes.forEach((note) => {
      notesList.append(this.#createNoteComponent(note));
    });

    notesList.querySelectorAll('.notes__list-item').forEach((note) => {
      note.addEventListener('click', () => {
        this.onNoteSelect(note.dataset.id);
      });
    });
  }

  renderSelectedNote(note) {    
    this.root.querySelector('#note-date').textContent = this.#getPersianDate(note.updatedAt, 'dddd DD MMMM YYYY');
    this.root.querySelector('#note-title').value = note.title;
    this.root.querySelector('#note-content').value = note.content;

    this.root.querySelector('#note-remove').addEventListener('click', () => {
      this.onNoteDelete(note.id);
    });
  }

  updateSelectedNote(noteId) {
    this.root.querySelectorAll('.notes__list-item').forEach((noteItem) => {
      noteItem.classList.remove('notes__list-item--selected');
      if (noteItem.dataset.id === noteId) noteItem.classList.add('notes__list-item--selected');
    });
  }

  updateEditedNoteDate(editedAt) {
    this.root.querySelector('#note-date').textContent = this.#getPersianDate(editedAt, 'dddd DD MMMM YYYY');
  }

  updateNoteNumbers(notesLength) {
    document.querySelector('#note-numbers').textContent = notesLength;
  }

  updateNoteListScrollPosition() {
    this.root.querySelector('.notes__list').scrollTo(0, 0);
  }

  updateNotePreviewVisibility(isVisible) {
    if (isVisible) {
      this.root.querySelector('.notes__info').classList.remove('hide');
      this.root.querySelector('.notes__data').classList.remove('hide');
    } else {
      this.root.querySelector('.notes__info').classList.add('hide');
      this.root.querySelector('.notes__data').classList.add('hide');
    }
    this.#updateNotePlaceholderVisibility(isVisible);
  }

  #updateNotePlaceholderVisibility(isVisible) {
    if (isVisible) this.root.querySelector('.notes__placeholder').classList.add('hide');
    else this.root.querySelector('.notes__placeholder').classList.remove('hide');
  }

  #handleSidebarToggler() {
    const notesSidebar = this.root.querySelector('.notes__sidebar');
    const togglerButton = this.root.querySelector('.notes__sidebar-toggler');

    document.querySelector('.notes__sidebar .notes__sidebar-toggler').addEventListener('click', () => {
      notesSidebar.classList.toggle('notes__sidebar--mini');
      notesSidebar.querySelector('.notes__add span').classList.toggle('hide');
      notesSidebar.querySelector('.notes__list').classList.toggle('hide');
    });
    
    togglerButton.addEventListener('click', () => {
      togglerButton.classList.toggle('rotate');
    });
  }

  #handleMiniSidebarToggler() {
    const notesSidebar = this.root.querySelector('.notes__sidebar');
    const togglerButton = this.root.querySelector('.notes__sidebar-toggler');

    if (notesSidebar.classList.contains('notes__sidebar--mini')) {
      notesSidebar.classList.remove('notes__sidebar--mini');
      notesSidebar.querySelector('.notes__add span').classList.remove('hide');
      notesSidebar.querySelector('.notes__list').classList.remove('hide');
      togglerButton.classList.toggle('rotate');
      this.updateNoteListScrollPosition();
    }
  }
}
