const gallery = document.querySelector(".gallery");
 async function fetchWorks() {
  try {
    const data = await fetch("http://localhost:5678/api/works");
    const response = await data.json();

    response.forEach((work) => {
      // ______ Create the elements
      let figure = document.createElement("figure");
      let image = document.createElement("img");
      let figcaption = document.createElement("figcaption");

      // _______ Set attributes to the created elements
      // Image
      image.setAttribute("src", work.imageUrl);
      image.setAttribute("alt", work.imageUrl);
      // Figcaption
      figcaption.textContent = `${work.title}`;

      // Add <img>, <figcaption> to <figure>
      figure.append(image, figcaption);

      // Append the projects to the gallery
      gallery.appendChild(figure);
    });
  } catch (error) {
    console.error("Une erreur s'est produite: ", error);
  }
}

fetchWorks();