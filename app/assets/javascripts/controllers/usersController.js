app.controllers.usersController = function UsersController() {};

app.controllers.usersController.prototype.init = function() {
  this.attachListeners();
};

app.controllers.usersController.prototype.attachListeners = function() {
  $(document).on('click', '#new-user-button', $.proxy(function(event) {
    this.create(event);
  }, this));
  $(document).on('click', '#edit-user-button', $.proxy(function(event) {
    this.update(event);
  }, this));
};

app.controllers.usersController.prototype.create = function() {
  $('#user-form').children().remove();
  $.ajax({
    url: '/users/new',
    method: 'GET'
  }).success(function(data) {
    $('#user-form').append(data);
    //var prescriptionsFormValidator = new app.services.prescriptionsFormValidator();
    //prescriptionsFormValidator.init(data);
    $('#user-form-submit').click(function(event) {
      event.preventDefault();
      $('#user-modal').modal('hide');
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
  $('#user-form').children().remove();
  var userId = parseInt($('.user-id').attr('id'));
  $.ajax({
    url: '/users/' + userId + '/edit',
    method: 'GET'
  }).success(function(data) {
    $('#user-form').append(data);
    $(document).on('click', '#user-form-submit', function(event) {
      event.preventDefault();
      $('#user-modal').modal('hide');
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