app.controllers.prescriptionsController = function PrescriptionsController() {};

app.controllers.prescriptionsController.prototype.init = function() {
  this.attachListeners();
  var prescriptionsFormAnimator = new app.services.prescriptionsFormAnimator();
  prescriptionsFormAnimator.init();
};

app.controllers.prescriptionsController.prototype.attachListeners = function() {
  $(document).on('click', '#my-prescriptions-button', $.proxy(function(event) {
    this.index(event);
  }, this));
  $(document).on('click', '#new-prescription-button', $.proxy(function(event) {
    this.create(event);
  }, this));
  $(document).on('click', '.edit-prescription-button', $.proxy(function(event) {
    this.update(event);
  }, this));
  $(document).on('click', '.delete-prescription-button', $.proxy(function(event) {
    this.destroy(event);
  }, this));
};

app.controllers.prescriptionsController.prototype.index = function() {
  $.ajax({
    url: '/prescriptions',
    method: 'GET'
  }).success(function(data) {
    $('.body-partial').remove();
    $('body').append(data);
  });
};

app.controllers.prescriptionsController.prototype.create = function(event) {
  event.stopPropagation();
  $('#prescription-form').children().remove();
  $.ajax({
    url: '/prescriptions/new',
    method: 'GET'
  }).success(function(data) {
    $('#prescription-form').append(data);
    var prescriptionsFormValidator = new app.services.prescriptionsFormValidator();
    prescriptionsFormValidator.init(data);
    $('#prescription-form-submit').click(function(event) {
      event.preventDefault();
      $('#prescription-modal').modal('hide');
      var formData = $('#new_prescription').serializeArray();
      $.ajax({
        url: '/prescriptions',
        method: 'POST',
        data: formData
      }).success(function(data) {
        $('.body-partial').remove();
        $('body').append(data);
      });
    });
  });
};

app.controllers.prescriptionsController.prototype.update = function(event) {
  event.stopPropagation();
  $('#prescription-form').children().remove();
  prescriptionId = parseInt($(event.target).attr('id'));
  $.ajax({
    url: '/prescriptions/' + prescriptionId + '/edit',
    method: 'GET'
  }).success(function(data) {
    $('#prescription-form').append(data);
    var prescriptionsFormValidator = new app.services.prescriptionsFormValidator();
    prescriptionsFormValidator.disableSubmitButton(false, ':submit');
    prescriptionsFormValidator.init(data);
    $('#prescription-form-submit').click(function(event) {
      event.preventDefault();
      $('#prescription-modal').modal('hide');
      var formData = $('#edit_prescription_' + prescriptionId).serializeArray();
      $.ajax({
        url: '/prescriptions/' + prescriptionId,
        method: 'PATCH',
        data: formData
      }).success(function(data) {
        $('.body-partial').remove();
        $('body').append(data);
      });
    });
  });
};

app.controllers.prescriptionsController.prototype.destroy = function(event) {
  prescriptionId = parseInt($(event.target).prev().attr('id'));
  $.ajax({
    url: '/prescriptions/' + prescriptionId,
    method: 'DELETE'
  }).success(function(data) {
    $('.body-partial').remove();
    $('body').append(data);
  });
};