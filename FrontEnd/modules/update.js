import { worksInModal } from "./modal_works.js";
import { worksGeneration } from "./home_works.js";

const modal_project_container = document.querySelector("#modal-container .modal .modal-content > div");
const gallery = document.querySelector(".gallery");

export async function updateContent() {
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
