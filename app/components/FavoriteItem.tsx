


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

export default FavoriteItem;