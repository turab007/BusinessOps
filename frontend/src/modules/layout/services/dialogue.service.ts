import { Injectable, EventEmitter } from '@angular/core';
// import { Subject } from 'rxjs/Subject';
// import { Observable } from 'rxjs';

@Injectable()
export class DialogueService {

  static instance: DialogueService;
  // Observable string sources
  private dialogEmitter = new EventEmitter();
  // private isFirstFetch: boolean = true;
  // dialogue$ = this.dialogueubject.asObservable();


  constructor() {
    return DialogueService.instance = DialogueService.instance || this;
  }

  setDialogue() {
    // this.dialogueubject.next({});
    this.dialogEmitter.emit();
  }

  // clearDialogue() {
  //   this.dialogueubject.next();
  // }

  getDialogEmitter(): EventEmitter<{}> {
    // provide only If no one has subscribed yet
    if (this.dialogEmitter.observers.length == 0) {
      // this.isFirstFetch = false;
      return this.dialogEmitter;
    }
    return null;
  }

  // setDialogEmitterAvailable() {
    // console.log('Unsubscribing');
    // this.isFirstFetch = true;
  // }

}