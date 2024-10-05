import NotesAPI from './notes.js';
import NotesView from './notesView.js';

export default class App {
  constructor(root) {
    this.view = new NotesView(root, this.#eventHandlers());
  }

  #eventHandlers() {
    return {
      onNoteAdd: () => {},
    };
  }
}
