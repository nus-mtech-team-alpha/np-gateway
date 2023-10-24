import { Component, OnInit } from '@angular/core';

@Component({
  standalone: true,
  selector: 'jhi-footer',
  templateUrl: './footer.component.html',
})
export default class FooterComponent implements OnInit {
  
  year: number = 0;

  ngOnInit(): void {
    this.year = new Date().getFullYear();
  }

}
