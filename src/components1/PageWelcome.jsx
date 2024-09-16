/* eslint-disable jsx-a11y/img-redundant-alt */
const PageWelcome = ({ title, children }) => {
  return (
    <header className="page-welcome">
      <div className="page-welcome-container">
        <div className="page-welcome-image"></div>
        <div className="welcome-content">
          <h2>{title}</h2>
          <p>{children}</p>
        </div>
      </div>
    </header>
  );
};

export default PageWelcome;
