class RefillsController < ApplicationController
  skip_before_action :authorized?

  def update
    @prescription = Prescription.find(params[:id])
    @prescription.refill
    @user = current_user
    render :partial => "/users/show", :locals => { user: @user, prescription: @prescription }
  end
end