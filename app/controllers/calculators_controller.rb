class CalculatorsController < ApplicationController
  def show
    @result = params[:result]
  end

  def update
    redirect_to calculator_url(result: calculate)
  end

  private

    def calculate
      eval params[:expression]
    rescue
      "ERR"
    end
end
