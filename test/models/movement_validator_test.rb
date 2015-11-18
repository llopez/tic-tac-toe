require 'test_helper'

class MovementValidatorTest < ActiveSupport::TestCase
  test "valid movement" do
    assert MovementValidator.valid?(games(:pending), 'a1', '11')
  end

  test "wrong turn" do
    assert_not MovementValidator.valid?(games(:pending), 'a2', '11')
  end

  test "invalid cell" do
    assert_not MovementValidator.valid?(games(:playing), 'a1', '11')
  end
end
