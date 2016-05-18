app.services.prescriptionsFormValidator = function PrescriptionsFormValidator() {};

app.services.prescriptionsFormValidator.prototype.init = function(data) {
  this.checkFormFieldsValidity(data);
  this.checkFormValidity();
};

app.services.prescriptionsFormValidator.prototype.checkFormFieldsValidity = function(data) {
  var doctorPharmacyFormFields = [
  {'messageId': '#pharmacy-name-validity-message', 'radioButtonId': '#pharmacy_type_existing', 'fieldId': '#pharmacy_name'},
  {'messageId': '#pharmacy-location-validity-message', 'radioButtonId': '#pharmacy_type_existing', 'fieldId': '#pharmacy_location'},
  {'messageId': '#doctor-first-name-validity-message', 'radioButtonId': '#doctor_type_existing', 'fieldId': '#doctor_first_name'},
  {'messageId': '#doctor-last-name-validity-message', 'radioButtonId': '#doctor_type_existing', 'fieldId': '#doctor_last_name'}
  ];
  var miscFormFields = [
  {'function': lengthValid, 'messageId': '#length-validity-message', 'fieldId': '#prescription_fill_duration'},
  {'function': refillsValid, 'messageId': '#refills-validity-message', 'fieldId': '#prescription_refills'},
  {'function': startDateValid, 'messageId': '#start-date-validity-message', 'fieldId': '#prescription_start_date'},
  {'function': doseSizeValid, 'messageId': '#dose-size-validity-message', 'fieldId': '#prescription_dose_size' }
  ];
  checkDrugNameValidity(data);
  doctorPharmacyFormFields.forEach(function(formField) {
    checkDoctorPharmacyFormFieldValidity(formField.messageId, formField.radioButtonId, formField.fieldId);
  });
  miscFormFields.forEach(function(formField) {
    checkFormFieldValidity(formField.function, formField.messageId, formField.fieldId);
  });
};

app.services.prescriptionsFormValidator.prototype.checkFormValidity = function() {
  function checkFormValidityCallback() {
    return formValid() ? disableSubmitButton(false) : disableSubmitButton(true);
  }
  onInputOrChange('#form', checkFormValidityCallback);
};

function checkDrugNameValidity(data) {
  onInputOrChange('#drug_name', removeDrugNameValidityMessage);
  $('#drug_name').focusout(function(){
    if ($(this).val().length > 0) {
      var drugName = $(this).val();
      $.ajax({ url: '/drugs', method: 'POST', data: { drug_name: drugName }
      }).success(function(data) { setDrugNameValidityMessage(data); });
    } else { removeDrugNameValidityMessage(); }
  });
}

function setDrugNameValidityMessage(data) {
  if(data.validity) { $('#drug-name-validity-message').html('\u2714').show(); }
  else { $('#drug-name-validity-message').html('Invalid name').show(); }
}

function removeDrugNameValidityMessage() {
  $('#drug-name-validity-message').empty();
}

function checkDoctorPharmacyFormFieldValidity(validityMessageId, radioButtonId, formFieldId) {
  function checkDoctorPharmacyFormFieldValidityCallback() {
    if($(this).val().length === 0) {
      showValidityMessage(validityMessageId);
    } else { hideValidityMessage(validityMessageId); }
  }
  $(radioButtonId).focus(function() {
    hideValidityMessage(validityMessageId);
  });
  onInputOrChange(formFieldId, checkDoctorPharmacyFormFieldValidityCallback);
}

function checkFormFieldValidity(checkValidityFunction, validityMessageId, formFieldId) {
  function checkFormFieldValidityCallback() {
    if (checkValidityFunction()) { hideValidityMessage(validityMessageId); }
    else { showValidityMessage(validityMessageId); }
  }
  onInputOrChange(formFieldId, checkFormFieldValidityCallback);
}

function onInputOrChange(elementId, callback) {
  $(elementId).on('input', callback);
  $(elementId).on('change', callback);
}

function showValidityMessage(messageId) {
  $(messageId).show();
}

function hideValidityMessage(messageId) {
  $(messageId).hide();
}

function disableSubmitButton(boolean) {
  $('#prescription-form-submit').prop('disabled', boolean);
}

// Check validity of form fields

function drugNameValid() {
  return $('#drug-name-validity-message').html() === '\u2714' ||
  !!$('#drug_name').attr('disabled');
}

function doctorValid() {
  return existingDoctorSelected() ||
  newDoctorEntered() ||
  firstDoctorEntered();
}

function existingDoctorSelected() {
  return $('#doctor_type_existing').prop('checked') &&
  $('#doctor_id :selected').val() !== '';
}

function newDoctorEntered() {
  return $('#doctor_type_new').prop('checked') &&
  $('#doctor_first_name').val() !== '' &&
  $('#doctor_last_name').val() !== '';
}

function firstDoctorEntered() {
  return !$('#doctor_type_existing').prop('checked') &&
  !$('#doctor_type_new').prop('checked') &&
  $('#doctor_first_name').val() !== '' &&
  $('#doctor_last_name').val() !== '';
}

function pharmacyValid() {
  return existingPharmacySelected() ||
  newPharmacyEntered() ||
  firstPharmacyEntered();
}

function existingPharmacySelected() {
  return $('#pharmacy_type_existing').prop('checked') &&
  $('#pharmacy_id :selected').val() !== '';
}

function newPharmacyEntered() {
  return $('#pharmacy_type_new').prop('checked') &&
  $('#pharmacy_name').val() !== '' &&
  $('#pharmacy_location').val() !== '';
}

function firstPharmacyEntered() {
  return !$('#pharmacy_type_existing').prop('checked') &&
  !$('#pharmacy_type_new').prop('checked') &&
  $('#pharmacy_name').val() !== '' &&
  $('#pharmacy_location').val() !== '';
}

function lengthValid() {
  return $('#prescription_fill_duration').val() !== '' &&
  parseInt($('#prescription_fill_duration').val()) > 0;
}

function refillsValid() {
  return $('#prescription_refills').val() !== '' &&
  parseInt($('#prescription_refills').val()) > -1;
}

function startDateValid() {
  var startDate = $('#prescription_start_date').val();
  var dateRegex = /^(?:(20)[0-9]{2})[-.](0[1-9]|1[012])[-.](0[1-9]|[12][0-9]|3[01])$/;
  return dateRegex.test(startDate);
}

function doseSizeValid() {
  return $('#prescription_dose_size').val() !== '';
}

function scheduledDosesValid() {
  var morning = parseInt($('#scheduled_doses_morning :selected').val());
  var afternoon = parseInt($('#scheduled_doses_afternoon :selected').val());
  var evening = parseInt($('#scheduled_doses_evening :selected').val());
  var bedtime = parseInt($('#scheduled_doses_bedtime :selected').val());
  return morning + afternoon + evening + bedtime > 0 ? true : false;
}

// Check validity of all fields

function formValid() {
  return drugNameValid() &&
  doctorValid() &&
  pharmacyValid() &&
  lengthValid() &&
  refillsValid() &&
  startDateValid() &&
  doseSizeValid() &&
  scheduledDosesValid();
}