package com.patrickwshaw.scoretracker.model;

public class PlayerResult {
	private Player player;
	private Integer score;
	
	public PlayerResult(Player _player,Integer _score) {
		this.player = _player;
		this.score = _score;
	}

	public Player getPlayer() {
		return player;
	}

	public void setPlayer(Player player) {
		this.player = player;
	}

	public Integer getScore() {
		return score;
	}

	public void setScore(Integer score) {
		this.score = score;
	}
	
	
}
