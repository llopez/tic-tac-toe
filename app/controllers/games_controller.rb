class GamesController < ApplicationController
  before_action :find_game, only: [:play, :show, :update]
  before_action :find_token, only: [:play, :update]

  def create
    @game = Game.create
    
    respond_to do |format|
      if @game.save
        format.html{ redirect_to game_path(@game.token1), notice: 'Game successfully created' }
      end
    end
  end

  def show
    respond_to do |format|
      format.html
      format.json{
        render json: @game
      }
    end
  end

  def play
    respond_to do |format|
      format.html
    end
  end

  def update
    move = Movement.new(@game, @token, game_params)

    respond_to do |format|
      if move.valid?
        move.perform
        format.json{ render json: @game, status: :ok }
      else
        format.json{ render json: @game, status: :bad_request }
      end
    end
  end

private
  def find_game
    @game ||= Game.where("token1 = ? OR token2 = ?", params[:token], params[:token]).take
  end
  def find_token
    @token = params[:token]
  end
  def game_params
    params.require(:game).permit(:cell)
  end
end

