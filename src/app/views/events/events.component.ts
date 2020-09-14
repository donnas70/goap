import { Component, OnInit, Inject, ViewChildren } from '@angular/core';
import { DataService } from "../../services/data.service";
import { FireService } from "../../services/fire.service";
import dayGridPlugin from '@fullcalendar/daygrid';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';


@Component({
  selector: 'events',  
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
export class EventsComponent implements OnInit {
  @ViewChildren('para') paras: any;
  @ViewChildren('para2') paras2: any;
  paraElements: any;
  paraElements2: any;

  calendarPlugins = [dayGridPlugin]; // important!
  calendarEvents:any[] = [];
  events; 
  upcomingList = [];
  eventsList = [];
  eventsList2 = [];
  highlightEvent = "";
  eventInfo = {eventName: "", url: "", eventDate: "", location: "", description: ""}

  constructor(private firesvc: FireService, public dataSvc: DataService, public dialog: MatDialog){
  }

  ngOnInit()
  {      
    this.dataSvc.notifyOther({ option: 'updatemenu', menuval: 2 }); 

    let d = new Date();
    let thisMonth = d.getMonth() + 1;
   
    this.events = this.firesvc.getEventData();    
     
     this.events.subscribe(events => {
         events.forEach(events => {
          if (events.month_num >= thisMonth && events.month_num <= 12)
            this.eventsList.push({ title: events.title, name: events.name, month: events.month, location: events.location, date_display: events.date_display, description: events.description, url: events.url_display});
          if (events.month_num < thisMonth)
            this.eventsList2.push({ title: events.title, name: events.name, month: events.month, location: events.location, date_display: events.date_display, description: events.description, url: events.url_display});                               
        
          if (events.upcoming==true)
              this.upcomingList.push({ title: events.title, name: events.name, month: events.month, location: events.location, date_display: events.date_display, description: events.description, url: events.url_display});                               
         }
       );
    });
 
    this.firesvc.getCalendarData()
      .subscribe(data=> { this.calendarEvents=data; })
      
  }

  handleEventClickLarge(info)
  {
    for (let i = 0; i < this.upcomingList.length; i++)
    {
      if (this.upcomingList[i].title == info.event.title)
      {
        this.paraElements = this.paras.map(para => {
          return para.nativeElement;
        })
        this.paraElements[i].focus();
        return;
      }
    }
  }

  handleEventClickSmall(info)
  {
    for (let i = 0; i < this.upcomingList.length; i++)
    {
      if (this.upcomingList[i].title == info.event.title)
      {
        this.paraElements2 = this.paras2.map(para2 => {
          return para2.nativeElement;
        })
        this.paraElements2[i].focus();
        return;
      }
    }
  }


  openDialog(): void {
    const dialogRef = this.dialog.open(SuggestEventDialogComponent, {
      width: '50em',
      data: this.eventInfo
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result)
      {
        this.firesvc.sendEventEmail(result)
          .subscribe( data=> {} ) 
      }
    });
  }

  
}

////////////////////////////////////////////////////////////////////////////////

export interface DialogData {
  eventName: string;
  url: string;
  description: string;
  eventDate: string;
  location: string;
}

@Component({
  selector: 'suggest_event',
  templateUrl: './suggest_event.html',
  styleUrls: ['./suggest_event.css']
})
export class SuggestEventDialogComponent {
  success=false
  constructor(
    public dialogRef: MatDialogRef<SuggestEventDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ){}


  onNoClick(): void {
    this.dialogRef.close();
    
  }

  onClose(): void {
    if (this.data != null && this.data.url.length > 0)
    {
      this.success = true;
      setTimeout(() => {
        this.dialogRef.close(this.data);
      }, 2000);
      
    }
    else
    {
      alert("Please enter a URL (website) for the event.")
    }
  }
  

}
