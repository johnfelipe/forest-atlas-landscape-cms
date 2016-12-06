class Management::DatasetStepsController < ManagementController
  include Wicked::Wizard
  include NavigationHelper

  before_action :set_site, only: [:new, :edit, :show, :update]


  steps *Dataset.form_steps[:pages]
  attr_accessor :steps_names
  helper_method :disable_button?
  helper_method :active_button?

  # This action clears the session
  def new
    session[:dataset] = {}
    redirect_to management_site_dataset_step_path site_slug: params[:site_slug], id: 'title'
  end

  # This action clears the session
  def edit
    session[:dataset] = {}
    redirect_to management_site_dataset_dataset_step_path site_slug: params[:site_slug],\
      dataset_id: params[:dataset_id], id: 'title'
  end

  # Wicked Wizard's Show
  def show
    case step
      when 'title'
      when 'connector'
      when 'context'
      when 'finish'
    end
  end

  # Wicked Wizard's Update
  def update
    case step
      when 'title'
      when 'connector'
      when 'context'
      when 'finish'
    end
  end

  private
  # Sets the current site from the url
  def set_site
    @site = Site.find_by({slug: params[:site_slug]})
  end
end
