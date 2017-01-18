package com.patrickwshaw.scoretracker.ws;

import java.util.Collection;
import java.util.List;

import javax.inject.Inject;
import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.Persistence;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import org.jboss.logging.Logger;

import com.patrickwshaw.scoretracker.ejb.AgricolaSessionBean;
import com.patrickwshaw.scoretracker.model.Player;
import com.patrickwshaw.scoretracker.model.testtable;

@Path("/agricola")
public class AgricolaResource {

	//@PersistenceContext(name="PostgresDS", unitName="PostgresDS") // default type is PersistenceContextType.TRANSACTION
	//EntityManager entMan; 

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
	
	@PUT
	@Path("/begin") 
	public Response startGame(){
		sessionBean.startGame();
		LOGGER.info("Starting a game!");
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
	@Produces(MediaType.APPLICATION_JSON)
	public Response addUser(@QueryParam("player") String playerName) {
		Player newPlayer = sessionBean.addPlayer(playerName);
		return Response.ok(newPlayer).build();
	}
	
	@POST
	@Path("/setScore")
	public Response setScore(@QueryParam("id") String id, @QueryParam("score") int score) {
		if (sessionBean.updateScoreForPlayer(id, score)) {
			return Response.ok("Score Updated!").build();
		}
		else {
			return Response.status(Status.BAD_REQUEST).entity("No match found for player id: " + id).build();
		}
	}
	
	@POST
	@Path("/saveSession")
	public Response saveSession() {
		LOGGER.debug("Saving Session (Not Really) ;)");
		
		return Response.ok().build();
	}
	
	@GET
	@Path("/testHibernate")
	public Response testHibernate() {
		EntityManagerFactory fact = Persistence.createEntityManagerFactory("org.patrickwshaw.scoretracker");
		
		EntityManager entMan = fact.createEntityManager();
		
	//	entMan.getTransaction().begin();
		
		Query thisQuery = entMan.createQuery("Select t FROM testtable t");
		
		
		Collection<testtable> result = thisQuery.getResultList();// entMan.createQuery( "from testtable", testtable.class ).getResultList();

		entMan.close();
		fact.close();
		
		String responseString = "";
		for (testtable thisItem : result) {
			responseString += thisItem.getId() + " --- " + thisItem.getTestString();
		}
		
		
		return Response.ok(responseString).build();
		
	}
}
