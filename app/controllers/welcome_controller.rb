class WelcomeController < ApplicationController
  skip_before_action :authorized?

  def index
    if current_user
      @user = current_user
    else
      @user = User.new
    end
  end
end