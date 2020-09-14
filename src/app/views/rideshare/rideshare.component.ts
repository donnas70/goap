import { Component, OnInit, Inject, ViewChildren } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FireService } from '../../services/fire.service';
import { Router } from '@angular/router';
import { DataService } from "../../services/data.service";
import { Observable } from 'rxjs';
import * as firebase from 'firebase/app';
import { AngularFireAuth } from 'angularfire2/auth';
import dayGridPlugin from '@fullcalendar/daygrid';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'rideshare',
  templateUrl: './rideshare.component.html',
  styleUrls: ['./rideshare.component.css']
  /* styleUrls: ['../events/events.component.css'] */
})
export class RideShareComponent implements OnInit {
  
  calendarPlugins = [dayGridPlugin]; // important!
  calendarRides:any[] = [];
  user: Observable<firebase.User>;
  uid;
  isverified;
  userobj:any;  
  username = "";
  rides;
  monthlist = [];
  currRide = 1;
  filterObj = { rideType: [], county: [], speed: [], milesMin: 0, milesMax: 0, dateMin: "", dateMax: "" }

  constructor(afAuth: AngularFireAuth, private authSvc: AuthService, private router: Router, private fireSvc: FireService, public dataSvc: DataService, public dialog: MatDialog ){
    this.user = afAuth.authState;    
  }

  ngOnInit() {
    this.dataSvc.notifyOther({ option: 'updatemenu', menuval: 3 });
    this.user.subscribe(user=>{
      if (user==null || user==undefined)
        this.router.navigateByUrl('login');
      else
      {
        this.uid = user.uid;   
        this.isverified = user.emailVerified;
        this.userobj = this.fireSvc.getUser(this.uid);
        this.userobj.subscribe((usr) => {this.username = usr.name});
      }
    });
    
    this.createMonthList();
    this.getRides();
  }


  createMonthList()
  {
    let d = new Date();
    let monthnum = d.getMonth() + 1;
    let year =  d.getFullYear();
    for(let i = 0; i < 12; i++)
    {     
      if ((monthnum + i)>12)  
      {
        this.monthlist.push( { monthnum: monthnum + i - 12, year:  year + 1, monthval: this.getmonthval( monthnum + i - 12), rides: [] })
      }
      else{
        this.monthlist.push({ monthnum: monthnum + i, year: year, monthval: this.getmonthval(monthnum + i), rides: [] });
      }
    }
  }

  getmonthval(num)
  {
    switch(num)
    {
      case 1: 
      {
        return "January";
        break;
      }
      case 2: 
      {
        return "February";
        break;
      }
      case 3: 
      {
        return "March";
        break;
      }
      case 4: 
      {
        return "April";
        break;
      }
      case 5: 
      {
        return "May";
        break;
      }
      case 6: 
      {
        return "June";
        break;
      }
      case 7: 
      {
        return "July";
        break;
      }
      case 8: 
      {
        return "August";
        break;
      }
      case 9: 
      {
        return "September";
        break;
      }
      case 10: 
      {
        return "October";
        break;
      }
      case 11: 
      {
        return "November";
        break;
      }
      case 12: 
      {
        return "December";
        break;
      }

    }
  }

  getRides(){
    this.rides = this.fireSvc.getUserRideData();
    this.rides.subscribe(data=> { 
      this.calendarRides=data;
      data.forEach(ride => {
        for (let i = 0; i < 12; i++)
        {
          if (ride.month_num == this.monthlist[i].monthnum && ride.year == this.monthlist[i].year)
          {
            if (this.getFilterResults(ride))
            {
              this.monthlist[i].rides.push({ id: ride.id, title: ride.title, description: ride.description, date: ride.display_date, 
                location: ride.location, county: ride.county + (ride.county != null && ride.county.length > 0 ? ' County' : ''), 
                speed: this.getSpeedText(ride.speed), miles: ride.miles + (ride.miles != null && ride.miles.toString().length > 0 ? ' mile': ''), 
                ride_type: ride.ride_type})
            }
          }
        }
    });
  });     
  }


  getFilterResults(ride)
  {
    let tested = true;

    //test for only today or future rides
    /* let testdate = new Date(ride.date);
    let today = new Date();
    today.setDate(today.getDate() - 1); 
    if (testdate > today)
      tested = true;
    else
      tested = false; */

    //Test for ride type
    if (tested && this.filterObj.rideType.length > 0)
    {
        if (this.existsInList(this.filterObj.rideType, ride.ride_type))
          tested = true;
        else
          tested = false;
    }
  
    //Test for counties
    if (tested && this.filterObj.county.length > 0)
    {
      if (this.existsInList(this.filterObj.county, ride.county))
        tested = true;
      else
        tested = false;
    }

    //Test for speed
    if (tested && this.filterObj.speed.length > 0)
    {
      if (this.existsInList(this.filterObj.speed, ride.speed) )
        tested = true;
      else
        tested = false;
    }

    //Test for miles
    if (tested && this.filterObj.milesMax > 0)
    {
      if (ride.miles >= this.filterObj.milesMin && ride.miles <=this.filterObj.milesMax)
        tested = true;
      else
        tested = false;
    }

    //Test for date
    if (tested && this.filterObj.dateMax != "")
    {
      let testdate = new Date(ride.date);
      let min = new Date(this.filterObj.dateMin);
      min.setDate(min.getDate() - 1); 
      let max = new Date (this.filterObj.dateMax);
      max.setDate(max.getDate() + 1); 
      if (testdate > min && testdate < max)
        tested = true;
      else
        tested = false;
    }

      return tested;

  }

  existsInList(compareList, val) {

    for (var i = 0; i < compareList.length; i++) {
        if (compareList[i] == val) {
            return true;
        }
    }
}

  getSpeedText(val)
  {
    switch(val)
    {
      case 'A':
      {
        return "A ride: Fast pace of 19 mph average or faster."
        break;
      }
      case 'B':
      {
        return "B ride: Intermeidate pace of 16-18 mph average."
        break;
      }
      case 'C':
      {
        return "C ride: Moderate pace of 12-14 mph average."
        break;
      }
      case 'D':
      {
        return "D ride: beginner pace of 10-11 mph average."
        break;
      }
      case 'E':
      {
        return "Casual ride: No specific speed, just getting together for fun."
        break;
      }
    }
  }

  logout()
  {
    this.authSvc.logout().then(() => {
      const status = 'offline';
      this.authSvc.setUserStatus(this.uid, status);  
      this.router.navigateByUrl('home')
    });
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(FilterDialogComponent, {
      width: '50em',
      data: this.filterObj
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result)
      {
      //  alert(result.county)
        this.filterObj = result;
        for (let i = 0; i < 12; i++)
        {
          this.monthlist[i].rides = [];
        }
        this.getRides(); 
      }
    });
  }

}

////////////////////////////////////////////////////////////////////////////////

@Component({
  selector: 'filter',
  templateUrl: './filter.html',
  styleUrls: ['./filter.css']
})
export class FilterDialogComponent implements OnInit {
  filterObj = { rideType: [], county: [], speed: [], milesMin: 0, milesMax: 0, dateMin: "", dateMax: "" }
  counties;
  filterCounties: any = [];
  rideTypes: any = [];
  speeds: any = [];
  minMiles = 0;
  maxMiles = 0;
  minDate = "";
  maxDate = "";
  isError = false;
  errMsg = "";
  success=false;
  constructor(private fireSvc: FireService, public dialogRef: MatDialogRef<FilterDialogComponent>){}

  ngOnInit()
  {
    this.isError = false;
    this.errMsg = "";
      this.counties = this.fireSvc.getCounties();
          this.counties.subscribe(data=> { 
            data.forEach(cnty => {
              this.filterCounties.push(cnty);
            });
          });
      
      this.rideTypes.push({name: "MTB Ride", selected: false});
      this.rideTypes.push({name: "Road Ride", selected: false});
      this.rideTypes.push({name: "Event Ride", selected: false});

      this.speeds.push({name: "A ride: Fast pace of 19 mph average or faster", val: "A", selected: false})
      this.speeds.push({name: "B ride: Intermeidate pace of 16-18 mph average", val: "B", selected: false})
      this.speeds.push({name: "C ride: Moderate pace of 12-14 mph average", val: "C", selected: false})
      this.speeds.push({name: "D ride: beginner pace of 10-11 mph average", val: "D", selected: false})
      this.speeds.push({name: "Casual ride: No specific speed, just getting together for fun", val: "E", selected: false})
  }


  onNoClick(): void {
    this.dialogRef.close();
    
  }

  onClose(): void {
      
      this.filterObj.rideType = [];
      for(let i = 0; i < this.rideTypes.length; i++)
      {
        if (this.rideTypes[i].selected)
          this.filterObj.rideType.push(this.rideTypes[i].name)
      }

      this.filterObj.county = [];
      for(let i = 0; i < this.filterCounties.length; i++)
      {
        if (this.filterCounties[i].selected)
          this.filterObj.county.push(this.filterCounties[i].name)
      }

      this.filterObj.speed = [];
      for(let i = 0; i < this.speeds.length; i++)
      {
        if (this.speeds[i].selected)
          this.filterObj.speed.push(this.speeds[i].val)
      }

      this.filterObj.milesMin = this.minMiles;
      this.filterObj.milesMax = this.maxMiles;

      this.filterObj.dateMin = this.minDate;
      this.filterObj.dateMax = this.maxDate;

      //validate miles
      if (!(this.minMiles == 0 && this.maxMiles == 0))
      {
        if (!this.IsNumericInteger(this.minMiles) || !this.IsNumericInteger(this.maxMiles))
        {
          this.isError = true;
          this.errMsg = "Please enter a valid number for miles before continuing."
          return;
        }

        if (this.maxMiles < this.minMiles)
          {
            this.isError = true;
            this.errMsg = "Please enter a max miles value that is equal to or greater than the min miles value."
            return;
          }
      }

      //validate dates
      if (!(this.minDate == "" && this.maxDate == ""))
      {
          if (this.minDate != "" && this.maxDate == "" || this.maxDate != "" && this.minDate == "")
          {
            this.isError = true;
            this.errMsg = "When filtering by date, please enter values for the entire range."
            return;
          }
          let min = new Date(this.minDate);
          let max = new Date (this.maxDate);
          if (!this.IsRealDate(this.minDate) || !this.IsRealDate(this.maxDate))
          {
            this.isError = true;
            this.errMsg = "Please enter a valid date before continuing."
            return;
          }

          
          if (max < min)
            {
              this.isError = true;
              this.errMsg = "Please enter a max date that is equal to or greater than the min date."
              return;
            }
      }
      //TODO: validations
      if (!this.isError)
      {
          this.success = true;
          this.dialogRef.close(this.filterObj);
      }
      
  }

  IsRealDate(input) {       
  
    let datePat = /^(\d{1,2})(\/|-)(\d{1,2})(\/|-)(\d{4})$/;  ///^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/ 
    let matchArray = input.match(datePat); // is the format ok?
   
    if (matchArray == null) {
      
        return false;
    }

    let month = matchArray[1]; // p@rse date into variables
    let day = matchArray[3];
    let year = matchArray[5];

    if (month < 1 || month > 12) { // check month range
        //   alert("Month must be between 1 and 12.");
        return false;
    }

    if (day < 1 || day > 31) {
        //   alert("Day must be between 1 and 31.");
        return false;
    }

    if ((month == 4 || month == 6 || month == 9 || month == 11) && day == 31) {
        //  alert("That Month doesn`t have 31 days!")
        return false;
    }

    if (month == 2) { // check for february 29th
        var isleap = (year % 4 == 0 && (year % 100 != 0 || year % 400 == 0));
        if (day > 29 || (day == 29 && !isleap)) {
            //      alert("February " + year + " doesn`t have " + day + " days!");
            return false;
        }
    }
    return true; // date is valid
}

IsNumericInteger(input) {
  var RE = /^-{0,1}\d*\d+$/;
  return (RE.test(input));
}

  clearErrors()
  {
    this.isError = false;
    this.errMsg = "";
  }
}
