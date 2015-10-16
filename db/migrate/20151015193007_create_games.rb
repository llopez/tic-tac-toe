class CreateGames < ActiveRecord::Migration
  def change
    create_table :games do |t|
      t.text :board
      t.string :token1
      t.string :token2

      t.timestamps null: false
    end
  end
end

