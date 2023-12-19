const gallery = document.querySelector(".gallery");
const filters_container = document.querySelector(".filters");
const modify_button = document.querySelector(".modify-button-container button");
const edition_mode_band = document.querySelector(".edition-mode")

const token = window.localStorage.getItem("token");

  if (token) {
    modify_button.style.display = "block";
    edition_mode_band.style.display = "grid";
  } else {
    alert('No token')
  }

  modify_button.addEventListener("click", function (event) {
    alert("OPEN THE MODAL")
  })

// ----------------------------------------------------- WORKS

const fetch_works = await fetch("http://localhost:5678/api/works");
const works_data = await fetch_works.json();
function worksGeneration(array_of_works) {
  const works = array_of_works;

  works.forEach((element) => {
    // Creating elements
    let figure = document.createElement("figure");
    let img = document.createElement("img");
    let figcaption = document.createElement("figcaption");

    // Setting attributes and content
    img.setAttribute("src", element.imageUrl);
    figcaption.textContent = element.title;
    figure.setAttribute("title", `Catégorie: "${element.category.name}"`)
    figure.dataset.categoryId = element.categoryId;
    figure.append(img, figcaption);

    // Appending to gallery
    gallery.append(figure);
  });
}
worksGeneration(works_data);

// -------------------------------------------------- CATEGORIES
const fetch_categories = await fetch("http://localhost:5678/api/categories");
const categories_data = await fetch_categories.json();

function categoriesGeneration(array_of_categories) {
  const categories = array_of_categories;

  categories.forEach((element) => {
    // Creating element
    let button = document.createElement("button");

    // Setting attributes and content
    button.textContent = element.name;
    button.dataset.categoryId = element.id;

    // Appending to filters container
    filters_container.append(button);
  });

  const buttons = filters_container.querySelectorAll("button");

  buttons.forEach((element) => {
    element.addEventListener("click", function (event) {
      buttons.forEach((button) => {
        button.classList.remove("active");
      });

      element.classList.add("active");
    });
  });
}
categoriesGeneration(categories_data);

// --------------------------------------------------- FILTERING
function filterWorksByCategory() {

  const buttons = filters_container.querySelectorAll("button");

  buttons.forEach((button) => {
    button.addEventListener("click", () => {

      if (button.dataset.categoryId) {

        let filteredWorks = works_data.filter(function (work) {
            return Number(work.categoryId) === Number(button.dataset.categoryId);
        })

        gallery.innerHTML= "";
        worksGeneration(filteredWorks);
        gallery.classList.add("fade-in");

      } else {

        gallery.innerHTML = "";
        worksGeneration(works_data);
        gallery.classList.add("fade-in");

      }

      gallery.addEventListener("animationend", () => {

        if (gallery.classList.contains("fade-in")) {
          gallery.classList.remove("fade-in");
        } 
        
      })

    });

  });

}
filterWorksByCategory();

