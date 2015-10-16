class GamesController < ApplicationController
  def show
    @game = Game.where("token1 = ? OR token2 = ?", params[:token], params[:token]).take
    respond_to do |format|
      format.html
      format.json{
        render json: @game
      }
    end
  end

  def update
    @game = Game.find params[:id]
    @game.update_attributes(game_params)

    Pusher.url = "https://68c5c3481ddbd8d2912d:dcf7c76e4e00987c1052@api.pusherapp.com/apps/144791"

    Pusher.trigger('board', 'change', {
      message: game_params
    })

    respond_to do |format|
      format.json{
        render json: @game 
      }
    end
  end

private
  def game_params
    params.require(:game).permit(board: ['11', '12', '13', '21', '22', '23', '31', '32', '33'])
  end
end

