import { Component, OnInit, Inject } from '@angular/core';
import { AngularFireStorage } from 'angularfire2/storage';
import { FireService } from "../../services/fire.service";
import { DataService } from "../../services/data.service";
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'clubs',
  templateUrl: './clubs.component.html', 
  styleUrls: ['./clubs.component.css']
})
export class ClubsComponent implements OnInit {
  
  clubs;  
  imgs = [];
  storageRef: any;
  clubInfo = {clubName: "", url: "", description: "", email: ""}
  basePath = "/club_imgs/";

  constructor(private afStorage: AngularFireStorage, public dialog: MatDialog, public dataSvc: DataService, private firesvc: FireService){ }


  ngOnInit()
  {   
    this.dataSvc.notifyOther({ option: 'updatemenu', menuval: 1 }); 
    this.getClubInfo();
  }

  getClubInfo()
  {
    this.clubs = this.firesvc.getClubData();
      this.clubs.subscribe(clubs => clubs.forEach(clubs => {
          this.storageRef = this.afStorage.ref(this.basePath + clubs.id + '.jpg');
          this.storageRef.getDownloadURL().subscribe(url => {
          this.imgs.push({ id: clubs.id, url: url});
         });
      }));
  }

  openDialog(): void {
    this.clubInfo = {clubName: "", url: "", description: "", email: ""}
    const dialogRef = this.dialog.open(SuggestClubDialogComponent, {
      width: '50em',
      data: this.clubInfo
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result)
      {
        this.firesvc.sendClubEmail(result)
          .subscribe( data=> {} ) 
      }
    });
  }

  getImgUrl(id)
  {
    if (this.imgs != null && this.imgs.length > 0)
    {
      for (let i = 0; i < this.imgs.length; i++)
      {
          if (id==this.imgs[i]['id'])
          {            
            return this.imgs[i]['url']
          }
      }
    }
    return "";
  }

  
}

////////////////////////////////////////////////////////////////////////////////

export interface DialogData {
  clubName: string;
  url: string;
  description: string;
  email: string;
}

@Component({
  selector: 'suggest_club',
  templateUrl: './suggest_club.html',
  styleUrls: ['./suggest_club.css']
})
export class SuggestClubDialogComponent {
  success=false;
  constructor(
    public dialogRef: MatDialogRef<SuggestClubDialogComponent>,
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
      alert("Please enter a URL (website) for the club.")
    }
  }
  

}
