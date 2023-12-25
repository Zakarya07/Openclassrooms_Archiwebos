const gallery = document.querySelector(".gallery");
const filters_container = document.querySelector(".filters");
const modify_button = document.querySelector(".modify-button-container button");
const edition_mode_band = document.querySelector(".edition-mode");
const logout_button = document.querySelector("nav ul li:nth-of-type(3) a");
const modal_container = document.querySelector("#modal-container");
const modal_project_container = document.querySelector("#modal-container .modal  .modal-content > div");
const close_modal_button = document.querySelector("#modal-container .modal  .close");

const logout_page_url = "./index.html";
const logout_confirmation ="Vous êtes sur le point de vous déconnectez. Continuer ?";

const token = window.localStorage.getItem("token");

if (token) {

  modify_button.style.display = "block";
  edition_mode_band.style.display = "grid";
  logout_button.textContent = "logout";

  logout_button.addEventListener("click", (event) => {
    event.preventDefault();

    const should_logout = confirm(logout_confirmation);

    if (should_logout) {
      localStorage.removeItem("token");
      location.replace(logout_page_url);
    } 

  });

} 
const fetch_works = await fetch("http://localhost:5678/api/works");
const works_data = await fetch_works.json();

// _________________________________________________________ MODAL

// Open the modal
modify_button.addEventListener("click", function (event) {
  modal_container.classList.add("active");
});

// Close the modal
close_modal_button.addEventListener("click", function (event) {
  modal_container.classList.remove("active");
});
modal_container.addEventListener("click", function (event) {
  if (event.target === modal_container) {
    modal_container.classList.remove("active");
    }
})

// Generate the works in the modal 
function worksInModal (array_of_works) {
  const works = array_of_works;

  works.forEach((element) => {

    let project = document.createElement("div");
    let delete_button = document.createElement("div");
    let img = document.createElement("img");

    project.classList.add("project");
    project.dataset.projectId = element.id;

    delete_button.classList.add("project-delete-button");
    delete_button.innerHTML =  `<i class="fa-solid fa-trash-can"></i>`;

    img.setAttribute("src", element.imageUrl);

    project.append(img, delete_button);

    modal_project_container.append(project);
  })
  
}

worksInModal(works_data);

const delete_buttons = document.querySelectorAll(".modal .project .project-delete-button");

delete_buttons.forEach(delete_button => {
  // Delete a work and update the page
  delete_button.addEventListener("click", async function (event) {
    event.stopPropagation();
    event.preventDefault();
    const id_to_delete = this.parentElement.dataset.projectId;
    console.log("Project id: " + id_to_delete);
  
    try {
      const deleteRequest = await fetch(`http://localhost:5678/api/works/${id_to_delete}`, {
        method: 'DELETE',
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        }
      });
      console.log(deleteRequest);
      const test = await deleteRequest.json();
      console.log(test);
      
      if(deleteRequest.ok) {
        console.log(`Suppression du projet ${id_to_delete} réussie`);
        await updateContent();
      } else {
        console.error("Échec de la suppression, statut: " + deleteRequest.statusText);
      }
  
    } catch (error) {
      console.error("Erreur lors de la suppression du projet: " + error);
    }

  })

})



// ----------------------------------------------------- HOME WORKS

// Generate the works in the Home page 
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
    figure.setAttribute("title", `Catégorie: "${element.category.name}"`);
    figure.dataset.categoryId = element.categoryId;
    figure.append(img, figcaption);

    // Appending to gallery
    gallery.append(figure);
  });


}
worksGeneration(works_data);

// ---------------------------------------------- UPDATING 

async function updateContent () {
  try {

    const response = await fetch("http://localhost:5678/api/works");
    const update_data = await response.json();

    if (update_data) {

      // Update the modal data
      modal_project_container.innerHTML = "";
      worksInModal(update_data);
      
      // Update the gallery data
      gallery.innerHTML = "";
      worksGeneration(update_data);
    }
  } catch (error) {
    console.error('Erreur lors de la mise à jour du contenu' + error);
  }
}


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
        });

        gallery.innerHTML = "";
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
      });
    });
  });
}
filterWorksByCategory();
