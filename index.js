const wordsCounted = document.getElementById("word-count-new")
const description = document.getElementById("form-description-new")

description.addEventListener("input", () => {
  wordsCounted.textContent = description.value.length
})

