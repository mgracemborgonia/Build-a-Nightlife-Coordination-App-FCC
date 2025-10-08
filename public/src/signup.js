document.addEventListener("DOMContentLoaded", async () => {
    const signupForm = document.getElementById("signupform");
    signupForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const firstname = document.getElementById("firstname").value;
        const lastname = document.getElementById("lastname").value;
        const username = document.getElementById("username-signup").value;
        const password = document.getElementById("password-signup").value;
        try{
            const res = await fetch("/signup", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify({firstname, lastname, username, password})
            });
            if(res.ok) {
                alert("You signed up successfully! You can now log in.");
                window.location.href = "/login.html";
            }else{
                const error = await res.text();
                alert(error);
            }
        }catch(error){
            alert('Error registration. Please try again later.');
            console.error(error);
        }
    });
})