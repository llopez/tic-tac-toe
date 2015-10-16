class Game < ActiveRecord::Base
  has_many :players
  serialize :board, Hash

  before_create do
    self.board = {
      '11' => nil,
      '12' => nil,
      '13' => nil,
    
      '21' => nil,
      '22' => nil,
      '23' => nil,
    
      '31' => nil,
      '32' => nil,
      '33' => nil
    }
  end

  def board=(hash)
    super(board.merge(hash))
  end
end

