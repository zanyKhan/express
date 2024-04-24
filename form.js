// function validation() {
//     const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
//     const pattern = /^\d{10}$/;

//     const name = document.querySelector("#name").value;
//     const email = document.querySelector("#email").value;
//     const mob_no = document.querySelector("#mbNum").value;
//     const address = document.querySelector("#address").value;
//    //-----------------------------------------
//     const radio1 = document.getElementById("front").checked;
//     const radio2 = document.getElementById("back").checked;
//     const radio3 = document.getElementById("android").checked;
//     const radio4 = document.getElementById("soft").checked;
//     const radio5 = document.getElementById("other").checked;

//     const feedback = document.querySelector("#feedback").value;

//     if (name == null || name == '') {
//         alert("Enter your proper Name");
//         return;
//        } 
//        if (email == null || email == '') {
//         alert("Enter your proper Email");
//         return;
//        }
//        if (! emailPattern.test(email)) {
//         alert("Enter valid email id");
//         return;  
//         } 
//        if (mob_no == null || mob_no == '') {
//         alert("Enter your Mobile Number");
//         return;
//        } 
//        if (! pattern.test(mob_no)) {
//         alert("Enter valid Mobile Number");
//         return;  
//         } 
//        if (address == null || address == '') {
//         alert("Enter your Address");
//         return;
//        } 

//        if (radio1) {
//         console.log("front");
//        }
//        else if(radio2){
//         console.log("back");
//        }
//        else if(radio3){
//         console.log("android");
//        }
//        else if(radio4){
//         console.log("soft");
//        }
//        else if(radio5){
//         console.log("other");
//        }
//        else{
//         alert("You have not selected your course");
//         return;
//        }
//     // ------------------------------------------------------
   
//       if (feedback == null || feedback == '') {
//        alert("Kindly give us some Feedback");
//        return;
//        } 

//      alert("congratulation You have logged in");

// }

// var roles = [
//     { "name": "student" },
//     { "name": "teacher" },
//     { "name": "job" },
//     { "name": "other" }   
// ];
  


//      var dropdown = document.createElement("role");
//      for (var i = 0; i < roles.length; i++) {
//          var opt = document.createElement("option");
//          opt.text = roles[i].name;
//          opt.value = roles[i].name;
//         //  if(roles[i].name=== selectedRole){
//         //  opt.selected = true;
//         //  }
//          dropdown.options.add(opt);
//      }
//      var container = document.getElementById("dropdown-container");
//      container.appendChild(dropdown);
   