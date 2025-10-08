document.addEventListener("DOMContentLoaded", async () => {
    const searchResults = document.getElementById("search-results");
    const searchBtn = document.getElementById("search-btn");
    const fetchLocation = async (location) => {
        if(!location){
            console.log("No location.");
            return;
        };
        try{
            const res = await fetch("/search?location=" + encodeURIComponent(location));
            if(!res.ok){
                console.error(res.statusText);
                return;
            }else{
                const bars = await res.json();
                if(bars.length === 0){
                    console.log("Bars not found.");
                    return;
                };
                searchResults.innerHTML = "";
                bars.forEach(b => {
                    const card = document.createElement("div");
                    card.className = "p-3 m-3 h-75 w-75 border border-primary border-2";
                    //images
                    const img = document.createElement("img");
                    img.src = b.image_url;
                    img.alt = b.name;
                    img.title = b.name;
                    img.className = "w-50 h-50 mx-auto d-block rounded";
                    //description
                    const cardBody = document.createElement("div");
                    cardBody.className = "mt-3";
                    //name of bar
                    const barName = document.createElement("h4");
                    barName.innerText = b.name;
                    //location
                    const loc = document.createElement("p");
                    loc.innerHTML = `<strong>Located at: </strong>${b.location}`;
                    //rating
                    const rate = document.createElement("p");
                    rate.innerHTML = `<strong>Rating: </strong>${b.rating}`;
                    //going
                    const going = document.createElement("p");
                    going.innerHTML = `<strong>Going Tonight: </strong>${b.going}`;
                    cardBody.appendChild(barName);
                    cardBody.appendChild(loc);
                    cardBody.appendChild(rate);
                    cardBody.appendChild(going);
                    //yelp url
                    const message = document.createElement("p");
                    const loginLink = document.createElement("a");
                    loginLink.href = "/login.html";
                    loginLink.innerText = "Login if you want to go.";
                    message.appendChild(loginLink);
                    cardBody.appendChild(message);
                    card.appendChild(img);
                    card.appendChild(cardBody);
                    searchResults.appendChild(card);
                });
            };
        }catch(error){
            console.error(error);
        };
    };
    searchBtn.addEventListener("click", () => {
        const location = document.getElementById("search").value.trim();
        if(!location){
            alert("You must enter a location first.");
        };
        fetchLocation(location);
    });
});