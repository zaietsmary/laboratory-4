document.addEventListener("DOMContentLoaded", function () {
  updateAuthButtons();
  initializeAdmin(); 

  const modal = `
    <div class="modal-overlay" id="modal">
      <div class="modal">
        <span class="close" onclick="closeModal()">×</span>
        <div class="tabs">
          <button id="tab-login" class="active" onclick="switchForm('login')">Login</button>
          <button id="tab-register" onclick="switchForm('register')">Register</button>
        </div>

        <form id="login-form" class="active">
          <div class="input-field">
            <label>Email</label>
            <input name="loginEmail" required />
          </div>
          <div class="input-field">
            <label>Password</label>
            <input name="loginPassword" required />
          </div>
          <div class="input-field">
            <button type="submit">Log In</button>
          </div>
          <div class="message" id="login-message"></div>
        </form>

        <form id="register-form">
          <div class="input-field">
            <label>Name *</label>
            <input type="text" name="name" required />
          </div>
          <div class="input-field">
            <label>Email *</label>
            <input name="email" required />
          </div>
          <div class="input-field">
            <label>Password *</label>
            <input name="password" required minlength="6" />
          </div>
          <div class="input-field">
            <label>Repeat password *</label>
            <input name="repeatPassword" required />
          </div>
          <div class="input-field">
            <button type="submit">Register</button>
          </div>
          <div class="message" id="register-message"></div>
        </form>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML("beforeend", modal);

  document.getElementById("register-form").addEventListener("submit", handleRegister);
  document.getElementById("login-form").addEventListener("submit", handleLogin);

  window.addEventListener("click", function (e) {
    if (e.target.id === "modal") closeModal();
  });
});

function initializeAdmin() {
  const admin = {
    email: "admin@example.com",
    password: "Admin123",
    role: "admin"
  };

  const savedAdmins = JSON.parse(localStorage.getItem("admins")) || [];
  const alreadyExists = savedAdmins.find(a => a.email === admin.email);

  if (!alreadyExists) {
    savedAdmins.push(admin);
    localStorage.setItem("admins", JSON.stringify(savedAdmins));
  }
}

function handleRegister(e) {
  e.preventDefault();
  const name = e.target.name.value.trim();
  const email = e.target.email.value.trim();
  const password = e.target.password.value;
  const repeat = e.target.repeatPassword.value;
  const message = document.getElementById("register-message");

  let errors = [];

  if (!name || !email || !password || !repeat) {
    errors.push("Усі поля є обов’язковими.");
  }

  if (password.length < 6) {
    errors.push("Пароль має містити щонайменше 6 символів.");
  }

  if (password !== repeat) {
    errors.push("Паролі не збігаються.");
  }

  if (errors.length > 0) {
    message.innerHTML = errors.map(err => `<p style="color:red">${err}</p>`).join("");
  } else {
    message.innerHTML = `<p style="color:green">Реєстрація пройшла успішно!</p>`;
    e.target.reset();

    // Перевірка на роль адміністратора
    if (email === "admin@example.com" && password === "Admin123") {
      setLoggedIn('admin'); 
    } else {
      setLoggedIn('user');  
    }
  }
}

function handleLogin(e) {
  e.preventDefault();
  const email = e.target.loginEmail.value.trim();
  const password = e.target.loginPassword.value;
  const message = document.getElementById("login-message");

  if (!email || !password || password.length < 6) {
    message.innerHTML = `<p style="color:red">Авторизація не пройдена. Спробуйте ще раз.</p>`;
  } else {
    // Перевірка на існуючого адміністратора
    const savedAdmins = JSON.parse(localStorage.getItem("admins")) || [];
    const admin = savedAdmins.find(a => a.email === email && a.password === password);
    
    if (admin) {
      message.innerHTML = `<p style="color:green">Авторизація успішна як адміністратор!</p>`;
      setLoggedIn('admin');
    } else {
      message.innerHTML = `<p style="color:green">Авторизація успішна!</p>`;
      setLoggedIn('user'); 
    }
    e.target.reset();
  }
}

function setLoggedIn(role = 'user') {
  localStorage.setItem("loggedIn", "true");
  localStorage.setItem("userRole", role);    
  updateAuthButtons();
  closeModal();
}

function openModal(type = 'login') {
  document.getElementById("modal").style.display = "flex";
  switchForm(type);
}

function closeModal() {
  document.getElementById("modal").style.display = "none";
}

function switchForm(type) {
  const loginForm = document.getElementById("login-form");
  const registerForm = document.getElementById("register-form");
  const loginTab = document.getElementById("tab-login");
  const registerTab = document.getElementById("tab-register");

  loginForm.classList.remove("active");
  registerForm.classList.remove("active");
  loginTab.classList.remove("active");
  registerTab.classList.remove("active");

  if (type === "register") {
    registerForm.classList.add("active");
    registerTab.classList.add("active");
  } else {
    loginForm.classList.add("active");
    loginTab.classList.add("active");
  }
}

function updateAuthButtons() {
  const isLoggedIn = localStorage.getItem("loggedIn") === "true";
  const userRole = localStorage.getItem("userRole");
  const authBtn = document.getElementById("auth-btn");
  const logoutBtn = document.getElementById("logout-btn");
  const adminBtns = document.getElementsByClassName("admin-btn"); 

  if (authBtn && logoutBtn) {
    authBtn.style.display = isLoggedIn ? "none" : "inline-block";
    logoutBtn.style.display = isLoggedIn ? "inline-block" : "none";
  }

  // Виводимо/сховуємо кнопки для адміністратора
  if (userRole === "admin") {
    for (let btn of adminBtns) {
      btn.style.display = "inline-block";
    }
  } else {
    for (let btn of adminBtns) {
      btn.style.display = "none";
    }
  }
}

function logout() {
  localStorage.removeItem("loggedIn");
  localStorage.removeItem("userRole");
  updateAuthButtons();

  const registerMsg = document.getElementById("register-message");
  const loginMsg = document.getElementById("login-message");
  if (registerMsg) registerMsg.innerHTML = "";
  if (loginMsg) loginMsg.innerHTML = "";

  alert("Ви вийшли з акаунту.");
}