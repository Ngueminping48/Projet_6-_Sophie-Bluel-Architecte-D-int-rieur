// login script variable global


const isValidEmail = (emailAdresse) => {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(emailAdresse);
};

document
  .getElementById('login')
  .addEventListener('submit', async function (event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // if (!isValidEmail(email)) {
    //   console.log("Adresse email invalide");
    //   return;
    // }

    const loginData = {
      email: email,
      password: password,
    };

    try {
      const response = await fetch('http://localhost:5678/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });

      const data = await response.json();

      console.log(data);

      if (response.ok) {
        console.log("Connexion réussie avec l'utilisateur");
        // Effectuer d'autres actions après une connexion réussie si nécessaire
      } else {
        console.log('Erreur lors de la connexion:', response.status);
        // Gérer les cas d'erreur de connexion si nécessaire
      }
    } catch (error) {
      console.log('Erreur lors de la tentative de connexion:', error);
      // Gérer les erreurs de fetch ou d'autres exceptions
    }
  });
