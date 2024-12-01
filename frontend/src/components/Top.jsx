import React from "react";
import Fries from "../assets/images/Fries.png";
import Bread from "../assets/images/Bread.png";
import Soup from "../assets/images/Soup.png";
function Top() {
  return (
    <section class="top-rated">
        <h2>Top rated recipes</h2>
        <div class="recipes">
            <div class="recipe-card">
                <img src={Soup} alt="Soup"></img>
                <h3>Supa la plic</h3>
                <p>★★★★★</p>
                <p class="author">Author: Mari</p>
            </div>
            <div class="recipe-card">
                <img src={Bread} alt="Bread"></img>
                <h3>Paine cu pateu</h3>
                <p>★★★★★</p>
                <p class="author">Author: Croi</p>
            </div>
            <div class="recipe-card">
                <img src={Fries} alt="Fries"></img>
                <h3>Cartofi prăjiți</h3>
                <p>★★★★★</p>
                <p class="author">Author: Edi</p>
            </div>
        </div>
    </section>
  );
}

export default Top