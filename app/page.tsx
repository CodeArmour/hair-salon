import Link from "next/link"
import { ArrowRight, Scissors, Clock, MapPin, Phone } from "lucide-react"
import Image from "next/image"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative h-[80vh] overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="/herobg.jpg?height=1080&width=1920"
            alt="Salon interior"
            fill
            className="object-cover brightness-75"
            priority
          />
        </div>
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4 sm:px-6">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-light text-white mb-6 tracking-wider animate-fade-in">
            ELEGANCE <span className="font-semibold">SALON</span>
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mb-8 animate-fade-in-delay">
            Where style meets sophistication. Experience the finest hair care in a serene European atmosphere.
          </p>
          <Link
            href="/bookings"
            className="group bg-white text-black px-6 py-3 rounded-sm hover:bg-black hover:text-white transition-all duration-300 flex items-center gap-2 animate-fade-in-delay-2"
          >
            Book Appointment
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 px-4 sm:px-6 max-w-7xl mx-auto">
        <h2 className="text-3xl font-light text-center mb-16 tracking-wide">
          OUR <span className="font-medium">SERVICES</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: "Haircut & Styling", price: "€45+", image: "/hair1.jpg?height=400&width=600" },
            { title: "Color & Highlights", price: "€75+", image: "/hair2.jpg?height=400&width=600" },
            { title: "Treatment & Care", price: "€60+", image: "/hair3.jpg?height=400&width=600" },
          ].map((service, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-sm hover:shadow-xl transition-all duration-500"
            >
              <div className="aspect-[4/5] overflow-hidden">
                <Image
                  src={service.image || "/placeholder.svg"}
                  alt={service.title}
                  width={600}
                  height={400}
                  className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-white/90 p-4 transform translate-y-0 group-hover:translate-y-0 transition-transform duration-300">
                <h3 className="text-xl font-medium">{service.title}</h3>
                <p className="text-gray-600">{service.price}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 px-4 sm:px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-light mb-6 tracking-wide">
              ABOUT <span className="font-medium">US</span>
            </h2>
            <p className="text-gray-600 mb-4">
              Founded in 2010, Elegance Salon brings the refined aesthetics and techniques of European hair styling to
              your city. Our team of expert stylists are trained in the latest methods and use only premium products.
            </p>
            <p className="text-gray-600 mb-6">
              We believe that every client deserves personalized attention and a hairstyle that enhances their natural
              beauty and fits their lifestyle.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-gray-700" />
                <span className="text-sm">8AM - 8PM, Mon-Sat</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-gray-700" />
                <span className="text-sm">123 Elegance Street</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-5 h-5 text-gray-700" />
                <span className="text-sm">+1 234 567 8900</span>
              </div>
            </div>
          </div>
          <div className="relative h-[400px] overflow-hidden rounded-sm">
            <Image src="/aboutbg.jpg?height=800&width=600" alt="Salon team" fill className="object-cover" />
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 px-4 sm:px-6 max-w-7xl mx-auto text-center">
        <h2 className="text-3xl font-light mb-6 tracking-wide">
          BOOK YOUR <span className="font-medium">APPOINTMENT</span>
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto mb-8">
          Ready to experience the Elegance difference? Book your appointment today and let our expert stylists transform
          your look.
        </p>
        <Link
          href="/bookings"
          className="inline-flex items-center gap-2 bg-black text-white px-8 py-3 rounded-sm hover:bg-gray-800 transition-colors duration-300"
        >
          <Scissors className="w-4 h-4" />
          Manage Bookings
        </Link>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-light mb-4">
              ELEGANCE <span className="font-medium">SALON</span>
            </h3>
            <p className="text-gray-400">Where style meets sophistication.</p>
          </div>
          <div>
            <h4 className="text-lg font-medium mb-4">Hours</h4>
            <p className="text-gray-400">Monday - Saturday: 8AM - 8PM</p>
            <p className="text-gray-400">Sunday: Closed</p>
          </div>
          <div>
            <h4 className="text-lg font-medium mb-4">Contact</h4>
            <p className="text-gray-400">123 Elegance Street</p>
            <p className="text-gray-400">+1 234 567 8900</p>
            <p className="text-gray-400">info@elegancesalon.com</p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-8 pt-8 border-t border-gray-800 text-center text-gray-500">
          <p>© {new Date().getFullYear()} Elegance Salon. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

