package com.patrickwshaw.scoretracker.model;

import java.util.ArrayList;
import java.util.List;

import javax.xml.bind.annotation.XmlElement;
import javax.xml.bind.annotation.XmlRootElement;
import javax.xml.bind.annotation.XmlSeeAlso;

import org.jboss.logging.Logger;

@XmlRootElement
@XmlSeeAlso(PlayerResult.class)
public class GameScores {

	@XmlElement(name = "playersResult")
	private List<PlayerResult> playersInvolved;
	
	private GameEnum gamePlayed;
	
	private Logger LOGGER = Logger.getLogger(GameScores.class);
	
	@SuppressWarnings("unused")
	private GameScores() {
		//no one should use this!
	}
	
	public GameScores(GameEnum _gamePlayed) {
		this.gamePlayed = _gamePlayed;
		this.playersInvolved = new ArrayList<>();
	}
	
	public void addPlayerToGame(Player playerToAdd) {
		PlayerResult playerResultToAdd = new PlayerResult(playerToAdd, null);
		this.playersInvolved.add(playerResultToAdd);
	}
	
	public void addPlayerToGame(Player playerToAdd, int score) {
		PlayerResult playerResultToAdd = new PlayerResult(playerToAdd, score);
		this.playersInvolved.add(playerResultToAdd);
	}
	
	public boolean updateScoreForPlayer(Player player, int score) {
		return updateScoreForPlayer(player.getName(), score);
	}
	
	public boolean updateScoreForPlayer(String playerName, int score) {
		boolean success = false;
		
		for (PlayerResult thisResult : this.playersInvolved) {
			if (thisResult.getPlayer().getName().equals(playerName)) {
				LOGGER.debug("Setting score for player: " + playerName + " to " + score);
				thisResult.setScore(score);
				success = true;
				break;
			}
		}
		
		return success;
	}
	
	public GameEnum getGamePlayed() {
		return gamePlayed;
	}

	public void setGamePlayed(GameEnum gamePlayed) {
		this.gamePlayed = gamePlayed;
	}

	public List<PlayerResult> getPlayersInvolved() {
		return playersInvolved;
	}
	
}
