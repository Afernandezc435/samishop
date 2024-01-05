import React from "react";
import "../styles/CharacterDetails.css";
import ApiResponsePeople from "../interfaces/ApiResponsePeople";


interface CharacterDetailsProps {
  people: ApiResponsePeople | null;
  selectedItem: string | null;
}

const CharacterDetails: React.FC<CharacterDetailsProps> = ({
  people,
  selectedItem,
}) => {
  return (
    <article className="character-details">
      {selectedItem && people ? (
        <div className="general-information">
          <h3>General Information</h3>
          <section>
            <ul>
              <li className="people-information">
                <span>Eye color</span>
                <span>{people.eye_color}</span>
              </li>
              <li className="people-information">
                <span>Hair Color</span>
                <span>{people.hair_color}</span>
              </li>
              <li className="people-information">
                <span>Skin Color</span>
                <span>{people.skin_color}</span>
              </li>
              <li className="people-information">
                <span>Birth Year</span>
                <span>{people.birth_year}</span>
              </li>
            </ul>
          </section>
          <h3>Vehicles</h3>
          <section>
            <ul>
              {people.vehicles ? (
                people.vehicles.map((v, index) => (
                  <li key={index} className="people-information">
                    <span>{v}</span>
                  </li>
                ))
              ) : (
                <span></span>
              )}
            </ul>
          </section>
        </div>
      ) : (
        <div className="no-people">
          <p>Seleccione un personaje</p>
        </div>
      )}
    </article>
  );
};

export default CharacterDetails;
