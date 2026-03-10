document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("registrationForm");
    const nameInput = document.getElementById("name");
    const emailInput = document.getElementById("email");
    const phoneInput = document.getElementById("phone");
    const passwordInput = document.getElementById("password");
    const togglePassword = document.getElementById("togglePassword");
    const strengthBar = document.getElementById("strengthBar");
    const strengthText = document.getElementById("strengthText");
    const passwordStrengthContainer = document.querySelector(".password-strength");
    const successMessage = document.getElementById("successMessage");

    // Utilities
    const setError = (input, message) => {
        const formControl = input.closest(".form-group");
        const errorMsg = formControl.querySelector(".error-msg");
        formControl.className = "form-group error";
        errorMsg.innerText = message;
    };

    const setSuccess = (input) => {
        const formControl = input.closest(".form-group");
        formControl.className = "form-group success";
    };

    const isValidEmail = (email) => {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    };

    const isValidPhone = (phone) => {
        const re = /^\d{10}$/; // Simple 10 digit validation
        return re.test(phone);
    };

    // Validation functions
    const validateName = () => {
        const value = nameInput.value.trim();
        if (value === "") {
            setError(nameInput, "Name cannot be blank");
            return false;
        } else if (value.length < 3) {
            setError(nameInput, "Name must be at least 3 characters");
            return false;
        } else {
            setSuccess(nameInput);
            return true;
        }
    };

    const validateEmail = () => {
        const value = emailInput.value.trim();
        if (value === "") {
            setError(emailInput, "Email cannot be blank");
            return false;
        } else if (!isValidEmail(value)) {
            setError(emailInput, "Not a valid email");
            return false;
        } else {
            setSuccess(emailInput);
            return true;
        }
    };

    const validatePhone = () => {
        const value = phoneInput.value.trim();
        if (value === "") {
            setError(phoneInput, "Phone number cannot be blank");
            return false;
        } else if (!isValidPhone(value)) {
            setError(phoneInput, "Enter a valid 10-digit phone number");
            return false;
        } else {
            setSuccess(phoneInput);
            return true;
        }
    };

    const validatePassword = () => {
        const value = passwordInput.value;
        if (value === "") {
            setError(passwordInput, "Password cannot be blank");
            passwordStrengthContainer.style.display = "none";
            return false;
        } else {
            setSuccess(passwordInput);
            updatePasswordStrength(value);
            return true;
        }
    };

    const updatePasswordStrength = (password) => {
        passwordStrengthContainer.style.display = "flex";
        let strength = 0;
        
        if (password.length >= 8) strength++; // length
        if (password.match(/[a-z]+/)) strength++; // lowercase
        if (password.match(/[A-Z]+/)) strength++; // uppercase
        if (password.match(/[0-9]+/)) strength++; // number
        if (password.match(/[$@#&!]+/)) strength++; // special char

        switch (strength) {
            case 0:
            case 1:
                strengthBar.style.width = "20%";
                strengthBar.style.backgroundColor = "#e74c3c";
                strengthText.innerText = "Too Weak";
                strengthText.style.color = "#e74c3c";
                break;
            case 2:
                strengthBar.style.width = "40%";
                strengthBar.style.backgroundColor = "#f39c12";
                strengthText.innerText = "Weak";
                strengthText.style.color = "#f39c12";
                break;
            case 3:
                strengthBar.style.width = "60%";
                strengthBar.style.backgroundColor = "#f1c40f";
                strengthText.innerText = "Medium";
                strengthText.style.color = "#f1c40f";
                break;
            case 4:
                strengthBar.style.width = "80%";
                strengthBar.style.backgroundColor = "#3498db";
                strengthText.innerText = "Strong";
                strengthText.style.color = "#3498db";
                break;
            case 5:
                strengthBar.style.width = "100%";
                strengthBar.style.backgroundColor = "#2ecc71";
                strengthText.innerText = "Very Strong";
                strengthText.style.color = "#2ecc71";
                break;
        }
    };

    // Event Listeners for real-time validation
    nameInput.addEventListener("input", validateName);
    emailInput.addEventListener("input", validateEmail);
    phoneInput.addEventListener("input", validatePhone);
    passwordInput.addEventListener("input", validatePassword);

    // Toggle Password Visibility
    togglePassword.addEventListener("click", () => {
        const type = passwordInput.getAttribute("type") === "password" ? "text" : "password";
        passwordInput.setAttribute("type", type);
        
        // Toggle icon
        if (type === "text") {
            togglePassword.classList.remove("fa-eye-slash");
            togglePassword.classList.add("fa-eye");
            togglePassword.style.color = "#00d2ff";
        } else {
            togglePassword.classList.remove("fa-eye");
            togglePassword.classList.add("fa-eye-slash");
            togglePassword.style.color = "#aaa";
        }
    });

    // Form Submit
    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const isNameValid = validateName();
        const isEmailValid = validateEmail();
        const isPhoneValid = validatePhone();
        const isPasswordValid = validatePassword();
        
        // Additional check for strong password
        const passwordVal = passwordInput.value;
        const isPasswordStrongEnough = passwordVal.length >= 8 && /[A-Z]/.test(passwordVal) && /[0-9]/.test(passwordVal);

        if (!isPasswordStrongEnough && isPasswordValid) {
             setError(passwordInput, "Password must include 8+ chars, uppercase, and a number");
             return;
        }

        if (isNameValid && isEmailValid && isPhoneValid && isPasswordValid && isPasswordStrongEnough) {
            // Save to localStorage
            const newSubmission = {
                name: nameInput.value.trim(),
                email: emailInput.value.trim(),
                phone: phoneInput.value.trim(),
                timestamp: new Date().toISOString()
            };

            let submissions = JSON.parse(localStorage.getItem("submissions")) || [];
            submissions.push(newSubmission);
            localStorage.setItem("submissions", JSON.stringify(submissions));

            // Show success message and reset form
            successMessage.style.display = "block";
            form.reset();
            
            // Clear success states
            const formGroups = document.querySelectorAll(".form-group");
            formGroups.forEach(group => group.className = "form-group");
            passwordStrengthContainer.style.display = "none";
            
            // Hide success message after 3 seconds
            setTimeout(() => {
                successMessage.style.display = "none";
            }, 3000);
        }
    });
});
