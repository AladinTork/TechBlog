document
  .getElementById("sign-up-form")
  .addEventListener("submit", async (event) => {
    event.preventDefault(); // Prevent the form from submitting normally

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    if (!username || !password) {
      alert("Both fields are required!");
      return;
    }

    const newUser = { username, password };

    try {
      // Fetch current user data from userData.json
      const response = await fetch("/api/users"); // Ensure you have this endpoint to fetch the users
      const existingUsers = await response.json();

      // Check if username already exists
      const userExists = existingUsers.some(
        (user) => user.username === newUser.username
      );
      if (userExists) {
        alert("Username already exists. Please choose a different one.");
        return;
      }

      // Add new user to the data array
      existingUsers.push(newUser);

      // Send the updated users array back to the server
      await fetch("/api/users", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(existingUsers),
      });

      // Redirect the user to the login page after successful sign-up
      window.location.href = "/login";
    } catch (error) {
      console.error("Error during sign-up:", error);
      alert("There was an error during the sign-up process. Please try again.");
    }
  });
