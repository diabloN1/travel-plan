import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ZardSonnerComponent } from './shared/components/sonner';

@Component({
  imports: [RouterOutlet, ZardSonnerComponent],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
}
