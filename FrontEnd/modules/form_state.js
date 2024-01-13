// form_state.js

export function updateFormState(
  add_submit_btn,
  form_errors,
  image_input_touched,
  title_input_touched,
  category_input_touched,
  image_input_filled,
  title_input_filled,
  category_input_filled
) {
  const all_inputs_touched =
    image_input_touched && title_input_touched && category_input_touched;

  if (all_inputs_touched) {
    if (image_input_filled && title_input_filled && category_input_filled) {
      add_submit_btn.classList.add("success");
      form_errors.textContent = "";
    } else {
      add_submit_btn.classList.remove("success");
      form_errors.textContent = "Veuillez remplir tous les champs.";
    }
  }
}
