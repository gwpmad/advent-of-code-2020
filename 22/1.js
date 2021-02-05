const assert = require('assert');
const fs = require('fs');
const hands = fs.readFileSync(__dirname + '/input', 'utf8');

function findWinnersScore(input) {
  const gameState = getGameState(input);

  let finalWinner = null;
  while (!finalWinner) {
    const { winner, loser } = playRound(gameState);    
    if (!gameState[loser].length) finalWinner = winner;
  }

  return calculateScore(gameState[finalWinner]);
}

function getGameState(input) {
  return input
    .match(/[0-9]+(?!:)/g)
    .reduce((gameState, card, idx, cards) => {
      const deckToAddTo = gameState.player1.length === (cards.length / 2) ? gameState.player2 : gameState.player1;
      deckToAddTo.push(Number(card));
      return gameState;
    }, { player1: [], player2: [] })
}

function playRound(gameState) {
  const [winner, loser] = Object.keys(gameState)
    .sort((a, b) => gameState[b][0] - gameState[a][0]);
  
  const cards = [gameState[winner].shift(), gameState[loser].shift()];
  gameState[winner].push(...cards);

  return { winner, loser };
}

function calculateScore(winningDeck) {
  return winningDeck.reduce((sum, card, idx, cards) =>
    sum + (card * (cards.length - idx)), 0);
}

console.log(findWinnersScore(hands));