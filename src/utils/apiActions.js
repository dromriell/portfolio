import { apiUrls } from "./urls";

export const fetchScreenData = async () => {
  const response = await fetch(apiUrls.screens, {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    const errorResponse = await response.json();
    let errorMsg = "";
    window.alert(await response.json());

    Object.entries(errorResponse).forEach(([key, value]) => {
      switch (key) {
        case "non_field_errors":
          errorMsg = errorMsg + value;
          return;
        default:
          errorMsg = errorMsg + value;
          return;
      }
    });
    throw Error(errorMsg || "An error occured!");
  }

  const screenData = await response.json();

  return screenData;
};

export const postNote = async (name, email, note) => {
  const response = await fetch(apiUrls.noteCreate, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      name: name,
      email: email,
      note: note,
    }),
  });

  if (!response.ok) {
    const errorResponse = await response.json();
    let errorMsg = "";
    Object.entries(errorResponse).forEach(([key, value]) => {
      switch (key) {
        case "non_field_errors":
          errorMsg = errorMsg + value;
          return;
        default:
          errorMsg = errorMsg + value;
          return;
      }
    });
    throw Error(errorMsg || "An error occured!");
  }

  const messageResponse = await response.json();
  return messageResponse;
};
