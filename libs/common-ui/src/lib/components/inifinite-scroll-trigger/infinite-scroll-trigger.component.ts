import {Component, OnInit, output} from '@angular/core';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'infinite-scroll-trigger',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './infinite-scroll-trigger.component.html',
  styleUrl: './infinite-scroll-trigger.component.scss',
})
export class InfiniteScrollTriggerComponent implements OnInit {
  loaded = output<void>();

  ngOnInit(): void {
    this.loaded.emit();
  }
}
