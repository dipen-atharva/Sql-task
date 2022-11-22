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
      t.integer('wp_post_id', 45);
      t.text('wp_post_meta_data', 500);
      t.string('applied_for', 100);
      t.string('first_name', 45);
      t.string('last_name', 45);
      t.string('email', 45);
      t.datetime('discarded_at', 6);
      t.string('created_at', 600);
      t.datetime('updated_at', 6);
      t.string('tittle', 45);
      t.string('emails', 45);
      t.text('address', 45);
      t.string('country', 45);
      t.string('mobilephone', 45);
      t.string('telephone', 45);
      t.string('skypeid', 45);
      t.string('linkedinid', 45);
      t.string('description', 45);
      t.string('agree_privacy_policy', 45);
      t.text('cover_letter', 45);
      t.text('application_mails', 1000);
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
    // console.log("+++++++++++++++++++++", postData)
    for (var post of postData) {
      // console.log(post.ID)
      knex2('wp_postmeta').where({
        post_id: post.ID
      }).select('*')
        .then((row) => {
          var result = new Map();
          row.map(function (element) {
            return result.set(element.meta_key, element.meta_value)
          })
          // console.log(row)
          console.log(result)

          var first_name = result.get('awsm_applicant_name').split(" ",1).toString();
          var last_name = result.get('awsm_applicant_name').split(" ").pop();
          return knex('can2')
            .select()
            .where({
              'wp_post_id': result.get('awsm_job_id'),
            })
            .then(function (rows, err) {
              if (rows.length === 0) {

                // no matching records found
                return knex('can2').insert({
                  wp_post_id: result.get('awsm_job_id'),
                  applied_for: result.get('awsm_apply_for'),
                  first_name: first_name,
                  last_name: last_name,
                  email: result.get('awsm_applicant_email'),
                  mobilephone: result.get('awsm_applicant_phone'),
                  cover_letter: result.get('awsm_applicant_letter'),
                  agree_privacy_policy:result.get('awsm_agree_privacy_policy'),
                  application_mails: result.get('awsm_application_mails'),

                  wp_post_meta_data: {
                    wp_post_id: result.get('awsm_job_id'),
                    applied_for: result.get('awsm_apply_for'),
                    first_name: first_name,
                    last_name: last_name,
                    email: result.get('awsm_applicant_email'),
                    mobilephone: result.get('awsm_applicant_phone'),
                    cover_letter: result.get('awsm_applicant_letter'),
                    agree_privacy_policy:result.get('awsm_agree_privacy_policy'),
                    application_mails: result.get('awsm_application_mails'),
                  }
                }).then(() => { return console.log("data added") })
              } else {
                throw err
              }
            })
            .catch((err) => {
              if (err) { throw err } else console.log("Duplicate data entry detected")
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

