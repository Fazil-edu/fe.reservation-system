import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ScrollTop } from 'primeng/scrolltop';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ScrollTop],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'reservation-system';
}
