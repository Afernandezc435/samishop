import "../styles/Loader.css";

const Loader = () => (
  <div className="lds-spinner">
    {[...Array(12)].map((_, index) => (
      <div key={index} />
    ))}
  </div>
);

export default Loader;
