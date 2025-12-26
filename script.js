let currentUser = null;
let adminForce = "";

function getUsers() {
  return JSON.parse(localStorage.getItem("users") || "{}");
}

function saveUsers(users) {
  localStorage.setItem("users", JSON.stringify(users));
}

function register() {
  const u = user.value;
  const p = pass.value;
  const users = getUsers();
  if (users[u]) return alert("Tài khoản đã tồn tại");
  users[u] = { pass: p, balance: 1000, history: [], road: [] };
  saveUsers(users);
  alert("Đăng ký thành công");
}

function login() {
  const u = user.value;
  const p = pass.value;
  const users = getUsers();
  if (!users[u] || users[u].pass !== p) return alert("Sai tài khoản");
  currentUser = u;
  auth.classList.add("hidden");
  game.classList.remove("hidden");
  username.innerText = u;
  render();
}

function play(choice) {
  const users = getUsers();
  const betAmount = Number(bet.value);
  if (betAmount <= 0 || betAmount > users[currentUser].balance)
    return alert("Cược không hợp lệ");

  adminForce = adminResult.value;

  let dice = [
    rand(), rand(), rand()
  ];
  let sum = dice.reduce((a,b)=>a+b,0);
  let result = sum >= 11 ? "tai" : "xiu";

  if (adminForce) result = adminForce;

  let win = result === choice;
  users[currentUser].balance += win ? betAmount : -betAmount;

  users[currentUser].history.unshift(
    `${win ? "Thắng" : "Thua"} | ${result.toUpperCase()} | ${sum}`
  );
  users[currentUser].road.unshift(result === "tai" ? "T" : "X");

  saveUsers(users);
  render(result, sum);
}

function rand() {
  return Math.floor(Math.random()*6)+1;
}

function render(result, sum) {
  const u = getUsers()[currentUser];
  balance.innerText = u.balance;
  history.innerHTML = u.history.slice(0,10).map(h=>`<li>${h}</li>`).join("");
  road.innerHTML = u.road.slice(0,20).map(r=>`<span>${r}</span>`).join("");
  if (result)
    document.getElementById("result").innerText =
      `Kết quả: ${result.toUpperCase()} (${sum})`;
}
