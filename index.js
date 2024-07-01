const notesConatiner = document.getElementById("notes-container")
let newNoteTitle = document.getElementById("form-title-new")
let newNoteCategory = document.getElementById("form-category-new")
const wordsCounted = document.getElementById("word-count-new")
let newNoteDescription = document.getElementById("form-description-new")
const noteTemplate = document.getElementById("note-template")
const checked = `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M8.83333 13.5L14.7083 7.625L13.5417 6.45833L8.83333 11.1667L6.45833 8.79167L5.29167 9.95833L8.83333 13.5ZM4.16667 17.5C3.70833 17.5 3.31583 17.3369 2.98917 17.0108C2.66306 16.6842 2.5 16.2917 2.5 15.8333V4.16667C2.5 3.70833 2.66306 3.31583 2.98917 2.98917C3.31583 2.66306 3.70833 2.5 4.16667 2.5H15.8333C16.2917 2.5 16.6842 2.66306 17.0108 2.98917C17.3369 3.31583 17.5 3.70833 17.5 4.16667V15.8333C17.5 16.2917 17.3369 16.6842 17.0108 17.0108C16.6842 17.3369 16.2917 17.5 15.8333 17.5H4.16667Z" fill="#212121"/>
</svg>`

const unchecked = `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M4.16667 17.5C3.70833 17.5 3.31583 17.3369 2.98917 17.0108C2.66306 16.6842 2.5 16.2917 2.5 15.8333V4.16667C2.5 3.70833 2.66306 3.31583 2.98917 2.98917C3.31583 2.66306 3.70833 2.5 4.16667 2.5H15.8333C16.2917 2.5 16.6842 2.66306 17.0108 2.98917C17.3369 3.31583 17.5 3.70833 17.5 4.16667V15.8333C17.5 16.2917 17.3369 16.6842 17.0108 17.0108C16.6842 17.3369 16.2917 17.5 15.8333 17.5H4.16667ZM4.16667 15.8333H15.8333V4.16667H4.16667V15.8333Z" fill="#212121"/>
</svg>`

const notes = []
let toBeRendered = [...notes]
const note = {
  id: "",
  title: "",
  category: "",
  description: "",
  date: "",
  complete: false
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
  for(let i = 0; i < toBeRendered.length; i++) {
  const noteCard = noteTemplate.content.cloneNode(true)
  noteCard.querySelector(".note-wrapper").id = toBeRendered[i].id
  noteCard.getElementById("note-category").innerText = toBeRendered[i].category
  noteCard.getElementById("note-category").classList.add(toBeRendered[i].category.toLowerCase())
  noteCard.getElementById("note-title").innerText = toBeRendered[i].title
  noteCard.getElementById("note-description").innerText = toBeRendered[i].description
  noteCard.getElementById("note-date").innerText = toBeRendered[i].date
  if (toBeRendered[i].complete) {
    noteCard.getElementById("checkbox").innerHTML = checked
    noteCard.getElementById(toBeRendered[i].id).classList.add("checked")
  } else {
    noteCard.getElementById("checkbox").innerHTML = unchecked
    noteCard.getElementById(toBeRendered[i].id).classList.remove("checked")
  }
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
  toBeRendered = [...notes]
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
  toBeRendered = [...notes]
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
  toBeRendered = [...notes]
  renderNotes()
}

const toggleComplete = (el) => {
  let parentId = el.closest(".note-wrapper").id
  let target
  for (let i = 0; i < notes.length; i++) {
    if (notes[i].id == parentId) {
      notes[i].complete = !notes[i].complete
      target = i
    }
  }
  if (notes[target].complete) {
        let move = notes.splice(target, 1)
        notes.push(...move)
      } else {
        notes.sort((a, b) => (
          (a.complete - b.complete) || (b.id - a.id)
          )
        )
      }
  toBeRendered = [...notes]
  renderNotes()
} 