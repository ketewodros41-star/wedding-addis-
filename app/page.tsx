import Header from '@/components/layout/Header';
import Hero from '@/components/home/Hero';
import FeaturedVenues from '@/components/home/FeaturedVenues';
import BookingPreview from '@/components/home/BookingPreview';
import Styles from '@/components/home/Styles';
import Testimonials from '@/components/home/Testimonials';
import WeddingStories from '@/components/home/WeddingStories';
import Footer from '@/components/layout/Footer';

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1 w-full flex flex-col items-center">
        <div className="w-full">
          <Hero />
          <div className="my-16">
            <WeddingStories />
          </div>
          <FeaturedVenues />
          <BookingPreview />
          <Styles />
          <Testimonials />
        </div>
      </main>
      <Footer />
    </>
  );
}
