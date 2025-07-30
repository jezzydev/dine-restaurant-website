
const cateringItemButtons = document.querySelectorAll('.CateringItem__button');
const cateringImageHiddenClassName = 'CateringImage--hidden';
const cateringTextHiddenClassName = 'CateringText--hidden';
const cateringItemSelectedClassName = 'CateringItem--selected';
const submitBtn = document.querySelector('.ReservationSubmit__button');
const reservationForm = document.querySelector('.ReservationForm');
const errorFieldIsRequired = "This field is required.";

cateringItemButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
        const currentSelectedCateringItem = document.querySelector('.CateringItem--selected');
        const newSelectedCateringItem = btn.closest('li.CateringItem');

        if (newSelectedCateringItem == currentSelectedCateringItem) {
            return;
        }

        const currentSelectedCateringName = currentSelectedCateringItem.dataset.catering;
        const newSelectedCateringName = newSelectedCateringItem.dataset.catering;

        //show/hide CateringImage
        const images = document.querySelectorAll(`.CateringImage[data-catering="${currentSelectedCateringName}"], .CateringImage[data-catering="${newSelectedCateringName}"]`);
        images.forEach((img) => {
            img.classList.toggle(cateringImageHiddenClassName);
        });

        //show/hide CateringText
        const texts = document.querySelectorAll(`.CateringText[data-catering="${currentSelectedCateringName}"], .CateringText[data-catering="${newSelectedCateringName}"]`);
        texts.forEach((text) => {
            text.classList.toggle(cateringTextHiddenClassName);
        });

        //update selected
        currentSelectedCateringItem.classList.toggle(cateringItemSelectedClassName);
        newSelectedCateringItem.classList.toggle(cateringItemSelectedClassName);
    });
});

reservationForm.addEventListener('submit', function (event) {
    event.preventDefault();
    resetValidation(this);
    validateForm(this);
});

function validateForm(form) {

    const fullnameRegEx = /^[a-zA-Z\s',\.-]+$/;
    const emailRegEx = /^[\w.-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    //check fullname
    const fullnameValue = form.fullname.value;
    if (fieldIsEmpty(fullnameValue)) {
        let errorDiv = createErrorMessage(form.fullname, errorFieldIsRequired, true);
        addErrorMessage(form.fullname, errorDiv);
    }
    else if (!fullnameRegEx.test(fullnameValue)) {
        let errorDiv = createErrorMessage(form.fullname, 'This field is invalid.', true);
        addErrorMessage(form.fullname, errorDiv);
    }

    //check email
    const emailValue = form.email.value;
    if (fieldIsEmpty(emailValue)) {
        let errorDiv = createErrorMessage(form.email, errorFieldIsRequired, true);
        addErrorMessage(form.email, errorDiv);
    }
    else if (!emailRegEx.test(emailValue)) {
        let errorDiv = createErrorMessage(form.email, 'This email address is invalid.', true);
        addErrorMessage(form.email, errorDiv);
    }
}

function fieldIsEmpty(str) {
    return (!str || !str.replaceAll(' ', ''));
}

function addErrorMessage(elem, errorDiv) {
    elem.setAttribute('aria-invalid', true);
    elem.setAttribute('aria-errormessage', errorDiv.id);
    elem.after(errorDiv);
}

function createErrorMessage(elem, errorMsg, withLeftPadding) {
    const errorMessageSuffix = '-errorMsg';
    const div = document.createElement('div');
    div.setAttribute('id', elem.name + errorMessageSuffix);
    div.setAttribute('role', 'alert');
    div.classList.add('FormItem__inputError');

    if (withLeftPadding) {
        div.classList.add('FormItem__inputError--paddingLeft');
    }

    div.textContent = errorMsg;

    return div;
}

function removeErrorMessage(formItem) {
    const error = formItem.querySelector('.FormItem .FormItem__inputError');
    error.remove();
}

function resetValidation() {
    const errorInputs = document.querySelectorAll('[aria-invalid="true"]');
    errorInputs.forEach(elem => {
        elem.setAttribute('aria-invalid', false);
        elem.removeAttribute('aria-errormessage');
    });

    const errorMessages = document.querySelectorAll('.FormItem__inputError');
    errorMessages.forEach(error => error.remove());
}