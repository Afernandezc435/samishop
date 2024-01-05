import { useState, useEffect, useCallback } from "react";
import "./styles/App.css";
import ApiResponsePeople from "./interfaces/ApiResponsePeople";
import ApiResponse from "./interfaces/ApiResponse";
import ApiResponseSpecies from "./interfaces/ApiResponseSpecies";
import PeopleList from "./components/PeopleList";
import CharacterDetails from "./components/CharacterDetails";
import ResponseResult from "./interfaces/ResponseResult";
import ApiResponseVehicles from "./interfaces/ApiResponseVehicles";

function App() {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [people, setPeople] = useState<ApiResponsePeople | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  const fetchSpecies = async (response: ApiResponse) : Promise<Array<ResponseResult>> => {
    response.results.map(async (res, index) => {
      if (res.species.length > 0) {
        const speciesResponse = await fetch(`${res.species[0]}`);
        const species = await (speciesResponse.json()) as ApiResponseSpecies;
        response.results[index].species = [species.name];
      }
      return res as ResponseResult;
    })
    return response.results;
  }

  const fetchVehicles = async (vehicles: Array<string>) : Promise<Array<string>> => {
    vehicles.map(async (veh, index) => {
      const vehicleResponse = await fetch(`${veh}`);
      const vehicle = await (vehicleResponse.json()) as ApiResponseVehicles;
      vehicles[index] = vehicle.name
      return vehicle.name
    })
    return vehicles;
  }

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `https://swapi.dev/api/people/?page=${page}`,
      );
      const result = (await response.json()) as ApiResponse;
      result.results = await fetchSpecies(result)
      setData((prevData) => {
        if (prevData && result.results[0].name === prevData.results[0].name) {
          return prevData;
        }
        return {
          count: result.count,
          next: result.next,
          results: prevData
            ? [...prevData.results, ...result.results]
            : result.results,
        };
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  }, [page]);

  const fetchPeople = async (url: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(url);
      const result = (await response.json()) as ApiResponsePeople;

      result.vehicles = await fetchVehicles(result.vehicles)

      setPeople(() => result as ApiResponsePeople);

    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (page === 1) {
      fetchData();
    }
  }, [page, fetchData]);

  const handleScroll = useCallback(() => {
    const { scrollTop, clientHeight, scrollHeight } = document.documentElement;
    if (
      scrollTop + clientHeight >= scrollHeight - 10 &&
      !isLoading &&
      data &&
      data.next !== null
    ) {
      setPage((prevPage) => prevPage + 1);
    }
  }, [data, isLoading]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  useEffect(() => {
    if (page > 1) {
      fetchData();
    }
  }, [page, fetchData]);

  return (
    <div>
      <nav className="navbar">
        <h1>Ravn Star Wars Registry</h1>
      </nav>
      <main className="main">
        <PeopleList
          data={data}
          selectedItem={selectedItem}
          isLoading={isLoading}
          handleItemClick={(url) => {
            setSelectedItem(url === selectedItem ? null : url);
            fetchPeople(url);
          }}
        />
        <CharacterDetails people={people} selectedItem={selectedItem} />
      </main>
    </div>
  );
}

export default App;