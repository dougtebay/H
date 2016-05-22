app.services.formValidator = function FormValidator() {};

app.services.formValidator.prototype.checkMiscFormFieldValidity = function(checkValidityFunction, validityMessageId, formFieldId) {
  function checkFormFieldValidityCallback(elementId, self) {
    if(checkValidityFunction()) { self.hideValidityMessage(validityMessageId); }
    else { self.showValidityMessage(validityMessageId); }
  }
  this.onInputOrChange(formFieldId, checkFormFieldValidityCallback);
};

app.services.formValidator.prototype.showValidityMessage = function(messageId) {
  $(messageId).show();
};

app.services.formValidator.prototype.hideValidityMessage = function(messageId) {
  $(messageId).hide();
};

app.services.formValidator.prototype.onInputOrChange = function(elementId, callbackName) {
  var self = this;
  $(elementId).on('input', function() { callbackName(elementId, self); });
  $(elementId).on('change', function() { callbackName(elementId, self); });
};

app.services.formValidator.prototype.setValidityMessage = function(data, messageId, message) {
  if(data.validity) { $(messageId).html('\u2714').show(); }
  else { $(messageId).html(message).show(); }
};

app.services.formValidator.prototype.removeValidityMessage = function(messageId) {
  $(messageId).empty();
};

app.services.formValidator.prototype.checkFormValidity = function(formId) {
  function checkFormValidityCallback(elementId, self) {
    if(self.formValid()) { return self.disableSubmitButton(false, ':submit'); }
    else { return self.disableSubmitButton(true, ':submit'); }
  }
  this.onInputOrChange(formId, checkFormValidityCallback);
};

app.services.formValidator.prototype.disableSubmitButton = function(boolean, submitButtonId) {
  $(submitButtonId).prop('disabled', boolean);
};