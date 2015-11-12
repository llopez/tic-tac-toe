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
    self.token1 = SecureRandom.hex(4)
    self.token2 = SecureRandom.hex(4)
    self.turn = self.token1
    self.status = 'playing'
  end

  def reset!
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
    self.turn = self.token1
    save
  end

  def board=(hash)
    super(board.merge(hash))
  end
end

