export default class LocalStorage {
  static saveNotesData(notesData) {
    localStorage.setItem('NotesData', JSON.stringify(notesData));
  }
  static getNotesData() {
    return JSON.parse(localStorage.getItem('NotesData')) || [];
  }
}
