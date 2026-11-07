
const form = document.getElementById("registrationForm");
const submitButton = document.getElementById("submitButton");
const successMessage = document.getElementById("successMessage");
const bioCounter = document.getElementById("bioCounter");
const bioWarning = document.getElementById("bioWarning");

const fields = {
  name: document.getElementById("name"),
  email: document.getElementById("email"),
  password: document.getElementById("password"),
  bio: document.getElementById("bio")
};

const touchedFields = new Set();
const MAX_BIO_LENGTH = 200;

function getError(fieldName) {
  const field = fields[fieldName];
  const value = field.value;

  switch (fieldName) {
    case "name":
      return value.trim() ? "" : "Please enter your name.";

    case "email": {
      if (!value.trim()) {
        return "Please enter your email address.";
      }

      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      return emailPattern.test(value) && !field.validity.typeMismatch
        ? ""
        : "Enter a valid email address, such as you@example.com.";
    }

    case "password":
      if (!value.trim()) {
        return "Please enter a password.";
      }

      return value.length >= 6
        ? ""
        : `Password must contain at least 6 characters. You have ${value.length}.`;

    case "bio":
      if (!value.trim()) {
        return "Please enter your bio.";
      }

      return value.length <= MAX_BIO_LENGTH
        ? ""
        : "Bio must not exceed 200 characters.";

    default:
      return "";
  }
}

function showFieldError(fieldName) {
  const error = getError(fieldName);
  const errorElement = document.getElementById(`${fieldName}Error`);

  errorElement.textContent = error;

  fields[fieldName].setAttribute(
    "aria-invalid",
    String(Boolean(error))
  );
}

function updateBioCounter() {
  if (fields.bio.value.length > MAX_BIO_LENGTH) {
    fields.bio.value = fields.bio.value.slice(0, MAX_BIO_LENGTH);
  }

  const length = fields.bio.value.length;
  const remaining = MAX_BIO_LENGTH - length;

  bioCounter.textContent = `${length} / 200 characters`;
  bioCounter.classList.toggle("warning", length >= 180);

  if (remaining === 0) {
    bioWarning.textContent = "Character limit reached.";
  } else if (remaining <= 20) {
    bioWarning.textContent = `Only ${remaining} characters remaining.`;
  } else {
    bioWarning.textContent = "";
  }
}

function isFormValid() {
  return Object.keys(fields).every(
    fieldName => getError(fieldName) === ""
  );
}

function updateForm() {
  updateBioCounter();

  touchedFields.forEach(fieldName => {
    showFieldError(fieldName);
  });

  submitButton.disabled = !isFormValid();
}

Object.entries(fields).forEach(([fieldName, field]) => {
  field.addEventListener("input", () => {
    touchedFields.add(fieldName);
    successMessage.hidden = true;
    updateForm();
  });

  field.addEventListener("blur", () => {
    touchedFields.add(fieldName);
    updateForm();
  });
});

form.addEventListener("submit", event => {
  event.preventDefault();

  Object.keys(fields).forEach(fieldName => {
    touchedFields.add(fieldName);
  });

  updateForm();

  if (!isFormValid()) {
    const firstInvalidField = Object.keys(fields).find(
      fieldName => getError(fieldName) !== ""
    );

    fields[firstInvalidField].focus();
    return;
  }

  successMessage.textContent =
    "Registration successful! Your entries are valid. " +
    "This demo does not send or save your information.";

  successMessage.hidden = false;

  form.reset();
  touchedFields.clear();

  Object.keys(fields).forEach(fieldName => {
    document.getElementById(`${fieldName}Error`).textContent = "";
    fields[fieldName].removeAttribute("aria-invalid");
  });

  updateForm();
});

updateForm();
