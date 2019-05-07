import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';

import { SessionService } from 'src/app/services/session.service';
import { TodoService } from 'src/app/services/todo.service';

@Component({
  selector: 'app-sessions',
  templateUrl: './sessions.component.html',
  styleUrls: ['./sessions.component.css']
})
export class SessionsComponent implements OnInit, OnDestroy {
  sessionData: any;
  sessionSubscription: Subscription;
  errorRateSubscription: Subscription;
  isNew = true;
  isSessionCreated = false;
  sessionErrorRate: number;

  constructor(
    private sessionService: SessionService) { }

  ngOnInit() {
    this.isSessionCreated = this.sessionService.getIsSessionCreated();
    this.sessionSubscription = this.sessionService.getSessionStatusListener()
      .subscribe(sessionStatus => {
        this.isSessionCreated = sessionStatus;
      });

    this.sessionData = this.sessionService.getSessionData();

    this.errorRateSubscription = this.sessionService.getSessionErrorRateListener()
      .subscribe(errorRate => {
        this.sessionErrorRate = errorRate;
      });
  }

  onCreateSession(form: NgForm) {
    if (form.invalid) {
      return;
    }

    this.sessionService.addSession(form.value.errorRate);
  }

  onEditSession(form: NgForm) {
    this.sessionService.updateSession(form.value.sessionErrorRate);
  }

  onDeleteSession() {
    if (confirm('Are you sure you want to delete the session?')) {
      this.sessionService.deleteSession();
    } else {
      return;
    }
  }

  showForm() {
    this.isNew = !this.isNew;
    this.sessionErrorRate = this.sessionData.errorRate;
  }

  ngOnDestroy() {
    this.sessionSubscription.unsubscribe();
    this.errorRateSubscription.unsubscribe();
  }

}
