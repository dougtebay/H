class SessionsController < ApplicationController
  skip_before_action :authorized?

  def create
    @user = User.find_by_email(params[:email])
    if @user && @user.authenticate(params[:password])
      session[:user_id] = @user.id
      render :partial => "/users/sign_in", :locals => { :user => @user }
    else
      render 'new'
    end
  end

  def destroy
    session[:user_id] = nil
    @user = User.new
    render :partial => "/users/sign_out", :locals => { :user => @user }
  end
end
