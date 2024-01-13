export function previewFile() {
    const fileInput = document.querySelector(".modal form input#imageInput");
    let preview = document.querySelector(".img-preview");
    let placeholder_icon = document.querySelector(".fa-regular.fa-image");

    console.log(placeholder_icon);

    let file = fileInput.files[0];
    let reader = new FileReader();

    reader.onloadend = function () {
        preview.classList.add("active");
        preview.innerHTML = '<img src="' + reader.result + '" alt="Preview">';
        // Cacher l'icône de placeholder lorsque l'image est sélectionnée
        placeholder_icon.style.display = 'none';
    };
    
    if (file) {
        reader.readAsDataURL(file);
    } else {
        preview.classList.remove("active");
        preview.innerHTML = "Aucun fichier sélectionné";
        // Afficher l'icône de placeholder lorsque aucun fichier n'est sélectionné
        placeholder_icon.style.display = 'block';
    }
}
