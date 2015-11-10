class Movement
  def initialize(game, token, params)
    @game = game
    @token = token
    @move = params[:cell]
    @board = game.board
  end

  def perform
    token = [@game.token1, @game.token2].find{|x| x != @token}
    
    @game.board = {@move => @token}
    @game.turn = token
    @game.save

    Pusher.trigger('board-' + token, 'change', {
      message: {board: {@move => @token}}
    })
  end

  def valid?
    turn_valid? and move_valid?
  end

  def turn_valid?
    @game.turn == @token
  end

  def move_valid?
    cell_blank?
  end

  def cell_blank?
    @board[@move].nil?
  end
end
