require 'test_helper'

class BoardTest < ActiveSupport::TestCase
  test "move" do
    game = games(:pending)

    Board.move(game, 'a1', '22')
     
    assert_equal({
      "11"=>nil, 
      "12"=>nil, 
      "13"=>nil, 
      "21"=>nil, 
      "22"=>"a1", 
      "23"=>nil, 
      "31"=>nil, 
      "32"=>nil, 
      "33"=>nil}, game.board)

    assert_equal('a1', game.turn)
  end
end
