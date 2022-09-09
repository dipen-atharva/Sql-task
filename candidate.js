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
  
// connection  for task-sql database 

con.connect(function(err) {
    if (err) throw err;
    console.log("Database(task-sql) Connected! Successfully");

    var sql = `CREATE TABLE IF NOT EXISTS candidates (
        first_name varchar(45) DEFAULT NULL,
        last_name varchar(45) DEFAULT NULL,
        email varchar(45) DEFAULT NULL,
        consultancy_id bigint NOT NULL,
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
        company_id bigint DEFAULT NULL,
        PRIMARY KEY (consultancy_id)
      );INSERT INTO candidates (consultancy_id) VALUES (12274)`;
    
    //   INSERT INTO dbo.TargetTable(field1, field2, field3)
    //   SELECT field1, field2, field3
    //     FROM SourceDatabase.dbo.SourceTable
    //     WHERE (some condition)
    con.query(sql, function (err, result) {

        if (err) throw err;
        // console.log("Table created");
        // console.log(result.warningCount);
        console.log(result);
    
    });
    con2.connect(function(err) {

        if (err) throw err;
        console.log("Database(dumpdata) Connected Successfully!");
    
        var sql2 = `Select meta_key from datadump.wp_postmeta ;`;
    
        con2.query(sql2, function (err, result) {
    
        if (err) throw err;
        // console.log("Table created");
        console.log(result);
    
        });
    });



});








  