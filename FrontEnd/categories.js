const filter_container = document.querySelector(".filters");

async function fetchCategories() {
  try {
    const data = await fetch("http://localhost:5678/api/categories");
    const response = await data.json();

    response.forEach((category) => {
      // Create buttons
      let button = document.createElement("button");
      button.textContent = `${category.name}`;

      filter_container.append(button);
    });

  } catch (error) {
    console.error(`Une erreur s'est produite ${error}`);
  }
}
fetchCategories();