app.controllers.refillsController = function RefillsController() {};

app.controllers.refillsController.prototype.init = function() {
  this.attachListeners();
};

app.controllers.refillsController.prototype.attachListeners = function() {
  $(document).on('click', '#exp-soon-table form', $.proxy(function(event) {
    this.update(event);
  }, this));
};

app.controllers.refillsController.prototype.update = function(event) {
  event.preventDefault();
  var rxId = $('#exp-soon-table form').children('.btn').attr('data-rxid');
  $.ajax({
    url: '/refills/' + rxId,
    method: 'PATCH'
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
};