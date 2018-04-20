package com.impala.api;
import dao.OutletDao;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import java.util.ArrayList;
import java.util.List;

@Path("/outlet_going")
public class OutletGoingService {
    private static final String SUCCESS_RESULT="<result>success</result>";
    private static final String FAILURE_RESULT="<result>failure</result>";

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public List getOutlets() {
        List listOfOutlets = new ArrayList();
        OutletDao o_dao = new OutletDao();
        o_dao.getAllOutlets();

        return listOfOutlets;
    }
}
