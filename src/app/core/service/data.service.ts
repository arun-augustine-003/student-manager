import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class DataService {
  // Observable string sources
  private profileDetails = new Subject<boolean>();

  // Observable string streams
  profileDetails$ = this.profileDetails.asObservable();

  // Service message commands
  setProfileVisibility(isVisible: boolean) {
    this.profileDetails.next(isVisible);
  }
}
