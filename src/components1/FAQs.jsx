import { SectionHeader, FAQ } from "./index";
import { FaQuestion } from "react-icons/fa";
import { faqs } from "../data";

const FAQs = () => {
  return (
    <section className="faqs">
      <div className="container faqs__container">
        <div>
          <h1 className="poppins-semibold"> FAQs</h1>
        </div>
        <div className="faqs__wrapper">
          {faqs.map(({ id, question, answer }) => {
            return <FAQ key={id} question={question} answer={answer} />;
          })}
        </div>
      </div>
    </section>
  );
};

export default FAQs;
