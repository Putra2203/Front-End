import { useState } from "react";
import { FaChevronUp, FaChevronDown } from "react-icons/fa";

const FAQ = ({ question, answer }) => {
  const [open, setOpen] = useState(false);
  return (
    <article className="faq poppins-regular">
      <div onClick={() => setOpen(!open)}>
        <h4>{question}</h4>
        <button className="faq__icon">
          {open ? <FaChevronUp /> : <FaChevronDown />}
        </button>
      </div>
      {open && <p>{answer}</p>}
    </article>
  );
};

export default FAQ;
