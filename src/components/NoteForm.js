import { postNote } from "../utils/apiActions";

export default class NoteForm {
  constructor(formElement) {
    this.form = formElement;
    this.inputs = this.form.querySelectorAll("input, textarea");
    this.button = this.form.querySelector("button");
    this.isSubmitable = true;
    this.isFormValid = false;
    this.postLimit = 1;
    this.postCount = 0;

    this.name = "";
    this.email = "";
    this.note = "";

    this.form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const submittedFormData = new FormData(e.target);
      this.name = submittedFormData.get("name");
      this.email = submittedFormData.get("email");
      this.note = submittedFormData.get("note");

      this.validateForm();

      if (
        !this.isSubmitable ||
        !this.isFormValid ||
        this.postCount >= this.postLimit
      ) {
        this.name = "";
        this.email = "";
        this.note = "";
        return;
      }

      try {
        const noteResponse = await postNote(this.name, this.email, this.note);
        this.onPostSuccess();
        this.disableForm();
        return noteResponse;
      } catch (error) {
        this.form.reset();
        this.onPostError(error);
      }
    });
  }

  validateForm() {
    let isFormValid = true;
    console.log(this.name.length);
    if (this.name.length < 1 || this.name.length > 75) {
      isFormValid = false;
    }
    if (this.email.length < 1 || this.email.length > 75) {
      isFormValid = false;
    }
    if (this.note.length < 1 || this.note.length > 350) {
      isFormValid = false;
    }
    this.isFormValid = isFormValid;
    return isFormValid;
  }

  disableForm() {
    document.querySelector(".formButtonGroup button").disabled = true;
    this.postCount = this.postCount + 1;
    this.isSubmitable = false;
    this.inputs.forEach((input) => (input.readOnly = true));
    this.button.disabled = true;
  }

  onPostSuccess() {
    return;
  }

  onPostError(error) {
    return;
  }
}
