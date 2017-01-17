package com.patrickwshaw.scoretracker.ejb;

import javax.ejb.Singleton;

import org.jboss.logging.Logger;

import com.patrickwshaw.scoretracker.model.GameEnum;
import com.patrickwshaw.scoretracker.model.GameScores;
import com.patrickwshaw.scoretracker.model.Player;

@Singleton
public class AgricolaSessionBean {
	private GameScores currentGameScores = new GameScores(GameEnum.AGRICOLA);
	
	Logger LOGGER = Logger.getLogger(AgricolaSessionBean.class);

	
	public void startGame() {
		//recreate the game scores
		LOGGER.info("Starting a new game!");
		currentGameScores = new GameScores(GameEnum.AGRICOLA);
	}
	
	public Player addPlayer(String playerName) {
		LOGGER.info("Adding a new player named: " + playerName);
		Player newPlayer = new Player(playerName);		
		currentGameScores.addPlayerToGame(newPlayer);
		
		return newPlayer;
	}
	
	public boolean updateScoreForPlayer(String id, int score ){ 
		LOGGER.info("Setting the score for player with id: " + id + " to " + score);
		return currentGameScores.updateScoreForPlayer(id, score);
	}
	
	public GameScores getCurrentScore() {
		return currentGameScores;
	}
	
	
}
