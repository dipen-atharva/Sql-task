const knex = require('knex')({
  client: 'mysql',
  connection: {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'Atharva@123',
    database: 'task-sql',
    multipleStatements: true
  }
});

const knex2 = require('knex')({
  client: 'mysql',
  connection: {
    host: "localhost",
    port: 3306,
    user: "root",
    password: "Atharva@123",
    database: "datadump",
    multipleStatements: true
  }
});

knex.schema.hasTable('can2').then(function (exists) {
  if (!exists) {
    return knex.schema.createTable('can2', function (t) {
      t.increments('id').primary();
      t.integer('wordpress_post_id', 45);
      t.string('first_name', 45);
      t.string('last_name', 45);
      t.string('email', 45);
      t.date('discarded_at', 6);
      t.date('created_at', 6);
      t.date('updated_at', 6);
      t.string('tittle', 45);
      t.string('emails', 45);
      t.text('address', 45);
      t.string('country', 45);
      t.string('mobilephone', 45);
      t.string('telephone', 45);
      t.string('skypeid', 45);
      t.string('linkedinid', 45);
      t.string('description', 45);
      t.text('cover_letter', 45);
      t.integer('status_code', 45);
      t.integer('preferrred_contact_method_code', 45);
      t.integer('initial_communication', 45);
      t.text('tech_stack_ids', 45);
      t.integer('source_code', 45);
      t.bigint('assignee_id', 45);
      t.bigint('reporter_id', 45);
      t.bigint('created_by_id', 45);
      t.bigint('updated_by_id', 45);
      t.bigint('company_id', 45);
    });
  }
});

knex2('wp_posts').where({
  post_type: "awsm_job_application"
}).select('ID')
  .then((postData) => {
    // console.log("+++++++++++++++++++++++++++++++", postData)
    for (var post of postData) {
      console.log(post.ID)
      knex2('wp_postmeta').where({
        post_id: post.ID
      }).select('*')
        .then((data) => {
          // console.log(data)
          var first_name = JSON.stringify(data[3].meta_value).replace(/['":,{}1]+/g, "").split(" ", 1);
          var last_name = JSON.stringify(data[3].meta_value).replace(/['":,{}1]+/g, "").split(" ").pop();

          return knex('can2')
            .select()
            .where({
              'wordpress_post_id': post.ID,
            })
            .then(function (rows, err) {
              if (rows.length === 0) {
                // no matching records found
                return knex('can2').insert({
                  wordpress_post_id : data[0].post_id,
                  first_name: first_name,
                  last_name: last_name,
                  email: data[4].meta_value,
                  mobilephone: data[5].meta_value,
                  cover_letter: data[6].meta_value,
                }).then(() => { return console.log("data added") })
              } else {
                throw err
              }
            })
            .catch(function (ex) {
              // you can find errors here.
            })
        })
        .catch(function (err) {
          console.error(err);
        });
    }
  })
  .catch(function (err) {
    console.error(err);
  });

