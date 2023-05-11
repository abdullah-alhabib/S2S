// Get the modal
// Get the modals and buttons
var signinModal = document.getElementById("signinModal");
var registerModal = document.getElementById("registerModal");
var signinBtn = document.getElementById("signin");
var registerBtn = document.getElementById("register");
var signinClose = document.getElementsByClassName("close")[0];
var registerClose = document.getElementsByClassName("close")[1];
var signupLink = document.getElementById("signupLink");
var signinLink = document.getElementById("signinLink");
// When the user clicks the Sign In button, open the Sign In modal 
signinBtn.onclick = function() {
  signinModal.style.display = "block";
}

// When the user clicks the Register button, open the Register modal 
registerBtn.onclick = function() {
  registerModal.style.display = "block";
}

// When the user clicks on the Sign In close button, close the Sign In modal
signinClose.onclick = function() {
  signinModal.style.display = "none";
}

// When the user clicks on the Register close button, close the Register modal
registerClose.onclick = function() {
  registerModal.style.display = "none";
}

// When the user clicks the Sign Up link, close the Sign In modal and open the Register modal
signupLink.onclick = function() {
  signinModal.style.display = "none";
  registerModal.style.display = "block";
}

// When the user clicks the Sign In link, close the Register modal and open the Sign In modal
signinLink.onclick = function() {
  registerModal.style.display = "none";
  signinModal.style.display = "block";
}

function sortItem(){  
  var selected = document.getElementById("mySelect");
  var selectedValue = selected.value;
  console.log("sortItem() called");
  fetch(`/select?selected=${selectedValue}`, { method: 'GET' })
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(data => {
    console.log('Response data:', data);

    var cardContainer = document.getElementById('item-container');
    cardContainer.innerHTML = ''; // Clear existing cards
  
    data.forEach(item => {
      var cardDiv = document.createElement('div');
      cardDiv.className = 'col-lg-4 col-md-6';
      cardDiv.onclick = function() { showMsg('Hello'); };
      cardDiv.innerHTML = `
        <div class="card citem">
          <img src="https://static.nike.com/a/images/t_default/awjogtdnqxniqqk0wpgf/air-max-270-shoes-nnTrqDGR.png" class="card-img-top" alt="...">
          <div class="card-body">
            <h3 class="card-title">${item.name}</h3>
            <p class="card-text">${item.description}</p>
            <a href="#" class="btn btn-outline-success">Buy Now</a>
          </div>
        </div>
      `;
      cardContainer.appendChild(cardDiv);
    });
  })
  .catch(error => {
    console.error('Error:', error);
  });
}
function showMsg(item) {
  alert(item);
}
// When the user clicks anywhere outside of the modals, close them
window.onclick = function(event) {
  if (event.target == signinModal) {
    signinModal.style.display = "none";
  }
  if (event.target == registerModal) {
    registerModal.style.display = "none";
  }
}