const gallery = document.querySelector(".gallery");
const filters_container = document.querySelector(".filters");
const modify_button = document.querySelector(".modify-button-container button");
const edition_mode_band = document.querySelector(".edition-mode");
const logout_button = document.querySelector("nav ul li:nth-of-type(3) a");
const modal_container = document.querySelector("#modal-container");
const modal_project_container = document.querySelector(
  "#modal-container .modal  .modal-content > div"
);
const close_modal_button = document.querySelector(
  "#modal-container .modal  .close"
);

const modal_gallery_button_add_project = document.querySelector(
  "#add-project-button"
);
const modal_form_back_to_gallery_button =
  document.querySelector("#back-to-gallery");

const logout_page_url = "./index.html";
const logout_confirmation =
  "Vous êtes sur le point de vous déconnectez. Continuer ?";

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

// _____________________________________  MODAL  ____________________________________

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
});

// Toggle the display of the input type file image
const file_input = document.querySelector(".modal form input#imageInput");
file_input.addEventListener("change", () => {
  file_input.style.display = "block";
});

// ___________________________________________________________________ ADD PROJECT

// Grab form
const form = document.querySelector("form#add-project-form");
// Grab inputs
let image_input_element = form.querySelector("#imageInput");
let title_input_element = form.querySelector("#title");
let category_select_element = form.querySelector("select#category");

let category_initial_value = category_select_element.value;

// Errors in the form
const form_errors = form.querySelector("p.form-error");

// Grab submit button
let add_submit_btn = form.querySelector('button[type="submit"]');

let image_input_filled = false;
let title_input_filled = false;
let category_input_filled = false;

// track the user interaction with the fields
let image_input_touched = false;
let title_input_touched = false;
let category_input_touched = false;

// Handle the errors and succes message an the submit button color
function updateFormState() {
  const all_inputs_touched =
    image_input_touched && title_input_touched && category_input_touched;

  if (all_inputs_touched) {
    if (image_input_filled && title_input_filled && category_input_filled) {
      add_submit_btn.classList.add("success");
      form_errors.textContent = "";
    } else {
      add_submit_btn.classList.remove("success");
      form_errors.textContent = "Veuillez remplir tout les champs.";
    }
  }
}

// Checks for the image file
image_input_element.addEventListener("change", function () {
  if (image_input_element.files.length === 1) {
    image_input_filled = true;
    image_input_touched = true;
    updateFormState();
  }
});

// Checks for the title
title_input_element.addEventListener("input", function (event) {
  if (this.value.length > 0) {
    title_input_filled = true;
    title_input_touched = true;
    updateFormState();
  } else {
    title_input_filled = false;
    updateFormState();
  }
});

// Checks for the category
category_select_element.addEventListener("change", function () {
  if (this.value !== category_initial_value) {
    category_input_filled = true;
    category_input_touched = true;
    updateFormState();
  }
});


// ---------------------------------- Submit project function
function submitProject() {
  const form_data = new FormData();
  const URL = "http://localhost:5678/api/works";

  let image = image_input_element.files[0];
  let title = title_input_element.value;
  let category = Number(category_select_element.value);

  form_data.append("image", image);
  form_data.append("title", title);
  form_data.append("category", category);

  for (const entry of form_data) {
    console.log(entry[0] + ": " + entry[1])
  }

  // Send a request to the server

  fetch(URL, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
    },
    body: form_data,
  })
    .then(response => {
      if (response.status === 201) {
      } else {
        console.error("Un problème est survenue lors de l'ajout du projet");
      }
    })
    .catch(error => {
      console.error("Error:" + error);
    });

}

// Submiting the form to add the project
form.addEventListener("submit", (event) => {
  event.preventDefault();

  image_input_touched = true;
  title_input_touched = true;
  category_input_touched = true;

  updateFormState();

  if (image_input_filled && title_input_filled && category_input_filled) {
    submitProject();
    title_input_element.value = "";
    category_select_element.value = category_initial_value ;
  }
});

// _________________________________________________________________ GENERATE WORKS IN MODAL
function worksInModal(array_of_works) {
  const works = array_of_works;

  works.forEach((element) => {
    let project = document.createElement("div");
    let delete_button = document.createElement("button");
    let img = document.createElement("img");

    project.classList.add("project");
    project.dataset.projectId = element.id;

    delete_button.classList.add("project-delete-button");
    delete_button.innerHTML = `<i class="fa-solid fa-trash-can"></i>`;
    delete_button.setAttribute("type", "button");

    img.setAttribute("src", element.imageUrl);

    project.append(img, delete_button);

    modal_project_container.append(project);
  });
}
worksInModal(works_data);

// __________________________________________________________________ DELETE A WORK
const delete_buttons = document.querySelectorAll(
  ".modal .modal-project-container .project .project-delete-button"
);
delete_buttons.forEach((delete_button) => {
  // Delete a work and update the page
  delete_button.addEventListener("click", async function (event) {
    event.stopPropagation();
    event.preventDefault();
    const id_to_delete = this.parentElement.dataset.projectId;
    console.log("Project id: " + id_to_delete);

    try {
      const deleteRequest = await fetch(
        `http://localhost:5678/api/works/${id_to_delete}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(deleteRequest);
      const test = await deleteRequest.json();
      console.log(test);

      if (deleteRequest.ok) {
        console.log(`Suppression du projet ${id_to_delete} réussie`);
        await updateContent();
      } else {
        console.error(
          "Échec de la suppression, statut: " + deleteRequest.statusText
        );
      }
    } catch (error) {
      console.error("Erreur lors de la suppression du projet: " + error);
    }
  });
});

// --------------------------- Slide between the gallery and the form
// Add project
modal_gallery_button_add_project.addEventListener("click", () => {
  modal_gallery_button_add_project.closest(".modal-gallery").style =
    "display:none;";
  modal_form_back_to_gallery_button.closest(".modal-form").style =
    "display:block;";
});

// Back to gallery
modal_form_back_to_gallery_button.addEventListener("click", () => {
  modal_form_back_to_gallery_button.closest(".modal-form").style =
    "display:none";
  modal_gallery_button_add_project.closest(".modal-gallery").style =
    "display:flex";
});

// ___________________________________________________ HOME WORKS

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
async function updateContent() {
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
    console.error("Erreur lors de la mise à jour du contenu" + error);
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

    // ------------------------------- For the modal form to add project
    const modal_projects_add_form_select = modal_container.querySelector(
      ".modal-form form select"
    );

    const options_add = document.createElement("option");
    options_add.textContent = element.name;
    options_add.value = element.id;
    modal_projects_add_form_select.appendChild(options_add);
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
