app.services.usersFormValidator = function UsersFormValidator() {};

app.services.usersFormValidator.prototype.init = function(data) {
  this.checkFormFieldsValidity(data);
  this.checkFormValidity();
};

app.services.usersFormValidator.prototype.checkFormFieldsValidity = function(data) {
  var miscFormFields = [
  {'functionName': this.firstNameValid, 'messageId': '#user-first-name-validity-message', 'fieldId': '#user_first_name'},
  {'functionName': this.lastNameValid, 'messageId': '#user-last-name-validity-message', 'fieldId': '#user_last_name'},
  {'functionName': this.passwordValid, 'messageId': '#password-validity-message', 'fieldId': '#user_password'}
  ];
  this.checkEmailValidity(data);
  miscFormFields.forEach(function(formField) {
    this.checkMiscFormFieldValidity(formField.functionName, formField.messageId, formField.fieldId);
  }, this);
  this.checkPasswordComfirmationValidity();
};

// Functions to show or hide validity messages for individual form fields

app.services.usersFormValidator.prototype.checkEmailValidity = function(data) {
  this.onInputOrChange('#user_email', this.removeEmailValidityMessage);
  $('#user_email').focusout($.proxy(function() {
    if ($('#user_email').val().length > 0) {
      var email = $('#user_email').val();
      $.ajax({ url: '/emails', method: 'POST', data: { email: email }, context: this
      }).success(function(data) {
        this.setEmailValidityMessage(data); });
    } else { this.removeEmailValidityMessage(); }
  }, this));
};

app.services.usersFormValidator.prototype.setEmailValidityMessage = function(data) {
  if(data.validity) { $('#email-validity-message').html('\u2714').show(); }
  else { $('#email-validity-message').html('Address already in use').show(); }
};

app.services.usersFormValidator.prototype.removeEmailValidityMessage = function() {
  $('#email-validity-message').empty();
};

app.services.usersFormValidator.prototype.checkMiscFormFieldValidity = function(checkValidityFunction, validityMessageId, formFieldId) {
  function checkFormFieldValidityCallback(elementId, self) {
    if(checkValidityFunction()) { self.hideValidityMessage(validityMessageId); }
    else { self.showValidityMessage(validityMessageId); }
  }
  this.onInputOrChange(formFieldId, checkFormFieldValidityCallback);
};

app.services.usersFormValidator.prototype.showValidityMessage = function(messageId) {
  $(messageId).show();
};

app.services.usersFormValidator.prototype.hideValidityMessage = function(messageId) {
  $(messageId).hide();
};

app.services.usersFormValidator.prototype.checkPasswordComfirmationValidity = function() {
  function checkPasswordConfirmationValidityCallback(elementId, self) {
    if(self.passwordConfirmationValid()) { self.hideValidityMessage('#password-confirmation-validity-message'); }
    else { self.showValidityMessage('#password-confirmation-validity-message'); }
  }
  this.onInputOrChange('#user_password_confirmation', checkPasswordConfirmationValidityCallback);
};

// Functions to check the validity of all form fields

app.services.usersFormValidator.prototype.checkFormValidity = function() {
  function checkFormValidityCallback(elementId, self) {
    return self.formValid() ? self.disableSubmitButton(false) : self.disableSubmitButton(true);
  }
  this.onInputOrChange('#user-form', checkFormValidityCallback);
};

app.services.usersFormValidator.prototype.formValid = function() {
  return this.firstNameValid() &&
  this.lastNameValid() &&
  this.emailValid() &&
  this.passwordValid() &&
  this.passwordConfirmationValid();
};

app.services.usersFormValidator.prototype.onInputOrChange = function(elementId, callbackName) {
  var self = this;
  $(elementId).on('input', function() { callbackName(elementId, self); });
  $(elementId).on('change', function() { callbackName(elementId, self); });
};

app.services.usersFormValidator.prototype.disableSubmitButton = function(boolean) {
  $('#user-form-submit').prop('disabled', boolean);
};

// Functions to check the validity of individual form fields

app.services.usersFormValidator.prototype.emailValid = function() {
  return $('#email-validity-message').html() === '\u2714' ||
  !!$('#user_email').attr('disabled');
};

app.services.usersFormValidator.prototype.firstNameValid = function() {
  return $('#user_first_name').val() !== '';
};

app.services.usersFormValidator.prototype.lastNameValid = function() {
  return $('#user_last_name').val() !== '';
};

app.services.usersFormValidator.prototype.passwordValid = function() {
  return $('#user_password').val() !== '';
};

app.services.usersFormValidator.prototype.passwordConfirmationValid = function() {
  return $('#user_password_confirmation').val() === $('#user_password').val();
};