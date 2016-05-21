app.controllers.sessionsController = function SessionsController() {};

app.controllers.sessionsController.prototype.init = function() {
  this.attachListeners();
};

app.controllers.sessionsController.prototype.attachListeners = function() {
  $(document).on('click', '#log-in-button', $.proxy(function(event) {
    this.create(event);
  }, this));
  $(document).on('click', '#log-out-button', $.proxy(function(event) {
    this.destroy(event);
  }, this));
};

app.controllers.sessionsController.prototype.create = function(event) {
  event.preventDefault();
  var formData = $('#new_session').serializeArray();
  $.ajax({
    url: '/sessions',
    method: 'POST',
    data: formData
    }).then(function(data) {
    $('#login-modal').modal('hide');
    $('#sign-up-modal').remove();
    $('.body-partial').remove();
    $('body').append(data);
    }).fail(function(data) {
    $('#new-session-error-message p').empty().append(data.responseJSON.error);
  });
};

app.controllers.sessionsController.prototype.destroy = function(event) {
  var userId = parseInt($('.user-id').attr('id'));
  $.ajax({
    url: '/sessions/' + userId,
    method: 'DELETE',
  }).success(function(data) {
    $('#login-modal').remove();
    $('.body-partial').remove();
    $('body').append(data);
    $('#user-dropdown').trigger('click');
  });
};