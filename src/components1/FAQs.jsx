import { FAQ } from "./index";
import { faqs } from "../data";

const FAQs = () => {
  return (
    <section className="mt-32 faqs">
      <div className="container flex-col justify-center max-w-screen-xl mx-auto">
        <div>
          <h1 className="text-4xl font-semibold mb-14 font-poppins"> FAQs</h1>
        </div>
        <div className="grid items-start grid-cols-2 gap-4 ">
          {faqs.map(({ id, question, answer }) => {
            return <FAQ key={id} question={question} answer={answer} />;
          })}
        </div>
      </div>
    </section>
  );
};

export default FAQs;
