
const cateringItemButtons = document.querySelectorAll('.CateringItem__button');
const cateringImageHiddenClassName = 'CateringImage--hidden';
const cateringTextHiddenClassName = 'CateringText--hidden';
const cateringItemSelectedClassName = 'CateringItem--selected';
const submitBtn = document.querySelector('.ReservationSubmit__button');
const reservationForm = document.querySelector('.ReservationForm');
const errorFieldIsRequired = 'This field is required.';
const errorFieldIsIncomplete = 'This field is incomplete.';
const errorDateTimeIsInThePast = 'Date/time is in the past.';
const yearInput = document.querySelector('#year');
const decreaseBtn = document.querySelector('.Quantity--decrease');
const increaseBtn = document.querySelector('.Quantity--increase');
const qtyValue = document.querySelector('.Quantity__value');
const qtyUom = document.querySelector('.Quantity__uom');
let reserveQty = 4;

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

updateQty(reserveQty);
decreaseBtn?.addEventListener('click', decreaseQty);
increaseBtn?.addEventListener('click', increaseQty);

function updateQty(qty) {
    if (qtyValue !== null && qtyUom !== null) {
        qtyValue.textContent = qty;

        if (qty === 1) {
            qtyUom.textContent = 'person';
        }
        else {
            qtyUom.textContent = 'people';
        }
    }
}

function decreaseQty() {
    if (reserveQty - 1 >= 1) {
        reserveQty -= 1;
        updateQty(reserveQty);
    }
}

function increaseQty() {
    if (reserveQty + 1 <= 12) {
        reserveQty += 1;
        updateQty(reserveQty);
    }
}

reservationForm?.addEventListener('submit', function (event) {
    event.preventDefault();
    resetValidation(this);
    validateForm(this);
});

function validateForm(form) {
    validateName(form);
    validateEmail(form);
    const dateIsValid = validateDate(form);
    const timeIsValid = validateTime(form);
    let reservationIsValid = false;

    if (dateIsValid && timeIsValid) {
        const newHour = convertHourTo24HourFormat(form.hour.value, form.meridiem.value);
        const rDate = new Date(form.year.value, form.month.value - 1, form.day.value, newHour, form.minute.value);

        reservationIsValid = validateReservationDateTime(rDate);
    }

    if (reservationIsValid) {
        alert("Your reservation is confirmed!");
    }
}

function validateName(form) {
    const fullnameRegEx = /^[a-zA-Z\s',\.-]+$/;
    const fullnameValue = form.fullname.value;
    let errorMsgElem = null;

    if (fieldIsEmpty(fullnameValue)) {
        errorMsgElem = createErrorMessage(form.fullname.name, errorFieldIsRequired, true, true);
    }
    else if (!fullnameRegEx.test(fullnameValue)) {
        errorMsgElem = createErrorMessage(form.fullname.name, 'This field is invalid.', true, true);
    }

    if (errorMsgElem) {
        addErrorMessageAfterElem(form.fullname, errorMsgElem);
        setInvalid([form.fullname], errorMsgElem);

        return false;
    }

    return true;
}

function validateEmail(form) {
    const emailRegEx = /^[\w.-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const emailValue = form.email.value;
    let errorMsgElem = null;

    if (fieldIsEmpty(emailValue)) {
        errorMsgElem = createErrorMessage(form.email.name, errorFieldIsRequired, true, true);
    }
    else if (!emailRegEx.test(emailValue)) {
        errorMsgElem = createErrorMessage(form.email.name, 'This email address is invalid.', true, true);
    }

    if (errorMsgElem) {
        addErrorMessageAfterElem(form.email, errorMsgElem);
        setInvalid([form.email], errorMsgElem);

        return false;
    }

    return true;
}

function validateDate(form) {
    const monthRegEx = /^(0?[1-9]|1[0-2])$/;
    const dayRegEx = /^(0?[1-9]|[12][0-9]|3[01])$/;
    const yearRegEx = /^\d{4}$/;
    const monthValue = form.month.value;
    const dayValue = form.day.value;
    const yearValue = form.year.value;
    const dateLabel = document.querySelector('.Date__label');
    const dateInputs = document.querySelectorAll('.Date__container input');

    let errorMsgElem = null;
    let incompleteDateInput = null;

    //check for completeness    
    if (fieldIsEmpty(monthValue)) {
        incompleteDateInput = form.month;
    }
    else if (fieldIsEmpty(dayValue)) {
        incompleteDateInput = form.day;
    }
    else if (fieldIsEmpty(yearValue)) {
        incompleteDateInput = form.year;
    }

    if (incompleteDateInput) {
        errorMsgElem = createErrorMessage('date', errorFieldIsIncomplete);
        addErrorMessageAfterElem(dateLabel, errorMsgElem);
        setInvalid(dateInputs, errorMsgElem);
        addErrorClassToLabel(dateLabel);

        return false;
    }

    errorMsgElem = null;
    //check format
    //ensure month is 1-12
    if (!monthRegEx.test(monthValue)) {
        errorMsgElem = createErrorMessage(form.month.name, 'Month is incorrect.');
        setInvalid([form.month], errorMsgElem);
    }
    //ensure day is 1-31
    else if (!dayRegEx.test(dayValue)) {
        errorMsgElem = createErrorMessage(form.day.name, 'Day is incorrect.');
        setInvalid([form.day], errorMsgElem);
    }
    //ensure year is not in the past
    else if (!yearRegEx.test(yearValue)) {
        errorMsgElem = createErrorMessage(form.year.name, 'Year is incorrect.');
        setInvalid([form.year], errorMsgElem);
    }

    if (errorMsgElem) {
        addErrorMessageAfterElem(dateLabel, errorMsgElem);
        addErrorClassToLabel(dateLabel);

        return false;
    }

    errorMsgElem = null;

    //ensure date is valid, and not autocorrected by javascript
    const tempDate = new Date(yearValue, monthValue - 1, dayValue);

    if (tempDate.getFullYear() != yearValue ||
        tempDate.getMonth() != (monthValue - 1) ||
        tempDate.getDate() != dayValue) {
        errorMsgElem = createErrorMessage('date', 'Date in invalid.');
        addErrorMessageAfterElem(dateLabel, errorMsgElem);
        setInvalid(dateInputs, errorMsgElem);
        addErrorClassToLabel(dateLabel);

        return false;
    }

    return true;
}

function validateTime(form) {
    const hourRegEx = /^(0?[1-9]|1[0-2])$/;
    const minRegEx = /^([0-5]?\d)$/;
    const hourValue = form.hour.value;
    const minuteValue = form.minute.value;
    const meridiemValue = form.meridiem.value;
    const timeInputs = document.querySelectorAll('.Time__container :is(input, select)');
    const timeLabel = document.querySelector('.Time__label');
    let errorMsgElem = null;
    let incompleteTimeInput = null;

    //check for completeness
    if (fieldIsEmpty(hourValue)) {
        incompleteTimeInput = form.hour;
    }
    else if (fieldIsEmpty(minuteValue)) {
        incompleteTimeInput = form.minute;
    }
    else if (fieldIsEmpty(meridiemValue)) {
        incompleteTimeInput = form.meridiem;
    }

    if (incompleteTimeInput) {
        errorMsgElem = createErrorMessage('time', errorFieldIsIncomplete);
        addErrorMessageAfterElem(timeLabel, errorMsgElem);
        setInvalid(timeInputs, errorMsgElem);
        addErrorClassToLabel(timeLabel);

        return false;
    }

    errorMsgElem = null;
    //check format
    if (!hourRegEx.test(hourValue)) {
        errorMsgElem = createErrorMessage(form.hour.name, 'Hour is incorrect.');
        setInvalid([form.hour], errorMsgElem);
    }
    else if (!minRegEx.test(minuteValue)) {
        errorMsgElem = createErrorMessage(form.minute.name, 'Minutes is incorrect');
        setInvalid([form.minute], errorMsgElem);
    }

    if (errorMsgElem) {
        addErrorMessageAfterElem(timeLabel, errorMsgElem);
        addErrorClassToLabel(timeLabel);

        return false;
    }

    return true;
}

function convertHourTo24HourFormat(hour, meridiem) {
    let newHour = Number.parseInt(hour);
    const meridiemAM = 'am';
    const meridiemPM = 'pm';
    const twelve = 12;

    if (newHour == twelve) {
        if (meridiem == meridiemAM) {
            newHour = 0;
        }
    }
    else {
        if (meridiem == meridiemPM) {
            newHour = newHour + twelve;
        }
    }

    return newHour;
}

function validateReservationDateTime(reservationDate) {
    let errorMsgElem = null;
    const dateInputs = document.querySelectorAll('.Date__container input');
    const timeInputs = document.querySelectorAll('.Time__container :is(input, select)');
    const dateLabel = document.querySelector('.Date__label');
    const timeLabel = document.querySelector('.Time__label');
    let now = new Date();
    now = new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), now.getMinutes());

    if (now - reservationDate > 0) {
        errorMsgElem = createErrorMessage('date', errorDateTimeIsInThePast);

        setInvalid(dateInputs, errorMsgElem);
        addErrorMessageAfterElem(dateLabel, errorMsgElem);
        addErrorClassToLabel(dateLabel);

        errorMsgElem = createErrorMessage('time', errorDateTimeIsInThePast);
        setInvalid(timeInputs, errorMsgElem);
        addErrorMessageAfterElem(timeLabel, errorMsgElem);
        addErrorClassToLabel(timeLabel);

        return false;
    }

    return true;
}

function fieldIsEmpty(str) {
    return (!str || !str.replaceAll(' ', ''));
}

function setInvalid(inputList, errorMsgElem) {
    for (let i = 0; i < inputList.length; i++) {
        inputList[i].setAttribute('aria-invalid', true);
        inputList[i].setAttribute('aria-errormessage', errorMsgElem.id);
    }
}

function addErrorMessageAfterElem(refElem, errorMsgElem) {
    refElem.after(errorMsgElem);
}

function addErrorClassToLabel(labelElem) {
    labelElem.classList.add('Label--targetError');
}

function createErrorMessage(errorMsgPrefex, errorMsg, withLeftPadding, withTopPadding) {
    const errorMessageSuffix = '-errorMsg';
    const div = document.createElement('div');
    div.setAttribute('id', errorMsgPrefex + errorMessageSuffix);
    div.setAttribute('role', 'alert');
    div.classList.add('FormItem__inputError');

    if (withLeftPadding) {
        div.classList.add('FormItem__inputError--paddingLeft');
    }

    if (withTopPadding) {
        div.classList.add('FormItem__inputError--paddingTop');
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

    const labelErrors = document.querySelectorAll('.Label--targetError');
    labelErrors.forEach(label => {
        label.classList.remove('Label--targetError');
    });
}