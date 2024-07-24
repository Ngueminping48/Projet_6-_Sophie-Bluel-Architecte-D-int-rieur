"use strict"; //

document.addEventListener("DOMContentLoaded", function () {
  // Code pour lancer l'application
  console.log("Application en cours de chargement...");
  const token = localStorage.getItem("token");
  if (token) {
    document.getElementById("login-url").style.display = "none";
    document.getElementById("logout").style.display = "block";
  }
});

document.getElementById("logout").addEventListener("click", function () {
  localStorage.removeItem("token");
  document.getElementById("login-url").style.display = "block";
  document.getElementById("logout").style.display = "none";
});

const getWorks = async () => {
  const worksdoc = document.getElementById("mywork");

  try {
    const response = await fetch("http://localhost:5678/api/works");
    const works = await response.json();
    console.log(works);

    works.forEach((work) => {
      const figure = document.createElement("figure");
      figure.innerHTML = `
                <img src="${work.imageUrl}" alt="${work.title}">
                <figcaption>${work.title}</figcaption>
            `;
      worksdoc.appendChild(figure);
    });
  } catch (error) {
    console.log(error);
  }
};
document.addEventListener("DOMContentLoaded", getWorks);

const getCategories = async () => {
  const categoriesDoc = document.getElementById("categories");

  try {
    const response = await fetch("http://localhost:5678/api/categories");
    const categories = await response.json();
    console.log(categories);

    categories.forEach((category) => {
      const categoryElement = document.createElement("button");
      categoryElement.textContent = category.name;
      categoriesDoc.appendChild(categoryElement);
    });
  } catch (error) {
    console.log(error);
  }
};

document.addEventListener("DOMContentLoaded", getCategories);
