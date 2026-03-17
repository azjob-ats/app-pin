import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

interface Category {
  key: string;
  icon: string;
  imageUrl: string;
}

@Component({
  selector: 'app-explore',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './explore.component.html',
  styleUrl: './explore.component.scss',
})
export class ExploreComponent {

}
