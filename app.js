import express from 'express';
import bodyParser from "body-parser"
import 'dotenv/config';
import cors from 'cors';
import fileUpload from 'express-fileupload';
import path from 'path';
import fs from 'fs';
import {insert_data, getUsers, delete_user, getUser, updateUser, searchMail} from './connection.js';

const app = express();
const __dirname = path.resolve(path.dirname(''));

app.use(fileUpload());
app.use(cors());
app.use(bodyParser.urlencoded({extended:false}));
app.use(express.json());
app.use(express.static('pics'))

app.listen(process.env.PORT, () => {
    console.log(`server is running on ${process.env.PORT}`);
});

app.post('/insert-info',async(req, res) => {

  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const mob_pattern = /^\d{10}$/;
    const name = req.body.naam;
    const email = req.body.eml;
    const mob_num = req.body.num;
    const address = req.body.add;
    const role = req.body.role;
    const course = req.body.course;
    const feedback = req.body.msg;      
    if (!name) {
      res.send('Enter your full name');return;
    }
    if (!emailPattern.test(email)) {
      res.send('Enter valid email id'); return; 
    } 
    if (! mob_pattern.test(mob_num)) {
      res.send("Enter valid Mobile Number");return;  
    } 
    if (!address) {
      res.send('enter your address');return;
    }
    if (!role) {
      res.send('select your role');return;
    }
    if (!course) {
      res.send('select your course');  return;           
    }
    if (!feedback) {
      res.send('give us feedback');return;
    }
    if (!req.files) {      
      res.send("No files were uploaded.");return;
    }
     
    const file = req.files.pic;
    const filepath = __dirname +"/pics/" + email + '_' + file.name;
    const acctual_path = email + '_' + file.name;    

    file.mv(filepath, (err) => {
      if (err) {
         res.status(500).send(err);return;
      }        
    });
    const info = await insert_data(name, email, mob_num, address, role, course, feedback, acctual_path);
    if (info === 'created') {
       const users = await getUsers();
        res.send(
          `
           <!DOCTYPE html>
           <html lang="en">
           <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
               <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM" crossorigin="anonymous"></script>
              <title>Table</title>
           </head>
           <body>
          <div class="alert alert-warning alert-dismissible fade show" role="alert">
              <strong>${email}</strong> has been inserted successfully.
              <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
          </div>
          <div>
             <button type="submit" class=" btn btn-outline-info" onclick="window.location.href = 'http://127.0.0.1:5500/home.html';">Back to home page</button>
          </div>
          <table class="table table-striped table-dark " style="margin-top: 4px;">
          <thead>
            <tr>
              <th scope="col">NAME</th>
              <th scope="col">EMAIL ID</th>
              <th scope="col">MOBILE NUMBER</th>
              <th scope="col">ADDRESS</th>
              <th scope="col">ROLE</th>
              <th scope="col">COURSE</th>
              <th scope="col">FEEDBACK</th>
              <th scope="col">PICTURE</th>
              <th scope="col" colspan = "2">DELETE/UPDATE</th>
           </tr>
          </thead>
          <tbody>
              ${users.map( user => `
                <tr>
                  <td> ${ user.NAME }</td>
                  <td>${ user.EMAIL_ID }</td>
                  <td>${ user.MOBILE_NO }</td>
                  <td>${ user.ADDRESS }</td>
                  <td>${ user.ROLE }</td>
                  <td>${ user.IMPROVING_FIELD }</td>
                  <td>${ user.FEEDBACK }</td>
                  ${user.pic_path ? `
                  <td> <img src="/${user.pic_path}" alt="pic" width="70" height="70" style="border-radius:50%">
                 </td>` : `<td></td>`}
                  <td>
                    <form action = "http://localhost:3000/dlt-user/${user.EMAIL_ID}" method = "post">
                      <button type = "submit" class = "btn btn-danger btn-sm">Delete</button>
                    </form>    
                  </td>
                  <td>
                    <form action = "http://localhost:3000/update/${user.EMAIL_ID}" method = "get">
                      <button type = "submit" class = "btn btn-info btn-sm">Edit</button>
                    </form>    
                  </td>    
                </tr>
              `).join('')}
          </tbody>
        </table>
      </body>
    </html>
  `)}
});
           
app.get('/get-users', async(req, res) => {
  const users = await getUsers();
  res.send(
    `
    <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">

    <title>Table</title>
</head>
<body>
      <div>
        <button type="submit" class=" btn btn-outline-info" onclick="window.location.href = 'http://127.0.0.1:5500/home.html';">Back to home page</button>
      </div> 
    <table class="table table-striped table-dark" style="margin-top: 4px;">
        <thead>
          <tr>
            <th scope="col">NAME</th>
            <th scope="col">EMAIL ID</th>
            <th scope="col">MOBILE NUMBER</th>
            <th scope="col">ADDRESS</th>
            <th scope="col">ROLE</th>
            <th scope="col">COURSE</th>
            <th scope="col">FEEDBACK</th>
            <th scope="col">PICTURE</th>
            <th scope="col" colspan = "2">DELETE/UPDATE</th>
          </tr>
        </thead>
        <tbody>
        ${users.map( user => `
        <tr>
            <td> ${ user.NAME }</td>
            <td>${ user.EMAIL_ID }</td>
            <td>${ user.MOBILE_NO }</td>
            <td>${ user.ADDRESS }</td>
            <td>${ user.ROLE }</td>
            <td>${ user.IMPROVING_FIELD }</td>
            <td>${ user.FEEDBACK }</td>
            ${user.pic_path ? `
             <td> <img src="/${user.pic_path}" alt="pic" width="70" height="70" style="border-radius:50%">
            </td>` : `<td></td>`}
            <td>
               <form action = "http://localhost:3000/dlt-user/${user.EMAIL_ID}" method = "post">
                  <button type = "submit" class = "btn btn-danger btn-sm">Delete</button>
               </form>    
            </td>
            <td>
            <form action = "http://localhost:3000/update/${user.EMAIL_ID}" method = "get">
               <button type = "submit" class = "btn btn-info btn-sm">Edit</button>
            </form>    
         </td>    
          </tr>
        `).join('')}
        </tbody>
      </table>
      

</body>
</html>`
  );
});

app.post('/dlt-user/:email', async(req, res) =>{
  const email = req.params.email;
  const user  = await getUser(email);
  
  const filepath = __dirname +"/pics/" + user[0].pic_path;
  fs.unlink(filepath, (err) => {
    if (err) {
        console.error('Error while the file:', err);
    }})
  const dltData = await delete_user(email);
  if (dltData === 'deleted') {
    const users = await getUsers();
    res.send(
      `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
           <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM" crossorigin="anonymous"></script>
          <title>Table</title>
      </head>
      <body>
      <div class="alert alert-warning alert-dismissible fade show" role="alert">
      <strong>${email}</strong> has been deleted successfully.
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>
      <div>
        <button type="submit" class=" btn btn-outline-info" onclick="window.location.href = 'http://127.0.0.1:5500/home.html';">Back to home page</button>
      </div>
    <table class="table table-striped table-dark ">
        <thead>
          <tr>
            <th scope="col">NAME</th>
            <th scope="col">EMAIL ID</th>
            <th scope="col">MOBILE NUMBER</th>
            <th scope="col">ADDRESS</th>
            <th scope="col">ROLE</th>
            <th scope="col">COURSE</th>
            <th scope="col">FEEDBACK</th>
            <th scope="col">PICTURE</th>
            <th scope="col" colspan = "2">DELETE/UPDATE</th>
          </tr>
        </thead>
        <tbody>
        ${users.map( user => `
        <tr>
            <td> ${ user.NAME }</td>
            <td>${ user.EMAIL_ID }</td>
            <td>${ user.MOBILE_NO }</td>
            <td>${ user.ADDRESS }</td>
            <td>${ user.ROLE }</td>
            <td>${ user.IMPROVING_FIELD }</td>
            <td>${ user.FEEDBACK }</td>
            ${user.pic_path ? `
            <td> <img src="/${user.pic_path}" alt="pic" width="70" height="70" style="border-radius:50%">
           </td>` : `<td></td>`}
            <td>
               <form action = "http://localhost:3000/dlt-user/${ user.EMAIL_ID }" method = "post">
                  <button type = "submit" class = "btn btn-danger btn-sm">Delete</button>
               </form>    
            </td>
            <td>
            <form action = "http://localhost:3000/update/${ user.EMAIL_ID }" method = "get">
               <button type = "submit" class = "btn btn-info btn-sm">Edit</button>
            </form>    
         </td>   
          </tr>
        `).join('')}
        </tbody>
        </table>
  </body>
  </html>
      `
    );
  }
  else{
    res.send(dltData);
    
  }
});

app.get('/update/:email', async(req,res) => {
   const email = req.params.email;
   const user = await getUser(email);
   const role = ['student','teacher','job','other'];
   const selectedRole = user[0].ROLE;
   const course = ['Front-end Developer', 'Back-end Developer','Android App Developer','Software Engineering','Other'];
   const selectedCourse = user[0].IMPROVING_FIELD;
   
  res.send(`
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
      <title>Update Form</title>
  </head>
  <style>
  *{
    font-family: 'Times New Roman', Times, serif;
  }
  body{
    padding-top: 2%;
    color:black;
  }
  h2{
    text-align: center;
    margin-top: 2px;
  }
  #thanks{
    text-align: center;
    margin-top: 5px;
  }
  .row{
    margin-top: 5px;
  }
  .container{
    border: 2px solid black;
    height: 101%;
    width: 96%;
    background-color: lightblue;
  }
  #role{
      width: 100%;
      border-radius: 5px;
  }
  .btn{
    margin-left: 38%;
    margin-top:2% ;
  }
  #Info{
  margin-left: 45%;
  }
  </style>
  <body>
      <form action ="http://localhost:3000/submit-updated-info/${user[0].EMAIL_ID}" method ="post" enctype="multipart/form-data">
          <div class="row">
              <h2>UPDATE YOUR DETAILS</h2>
              <p id="thanks">Thank you for taking the time to help us to improve the platform</p>               
              <div class="col-md-4"></div>
                 <div class="col-md-4">
                      <div class="container">
                          <div class="col-lg-12">                             
                               <div class="col-mb-3">
                                  <label for="name" class="form-label">Name</label>
                                  <input type="text" id="name" class="form-control" value = "${user[0].NAME}" name="naam">
                              </div>
                              <div class="col-mb-3">
                                  <label for="email" class="form-label">Email</label>
                                  <input type="email" id="email" class="form-control" value = "${ user[0].EMAIL_ID }" name="eml">
                              </div>
                              <div class="col-mb-3">
                                  <label for="mbNum" class="form-label">Mobile Number</label>
                                  <input type="tel" id="mbNum" class="form-control" value = "${ user[0].MOBILE_NO }" name="num">
                           </div>
                            <div class="col-mb-3">
                                  <label for="address" class="form-label">Address</label>
                                  <input type="text" id="address" class="form-control" value = "${ user[0].ADDRESS }" name="add">
                              </div> 
                              <div class="col-mb-3">
                              <label for="option" class="form-label">Which option best describe your current role</label>
                              <select name="role" id="role" name="role" class="form-control">
                              ${
                                 role.map(element => 
                                  `<option name = "${element}" value = "${element}" ${element === selectedRole ? 'selected' : ''}>${element}</option>`
                                 ).join('')  
                              }
                              </select>
                              </div> 
                              <div class="col-mb-3" >
                                <p >Would you like to see improved ? </p>
                                ${
                                  course.map(crs =>
                                    `
                                    <input class ="form-check-input" type = "radio" name ="course"
                                    value = "${crs}" ${crs === selectedCourse ? 'checked' : ''}>
                                    <label class="form-check-label">${crs}</label><br>
                                    ` 
                                  ).join('')
                                }      
                                </div>
                                <div class="col-mb-3">                        
                                  <label for="feedback" class="form-label">Give us your feedback</label>
                                  <textarea  class="form-control" name = "msg" rows="5" placeholder="Enter your feedback here.... "
                                   id="feedback" name="feedback"> ${user[0].FEEDBACK}</textarea>
                                </div>
                                <div class="mb-3"> 
                                  <img src="/${user[0].pic_path}" name="pic" alt="pic" width="70" height="70" style="border-radius:50%">
                                </div> 
                                <div class="mb-3">
                                  <label for="formFileSm" class="form-label">Your pic</label>
                                  <input class="form-control form-control-sm"  id="formFileSm" name="pic" type="file" accept=".gif,.jpg,.jpeg,.png, .jfif">
                                </div>
                                <button type="submit" class="btn btn-outline-dark" >SUBMIT</button>
                     </div>
                </div>
         </div>
            <div class="col-md-4"></div>
        </div>
    </form>
   
</body>
</html>
  
    `);
});

app.post('/submit-updated-info/:email', async(req,res) => {
  // const email = req.body.eml;
     const email = req.params.email;
     const name = req.body.naam;   
      const mob_num = req.body.num;
      const address = req.body.add;
      const role = req.body.role;
      const course = req.body.course;
      const feedback = req.body.msg;
      if (!name) {
        res.send('Enter your full name');return;
       }
       if (!email) {
         res.send('Enter your Email'); return;
       }
       if (!mob_num) {
         res.send('require your number');return;
       }
       if (!address) {
         res.send('enter your address');return;
       }
       if (!role) {
         res.send('select your role');return;
       }
       if (!course) {
         res.send('select your course');  return;           
       }
        if (!feedback) {
         res.send('give us feedback');return;
      } 
      var acctual_path
      if(!req.files){
         const user  = await getUser(email);        
         acctual_path = user[0].pic_path;  
      }
      else{        
         const file = req.files.pic ;      
         const filepath = __dirname +"/pics/" + email + '_' + file.name;
         acctual_path = email + '_' + file.name;    

          file.mv(filepath, (err) => {
            if (err) {
              res.status(500).send(err);return;
            }        
          });      
      }
     
    
      const Updateduser = await updateUser(name, email, mob_num, address, role, course, feedback, acctual_path);
      if ( Updateduser=== 'updated') {
        const users = await getUsers();
        res.send(
          `
          <!DOCTYPE html>
          <html lang="en">
          <head>
              <meta charset="UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
               <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM" crossorigin="anonymous"></script>
              <title>Table</title>
          </head>
          <body>
      <div class="alert alert-warning alert-dismissible fade show" role="alert">
            <strong>${email}</strong> has been updated successfully.
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close">
            </button>
     </div>
      <div>
        <button type="submit" class=" btn btn-outline-info" onclick="window.location.href = 'http://127.0.0.1:5500/home.html';">Back to home page</button>
      </div>
<table class="table table-striped table-dark " style="margin-top: 4px;">
<thead>
  <tr>
    <th scope="col">NAME</th>
    <th scope="col">EMAIL ID</th>
    <th scope="col">MOBILE NUMBER</th>
    <th scope="col">ADDRESS</th>
    <th scope="col">ROLE</th>
    <th scope="col">COURSE</th>
    <th scope="col">FEEDBACK</th>
    <th scope="col">PICTURE</th>
    <th scope="col" colspan = "2">DELETE/UPDATE</th>
  </tr>
</thead>
<tbody>
${users.map( user => `
<tr>
    <td> ${ user.NAME }</td>
    <td>${ user.EMAIL_ID }</td>
    <td>${ user.MOBILE_NO }</td>
    <td>${ user.ADDRESS }</td>
    <td>${ user.ROLE }</td>
    <td>${ user.IMPROVING_FIELD }</td>
    <td>${ user.FEEDBACK }</td>
    ${user.pic_path ? `
             <td> <img src="/${user.pic_path}" alt="pic" width="70" height="70" style="border-radius:50%">
            </td>` : `<td></td>`}
    <td>
       <form action = "http://localhost:3000/dlt-user/${user.EMAIL_ID}" method = "post">
           <button type = "submit" class = "btn btn-danger btn-sm">Delete</button>
       </form>    
    </td>
            <td>
            <form action = "http://localhost:3000/update/${user.EMAIL_ID}" method = "get">
               <button type = "submit" class = "btn btn-info btn-sm">Edit</button>
            </form>    
         </td>    
          </tr>
        `).join('')}
        </tbody>
      </table>
</body>
</html>`       
 )}
});

app.post('/searching', async(req,res) =>{
  const email = req.body.email;
  const users = await searchMail(email);
  console.log(users);
  res.send(`
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
      <title>Table</title>
  </head>
  <body>
        <div>
          <button type="submit" class=" btn btn-outline-dark" onclick="window.location.href = 'http://127.0.0.1:5500/home.html';">Back to home page</button>
        </div> 
      <table class="table table-striped table-secondary" style="margin-top: 4px;">
          <thead>
            <tr>
              <th scope="col">NAME</th>
              <th scope="col">EMAIL ID</th>
              <th scope="col">MOBILE NUMBER</th>
              <th scope="col">ADDRESS</th>
              <th scope="col">ROLE</th>
              <th scope="col">COURSE</th>
              <th scope="col">FEEDBACK</th>
              <th scope="col">PICTURE</th>
              <th scope="col" colspan = "2">DELETE/UPDATE</th>
            </tr>
          </thead>
          <tbody>
          ${users.map( user => `
          <tr class = "table-primary">
              <td> ${ user.NAME }</td>
              <td>${ user.EMAIL_ID }</td>
              <td>${ user.MOBILE_NO }</td>
              <td>${ user.ADDRESS }</td>
              <td>${ user.ROLE }</td>
              <td>${ user.IMPROVING_FIELD }</td>
              <td>${ user.FEEDBACK }</td>
              ${user.pic_path ? `
               <td> <img src="/${user.pic_path}" alt="pic" width="70" height="70" style="border-radius:50%">
              </td>` : `<td></td>`}
              <td>
                 <form action = "http://localhost:3000/dlt-user/${user.EMAIL_ID}" method = "post">
                    <button type = "submit" class = "btn btn-danger btn-sm">Delete</button>
                 </form>    
              </td>
              <td>
              <form action = "http://localhost:3000/update/${user.EMAIL_ID}" method = "get">
                 <button type = "submit" class = "btn btn-info btn-sm">Edit</button>
              </form>    
           </td>    
            </tr>
          `).join('')}
             </tbody>
             </table>
       </body>
       </html>
  `)
})
