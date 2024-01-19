import { categoriesGeneration } from "./modules/categories.js";
import { filterWorksByCategory } from "./modules/filter_works.js";
import { worksGeneration } from "./modules/home_works.js";
import { deleteWork } from "./modules/delete_works.js";
import { worksInModal } from "./modules/modal_works.js";
import { submitProject } from "./modules/submit_works.js";
import { updateContent } from "./modules/update.js";
import { previewFile } from "./modules/preview_file.js";

const gallery = document.querySelector(".gallery");
const modify_button = document.querySelector(".modify-button-container button");
const edition_mode_band = document.querySelector(".edition-mode");
const filters = document.querySelector(".filters");
const logout_button = document.querySelector("nav ul li:nth-of-type(3) a");
const modal_container = document.querySelector("#modal-container");
const modal_project_container = document.querySelector(
  "#modal-container .modal .modal-content > div"
);
const close_modal_button = document.querySelector(
  "#modal-container .modal .close"
);
const modal_gallery_button_add_project = document.querySelector(
  "#add-project-button"
);
const modal_form_back_to_gallery_button =
  document.querySelector("#back-to-gallery");

const logout_page_url = "./index.html";
const logout_confirmation =
  "Vous êtes sur le point de vous déconnectez. Continuer ?";

// Get the token form the local storage
const token = window.localStorage.getItem("token");
// If the token is stocked in the localStorage, then we can perform some things (user connected privileges)
if (token) {
  modify_button.style.display = "block";
  edition_mode_band.style.display = "grid";
  filters.style.display = "none";
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

// ---------- MODAL
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

// Toggle the display of the input type file image if an image is selected by the user
const file_input = document.querySelector(".modal form input#imageInput");
file_input.addEventListener("change", () => {
  file_input.style.display = "block";
});

// ---------- GENERATE WORKS IN THE HOME 
// Fetch request to get the works
const fetch_works = await fetch("http://localhost:5678/api/works");
const works_data = await fetch_works.json();

// Function that generates the works in the Homepage
worksGeneration(works_data);

// ---------- GENERATE WORKS IN MODAL
worksInModal(works_data);

// ---------- DISPLAY CATEGORIES BUTTON
const fetch_categories = await fetch("http://localhost:5678/api/categories");
const categories_data = await fetch_categories.json();
categoriesGeneration(categories_data);

// ---------- FILTERING WORKS BY CATEGORY
filterWorksByCategory();

// ---------- DELETE A WORK
modal_project_container.addEventListener("click", function (event) {
  const deleteButton = event.target.closest(".project-delete-button");

  if (deleteButton) {
    event.stopPropagation();
    event.preventDefault();
    const id_to_delete = deleteButton.parentElement.dataset.projectId;
    deleteWork(id_to_delete);
  }
});

// ---------- SLIDE  FORM/GALLERY FORM (MODAL)
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

// ---------- ADD PROJECT

// Grab the <form>
const form = document.querySelector("form#add-project-form");

// Grab the differents inputs
let image_input_element = form.querySelector("#imageInput");
let title_input_element = form.querySelector("#title");
let category_select_element = form.querySelector("select#category");

let category_initial_value = category_select_element.value;

// Errors in the form
const form_errors = form.querySelector("p.form-error");
// Grab submit button
let add_submit_btn = form.querySelector('button[type="submit"]');
// Check if the inputs have some value, if they filled 
let image_input_filled = false;
let title_input_filled = false;
let category_input_filled = false;
// Track the user interaction with the fields
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
    previewFile();
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
// ---------- Submiting the form to add the project
form.addEventListener("submit", async (event) => {
  event.preventDefault();

  image_input_touched = true;
  title_input_touched = true;
  category_input_touched = true;

  updateFormState();

  if (image_input_filled && title_input_filled && category_input_filled) {
    try {
      await submitProject(
        image_input_element.files[0],
        title_input_element.value,
        Number(category_select_element.value)
      );
      title_input_element.value = "";
      category_select_element.value = category_initial_value;
      image_input_element.value = "";

      await updateContent(); // Attendre la mise à jour complète
    } catch (error) {
      console.error(
        "Erreur lors de la soumission ou de la mise à jour: " + error
      );
    }
  }
});