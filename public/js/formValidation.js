function camelcaseToNormalString(word) {
  var normalString = word.replace(/([a-z])([A-Z])/g, "$1 $2");
  return normalString.toLowerCase();
}

function capitalizeFirstLetter(sentence) {
  var words = sentence.split(" "); // Split the sentence into an array of words
  var capitalizedWords = words.map(function (word) {
    return word.charAt(0).toUpperCase() + word.slice(1);
  });
  return capitalizedWords.join(" "); // Join the words into a sentence
}

function emailValidation(input) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // email validation
  return emailRegex.test(input.value) ? false : "Invalid Email";
}
function usernameValidation(input) {
  const usernameRegex = /^[a-zA-Z0-9_-]{3,16}$/; //username validationconst
  return usernameRegex.test(input.value) ? false : "Invalid Username";
}

function passwordValidation(input) {
  if (input.value.length < 8)
    return "Password should be at least 8 characters long.";

  let hasUppercase = /[A-Z]/.test(input.value);
  let hasLowercase = /[a-z]/.test(input.value);
  let hasNumeric = /[0-9]/.test(input.value);

  if (!hasUppercase || !hasLowercase || !hasNumeric)
    return "Password should contain at least one uppercase letter, one lowercase letter, and one numeric digit.";

  let hasSpecialChar = /[^A-Za-z0-9]/.test(input.value);

  if (!hasSpecialChar)
    return "Password should contain at least one special character.";

  return false;
}

export function validateForm(form) {
 // return false; //turn off validation
  let errorMessage;
  let pwd;
  for (let input of Array.from(form.elements)) {
    if (
      input.value === "" &&
      input.type !== "submit" &&
      input.type !== "reset" &&
      input.hasAttribute("name")
    ) {
      errorMessage = camelcaseToNormalString(input.name);
      errorMessage = capitalizeFirstLetter(errorMessage);
      return errorMessage + " is required";
    }
  }
  for (let input of Array.from(form.elements)) {
    if (input.name === "username") {
      errorMessage = usernameValidation(input);
      if (errorMessage) return errorMessage;
    }
    if (input.name === "email") {
      errorMessage = emailValidation(input);
      if (errorMessage) return errorMessage;
    }
    if (input.name === "password") {
      errorMessage = passwordValidation(input);
      pwd = input.value;
      if (errorMessage) return errorMessage;
    }
    if (input.name === "confirmPassword") {
      let cPwd = input.value;
      return pwd === cPwd ? "" : "Passwords are not the same";
    }
  }
}
