import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbCarousel, NgbSlideEvent, NgbSlideEventSource } from '@ng-bootstrap/ng-bootstrap';
import { CategoryService } from '../../services/CategoryService';
import { ProductService } from '../../services/ProductService';
import { CartService } from '../../services/CartService';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})

export class HomeComponent implements OnInit {


  pauseOnHover = true;
  currentIndex = 0;
  private categoryService: CategoryService;
  private productService: ProductService;
  private cartService: CartService;
  public cartState;

  @ViewChild('carousel', {static : true}) carousel: NgbCarousel; // Carousel

  slides = [
    { image: "assets/carousel_images/1.jpg"},
    { image: "assets/carousel_images/2.jpg"},
    { image: "assets/carousel_images/3.jpg"},
  ];

  constructor( categoryService : CategoryService, productService : ProductService, cartService : CartService) { 
    this.categoryService = categoryService;
    this.productService = productService;
    this.cartService = cartService;
  }

  ngOnInit() {
    this.preloadImages();
      if (localStorage.getItem("token") != null) {
        this.cartService.updateCurrentUserCart();
      }
  }

  preloadImages() {
    this.slides.forEach(slide => {
      (new Image()).src = slide.image;
    });
  }

}
