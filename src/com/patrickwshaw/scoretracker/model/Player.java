package com.patrickwshaw.scoretracker.model;

public class Player {
	private String name;
	
	public Player(String _name) {
		this.name = _name;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}
	
	@Override
	public boolean equals(Object other) {
		if (other instanceof Player) {
			Player castOther = (Player) other;
			if (castOther.getName().equals(this.getName())) {
				return true;
			}
		}
		
		return false;
	}
	
	
}
