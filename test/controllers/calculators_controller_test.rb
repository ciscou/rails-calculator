require "test_helper"

class CalculatorsControllerTest < ActionDispatch::IntegrationTest
  test "should get show" do
    get calculators_show_url
    assert_response :success
  end
end
