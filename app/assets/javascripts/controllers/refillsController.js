app.controllers.refillsController = function RefillsController() {};

app.controllers.refillsController.prototype.init = function() {
  this.attachListeners();
};

app.controllers.refillsController.prototype.attachListeners = function() {
  $(document).on('click', '.refill-button-group', $.proxy(function(event) {
    this.update(event);
  }, this));
};

app.controllers.refillsController.prototype.update = function(event) {
  event.stopPropagation();
  prescriptionId = parseInt($(event.target).closest('div[id]').attr('id'));
  $.ajax({
    url: '/refills/' + prescriptionId,
    method: 'PATCH'
  }).success(function(data) {
    $('.body-partial').remove();
    $('body').append(data);
    ReactRailsUJS.mountComponents()
  });
};