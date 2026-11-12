import { Component, computed, input, output } from '@angular/core';

import { DestinationResponse, DestinationType } from '@/core/model/destination.model';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideGlobe, lucideHotel, lucidePalmtree, lucideWaves } from '@ng-icons/lucide';

@Component({
  selector: 'app-destination-card',
  templateUrl: './destination-card.component.html',
  imports: [NgIcon],
  providers: [provideIcons({ lucideWaves, lucideHotel, lucidePalmtree, lucideGlobe })],
})
export class DestinationCardComponent {
  readonly destination = input.required<DestinationResponse>();

  readonly edit = output<DestinationResponse>();
  readonly delete = output<DestinationResponse>();

  private readonly typeConfigs: Record<
    DestinationType,
    { label: string; clazz: string; icon: string }
  > = {
    ACTIVITIES: {
      label: 'Activities',
      icon: 'lucideWaves',
      clazz: 'bg-violet-500/10 text-violet-600',
    },
    ACCOMODATION: {
      label: 'Accommodation',
      icon: 'lucideHotel',
      clazz: 'bg-amber-500/10 text-amber-600',
    },
    BOTH: {
      label: 'Activities & Stay',
      icon: 'lucidePalmtree',
      clazz: 'bg-emerald-500/10 text-emerald-600',
    },
    OTHER: {
      label: 'Other',
      icon: 'lucideGlobe',
      clazz: 'bg-muted text-muted-foreground',
    },
  };

  readonly typeConfig = computed(() => this.typeConfigs[this.destination().type]);

  readonly typeLabel = computed(() => this.typeConfig().label);
  readonly typeClass = computed(() => this.typeConfig().clazz);
  readonly visual = computed(() => this.typeConfig().icon);
}
