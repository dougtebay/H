app.controllers.usersController = function UsersController() {};

app.controllers.usersController.prototype.init = function() {
  this.attachListeners();
};

app.controllers.usersController.prototype.attachListeners = function() {
  $(document).on('click', '#editProfileButton', $.proxy(function(event) {
    this.update(event);
  }, this));
};

app.controllers.usersController.prototype.update = function() {
  $('#userForm').children().remove();
  var userId = parseInt($('.user-id').attr('id'));
  $.ajax({
    url: '/users/' + userId + '/edit',
    method: 'GET'
  }).success(function(data) {
    $('#userForm').append(data);
    $(document).on('click', '#user-form-submit', function(event) {
      event.preventDefault();
      $('#userModal').modal('hide');
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