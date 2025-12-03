import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import MainSlider from "../components/MainSlider";
import FAQPage from "../components/FAQ";
import ShoppingEvent from "../components/ShoppingEvent";
import Categories from "../components/Categories";
import Products from "../components/Products";
import Container from "../components/ui/Container";
import Accessory from "../components/Accessory";
import Blogs from "../components/Blogs";
import About from "../components/About";
import RegisterForm from "../components/Register";
import LoginForm from "../components/Login";
import Products2 from "../components/Products2";

const Home = () => {
  return (
    <div className="pb-14 md:pb-0 bg-[#F3F4F6]">
      {/* <Container> */}
            <Products2/>

      <Navbar />
      <MainSlider />
      <Categories />
      <Products 
        title="The Best Offers"
        products={[
          {
            name: "Acer SA100 SATAIII",
            brand: "SSD Drive",
            model: "Philips",
            type: "SATA 2.5\" Solid State Drive",
            price: "30,00 ₼",
            inStock: true,
            sku: "5334126",
            imageUrl: "/images/thebestoffers/acer-sa100-sataiii-1.jpg",
            imageAlt: "Acer SA100 SATA SSD Drive",
            isHot: true,
            rating: 4.2
          },
          {
            name: "Alogic Ultra Mini USB",
            brand: "Card Readers",
            model: "ASUS",
            type: "SATA 2.5\" Solid State Drive",
            price: "50,00 ₼",
            inStock: true,
            sku: "5334127",
            imageUrl: "/images/thebestoffers/alogic1.jpg",
            imageAlt: "Alogic Ultra Mini USB",
            isHot: true,
            rating: 3.5
          },
          {
            name: "AMD Ryzen 5 7600X",
            brand: "Processors",
            model: "HP",
            type: "SATA 2.5\" Solid State Drive",
            price: "299,00 ₼",
            inStock: true,
            sku: "5334128",
            imageUrl: "/images/thebestoffers/amd-ryzen-5-7600x-1.jpg",
            imageAlt: "AMD Ryzen 5 7600X",
            isHot: true,
            rating: 2.7
          },
          {
            name: "Apple iPad Mini 6 Wi-Fi",
            brand: "Apple Ipad",
            model: "Apple",
            type: "SATA 2.5\" Solid State Drive",
            price: "500,00 ₼ – 600,00 ₼",
            inStock: true,
            sku: "5334129",
            imageUrl: "/images/thebestoffers/apple-ipad-mini-pink-1.jpg",
            imageAlt: "Apple iPad Mini 6 Wi-Fi",
            isHot: true,
            rating: 4.8
          },
          {
            name: "Apple MacBook Pro 16″ M1",
            brand: "Apple MacBook",
            model: "Apple",
            type: "SATA 2.5\" Solid State Drive",
            price: "2.999,00 ₼",
            inStock: true,
            sku: "5334130",
            imageUrl: "/images/thebestoffers/apple-macbook-pro-16.jpg",
            imageAlt: "Apple MacBook Pro 16″ M1",
            isHot: true,
            rating: 5.0
          },
          {
            name: "Samsung Galaxy S24 Ultra",
            brand: "Samsung",
            model: "Samsung",
            type: "Smartphone",
            price: "1.299,00 ₼",
            inStock: true,
            sku: "5334131",
            imageUrl: "/images/thebestoffers/samsung-galaxy-s24-ultra.jpg",
            imageAlt: "Samsung Galaxy S24 Ultra",
            isHot: true,
            rating: 3.2
          },
          {
            name: "Sony WH-1000XM5",
            brand: "Sony",
            model: "Sony",
            type: "Wireless Headphones",
            price: "399,00 ₼",
            inStock: true,
            sku: "5334132",
            imageUrl: "/images/thebestoffers/sony-wh-1000xm5.jpg",
            imageAlt: "Sony WH-1000XM5 Wireless Headphones",
            isHot: true,
            rating: 4.5
          }
        ]}
      />
      <Products 
        title="New Goods"
        showBanner={true}
        bannerData={{
          imageUrl: "https://metashop.az/wp-content/uploads/2023/01/nothing-phone-1.jpg",
          alt: "Nothing Phone 1",
          subtitle: "AT A GOOD PRICE",
          title: "Nothing Phone 1",
          buttonText: "Buy Now",
          buttonLink: "#"
        }}
        products={[
          {
            name: "Acer SA100 SATAIII",
            brand: "SSD Drive",
            model: "Philips",
            type: "SATA 2.5\" Solid State Drive",
            price: "30,00 ₼",
            inStock: true,
            sku: "5334126",
            imageUrl: "/images/thebestoffers/acer-sa100-sataiii-1.jpg",
            imageAlt: "Acer SA100 SATA SSD Drive",
            isHot: true,
            rating: 4.2
          },
          {
            name: "Alogic Ultra Mini USB",
            brand: "Card Readers",
            model: "ASUS",
            type: "SATA 2.5\" Solid State Drive",
            price: "50,00 ₼",
            inStock: true,
            sku: "5334127",
            imageUrl: "/images/thebestoffers/alogic1.jpg",
            imageAlt: "Alogic Ultra Mini USB",
            isHot: true,
            rating: 3.5
          },
          {
            name: "AMD Ryzen 5 7600X",
            brand: "Processors",
            model: "HP",
            type: "SATA 2.5\" Solid State Drive",
            price: "299,00 ₼",
            inStock: true,
            sku: "5334128",
            imageUrl: "/images/thebestoffers/amd-ryzen-5-7600x-1.jpg",
            imageAlt: "AMD Ryzen 5 7600X",
            isHot: true,
            rating: 2.7
          },
          {
            name: "Apple iPad Mini 6 Wi-Fi",
            brand: "Apple Ipad",
            model: "Apple",
            type: "SATA 2.5\" Solid State Drive",
            price: "500,00 ₼ – 600,00 ₼",
            inStock: true,
            sku: "5334129",
            imageUrl: "/images/thebestoffers/apple-ipad-mini-pink-1.jpg",
            imageAlt: "Apple iPad Mini 6 Wi-Fi",
            isHot: true,
            rating: 4.8
          },
          {
            name: "Apple MacBook Pro 16″ M1",
            brand: "Apple MacBook",
            model: "Apple",
            type: "SATA 2.5\" Solid State Drive",
            price: "2.999,00 ₼",
            inStock: true,
            sku: "5334130",
            imageUrl: "/images/thebestoffers/apple-macbook-pro-16.jpg",
            imageAlt: "Apple MacBook Pro 16″ M1",
            isHot: true,
            rating: 5.0
          },
          {
            name: "Samsung Galaxy S24 Ultra",
            brand: "Samsung",
            model: "Samsung",
            type: "Smartphone",
            price: "1.299,00 ₼",
            inStock: true,
            sku: "5334131",
            imageUrl: "/images/thebestoffers/samsung-galaxy-s24-ultra.jpg",
            imageAlt: "Samsung Galaxy S24 Ultra",
            isHot: true,
            rating: 3.2
          },
          {
            name: "Sony WH-1000XM5",
            brand: "Sony",
            model: "Sony",
            type: "Wireless Headphones",
            price: "399,00 ₼",
            inStock: true,
            sku: "5334132",
            imageUrl: "/images/thebestoffers/sony-wh-1000xm5.jpg",
            imageAlt: "Sony WH-1000XM5 Wireless Headphones",
            isHot: true,
            rating: 4.5
          }
        ]}
      />
      <ShoppingEvent />
      <Products 
        title="Home Appliance"
        products={[
          {
            name: "Acer SA100 SATAIII",
            brand: "SSD Drive",
            model: "Philips",
            type: "SATA 2.5\" Solid State Drive",
            price: "30,00 ₼",
            inStock: true,
            sku: "5334126",
            imageUrl: "/images/thebestoffers/acer-sa100-sataiii-1.jpg",
            imageAlt: "Acer SA100 SATA SSD Drive",
            isHot: true,
            rating: 4.2
          },
          {
            name: "Alogic Ultra Mini USB",
            brand: "Card Readers",
            model: "ASUS",
            type: "SATA 2.5\" Solid State Drive",
            price: "50,00 ₼",
            inStock: true,
            sku: "5334127",
            imageUrl: "/images/thebestoffers/alogic1.jpg",
            imageAlt: "Alogic Ultra Mini USB",
            isHot: true,
            rating: 3.5
          },
          {
            name: "AMD Ryzen 5 7600X",
            brand: "Processors",
            model: "HP",
            type: "SATA 2.5\" Solid State Drive",
            price: "299,00 ₼",
            inStock: true,
            sku: "5334128",
            imageUrl: "/images/thebestoffers/amd-ryzen-5-7600x-1.jpg",
            imageAlt: "AMD Ryzen 5 7600X",
            isHot: true,
            rating: 2.7
          },
          {
            name: "Apple iPad Mini 6 Wi-Fi",
            brand: "Apple Ipad",
            model: "Apple",
            type: "SATA 2.5\" Solid State Drive",
            price: "500,00 ₼ – 600,00 ₼",
            inStock: true,
            sku: "5334129",
            imageUrl: "/images/thebestoffers/apple-ipad-mini-pink-1.jpg",
            imageAlt: "Apple iPad Mini 6 Wi-Fi",
            isHot: true,
            rating: 4.8
          },
          {
            name: "Apple MacBook Pro 16″ M1",
            brand: "Apple MacBook",
            model: "Apple",
            type: "SATA 2.5\" Solid State Drive",
            price: "2.999,00 ₼",
            inStock: true,
            sku: "5334130",
            imageUrl: "/images/thebestoffers/apple-macbook-pro-16.jpg",
            imageAlt: "Apple MacBook Pro 16″ M1",
            isHot: true,
            rating: 5.0
          }
        ]}
      />
      <Accessory />
      {/* <FAQPage /> */}
      <Blogs/>
      <About/>
    
     
      <Footer />

      {/* </Container> */}
    </div>
  );
};

export default Home;
