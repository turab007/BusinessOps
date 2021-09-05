import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';

@Injectable()
export class ErrorHandlerService {

constructor(private snackBar: MatSnackBar) { }

handleError(error)
{
    this.showSnackBar(error.body);

}

  /**
   * DISPLAYS SNACKBAR
   * @param message STRING TO BE DISPLAYED
   */

  private showSnackBar(message: string): void {
      console.log('this is the error ',message);
      if(!message)
        {
            message="An error has occured";
        }
    this.snackBar.open(message, '', {
      duration: 1000,
    });
  }

}

