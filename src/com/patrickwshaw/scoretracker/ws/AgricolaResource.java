package com.patrickwshaw.scoretracker.ws;

import javax.inject.Inject;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import org.jboss.logging.Logger;

import com.patrickwshaw.scoretracker.ejb.AgricolaSessionBean;

@Path("/agricola")
public class AgricolaResource {

	@Inject
	private AgricolaSessionBean sessionBean;
	
	Logger LOGGER = Logger.getLogger(AgricolaResource.class);
	
	@GET
	@Path("/hello")
	@Produces(MediaType.TEXT_PLAIN)
	public Response sayHello() {
		LOGGER.info("Saying hello!");

		return Response.ok("Hello World").build();
		
		
	}
	
	@GET
	@Path("/begin") 
	public Response startGame(){
		sessionBean.startGame();
		
		return Response.ok().build();
	}
	
	@GET
	@Path("currentScores")
	@Produces(MediaType.APPLICATION_JSON)
	public Response currentScores() {
		return Response.ok(sessionBean.getCurrentScore()).build();
	}
	
	@PUT
	@Path("/addPlayer")
	public Response addUser(@QueryParam("player") String playerName) {
		sessionBean.addPlayer(playerName);
		return Response.ok().build();
	}
	
	@POST
	@Path("/setScore")
	public Response setScore(@QueryParam("player") String playerName, @QueryParam("score") int score) {
		if (sessionBean.updateScoreForPlayer(playerName, score)) {
			return Response.ok("Score Updated!").build();
		}
		else {
			return Response.status(Status.BAD_REQUEST).entity("No match found for player: " + playerName).build();
		}
	}
	
	@POST
	@Path("/saveSession")
	public Response saveSession() {
		LOGGER.debug("Saving Session (Not Really) ;)");
		
		return Response.ok().build();
	}
}
