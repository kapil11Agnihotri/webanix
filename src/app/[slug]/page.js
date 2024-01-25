import About from "@/components/about-us/About";
import Home from "../page";
import { get_pages_by_slug } from "@/backend/models/pageModel";
import NotFound from "../../components/not-found/not-found";

const CommonTemplate = async ({ params }) => {

  const { slug } = params;

  const response = await get_pages_by_slug(slug);
  const pageData = response?.data;
  

  const renderDynamicComponent = () => {
    if (pageData && pageData?.template_type) {
      switch (pageData?.template_type) {
        case "home":
          return <Home pageData={pageData} />;
        case "about":
          return <About pageData={pageData} />;
        default:
          return  <NotFound />;
      }
    } else {
      return <NotFound />;
    }
  };

  return renderDynamicComponent();
};

export default CommonTemplate;
