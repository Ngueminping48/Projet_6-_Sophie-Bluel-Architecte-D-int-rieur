"use strict"; //

// Variables pour stocker les données et le jeton d'authentification
let works = [];
let deleteBtn = [];
let token;

// Fonction pour récupérer et afficher les travaux
const getWorks = async () => {
  const worksdoc = document.getElementById("mywork");

  try {
    const response = await fetch("http://localhost:5678/api/works");
    const data = await response.json();
    works = data; // Stockage des travaux dans le tableau

    works.forEach((work) => {
      const figure = document.createElement("figure");
      figure.innerHTML = `
        <img src="${work.imageUrl}" alt="${work.title}">
        <figcaption>${work.title}</figcaption>
      `;
      worksdoc.appendChild(figure);
    });
  } catch (error) {
    console.log("Erreur lors de la récupération des travaux:", error);
  }
};

// Fonction pour récupérer et afficher les catégories
const getCategories = async () => {
  const categoriesDoc = document.getElementById("categories");

  try {
    const response = await fetch("http://localhost:5678/api/categories");
    const categories = await response.json();

    categories.forEach((category) => {
      const categoryElement = document.createElement("button");
      categoryElement.textContent = category.name;
      categoriesDoc.appendChild(categoryElement);
    });
  } catch (error) {
    console.log("Erreur lors de la récupération des catégories:", error);
  }
};

// Fonction pour initialiser l'application et vérifier la connexion
document.addEventListener("DOMContentLoaded", function () {
  console.log("Application en cours de chargement...");
  token = localStorage.getItem("token");
  if (token) {
    document.getElementById("login-url").style.display = "none";
    document.getElementById("logout").style.display = "block";
  } else {
    document.getElementById("logout").style.display = "none";
  }

  // Charger les travaux et les catégories
  getWorks();
  getCategories();
});

// Gestion de la déconnexion
document.getElementById("logout").addEventListener("click", function () {
  localStorage.removeItem("token");
  document.getElementById("login-url").style.display = "block";
  document.getElementById("logout").style.display = "none";
});

// Gestion de l'ouverture et de la fermeture des modales
document.getElementById("close-modal").addEventListener("click", function () {
  document.getElementById("modal").style.display = "none";
  document.getElementById("modal").style.opacity = 0;
});

document.getElementById("open-modal").addEventListener("click", function () {
  document.getElementById("modal").style.display = "block";
  document.getElementById("modal").style.opacity = 1;

  // Afficher les images dans la modale
  const modalImages = document.getElementById("modal-images");
  modalImages.innerHTML = ""; // Vider le contenu précédent
  works.forEach((work) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <img src="${work.imageUrl}" alt="${work.title}">
      <span class="delete"><i class="fa-solid fa-trash-can"></i></span>
    `;
    modalImages.appendChild(li);
  });

  // Gestion des boutons de suppression dans la modale
  const deleteWorks = document.getElementsByClassName("delete");
  deleteBtn = [...deleteWorks];

  deleteBtn.forEach((btn, index) => {
    btn.addEventListener("click", async function () {
      if (confirm("Voulez-vous supprimer cette image ?")) {
        try {
          const response = await fetch(
            `http://localhost:5678/api/works/${works[index].id}`,
            {
              method: "DELETE",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          if (response.ok) {
            alert("Image supprimée avec succès");
            window.location.reload(); // Recharger la page pour mettre à jour la liste des travaux
          } else {
            console.error("Erreur lors de la suppression:", response.status);
          }
        } catch (error) {
          console.error("Erreur lors de la tentative de suppression:", error);
        }
      }
    });
  });
});


/********************** MODAL 2 ************************ Pour implémenter les fonctionnalités des boutons de retour et de fermeture dans la modal,*/
const openSecondModal = () => {
  document.getElementById("overflow-modal").style.display = "block";
  document.getElementById("overflow-modal").style.opacity = 1;
  document.getElementById("modal").style.display = "none";
  document.getElementById("modal").style.opacity = 0;
}

const closeSecondModal = () => {
  document.getElementById("overflow-modal").style.display = "none";
  document.getElementById("overflow-modal").style.opacity = 0;

}

const retunrtoModal = () => {
  document.getElementById("overflow-modal").style.display = "none";
  document.getElementById("overflow-modal").style.opacity = 0;
  document.getElementById("modal").style.display = "block";
  document.getElementById("modal").style.opacity = 1;
}
let file;
const selectImage = () => {
    document.getElementById("overflow-modal").style.display = "block";
  document.getElementById("overflow-modal").style.opacity = 1;
 
    const fileInput = document.getElementById("fileInput").click();
 fileInput.addEventListener("change", (event) => {
    file = event.target.files[0] ;
    console.log(file);
 })
}
