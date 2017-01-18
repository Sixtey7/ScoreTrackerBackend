package com.patrickwshaw.scoretracker.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;

@Entity(name = "testtable")
public class testtable {

	@Column(name="id")
	@Id
	private int id;
	
	@Column(name="teststring")
	private String testString;

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getTestString() {
		return testString;
	}

	public void setTestString(String testString) {
		this.testString = testString;
	}

	
}
