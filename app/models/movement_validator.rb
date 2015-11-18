class MovementValidator
  def initialize(game, token, cell)
    @game = game
    @token = token
    @cell = cell
  end

  def self.valid?(game, token, cell)
    new(game, token, cell).valid?
  end
  
  def valid?
    valid_turn? and valid_cell?
  end

  def valid_turn?
    @game.turn == @token
  end

  def valid_cell?
    empty_cell?
  end

  def empty_cell?
    @game.board[@cell].nil?
  end
end
