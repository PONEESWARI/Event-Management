import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  private apiUrl = 'http://localhost:3000/events'; // Your API endpoint

  constructor(private http: HttpClient) {}

  // createEvent(eventData: any): Observable<any> {
    // const formData: FormData = new FormData();
    // formData.append('eventName', eventData.eventName);
    // formData.append('eventDate', eventData.eventDate);
    // if (eventData.image) {
    //   formData.append('image', eventData.image);
    // }
    
    // return this.http.post(this.apiUrl, formData);
    createEvent(eventData: { eventName: string; eventDate: string; files: File[] }): Observable<any> {
      const formData: FormData = new FormData();
      formData.append('eventName', eventData.eventName);
      formData.append('eventDate', eventData.eventDate);
  
      // Append each file to the FormData
      for (const file of eventData.files) {
        formData.append('files', file); // Assuming your backend accepts 'files' as the key for file uploads
      }
  
      return this.http.post(`${this.apiUrl}`, formData);
    }
  // }

     // Update an event
     updateEvent(id: number, eventData: any): Observable<any> {
      const formData: FormData = new FormData();
      formData.append('eventName', eventData.eventName);
      formData.append('eventDate', eventData.eventDate);
      if (eventData.image) {
        formData.append('image', eventData.image);
      }
  
      return this.http.put(`${this.apiUrl}/${id}`, formData);
    }
  
    deleteEvent(id: number): Observable<any> {
      return this.http.delete(`${this.apiUrl}/${id}`);
    }
}
