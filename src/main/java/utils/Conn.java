package utils;
import java.sql.*;

public class Conn {

    //Class.forName("com.microsoft.sqlserver.jdbc.SQLServerDriver");

    private static String userName = "Daina";
    private static String password = "3305def@";
    private static String url = "jdbc:microsoft:sqlserver://ec2-13-229-212-138.ap-southeast-1.compute.amazonaws.com:1433"+";databaseName=BizCoachDataGloryStores";

    public Connection getCon() {
        try {
            try {
                con = DriverManager.getConnection(url, userName, password);
            } catch (SQLException e) {
                e.printStackTrace();
            }
            if(!con.isClosed())
                return con;
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return  null;
    }

    private Connection con;

    public  void close(){
        try {
            if(!con.isClosed()) {
                try {
                    con.close();
                } catch (SQLException e) {
                    e.printStackTrace();
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }
}
