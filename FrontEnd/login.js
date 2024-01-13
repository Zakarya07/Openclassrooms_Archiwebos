const submit_button = document.querySelector("form input[type='submit']");
const email = document.querySelector("#email");
const password = document.querySelector("#password");
const error_displaying = document.querySelector("form + p.error-displaying");

const USER_EMAIL = "sophie.bluel@test.tld";
const USER_PASSWORD = "S0phie";

submit_button.addEventListener("click", async (event) => {
  event.preventDefault();

  const form_inputs = {
    email: email.value,
    password: password.value,
  };

  if ( form_inputs.email.trim() !== "" && form_inputs.password.trim() !== "" ) {

    if ( form_inputs.email.trim() !== USER_EMAIL ) {
      error_displaying.textContent = "Erreur dans l'identifiant";
      email.focus();
    } else if ( form_inputs.password.trim() !== USER_PASSWORD ) {
      error_displaying.textContent = "Erreur dans le mot de passe";
      password.focus();
    } 
  
    if(form_inputs.email.trim() === USER_EMAIL && form_inputs.password.trim() === USER_PASSWORD){
      try {
        const response = await fetch("http://localhost:5678/api/users/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form_inputs),
        });

        const data = await response.json();

        if ( response.ok ) {
          localStorage.setItem("token", data.token);
          window.location.href = "./index.html";
        } else {
          alert(`Failed to log in: ${data.message}`);
        }
      } catch ( error ) {
        console.error("Erreur lors de l'envoi de la requête:", error);
      }
    } else if (form_inputs.email.trim() !== USER_EMAIL && form_inputs.password.trim() !== USER_PASSWORD) {
      error_displaying.textContent = "Erreur dans l'identifiant ou le mot de passe";
    }

  } else {
    error_displaying.textContent = "Erreur ! Veuillez remplir tout les champs pour pouvoir continuer.";
  }

});
