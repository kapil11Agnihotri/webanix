// filter the upcoming form data from client side
const filterFormData = async (formData) => {
  let files = new FormData();
  let body = {};

  for (let [key, value] of formData.entries()) {
    if (typeof value == "object") {
      files.append(key, value);
    } //
    else {
      body[key] = value;
    }
  }

  return { files, body };
};

export default filterFormData;
