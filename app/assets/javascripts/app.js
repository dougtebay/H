app = {
  controllers: {},
  services: {}
};
$(function() {
  var sessionsController = new app.controllers.sessionsController();
  sessionsController.init();
  var drugsController = new app.drugs.controller.new();
  drugsController.init();
  var prescriptionsController = new app.controllers.prescriptionsController();
  prescriptionsController.init();
  var usersController = new app.controllers.usersController();
  usersController.init();
  var refillsController = new app.controllers.refillsController();
  refillsController.init();

  (function showTimeIndicator() {
    var today = new Date();
    var hour = today.getHours();
// erik move
  //   if (hour >= 5 && hour < 12) {
  //     $('#morning-time').text('\u25b2');
  //   } else if (hour >= 12 && hour < 17) {
  //     $('#afternoon-time').text('\u25b2');
  //   } else if (hour >= 17 && hour < 21) {
  //     $('#evening-time').text('\u25b2');
  //   } else if (hour >= 21 || hour < 5) {
  //     $('#night-time').text('\u25b2');
  //   }
  }());
});