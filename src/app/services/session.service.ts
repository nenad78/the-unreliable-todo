import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  private sessionStatusListener = new Subject<boolean>();
  sessionErrorRateUpdated = new Subject<number>();
  private sessionId: string;
  private isSessionCreated = false;

  constructor(
    private http: HttpClient,
    private router: Router) { }

  getIsSessionCreated() {
    return this.isSessionCreated;
  }

  getSessionId() {
    return this.sessionId;
  }

  getSessionErrorRateListener() {
    return this.sessionErrorRateUpdated.asObservable();
  }

  getSessionStatusListener() {
    return this.sessionStatusListener.asObservable();
  }

  addSession(errorRate: number) {
    const errorData = { errorRate };

    this.http.post<{ status: string, sessionId: string, errorRate: number }>('http://localhost:9000/api/session', errorData)
      .subscribe(response => {
        this.isSessionCreated = true;
        this.sessionId = response.sessionId;
        this.sessionStatusListener.next(true);
        this.saveSessionData(this.sessionId, response.errorRate.toString());

        this.router.navigate(['/todos']);
      });
  }

  updateSession(errorRate: number) {
    const sessionData = { errorRate };

    let headers = new HttpHeaders();
    headers = headers.append('sessionId', this.sessionId);

    this.http.patch<{ status: string, errorRate: number }>('http://localhost:9000/api/session', sessionData, { headers })
      .subscribe(response => {
        if (response.status === 'OK') {
          this.clearSessionData();
          this.saveSessionData(this.sessionId, response.errorRate.toString());
          this.sessionErrorRateUpdated.next(response.errorRate);

          this.router.navigate(['/todos']);
        }

      });
  }

  deleteSession() {
    let headers = new HttpHeaders();
    headers = headers.append('sessionId', this.sessionId);

    this.http.delete<{ status: string }>('http://localhost:9000/api/session', { headers })
      .subscribe(response => {
        this.isSessionCreated = false;
        this.sessionId = null;
        this.sessionStatusListener.next(false);
        this.clearSessionData();

        this.router.navigate(['/todos']);
      });
  }

  getCurrentSession() {
    const sessionInfo = this.getSessionData();

    if (!sessionInfo) {
      return;
    }

    this.isSessionCreated = true;
    this.sessionStatusListener.next(true);
    this.sessionId = sessionInfo.sessionId;
  }

  private saveSessionData(sessionId: string, sessionErrorRate: string) {
    localStorage.setItem('sessionId', sessionId);
    localStorage.setItem('errorRate', sessionErrorRate);
  }

  private clearSessionData() {
    localStorage.removeItem('sessionId');
    localStorage.removeItem('errorRate');
  }

  getSessionData() {
    const sessionId = localStorage.getItem('sessionId');
    const errorRate = localStorage.getItem('errorRate');

    if (!sessionId || !errorRate) {
      return;
    }

    return { sessionId, errorRate };
  }

}
