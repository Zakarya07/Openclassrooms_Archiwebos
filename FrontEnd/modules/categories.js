export function categoriesGeneration(array_of_categories) {
    const filters_container = document.querySelector(".filters");

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
      const modal_projects_add_form_select = document.querySelector(".modal-form form select");
  
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