import Header from "./header";
import Footer from "./footer";
const NoPage = () => {
    return (
    <>
    <div className="w-screen">
        <Header />
    </div>  
    <div className="flex justify-center items-center gap-6 min-h-screen">
      <h1 className="text-4xl font-bold text-center">404 | Page Not Found</h1>
    </div>
    <Footer />
    </>);
};

export default NoPage;