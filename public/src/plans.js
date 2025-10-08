document.addEventListener("DOMContentLoaded", async () => {
    const plansList = document.getElementById("plans-list");
    const currentUsername = document.getElementById("username");
    const fetchUser = async () => {
        try{
            const res = await fetch("/user");
            if(res.ok){
                const user = await res.json();
                currentUsername.innerText = user.username;
                return user;
            }else{
                return null;
            };
        }catch(error){
            console.error(error);
            return null;
        };
    };
    const fetchPlans = async () => {
        const user = await fetchUser();
        if(!user){
            console.log("User not logged in.");
            return;
        };
        try{
            const res = await fetch("/user/plans");
            if(res.ok){
                const plans = await res.json();
                yourPlans(plans);
            }else{
                console.error(error);
                return;
            };
        }catch(error){
            console.error(error);
        };
    };
    const yourPlans = async (plans) => {
        if(plans.length === 0){
            plansList.innerHTML = "<p>You have no plans yet. Join bars and add them here.</p>";
            return;
        };
        plansList.innerHTML = "";
        plans.forEach(p => {
            const card = document.createElement("div");
            card.className = "p-3 m-3 h-75 w-75 border border-primary border-2";
            //images
            const img = document.createElement("img");
            img.src = p.image_url;
            img.alt = p.name;
            img.title = p.name;
            img.className = "w-50 h-50 mx-auto d-block rounded";
            //description
            const cardBody = document.createElement("div");
            cardBody.className = "mt-3";
            //name of bar
            const barName = document.createElement("h4");
            barName.className = "text-center";
            barName.innerText = p.name;
            //location
            const loc = document.createElement("p");
            loc.innerHTML = `<strong>Located at: </strong>${p.location}`;
            //rating
            const rate = document.createElement("p");
            rate.innerHTML = `<strong>Rating: </strong>${p.rating}`;
            //yelp url
            const yelp_url = document.createElement("a");
            yelp_url.className = "d-block";
            yelp_url.href = p.url;
            yelp_url.setAttribute("target", "_blank");
            yelp_url.innerText = `Visit ${p.name} on Yelp`;
            //button
            const leaveBtn = document.createElement("button");
            leaveBtn.className = "btn btn-danger mt-3";
            leaveBtn.innerText = "Remove Bar";
            leaveBtn.onclick = () => leaveBar(p.barId);
            cardBody.appendChild(barName);
            cardBody.appendChild(loc);
            cardBody.appendChild(rate);
            cardBody.appendChild(yelp_url);
            cardBody.appendChild(leaveBtn);
            card.appendChild(img);
            card.appendChild(cardBody);
            plansList.appendChild(card);
        });
    };
    const leaveBar = async (barId) => {
        try{
            await fetch ("/plan/remove", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({barId})
            });
            alert("Successfully deleted the bar plan.")
            fetchPlans();
        }catch(error){
            console.error(error);
        };
    };
    window.onload = () => fetchPlans();
    window.leaveBar = leaveBar;
});