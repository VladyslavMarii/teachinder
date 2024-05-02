import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { MockServiceService } from './mock-service.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  providers: [MockServiceService],
  imports: [CommonModule, RouterOutlet, HomeComponent, HttpClientModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'teachinder-app';
  constructor(private mockServise: MockServiceService) { }

  ngOnInit(): void {
  }

  generateUserList(): void {
    const userList = this.mockServise.generateUserList();
    console.log(userList);
  }
}
