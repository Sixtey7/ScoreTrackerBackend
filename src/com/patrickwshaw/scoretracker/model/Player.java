package com.patrickwshaw.scoretracker.model;

import java.util.UUID;

import javax.xml.bind.annotation.XmlRootElement;

@XmlRootElement
public class Player {
	private String id;
	private String name;
	
	public Player(String _name) {
		//TODO: This is a pretty bad hack, since I'm just taking half of my GUID
		//eventually this might come from hibernate or the db
		this.id = Long.toString(UUID.randomUUID().getMostSignificantBits());
		this.name = _name;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}
	
	public String getId() {
		return id;
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
