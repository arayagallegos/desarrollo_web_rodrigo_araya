window.addEventListener("DOMContentLoaded", () => {
    const formulario = document.getElementById("actividad-form");
    const agregarFotoBtn = document.getElementById("agregar-foto");
    const fotosContainer = document.getElementById("fotos-container");
    const contactoSelect = document.getElementById("contactar");
    const contactosContainer = document.getElementById("contactos");
    const confirmarDiv = document.getElementById("confirmacion");
    const mensajeConfirmacion = document.getElementById("mensaje-confirmacion");
    const volverBtn = document.getElementById("volver-portada");

    const validateName = (name) => {
        if(!name) return false;
        let lengthValid = name.trim().length >= 5 && name.trim().length <= 200;

        return lengthValid;
    }

    const validateArea = (area) => {
        if(!area) return false;
        let lengthValid = area.trim().length >= 5 && area.trim().length <= 100;
        return lengthValid;
    }

      
    const validateEmail = (email) => {
        if (!email) return false;
        let lengthValid = email.length > 15;
        
        // validamos el formato
        let re = /^[\w.]+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
        let formatValid = re.test(email);
        
        return lengthValid && formatValid;
    };
      
    const validatePhoneNumber = (phoneNumber) => {
        if (!phoneNumber) return false;

        let lengthValid = phoneNumber.length >= 12

        // validación de formato
        let re = /^\+\d{3}\.\d{8}$/;
        let formatValid = re.test(phoneNumber);
        
        return formatValid && lengthValid;
    };
    
    const validateFiles = (files) => {
        if (!files) return false;
        
        // validación del número de archivos
        let lengthValid = 1 <= files.length && files.length <= 5;
        
        let typeValid = true;
        
        for (const file of files) {
            let fileFamily = file.type.split("/")[0];
            typeValid &&= fileFamily == "image";
    }
    
        return lengthValid && typeValid;
    };

    const validateDate = (start, end) => {
        if (!start || !end) return false;
        return new Date(start) < new Date(end);
    };
      
    const validateSelect = () => {
        contactosContainer.innerHTML = '';
        const seleccionados = Array.from(contactoSelect.selectedOptions).map(option => option.value);
    
        if (seleccionados.length === 0 || seleccionados.length > 5) {
            return false;
        }
    
        seleccionados.forEach(tipo => {
            const div = document.createElement("div");
            div.classList.add("contacto");
    
            const label = document.createElement("label");
            label.textContent = `ID o URL de ${tipo}: `;
    
            const input = document.createElement("input");
            input.type = "text";
            input.name = `contacto-${tipo}`;
            input.minLength = 4;
            input.maxLength = 50;
            input.placeholder = `Introduce tu ${tipo}`;
    
            div.appendChild(label);
            div.appendChild(input);
            contactosContainer.appendChild(div);
        });
    
        return true;
    };

    const validateTheme = (theme) => {
        if(!theme) return false;
        return true
    }
    
    const validateForm = () => {
        let myForm = document.forms["actividad-form"];
        let email = myForm["email"].value;
        let phoneNumber = myForm["celular"].value;
        let name = myForm["nombre"].value;
        let theme = myForm["tema"].value;
        let files = myForm["foto"].files;
        let area = myForm["sector"].value;
        let startDate = myForm["inicio"].value;
        let endDate = myForm["termino"].value;
    
        let contactoSelectElement = myForm["contactar"];
        let contactValues = Array.from(contactoSelectElement.selectedOptions).map(option => option.value);
    
        let invalidInputs = [];
        let isValid = true;
        const setInvalidInput = (inputName) => {
            invalidInputs.push(inputName);
            isValid = false;
        };
    
        // Validación de campos
        if (!validateName(name)) {
            setInvalidInput("Nombre");
        }
        if (!validateEmail(email)) {
            setInvalidInput("Email");
        }
        if (!validatePhoneNumber(phoneNumber)) {
            setInvalidInput("Número");
        }
        if (!validateFiles(files)) {
            setInvalidInput("Fotos");
        }
        if (!validateDate(startDate, endDate)) {
            setInvalidInput("Fechas");
        }
        if (!validateSelect()) {
            setInvalidInput("Métodos de contacto");
        }
        if (!validateTheme(theme)) {
            setInvalidInput("Tema");
        }
        if (!validateArea(area)) {
            setInvalidInput("Sector");
        }
    
        let validationBox = document.getElementById("val-box");
        let validationMessageElem = document.getElementById("val-msg");
        let validationListElem = document.getElementById("val-list");
    
        // Mostramos la caja de validación con los errores
        if (!isValid) {
            validationListElem.innerHTML = "";  // Limpiar cualquier lista previa
    
            // Añadir los elementos de error a la lista
            for (let input of invalidInputs) {
                let li = document.createElement("li");
                li.innerText = input;
                validationListElem.appendChild(li);
            }
    
            validationMessageElem.innerText = "Los siguientes campos son inválidos:";
            validationBox.style.backgroundColor = "#ffdddd";
            validationBox.style.borderLeftColor = "#f44336";
            validationBox.style.display = "block";
        } else {
            myForm.style.display = "none";
    
            validationMessageElem.innerText = "¡Formulario válido! ¿Está seguro que desea agregar esta actividad?";
            validationListElem.innerHTML = "";
    
            validationBox.style.backgroundColor = "#ddffdd";
            validationBox.style.borderLeftColor = "#4CAF50";
            validationBox.style.display = "block";
    
            let submitButton = document.createElement("button");
            submitButton.innerText = "Enviar";
            submitButton.style.marginRight = "10px";
            submitButton.addEventListener("click", () => {
                mensajeConfirmacion.innerText = "¡Formulario enviado con éxito!";
                confirmarDiv.style.display = "block";
                validationBox.style.display = "none";
            });
    
            let backButton = document.createElement("button");
            backButton.innerText = "Volver";
            backButton.addEventListener("click", () => {
                myForm.style.display = "block";
                validationBox.style.display = "none";
            });
    
            validationListElem.appendChild(submitButton);
            validationListElem.appendChild(backButton);
        }
    
        return isValid;
    };
    
      
    contactoSelect.addEventListener("change", validateSelect);
    formulario.addEventListener("submit", (e) => {
        e.preventDefault();
        if (validateForm()) {
        }
    });
    document.getElementById("confirmar-si").addEventListener("click", confirmarSi);
    document.getElementById("confirmar-no").addEventListener("click", confirmarNo);
    volverBtn.addEventListener("click", volverPortada);
});
