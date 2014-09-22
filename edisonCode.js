var Firebase = require("firebase");
var Cylon = require('cylon');
var a;
var ctemperature;
var ftemperature;
var B=3975;
var resistance;

var dd = new Date();
var y = dd.getFullYear();
var m = dd.getMonth()+1;
var d = dd.getDate();
var h = dd.getHours();
var minute = dd.getMinutes()
var time;
var temp0 = "0";

var ref = new Firebase("https://popping-torch-9411.firebaseio.com");
ref.child("temp").update({
        y: {
                m: {
                        d: {
                                h:{}
                        }                                                
                }                                                        
        }                                                                
});                                                                      
var john = ref.child("temp").child(y).child(m).child(d).child(h);        
var postsRef = new Firebase("https://popping-torch-9411.firebaseio.com");
var alarm_time;                                                          
var target_temp;                                                         
var change;                                                              
var angle = 0;                                                           
                                                                         
Cylon.robot({                                                            
  connection: { name: 'edison', adaptor: 'intel-iot' },
  devices: [                                                        
    { name: 'sensor', driver: 'analogSensor', pin: 0},              
    { name: 'pin0', driver: 'direct-pin', pin: 0},                  
    { name: 'pin1', driver: 'direct-pin', pin: 1},                  
    { name: 'pin2', driver: 'direct-pin', pin: 2},                  
    { name: 'pin3', driver: 'direct-pin', pin: 3},     
    { name: 'pin4', driver: 'direct-pin', pin: 4},    
    { name: 'pin5', driver: 'direct-pin', pin: 5},    
    { name: 'pin6', driver: 'direct-pin', pin: 6},
  ], 
    work: function(my) {                                                   
    my.pin6.digitalWrite(0);                                             
    my.pin5.digitalWrite(0);                                             
    my.pin4.digitalWrite(0);                                             
    my.pin3.digitalWrite(0);                                             
    my.pin2.digitalWrite(0);                                             
    my.pin1.digitalWrite(0);                                             
    my.pin0.digitalWrite(0);                                             
                                                                         
    every((6).second(), function() {                                     
       //read temp                                                       
        a = my.sensor.analogRead();                                      
        resistance=(1023-a)*10000/a;                                  
        resistance=(1023-a)*10000/a;                                  
        ctemperature=1/(Math.log(resistance/10000)/B+1/298.15)-273.15;
        ftemperature = ctemperature*9.0/5.0+32;                       
        ftemperature = ftemperature.toFixed(0);                       
                                                                      
        //get time                                                    
        dd = new Date();                                              
        minute  = dd.getMinutes();                                    
        if (m < 10) {                                                 
                var m2 = temp0.concat(m.toString());
        }                                                                
        if (h < 10) {                                                    
                var h2 = temp0.concat(h.toString());                     
        }                                                                
        if (minute < 10) {                                               
                var minute2 = temp0.concat(minute.toString());           
        }                                                                
                                                                         
        //push time and temp to firebase                                 
        time = y.toString().concat("/", m2,                              
                 "/", d.toString(), " ", h2, ":", minute.toString());    
        john.push({                                                      
                "Current Time" : time,                                
                "Temperature" : ftemperature                          
        });                                                           
                                                                      
        //push every minute                                           
        console.log("Minute: %d", minute);                            
        console.log("Temperature: %d", ftemperature);                 
        //update time                                                 
        if (h != dd.getHours()) {                                     
                h = dd.getHours();                                    
                if (d != dd.getDate()) {                 
                        d = dd.getDate();                                
                        if (m != (dd.getMonth()+1)) {                    
                                m = dd.getMonth();                       
                        }                                                
                }                                                        
                ref.child("temp").update({                               
                         y: {                                            
                         m: {                                            
                         d: {                                            
                                h:{}                                     
                         }                                               
                         }                                               
                         }                                            
                });                                                   
                john = ref.child("temp").child(y).child(m).child(d).child(h);
        }                                                                    
                                                                             
        //read wanted time and temp from firebase                            
        postsRef.on('value', function (snapshot) {                           
                alarm_time = snapshot.val().alarm_time;                      
                target_temp = snapshot.val().target_temp;                    
                //console.log(alarm_time);                                   
                console.log("Target temp: " + target_temp +   
                                ".  Alarm time: " + alarm_time);             
                console.log("angle: " + angle);                              
        }, function (errorObject) {                                          
                console.log('The read failed: ' + errorObject.code);         
        });                                                                  
                                                                             
        //adjust temp                                                        
        change = parseInt(target_temp) - ftemperature;                       
        if (change > 10) {                                                   
                angle+=5;                                                    
        } else if (change > 0) {                                             
                angle++;                                                     
        } else if (change < -10) {                                           
                angle -=5;                                                   
        } else if (change < 0) {                                             
                angle--;                                                     
        }                                                                    
        change *= 5;                                                         
        if (angle <=  0) {angle = 0;}                                        
        else if (angle > 180) {angle = 180;}                                 
        my.pin6.digitalWrite(angle >> 7);                                    
        my.pin5.digitalWrite((angle >> 6) & 0x1);                            
        my.pin4.digitalWrite((angle >> 5) & 0x1);                            
        my.pin3.digitalWrite((angle >> 4) & 0x1);                            
        my.pin2.digitalWrite((angle >> 3) & 0x1);                            
        my.pin1.digitalWrite((angle >> 2) & 0x1);                            
        my.pin0.digitalWrite((angle >> 1) & 0x1);                            
    });                                                                      
  }                                                                          
}).start();             
