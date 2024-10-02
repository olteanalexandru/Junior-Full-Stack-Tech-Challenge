import { Heart, Search } from "lucide-react";

const FavoriteItem = ({ title }: { title: string }) => (
  <div className="d-flex align-items-center justify-content-between p-3 bg-light rounded mb-2">
    <div className="d-flex align-items-center">
      <div className="bg-secondary rounded me-3" style={{width: '48px', height: '48px'}}></div>
      <span>{title}</span>
    </div>
    <Heart color="purple" size={24} />
  </div>
);

const FavoritesPage = () => {
  return (
    <div className="container-fluid bg-white min-vh-100 p-4">
      <h1 className="h2 mb-4">Home Page</h1>
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="position-relative mb-4">
            <input
              type="text"
              placeholder="What do you want to do or try?"
              className="form-control form-control-lg rounded-pill pe-5"
            />
            <Search className="position-absolute top-50 end-0 translate-middle-y me-3 text-muted" size={24} />
          </div>
          <h2 className="h4 mb-3">Favorites</h2>
          <div>
            <FavoriteItem title="Medical professions" />
            <FavoriteItem title="Medical professions" />
            <FavoriteItem title="Medical professions" />
            <FavoriteItem title="Medical professions" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FavoritesPage;