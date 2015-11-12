class Movement
  def initialize(game, token, params)
    @game = game
    @token = token
    @move = params[:cell]
    @board = game.board
  end

  def perform
    token = [@game.token1, @game.token2].find{|x| x != @token}
   
    @symbol = if @token == @game.token1
      'X'
    else
      'O'
    end

    @game.board = {@move => @symbol}
    @game.turn = token
    @game.save

    Pusher.trigger('game', 'change', {
      message: {board: {@move => @symbol}}
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
