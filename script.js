document.addEventListener('DOMContentLoaded', function () {

  var urlParams = new URLSearchParams(window.location.search);
  var currentTheme = urlParams.get('theme');

  if (currentTheme === 'dark') {
    document.body.setAttribute('data-theme', 'dark');
    updateNavLinks('dark');
  } else {
    updateNavLinks('light');
  }

  setActiveNavigation();

  if (document.getElementById('caloriesPage')) {
    initCaloriesPage();
  }

  if (document.getElementById('analysisPage')) {
    initAnalysisPage();
  }

  if (document.getElementById('settingsPage')) {
    initSettingsPage();
  }

  if (document.getElementById('contactForm')) {
    initContactForm();
  }
});


function updateNavLinks(theme) {
  var navLinks = document.querySelectorAll('header nav a');
  for (var i = 0; i < navLinks.length; i++) {
    
    var baseHref = navLinks[i].getAttribute('href').split('?')[0];
    
    if (theme === 'dark') {
      navLinks[i].setAttribute('href', baseHref + '?theme=dark');
    } else {
      navLinks[i].setAttribute('href', baseHref);
    }
  }
}

function setActiveNavigation() {
  var currentPage = window.location.pathname.split('/').pop();

  if (currentPage === '') {
    currentPage = 'index.html';
  }

  var navLinks = document.querySelectorAll('header nav a');

  for (var i = 0; i < navLinks.length; i++) {
    
    var linkHref = navLinks[i].getAttribute('href').split('?')[0];
    
    if (linkHref === currentPage) {
      navLinks[i].classList.add('active');
    }
  }
}

function initCaloriesPage() {
  var foodDatabase = [
    ['Grilled Chicken Caesar Salad', 550, 15, 45, 35],
    ['Sheet Pan Chicken Fajitas (with veggies)', 350, 20, 30, 15],
    ['Chicken and Broccoli Quinoa Casserole', 450, 40, 35, 15],
    ['Teriyaki Chicken Thighs with Rice', 480, 45, 30, 18],
    ['Chicken Parmesan (Baked, not fried)', 420, 25, 38, 18],
    ['Chicken and Chorizo Ragu', 480, 30, 35, 22],
    ['Creamy Chicken and Asparagus Braise', 390, 10, 35, 20],
    ['Spaghetti Squash with Meat Sauce', 350, 25, 25, 18],
    ['Garlic Butter Steak Bites with Asparagus', 330, 5, 33, 20],
    ['Beef Noodle Stir-fry (with broccoli)', 500, 40, 32, 22],
    ['Lamb and Squash Tagine', 450, 35, 28, 20],
    ['Teriyaki Salmon Fillet with Veggies', 400, 15, 30, 22],
    ['Lemon-Garlic Shrimp and Grits', 380, 30, 25, 15],
    ['Sesame-Crusted Tuna with Miso Salad', 350, 10, 35, 18],
    ['Mediterranean Baked Haddock with Tomatoes', 280, 10, 30, 12],
    ['Chana Masala (Chickpea Curry) with Rice', 420, 60, 15, 12],
    ['Sweet Potato and Peanut Curry', 450, 50, 10, 22],
    ['Quinoa Chickpea Buddha Bowl', 400, 55, 15, 15],
    ['Spinach Artichoke Vegetarian Shepherds Pie', 320, 40, 12, 10],
    ['Shakshuka (Eggs in Tomato Sauce)', 300, 15, 18, 18]
  ];
  var mealTableBody = document.getElementById('mealTableBody');
  var selectedList = document.getElementById('selectedList');
  var totalsDisplay = document.getElementById('totals');
  var clearBtn = document.getElementById('clearSelected');
  var selectedMeals = [];

  function showMeals() {
    mealTableBody.innerHTML = '';

    for (var i = 0; i < foodDatabase.length; i++) {
      var meal = foodDatabase[i];
      var row = document.createElement('tr');

      row.innerHTML =
        '<td>' + meal[0] + '</td>' +
        '<td>' + meal[1] + '</td>' +
        '<td>' + meal[2] + '</td>' +
        '<td>' + meal[3] + '</td>' +
        '<td>' + meal[4] + '</td>' +
        '<td><button class="btn add-btn" data-number="' + i + '">Add</button></td>';

      mealTableBody.appendChild(row);
    }
  }

  function updateSelectedMeals() {
    selectedList.innerHTML = '';

    var totalCalories = 0;
    var totalCarbs = 0;
    var totalProtein = 0;
    var totalFat = 0;

    for (var i = 0; i < selectedMeals.length; i++) {
      var meal = selectedMeals[i];
      totalCalories += meal[1];
      totalCarbs += meal[2];
      totalProtein += meal[3];
      totalFat += meal[4];

      var item = document.createElement('li');
      item.innerHTML =
        '<span>' + meal[0] + '</span>' +
        '<button class="btn btn-danger remove-btn" data-number="' + i + '">Remove</button>';
      selectedList.appendChild(item);
    }

    totalsDisplay.innerHTML =
      '<strong>Total Calories:</strong> ' + totalCalories + ' kcal<br>' +
      '<strong>Total Carbs:</strong> ' + totalCarbs + ' g<br>' +
      '<strong>Total Protein:</strong> ' + totalProtein + ' g<br>' +
      '<strong>Total Fat:</strong> ' + totalFat + ' g';
  }

  mealTableBody.addEventListener('click', function (event) {
    if (event.target.classList.contains('add-btn')) {
      var mealNumber = Number(event.target.getAttribute('data-number'));
      selectedMeals.push(foodDatabase[mealNumber]);
      updateSelectedMeals();
    }
  });

  selectedList.addEventListener('click', function (event) {
    if (event.target.classList.contains('remove-btn')) {
      var mealNumber = Number(event.target.getAttribute('data-number'));
      selectedMeals.splice(mealNumber, 1);
      updateSelectedMeals();
    }
  });

  clearBtn.addEventListener('click', function () {
    selectedMeals = [];
    updateSelectedMeals();
  });

  showMeals();
  updateSelectedMeals();
}

function initAnalysisPage() {
  var form = document.getElementById('analysisForm');
  var resultsContainer = document.getElementById('analysisResults');

  form.addEventListener('submit', function (event) {
    event.preventDefault();

    var gender = form.gender.value;
    var age = Number(form.age.value);
    var height = Number(form.height.value);
    var weight = Number(form.weight.value);

    if (age <= 0 || height <= 0 || weight <= 0) {
      alert('Please enter valid numbers.');
      return;
    }

    var heightInMeters = height / 100;
    var bmi = weight / (heightInMeters * heightInMeters);
    var bmiClass = '';

    if (bmi < 18.5) {
      bmiClass = 'Underweight';
    } else if (bmi < 25) {
      bmiClass = 'Normal';
    } else if (bmi < 30) {
      bmiClass = 'Overweight';
    } else {
      bmiClass = 'Obese';
    }

    var minIdeal = 18.5 * heightInMeters * heightInMeters;
    var maxIdeal = 24.9 * heightInMeters * heightInMeters;
    var muscleMass;

    if (gender === 'Female') {
      muscleMass = weight * 0.36;
    } else {
      muscleMass = weight * 0.42;
    }

    var bodyFat;

    if (gender === 'Female') {
      bodyFat = 1.20 * bmi + 0.23 * age - 5.4;
    } else {
      bodyFat = 1.20 * bmi + 0.23 * age - 16.2;
    }

    resultsContainer.innerHTML = '';
    resultsContainer.appendChild(createResultCard('Your BMI', roundNumber(bmi), bmiClass));
    resultsContainer.appendChild(createResultCard('Ideal Weight Range', roundNumber(minIdeal) + ' - ' + roundNumber(maxIdeal) + ' kg', 'Based on BMI 18.5 to 24.9'));
    resultsContainer.appendChild(createResultCard('Estimated Muscle Mass', roundNumber(muscleMass) + ' kg', 'Approximate value'));
    resultsContainer.appendChild(createResultCard('Body Fat Percentage', roundNumber(bodyFat) + '%', 'Estimated percentage'));
  });
}

function roundNumber(number) {
  return Math.round(number * 10) / 10;
}

function createResultCard(title, value, description) {
  var div = document.createElement('div');
  var h4 = document.createElement('h4');
  var valueParagraph = document.createElement('p');
  var descriptionParagraph = document.createElement('p');

  div.className = 'result-card';
  h4.textContent = title;
  valueParagraph.innerHTML = '<strong>' + value + '</strong>';
  descriptionParagraph.textContent = description;
  descriptionParagraph.className = 'small-note';

  div.appendChild(h4);
  div.appendChild(valueParagraph);
  div.appendChild(descriptionParagraph);

  return div;
}

function initSettingsPage() {
  var form = document.getElementById('settingsForm');
  var themeSelect = document.getElementById('theme');


  var urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('theme') === 'dark') {
    themeSelect.value = 'dark';
  }

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    var selectedTheme = themeSelect.value;

    if (selectedTheme === 'dark') {
      document.body.setAttribute('data-theme', 'dark');
    } else {
      document.body.removeAttribute('data-theme');
    }

    
    var newUrl = window.location.pathname;
    if (selectedTheme === 'dark') {
      newUrl += '?theme=dark';
    }
    window.history.replaceState(null, '', newUrl);

    
    updateNavLinks(selectedTheme);

    alert('Theme changed successfully!');
  });
}

function initContactForm() {
  var form = document.getElementById('contactForm');

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    alert('Thank you for your message! We will get back to you soon.');
    form.reset();
  });
}
