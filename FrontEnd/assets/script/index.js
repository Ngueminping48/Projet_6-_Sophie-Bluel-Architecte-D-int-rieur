"use strict";
// ********** CONSTANTS ********** //
const URL = 'http://localhost:5678/api/';
const worksElt = document.getElementById('work');
const categoriesElt = document.getElementById('categories');
// ********** VARIABLES ********** //
let works = [];
let categories = []; 
let token = '';
let file;
// ********** FUNCTIONS ********** //
// ***** DATA ***** //
/**
 * Récupère les données d'un type spécifié.
 *
 * @param {string} type - Le type de données à récupérer.
 * @return {Promise} Les données récupérées.
 */
const getData = async (type) => {
  try {
    const response = await fetch(URL + type);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
}
/**
 * Affiche de manière asynchrone les œuvres en récupérant les données du serveur et en créant dynamiquement des éléments figure pour chaque œuvre.
 *
 * @return {Promise<void>} Une promesse qui se résout lorsque toutes les œuvres ont été affichées.
 */
const displayWorks = async () => {
  works = await getData('works');
  for (const work of works) {
    const figure = document.createElement('figure');
    figure.innerHTML = `
      <img src="${work.imageUrl}" alt="${work.title}">
      <figcaption>${work.title}</figcaption>
    `;
    worksElt.appendChild(figure);
  }
}
/**
 * Récupère de manière asynchrone les données des catégories depuis le serveur et crée des boutons pour chaque catégorie.
 * Les boutons sont ajoutés à l'élément categoriesElt.
 *
 * @return {Promise<void>} Une promesse qui se résout lorsque tous les boutons ont été créés et ajoutés.
 */
const displayCategories = async () => {
  categories = await getData('categories');
  for (const category of categories) {
    const categoryElt = document.createElement('button');
    categoryElt.setAttribute('data-category', category.id);
    categoryElt.className = 'category__btn';
    categoryElt.addEventListener('click', () =>
      filterWorks(category.id, categoryElt)
    );
    categoryElt.textContent = category.name;
    categoriesElt.appendChild(categoryElt);
  }
}
// ***** FIRST MODAL ***** //
/**
 * Ouvre une modale affichant une liste de travaux avec des boutons de suppression pour chaque travail.
 * Lorsqu'un bouton de suppression est cliqué, une boîte de dialogue de confirmation est affichée.
 * Si l'utilisateur confirme, le travail correspondant est supprimé du serveur.
 *
 * @return {void}
 */
const openModal = () => {
  let deleteBtn = [];
  document.getElementById('modal').style.display = 'block';
  document.getElementById('modal').style.opacity = 1;
  const modalImages = document.getElementById('modal-images')
  modalImages.innerHTML = '';
  works.forEach((work) => {
    const li = document.createElement('li');
    li.innerHTML = `
            <img src="${work.imageUrl}" alt="${work.title}">
            <span class="delete"><i class="fa-solid fa-trash-can"></i></span>
        `;
    modalImages.appendChild(li);
  });
  const deleteWorks = document.getElementsByClassName('delete');
  deleteBtn = [...deleteWorks]
  for (let i = 0; i < deleteBtn.length; i++) {
    deleteBtn[i].addEventListener('click', async function () {
      if (confirm('Voulez-vous supprimer cette image ?')) {
        try {
          const response = await fetch(`http://localhost:5678/api/works/${works[i].id}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${token}`
            }
          })
        } catch (error) {
        }
      }
    })
  }
}
/**
 * Ferme la fenêtre modale en définissant sa visibilité sur 'none' et son opacité à 0.
 *
 * @return {void} Cette fonction ne retourne rien.
 */
const closeModal = () => {
  document.getElementById('modal').style.display = 'none';
  document.getElementById('modal').style.opacity = 0;
}
/**
 * Rend le modal visible en définissant sa propriété "display" sur "block" et son opacité sur 1,
 * et cache le modal de débordement en définissant sa propriété "display" sur "none" et son opacité sur 0.
 *
 * @return {void} Cette fonction ne retourne rien.
 */
const returnToModal = () => {
  document.getElementById("overflow-modal").style.display = "none";
  document.getElementById("overflow-modal").style.opacity = 0;
  document.getElementById("modal").style.display = "block";
  document.getElementById("modal").style.opacity = 1;
}
// ***** SECOND MODAL *****
/**
 * Ouvre la deuxième modale, masque la première modale, vide l'élément des catégories 
 * et le remplit d'options basées sur les données de catégories fournies.
 *
 * @return {void} Cette fonction ne retourne rien.
 */
const openSecondModal = () => {
  document.getElementById("overflow-modal").style.display = "block";
  document.getElementById("overflow-modal").style.opacity = 1;
  document.getElementById("modal").style.display = "none";
  document.getElementById("modal").style.opacity = 0;
  const categoriesElement = document.getElementById('category');
  categoriesElement.innerHTML = '';
  const emptyOptions = document.createElement('option');
  categoriesElement.appendChild(emptyOptions);
  for (const category of categories) {
    const option = document.createElement('option');
    option.textContent = category.name;
    option.setAttribute('value', category.id); //set permets d'ajouter un attribut ou beaucoup d'élements
    categoriesElement.appendChild(option);
  }
};
/**
 * Ferme la deuxième modal en définissant son affichage sur "none" et son opacité sur 0.
 *
 * @return {void} Cette fonction ne renvoie rien.
 */
const closeSecondModal = () => {
  document.getElementById("overflow-modal").style.display = "none";
  document.getElementById("overflow-modal").style.opacity = 0;
}
/**
 * Sélectionne un fichier image à partir de l'élément d'entrée de fichier et l'affiche dans l'élément 'imageContainer'.
 * Masque l'élément 'imageIcon' et affiche l'élément 'imageContainer'.
 *
 * @return {void} Cette fonction ne renvoie rien.
 */
const selectImage = () => {
  const fileInput = document.getElementById('fileInput');
  fileInput.addEventListener('change', (event) => {
    event.stopPropagation();
    file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
            /**
             * Définit la source d'un élément image avec le résultat d'un FileReader et l'ajoute au conteneur 'imageContainer'. Masque l'élément 'imageIcon' et affiche le conteneur 'imageContainer'.
             *
             * @param {Event} e - L'objet événement contenant le résultat du FileReader.
             * @return {void} Cette fonction ne retourne rien.
             */
      reader.onload = (e) => {
        const imgElement = document.createElement('img');
        imgElement.src = e.target.result;
        imgElement.style.maxWidth = '100%';
        document.getElementById('imageContainer').innerHTML = '';
        document.getElementById('imageContainer').appendChild(imgElement);
        document.getElementById('imageIcon').style.display = 'none';
        document.getElementById('imageContainer').style.display = 'block';
      };
      reader.readAsDataURL(file);
    }
  });
  fileInput.click();
};
/**
 * Envoie un travail au serveur.
 *
 * @param {Event} event - L'objet d'événement déclenché par la soumission du formulaire.
 * @return {Promise<void>} Une promesse qui se résout lorsque le travail est envoyé avec succès, ou qui se rejette avec une erreur si un problème se produit.
 */
const submitWork = async (event) => {
  event.preventDefault();
  const title = document.getElementById('title').value;
  const category = document.getElementById('category').value;
  if (!file || !title || !category) {
    const error = document.getElementById('error_submit');
    const span = document.createElement('span');
    span.textContent = 'Vérifier que tous les champs sont corrects';
    span.style.color = 'red';
    span.style;
    error.appendChild(span);
    return;
  } else {
    const url = URL + 'works';
    const formData = new FormData();
    formData.append('title', title);
    formData.append('category', category);
    formData.append('image', file);
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      //  const data = await response.json();
    } catch (error) {
      console.error('Failed to create work:', error);
    }
  }
};
//  ***** RUN ***** 
/**
 * Déconnecte l'utilisateur en supprimant le jeton de stockage local et en mettant à jour l'affichage des boutons de connexion et de déconnexion.
 *
 * @return {void} Cette fonction ne renvoie rien.
 */
const logout = () => {
  localStorage.removeItem('token');
  document.getElementById('login-url').style.display = 'block';
  document.getElementById('logout').style.display = 'none';
}
// ***** FILTER *****
/**
 * Filtre les travaux en fonction de l'ID de catégorie donné et met à jour le DOM avec les travaux filtrés.
 *
 * @param {number} categoryId - L'ID de la catégorie pour filtrer les travaux.
 * @param {HTMLElement} button - L'élément de bouton qui a déclenché le filtre.
 * @return {void} Cette fonction ne renvoie rien.
 */
const filterWorks = (categoryId, button) => {
  const worksdoc = document.getElementById('work');
  worksdoc.innerHTML = '';
  // Filtrer les travaux en fonction de l'ID de catégorie
  const filteredWorks = works.filter((work) => work.categoryId === categoryId);
  // Ajouter les éléments filtrés au DOM
  filteredWorks.forEach((work) => {
    const figure = document.createElement('figure');
    figure.innerHTML = `
        <img src="${work.imageUrl}" alt="${work.title}">
        <figcaption>${work.title}</figcaption>
      `;
    worksdoc.appendChild(figure);
  });
  document.querySelectorAll('.category__btn').forEach((btn) => {
    btn.classList.remove('active');
  });
  button.classList.add('active');
  document.getElementById('all-work').classList.remove('btn-all');
};
// ********** MAIN ********** //

document
  .getElementById('return-second-modal')
  .addEventListener('click', returnToModal);
document.getElementById('add-photo').addEventListener('click', openSecondModal);
document
  .getElementById('second-close-modal')
  .addEventListener('click', closeSecondModal);

// ***** FUNCTION CHANGE BUTTON COLOR *****

document.addEventListener('DOMContentLoaded', function () {
  const titleInput = document.getElementById('title');
  const fileInput = document.getElementById('fileInput');
  const categorySelect = document.getElementById('category');
  const submitButton = document.getElementById('create-works');

  /**
   * Vérifie les valeurs des champs de titre, de catégorie et de fichier pour déterminer si le bouton de soumission doit être activé ou désactivé.
   *
   * @return {void} Cette fonction ne renvoie pas de valeur.
   */
  function checkInputs() {
    const titleValue = titleInput.value.trim();
    const categoryValue = categorySelect.value.trim();
    const fileValue = fileInput.files.length > 0;
    if (titleValue !== '' && categoryValue !== '' && fileValue) {
      submitButton.disabled = false;
      submitButton.classList.remove('unenabled-button');
      submitButton.classList.add('enabled-button');
    } else {
      submitButton.disabled = true;
      submitButton.classList.add('unenabled-button');
      submitButton.classList.remove('enabled-button');
    }
  }
  titleInput.addEventListener('input', checkInputs);
  categorySelect.addEventListener('change', checkInputs);
  fileInput.addEventListener('change', checkInputs);
});
document
  .getElementById('add-photo-modal')
  .addEventListener('click', selectImage);
document.getElementById('logout').addEventListener('click', logout);
document.getElementById('close-modal').addEventListener('click', closeModal);
document.getElementById('open-modal').addEventListener('click', openModal);
document.addEventListener('DOMContentLoaded', function () {
  token = localStorage.getItem('token');
  if (token) {
    document.getElementById('login-url').style.display = 'none';
    document.getElementById('logout').style.display = 'block';
    document.getElementById('categories').style.display = 'none';
  } else {
    document.getElementById('open-modal').style.display = 'none'
    document.getElementById('modifier').style.display = 'none';
  }
  displayWorks();
  displayCategories();
  document.getElementById('imageContainer').style.display = 'none';
});
document
  .getElementById('create-works-form')
  .addEventListener('submit', async (event) => {
    submitWork(event);
  });
document.getElementById('all-work').addEventListener('click', () => {
  const worksdoc = document.getElementById('work');
  worksdoc.innerHTML = '';
  works.forEach((work) => {
    const figure = document.createElement('figure');
    figure.innerHTML = `
            <img src="${work.imageUrl}" alt="${work.title}">
            <figcaption>${work.title}</figcaption>
          `;
    worksdoc.appendChild(figure);
  });
  document.getElementById('all-work').classList.add('btn-all');
  document.querySelectorAll('.category__btn').forEach((btn) => {
    btn.classList.remove('active');
  });
});