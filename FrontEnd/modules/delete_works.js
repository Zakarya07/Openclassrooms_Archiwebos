import { updateContent } from "./update.js";
const token = window.localStorage.getItem("token");

export async function deleteWork(id) {
    try {
        const deleteRequest = await fetch(`http://localhost:5678/api/works/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });
    
        if (deleteRequest.ok) {
            console.log(`Suppression du projet ${id} réussie`);
            updateContent();
        } else {
            console.error("Échec de la suppression, statut: " + deleteRequest.statusText);
        }
    } catch (error) {
        console.error("Erreur lors de la suppression du projet: " + error);
    }
  }