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
		LOGGER.debug("Starting a new game!");
		currentGameScores = new GameScores(GameEnum.AGRICOLA);
	}
	
	public void addPlayer(String playerName) {
		LOGGER.debug("Adding a new player named: " + playerName);
		Player newPlayer = new Player(playerName);		
		currentGameScores.addPlayerToGame(newPlayer);
	}
	
	public boolean updateScoreForPlayer(String playerName, int score ){ 
		LOGGER.debug("Setting the score for player: " + playerName + " to " + score);
		return currentGameScores.updateScoreForPlayer(playerName, score);
	}
	
	public GameScores getCurrentScore() {
		return currentGameScores;
	}
	
	
}
