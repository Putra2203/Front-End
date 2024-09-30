import {
  Welcome,
  Programs,
  Values,
  FAQs,
  Testimonials,
} from "../../components1/index";

const Home = () => {
  return (
    <>
      <div className="bg-[#F5F5DC]">
        <Welcome />
        <Programs />
        <Values />
        <FAQs />
        <Testimonials />
      </div>
    </>
  );
};

export default Home;
