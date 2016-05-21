class EmailsController < ApplicationController
  skip_before_action :authorized?

  def create
    if current_user && current_user.email == params[:email]
      render json: { validity: 'true' }
    else
      email_validity = User.email_unique?(params[:email])
      render json: { validity: email_validity }
    end
  end
end