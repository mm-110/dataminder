# fizzbuzz
# Built with Seahorse v0.2.0
#
# On-chain, persistent FizzBuzz!

from seahorse.prelude import *

# This is your program's public key and it will update
# automatically when you build the project.
declare_id('2KrSppmn6JrNGynqTMGD5dz7WwU4LQdduBEyGpU5H1fT')



class Game(Account):
  state: i8
  nft_owner: Pubkey
  requester: Pubkey
  amount: u8
  password: u8

#   Winning states
class RequestState(Enum):
  Denied = -1
  Ready = 0
  Forwarded = 1
  Accepted = 2
  Rewarded = 3
  KeyShare = 4

@instruction
def init_contract(owner: Signer, nft_owner: Pubkey, requester: Pubkey, game: Empty[Game]):
  game = game.init(
    payer = owner,
    seeds = ['ttt', owner]
  )
  game.state = 0
  nft_owner = nft_owner
  requester = requester
  amount = 1
  print('Contract Init')

@instruction
def update_contract(signer: Signer, game: Game, update_by: Pubkey, update: i8):
  
  # requester invia la richiesta -> 0 a 1
  if update_by == game.requester and game.state == 0:
    print('Contract State: ', game.state, update_by)
    game.state = 1
  
  elif game.state == 1 and update_by == game.nft_owner:
    if update == -1 or update == 2:
      game.state = update
      print('Contract State: ', game.state, update_by)

  elif game.state == 2 and update_by == game.requester:
    signer.transfer(authority = signer,to = game.nft_owner,amount = game.amount)
    game.state = 3
    print('Contract State: ', game.state, update_by)

  elif game.state == 3 and update_by == game.nft_owner:
    password = update
    game.state = 4
    print('Contract State: ', game.state, update_by)

  elif game.state == -1:
    print('Contract State: ', game.state, update_by)