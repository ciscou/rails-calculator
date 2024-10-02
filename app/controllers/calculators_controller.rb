class CalculatorsController < ApplicationController
  def show
    @result = params[:result]
  end

  def update
    redirect_to calculator_url(result: calculate)
  end

  private

    def calculate
      Expressionist::Parser.new.parse(params[:expression]).to_f
    rescue
      "ERR"
    end
end
