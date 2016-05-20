class UsersController < ApplicationController
  skip_before_action :authorized?, only: [:create]

  def show
    @user = current_user
  end

  def edit
    @user = current_user
    render :partial => "/users/user_form", :locals => { :user => @user }
  end

  def create
    @user = User.new(user_params)
    if @user.save
      session[:user_id] = @user.id
      redirect_to user_path(@user), notice: "Thank you for signing up!"
    else
      redirect_to root_path
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