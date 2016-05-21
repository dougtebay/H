class SessionsController < ApplicationController
  skip_before_action :authorized?

  def create
    @user = User.find_by_email(params[:email])
    if @user && @user.authenticate(params[:password])
      session[:user_id] = @user.id
      render :partial => "/users/sign_in", :locals => { :user => @user }
    else
      render json: { error: 'The email or password you entered didn\'t match our records. Please try again.' }, :status => 400
    end
  end

  def destroy
    session[:user_id] = nil
    @user = User.new
    render :partial => "/users/sign_out", :locals => { :user => @user }
  end
end