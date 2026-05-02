import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DemoAngularMaterialModule } from '../DemoAngularMaterialModule';

@Component({
  selector: 'app-customer',
  standalone: true,
  imports: [RouterModule , DemoAngularMaterialModule],
  templateUrl: './customer.component.html',
  styleUrl: './customer.component.scss'
})
export class CustomerComponent {

}
