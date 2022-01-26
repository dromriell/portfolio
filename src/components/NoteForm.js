import { postNote } from "../utils/apiActions";

export default class NoteForm {
  constructor(formElement) {
    this.form = formElement;
    this.inputs = this.form.querySelectorAll("input, textarea");
    this.button = this.form.querySelector("button");
    this.isSubmitable = true;

    this.name = "";
    this.email = "";
    this.note = "";

    this.form.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (!this.isSubmitable) {
        return;
      }
      const submittedFormData = new FormData(e.target);
      this.name = submittedFormData.get("name");
      this.email = submittedFormData.get("email");
      this.note = submittedFormData.get("note");

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

  disableForm() {
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
