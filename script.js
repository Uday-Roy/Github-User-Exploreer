// ========== GITHUB EXPLORER LOGIC ==========
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const loading = document.getElementById("loading");
const errorDiv = document.getElementById("error");
const userCard = document.getElementById("userCard");
const reposSection = document.getElementById("repos");
const repoList = document.getElementById("repoList");

searchBtn.addEventListener("click", () => {
  const username = searchInput.value.trim();
  if (username) {
    fetchUserData(username);
  } else {
    showError("Please enter a GitHub username");
  }
});

searchInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    searchBtn.click();
  }
});

async function fetchUserData(username) {
  hideResults();
  loading.style.display = "block";

  try {
    const userRes = await fetch(`https://api.github.com/users/${username}`);
    if (!userRes.ok) {
      if (userRes.status === 404) throw new Error("User not found");
      else throw new Error("API error. Try again later.");
    }
    const user = await userRes.json();
    displayUser(user);

    const reposRes = await fetch(user.repos_url);
    const repos = await reposRes.json();
    displayRepos(repos);
  } catch (err) {
    showError(err.message);
  } finally {
    loading.style.display = "none";
  }
}

function displayUser(user) {
  userCard.style.display = "flex";
  userCard.innerHTML = `
        <img src="${user.avatar_url}" alt="${user.login}" class="user-avatar">
        <div class="user-info">
            <h2>${user.name || user.login}</h2>
            <p><i class="fas fa-user"></i> ${user.login}</p>
            ${user.bio ? `<p><i class="fas fa-quote-right"></i> ${user.bio}</p>` : ""}
            <p><i class="fas fa-map-marker-alt"></i> ${user.location || "Not specified"}</p>
            <p><i class="fas fa-users"></i> Followers: ${user.followers} · Following: ${user.following}</p>
            <p><i class="fas fa-code-branch"></i> Public Repos: ${user.public_repos}</p>
        </div>
    `;
}

function displayRepos(repos) {
  if (repos.length === 0) {
    reposSection.style.display = "none";
    return;
  }

  reposSection.style.display = "block";
  const sorted = repos
    .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
    .slice(0, 5);
  repoList.innerHTML = sorted
    .map(
      (repo) => `
        <div class="repo-card">
            <a href="${repo.html_url}" target="_blank">${repo.name}</a>
            <p>${repo.description || "No description"}</p>
            <div class="repo-stats">
                <span><i class="fas fa-star"></i> ${repo.stargazers_count}</span>
                <span><i class="fas fa-code-branch"></i> ${repo.forks_count}</span>
                <span><i class="fas fa-circle" style="color: ${repo.language ? "#f1e05a" : "#ccc"};"></i> ${repo.language || "N/A"}</span>
            </div>
        </div>
    `,
    )
    .join("");
  repoList.classList.add("repo-list");
}

function showError(msg) {
  errorDiv.textContent = msg;
  errorDiv.style.display = "block";
  userCard.style.display = "none";
  reposSection.style.display = "none";
}

function hideResults() {
  userCard.style.display = "none";
  reposSection.style.display = "none";
  errorDiv.style.display = "none";
}

// ========== MOBILE MENU TOGGLE ==========
const hamburger = document.getElementById("hamburger");
const navMenu = document.getElementById("nav-menu");

hamburger.addEventListener("click", () => {
  navMenu.classList.toggle("active");
});

// Close menu when a link is clicked (for single page)
document.querySelectorAll(".nav-menu a").forEach((link) => {
  link.addEventListener("click", () => {
    navMenu.classList.remove("active");
  });
});

// ========== CONTACT FORM (simple frontend) ==========
const contactForm = document.getElementById("contactForm");
contactForm.addEventListener("submit", (e) => {
  e.preventDefault();
  alert("Thank you for your message! (This is a demo – no actual email sent.)");
  contactForm.reset();
});
