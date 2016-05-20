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
  {'functionName': this.lengthValid, 'messageId': '#length-validity-message', 'fieldId': '#prescription_fill_duration'},
  {'functionName': this.refillsValid, 'messageId': '#refills-validity-message', 'fieldId': '#prescription_refills'},
  {'functionName': this.startDateValid, 'messageId': '#start-date-validity-message', 'fieldId': '#prescription_start_date'},
  {'functionName': this.doseSizeValid, 'messageId': '#dose-size-validity-message', 'fieldId': '#prescription_dose_size' }
  ];
  this.checkDrugNameValidity(data);
  doctorPharmacyFormFields.forEach(function(formField) {
    this.checkDoctorPharmacyFormFieldValidity(formField.messageId, formField.radioButtonId, formField.fieldId);
  }, this);
  miscFormFields.forEach(function(formField) {
    this.checkMiscFormFieldValidity(formField.functionName, formField.messageId, formField.fieldId);
  }, this);
};

// Functions to show or hide validity messages for individual form fields

app.services.prescriptionsFormValidator.prototype.checkDrugNameValidity = function(data) {
  this.onInputOrChange('#drug_name', this.removeDrugNameValidityMessage);
  $('#drug_name').focusout($.proxy(function() {
    if ($('#drug_name').val().length > 0) {
      var drugName = $('#drug_name').val();
      $.ajax({ url: '/drugs', method: 'POST', data: { drug_name: drugName }, context: this
      }).success(function(data) {
        this.setDrugNameValidityMessage(data); });
    } else { this.removeDrugNameValidityMessage(); }
  }, this));
};

app.services.prescriptionsFormValidator.prototype.setDrugNameValidityMessage = function(data) {
  if(data.validity) { $('#drug-name-validity-message').html('\u2714').show(); }
  else { $('#drug-name-validity-message').html('Invalid name').show(); }
};

app.services.prescriptionsFormValidator.prototype.removeDrugNameValidityMessage = function() {
  $('#drug-name-validity-message').empty();
};

app.services.prescriptionsFormValidator.prototype.checkDoctorPharmacyFormFieldValidity = function(validityMessageId, radioButtonId, formFieldId) {
  function checkDoctorPharmacyFormFieldValidityCallback(elementId, self) {
    if($(elementId).val().length === 0) {
      self.showValidityMessage(validityMessageId);
    } else { self.hideValidityMessage(validityMessageId); }
  }
  $(radioButtonId).focus($.proxy(function() {
    this.hideValidityMessage(validityMessageId);
  }, this));
  this.onInputOrChange(formFieldId, checkDoctorPharmacyFormFieldValidityCallback);
};

app.services.prescriptionsFormValidator.prototype.checkMiscFormFieldValidity = function(checkValidityFunction, validityMessageId, formFieldId) {
  function checkFormFieldValidityCallback(elementId, self) {
    if (checkValidityFunction()) { self.hideValidityMessage(validityMessageId); }
    else { self.showValidityMessage(validityMessageId); }
  }
  this.onInputOrChange(formFieldId, checkFormFieldValidityCallback);
};

app.services.prescriptionsFormValidator.prototype.showValidityMessage = function(messageId) {
  $(messageId).show();
};

app.services.prescriptionsFormValidator.prototype.hideValidityMessage = function(messageId) {
  $(messageId).hide();
};

// Functions to check the validity of all form fields

app.services.prescriptionsFormValidator.prototype.checkFormValidity = function() {
  function checkFormValidityCallback(elementId, self) {
    return self.formValid() ? self.disableSubmitButton(false) : self.disableSubmitButton(true);
  }
  this.onInputOrChange('#prescription-form', checkFormValidityCallback);
};

app.services.prescriptionsFormValidator.prototype.formValid = function() {
  return this.drugNameValid() &&
  this.doctorValid() &&
  this.pharmacyValid() &&
  this.lengthValid() &&
  this.refillsValid() &&
  this.startDateValid() &&
  this.doseSizeValid() &&
  this.scheduledDosesValid();
};

app.services.prescriptionsFormValidator.prototype.onInputOrChange = function(elementId, callbackName) {
  var self = this;
  $(elementId).on('input', function() { callbackName(elementId, self); });
  $(elementId).on('change', function() { callbackName(elementId, self); });
};

app.services.prescriptionsFormValidator.prototype.disableSubmitButton = function(boolean) {
  $('#prescription-form-submit').prop('disabled', boolean);
};

// Functions to check the validity of individual form fields

app.services.prescriptionsFormValidator.prototype.drugNameValid = function() {
  return $('#drug-name-validity-message').html() === '\u2714' ||
  !!$('#drug_name').attr('disabled');
};

app.services.prescriptionsFormValidator.prototype.doctorValid = function() {
  return this.existingDoctorSelected() ||
  this.newDoctorEntered() ||
  this.firstDoctorEntered();
};

app.services.prescriptionsFormValidator.prototype.existingDoctorSelected = function() {
  return $('#doctor_type_existing').prop('checked') &&
  $('#doctor_id :selected').val() !== '';
};

app.services.prescriptionsFormValidator.prototype.newDoctorEntered = function() {
  return $('#doctor_type_new').prop('checked') &&
  $('#doctor_first_name').val() !== '' &&
  $('#doctor_last_name').val() !== '';
};

app.services.prescriptionsFormValidator.prototype.firstDoctorEntered = function() {
  return !$('#doctor_type_existing').prop('checked') &&
  !$('#doctor_type_new').prop('checked') &&
  $('#doctor_first_name').val() !== '' &&
  $('#doctor_last_name').val() !== '';
};

app.services.prescriptionsFormValidator.prototype.pharmacyValid = function() {
  return this.existingPharmacySelected() ||
  this.newPharmacyEntered() ||
  this.firstPharmacyEntered();
};

app.services.prescriptionsFormValidator.prototype.existingPharmacySelected = function() {
  return $('#pharmacy_type_existing').prop('checked') &&
  $('#pharmacy_id :selected').val() !== '';
};

app.services.prescriptionsFormValidator.prototype.newPharmacyEntered = function() {
  return $('#pharmacy_type_new').prop('checked') &&
  $('#pharmacy_name').val() !== '' &&
  $('#pharmacy_location').val() !== '';
};

app.services.prescriptionsFormValidator.prototype.firstPharmacyEntered = function() {
  return !$('#pharmacy_type_existing').prop('checked') &&
  !$('#pharmacy_type_new').prop('checked') &&
  $('#pharmacy_name').val() !== '' &&
  $('#pharmacy_location').val() !== '';
};

app.services.prescriptionsFormValidator.prototype.lengthValid = function() {
  return $('#prescription_fill_duration').val() !== '' &&
  parseInt($('#prescription_fill_duration').val()) > 0;
};

app.services.prescriptionsFormValidator.prototype.refillsValid = function() {
  return $('#prescription_refills').val() !== '' &&
  parseInt($('#prescription_refills').val()) > -1;
};

app.services.prescriptionsFormValidator.prototype.startDateValid = function() {
  var startDate = $('#prescription_start_date').val();
  var dateRegex = /^(?:(20)[0-9]{2})[-.](0[1-9]|1[012])[-.](0[1-9]|[12][0-9]|3[01])$/;
  return dateRegex.test(startDate);
};

app.services.prescriptionsFormValidator.prototype.doseSizeValid = function() {
  return $('#prescription_dose_size').val() !== '';
};

app.services.prescriptionsFormValidator.prototype.scheduledDosesValid = function() {
  var morning = parseInt($('#scheduled_doses_morning :selected').val());
  var afternoon = parseInt($('#scheduled_doses_afternoon :selected').val());
  var evening = parseInt($('#scheduled_doses_evening :selected').val());
  var bedtime = parseInt($('#scheduled_doses_bedtime :selected').val());
  return morning + afternoon + evening + bedtime > 0 ? true : false;
};