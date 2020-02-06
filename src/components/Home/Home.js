import React, { useState, useEffect } from "react";
import {
  API_URL,
  API_KEY,
  IMAGE_BASE_URL,
  POSTER_SIZE,
  BACKDROP_SIZE
} from "../../config";
import HeroImage from "../elements/HeroImage/HeroImage";
import SearchBar from "../elements/SearchBar/SearchBar";
import FourColGrid from "../elements/FourColGrid/FourColGrid";
import MovieThumb from "../elements/MovieThumb/MovieThumb";
import LoadMoreBtn from "../elements/LoadMoreBtn/LoadMoreBtn";
import Spinner from "../elements/Spinner/Spinner";
import "./Home.css";

import { useFetchMovies } from "./customHook";

const Home = () => {
  const [{ state, isLoading }, fetchMovies] = useFetchMovies();

  const searchItems = searchTerm => {
    let endpoint = `${API_URL}search/movie?api_key=${API_KEY}&query=${searchTerm}`;

    if (!searchTerm) {
      endpoint = `${API_URL}movie/popular?api_key=${API_KEY}`;
    }
    fetchMovies(endpoint);
  };

  const loadMoreItems = () => {
    const { searchTerm, currentPage } = state;
    let endpoint = `${API_URL}search/movie?api_key=${API_KEY}&query=${searchTerm}&page=${currentPage +
      1}`;

    if (!searchTerm) {
      endpoint = `${API_URL}movie/popular?api_key=${API_KEY}&page=${currentPage +
        1}`;
    }
    fetchMovies(endpoint);
  };

  return (
    <div className="rmdb-home">
      {state.heroImage && !state.searchTerm ? (
        <div>
          <HeroImage
            image={`${IMAGE_BASE_URL}${BACKDROP_SIZE}${state.heroImage.backdrop_path}`}
            title={state.heroImage.original_title}
            text={state.heroImage.overview}
          />
        </div>
      ) : null}
      <SearchBar callback={searchItems} />
      <div className="rmdb-home-grid">
        <FourColGrid
          header={state.searchTerm ? "Search result" : "Popular Movies"}
          loading={isLoading}
        >
          {state.movies.map((element, i) => {
            return (
              <MovieThumb
                key={i}
                clickable={true}
                image={
                  element.poster_path
                    ? `${IMAGE_BASE_URL}${POSTER_SIZE}${element.poster_path}`
                    : "./images/no_image.jpg"
                }
                movieId={element.id}
                movieName={element.original_title}
              />
            );
          })}
        </FourColGrid>
        {isLoading ? <Spinner /> : null}
        {state.currentPage <= state.totalPages && !isLoading ? (
          <LoadMoreBtn text="Load More" onClick={loadMoreItems} />
        ) : null}
      </div>
    </div>
  );
};

export default Home;
