app.services.prescriptionsFormAnimator = function PrescriptionsFormAnimator() {};

app.services.prescriptionsFormAnimator.prototype.init = function() {
  this.showOptions('#doctor_type_new');
  this.hideOptions('#doctor_type_existing');
  this.showOptions('#pharmacy_type_new');
  this.hideOptions('#pharmacy_type_existing');
};

app.services.prescriptionsFormAnimator.prototype.showOptions = function(elementId) {
  $(document).on('click', elementId, function() {
    $(this).parent().next().show(200);
  });
};

app.services.prescriptionsFormAnimator.prototype.hideOptions = function(elementId) {
  $(document).on('click', elementId, function() {
    $(this).parent().next().next().hide(200);
  });
};