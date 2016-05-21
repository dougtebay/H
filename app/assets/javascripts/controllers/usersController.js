app.controllers.usersController = function UsersController() {};

app.controllers.usersController.prototype.init = function() {
  this.attachListeners();
};

app.controllers.usersController.prototype.attachListeners = function() {
  $(document).on('click', '#harmony-logo', $.proxy(function(event) {
    this.show(event);
  }, this));
  $(document).on('click', '#new-user-button', $.proxy(function(event) {
    this.create(event);
  }, this));
  $(document).on('click', '#edit-user-button', $.proxy(function(event) {
    this.update(event);
  }, this));
};

app.controllers.usersController.prototype.show = function() {
var userId = parseInt($('.user-id').attr('id'));
  $.ajax({
    url: '/users/' + userId,
    method: 'GET'
  }).success(function(data) {
    $('.body-partial').remove();
    $('body').append(data);
  });
};

app.controllers.usersController.prototype.create = function() {
  $('#user-form').children().remove();
  $.ajax({
    url: '/users/new',
    method: 'GET'
  }).success(function(data) {
    $('#user-form').append(data);
    var usersFormValidator = new app.services.usersFormValidator();
    usersFormValidator.init(data);
    $('#user-form-submit').click(function(event) {
      event.preventDefault();
      event.stopPropagation();
      $('#sign-up-modal').modal('hide');
      var formData = $('#new_user').serializeArray();
      $.ajax({
        url: '/users',
        method: 'POST',
        data: formData
      }).success(function(data) {
        $('.body-partial').remove();
        $('body').append(data);
      });
    });
  });
};

app.controllers.usersController.prototype.update = function() {
  $('#sign-up-modal').remove();
  $('#user-form').children().remove();
  var userId = parseInt($('.user-id').attr('id'));
  $.ajax({
    url: '/users/' + userId + '/edit',
    method: 'GET'
  }).success(function(data) {
    $('#user-form').append(data);
    var usersFormValidator = new app.services.usersFormValidator();
    usersFormValidator.init();
    $('#user_email').trigger('focusout');
    $(document).on('click', '#user-form-submit', function(event) {
      event.preventDefault();
      event.stopPropagation();
      $('#edit-profile-modal').modal('hide');
      var formData = $('#edit_user_' + userId).serializeArray();
      $.ajax({
        url: '/users/' + userId,
        method: 'PATCH',
        data: formData
      }).success(function(data) {
        $('#navbar-partial').remove();
        $('body').append(data);
      });
    });
  });
};