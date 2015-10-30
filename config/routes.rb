Rails.application.routes.draw do
  get 'games/:token' => 'games#show', as: :game
  put 'games/:token' => 'games#update'
end

