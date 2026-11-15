import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';

import {
  DestinationResponse,
  DestinationType,
} from '@/core/model/destination.model';

import { DestinationCardComponent } from '../destination-card/destination-card.component';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideGlobe } from '@ng-icons/lucide';

@Component({
  selector: 'app-destination-list',
  standalone: true,
  imports: [NgIcon, DestinationCardComponent],
  providers: [provideIcons({ lucideGlobe })],
  templateUrl: './destination-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DestinationListComponent {
  readonly destinations = input<DestinationResponse[]>([]);
  readonly loading = input(false);
  readonly searchQuery = input('');
  readonly selectedType = input<DestinationType | 'ALL'>('ALL');

  readonly edit = output<DestinationResponse>();
  readonly delete = output<DestinationResponse>();
  readonly create = output<void>();
}