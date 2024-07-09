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

let notes = []
let toBeRendered = [...notes]
const note = {
  id: "",
  title: "",
  category: "",
  description: "",
  date: "",
  complete: false
}

const localNotes = localStorage.getItem("notes") 


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
  noNote()
  localStorage.setItem("notes", JSON.stringify(notes))
}

if (localNotes) {
  notes = JSON.parse(localNotes)
  toBeRendered = [...notes]
  renderNotes()
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

const searchNote = () => {
  let query = document.getElementById("search-field")
  toBeRendered = notes.filter((item) => (item.title.toLowerCase().includes(query.value.toLowerCase())))
  renderNotes()
}

document.getElementById("search-field").addEventListener("input", () => searchNote())

const filterNotes = (critirion) => {
  if (critirion.textContent.toLowerCase() == "all") {
    critirion.classList.add("active-cat")
    toBeRendered = [...notes]
  } else {
    critirion.classList.add("active-cat")
    toBeRendered = notes.filter(item => item.category.toLowerCase() == critirion.textContent.toLowerCase())
  }
  renderNotes()
} 

document.querySelectorAll(".cat").forEach(item => {
  item.addEventListener("click", () => {
    document.querySelectorAll(".cat").forEach(item => item.classList.remove("active-cat"))
    filterNotes(item)})
  })
  
  const completedNotes = (el) => {
    if (el.checked) {
      toBeRendered = notes.filter(item => item.complete == true)
    } else {
      toBeRendered = [...notes]
    }
    console.log(1)
    console.log(el.checked)
    renderNotes()
  } 
  
  
  function noNote() {
    let nill = `<div class='nill'><svg width="207" height="188" viewBox="0 0 207 188" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M33.8398 42.1122C33.8398 34.2212 40.2368 27.8242 48.1278 27.8242H148.896C156.787 27.8242 163.184 34.2212 163.184 42.1122V143.632C163.184 151.523 156.787 157.92 148.896 157.92H48.1278C40.2368 157.92 33.8398 151.523 33.8398 143.632V42.1122Z" fill="#D4E1F1"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M157.92 20.3039H48.1279C41.0675 20.3039 35.3439 26.0275 35.3439 33.0879V143.632C35.3439 150.692 41.0675 156.416 48.1279 156.416H157.92C164.98 156.416 170.704 150.692 170.704 143.632V33.0879C170.704 26.0275 164.98 20.3039 157.92 20.3039ZM48.1279 17.2959C39.4063 17.2959 32.3359 24.3662 32.3359 33.0879V143.632C32.3359 152.354 39.4063 159.424 48.1279 159.424H157.92C166.642 159.424 173.712 152.354 173.712 143.632V33.0879C173.712 24.3662 166.642 17.2959 157.92 17.2959H48.1279Z" fill="#6A9BD9"/>
<path d="M89.4878 80.4638C89.4878 84.617 86.1209 87.9838 81.9678 87.9838C77.8146 87.9838 74.4478 84.617 74.4478 80.4638C74.4478 76.3107 77.8146 72.9438 81.9678 72.9438C86.1209 72.9438 89.4878 76.3107 89.4878 80.4638Z" fill="#6A9BD9"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M88.6566 54.3027C87.9136 53.9312 87.0102 54.2323 86.6387 54.9753C84.2668 59.7191 76.3592 69.1839 63.92 69.1839C63.0893 69.1839 62.416 69.8572 62.416 70.6879C62.416 71.5185 63.0893 72.1919 63.92 72.1919C77.9511 72.1919 86.6878 61.6033 89.3292 56.3205C89.7006 55.5775 89.3995 54.6741 88.6566 54.3027Z" fill="#6A9BD9"/>
<path d="M116.56 80.4638C116.56 84.617 119.927 87.9838 124.08 87.9838C128.233 87.9838 131.6 84.617 131.6 80.4638C131.6 76.3107 128.233 72.9438 124.08 72.9438C119.927 72.9438 116.56 76.3107 116.56 80.4638Z" fill="#6A9BD9"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M117.391 54.3027C118.134 53.9312 119.038 54.2323 119.409 54.9753C121.781 59.7191 129.689 69.1839 142.128 69.1839C142.959 69.1839 143.632 69.8572 143.632 70.6879C143.632 71.5185 142.959 72.1919 142.128 72.1919C128.097 72.1919 119.36 61.6033 116.719 56.3205C116.347 55.5775 116.648 54.6741 117.391 54.3027Z" fill="#6A9BD9"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M88.9961 109.709C88.2111 109.438 87.7951 108.581 88.0668 107.796L89.488 108.288C88.0668 107.796 88.067 107.795 88.0673 107.795L88.0692 107.789L88.0729 107.779L88.0843 107.747C88.0936 107.721 88.1065 107.686 88.123 107.643C88.156 107.556 88.2036 107.435 88.2668 107.285C88.393 106.985 88.5819 106.566 88.8406 106.068C89.3565 105.074 90.1594 103.747 91.3118 102.416C93.6285 99.7388 97.3977 97.0081 103.024 97.0081C108.65 97.0081 112.42 99.7388 114.736 102.416C115.889 103.747 116.692 105.074 117.207 106.068C117.466 106.566 117.655 106.985 117.781 107.285C117.844 107.435 117.892 107.556 117.925 107.643C117.942 107.686 117.954 107.721 117.964 107.747L117.975 107.779L117.979 107.789L117.98 107.793L117.981 107.795C117.981 107.795 117.981 107.796 116.603 108.273L117.981 107.796C118.253 108.581 117.837 109.438 117.052 109.709C116.268 109.981 115.413 109.566 115.14 108.783C115.14 108.782 115.139 108.781 115.139 108.78L116.56 108.288C115.139 108.78 115.139 108.781 115.139 108.781L115.14 108.783L115.136 108.773C115.132 108.762 115.125 108.742 115.114 108.713C115.092 108.657 115.058 108.568 115.008 108.451C114.91 108.216 114.755 107.872 114.538 107.454C114.102 106.614 113.424 105.497 112.462 104.384C110.548 102.173 107.55 100.016 103.024 100.016C98.4984 100.016 95.4996 102.173 93.5863 104.384C92.6237 105.497 91.9461 106.614 91.5102 107.454C91.2931 107.872 91.1383 108.216 91.0398 108.451C90.9906 108.568 90.9556 108.657 90.9341 108.713C90.9233 108.742 90.9159 108.762 90.9118 108.773L90.9093 108.78C90.9092 108.78 90.909 108.781 90.9089 108.781C90.9088 108.782 90.9087 108.782 90.9086 108.782C90.9084 108.783 90.9083 108.783 90.9082 108.783C90.6352 109.566 89.7799 109.981 88.9961 109.709Z" fill="#6A9BD9"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M0.440511 118.504C1.02786 117.917 1.98014 117.917 2.56749 118.504L12.7195 128.656C13.3068 129.244 13.3068 130.196 12.7195 130.783C12.1321 131.371 11.1799 131.371 10.5925 130.783L0.440511 120.631C-0.146837 120.044 -0.146837 119.092 0.440511 118.504Z" fill="#7CA9E2"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M191.448 162.121C192.036 161.533 192.988 161.533 193.575 162.121L201.847 170.393C202.435 170.98 202.435 171.932 201.847 172.52C201.26 173.107 200.308 173.107 199.72 172.52L191.448 164.248C190.861 163.66 190.861 162.708 191.448 162.121Z" fill="#7CA9E2"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M0.440511 130.784C1.02786 131.371 1.98014 131.371 2.56749 130.784L12.7195 120.632C13.3068 120.044 13.3068 119.092 12.7195 118.505C12.1321 117.917 11.1799 117.917 10.5925 118.505L0.440511 128.657C-0.146837 129.244 -0.146837 130.196 0.440511 130.784Z" fill="#7CA9E2"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M191.448 172.519C192.036 173.107 192.988 173.107 193.575 172.519L201.847 164.247C202.435 163.66 202.435 162.708 201.847 162.12C201.26 161.533 200.308 161.533 199.72 162.12L191.448 170.392C190.861 170.98 190.861 171.932 191.448 172.519Z" fill="#7CA9E2"/>
<path opacity="0.36" fill-rule="evenodd" clip-rule="evenodd" d="M85.2877 0.440511C84.7004 -0.146837 83.7481 -0.146837 83.1607 0.440511C82.5734 1.02786 82.5734 1.98014 83.1607 2.56749L85.8573 5.26402L83.1608 7.96052C82.5734 8.54787 82.5734 9.50015 83.1608 10.0875C83.7481 10.6748 84.7004 10.6748 85.2877 10.0875L87.9842 7.391L90.6807 10.0875C91.2681 10.6748 92.2204 10.6748 92.8077 10.0875C93.3951 9.50014 93.3951 8.54786 92.8077 7.96051L90.1112 5.26402L92.8077 2.5675C93.3951 1.98015 93.3951 1.02787 92.8077 0.440519C92.2204 -0.146829 91.2681 -0.146829 90.6808 0.440519L87.9842 3.13704L85.2877 0.440511Z" fill="#7CA9E2"/>
<path opacity="0.36" fill-rule="evenodd" clip-rule="evenodd" d="M16.5438 69.936C17.7897 69.936 18.7998 68.926 18.7998 67.68C18.7998 66.4341 17.7897 65.424 16.5438 65.424C15.2978 65.424 14.2878 66.4341 14.2878 67.68C14.2878 68.926 15.2978 69.936 16.5438 69.936ZM16.5438 72.944C19.451 72.944 21.8078 70.5872 21.8078 67.68C21.8078 64.7728 19.451 62.416 16.5438 62.416C13.6366 62.416 11.2798 64.7728 11.2798 67.68C11.2798 70.5872 13.6366 72.944 16.5438 72.944Z" fill="#6A9BD9"/>
<path d="M137.616 181.984C137.616 185.306 134.923 188 131.6 188C128.277 188 125.584 185.306 125.584 181.984C125.584 178.661 128.277 175.968 131.6 175.968C134.923 175.968 137.616 178.661 137.616 181.984Z" fill="#EEEEEE"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M131.6 184.992C133.261 184.992 134.608 183.645 134.608 181.984C134.608 180.323 133.261 178.976 131.6 178.976C129.939 178.976 128.592 180.323 128.592 181.984C128.592 183.645 129.939 184.992 131.6 184.992ZM131.6 188C134.923 188 137.616 185.306 137.616 181.984C137.616 178.661 134.923 175.968 131.6 175.968C128.277 175.968 125.584 178.661 125.584 181.984C125.584 185.306 128.277 188 131.6 188Z" fill="#6A9BD9"/>
<path opacity="0.36" fill-rule="evenodd" clip-rule="evenodd" d="M189.023 54.0635C188.486 54.2803 188.385 54.9969 188.841 55.3533L198.592 62.9715C199.048 63.3279 199.719 63.0569 199.8 62.4836L201.522 50.2303C201.602 49.657 201.032 49.2115 200.496 49.4284L189.023 54.0635ZM197.999 53.6811L193.772 55.3888L197.365 58.1955L197.999 53.6811Z" fill="#7CA9E2"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M11.9124 158.901C11.3756 159.118 11.2749 159.835 11.7311 160.191L20.1928 166.802C20.649 167.159 21.3199 166.888 21.4005 166.315L22.8951 155.681C22.9757 155.108 22.4055 154.662 21.8687 154.879L11.9124 158.901ZM19.3725 159.132L16.6621 160.227L18.9656 162.026L19.3725 159.132Z" fill="#7CA9E2"/>
</svg> <p>You don't have any note</p></div>
`

let noResult = `<div class='nill'><svg width="207" height="188" viewBox="0 0 207 188" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M0.440511 118.504C1.02786 117.917 1.98014 117.917 2.56749 118.504L12.7195 128.656C13.3068 129.244 13.3068 130.196 12.7195 130.783C12.1321 131.371 11.1799 131.371 10.5925 130.783L0.440511 120.631C-0.146837 120.044 -0.146837 119.092 0.440511 118.504Z" fill="#7CA9E2"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M191.448 162.12C192.036 161.533 192.988 161.533 193.575 162.12L201.847 170.392C202.435 170.98 202.435 171.932 201.847 172.519C201.26 173.107 200.308 173.107 199.72 172.519L191.448 164.247C190.861 163.66 190.861 162.708 191.448 162.12Z" fill="#7CA9E2"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M0.440511 130.784C1.02786 131.371 1.98014 131.371 2.56749 130.784L12.7195 120.632C13.3068 120.044 13.3068 119.092 12.7195 118.505C12.1321 117.917 11.1799 117.917 10.5925 118.505L0.440511 128.657C-0.146837 129.244 -0.146837 130.196 0.440511 130.784Z" fill="#7CA9E2"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M191.448 172.519C192.036 173.107 192.988 173.107 193.575 172.519L201.847 164.247C202.435 163.66 202.435 162.708 201.847 162.12C201.26 161.533 200.308 161.533 199.72 162.12L191.448 170.392C190.861 170.98 190.861 171.932 191.448 172.519Z" fill="#7CA9E2"/>
<path opacity="0.36" fill-rule="evenodd" clip-rule="evenodd" d="M85.2872 0.440511C84.6999 -0.146837 83.7476 -0.146837 83.1602 0.440511C82.5729 1.02786 82.5729 1.98014 83.1602 2.56749L85.8568 5.26402L83.1603 7.96052C82.5729 8.54787 82.5729 9.50015 83.1603 10.0875C83.7476 10.6748 84.6999 10.6748 85.2872 10.0875L87.9837 7.391L90.6802 10.0875C91.2676 10.6748 92.2199 10.6748 92.8072 10.0875C93.3946 9.50014 93.3946 8.54786 92.8072 7.96051L90.1107 5.26402L92.8072 2.5675C93.3946 1.98015 93.3946 1.02787 92.8072 0.440519C92.2199 -0.146829 91.2676 -0.146829 90.6803 0.440519L87.9837 3.13704L85.2872 0.440511Z" fill="#7CA9E2"/>
<path opacity="0.36" fill-rule="evenodd" clip-rule="evenodd" d="M16.5443 69.936C17.7902 69.936 18.8003 68.926 18.8003 67.68C18.8003 66.4341 17.7902 65.424 16.5443 65.424C15.2983 65.424 14.2883 66.4341 14.2883 67.68C14.2883 68.926 15.2983 69.936 16.5443 69.936ZM16.5443 72.944C19.4515 72.944 21.8083 70.5872 21.8083 67.68C21.8083 64.7728 19.4515 62.416 16.5443 62.416C13.637 62.416 11.2803 64.7728 11.2803 67.68C11.2803 70.5872 13.637 72.944 16.5443 72.944Z" fill="#6A9BD9"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M131.6 184.992C133.261 184.992 134.608 183.645 134.608 181.984C134.608 180.323 133.261 178.976 131.6 178.976C129.939 178.976 128.592 180.323 128.592 181.984C128.592 183.645 129.939 184.992 131.6 184.992ZM131.6 188C134.923 188 137.616 185.306 137.616 181.984C137.616 178.661 134.923 175.968 131.6 175.968C128.277 175.968 125.584 178.661 125.584 181.984C125.584 185.306 128.277 188 131.6 188Z" fill="#6A9BD9"/>
<path opacity="0.36" fill-rule="evenodd" clip-rule="evenodd" d="M189.023 54.063C188.486 54.2799 188.385 54.9964 188.841 55.3528L198.592 62.971C199.048 63.3274 199.719 63.0564 199.8 62.4831L201.522 50.2298C201.602 49.6565 201.032 49.211 200.496 49.4279L189.023 54.063ZM197.999 53.6806L193.772 55.3883L197.365 58.195L197.999 53.6806Z" fill="#7CA9E2"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M11.9124 158.901C11.3756 159.118 11.2749 159.835 11.7311 160.191L20.1928 166.802C20.649 167.159 21.3199 166.888 21.4005 166.315L22.8951 155.681C22.9757 155.108 22.4055 154.662 21.8687 154.879L11.9124 158.901ZM19.3725 159.132L16.6621 160.227L18.9656 162.026L19.3725 159.132Z" fill="#7CA9E2"/>
<ellipse cx="91" cy="96.5" rx="36" ry="36.5" fill="#D4E1F1"/>
<circle cx="94" cy="94" r="51" stroke="#6A9BD9" stroke-width="4"/>
<path d="M96.1774 66.9207C102.102 67.9083 107.599 70.6362 111.969 74.7572" stroke="#6A9BD9" stroke-width="4"/>
<path d="M113.879 76.7292C115.463 78.5214 116.83 80.4952 117.95 82.6092" stroke="#6A9BD9" stroke-width="4"/>
<circle cx="94" cy="94" r="41" stroke="#6A9BD9" stroke-width="4"/>
<path d="M127.17 135.209L137.534 124.365L157.415 143.365C160.41 146.227 160.517 150.974 157.655 153.969C154.794 156.963 150.046 157.071 147.052 154.209L127.17 135.209Z" stroke="#6A9BD9" stroke-width="4"/>
</svg></div>
`

if (notes.length < 1) {
  document.getElementById("notes-container").style.display = "block"
  document.getElementById("notes-container").innerHTML = nill
} else if (toBeRendered.length < 1) {
  document.getElementById("notes-container").style.display = "block"
  document.getElementById("notes-container").innerHTML = noResult
}
else {
  document.getElementById("notes-container").style.display = "grid"
}
  }