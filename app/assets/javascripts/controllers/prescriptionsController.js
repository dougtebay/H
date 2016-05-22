app.controllers.prescriptionsController = function PrescriptionsController() {};

app.controllers.prescriptionsController.prototype.init = function() {
  this.attachListeners();
  var prescriptionsFormAnimator = new app.services.prescriptionsFormAnimator();
  prescriptionsFormAnimator.init();

  $(document).on('click', '#exp-soon-table form', function(event) {
    event.preventDefault();
    var rxId = $(this).children('.btn').attr('data-rxid');
    $.ajax({
      url: '/refills/' + rxId,
      method: 'PATCH',
      data: {refill: true}
    }).success(function(data) {
      if (data.expSoon && data.prescription.refills > 0) {
        var expDate = data.expDate;
        var refills = data.prescription.refills;
        var $expTd = $('tr[data-rxid='+data.prescription.id+'] td:nth-child(2) span');
        var $refillsTd = $('tr[data-rxid='+data.prescription.id+'] td:nth-child(3) span');
        $expTd.fadeOut(200, function() {
          $(this).text(expDate);
          $(this).fadeIn(200);
        });
        $refillsTd.fadeOut(200, function() {
          $(this).text(refills);
          $(this).fadeIn(200);
        });
      } else {
        var $tr = $('tr[data-rxid='+data.prescription.id+']');
        $tr.hide(300, function(){ $(this).remove(); });
      }
    });
  });
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
    $('#prescriptions-dropdown').trigger('click');
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
    method: 'DELETE',
    data: { id: prescriptionId }
  }).success(function(data) {
    $('.body-partial').remove();
    $('body').append(data);
  });
};