function myFunction() {
  var txt;
  if (confirm("Press a button!")) {
    txt = "You pressed OK!";
  } else {
    txt = "You pressed Cancel!";
  }
  document.getElementById("demo").innerHTML = txt;
}

function processFormSubmission() {
  var first_name = document.getElementById("fname").value;
  var last_name = document.getElementById("lname").value;

  document.getElementById("form_fname").innerHTML = first_name;
  document.getElementById("form_lname").innerHTML = last_name;

  // do not submit the form
  return false;
}
