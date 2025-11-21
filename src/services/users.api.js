const API_URL = "http://localhost:8080/api/users";

// Fetch all users
export function fetchUsers() {
  return fetch(API_URL, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("Network response was not ok.");
      }
    })
    .catch((error) => {
      console.error("Error fetching users:", error);
      throw error;
    });
}

// Fetch user by ID
export function fetchUserById(userId) {
  return fetch(`${API_URL}/${userId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("Network response was not ok.");
      }
    })
    .catch((error) => {
      console.error("Error fetching user by ID:", error);
      throw error;
    });
}

// Create a new user
export function createUser(userData, onError) {
  return fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        return response.json().then((errorData) => {
          const error = new Error("Failed to create user.");
          error.data = errorData;
          throw error;
        });
      }
    })
    .catch((error) => {
      if (onError) {
        onError(error);
      }
      throw error;
    });
}

// Update an existing user
export function updateUser(userId, userData, onError) {
  return fetch(`${API_URL}/${userId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        return response.json().then((errorData) => {
          const error = new Error("Failed to update user.");
          error.data = errorData;
          throw error;
        });
      }
    })
    .catch((error) => {
      if (onError) {
        onError(error);
      }
      throw error;
    });
}

// Delete a user by ID
export function deleteUser(userId, onError) {
  return fetch(`${API_URL}/${userId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        return response.json().then((errorData) => {
          const error = new Error("Failed to delete user.");
          error.data = errorData;
          throw error;
        });
      }
    })
    .catch((error) => {
      if (onError) {
        onError(error);
      }
      throw error;
    });
}

// Delete all users
export function deleteAllUsers() {
  return fetch(API_URL, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("Network response was not ok.");
      }
    })
    .catch((error) => {
      console.error("Error deleting all users:", error);
      throw error;
    });
}
