import React from "react";
import Loader from "./Loader";
import ApiResponse from "../interfaces/ApiResponse";
import "../styles/PeopleList.css";

interface PeopleListProps {
  data: ApiResponse | null;
  selectedItem: string | null;
  isLoading: boolean;
  handleItemClick: (url: string) => void;
}

const PeopleList: React.FC<PeopleListProps> = ({
  data,
  selectedItem,
  isLoading,
  handleItemClick,
}) => {
  return (
    <aside className="dropdown">
      <div className="dropdown-content">
        <ul>
          {data && data.results ? (
            data.results.map((item) => (
              <li
                key={item.url}
                className={`custom-li ${
                  item.url === selectedItem ? "active" : ""
                }`}
                onClick={() => handleItemClick(item.url)}
              >
                <div>
                  <p className="name">{item.name}</p>
                  <p className="species">{item.species.join(", ")}</p>
                </div>
                <span className="arrow">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <g clipPath="url(#clip0_19114_17)">
                      <path
                        d="M8.58984 16.59L13.1698 12L8.58984 7.41L9.99984 6L15.9998 12L9.99984 18L8.58984 16.59Z"
                        fill="black"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_19114_17">
                        <rect width="24" height="24" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                </span>
              </li>
            ))
          ) : (
            <div></div>
          )}
        </ul>
        {isLoading ? (
          <div className="loader-container">
            <Loader /> Loader
          </div>
        ) : null}
      </div>
    </aside>
  );
};

export default PeopleList;
