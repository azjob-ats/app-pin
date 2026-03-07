import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ThemeService } from './shared/services/theme.service';
import { LanguageService } from './shared/services/language.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  template: '<router-outlet />',
  styles: [':host { display: block; height: 100%; }'],
})
export class App implements OnInit {
  constructor(
    private themeService: ThemeService,
    private languageService: LanguageService,
  ) {}

  ngOnInit(): void {
    // Services initialize reactively via signals & effects
  }
}
