
document.getElementById('firstName').addEventListener('input', generateUsername);
document.getElementById('lastName').addEventListener('input', generateUsername);

function generateUsername() {
  const firstName = document.getElementById('firstName').value.trim();
  const lastName = document.getElementById('lastName').value.trim();
  const username = (firstName + '.' + lastName).toLowerCase();
  document.getElementById('username').value = username;
}
