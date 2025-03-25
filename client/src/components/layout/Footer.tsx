import { Link } from 'wouter';
import { Facebook, Instagram, Twitter, Linkedin, MapPin, Phone, Mail, Clock } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-background pt-16 border-t border-border">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div>
            <div className="mb-6">
              <Link href="/" className="flex items-center">
                <span className="text-3xl font-playfair font-bold">
                  <span className="text-primary">Elegance</span>
                  <span className="text-secondary/70">Jewels</span>
                </span>
              </Link>
            </div>
            <p className="text-muted-foreground mb-6">
              Discover our exceptional collection of handcrafted jewelry, designed with the finest materials and attention to detail.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium text-foreground mb-6">Quick Links</h3>
            <ul className="space-y-3">
              <li><Link href="/" className="text-muted-foreground hover:text-primary transition-colors">Home</Link></li>
              <li><Link href="/about" className="text-muted-foreground hover:text-primary transition-colors">About Us</Link></li>
              <li><Link href="/catalog" className="text-muted-foreground hover:text-primary transition-colors">Shop All</Link></li>
              
              <li><Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-medium text-foreground mb-6">Customer Service</h3>
            <ul className="space-y-3">
              <li><Link href="/account" className="text-muted-foreground hover:text-primary transition-colors">My Account</Link></li>
              <li><Link href="/" className="text-muted-foreground hover:text-primary transition-colors">Track Your Order</Link></li>
              <li><Link href="/" className="text-muted-foreground hover:text-primary transition-colors">Shipping & Returns</Link></li>
              <li><Link href="/" className="text-muted-foreground hover:text-primary transition-colors">FAQs</Link></li>
              <li><Link href="/" className="text-muted-foreground hover:text-primary transition-colors">Size Guide</Link></li>
              <li><Link href="/" className="text-muted-foreground hover:text-primary transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-medium text-foreground mb-6">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin className="text-primary mt-1 mr-2 w-5 h-5" />
                <span className="text-muted-foreground">123 Luxury Avenue, Mumbai, Maharashtra 400001, India</span>
              </li>
              <li className="flex items-center">
                <Phone className="text-primary mr-2 w-5 h-5" />
                <a href="tel:+919876543210" className="text-muted-foreground hover:text-primary transition-colors">+91 9876 543 210</a>
              </li>
              <li className="flex items-center">
                <Mail className="text-primary mr-2 w-5 h-5" />
                <a href="mailto:info@elegancejewels.com" className="text-muted-foreground hover:text-primary transition-colors">info@elegancejewels.com</a>
              </li>
              <li className="flex items-center">
                <Clock className="text-primary mr-2 w-5 h-5" />
                <span className="text-muted-foreground">Mon-Sat: 10am-8pm IST</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-muted-foreground text-sm mb-4 md:mb-0">
              © 2025 EleganceJewels. All rights reserved. Designed by Piyush.
            </p>
            {/* <div className="flex items-center space-x-6">
              <img src="https://via.placeholder.com/40x25?text=Visa" alt="Visa" className="h-6" />
              <img src="https://via.placeholder.com/40x25?text=MC" alt="Mastercard" className="h-6" />
              <img src="https://via.placeholder.com/40x25?text=Amex" alt="American Express" className="h-6" />
              <img src="https://via.placeholder.com/40x25?text=PP" alt="PayPal" className="h-6" />
              <img src="https://via.placeholder.com/40x25?text=Apple" alt="Apple Pay" className="h-6" />
            </div> */}
          </div>
        </div>
      </div>
    </footer>
  );
}
