import LoadingSpinner from "./LoadingSpinner";

const HomeLoader = () => {
  return (
    <div className="h-screen flex justify-center items-center">
      <LoadingSpinner size="lg" />
    </div>
  );
};

export default HomeLoader;
