import {Component, inject, OnInit} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {UserService} from './services/user.service';

@Component({
    selector: 'app-root',
    imports: [RouterOutlet],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
    standalone: true
})
export class AppComponent {
}
