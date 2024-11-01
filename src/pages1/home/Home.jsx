import React, { useEffect, useRef } from "react";
import {
  Welcome,
  Programs,
  Values,
  FAQs,
  Testimonials,
} from "../../components1/index";

const Home = () => {
  const sectionRefs = useRef([]);

  useEffect(() => {
    // Setup IntersectionObserver
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Menambahkan kelas animasi saat elemen masuk viewport
            entry.target.classList.add("opacity-100");
            entry.target.classList.add(entry.target.getAttribute("data-animate"));
          }
        });
      },
      {
        threshold: 0.1, // Animasi akan berjalan saat 10% komponen terlihat
      }
    );

    // Mengamati setiap elemen di sectionRefs
    sectionRefs.current.forEach((section) => {
      if (section) observer.observe(section);
    });

    // Membersihkan observer saat komponen unmount
    return () => {
      sectionRefs.current.forEach((section) => {
        if (section) observer.unobserve(section);
      });
    };
  }, []);

  return (
    <div className="bg-background">
      {/* Section Welcome dengan animasi dari kiri */}
      <div
        ref={(el) => (sectionRefs.current[0] = el)}
        data-animate="animate-slideInLeft" // Setiap section memiliki animasi berbeda
        className="opacity-0"
      >
        <Welcome />
      </div>

      {/* Section Programs dengan animasi dari kanan */}
      <div
        ref={(el) => (sectionRefs.current[1] = el)}
        data-animate="animate-slideInRight"
        className="opacity-0"
      >
        <Programs />
      </div>

      {/* Section Values dengan animasi dari atas */}
      <div
        ref={(el) => (sectionRefs.current[2] = el)}
        data-animate="animate-slideInTop"
        className="opacity-0"
      >
        <Values />
      </div>

      {/* Section FAQs dengan animasi dari bawah */}
      <div
        ref={(el) => (sectionRefs.current[3] = el)}
        data-animate="animate-slideInBottom"
        className="opacity-0"
      >
        <FAQs />
      </div>

      {/* Section Testimonials dengan animasi dari kiri lagi */}
      <div
        ref={(el) => (sectionRefs.current[4] = el)}
        data-animate="animate-slideInLeft"
        className="opacity-0"
      >
        <Testimonials />
      </div>
    </div>
  );
};

export default Home;
