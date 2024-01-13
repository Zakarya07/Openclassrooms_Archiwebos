// Fetch request to get the works 
const fetch_works = await fetch("http://localhost:5678/api/works");
const works_data = await fetch_works.json();

import { worksGeneration } from "./home_works.js";

const gallery = document.querySelector(".gallery");
export function filterWorksByCategory() {
  const buttons = document.querySelectorAll(".filters button");

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