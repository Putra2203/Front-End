import { useState } from "react";
import { FaChevronUp, FaChevronDown } from "react-icons/fa";

const FAQ = ({ question, answer }) => {
  const [open, setOpen] = useState(false);
  return (
    <article className=" bg-[#DEAC80] p-4 rounded-lg ">
      <div className="flex justify-between transition duration-150" onClick={() => setOpen(!open)}>
        <h4 className="font-medium font-poppins">{question}</h4>
        <button className="faq__icon">
          {open ? <FaChevronUp /> : <FaChevronDown />}
        </button>
      </div>
      {open && <p>{answer}</p>}
    </article>
  );
};

export default FAQ;
