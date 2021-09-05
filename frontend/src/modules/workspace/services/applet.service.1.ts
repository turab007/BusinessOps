import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { menuArr } from '../menu'

@Injectable()
export class AppletService {

    public workSpaceData: any[];
    workSpaceInfo$: BehaviorSubject<any[]>;
    constructor() {



        this.workSpaceData = [
            {
                name: 'Tasks',
                active: false,
                icon: 'web'
            },
            {
                name: 'Approvals',
                active: false,
                icon: 'check_circle'
            },
            {
                name: 'Lists',
                active: false,
                icon: 'view_list'
            },
            {
                name: 'EOD Reports',
                active: false,
                icon: 'insert_drive_file'
            }
        ]

        this.workSpaceInfo$ = new BehaviorSubject(this.workSpaceData);
    }


    toggleStatus(i: number) {


        if (!this.workSpaceData[i].active) {
            var obj = {
                title: this.workSpaceData[i].name.toString(),
                route: '/' + this.workSpaceData[i].name + '/', icon: this.workSpaceData[i].icon.toString(), isDialouge: false
            }

            // menuArr.links.push(obj);
            menuArr.links.splice(1, 0, obj);
        }
        else {
            if (i !== -1) {
                let tempMenu = menuArr.links.filter(item => item.title != this.workSpaceData[i].name);
                menuArr.links = tempMenu;
                // console.log(abc, this.workSpaceData[i].name);
            }
        }

        this.workSpaceData[i].active = !this.workSpaceData[i].active;
        this.workSpaceInfo$.next(this.workSpaceData);
    }
}