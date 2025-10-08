document.addEventListener("DOMContentLoaded", async () => {
    const loginForm = document.getElementById("loginform");
    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const username = document.getElementById("username-login").value;
        const password = document.getElementById("password-login").value;
        try{
            const res = await fetch("/login", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({username, password})
            });
            if(res.ok) {
                alert(`${username} now logged in.`);
                window.location.href = "/profile.html";
            }else{
                const error = await res.text();
                alert(error);
            }
        }catch(error){
            alert('Error login. Please try again later.');
            console.error(error);
        }
    });
});