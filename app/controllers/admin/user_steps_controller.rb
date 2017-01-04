class Admin::UserStepsController < AdminController
  include Wicked::Wizard
  include NavigationHelper

  steps *User.form_steps[:pages]
  attr_accessor :steps_names
  helper_method :disable_button?
  helper_method :active_button?

  before_action :set_current_user
  before_action :get_user_pages

  SAVE = 'Save Changes'.freeze
  CONTINUE = 'Continue'.freeze


  # This action cleans the session
  def new
    session[:user] = {}
    redirect_to admin_user_step_path(id: Wicked::FIRST_STEP)
  end

  # This action clean the session
  def edit
    session[:user] = {}
    redirect_to wizard_path(first_step)
  end

  def show
    render_wizard
  end

  def update

  end


  private
  def user_params
    params.require(:user).permit(:name, :email)
  end

  def set_current_user
    @user = params[:user_id] ? User.find_by(params[:user_id]) : User.new
    session[:user].merge!(user_params) if params[:user] && user_params.to_h
    @user.assign_attributes session[:user] if session[:user]
  end

  def get_user_pages
    self.steps_names = *User.form_steps[:names]
  end
end
