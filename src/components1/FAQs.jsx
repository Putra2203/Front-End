import { FAQ } from "./index";
import { faqs } from "../data";

const FAQs = () => {
  return (
    <section>
      <div className="container flex-col justify-center max-w-screen-sm p-10 mx-auto lg:max-w-screen-xl">
        <div>
          <h1 className="text-2xl font-semibold lg:text-4xl mb-14 font-poppins"> FAQs</h1>
        </div>
        <div className="grid items-start grid-cols-1 gap-4 lg:grid-cols-2">
          {faqs.map(({ id, question, answer }) => {
            return <FAQ key={id} question={question} answer={answer} />;
          })}
        </div>
      </div>
    </section>
  );
};

export default FAQs;
