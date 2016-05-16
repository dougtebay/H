app.prescriptions = {
  controller: {
    new: function PrescriptionsController() {}
  }
};

app.prescriptions.controller.new.prototype.init = function() {
  $(document).on('click', '#newPrescriptionButton', function(event) {
    $('#form').children().remove();
    event.preventDefault();
    $.ajax({
      url: '/prescriptions/new',
      method: 'GET'
    }).success(function(data) {
      $('#form').append(data);
      checkFormFieldsValidity(data);
      checkFormValidity();
      $('#form-submit').click(function(event) {
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
      checkFormFieldsValidity(data);
      checkFormValidity();
      $('#form-submit').click(function(event) {
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

showOptions('#doc_type_new');
hideOptions('#doc_type_existing');
showOptions('#pharm_type_new');
hideOptions('#pharm_type_existing');

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

function checkDrugNameValidity(data) {
  $('#drug_name').focusout(function(){
    if ($(this).val().length > 0) {
      var drugName = $(this).val();
      $.ajax({ url: '/drugs', method: 'POST', data: { drug_name: drugName }
      }).success(function(data) { setDrugNameValidityMessage(data); });
    } else { removeDrugNameValidityMessage(); }
  });
}

function setDrugNameValidityMessage(data) {
  if(data.validity) {
    $('#drug-name-validity-message').html('\u2714').show();
  } else {
    $('#drug-name-validity-message').html('Invalid name').show();
  }
}

function removeDrugNameValidityMessage() {
  $('#drug-name-validity-message').empty();
}

function checkDoctorFirstNameValidity() {
  $('#doctor_first_name').on('input', function() {
    if($(this).val().length === 0) {
      showValidityMessage('#doctor-first-name-error-message');
    } else { hideValidityMessage('#doctor-first-name-error-message'); }
  });
  $('#doc_type_existing').focus(function() {
    hideValidityMessage('#doctor-first-name-error-message');
  });
}

function checkDoctorLastNameValidity() {
  $('#doctor_last_name').on('input', function() {
    if($(this).val().length === 0) {
      showValidityMessage('#doctor-last-name-error-message');
    } else { hideValidityMessage('#doctor-last-name-error-message'); }
  });
  $('#doc_type_existing').focus(function() {
    hideValidityMessage('#doctor-last-name-error-message');
  });
}

function checkPharmacyNameValidity() {
  $('#pharmacy_name').on('input', function() {
    if($(this).val().length === 0) {
      showValidityMessage('#pharmacy-name-error-message');
    } else { hideValidityMessage('#pharmacy-name-error-message'); }
  });
  $('#pharm_type_existing').focus(function() {
    hideValidityMessage('#pharmacy-name-error-message');
  });
}

function checkPharmacyLocationValidity() {
  $('#pharmacy_location').on('input', function() {
    if($(this).val().length === 0) {
      showValidityMessage('#pharmacy-location-error-message');
    } else { hideValidityMessage('#pharmacy-location-error-message'); }
  });
  $('#pharm_type_existing').focus(function() {
    hideValidityMessage('#pharmacy-location-error-message');
  });
}

function checkPrescriptionLengthValidity() {
  $('#prescription_fill_duration').on('input', function() {
    if(prescriptionLengthValid()) {
      hideValidityMessage('#prescription-length-error-message');
    } else { showValidityMessage('#prescription-length-error-message'); }
  });
}

function checkRefillsValidity() {
  $('#prescription_refills').on('input', function() {
    if (refillsValid()) {
      hideValidityMessage('#refills-error-message');
    } else { showValidityMessage('#refills-error-message'); }
  });
}

function checkStartDateValidity() {
  $('#prescription_start_date').on('input', function() {
    if(startDateValid()) {
      hideValidityMessage('#start-date-error-message');
    } else { showValidityMessage('#start-date-error-message'); }
  });
}

function checkDoseSizeValidity() {
  $('#prescription_dose_size').on('input', function(){
    if(doseSizeValid()) {
      hideValidityMessage('#dose-size-error-message');
    } else { showValidityMessage('#dose-size-error-message'); }
  });
}

function checkFormValidity() {
  function formValidCallback() {
    return formValid() ? disableSubmitButton(false) : disableSubmitButton(true);
  }
  $('#form').on('input', formValidCallback);
  $('#form').on('change', formValidCallback);
}

function showValidityMessage(messageId) {
  $(messageId).show();
}

function hideValidityMessage(messageId) {
  $(messageId).hide();
}

function disableSubmitButton(boolean) {
  $('#form-submit').prop('disabled', boolean);
}

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
  return $('#doc_type_existing').prop('checked') &&
  $('#doctor_id :selected').val() !== '';
}

function newDoctorEntered() {
  return $('#doc_type_new').prop('checked') &&
  $('#doctor_first_name').val() !== '' &&
  $('#doctor_last_name').val() !== '';
}

function firstDoctorEntered() {
  return !$('#doc_type_existing').prop('checked') &&
  !$('#doc_type_new').prop('checked') &&
  $('#doctor_first_name').val() !== '' &&
  $('#doctor_last_name').val() !== '';
}

function pharmacyValid() {
  return existingPharmacySelected() ||
  newPharmacyEntered() ||
  firstPharmacyEntered();
}

function existingPharmacySelected() {
  return $('#pharm_type_existing').prop('checked') &&
  $('#pharmacy_id :selected').val() !== '';
}

function newPharmacyEntered() {
  return $('#pharm_type_new').prop('checked') &&
  $('#pharmacy_name').val() !== '' &&
  $('#pharmacy_location').val() !== '';
}

function firstPharmacyEntered() {
  return !$('#pharm_type_existing').prop('checked') &&
  !$('#pharm_type_new').prop('checked') &&
  $('#pharmacy_name').val() !== '' &&
  $('#pharmacy_location').val() !== '';
}

function prescriptionLengthValid() {
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

function checkFormFieldsValidity(data) {
  checkDrugNameValidity(data);
  checkDoctorFirstNameValidity();
  checkDoctorLastNameValidity();
  checkPharmacyNameValidity();
  checkPharmacyLocationValidity();
  checkPrescriptionLengthValidity();
  checkRefillsValidity();
  checkStartDateValidity();
  checkDoseSizeValidity();
}

function formValid() {
  return drugNameValid() &&
  doctorValid() &&
  pharmacyValid() &&
  prescriptionLengthValid() &&
  refillsValid() &&
  startDateValid() &&
  doseSizeValid() &&
  scheduledDosesValid();
}

function showOptions(elementId) {
  $(document).on('click', elementId, function() {
    $(this).parent().next().show(200);
  });
}

function hideOptions(elementId) {
  $(document).on('click', elementId, function() {
    $(this).parent().next().next().hide(200);
  });
}