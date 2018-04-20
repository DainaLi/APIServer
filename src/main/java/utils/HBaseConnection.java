package utils;

import java.io.*;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Scanner;

import org.apache.hadoop.conf.Configuration;
import org.apache.hadoop.hbase.HBaseConfiguration;
import org.apache.hadoop.hbase.TableName;
import org.apache.hadoop.hbase.client.*;
import org.apache.hadoop.hbase.util.Bytes;

public class HBaseConnection {

    private static final byte[] OUTLET_COLUMN_FAMILY_NAME = Bytes.toBytes("OutletDetails");
    private static final byte[] OUTLET_COLUMN_NAME = Bytes.toBytes("Outlet Name");

    public static void main(String[] args) throws IOException {
        connectHBase(readCSV());
        //readCSV();
    }

    public static void connectHBase(List<List<String>> lines) throws IOException{

            Configuration config = HBaseConfiguration.create();
           // config.set("hbase.zookeeper.quorum", "192.168.1.235");
            config.set("hbase.zookeeper.quorum", "10.73.14.154");
            config.set("hbase.zookeeper.property.clientPort", "2181");

            Connection connection = ConnectionFactory.createConnection(config);

            try {
                Table table = connection.getTable(TableName.valueOf("GloryStoreBigSales"));
                Admin admin = connection.getAdmin();
               /* HTable table = new HTable(config, "STable2");

                Get g = new Get(Bytes.toBytes(1));
                Result result = table.get(g);
                byte [] value = result.getValue(Bytes.toBytes("OutletDetails"),Bytes.toBytes("Outlet Name"));
                String name = Bytes.toString(value);
                System.out.print(name);*/
                try {
                    //List<Put> puts = new ArrayList<Put>();
                    int row_num = lines.size();

                    for(int i = 0; i < row_num; i++){
                        Put putObj = new Put(Bytes.toBytes((i+2)));
                        List<String> line = lines.get(i);

                        System.out.println(line.get(0));
                        System.out.println(line.get(1));
                        System.out.println(line.get(2));

                        putObj.addColumn(OUTLET_COLUMN_FAMILY_NAME, OUTLET_COLUMN_NAME, Bytes.toBytes("teststst"));
//                        table.put(putObj);
                        //putObj.add(Bytes.toBytes("POSSales"), Bytes.toBytes("Total Net Sales"), Bytes.toBytes(line.get(1).toString()));
//                        table.put(putObj);
                       // putObj.add(Bytes.toBytes("POSSales"), Bytes.toBytes("Date Record"), Bytes.toBytes(line.get(2)));
                        System.out.println("004");
                            table.put(putObj);
                        System.out.println("005");
                            i++;
                        }
                //table.put(puts);

           } catch(Exception e){
                    e.printStackTrace();
                }finally {
                if (table != null) {
                    table.close();
                    admin.flush(table.getName());
                }
            }
        } finally { connection.close(); }
    }

    public static List<List<String>> readCSV () throws IOException{
        List<List<String>> lines = new ArrayList<>();

        try{
            BufferedReader reader = Files.newBufferedReader(Paths.get("C:\\Users\\Daina\\IdeaProjects\\APIServer\\src\\main\\resources\\demodata.csv"));

            String line;
            while((line = reader.readLine()) != null ){
                String[] row = line.split(",");
                lines.add(Arrays.asList(row));
            }

        }catch(FileNotFoundException e){
            e.printStackTrace();
        }

       /* for(List<String> line: lines){

               System.out.println("Line "+ line.get(0)+" "+line.get(1)+" "+line.get(2));
                //System.out.println(line);
        }*/

        return lines;
    }
}