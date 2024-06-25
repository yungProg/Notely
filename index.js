const notesConatiner = document.getElementById("notes-container")
let newNoteTitle = document.getElementById("form-title-new")
let newNoteCategory = document.getElementById("form-category-new")
const wordsCounted = document.getElementById("word-count-new")
let newNoteDescription = document.getElementById("form-description-new")
const noteTemplate = document.getElementById("note-template")

const notes = []
const note = {
  id: "",
  title: "",
  category: "",
  description: "",
  date: "",
  noteIndex: null,
}

newNoteDescription.addEventListener("input", () => {
  wordsCounted.textContent = newNoteDescription.value.length
})

document.getElementById("form-description-edit").addEventListener("input", () => {
  document.getElementById("word-count-edit").innerText = document.getElementById("form-description-edit").value.length
})

const openDialog = (el) => {
  document.getElementById(el).showModal()
}

const closeDialog = (el) => {
  document.getElementById(el).close()
}

document.querySelectorAll(".cancel").forEach(item => {
  item.addEventListener("click", () => {
    closeDialog("add-note-dialog")
    closeDialog("edit-note-dialog")
    closeDialog("delete-note-dialog")
  })
})

const renderNotes = () => {
  notesConatiner.innerHTML = ""
  for(let i = 0; i < notes.length; i++) {
  const noteCard = noteTemplate.content.cloneNode(true)
  noteCard.querySelector(".note-wrapper").id = notes[i].id
  noteCard.getElementById("note-category").innerText = notes[i].category
  noteCard.getElementById("note-category").classList.add(notes[i].category.toLowerCase())
  noteCard.getElementById("note-title").innerText = notes[i].title
  noteCard.getElementById("note-description").innerText = notes[i].description
  noteCard.getElementById("note-date").innerText = notes[i].date
  notesConatiner.append(noteCard)
  }
}

const addNewNote = () => {
  let id = Date.now()
  let title = newNoteTitle.value
  let category = newNoteCategory.value
  let description = newNoteDescription.value
  let date = new Date().toLocaleDateString("en-GB", {dateStyle: "long"})
  let noteIndex = notes.length
  notes.unshift({...note, id, title, category, description, date, noteIndex})
  console.log(notes);
  renderNotes()
  document.getElementById("add-note-form").reset()
}

let indexNo

const editNote = (el) => {
  let noteToEdit
  notes.forEach(item => {
    if(item.id == el.parentElement.parentElement.parentElement.id) {
      openDialog('edit-note-dialog')
      noteToEdit = item
      indexNo = notes.indexOf(item)
    }
  })
  document.getElementById("form-title-edit").value = noteToEdit.title
  document.getElementById("form-category-edit").value = noteToEdit.category
  document.getElementById("form-description-edit").value = noteToEdit.description
  document.getElementById("word-count-edit").innerText = noteToEdit.description.length
}

const confirmEdit = () => {
  let id = Date.now()
  let date = new Date().toLocaleDateString("en-GB", {dateStyle: "long"})
  let title = document.getElementById("form-title-edit").value
  let category = document.getElementById("form-category-edit").value
  let description = document.getElementById("form-description-edit").value
  notes[indexNo] = {...notes[indexNo], id, title, category, description, date}
  let moveItem = notes.splice(indexNo, 1)
  notes.unshift(...moveItem)
  renderNotes()
  document.getElementById("add-note-form").reset()
}

let itemToDelete 
const openDeleteDialog = (el) => {
  openDialog("delete-note-dialog")
  for(let i = 0; i < notes.length; i++) {
    if(notes[i].id == el.parentElement.parentElement.parentElement.id) {
      itemToDelete = i
    }
  }
}

const deleteNote = () => {
  notes.splice(itemToDelete, 1)
  renderNotes()
}