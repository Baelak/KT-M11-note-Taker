document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const noteTitle = document.querySelector('.note-title');
  const noteText = document.querySelector('.note-textarea');
  const saveNoteBtn = document.querySelector('.save-note');
  const newNoteBtn = document.querySelector('.new-note');
  const noteList = document.querySelector('.list-container .list-group');

  let activeNote = {};

  const show = (elem) => {
    elem.style.display = 'inline';
  };

  const hide = (elem) => {
    elem.style.display = 'none';
  };

  const getNotes = () => {
    return fetch('/api/notes').then((res) => {
      if (!res.ok) {
        throw new Error('Network response was not ok');
      }
      return res.json();
    });
  };

  const saveNote = (note) => {
    return fetch('/api/notes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(note),
    }).then((res) => {
      if (!res.ok) {
        throw new Error('Network response was not ok');
      }
      return res.json();
    });
  };

  const deleteNote = (id) => {
    return fetch(`/api/notes/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((res) => {
      if (!res.ok) {
        throw new Error('Network response was not ok');
      }
      return res.json();
    });
  };

  const renderActiveNote = () => {
    hide(saveNoteBtn);
    hide(newNoteBtn);

    if (activeNote.id) {
      noteTitle.setAttribute('readonly', true);
      noteText.setAttribute('readonly', true);
      noteTitle.value = activeNote.title;
      noteText.value = activeNote.text;
    } else {
      noteTitle.removeAttribute('readonly');
      noteText.removeAttribute('readonly');
      noteTitle.value = '';
      noteText.value = '';
    }
  };

  const handleNoteSave = () => {
    const newNote = {
      title: noteTitle.value,
      text: noteText.value,
    };
    saveNote(newNote).then(() => {
      getAndRenderNotes();
      renderActiveNote();
    });
  };

  const handleNoteDelete = (e) => {
    e.stopPropagation();

    const noteId = JSON.parse(e.target.parentElement.getAttribute('data-note')).id;

    if (activeNote.id === noteId) {
      activeNote = {};
    }

    deleteNote(noteId).then(() => {
      getAndRenderNotes();
      renderActiveNote();
    });
  };

  const handleNoteView = (e) => {
    e.preventDefault();
    activeNote = JSON.parse(e.target.parentElement.getAttribute('data-note'));
    renderActiveNote();
  };

  const handleNewNoteView = () => {
    activeNote = {};
    renderActiveNote();
  };

  const handleRenderSaveBtn = () => {
    if (!noteTitle.value.trim() || !noteText.value.trim()) {
      hide(saveNoteBtn);
    } else {
      show(saveNoteBtn);
    }
  };

  const renderNoteList = (notes) => {
    noteList.innerHTML = '';

    notes.forEach((note) => {
      const li = document.createElement('li');
      li.classList.add('list-group-item');
      li.dataset.note = JSON.stringify(note);

      const span = document.createElement('span');
      span.classList.add('list-item-title');
      span.innerText = note.title;
      span.addEventListener('click', handleNoteView);

      const deleteBtn = document.createElement('i');
      deleteBtn.classList.add('fas', 'fa-trash-alt', 'float-right', 'text-danger', 'delete-note');
      deleteBtn.addEventListener('click', handleNoteDelete);

      li.append(span, deleteBtn);
      noteList.append(li);
    });
  };

  const getAndRenderNotes = () => {
    getNotes().then((notes) => {
      renderNoteList(notes);
    }).catch((error) => {
      console.error('Error fetching notes:', error);
    });
  };

  // Initialize the event listeners
  noteTitle.addEventListener('keyup', handleRenderSaveBtn);
  noteText.addEventListener('keyup', handleRenderSaveBtn);
  saveNoteBtn.addEventListener('click', handleNoteSave);
  newNoteBtn.addEventListener('click', handleNewNoteView);

  // Load the initial list of notes
  getAndRenderNotes();
});
