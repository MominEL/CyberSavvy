document.addEventListener("DOMContentLoaded", () => {
    // You can fetch or generate leaderboard data dynamically here
    // For example:
    // fetch('/api/leaderboard')
    //   .then(res => res.json())
    //   .then(data => {
    //     populateLeaderboard(data);
    //   });
  
    function populateLeaderboard(data) {
      const tableBody = document.getElementById("leaderboardData");
      tableBody.innerHTML = "";
      data.forEach((entry, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${index + 1}</td>
          <td>${entry.player}</td>
          <td>${entry.score}</td>
        `;
        tableBody.appendChild(row);
      });
    }
  });
  