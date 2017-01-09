package com.patrickwshaw.scoretracker.ws;

import java.util.HashSet;
import java.util.Set;

import javax.ws.rs.ApplicationPath;
import javax.ws.rs.core.Application;

@ApplicationPath("/")
public class ScoreTrackerApplication extends Application{

	@Override
	public Set<Class<?>> getClasses() {
		Set<Class<?>> returnSet = new HashSet<>();
		
		returnSet.add(AgricolaResource.class);
		
		return returnSet;
	}
}
