document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const noteTitle = document.querySelector('.note-title');
  const noteText = document.querySelector('.note-textarea');
  const saveNoteBtn = document.querySelector('.save-note');
  const newNoteBtn = document.querySelector('.new-note');
  const clearBtn = document.querySelector('.clear-btn');
  const noteList = document.querySelector('.list-container .list-group');
});

  let activeNote = {};


  const show = (elem) => {
    elem.style.display = 'inline';
  };

  const hide = (elem) => {
    elem.style.display = 'none';
  };

  const getNotes = () => {
    fetch(`/api/notes`)
      .then((res) => res.json())
      .then((data) => {
        renderNoteList(data);
      })
      .catch((error) => {
        console.error('Error fetching notes:', error);
      });
  };

  const saveNote = (note) => {
    fetch(`/api/notes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(note),
    })
    .then((res) => res.json())
    .then(() => {
      getNotes();
      clearForm();
    })
    .catch((error) => {
      console.error('Error saving note:', error);
    });
  };

  const deleteNote = (id) => {
    fetch(`/api/notes/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then((res) => res.json())
    .then(() => {
      getNotes();
    })
    .catch((error) => {
      console.error('Error deleting note:', error);
    });
  };

  const handleNoteSave = () => {
    const title = noteTitle.value.trim();
    const text = noteText.value.trim();
    if (!title || !text) {
      return;
    }

    const newNote = { title, text };

    if (activeNote.id) {
      newNote.id = activeNote.id;
      activeNote = {};
    }

    saveNote(newNote);
  };

  const handleNoteDelete = (event) => {
    const target = event.target;
    if (target.matches('.delete-note')) {
      const noteId = target.parentElement.dataset.id;
      deleteNote(noteId);
    }
  };

  const handleNewNote = () => {
    activeNote = {};
    clearForm();
  };

  const clearForm = () => {
    noteTitle.value = '';
    noteText.value = '';
  };

  const renderNoteList = (notes) => {
    noteList.innerHTML = ''; // Clear the existing notes

    notes.forEach((note) => {
      const listItem = document.createElement('li');
      listItem.classList.add('list-group-item');
      listItem.dataset.id = note.id;
      listItem.innerHTML = `
        <h3 class="list-item-title">${note.title}</h3>
        <i class="fas fa-trash-alt float-right delete-note"></i>
      `;
      noteList.appendChild(listItem);
    });
  };

  saveNoteBtn.addEventListener('click', handleNoteSave);
  newNoteBtn.addEventListener('click', handleNewNote);
  clearBtn.addEventListener('click', clearForm);
  noteList.addEventListener('click', handleNoteDelete);

  getNotes();

