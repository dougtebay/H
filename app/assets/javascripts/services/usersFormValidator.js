app.services.usersFormValidator = function UsersFormValidator() {};
app.services.usersFormValidator.prototype = new app.services.formValidator();

app.services.usersFormValidator.prototype.init = function(data) {
  this.checkFormFieldsValidity(data);
  this.checkFormValidity('#user-form');
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
  this.onInputOrChange('#user_email', this.removeValidityMessage);
  $('#user_email').focusout($.proxy(function() {
    if ($('#user_email').val().length > 0) {
      var email = $('#user_email').val();
      $.ajax({ url: '/emails', method: 'POST', data: { email: email }, context: this
      }).success(function(data) {
        this.setValidityMessage(data, '#email-validity-message', 'Address already in use'); });
    } else { this.removeValidityMessage('#email-validity-message'); }
  }, this));
};

app.services.usersFormValidator.prototype.checkPasswordComfirmationValidity = function() {
  function checkPasswordConfirmationValidityCallback(elementId, self) {
    if(self.passwordConfirmationValid()) { self.hideValidityMessage('#password-confirmation-validity-message'); }
    else { self.showValidityMessage('#password-confirmation-validity-message'); }
  }
  this.onInputOrChange('#user_password_confirmation', checkPasswordConfirmationValidityCallback);
};

// Functions to check the validity of all form fields

app.services.usersFormValidator.prototype.formValid = function() {
  return this.firstNameValid() &&
  this.lastNameValid() &&
  this.emailValid() &&
  this.passwordValid() &&
  this.passwordConfirmationValid();
};

// Functions to check the validity of individual form fields

app.services.usersFormValidator.prototype.firstNameValid = function() {
  return $('#user_first_name').val() !== '';
};

app.services.usersFormValidator.prototype.lastNameValid = function() {
  return $('#user_last_name').val() !== '';
};

app.services.usersFormValidator.prototype.emailValid = function() {
  return $('#email-validity-message').html() === '\u2714' ||
  !!$('#user_email').attr('disabled');
};

app.services.usersFormValidator.prototype.passwordValid = function() {
  return $('#user_password').val() !== '';
};

app.services.usersFormValidator.prototype.passwordConfirmationValid = function() {
  return $('#user_password_confirmation').val() === $('#user_password').val();
};