app.controllers.prescriptionsController = function PrescriptionsController() {};

app.controllers.prescriptionsController.prototype.init = function() {
  this.create();
  this.update();
  this.destroy();
  var prescriptionsFormAnimator = new app.services.prescriptionsFormAnimator();
  prescriptionsFormAnimator.init();

  $('#exp-soon-table form').click(function(event) {
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

app.controllers.prescriptionsController.prototype.create = function() {
  $(document).on('click', '#newPrescriptionButton', function(event) {
    $('#form').children().remove();
    event.preventDefault();
    $.ajax({
      url: '/prescriptions/new',
      method: 'GET'
    }).success(function(data) {
      $('#form').append(data);
      var prescriptionsFormValidator = new app.services.prescriptionsFormValidator();
      prescriptionsFormValidator.init(data);
      $('#prescription-form-submit').click(function(event) {
        event.preventDefault();
        $("#prescriptionModal").modal("hide");
        var formData = $('#new_prescription').serializeArray();
        $.ajax({
          url: '/prescriptions',
          method: 'POST',
          data: formData
        }).success(function(data) {
          $('#partial').remove();
          $('body').append(data);
        });
      });
    });
  });
};

app.controllers.prescriptionsController.prototype.update = function() {
  $(document).on('click', '.editPrescriptionButton', function(event) {
    $('#form').children().remove();
    event.preventDefault();
    prescriptionId = parseInt($(this).attr('id'));
    $.ajax({
      url: '/prescriptions/' + prescriptionId + '/edit',
      method: 'GET'
    }).success(function(data) {
      $('#form').append(data);
      disableSubmitButton(false);
      var prescriptionsFormValidator = new app.services.prescriptionsFormValidator();
      prescriptionsFormValidator.init(data);
      $('#prescription-form-submit').click(function(event) {
        event.preventDefault();
        $("#prescriptionModal").modal("hide");
        var formData = $('#edit_prescription_' + prescriptionId).serializeArray();
        $.ajax({
          url: '/prescriptions/' + prescriptionId,
          method: 'PATCH',
          data: formData
        }).success(function(data) {
          $('#partial').remove();
          $('body').append(data);
        });
      });
    });
  });
};

app.controllers.prescriptionsController.prototype.destroy = function() {
  $(document).on('click', '.deletePrescriptionButton', function(event) {
    event.preventDefault();
    prescriptionId = parseInt($(this).prev().attr('id'));
    $.ajax({
      url: '/prescriptions/' + prescriptionId,
      method: 'DELETE',
      data: { id: prescriptionId }
    }).success(function(data) {
      $('#partial').remove();
      $('body').append(data);
    });
  });
};