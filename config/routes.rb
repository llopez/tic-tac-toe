Rails.application.routes.draw do
  get 'games/:token' => 'games#show', as: :game
  put 'games/:token' => 'games#update'
  post 'games' => 'games#create', as: :games
  get 'games/:token/play' => 'games#play', as: :play_game

  root to: 'home#index'
end
