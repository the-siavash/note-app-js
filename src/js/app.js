import NotesAPI from './notes.js';
import NotesView from './notesView.js';

export default class App {
  constructor(root) {
    this.view = new NotesView(root, this.#eventHandlers());
    this.notes = [];
    this.filters = {
      notes: [],
      searchChars: '',
    };
    this.selectedNote = null;
    this.#refreshNotes();
  }

  #refreshNotes() {
    const notes = NotesAPI.getNotes();
    this.notes = notes;

    if (this.filters.searchChars) {
      this.filters.notes = this.notes.filter((note) => {
        return note.title.toLowerCase().includes(this.filters.searchChars);
      });
      this.view.renderNoteComponents(this.filters.notes);
      this.view.updateNoteNumbers(this.filters.notes.length);
    } else {
      this.view.renderNoteComponents(this.notes);
      this.view.updateNoteNumbers(this.notes.length);
    }

    if (this.selectedNote) {
      this.view.updateSelectedNote(this.selectedNote.id);
    }
  }

  #eventHandlers() {
    return {
      onNoteAdd: () => {
        this.selectedNote = NotesAPI.createNote();
        this.view.renderSelectedNote(this.selectedNote);
        this.view.updateNoteListScrollPosition();
        this.view.updateNotePreviewVisibility(true);
        this.view.clearSearchInput();
        this.filters.searchChars = '';
        this.#refreshNotes();
      },
      onNoteSelect: (noteId) => {        
        this.selectedNote = this.notes.find((note) => note.id === noteId);
        this.view.updateSelectedNote(noteId);
        this.view.renderSelectedNote(this.selectedNote);
        this.view.updateNotePreviewVisibility(true);
      },
      onNoteEdit: (editedTitle, editedContent) => {
        NotesAPI.updateNoteTitle(this.selectedNote.id, editedTitle);
        NotesAPI.updateNoteContent(this.selectedNote.id, editedContent);
        this.view.updateEditedNoteDate(NotesAPI.getUpdatedAt(this.selectedNote.id));
        this.view.updateNoteListScrollPosition();
        this.#refreshNotes(this.notes);
      },
      onNoteDelete: (noteId) => {
        if (noteId === this.selectedNote.id) {
          NotesAPI.removeNote(noteId);
          this.#refreshNotes();
          this.view.updateNotePreviewVisibility(false);
        }
      },
      onSearch: (inputChars) => {
        this.filters.searchChars = inputChars;
        this.#refreshNotes();
      },
    };
  }
}
