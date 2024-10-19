import { Routes } from '@angular/router';
import { EventComponent } from '../event/event.component';
import { DashboardComponent } from '../dashboard/dashboard.component';

export const routes: Routes = [
    {path: 'event', component: EventComponent},
    {path: 'dashboard', component: DashboardComponent}
];
