const modal_project_container = document.querySelector("#modal-container .modal .modal-content > div");

export function worksInModal(array_of_works) {
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