class UsersController < ApplicationController
  skip_before_action :authorized?, only: [:new, :create]

  def show
    @user = current_user
    render :partial => "/users/show", :locals => { :user => @user }
  end

  def new
    @user = User.new
    render :partial => "/users/user_form", :locals => { :user => @user }
  end

  def edit
    @user = current_user
    render :partial => "/users/user_form", :locals => { :user => @user }
  end

  def create
    @user = User.new(user_params)
    if @user.save
      session[:user_id] = @user.id
      render :partial => "/users/sign_in", :locals => { :user => @user }
      # redirect_to user_path(@user)
    else
      # redirect_to root_path
    end
  end

  def update
    @user = current_user
    @user.update(user_params)
    @user.save
    render :partial => "/layouts/navbar"
  end

  private

  def user_params
    params.require(:user).permit(:first_name, :last_name, :email, :password, :password_confirmation)
  end
end