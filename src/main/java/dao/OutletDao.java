package dao;

import model.Outlet;
import utils.Conn;

import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.List;

public class OutletDao {
    Conn conn = new Conn();
    Connection channel = conn.getCon();

    public List<String> getAllOutlets(){
        List<String> outletList = null;
        try{
            if( channel != null){
                String OUTLETS_QUERY = "SELECT DISTINCT [Outlet Name] from [Outlet Details] WHERE [Date Closed] is null;";
                Statement s1 = channel.createStatement();
                ResultSet rs = s1.executeQuery(OUTLETS_QUERY);
                if(rs!=null){
                    while (rs.next()){
                        System.out.println(rs.getRow());
                    }
                }
            }
        }catch(Exception ex){
            System.out.println(ex.getMessage());
        }
        return outletList;
    }
}
