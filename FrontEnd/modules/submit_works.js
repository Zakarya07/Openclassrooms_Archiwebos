const token = window.localStorage.getItem("token");
export function submitProject(image, title, category) {
    return new Promise((resolve, reject) => {
      const form_data = new FormData();
      const URL = "http://localhost:5678/api/works";
  
      form_data.append("image", image);
      form_data.append("title", title);
      form_data.append("category", category);
  
      // Send request to server
      fetch(URL, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
        body: form_data,
      })
      .then(response => {
        if (response.status === 201) {
          resolve(); // Résoudre la promesse si la requête est réussie
        } else {
          console.error("Un problème est survenu lors de l'ajout du projet");
          reject("Échec de la requête");
        }
      })
      .catch(error => {
        console.error("Error:" + error);
        reject(error);
      });
    });
  }