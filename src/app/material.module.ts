import { NgModule } from "@angular/core";
import { MatButtonModule } from '@angular/material/button';
import {MatDialogModule} from '@angular/material/dialog';
import {MatCardModule} from '@angular/material/card';


@NgModule({
    imports: [ MatButtonModule, MatDialogModule,MatCardModule],
    exports: [ MatButtonModule, MatDialogModule,MatCardModule ]
})

export class MaterialModule {}