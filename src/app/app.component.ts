import { Component } from '@angular/core';
import { sentance } from './sentance';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { WitResponse } from './WitResponse';
import { answear } from './answear';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'DeliveryCompAwatar';
  conversation: sentance[];
  inputText:string;
  answers : answear[];

  constructor(private http: HttpClient) { }

  ngOnInit(){

    this.conversation =[]
    this.answers = [
      {intent: "greetings", content: "Hi! What can I do for you? Did you know that now we have a great promo? If you ship one package second one will be for FREE!", photo:"/assets/hello.gif"},
      {intent: "package_cost", content: "All shipping prices are available on our website. Prices are about 5$-50$. Please go to 'shipping' card to see more details.",photo:"/assets/know.gif"},
      {intent: "pickup_forget", content: "The package will be returned to the sender.",photo:"/assets/know.gif"},
      {intent: "pickup_time_bad", content: "The package will be forwarded to the nearest pick-up point and await pick-up there.",photo:"/assets/know.gif"},
      {intent: "pickup_time_ok", content: "Your package will be still wait for you in the parcel machine.",photo:"/assets/know.gif"},
      {intent: "parcelmachine_location", content: "You can check the location of the parcel machines on our map in the 'parcel machines' tab.",photo:"/assets/know.gif"},
      {intent: "package_location", content: "You can check the location of your shipment by entering the package number in the 'location' tab..",photo:"/assets/know.gif"},
      {intent: "farewell", content: "Thank you for choosing our company. Hope that you enjoyed shipping packages with us! We have for you special rabat-15% for the next shipping! Code: NEXTSHIPPING15",photo:"/assets/salut.gif"}
    ]
  }
  


  send(){
    this.conversation.push({isUser: true, content:this.inputText});
    let awatar = document.getElementById("awatar-pic");

    console.log(this.inputText);
    this.getResponse(this.inputText).subscribe( response=> {
      console.log(response);

      if(response.intents.length == 0){
        console.log("zle");
        this.conversation.push({isUser: false, content: "Sorry, but I do not understand...Please ask me again!"});
        awatar.setAttribute("src","/assets/notknow.gif");
        awatar.style.backgroundImage = "url('/assets/notknow.gif')";
      }
      else{
        let ans = this.answers.find(a => a.intent == response.intents[0].name);
        console.log(ans);
        console.log(response);
        if(ans === undefined && response.intents[0].name !== 'pickup_time'){
          this.conversation.push({isUser: false, content: "Sorry, but I do not understand...Please ask me again!"});
          awatar.setAttribute("src","/assets/notknow.gif");
          awatar.style.backgroundImage = "url('/assets/notknow.gif')";
        }
        else{
          
  
          if(response.intents[0].name === 'pickup_time'){
            let hours = response.entities["get_pickuptime:get_pickuptime"][0].body;
            var num = hours.replace(/[^0-9]/g,'');
            let hourNumber = parseInt(num);
  
              if(hourNumber >= 48 ){
                 ans = this.answers.find(a => a.intent == 'pickup_time_bad');
                 awatar.style.backgroundImage = "url('"+ ans.photo+"')";
              }
              else{
                 ans = this.answers.find(a => a.intent == "pickup_time_ok");
                 awatar.style.backgroundImage = "url('"+ ans.photo+"')";
              }
  
          }
          else{
            awatar.style.backgroundImage = "url('"+ ans.photo+"')";
          }
  
          this.conversation.push({isUser: false, content: ans.content});
        }
      }
  
      
    });

  }

  getResponse(userText: string) {
    return this.http.get<WitResponse>("https://api.wit.ai/message?v=20201129&q=" + userText, this.header);
  }

  header = {
    headers: new HttpHeaders()
      .set('Authorization',  "Bearer ISBIJWAVC7E7HYVF5JF4ZGK4OX4ZZGG4")
  }
  
}
