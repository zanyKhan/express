import mysql from 'mysql2/promise';
import 'dotenv/config';

const pool = mysql.createPool({
    host : process.env.HOST,
    user : process.env.USER,
    password : process.env.PASSWORD,
    database : process.env.DATABASE
});

console.log('connected');

export async function insert_data(name, email, mob_num, address, role, course, feedback,filepath) {
    let msg = ' ';
    try {
    const info = await pool.execute('call insert_info(?,?,?,?,?,?,?,?)', [name, email, mob_num, address, role, course, feedback,filepath])
        msg = 'created';
    } catch (error) {
        msg = error.sqlMessage;
    }
    return msg;
}

export async function getUsers() {
    let users= ' ';
    try {
       const [data,columns]  = await pool.query('select * from login_details order by CREATED_ON DESC')
       users = data;
    
    } catch (error) {
        users = error.sqlMessage;
    }
    return users;  
}

export async function delete_user(email) {
    let msg = ' ';
    try {
    const dltUser = await pool.query('delete from  login_details where EMAIL_ID = ?', [email]);
        msg = 'deleted';
    } catch (error) {
       msg = error.sqlMessage 
    }

    return msg;
}

export async function getUser(email){
    let msg = '';
    try {
        const [data,columns] = await pool.query('select * from login_details where EMAIL_ID = ?', [email]);
        msg = data;
    } catch (error) {
       msg = error.sqlMessage; 
    }
    return msg;
}

export async function updateUser(name, email, mob_num, address, role, course, feedback, pic) {
    let msg = ' ';
    try {
       const result = await pool.execute(' call update_user(?,?,?,?,?,?,?,?)',[name,mob_num,address,role,course,feedback, pic, email]);
       msg = 'updated';
         
    } catch (error) {
        msg = error.sqlMessage;
    }
    return msg;
}

export async function searchMail(serchBy) {
    let msg = '';
try {
    
    const [data,col] = await pool.query('call search_by_name_email(?);',[serchBy]);
    msg = data[0];
} catch (error) {
    msg = error.sqlMessage;
}
  return msg;  
}
