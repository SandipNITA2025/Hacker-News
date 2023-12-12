import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

import axios from "axios";
import { Search } from "lucide-react";
import { Loader2 } from "lucide-react";

const API_BASE_URL = "http://hn.algolia.com/api/v1";

const Home = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const router = useNavigate();
  const [allResults, setAllResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (query.trim() !== "") {
        try {
          setLoading(true);
          const response = await axios.get(
            `${API_BASE_URL}/search?query=${query}`
          );
          setResults(response.data.hits);
          setShowDropdown(true);
        } catch (error) {
          console.error("Error fetching search results:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setResults([]);
        setShowDropdown(false);
      }
    };

    fetchSearchResults();
  }, [query]);

  const handlePostClick = (id) => {
    router(`/details/${id}`);
    setResults([]);
  };

  const handleSearch = async () => {
    if (query.trim() !== "") {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/search?query=${query}`
        );
        setAllResults(response.data.hits);
      } catch (error) {
        console.error("Error fetching search results:", error);
      }
    } else {
      setAllResults([]);
    }

    setShowDropdown(false);
  };

  return (
    <div className="w-full flex items-center flex-col justify-center mx-auto p-4 mt-4 relative">
      <div className="shadow-xl  w-[320px] bg-[#303030] p-2 px-4 rounded-[4rem] flex items-center relative">
        <input
          className="bg-transparent w-full outline-none focus:border-purple-200 focus:outline-none"
          type="text"
          placeholder="Search Hacker News"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button onClick={handleSearch}>
          <Search />
        </button>

        {/* ----- drop down------- */}
        {query.trim() !== "" && (
          <div
            className={` ${
              showDropdown
                ? "absolute bg-[#303030] rounded-[.6rem]  top-12 left-0 w-full  shadow-md min-h-[220px]"
                : " hidden"
            } `}
          >
            {loading && (
              <div className="w-full min-h-[220px] flex items-center justify-center">
                <Loader2 className="animate-spin" />
              </div>
            )}
            {results.length > 0 && !loading && (
              <div>
                <ul className="py-2">
                  {results.slice(0, 5).map((result) => (
                    <li key={result?.objectID}>
                      <Link to={`/details/${result?.objectID}`}>
                        <p
                          className=" flex items-start px-4 py-2 hover:bg-[#444343]"
                          onClick={() => handlePostClick(result?.objectID)}
                        >
                          {result.title}
                        </p>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>

      {/* --------- show all data after click --------  */}
      <div className=" mt-20 w-[90%] md:w-full h-full flex gap-6 md:gap-4 items-center justify-center flex-wrap">
        {allResults.length > 0 ? (
          allResults?.map((result) => (
            <Link key={result.objectID} to={`/details/${result.objectID}`}>
              <div className=" w-[200px] md:w-[150px] min-h-[110px] p-2 shadow-xl bg-[#303030] hover:bg-[#484747] rounded-[.6rem]">
                <p className=" text-center">{result.title}</p>
              </div>
            </Link>
          ))
        ) : (
          <div className=" min-h-[500px] flex items-center justify-center">
            <p className="text-white text-[5rem] md:text-[1.5rem]">
              Please search something!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
