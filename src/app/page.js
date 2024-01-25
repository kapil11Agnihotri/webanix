import { get_pages_by_slug } from "@/backend/models/pageModel";
import Banner from "@/components/Banner/Banner";
import Footer from "@/components/Footer/Footer";
import Header from "@/components/Header/Header";
import LatestNews from "@/components/latestNews/LatestNews";
import ClientLayout from "@/components/layouts/ClientLayout";
import NewsLetter from "@/components/newsLetter/NewsLetter";
import ProductsSection from "@/components/productsSection/ProductsSection";
import Services from "@/components/servicesSection/Services";
import Success from "@/components/successSection/Success";
import "bootstrap/dist/css/bootstrap.min.css";
import { get_category_list_by_slug } from "@/backend/models/categoryModel";
import { get_blogs } from "@/backend/models/blogModel";

export default async function Home({ pageData }) {

  let homeData = undefined;
  if (pageData) {
     homeData = JSON.parse(JSON.parse(pageData?.page_json));
  }
  else {
    const response = await get_pages_by_slug('home');
    const pageData = response?.data;
    homeData = JSON.parse(JSON.parse(pageData?.page_json));
  }
 
  const response = await get_category_list_by_slug("services");
  const data = response?.data;
  const homeListData = data[0]?.serviceList;

  const productSectionData = homeListData.filter((item) =>{
    return JSON?.parse(item?.featured_for)?.find((value) =>{
      return value === "Home Page"
    })
  })
  
  const serviceSectionData = homeListData.filter((item) =>{
    return JSON?.parse(item?.featured_for)?.find((value) =>{
      return value === "Product Listing"
    })
  })

  const res= await get_blogs();

  let blogs = res?.data?.filter((blog) => {
    return blog.status == 2;
  });

  const newsBlog = blogs?.filter((blog) => {
    return blog?.blog_type_name == "Featured Home";
  });
 
  
  return (
    <main>
      <ClientLayout>
        <Banner bannerData = {homeData?.carouselSection} />
        <ProductsSection productsData = {productSectionData}/>
        <Services data = {serviceSectionData}/>
        <Success successData = {homeData?.secondSection} />
        <LatestNews newsData={newsBlog}/>
        <NewsLetter newsLetterData = {homeData?.newsLetterSection} />
      </ClientLayout>
    </main>
  );
}
