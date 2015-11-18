class Board
  def initialize(game, token, cell)
    @game = game
    @token = token
    @cell = cell
  end

  def self.move(game, token, cell)
    board = new(game, token, cell)
    board.save
    board.transmit  
  end

  def save
    @game.board = {@cell => @token}
    @game.turn = @token
    @game.save
  end

  def transmit
    Pusher.trigger('game', 'change', {
      message: {board: { @cell => @token }}
    })
  end
end
