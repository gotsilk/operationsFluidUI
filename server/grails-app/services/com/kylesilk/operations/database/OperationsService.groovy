package com.kylesilk.operations.database

import com.kylesilk.operations.property.PropertyService
import groovy.json.JsonSlurper

import javax.net.ssl.HttpsURLConnection
import javax.net.ssl.SSLContext
import java.security.SecureRandom
import java.text.SimpleDateFormat


class OperationsService {

    PropertyService propertyService
    static JsonSlurper jsonSlurper = new JsonSlurper()
    SuperuserService superuserService


    Object getClientSideProps(){
        String props = propertyService.getClientSidePropertiesAsJson()
        if (props){
            return jsonSlurper.parseText(props)
        }
        return null
    }

    String logSlack(String message) {
        String slackUrl = propertyService.getString("slackUrl");

        if(slackUrl == null) {
            return message;
        }

        try {
            SSLContext ssl = SSLContext.getInstance("TLSv1.2");
            ssl.init(null, null, new SecureRandom());
            URL url = new URL(slackUrl);
            HttpsURLConnection connection = (HttpsURLConnection)url.openConnection();
            connection.setSSLSocketFactory(ssl.getSocketFactory())
            connection.setRequestMethod("POST");
            connection.setRequestProperty("Content-Type", "text/json");
            connection.setRequestProperty("charset", "utf-8");
            connection.setDoOutput(true);
            String realzMsg = "USER: ${superuserService.getCurrentUser()} -- TIMESTAMP: ${getTimeStamp()}\n$message"
            String postData = "{\"text\":\"$realzMsg\"}";
            connection.setRequestProperty("Content-Length", Integer.toString(postData.getBytes().length));
            connection.setUseCaches(false);
            OutputStreamWriter outputStreamWriter = new OutputStreamWriter(connection.getOutputStream());
            outputStreamWriter.write(postData);
            outputStreamWriter.flush();

            BufferedReader inn = new BufferedReader(new InputStreamReader(connection.getInputStream()));
            String inputLine;
            while ((inputLine = inn.readLine()) != null)
                System.out.println(inputLine);
            inn.close();
        }
        catch (Exception e) {
            log.error(e.getMessage(), e);
        }

        return message;
    }

   String getTimeStamp(){
        SimpleDateFormat formatter= new SimpleDateFormat("yyyy-MM-dd 'at' HH:mm:ss z");
        Date now = new Date(System.currentTimeMillis())
        return formatter.format(now)
    }
}
