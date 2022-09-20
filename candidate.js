var mysql = require('mysql');

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Atharva@123",
    database: "task-sql",
    multipleStatements: true
  });

var con2 = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Atharva@123",
    database: "datadump",
    multipleStatements: true
  });
  
// connection  for  database 
var data2 ;
con2.connect(function(err) {

  if (err) throw err;
  console.log("Database(dumpdata) Connected Successfully!");
  var post_id = 12811;
  var sql2 = `SELECT * FROM datadump.wp_postmeta where post_id = ${post_id};`;

  con2.query(sql2, function (err, result2) {

    if (err) throw err;
    data2 = result2 ;
    // console.log(result2);

  });
  con.connect( function(err) {

    if (err) throw err;
    console.log("Database(task-sql) Connected! Successfully");

    var first_name = JSON.stringify(data2[3].meta_value).replace(/['":,{}1]+/g,"").split(" ",1);
    var last_name = JSON.stringify(data2[3].meta_value).replace(/['":,{}1]+/g,"").split(" ").pop();
    // first_name.split(" ",1);
    // var last_name =  data2[3].meta_value ;
    // last_name.split(" ",)
    var sql = `CREATE TABLE IF NOT EXISTS candidates (
      first_name varchar(45) DEFAULT NULL,
      last_name varchar(45) DEFAULT NULL,
      email varchar(45) DEFAULT NULL,
      consultancy_id bigint DEFAULT NULL,
      discarded_at datetime(6) DEFAULT NULL,
      created_at datetime(6) DEFAULT NULL,
      updated_at datetime(6) DEFAULT NULL,
      tittle varchar(45) DEFAULT NULL,
      emails varchar(45) DEFAULT NULL,
      address text DEFAULT NULL,
      country varchar(45) DEFAULT NULL,
      mobilephone varchar(45) DEFAULT NULL,
      telephone varchar(45) DEFAULT NULL,
      skypeid varchar(45) DEFAULT NULL,
      linkedinid varchar(45) DEFAULT NULL,
      description varchar(45) DEFAULT NULL COMMENT '		',
      cover_letter text,
      status_code int DEFAULT NULL,
      preferrred_contact_method_code int DEFAULT NULL,
      initial_communication int DEFAULT NULL,
      tech_stack_ids text,
      source_code int DEFAULT NULL,
      assignee_id bigint DEFAULT NULL,
      reporter_id bigint DEFAULT NULL,
      created_by_id bigint DEFAULT NULL,
      updated_by_id bigint DEFAULT NULL,
      company_id bigint DEFAULT NULL);
      INSERT INTO candidates (first_name,last_name,email,mobilephone,cover_letter) VALUES ("${first_name}","${last_name}","${data2[4].meta_value}","${data2[5].meta_value}","${data2[6].meta_value}")
      `;
    // var sqlentry = `INSERT INTO candidates (first_name,email,mobilephone) VALUES ("${data2[3].meta_value}","${data2[4].meta_value}","${data2[5].meta_value}")`;
    console.log(data2[0].meta_key +"-0--"+ data2[0].meta_value);
    console.log(data2[1].meta_key +"-1--"+ data2[1].meta_value);
    console.log(data2[2].meta_key +"-2--"+ data2[2].meta_value);
    console.log(data2[3].meta_key +"--3-"+ data2[3].meta_value);

    console.log(data2[4].meta_key +"-4--"+ data2[4].meta_value);
    console.log(data2[5].meta_key +"--5-"+ data2[5].meta_value);
    console.log(data2[6].meta_key +"--6-"+ data2[6].meta_value);
    console.log(data2[7].meta_key +"--7-"+ data2[7].meta_value);
    console.log(data2[8].meta_key +"--8-"+ data2[8].meta_value);
    con.query(sql, function (err, result) {
        
      if (err) throw err;
      // console.log(result);
    });
    // con.query(sql)
  });
});
    
    




    
    
    