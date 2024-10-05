import LocalStorage from './localStorage.js';

class Note {
  #colors = { 'yellow': '#fef08a', 'orange': '#fed7aa', 'red': '#fecaca', 'blue': '#bfdbfe', 'purple': '#e9d5ff', 'rose': '#fecdd3', 'lime': '#d9f99d', 'teal': '#99f6e4' };
  
  constructor({
    id = this.#generateUUID(),
    title = 'عنوان یادداشت',
    content = 'متن یادداشت',
    createdAt = new Date().toISOString(),
    updatedAt = new Date().toISOString(),
    color = this.#getRandomColor()
  }) {
    this.id = id;
    this.title = title;
    this.content = content;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.color = color;
  }
  
  #generateUUID() {
    return Math.random().toString(36).substring(2, 10);
  }

  #getRandomColor() {
    const colorNames = [];
    for (const [name, code] of Object.entries(this.#colors)) colorNames.push(name);
    return colorNames[Math.floor(Math.random() * colorNames.length)];
  }

  get getColors() {
    return this.#colors;
  }

  setColor(color) {
    this.color = color;
  }
  
  setTitle(title) {
    this.title = (title.trim() === '') ? 'عنوان یادداشت' : title;    
    this.setUpdatedDate();
  }
  
  setContent(content) {
    this.content = (content.trim() === '') ? 'متن یادداشت' : content;
    this.setUpdatedDate();
  }

  setUpdatedDate() {
    this.updatedAt = new Date().toISOString();
  }
}

export default class NotesAPI {
  static getNotes() {
    let notes = LocalStorage.getNotesData();
    notes = notes.map((note) => new Note({ ...note }));
    notes.sort((a, b) => {
      return (new Date(a.updatedAt) > new Date(b.updatedAt)) ? -1 : 1;
    });
    return notes;
  }

  static createNote() {
    const notes = this.getNotes();
    const note = new Note({});
    notes.push(note);
    LocalStorage.saveNotesData(notes);
    return note;
  }

  static updateNoteTitle(id, title) {
    const notes = this.getNotes();
    const note = notes.find((note) => note.id === id);
    note.setTitle(title);
    LocalStorage.saveNotesData(notes);
  }

  static updateNoteContent(id, content) {
    const notes = this.getNotes();
    const note = notes.find((note) => note.id === id);
    note.setContent(content);
    LocalStorage.saveNotesData(notes);
  }
  
  static getUpdatedAt(id) {
    const notes = this.getNotes();
    const note = notes.find((note) => note.id === id);
    return note.updatedAt;
  }

  static findNote(id) {
    const notes = this.getNotes();
    return notes.find((note) => note.id === id);
  }

  static removeNote(id) {
    let notes = this.getNotes();
    notes = notes.filter((note) => note.id !== id);
    LocalStorage.saveNotesData(notes);
  }
}
