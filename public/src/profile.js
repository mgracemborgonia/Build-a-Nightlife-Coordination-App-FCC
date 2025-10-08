document.addEventListener("DOMContentLoaded", async () => {
    const searchResults = document.getElementById("search-results");
    const currentUsername = document.getElementById("username");
    const searchBtn = document.getElementById("search-btn");
    const fetchUser = async () => {
        try{
            const res = await fetch("/user");
            if(res.ok){
                const user = await res.json();
                currentUsername.innerText = user.username;
                return user;
            }else{
                return null;
            }
        }catch(error){
            console.error(error);
            return null;
        }
    };
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
                const user = await fetchUser();
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
                    barName.className = "text-center";
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
                    //button
                    if(user){
                        const joinBtn = document.createElement("button");
                        joinBtn.className = "btn btn-success";
                        joinBtn.innerText = "Click to go";
                        joinBtn.onclick = () => joinBar(b.id);
                        cardBody.appendChild(joinBtn);
                    }
                    card.appendChild(img);
                    card.appendChild(cardBody);
                    searchResults.appendChild(card);
                });
            };
        }catch(error){
            console.error(error);
        };
    };
    const joinBar = async (barId) => {
        try{
            await fetch ("/plan/add", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({barId})
            });
            alert("Successfully joined the bar plan.")
            window.location.href = "/plans.html";
        }catch(error){
            console.error(error);
        };
    };
    searchBtn.addEventListener("click", () => {
        const location = document.getElementById("search").value.trim();
        if(!location){
            alert("You must enter a location first.");
        }
        fetchLocation(location);
    });
    window.onload = () => fetchUser();
    window.joinBar = joinBar;
});
