import { Helmet } from 'react-helmet';

export default function AboutUs() {
  return (
    <>
      <Helmet>
        <title>About Us | Elegance Jewels</title>
        <meta name="description" content="Learn about Elegance Jewels, our history, craftsmanship, and commitment to quality." />
      </Helmet>
      
      <div className="container mx-auto px-6 py-12">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-playfair font-bold mb-6">About Elegance Jewels</h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Crafting elegance since 2002, we bring timeless luxury to life through our handcrafted jewelry pieces.
          </p>
        </div>
        
        {/* Story Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <h2 className="text-3xl font-playfair font-bold mb-6">Our Story</h2>
            <p className="text-muted-foreground mb-4">
              Elegance Jewels was founded in Mumbai, India with a vision to create jewelry that celebrates the artistry
              of traditional Indian craftsmanship while embracing contemporary design sensibilities.
            </p>
            <p className="text-muted-foreground mb-4">
              What began as a small family workshop has grown into a respected name in luxury jewelry, known for our 
              meticulous attention to detail and commitment to using only the finest materials.
            </p>
            <p className="text-muted-foreground">
              Today, we continue to honor our heritage while innovating to create pieces that resonate with the modern woman – 
              jewelry that is not just worn, but experienced and cherished for generations.
            </p>
          </div>
          <div className="rounded-lg overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1584302179602-e4c3d3fd629d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1770&q=80" 
              alt="Jewelry craftsman at work" 
              className="w-full h-[400px] object-cover"
            />
          </div>
        </div>
        
        {/* Values Section */}
        <div className="bg-card p-12 rounded-lg mb-20">
          <h2 className="text-3xl font-playfair font-bold text-center mb-12">Our Values</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-medium mb-3">Exceptional Craftsmanship</h3>
              <p className="text-muted-foreground">
                We believe in the artistry of handcrafted jewelry. Each piece is meticulously crafted by our skilled artisans who bring years of expertise to their work.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-medium mb-3">Ethical Sourcing</h3>
              <p className="text-muted-foreground">
                We are committed to responsible and ethical sourcing of all our materials. We ensure our gemstones and metals are procured from reliable, conflict-free sources.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 11.5V14m0-2.5v-6a2.5 2.5 0 015 0v6m-5 0h5m-9 0H3m9 0h5m-9 0H9m-1 0h1m9.5-3l1.5 3h-3L18.5 8.5z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium mb-3">Timeless Design</h3>
              <p className="text-muted-foreground">
                We create pieces that transcend trends, focusing on elegant designs that can be cherished for generations, becoming heirlooms in their own right.
              </p>
            </div>
          </div>
        </div>
        
        {/* Craftsmanship Section */}
        <div className="mb-20">
          <h2 className="text-3xl font-playfair font-bold text-center mb-12">Our Craftsmanship</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="bg-card p-6 rounded-lg">
              <h3 className="text-xl font-medium mb-4">Handcrafted Excellence</h3>
              <p className="text-muted-foreground mb-4">
                Each Elegance Jewels piece is handcrafted by our master artisans who combine traditional techniques with modern innovation. From initial sketch to final polish, we oversee every step of the creation process.
              </p>
              <p className="text-muted-foreground">
                Our craftsmen have decades of experience, many having learned their skills through family traditions that span generations. This deep knowledge is evident in the exceptional quality and attention to detail in every piece.
              </p>
            </div>
            
            <div className="bg-card p-6 rounded-lg">
              <h3 className="text-xl font-medium mb-4">Quality Materials</h3>
              <p className="text-muted-foreground mb-4">
                We use only the finest materials – from ethically sourced gemstones to high-quality precious metals. Each gemstone is carefully selected for its color, clarity, and character before being set into our designs.
              </p>
              <p className="text-muted-foreground">
                Our commitment to quality extends to every component of our jewelry, ensuring that each piece not only looks beautiful but is built to last and be treasured for generations.
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <img 
              src="https://images.unsplash.com/photo-1627293509201-cd0c780043e6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80" 
              alt="Jewelry crafting process" 
              className="w-full h-64 object-cover rounded-lg"
            />
            <img 
              src="https://images.unsplash.com/photo-1668789054513-1f0c8d9bd2ea?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80" 
              alt="Gemstone selection" 
              className="w-full h-64 object-cover rounded-lg"
            />
            <img 
              src="https://images.unsplash.com/photo-1639914943256-d212b5f51f36?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2340&q=80" 
              alt="Final jewelry inspection" 
              className="w-full h-64 object-cover rounded-lg"
            />
          </div>
        </div>
        
        {/* Team Section */}
        <div>
          <h2 className="text-3xl font-playfair font-bold text-center mb-12">Our Team</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="mb-4 overflow-hidden rounded-full w-40 h-40 mx-auto">
                {/* <img 
                  src="https://images.unsplash.com/photo-1579591919791-0e3737ae3808?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80" 
                  alt="XYZ - Founder of Elegance Jewels" 
                  className="w-full h-full object-cover"
                /> */}
              </div>
              <h3 className="text-xl font-medium">XYZ</h3>
              <p className="text-muted-foreground">Founder of Elegance Jewels</p>
            </div>
            
            <div className="text-center">
              <div className="mb-4 overflow-hidden rounded-full w-40 h-40 mx-auto">
                {/* <img 
                  src="https://images.unsplash.com/photo-1667630232578-9a07790da789?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80" 
                  alt="Piyush - Sr. Full Stack Developer" 
                  className="w-full h-full object-cover"
                /> */}
              </div>
              <h3 className="text-xl font-medium">Piyush</h3>
              <p className="text-muted-foreground">Sr. Full Stack Developer</p>
            </div>
            
            <div className="text-center">
              <div className="mb-4 overflow-hidden rounded-full w-40 h-40 mx-auto">
                {/* <img 
                  src="https://images.unsplash.com/photo-1594839538288-a37dfac45988?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=774&q=80" 
                  alt="Mohammad Kaif - Developer" 
                  className="w-full h-full object-cover"
                /> */}
              </div>
              <h3 className="text-xl font-medium">Mohammad Kaif</h3>
              <p className="text-muted-foreground">Developer</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}