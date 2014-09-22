#include <Servo.h> 
 
Servo myservo;  // create servo object to control a servo 
                // a maximum of eight servo objects can be created 
 
int pos = 0;    // variable to store the servo position 
int pin0 = 0;
int pin1 = 1;
int pin2 = 2;
int pin3 = 3;
int pin4 = 4;
int pin5 = 5;
int pin6 = 6;

void setup() 
{ 
  myservo.attach(9);  // attaches the servo on pin 9 to the servo object 
  for(int i = 0; i < 7; i++) {
    pinMode(i, INPUT);
  }
} 
 
 
void loop() 
{ 
  // tell servo to go to position
  myservo.write(pos);
  //calculate the angle
  pos = (digitalRead(pin6) << 7) + (digitalRead(pin5) << 6) + (digitalRead(pin4) << 5) + (digitalRead(pin3) << 4) + (digitalRead(pin2) << 3) + (digitalRead(pin1) << 2) + (digitalRead(pin0) << 1);
}
