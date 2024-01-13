const gallery = document.querySelector(".gallery");
export function worksGeneration(array_of_works) {
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